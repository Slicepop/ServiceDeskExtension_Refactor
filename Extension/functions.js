function assignMacroReportValue() {
  chrome.storage.local.get("macroReport", (response) => {
    const MacroOn = response.macroReport;
    if (!MacroOn)
      chrome.storage.local.set(
        { macroReport: "false" },
        assignMacroReportValue
      );

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
    // check if user is in reports page and wants to go to the Requests Status by Technician (Closed) report
    if (KPIreportSelected && MacroOn) navigateToDefaultReport();
    else if (TechnicianSelected && MacroOn) selectDefaultReport();
  });
}
function navigateToDefaultReport() {
  const technicianReports = document.querySelector(
    "#submenu > li:nth-child(5) > a"
  );
  window.location.replace(technicianReports.href);
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

function selectBoundsOfCurrWeek() {
  function getMondayOfCurrentWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, etc.
    const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // If Sunday (0), move back 6 days, otherwise move back `dayOfWeek - 1`

    today.setDate(today.getDate() - distanceToMonday);
    today.setHours(0, 0, 0, 0); // Set time to the start of the day
    return today;
  }
  function getFridayOfCurrentWeek() {
    const Monday = getMondayOfCurrentWeek();
    const Friday = new Date(Monday);
    Friday.setDate(Monday.getDate() + 4);
    return Friday;
  }
  console.log("SD");
  const Monday = getMondayOfCurrentWeek();
  const formattedDate = Monday.toLocaleDateString("en-GB").replace(
    /(\d{2})\/(\d{2})\/(\d{4})/,
    "$2/$1/$3"
  );
  document.querySelector("#startDateUserTZ").value = formattedDate;
  const Friday = getFridayOfCurrentWeek();
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
  window.location.replace(reportsURL);
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
