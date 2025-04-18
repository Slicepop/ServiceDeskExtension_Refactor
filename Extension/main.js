if (window.location.href.includes("LookupRequest?")) {
  // if you have a request opened
  runRequestTab();
} else {
  // support site not looking at individual request
  const incident = document.querySelector(
    ".rowoverride > div.mb-3.col-10 > ul > li:nth-child(2)"
  );
  if (incident) {
    const incidentNum = incident.querySelector("sup");
    setTimeout(() => {
      if (incidentNum && incidentNum.textContent !== "0") {
        incident.click();
      }
    }, 1);
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

  let debounceTimeout;
  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      replaceLinks();
    }, 10);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
