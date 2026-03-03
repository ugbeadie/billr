const API_BASE = "https://trackrrrr.netlify.app/";

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
    });

    if (res.status === 401) {
      showLogin();
      return;
    }

    const data = await res.json();
    userColumns = data.columns;
    boardId = data.boardId;

    populateColumns();
    await scrapePage();

    showPreview();
  } catch (err) {
    showLogin();
  }
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

  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tab.id, { action: "extractJob" }, (response) => {
      scrapedData = response;

      document.getElementById("previewCompany").innerText = response.company;
      document.getElementById("previewPosition").innerText = response.position;

      document.getElementById("companyInput").value = response.company;
      document.getElementById("positionInput").value = response.position;
      document.getElementById("locationInput").value = response.location;
      document.getElementById("descriptionInput").value = response.description;

      resolve();
    });
  });
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
  await saveJob(scrapedData);
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
      return;
    }

    if (res.ok) {
      const selectedColumn = userColumns.find((c) => c.id === data.columnId);

      const columnName = selectedColumn?.name || "Applied";

      showToast(`Saved to ${columnName}`);

      setTimeout(() => {
        window.close();
      }, 1200);
    } else {
      showToast("Failed to save job", "error");
    }
  } catch {
    showToast("Network error", "error");
  }
}

function showSavingState() {
  document.getElementById("quickSaveBtn").innerText = "Saving...";
  document.getElementById("finalSaveBtn").innerText = "Saving...";
}

init();
