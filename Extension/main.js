if (window.location.href.includes("LookupRequest?")) {
  runRequestTab();
}

function replaceLinks() {
  const linksToRequest = document.querySelectorAll("#requestId");
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
  }, 1);
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
