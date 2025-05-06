/**
 * Refactor for the service desk extension https://github.com/Slicepop/ServiceDeskExtension/
 */

runInitialSetup();
// if (window.location.href.includes("LookupRequest?")) runRequestTab();
// if you have a request opened
if (window.location.href.includes("/reports")) clickReportBTN();
// if you go to url with '/reports' redirect to the reports page
else {
  // support site not looking at individual request and not looking at /reports
  selectDefaultView();

  let debounceTimeout;
  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      replaceLinks();
      reorderReplyNote();
      updateFilterInputStyle();
      checkForRequestPage();
      checkForSurveyResultPage();
    }, 10);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
