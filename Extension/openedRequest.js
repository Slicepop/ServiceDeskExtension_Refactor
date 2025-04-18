function runRequestTab() {
  fetchTitle();

  let debounceTimeout;
  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      addSaveCloseBTN();
      changeUserTooltip();
    }, 10);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
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
function addSaveCloseBTN() {
  if (document.querySelector("#Save_Close")) return;

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
function changeUserTooltip() {
  if (document.querySelector("#newI_Tag")) return;

  const userI_Tag = document.querySelector(
    "#request-general-detail > div > div:nth-child(2) > div:nth-child(1) > div > div > div > div:nth-child(1) > em"
  );
  if (!userI_Tag) return;
  const newI_Tag = document.createElement("i");
  newI_Tag.id = "newI_Tag";
  newI_Tag.style.cssText = userI_Tag.style.cssText;
  newI_Tag.classList.add(...userI_Tag.classList);
  userI_Tag.parentNode.replaceChild(newI_Tag, userI_Tag);

  const userTooltipInfo = document.querySelector("#tooltip_info");
  newI_Tag.addEventListener("click", () => {
    if (!userTooltipInfo.classList.contains("tooltipShown")) {
      userTooltipInfo.classList.add("tooltipShown");
      document.addEventListener("click", function handler(event) {
        if (
          !newI_Tag.contains(event.target) &&
          !userTooltipInfo.contains(event.target)
        ) {
          userTooltipInfo.classList.remove("tooltipShown");
          document.removeEventListener("click", handler);
        }
      });
    } else {
      userTooltipInfo.classList.remove("tooltipShown");
    }
  });
}
