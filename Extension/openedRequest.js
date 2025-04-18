function runRequestTab() {
  fetchTitle();

  let debounceTimeout;
  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      addSaveCloseBTN();
    }, 10);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
function addSaveCloseBTN() {
  if (document.querySelector("#Save_Close")) {
    return;
  }
  const test = document.createElement("p");
  test.id = "Save_Close";
  test.textContent = "SAVE\n+\nCLOSE";
  test.title = "Saves Ticket and Closes Window";
  document
    .querySelector(
      "#request_general_container > div > div.card-header.general-card-header > button"
    )
    .appendChild(test);
}
async function fetchTitle() {
  const itemID = window.location.href.split("requestId=")[1];
  try {
    const response = await fetch(
      "https://support.wmed.edu/LiveTime/services/v1/user/requests/" +
        itemID +
        "/basic",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "zsd-source": "LT",
        },
      }
    );
    const data = await response.json();
    document.title = data.subject;
  } catch (error) {}
}
