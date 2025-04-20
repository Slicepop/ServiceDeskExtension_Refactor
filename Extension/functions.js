function assignMacroReportValue() {
  chrome.storage.local.get("macroReport", (response) => {
    if (typeof response.macroReport === "undefined") {
      chrome.storage.local.set({ macroReport: false }, assignMacroReportValue);
      assignMacroReportValue();
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
function selectDefaultReport() {
  const changeEvent = new Event("change");
  const reportSelection = document.querySelector(
    "#technicianReportsForm > div > div.windowContent > div > table > tbody > tr:nth-child(1) > td.fieldtext > select"
  );
  if (!reportSelection) return;
  else if (reportSelection.selectedIndex == "10") {
    selectBoundsOfCurrWeek();
    return;
  }
  reportSelection.selectedIndex = "10";
  reportSelection.dispatchEvent(changeEvent);
}
function addCheckboxForMacro() {
  const areaToAddCheck = document.querySelector(
    "#technicianReportsForm > div > div.windowContent > div > table > tbody > tr:nth-child(4) > td.fieldtext"
  );
  if (!areaToAddCheck) return;
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
function selectBoundsOfCurrWeek() {
  function getDaysOfCurrentWeek() {
    const Monday = new Date();
    const dayOfWeek = Monday.getDay(); // Sunday = 0, Monday = 1, etc.
    const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // If Sunday (0), move back 6 days, otherwise move back `dayOfWeek - 1`

    Monday.setDate(Monday.getDate() - distanceToMonday);
    Monday.setHours(0, 0, 0, 0); // Set time to the start of the day

    const Friday = new Date();
    Friday.setDate(Monday.getDate() + 4);
    return { Monday: Monday, Friday: Friday };
  }
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
function modifyRequestBTN() {
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
    newLink.dataset.processed = true;
    link.parentNode.replaceChild(newLink, link);
  });
}
function selectDefaultView() {
  const incident = document.querySelector(
    ".rowoverride > div.mb-3.col-10 > ul > li:nth-child(2)"
  );
  if (incident) {
    const incidentNum = incident.querySelector("sup");
    if (incidentNum && incidentNum.textContent !== "0") {
      incident.click();
    }
  }
}
