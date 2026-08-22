(() => {
  // popup.js re-injects this file when a tab has no live listener. A plain
  // "already injected" flag would survive an extension reload while the
  // listener it guards does not, so drop any previous listener and register a
  // live one instead of bailing out.
  if (window.__trackrListener) {
    try {
      chrome.runtime.onMessage.removeListener(window.__trackrListener);
    } catch {}
  }

  const SEP = "·"; // middot: LinkedIn joins metadata with it

  const clean = (value) => String(value || "").replace(/\s+/g, " ").trim();

  // Like clean(), but keeps paragraph structure. Descriptions are the one field
  // where line breaks carry meaning, and collapsing them leaves the app with a
  // single unreadable wall of text it cannot re-break.
  const cleanBlock = (value) =>
    String(value || "")
      .replace(/\r\n?/g, "\n")
      .replace(/[ \t\u00a0]+/g, " ")
      .replace(/[ \t]*\n[ \t]*/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

  // "Lagos, Nigeria - 2 weeks ago - 100 applicants" -> "Lagos, Nigeria"
  const firstSegment = (value) => clean(String(value || "").split(SEP)[0]);

  // JSON-LD descriptions are usually HTML. DOMParser gives an inert document,
  // so nothing loads or executes while we pull the text out.
  const stripHtml = (html) => {
    if (!html) return "";
    try {
      const doc = new DOMParser().parseFromString(String(html), "text/html");
      if (!doc.body) return String(html);

      // textContent alone would run every block together; re-introduce the
      // breaks the markup implied before flattening.
      doc.body.querySelectorAll("br").forEach((br) => {
        br.replaceWith("\n");
      });
      doc.body
        .querySelectorAll("p, div, li, tr, h1, h2, h3, h4, h5, h6")
        .forEach((block) => {
          block.append("\n");
        });

      return doc.body.textContent || "";
    } catch {
      return String(html);
    }
  };

  const nodeText = (el) => {
    // .content covers <meta>; innerText deliberately beats textContent so
    // hidden boilerplate isn't mistaken for real content.
    const raw = el.content !== undefined ? el.content : el.innerText;
    return clean(raw !== undefined ? raw : el.textContent);
  };

  const queryAll = (selector) => {
    try {
      return document.querySelectorAll(selector);
    } catch {
      return [];
    }
  };

  // Reads every match, not just the first: pages like LinkedIn put a
  // screen-reader-hidden <h1> ahead of the real one, and innerText is "" for a
  // hidden element, so first-match-wins silently yields nothing.
  const pick = (selectors) => {
    for (const selector of selectors || []) {
      for (const el of queryAll(selector)) {
        const text = nodeText(el);
        if (text) return text;
      }
    }
    return "";
  };

  // Same walk as pick(), but keeps the newlines innerText already provides.
  const pickBlock = (selectors) => {
    for (const selector of selectors || []) {
      for (const el of queryAll(selector)) {
        const raw =
          el.content !== undefined
            ? el.content
            : el.innerText !== undefined
              ? el.innerText
              : el.textContent;
        const text = cleanBlock(raw);
        if (text) return text;
      }
    }
    return "";
  };

  // Every match joined - used for metadata pills, where the value we want may
  // be in any one of them.
  const pickAll = (selectors) => {
    const out = [];
    for (const selector of selectors || []) {
      for (const el of queryAll(selector)) {
        const text = nodeText(el);
        if (text) out.push(text);
      }
    }
    return out.join(" " + SEP + " ");
  };

  // Labels below are the exact values the app's own selects store - see the
  // SelectItem lists in components/CreateJobModal.tsx. A <select> matches its
  // value by exact string, so emitting "Full-time" here would leave the field
  // showing the placeholder when the job is opened in the app.

  // Hybrid is checked before Remote: hybrid postings routinely say "remote".
  const WORKPLACE = [
    [/\bhybrid\b/i, "hybrid"],
    [/\bremote\b/i, "remote"],
    [/\bon[\s-]?site\b/i, "onsite"],
    [/\bin[\s-]?office\b/i, "onsite"],
  ];

  // The app offers only these four. Near-synonyms are folded into the closest
  // one rather than dropped, so the signal survives the round trip.
  const EMPLOYMENT = [
    [/full[\s-]?time/i, "full-time"],
    [/part[\s-]?time/i, "part-time"],
    [/\bintern(ship)?\b/i, "internship"],
    [/\bapprentice(ship)?\b/i, "internship"],
    [/\bcontract(or)?\b/i, "contract"],
    [/\bfreelance\b/i, "contract"],
    [/\btemporary\b/i, "contract"],
  ];

  const firstMatch = (haystack, table) => {
    const text = String(haystack || "");
    for (const [pattern, label] of table) {
      if (pattern.test(text)) return label;
    }
    return "";
  };

  // schema.org uses FULL_TIME / PART_TIME / CONTRACTOR enums.
  const normalizeEmployment = (value) => {
    const raw = Array.isArray(value) ? value.join(" ") : String(value || "");
    return firstMatch(raw.replace(/_/g, " "), EMPLOYMENT);
  };

  // Currency symbols kept as escapes so this file stays pure ASCII.
  const SALARY_RE = new RegExp(
    "(?:[\\u0024\\u00a3\\u20ac\\u20a6\\u00a5]|\\b(?:USD|EUR|GBP|NGN|CAD|AUD|INR)\\b)" +
      "\\s?\\d[\\d,.]*(?:\\s?[kK])?" +
      "(?:\\s?(?:-|\\u2013|\\u2014|to)\\s?[\\u0024\\u00a3\\u20ac\\u20a6\\u00a5]?\\d[\\d,.]*(?:\\s?[kK])?)?" +
      "(?:\\s?/\\s?(?:yr|year|hr|hour|mo|month|wk|week))?",
    "i",
  );

  const UNIT_SUFFIX = {
    year: "/yr",
    month: "/mo",
    week: "/wk",
    day: "/day",
    hour: "/hr",
  };

  const salaryFromJsonLd = (item) => {
    const base = item.baseSalary;
    if (!base || typeof base !== "object") return "";

    const value = base.value || {};
    const currency = base.currency || value.currency || "";
    const min = value.minValue != null ? value.minValue : value.value;
    const max = value.maxValue;
    if (min == null && max == null) return "";

    const format = (amount) => {
      const number = Number(amount);
      return Number.isFinite(number) ? number.toLocaleString("en-US") : "";
    };

    const range =
      min != null && max != null && String(min) !== String(max)
        ? `${format(min)} - ${format(max)}`
        : format(min != null ? min : max);

    const suffix = UNIT_SUFFIX[String(value.unitText || "").toLowerCase()] || "";
    return clean(`${currency} ${range}${suffix}`);
  };

  // Most job boards embed a schema.org JobPosting. It's far more stable than
  // scraping class names, so it backs up every field.
  const fromJsonLd = () => {
    for (const node of queryAll('script[type="application/ld+json"]')) {
      let parsed;
      try {
        parsed = JSON.parse(node.textContent);
      } catch {
        continue;
      }

      const queue = Array.isArray(parsed) ? parsed.slice() : [parsed];

      while (queue.length) {
        const item = queue.shift();
        if (!item || typeof item !== "object") continue;

        if (Array.isArray(item["@graph"])) queue.push(...item["@graph"]);

        const type = item["@type"];
        const isJob =
          type === "JobPosting" ||
          (Array.isArray(type) && type.includes("JobPosting"));
        if (!isJob) continue;

        const org = item.hiringOrganization;
        const place = Array.isArray(item.jobLocation)
          ? item.jobLocation[0]
          : item.jobLocation;
        const address = place && place.address;
        const remote = /TELECOMMUTE/i.test(String(item.jobLocationType || ""));

        return {
          position: clean(item.title),
          company: clean(typeof org === "string" ? org : org && org.name),
          location: clean(
            [
              address && address.addressLocality,
              address && address.addressRegion,
              address && address.addressCountry,
            ]
              .filter(Boolean)
              .map((part) => (typeof part === "string" ? part : part.name))
              .join(", "),
          ),
          description: cleanBlock(stripHtml(item.description)),
          jobType: normalizeEmployment(item.employmentType),
          jobMode: remote ? "remote" : "",
          salary: salaryFromJsonLd(item),
        };
      }
    }

    return null;
  };

  // Class names on LinkedIn churn constantly. As a backstop, locate the heading
  // that produced the title and read the surrounding block's raw text - the
  // company, location, posted date and pills all live there regardless of what
  // the classes are called this week.
  const cardTextAround = (title) => {
    let heading = null;
    for (const candidate of queryAll("h1, h2")) {
      const text = nodeText(candidate);
      if (!text) continue;
      // Exact equality is too strict: the heading often carries a verified
      // badge or trailing markup that the title selector trimmed off.
      if (
        !title ||
        text === title ||
        title.startsWith(text) ||
        text.startsWith(title)
      ) {
        heading = candidate;
        break;
      }
    }
    if (!heading) return "";

    // Keep climbing until the block holds BOTH the metadata line and the
    // type/mode pills - they sit in sibling containers below the heading, so
    // stopping at the first ancestor bigger than the title misses them.
    let node = heading;
    let best = "";
    for (let depth = 0; depth < 8 && node.parentElement; depth++) {
      node = node.parentElement;
      const text = node.innerText || "";
      // Past this size we've climbed out of the job pane into the results list.
      if (text.length > 2500) break;
      best = text;

      const hasMeta = text.includes(SEP);
      const hasPill =
        EMPLOYMENT.some(([pattern]) => pattern.test(text)) ||
        WORKPLACE.some(([pattern]) => pattern.test(text));
      if (hasMeta && hasPill) return text;
    }
    return best;
  };

  const NOISE =
    /\b(ago|applicants?|promoted|viewed|alumni|responses?|reposted|easy apply|actively reviewing|be an early applicant)\b/i;

  // The metadata line reads "Company - Location - 2 weeks ago - 30 applicants".
  // Drop the company and the noise and the first survivor is the location.
  const locationFromCard = (cardText, company) => {
    // Every middot line is a candidate, not just the first: "Promoted by hirer
    // - No response insights" can precede the line that holds the location.
    const lines = String(cardText || "")
      .split("\n")
      .map(clean)
      .filter((candidate) => candidate.includes(SEP));

    for (const line of lines) {
      for (const part of line.split(SEP).map(clean)) {
        if (!part) continue;
        if (company && part.toLowerCase().includes(company.toLowerCase()))
          continue;
        if (NOISE.test(part)) continue;
        if (EMPLOYMENT.some(([pattern]) => pattern.test(part))) continue;
        // "Remote" alone is a work mode, but "Lagos, Nigeria (Remote)" is a place.
        if (
          WORKPLACE.some(([pattern]) => pattern.test(part)) &&
          !part.includes(",")
        )
          continue;
        if (/^\d/.test(part) || part.length > 80) continue;
        return part;
      }
    }
    return "";
  };

  const SITES = [
    {
      match: /linkedin\./,
      position: [
        ".job-details-jobs-unified-top-card__job-title h1",
        ".job-details-jobs-unified-top-card__job-title",
        ".jobs-unified-top-card__job-title",
        ".top-card-layout__title",
        "h1",
      ],
      company: [
        ".job-details-jobs-unified-top-card__company-name a",
        ".job-details-jobs-unified-top-card__company-name",
        ".jobs-unified-top-card__company-name",
        ".topcard__org-name-link",
        'a[href*="/company/"]',
      ],
      location: [
        ".job-details-jobs-unified-top-card__primary-description-container .tvm__text",
        ".job-details-jobs-unified-top-card__primary-description-container",
        ".job-details-jobs-unified-top-card__bullet",
        ".jobs-unified-top-card__bullet",
        ".topcard__flavor--bullet",
      ],
      description: [
        "#job-details",
        ".jobs-description__content",
        ".jobs-description-content__text",
        ".jobs-box__html-content",
        ".show-more-less-html__markup",
        // Catch-alls for when LinkedIn renames the specific classes above.
        '[class*="jobs-description__content"]',
        '[class*="jobs-description"]',
        '[class*="jobs-box__html-content"]',
      ],
      insights: [
        ".job-details-jobs-unified-top-card__job-insight",
        ".job-details-fit-level-preferences",
        ".jobs-unified-top-card__job-insight",
        ".description__job-criteria-text",
      ],
    },
    {
      match: /indeed\./,
      position: [
        '[data-testid="jobsearch-JobInfoHeader-title"]',
        "h1.jobsearch-JobInfoHeader-title",
        "h1",
      ],
      company: [
        '[data-testid="inlineHeader-companyName"]',
        '[data-testid="company-name"]',
        "[data-company-name]",
      ],
      location: [
        '[data-testid="inlineHeader-companyLocation"]',
        '[data-testid="job-location"]',
      ],
      description: ["#jobDescriptionText"],
      insights: [
        '[data-testid="jobsearch-OtherJobDetailsContainer"]',
        "#salaryInfoAndJobType",
      ],
    },
    {
      match: /glassdoor\./,
      position: ['[data-test="job-title"]', "h1"],
      company: ['[data-test="employer-name"]', '[class*="EmployerProfile"] a'],
      location: ['[data-test="location"]'],
      description: [
        '[class*="JobDetails_jobDescription"]',
        "#JobDescriptionContainer",
      ],
      insights: ['[data-test="detailSalary"]', '[class*="JobDetails_jobType"]'],
    },
  ];

  const extractJob = () => {
    const site = SITES.find((entry) => entry.match.test(location.hostname));
    const jsonLd = fromJsonLd() || {};

    // Curated selectors describe the pane actually on screen. LinkedIn's job
    // collections view can embed JSON-LD for a different posting than the one
    // displayed, so the DOM wins wherever we have selectors for the host.
    const prefer = (key, fallbackValue, generic) =>
      (site && pick(site[key])) || fallbackValue || pick(generic);

    const position =
      prefer("position", jsonLd.position, ['meta[property="og:title"]', "h1"]) ||
      clean(document.title);

    const company = prefer("company", jsonLd.company, [
      'meta[property="og:site_name"]',
      '[class*="company" i]',
      '[class*="employer" i]',
    ]);

    const cardText = cardTextAround(position);

    const jobLocation =
      firstSegment(
        prefer("location", jsonLd.location, [
          '[class*="location" i]',
          '[data-testid*="location" i]',
        ]),
      ) || locationFromCard(cardText, company);

    // On a recognised job site an empty description means our selectors missed.
    // Falling back to <main>/<body> there would paste the entire site chrome
    // into the field, so only do that on unrecognised pages.
    const description = site
      ? pickBlock(site.description) || jsonLd.description || ""
      : jsonLd.description ||
        pickBlock(['meta[property="og:description"]', "article", "main"]) ||
        cleanBlock(document.body && document.body.innerText);

    const insights = site ? pickAll(site.insights) : "";

    const jobType =
      jsonLd.jobType ||
      firstMatch(insights, EMPLOYMENT) ||
      firstMatch(cardText, EMPLOYMENT) ||
      "";

    const jobMode =
      jsonLd.jobMode ||
      firstMatch(insights, WORKPLACE) ||
      firstMatch(cardText, WORKPLACE) ||
      firstMatch(jobLocation, WORKPLACE) ||
      "";

    const salaryMatch = SALARY_RE.exec(cardText || "");
    const salary = jsonLd.salary || (salaryMatch ? clean(salaryMatch[0]) : "");

    return {
      position,
      company,
      location: jobLocation,
      description: String(description).slice(0, 5000),
      salary,
      jobType,
      jobMode,
      url: location.href,
    };
  };

  const onMessage = (request, sender, sendResponse) => {
    if (!request || request.action !== "extractJob") return;

    try {
      sendResponse(extractJob());
    } catch {
      // Always answer - a silent listener strands the popup for 2s and then
      // shows the manual-entry fallback for no reason.
      sendResponse({
        position: "",
        company: "",
        location: "",
        description: "",
        salary: "",
        jobType: "",
        jobMode: "",
        url: location.href,
      });
    }

    return false;
  };

  window.__trackrListener = onMessage;
  chrome.runtime.onMessage.addListener(onMessage);
})();
