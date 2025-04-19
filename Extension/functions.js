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
