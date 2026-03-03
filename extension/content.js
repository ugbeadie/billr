chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractJob") {
    const hostname = window.location.hostname;

    let position = "";
    let company = "";
    let location = "";
    let description = "";

    // LINKEDIN
    if (hostname.includes("linkedin.com")) {
      position =
        document.querySelector(".top-card-layout__title")?.innerText ||
        document.querySelector("h1")?.innerText ||
        "";

      company =
        document.querySelector(".topcard__org-name-link")?.innerText || "";

      location =
        document.querySelector(".topcard__flavor--bullet")?.innerText || "";

      description =
        document.querySelector(".show-more-less-html__markup")?.innerText || "";
    }

    // INDEED
    else if (hostname.includes("indeed.com")) {
      position = document.querySelector("h1")?.innerText || "";

      company =
        document.querySelector('[data-testid="company-name"]')?.innerText || "";

      location =
        document.querySelector('[data-testid="job-location"]')?.innerText || "";

      description =
        document.querySelector("#jobDescriptionText")?.innerText || "";
    }

    // FALLBACK (generic sites)
    else {
      position = document.querySelector("h1")?.innerText || document.title;

      company =
        document.querySelector('[class*="company"]')?.innerText ||
        "Unknown Company";

      location = document.querySelector('[class*="location"]')?.innerText || "";

      description =
        document.querySelector("article")?.innerText ||
        document.body.innerText.slice(0, 2000);
    }

    sendResponse({
      position,
      company,
      location,
      description,
      url: window.location.href,
    });
  }
});
