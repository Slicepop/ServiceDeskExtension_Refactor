const script = document.createElement("script");
script.src = chrome.runtime.getURL("firebase.js");
script.type = "module";
script.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(script);
runRequestTab();
function requestDebounceCalls() {
  addSaveCloseBTN();
  changeUserTooltip();
  modifyDescriptionStyle();
  modifySelectClass();
}
function runRequestTab() {
  updateFavicon();
  fetchTitle();
  openNotes();
  let debounceTimeout;
  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(requestDebounceCalls, 10);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
function updateFavicon() {
  if (document.querySelector("#requestIcon")) return;
  const originalFavicon = document.querySelector("head > link:nth-child(13)");
  const requestFavicon = document.createElement("link");
  requestFavicon.id = "requestIcon";
  requestFavicon.rel = "icon";
  requestFavicon.href = chrome.runtime.getURL("images/request.ico");
  originalFavicon.parentNode.replaceChild(requestFavicon, originalFavicon);
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
  function handleSaveClose() {
    setTimeout(() => {
      window.close();
    }, 800);
  }
  function handleSave() {
    try {
      chrome.runtime.sendMessage({ message: "updateRequest" });
    } catch {}
    setTimeout(requestDebounceCalls, 150);
  }
  if (document.querySelector("#Save_Close")) return;

  const SaveClose = document.createElement("p");
  SaveClose.id = "Save_Close";
  SaveClose.textContent = "SAVE\n+\nCLOSE";
  SaveClose.title = "Saves Ticket and Closes Window";
  const saveBTN = document.querySelector(".general-card-header > button");
  if (saveBTN) saveBTN.addEventListener("click", handleSave);
  SaveClose.addEventListener("click", handleSaveClose);
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
  const newI_Tag = document.createElement("em");
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
function modifyDescriptionStyle() {
  function wrapAndColorEmails(descText) {
    const content = descText.innerHTML;
    const emails = content.split(/(?=From:)/g);

    const wrappedEmails = emails.map((email, index) => {
      const background = index % 2 === 0 ? "#ffffff" : "#f0f0f0";
      return `<div class="email"   style="background-color: ${background};">${email}</div> `;
    });

    descText.innerHTML = wrappedEmails.join("");
  }

  const readMoreBTN = document.querySelector("#more_less_link");

  const descriptionField = document.querySelector(
    "#description-tab > div.ml-2.description-box"
  );
  const descriptionText = document.querySelector("#request-description-text");

  const tab = document.querySelector("#myTabContent");
  if (tab) {
    tab.id = "myContent";
    tab.style.paddingRight = "15px";
  }
  if (!descriptionField || !descriptionText) return;
  if (readMoreBTN && readMoreBTN.textContent === "...READ MORE")
    readMoreBTN.click();

  descriptionText.id = "descText";
  // descriptionField.classList.remove("ml-2");
  // descriptionField.classList.remove("description-box");

  descriptionField.classList.add("resize-desc");
  descriptionField.style.maxHeight = descriptionField.scrollHeight + 20 + "px";
  wrapAndColorEmails(descriptionText);
}
function modifySelectClass() {
  const selects = document.querySelectorAll("select");
  selects.forEach((select) => {
    const options = select.querySelectorAll("option");
    options.forEach((option, index) => {
      if (index % 2 === 0) {
        option.style.backgroundColor = "#ffffff";
      } else {
        option.style.backgroundColor = "#f0f0f0";
      }
    });
  });
}
function openNotes() {
  setTimeout(() => {
    const noteDiv = document.querySelector(".requestnote-card-header");
    if (!noteDiv) return;
    const match = noteDiv.textContent.match(/NOTES\s*\((\d+)\)/);

    if (match) {
      const number = parseInt(match[1], 10);
      if (number == 0) return;
    }
    if (noteDiv.dataset.processed) return;
    noteDiv.dataset.processed = true;
    noteDiv.click();
  }, 100);
}
