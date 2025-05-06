function runInitialSetup() {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "refreshPage") {
      refreshPage();
    }
  });

  modifyNavRequestBTN();
  assignMacroReportValue();
  checkExpiredNotes();
}
function refreshPage() {
  const refreshBTN = document.querySelector(".reseticon > em");
  if (refreshBTN) refreshBTN.click();
}
function checkForRequestPage() {
  //openeing a request not on the main page would make it so its not using LookupRequest making openedRequest.js not to run
  const requestNum = document.querySelector(
    // I keep this long to ensure its in the request page
    "#editRequest > div.card.request-subject.common-subject-description-card.ml-0 > div > div.priority_requestnumber > p.request-number"
  );
  if (!requestNum || window.location.href.includes("/LookupRequest")) return;
  window.location.href = `https://support.wmed.edu/LiveTime/WebObjects/LiveTime.woa/wa/LookupRequest?sourceId=New&requestId=${requestNum.textContent}`;
}
function checkForSurveyResultPage() {
  const supportSurveyForm = document.querySelector("#surveyContainerForm");
  if (!supportSurveyForm) return;
  supportSurveyForm.target = "_blank";
}
function assignMacroReportValue() {
  // checks/sets  if user has selected to automatically go to 'Requests Status by Technician (Closed)' report

  chrome.storage.local.get("macroReport", (response) => {
    if (typeof response.macroReport === "undefined") {
      chrome.storage.local.set({ macroReport: false }, assignMacroReportValue);
      return;
    }

    const MacroOn = response.macroReport === true;
    const secondSubMenuItem = document.querySelector(
      "#submenu > li:nth-child(1) > a"
    );
    const fourthSubMenuItem = document.querySelector(
      "#submenu > li:nth-child(5) > a"
    );
    const KPIreportSelected =
      secondSubMenuItem &&
      secondSubMenuItem.className === "active" &&
      secondSubMenuItem.textContent === "KPI";
    const TechnicianSelected =
      fourthSubMenuItem &&
      fourthSubMenuItem.className === "active" &&
      fourthSubMenuItem.textContent === "Technician";

    if (KPIreportSelected && MacroOn) selectTechnicianReports();
    else if (TechnicianSelected && MacroOn) selectDefaultReport();
    addCheckboxForMacro();
  });
}
function selectTechnicianReports() {
  const technicianReports = document.querySelector(
    "#submenu > li:nth-child(5) > a"
  );
  window.location.href = technicianReports.href;
}
function addReportFavicon() {
  if (document.querySelector("#alienIcon")) return;
  const originalFavicon = document.querySelector("head > link:nth-child(13)");
  const reportFavicon = document.createElement("link");
  reportFavicon.id = "alienIcon";
  reportFavicon.rel = "icon";
  reportFavicon.href = chrome.runtime.getURL("images/report.png");
  originalFavicon.parentNode.replaceChild(reportFavicon, originalFavicon);
}
function selectDefaultReport() {
  addReportFavicon();
  const changeEvent = new Event("change");
  const reportSelection = document.querySelector(
    "#technicianReportsForm > div > div.windowContent > div > table > tbody > tr:nth-child(1) > td.fieldtext > select"
  );
  if (!reportSelection) return;
  if (reportSelection.value !== "10") {
    reportSelection.value = "10";
    reportSelection.dispatchEvent(changeEvent);
    return;
  }
  const selectedOption = reportSelection.options[reportSelection.selectedIndex];
  const selectedText = selectedOption
    ? selectedOption.textContent.trim()
    : "Service Manager";
  document.title = selectedText;
  selectBoundsOfCurrWeek();
}
function addCheckboxForMacro() {
  const areaToAddCheck = document.querySelector(
    "#technicianReportsForm > div > div.windowContent > div > table > tbody > tr:nth-child(4) > td.fieldtext"
  );
  if (!areaToAddCheck || document.querySelector("#macroCheckbox")) return;
  const macroCheckbox = document.createElement("input");
  macroCheckbox.id = "macroCheckbox";
  macroCheckbox.type = "checkbox";
  chrome.storage.local.get("macroReport", (response) => {
    macroCheckbox.checked = response.macroReport === true; // Ensure it's a boolean
  });
  areaToAddCheck.appendChild(macroCheckbox);
  macroCheckbox.addEventListener("change", () => {
    chrome.storage.local.set({ macroReport: macroCheckbox.checked });
  });
}
function getDaysOfCurrentWeek() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, etc.
  const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const Monday = new Date(today);
  Monday.setDate(today.getDate() - distanceToMonday);
  Monday.setHours(0, 0, 0, 0); // Start of Monday

  const Friday = new Date(Monday);
  Friday.setDate(Monday.getDate() + 4);
  Friday.setHours(23, 59, 59, 999); // End of Friday

  // Format year to two digits
  const formatDate = (date) => ({
    year: String(date.getFullYear()).slice(-2),
    month: date.getMonth() + 1, // Months are 0-indexed
    day: date.getDate(),
  });

  return {
    Monday,
    Friday,
  };
}

function selectBoundsOfCurrWeek() {
  const formatToMMDDYY = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(2); // "25" instead of "2025"
    return `${month}/${day}/${year}`;
  };
  const days = getDaysOfCurrentWeek();

  document.querySelector("#startDateUserTZ").value = formatToMMDDYY(
    days.Monday
  );

  document.querySelector("#endDateUserTZ").value = formatToMMDDYY(days.Friday);
  document.querySelector(
    "#technicianReportsForm > div > div.windowContent > div > table > tbody > tr:nth-child(4) > td.fieldtext > select"
  ).selectedIndex = 13;
}

function modifyNavRequestBTN() {
  // modifies request button at the top to not have woa/wo/9.0.33.7.1.1 at the end of url
  // woa/wo/9.0.33.7.1.1 causes the session to expire eventually
  const navRequestBTN = document.querySelector(
    "#zsd_navbar_menus > ul.navbar-nav.mr-auto > li:nth-child(2) > a"
  );

  if (!navRequestBTN) return;
  navRequestBTN.href = "https://support.wmed.edu/LiveTime/WebObjects/LiveTime";
}
function clickReportBTN() {
  addReportFavicon();
  const reportsBTN = document.querySelector(
    "#zsd_navbar_menus > ul.navbar-nav.mr-auto > li:nth-child(7) > a"
  );
  if (!reportsBTN) return;
  const reportsURL = reportsBTN.href;
  setTimeout(() => {
    window.location.href = reportsURL;
  }, 100);
}
function updateFilterInputStyle() {
  const filterDiv = document.querySelector("#generalfilterbody");
  if (!filterDiv) return;

  const filterSelects = filterDiv.querySelectorAll("select");
  filterSelects.forEach((select) => {
    select.style.maxHeight = select.scrollHeight + "px";
    if (select.name == "selectedTechnician" || select.name == "selectdTeams") {
      if (select.classList.contains("modified")) {
        return;
      }
      select.classList.add("modified");
      select.style.resize = "vertical";
      select.style.maxHeight = select.scrollHeight + "px";
      select.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          const applyBTN = document.querySelector("#modalApplyButton");
          if (applyBTN) {
            console.log("sa");
            applyBTN.click();
          }
        }
      });
    }
  });
}
function replaceLinks() {
  const linksToRequest = document.querySelectorAll("#requestId");
  if (!linksToRequest) return;
  linksToRequest.forEach((link) => {
    const newLink = document.createElement("a");
    newLink.id = "requestNum";
    newLink.textContent = link.textContent.trim();
    newLink.href = `https://support.wmed.edu/LiveTime/WebObjects/LiveTime.woa/wa/LookupRequest?sourceId=New&requestId=${newLink.textContent}`;
    newLink.target = "_blank";
    link.parentNode.replaceChild(newLink, link);
  });
}
function selectDefaultView() {
  setTimeout(() => {
    const incident = document.querySelector(
      ".rowoverride > div.mb-3.col-10 > ul > li:nth-child(2)"
    );
    if (incident) {
      const incidentNum = incident.querySelector("sup");
      if (incidentNum && incidentNum.textContent !== "0") {
        incident.click();
      }
    }
  }, 50);
}
function reorderReplyNote() {
  const requestList = document.querySelectorAll(".accordion-toggle");
  requestList.forEach((item, index) => {
    styleRequestItem(item, index);
    addToggleablePersonalNotes(item);
    const requestReply = item.querySelector(
      "tr:nth-child(2) > td.notetext > span"
    );
    if (!requestReply) return;
    requestReply.classList.add("replyNote");
    const replyTD = item.querySelector(".notetext");
    if (replyTD) {
      while (replyTD.nextSibling && replyTD.nextSibling.nodeName === "TD") {
        replyTD.parentNode.removeChild(replyTD.nextSibling);
      }
    }
    item.classList.add("itemChanged");
  });
}

async function createOrShowHideNote(rowBelow, item) {
  const NoteTD = rowBelow.querySelector("td:nth-child(4)");
  if (rowBelow.querySelector("#personalNote")) {
    const personalNote = rowBelow.querySelector("#personalNote");
    if (rowBelow.id == "noteRow") rowBelow.remove();
    else {
      NoteTD.colSpan = "1";
      personalNote.remove();
    }
    return;
  }
  const requestID = item.querySelector("#requestNum");
  if (!requestID) return;
  const NoteDetails = await getRequestNote(requestID.textContent);
  const personalNote = document.createElement("textarea");
  if (NoteDetails) {
    personalNote.value = NoteDetails.note;
    personalNote.style.width = NoteDetails.width;
    personalNote.style.height = NoteDetails.height;
  }
  personalNote.id = "personalNote";
  personalNote.placeholder = "Personal Note";
  personalNote.setAttribute("_ngcontent-ng-c4256737322", "");
  NoteTD.colSpan = "6";
  NoteTD.appendChild(personalNote);
  personalNote.addEventListener("change", () => {
    if (personalNote.value.trim() == "") {
      chrome.storage.local.remove(requestID.textContent);
    } else {
      chrome.storage.local.set({
        [requestID.textContent]: {
          note: personalNote.value,
          height: personalNote.style.height,
          width: personalNote.style.width,
          timestamp: Date.now(),
        },
      });
    }
  });

  const resizeObserver = new ResizeObserver(() => {
    if (personalNote.value.trim() == "") {
      chrome.storage.local.remove(requestID.textContent);
    } else {
      chrome.storage.local.set({
        [requestID.textContent]: {
          note: personalNote.value,
          height: personalNote.style.height,
          width: personalNote.style.width,
          timestamp: Date.now(),
        },
      });
    }
  });

  resizeObserver.observe(personalNote);
}
function styleRequestItem(item, index) {
  item.addEventListener("mouseover", () => {
    item.style.cursor = "default";
  });
  if (index % 2 === 0) {
    item.style.backgroundColor = "#ffffff";
  } else {
    item.style.backgroundColor = "#f0f0f0";
  }
}
async function getRequestNote(requestID) {
  return new Promise((resolve) => {
    chrome.storage.local.get(requestID, (result) => {
      if (!result[requestID]) {
        resolve(null);
      } else {
        resolve(result[requestID]);
      }
    });
  });
}

function addToggleablePersonalNotes(item) {
  addNoteBTN(item);
}
function checkExpiredNotes() {
  const currentDate = Date.now();
  const twoMonthsTime = 1000 * 60 * 60 * 24 * 60; // 60 days in ms

  chrome.storage.local.get(null, (items) => {
    for (const [key, value] of Object.entries(items)) {
      try {
        if (
          typeof value === "object" &&
          value !== null &&
          "height" in value &&
          "timestamp" in value
        ) {
          const elapsedTime = currentDate - value.timestamp;
          if (elapsedTime > twoMonthsTime) {
            chrome.storage.local.remove(key);
            console.log(`Removed expired note: ${key}`);
          }
        }
      } catch (err) {
        console.warn(`Error processing key "${key}":`, err);
      }
    }
  });
}

function addNoteBTN(item) {
  if (item.querySelector("#noteBTN")) return;
  const incidentIcon = item.querySelector("td:nth-child(3) > img");
  const toggleNote = document.createElement("p");
  toggleNote.textContent = "+";

  toggleNote.id = "noteBTN";
  toggleNote.title = "Toggle Personal Note";
  const requestID = item.querySelector("#requestNum");
  shouldNoteOpen(requestID).then((noteActive) => {
    if (noteActive) {
      checkRowBelow(item);
      toggleNote.textContent = "-";

      toggleNote.style.color = "#5de6dc";
    }
  });

  toggleNote.addEventListener("click", (event) => {
    if (toggleNote.textContent == "+") {
      toggleNote.textContent = "-";
      // chrome.storage.local.get(requestID.textContent, (response) => {
      //   chrome.storage.local.set({
      //     [requestID.textContent]: {
      //       ...response[requestID.textContent],
      //       open: false,
      //     },
      //   });
      // });
    } else {
      toggleNote.textContent = "+";
      // chrome.storage.local.get(requestID.textContent, (response) => {
      //   chrome.storage.local.set({
      //     [requestID.textContent]: {
      //       ...response[requestID.textContent],
      //       open: true,
      //     },
      //   });
      // });
    }
    checkRowBelow(item);
  });

  try {
    incidentIcon.parentNode.replaceChild(toggleNote, incidentIcon);
  } catch {}
}

function shouldNoteOpen(requestID) {
  const requestText = requestID.textContent;
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(requestText, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }

      if (typeof response[requestText] === "undefined") {
        resolve(false);
      } else {
        checkRowBelow(requestID);
        resolve(true);
      }
    });
  });
}

function checkRowBelow(item) {
  const rowBelow = item.querySelector("tr:nth-child(2)");
  if (rowBelow) {
    //if there is a row below (if there is a reply note)
    createOrShowHideNote(rowBelow, item);
    return;
  } else if (item.querySelector("noteRow")) return;
  const row = document.createElement("tr");
  row.style.color = item.style.color;
  row.id = "noteRow";
  row.setAttribute("_ngcontent-ng-c4256737322", "");
  for (let i = 0; i < 5; i++) {
    const emptyTD = document.createElement("td");
    emptyTD.textContent = "";

    emptyTD.setAttribute("_ngcontent-ng-c4256737322", "");
    emptyTD.style.height = "10px";

    row.append(emptyTD);
  }

  item.appendChild(row);
  createOrShowHideNote(row, item);
}
