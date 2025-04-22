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
  reportFavicon.href = chrome.runtime.getURL("images/favicon.ico");
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
  const Monday = new Date();
  const dayOfWeek = Monday.getDay(); // Sunday = 0, Monday = 1, etc.
  const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // If Sunday (0), move back 6 days, otherwise move back `dayOfWeek - 1`

  Monday.setDate(Monday.getDate() - distanceToMonday);
  Monday.setHours(0, 0, 0, 0); // Set time to the start of the day

  const Friday = new Date();
  Friday.setDate(Monday.getDate() + 4); // grab Friday which would be 4 days after Monday
  return { Monday: Monday, Friday: Friday };
}
function selectBoundsOfCurrWeek() {
  const days = getDaysOfCurrentWeek();
  const Monday = days.Monday;
  const formattedDate = Monday.toLocaleDateString("en-GB").replace(
    /(\d{2})\/(\d{2})\/(\d{4})/,
    "$2/$1/$3"
  );
  document.querySelector("#startDateUserTZ").value = formattedDate;
  const Friday = days.Friday;
  const formattedDate2 = Friday.toLocaleDateString("en-GB").replace(
    /(\d{2})\/(\d{2})\/(\d{4})/,
    "$2/$1/$3"
  );
  document.querySelector("#endDateUserTZ").value = formattedDate2;
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
  const reportsBTN = document.querySelector(
    "#zsd_navbar_menus > ul.navbar-nav.mr-auto > li:nth-child(7) > a"
  );
  if (!reportsBTN) return;
  const reportsURL = reportsBTN.href;
  window.location.href = reportsURL;
}
function replaceLinks() {
  const linksToRequest = document.querySelectorAll("#requestId");
  if (!linksToRequest) return;
  linksToRequest.forEach((link) => {
    const newLink = document.createElement("a");
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
    if (item.dataset.processed == "true") return;
    styleRequestItem(item, index);
    const requestReply = item.querySelector(
      "tr:nth-child(2) > td.notetext > span"
    );
    item.dataset.processed = "true";
    if (!requestReply) return;
    requestReply.classList.add("replyNote");
  });
}
function styleRequestItem(item, index) {
  if (index % 2 === 0) {
    item.style.backgroundColor = "#ffffff";
  } else {
    item.style.backgroundColor = "#f0f0f0";
  }
  const replyNote = item.querySelector(".replyNote");
  item.addEventListener("mouseover", () => {
    item.style.cursor = "default";
    if (!replyNote) return;
    replyNote.classList.add("itemHovered");
  });
  if (!replyNote) return;
  item.addEventListener("mouseout", () => {
    replyNote.classList.remove("itemHovered");
  });
}
