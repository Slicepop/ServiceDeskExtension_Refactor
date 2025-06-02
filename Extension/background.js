chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  setTimeout(() => {
    if (request.message === "updateRequest") {
      chrome.tabs.query({}, (tabs) => {
        for (let tab of tabs) {
          // Send message to all tabs where your extension is injected
          chrome.tabs.sendMessage(tab.id, { action: "refreshPage" }, () => {
            // Ignore errors like "receiving end does not exist"
            if (chrome.runtime.lastError) {
              // This just means your content script isn't in that tab — fine to ignore
            }
          });
        }
      });

      return true; // keep service worker alive while this runs
    }
  }, 800);
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_FIREBASE_KEY") {
    chrome.storage.local.get(["firebaseKey"], (result) => {
      sendResponse({ firebaseKey: result.firebaseKey });
    });
    return true; // Keeps sendResponse open for async
  }
});
