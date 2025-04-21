modifyNavRequestBTN();
// modifies request button at the top to not have woa/wo/9.0.33.7.1.1 at the end of url
// woa/wo/9.0.33.7.1.1 causes the session to expire eventually
assignMacroReportValue();
// checks/sets  if user has selected to automatically go to 'Requests Status by Technician (Closed)' report
if (window.location.href.includes("LookupRequest?")) runRequestTab();
// if you have a request opened
else if (window.location.href.includes("/reports")) clickReportBTN();
// if you go to url with '/reports' redirect to the reports page
else {
  // support site not looking at individual request and not looking at /reports
  selectDefaultView();

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
