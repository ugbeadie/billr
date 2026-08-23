(() => {
  // An "already injected" flag would outlive the listener it guards across an
  // extension reload, so replace the listener rather than bailing out.
  if (window.__trackrListener) {
    try {
      chrome.runtime.onMessage.removeListener(window.__trackrListener);
    } catch {}
  }

  const SEP = "·"; // middot: LinkedIn joins metadata with it

  const clean = (value) => String(value || "").replace(/\s+/g, " ").trim();

  // Descriptions are the one field where line breaks carry meaning.
  const cleanBlock = (value) =>
    String(value || "")
      .replace(/\r\n?/g, "\n")
      .replace(/[ \t\u00a0]+/g, " ")
      .replace(/[ \t]*\n[ \t]*/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

  const firstSegment = (value) => clean(String(value || "").split(SEP)[0]);

  // DOMParser gives an inert document: nothing loads or executes.
  const stripHtml = (html) => {
    if (!html) return "";
    try {
      const doc = new DOMParser().parseFromString(String(html), "text/html");
      if (!doc.body) return String(html);

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
    // innerText beats textContent so hidden boilerplate isn't picked up.
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

  // Every match, not just the first: LinkedIn puts a hidden <h1> ahead of the
  // real one and innerText is "" for it.
  const pick = (selectors) => {
    for (const selector of selectors || []) {
      for (const el of queryAll(selector)) {
        const text = nodeText(el);
        if (text) return text;
      }
    }
    return "";
  };

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

  // These labels must stay identical to the SelectItem values in
  // components/CreateJobModal.tsx - a <select> matches by exact string.

  // Hybrid is checked before Remote: hybrid postings routinely say "remote".
  const WORKPLACE = [
    [/\bhybrid\b/i, "hybrid"],
    [/\bremote\b/i, "remote"],
    [/\bon[\s-]?site\b/i, "onsite"],
    [/\bin[\s-]?office\b/i, "onsite"],
  ];

  // Only four are offered by the app, so near-synonyms fold into the closest.
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

  // schema.org JobPosting: far more stable than class names, so it backs up
  // every field and is what makes unknown job boards work.
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

  // Class-name-free backstop: find the heading, then read the surrounding
  // block's raw text, where the metadata and pills live whatever the classes.
  const cardTextAround = (title) => {
    let heading = null;
    for (const candidate of queryAll("h1, h2")) {
      const text = nodeText(candidate);
      if (!text) continue;
      // Not exact equality: headings carry badges the title selector trimmed.
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

    // Climb until the block holds both the metadata line and the pills; they
    // sit in siblings below the heading.
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

  // Indeed and Glassdoor put a screen-reader-only " - job post" in the heading.
  // It is clipped, not display:none, so innerText picks it up.
  const TITLE_NOISE = /\s*[-\u2013\u2014]\s*job\s*post(ing)?s?\s*$/i;

  const SITE_SUFFIX =
    /\s*[|\u2013\u2014-]\s*(linkedin|indeed(\.com)?|glassdoor|ziprecruiter|simplyhired|monster|dice|lever|greenhouse|workday)\s*$/i;

  // LinkedIn's public pages title themselves "Company hiring Role in Location".
  const HIRING = /^.*?\bhiring\b\s+(.+?)\s+\bin\b\s+\S.*$/i;

  // Page titles carry branding: LinkedIn renders "Role | Company | LinkedIn".
  const fromPageTitle = (value) => {
    let text = clean(value);

    let previous;
    do {
      previous = text;
      text = text.replace(SITE_SUFFIX, "");
    } while (text !== previous);

    const hiring = text.match(HIRING);
    if (hiring) return clean(hiring[1]);

    return text.includes("|") ? clean(text.split("|")[0]) : text;
  };

  const NOISE =
    /\b(ago|applicants?|promoted|viewed|alumni|responses?|reposted|easy apply|actively reviewing|be an early applicant)\b/i;

  // From "Company - Location - 2 weeks ago - 30 applicants", the first segment
  // that is neither the company nor noise is the location.
  const locationFromCard = (cardText, company) => {
    // Every middot line is a candidate: "Promoted by hirer" can come first.
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

    // The DOM wins where we have selectors: LinkedIn's collections view can
    // embed JSON-LD for a different posting than the one on screen.
    const prefer = (key, fallbackValue, generic) =>
      (site && pick(site[key])) || fallbackValue || pick(generic);

    // Selectors, JSON-LD and a real <h1> name the job; page titles don't.
    const directTitle =
      (site && pick(site.position)) || jsonLd.position || pick(["h1"]);

    const position = clean(
      String(
        directTitle ||
          fromPageTitle(
            pick(['meta[property="og:title"]']) || document.title,
          ),
      ).replace(TITLE_NOISE, ""),
    );

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

    // On a recognised site, falling back to <main>/<body> would paste the whole
    // page chrome into the field.
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
      // Always answer: silence strands the popup until its timeout.
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
