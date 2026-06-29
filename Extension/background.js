chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { event, prefs } = request;
  console.log(request);
  switch (event) {
    case "updateRequest":
      console.log("request updates");
      chrome.tabs.query({}, (tabs) => {
        for (let tab of tabs) {
          // Send message to all tabs where your extension is injected
          chrome.tabs.sendMessage(tab.id, { action: "refreshPage" }, () => {
            // Ignore errors like "receiving end does not exist"
            if (chrome.runtime.lastError) {
              return;
            }
            console.log("Page refresh");
          });
        }
      });
      break;
    case "onStop":
      chrome.storage.local.set({ monitoring: "false", tabId: prefs.tabId });
      chrome.tabs.sendMessage(prefs.tabId, { action: "stopMonitoring" });
      break;
    case "onStart":
      chrome.storage.local.set({
        monitoring: "true",
        tabId: prefs.tabId,
      });
      chrome.tabs.sendMessage(prefs.tabId, { action: "startMonitoring" });
      break;
    case "pageRefreshed":
      chrome.storage.local.set({ monitoring: "false" });
      break;
    default:
      break;
  }
});
chrome.tabs.onRemoved.addListener((closedTabId, removeInfo) => {
  chrome.storage.local.get(["monitoring", "tabId"], (result) => {
    const { monitoring, tabId } = result;

    if (monitoring === "true" && tabId === closedTabId) {
      chrome.storage.local.set({ monitoring: "false" }, () => {
        console.log("Monitor stopped.");
      });
    }
  });
});
