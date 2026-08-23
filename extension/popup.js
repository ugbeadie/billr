const API_ORIGINS = {
  local: "http://localhost:3000",
  live: "https://trackr.ugbeadie.com",
};

// Switch to .local to develop against `pnpm dev`. Both origins must stay in
// manifest.json host_permissions or the fetch is blocked.
const API_BASE = API_ORIGINS.live;

const DEFAULT_COLUMN_KEY = "defaultColumnId";
const SCREENS = [
  "loadingScreen",
  "loginScreen",
  "previewScreen",
  "editScreen",
  "settingsScreen",
];

let scrapedData = null;
let userColumns = [];
let boardId = null;
let screenBeforeSettings = "previewScreen";

const $ = (id) => document.getElementById(id);

function showScreen(id) {
  SCREENS.forEach((name) => $(name).classList.toggle("hidden", name !== id));
}

/* ---------------------------------------------------------------- storage */

// The extension context can be invalidated mid-flight, so these always resolve.
function readDefaultColumnId() {
  return new Promise((resolve) => {
    try {
      chrome.storage.sync.get([DEFAULT_COLUMN_KEY], (result) => {
        if (chrome.runtime.lastError) return resolve(null);
        resolve((result && result[DEFAULT_COLUMN_KEY]) || null);
      });
    } catch {
      resolve(null);
    }
  });
}

function writeDefaultColumnId(id) {
  return new Promise((resolve) => {
    try {
      chrome.storage.sync.set({ [DEFAULT_COLUMN_KEY]: id }, () => {
        void chrome.runtime.lastError;
        resolve();
      });
    } catch {
      resolve();
    }
  });
}

/* ---------------------------------------------------------------- columns */

// Falls back to Applied, matching the server, so the two never disagree.
function resolveDefaultColumn(storedId) {
  return (
    userColumns.find((col) => col.id === storedId) ||
    userColumns.find(
      (col) => String(col.name || "").trim().toLowerCase() === "applied",
    ) ||
    userColumns[0] ||
    null
  );
}

function fillColumnSelect(select, selectedId) {
  select.innerHTML = "";

  userColumns.forEach((col) => {
    const option = document.createElement("option");
    option.value = col.id;
    option.textContent = col.name;
    select.appendChild(option);
  });

  if (selectedId) select.value = selectedId;
}

// dataset.label keeps the text restorable after a failed save.
function updateSaveLabel() {
  const selected = userColumns.find((col) => col.id === $("columnInput").value);
  const button = $("quickSaveBtn");

  button.textContent = selected ? `Save to ${selected.name}` : "Save";
  button.dataset.label = button.textContent;
}

/* ------------------------------------------------------------------- init */

async function init() {
  let storedDefault = null;

  try {
    const [res, stored] = await Promise.all([
      fetch(`${API_BASE}/api/extension/user-data`, {
        credentials: "include",
        signal: AbortSignal.timeout(10000),
      }),
      readDefaultColumnId(),
    ]);

    storedDefault = stored;

    if (res.status === 401) {
      showScreen("loginScreen");
      return;
    }

    const data = await res.json();
    userColumns = data.columns || [];
    boardId = data.boardId;
  } catch {
    showScreen("loginScreen");
    return;
  }

  const fallback = resolveDefaultColumn(storedDefault);

  fillColumnSelect($("columnInput"), fallback && fallback.id);
  fillColumnSelect($("defaultColumnInput"), fallback && fallback.id);
  updateSaveLabel();

  $("defaultColumnInput").classList.toggle("hidden", userColumns.length === 0);
  $("settingsEmpty").classList.toggle("hidden", userColumns.length > 0);

  // Scraping must never block rendering; fillForm degrades to empty fields.
  try {
    await scrapePage();
  } catch {
    fillForm(null);
  }

  showScreen("previewScreen");
}

/* ---------------------------------------------------------------- scraping */

async function scrapePage() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!tab?.id) {
    fillForm(null);
    return;
  }

  let response = await requestJobData(tab.id);

  // Tabs open before install have no content script; inject it on demand.
  if (!response) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
      });
      response = await requestJobData(tab.id);
    } catch {
      response = null;
    }
  }

  fillForm(response);
}

function requestJobData(tabId) {
  return new Promise((resolve) => {
    let settled = false;

    const done = (value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(value);
    };

    // A content script that never answers must not strand us on the spinner.
    const timer = setTimeout(() => done(null), 2000);

    try {
      chrome.tabs.sendMessage(tabId, { action: "extractJob" }, (response) => {
        if (chrome.runtime.lastError) {
          done(null);
          return;
        }
        done(response || null);
      });
    } catch {
      done(null);
    }
  });
}

// An unrecognised scrape falls back to the empty option, not a silent no-op.
function setSelectValue(select, value) {
  const wanted = String(value || "").toLowerCase();
  const match = Array.from(select.options).find(
    (option) => option.value.toLowerCase() === wanted,
  );
  select.value = match ? match.value : "";
}

function fillForm(data) {
  // Right-click the popup > Inspect to see what was actually scraped.
  console.debug("[Trackr] scraped:", data);

  scrapedData = {
    company: data?.company || "",
    position: data?.position || "",
    location: data?.location || "",
    description: data?.description || "",
    salary: data?.salary || "",
    jobType: data?.jobType || "",
    jobMode: data?.jobMode || "",
    url: data?.url || "",
  };

  const found = Boolean(scrapedData.company || scrapedData.position);
  const banner = $("previewBanner");

  banner.className = found ? "banner banner-good" : "banner banner-warn";
  banner.querySelector(".banner-title").textContent = found
    ? "Job found"
    : "Couldn't read this page";
  banner.querySelector(".banner-sub").textContent = found
    ? "One-click save to your board"
    : "Tap the pencil to fill it in yourself";

  $("previewCompany").textContent = scrapedData.company || "Unknown company";
  $("previewPosition").textContent = scrapedData.position || "No title found";

  $("companyInput").value = scrapedData.company;
  $("positionInput").value = scrapedData.position;
  $("locationInput").value = scrapedData.location;
  $("descriptionInput").value = scrapedData.description;
  $("salaryInput").value = scrapedData.salary;
  $("urlInput").value = scrapedData.url;

  setSelectValue($("jobTypeInput"), scrapedData.jobType);
  setSelectValue($("jobModeInput"), scrapedData.jobMode);
}

/* --------------------------------------------------------------- feedback */

function showToast(message, type = "success") {
  const toast = $("toast");

  toast.textContent = message;
  toast.style.background = type === "error" ? "#dc2626" : "#111827";
  toast.classList.remove("hidden");
  toast.classList.add("show");

  setTimeout(() => toast.classList.remove("show"), 2500);
}

const SAVE_BUTTONS = ["quickSaveBtn", "finalSaveBtn"];

function showSavingState() {
  SAVE_BUTTONS.forEach((id) => {
    const button = $(id);
    if (!button.dataset.label) button.dataset.label = button.textContent;
    button.textContent = "Saving...";
    button.disabled = true;
  });
}

// Every failure path calls this, or a retry inserts the same job twice.
function resetSavingState() {
  SAVE_BUTTONS.forEach((id) => {
    const button = $(id);
    if (button.dataset.label) button.textContent = button.dataset.label;
    button.disabled = false;
  });
}

/* ----------------------------------------------------------------- saving */

async function saveJob(data) {
  showSavingState();

  try {
    const res = await fetch(`${API_BASE}/api/extension/create-job`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.status === 401) {
      showToast("Please login to Trackr", "error");
      resetSavingState();
      return;
    }

    if (!res.ok) {
      showToast("Failed to save job", "error");
      resetSavingState();
      return;
    }

    // Report where the server actually put it, not the local selection.
    const result = await res.json().catch(() => ({}));
    const columnName =
      result.columnName ||
      userColumns.find((col) => col.id === data.columnId)?.name ||
      "your board";

    showToast(`Saved to ${columnName}`);

    setTimeout(() => window.close(), 1200);
  } catch {
    showToast("Network error", "error");
    resetSavingState();
  }
}

function collectFormData() {
  return {
    ...scrapedData,
    boardId,
    columnId: $("columnInput").value,
    company: $("companyInput").value,
    position: $("positionInput").value,
    salary: $("salaryInput").value,
    jobType: $("jobTypeInput").value,
    jobMode: $("jobModeInput").value,
    location: $("locationInput").value,
    description: $("descriptionInput").value,
    url: $("urlInput").value,
  };
}

/* ------------------------------------------------------------------ wiring */

$("editBtn").onclick = () => showScreen("editScreen");
$("backBtn").onclick = () => showScreen("previewScreen");

$("settingsBtn").onclick = () => {
  screenBeforeSettings = SCREENS.find(
    (name) => name !== "settingsScreen" && !$(name).classList.contains("hidden"),
  ) || "previewScreen";
  showScreen("settingsScreen");
};

$("settingsBackBtn").onclick = () => showScreen(screenBeforeSettings);

$("dashboardBtn").onclick = () => {
  chrome.tabs.create({ url: `${API_BASE}/dashboard` });
};

$("showMoreBtn").onclick = () => {
  const expanded = $("showMoreBtn").getAttribute("aria-expanded") === "true";

  $("showMoreBtn").setAttribute("aria-expanded", String(!expanded));
  $("moreFields").classList.toggle("hidden", expanded);
  $("showMoreLabel").textContent = expanded ? "Show more" : "Show less";
};

$("columnInput").onchange = updateSaveLabel;

$("defaultColumnInput").onchange = async () => {
  const id = $("defaultColumnInput").value;

  await writeDefaultColumnId(id);

  // Reflect it in the edit form so the next save agrees with settings.
  $("columnInput").value = id;
  updateSaveLabel();

  const selected = userColumns.find((col) => col.id === id);
  showToast(selected ? `Default set to ${selected.name}` : "Default saved");
};

$("loginBtn").onclick = () => {
  chrome.tabs.create({ url: `${API_BASE}/login` });
};

$("quickSaveBtn").onclick = () => saveJob(collectFormData());
$("finalSaveBtn").onclick = () => saveJob(collectFormData());

init();
