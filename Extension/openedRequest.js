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
  const SaveClose = document.createElement("p");
  SaveClose.id = "Save_Close";
  SaveClose.textContent = "SAVE\n+\nCLOSE";
  SaveClose.title = "Saves Ticket and Closes Window";
  SaveClose.addEventListener("click", () => {
    setTimeout(() => {
      window.close();
    }, 800);
  });
  document
    .querySelector(
      "#request_general_container > div > div.card-header.general-card-header > button"
    )
    .appendChild(SaveClose);
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
