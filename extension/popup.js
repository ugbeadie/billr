const API_ORIGINS = {
  local: "http://localhost:3000",
  live: "https://trackr.ugbeadie.com",
};

// Flip to API_ORIGINS.live before shipping. Both origins must stay listed in
// manifest.json host_permissions or the fetch is blocked.
const API_BASE = API_ORIGINS.local;

let scrapedData = null;
let userColumns = [];
let boardId = null;

const loadingScreen = document.getElementById("loadingScreen");
const loginScreen = document.getElementById("loginScreen");
const previewScreen = document.getElementById("previewScreen");
const editScreen = document.getElementById("editScreen");

async function init() {
  try {
    const res = await fetch(`${API_BASE}/api/extension/user-data`, {
      credentials: "include",
      signal: AbortSignal.timeout(10000),
    });

    if (res.status === 401) {
      showLogin();
      return;
    }

    const data = await res.json();
    userColumns = data.columns || [];
    boardId = data.boardId;

    populateColumns();
  } catch (err) {
    showLogin();
    return;
  }

  // Scraping must never block the popup from rendering — fillForm degrades to
  // empty fields the user can edit by hand.
  try {
    await scrapePage();
  } catch (err) {
    fillForm(null);
  }

  showPreview();
}

function showLogin() {
  loadingScreen.classList.add("hidden");
  loginScreen.classList.remove("hidden");
}

function showPreview() {
  loadingScreen.classList.add("hidden");
  previewScreen.classList.remove("hidden");
}

function populateColumns() {
  const select = document.getElementById("columnInput");
  select.innerHTML = "";

  userColumns.forEach((col) => {
    const option = document.createElement("option");
    option.value = col.id;
    option.textContent = col.name;
    select.appendChild(option);
  });
}

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");

  toast.textContent = message;

  toast.style.background = type === "error" ? "#dc2626" : "#111827";

  toast.classList.remove("hidden");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}
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

  // The content script isn't in tabs that were already open when the extension
  // was installed or reloaded. activeTab + scripting let us inject it on demand.
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

function fillForm(data) {
  // Visible in the popup's own devtools (right-click the popup > Inspect), so a
  // bad scrape can be diagnosed without guessing at selectors.
  console.debug("[Trackr] scraped:", data);

  scrapedData = {
    company: data?.company || "",
    position: data?.position || "",
    location: data?.location || "",
    description: data?.description || "",
    jobType: data?.jobType || "",
    jobMode: data?.jobMode || "",
    url: data?.url || "",
  };

  document.getElementById("previewCompany").innerText =
    scrapedData.company || "Unknown company";
  document.getElementById("previewPosition").innerText =
    scrapedData.position || "Couldn't read this page — tap Edit to fill it in";

  document.getElementById("companyInput").value = scrapedData.company;
  document.getElementById("positionInput").value = scrapedData.position;
  document.getElementById("locationInput").value = scrapedData.location;
  document.getElementById("descriptionInput").value = scrapedData.description;
  document.getElementById("jobTypeInput").value = scrapedData.jobType;
}

document.getElementById("editBtn").onclick = () => {
  previewScreen.classList.add("hidden");
  editScreen.classList.remove("hidden");
};

document.getElementById("backBtn").onclick = () => {
  editScreen.classList.add("hidden");
  previewScreen.classList.remove("hidden");
};

document.getElementById("loginBtn").onclick = () => {
  chrome.tabs.create({ url: `${API_BASE}/login` });
};

document.getElementById("quickSaveBtn").onclick = async () => {
  // Send the same column the Edit screen is showing, so a quick save and an
  // edited save can't disagree about where the job lands.
  await saveJob({
    ...scrapedData,
    boardId,
    columnId: document.getElementById("columnInput").value,
  });
};

document.getElementById("finalSaveBtn").onclick = async () => {
  const updatedData = {
    ...scrapedData,
    boardId,
    columnId: document.getElementById("columnInput").value,
    company: document.getElementById("companyInput").value,
    position: document.getElementById("positionInput").value,
    jobType: document.getElementById("jobTypeInput").value,
    location: document.getElementById("locationInput").value,
    description: document.getElementById("descriptionInput").value,
  };

  await saveJob(updatedData);
};

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

    // The server decides the final column, so report what it actually did
    // instead of echoing the local selection back at the user.
    const result = await res.json().catch(() => ({}));
    const columnName =
      result.columnName ||
      userColumns.find((c) => c.id === data.columnId)?.name ||
      "your board";

    showToast(`Saved to ${columnName}`);

    setTimeout(() => {
      window.close();
    }, 1200);
  } catch {
    showToast("Network error", "error");
    resetSavingState();
  }
}

const SAVE_BUTTONS = ["quickSaveBtn", "finalSaveBtn"];
const originalLabels = {};

function showSavingState() {
  SAVE_BUTTONS.forEach((id) => {
    const btn = document.getElementById(id);
    if (originalLabels[id] === undefined) originalLabels[id] = btn.innerText;
    btn.innerText = "Saving...";
    btn.disabled = true;
  });
}

// Every failure path calls this: leaving the buttons reading "Saving..." but
// still clickable is what lets a retry insert the same job twice.
function resetSavingState() {
  SAVE_BUTTONS.forEach((id) => {
    const btn = document.getElementById(id);
    if (originalLabels[id] !== undefined) btn.innerText = originalLabels[id];
    btn.disabled = false;
  });
}

init();
