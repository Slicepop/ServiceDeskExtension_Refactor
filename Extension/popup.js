// https://support.wmed.edu/servicedesk-apidocs/
if (localStorage.getItem("lastSearch") === "") {
  localStorage.removeItem("lastSearch");
  localStorage.removeItem("clientId");
}
document.querySelector("#search").focus();
checkAuth();
async function refreshToken() {
  try {
    const respond = await fetch(
      "https://support.wmed.edu/LiveTime/services/v1/auth/tokens",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
        },
      }
    );
    if (respond.ok) {
      const data = await respond.json();
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      return true;
    }
  } catch (error) {
    createLoginPage();
  }
  createLoginPage();
  return false;
}
async function checkAuth() {
  //This function runs a search to see if the current authentication token is valid, if not, login page is shown
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
    redirect: "follow",
  };
  try {
    const response = await fetch(
      "https://support.wmed.edu/LiveTime/services/v1/user/client/findusers?internalOnly=true&clientTypes=8&searchTerm=Soffset=0&limit=10&locale=en-US",
      requestOptions
    );
    if (response.ok) {
      return true;
    } else {
      refreshToken();
    }
  } catch (error) {
    createLoginPage();
    return false;
  }
}
// if (authorized == false) {
//   console.log("FALSEEEE");
//   setTimeout(() => {
// fetch("https://support.wmed.edu/LiveTime/services/v1/auth/tokens", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: localStorage.getItem("refreshToken"),
//   },
// })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data && data.token) {
//           localStorage.setItem("authToken", data.token);
//           localStorage.setItem("refreshToken", data.refreshToken);
//           console.log("New token received and stored:", data.token);
//         } else {
//           createLoginPage();
//         }
//       })
//       .catch((error) => {
//         createLoginPage();
//       });
//   }, 2000);
// }

function createLoginPage() {
  const loginOverlay = document.createElement("div");

  loginOverlay.id = "loginOverlay";
  loginOverlay.style.position = "fixed";
  loginOverlay.style.top = "0";
  loginOverlay.style.left = "0";
  loginOverlay.style.width = "100%";
  loginOverlay.style.height = "100%";
  loginOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  loginOverlay.style.display = "flex";
  loginOverlay.style.justifyContent = "center";
  loginOverlay.style.alignItems = "center";
  loginOverlay.style.zIndex = "1000";

  const loginForm = document.createElement("div");
  if (localStorage.getItem("isDarkMode") === "true") {
    loginForm.style.backgroundColor = "#363232";
  } else {
    loginForm.style.backgroundColor = "white";
  }
  loginForm.style.padding = "20px";
  loginForm.style.borderRadius = "5px";
  loginForm.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";

  const usernameLabel = document.createElement("label");
  usernameLabel.textContent = "Username:";
  usernameLabel.style.display = "block";
  usernameLabel.style.marginBottom = "5px";

  const usernameInput = document.createElement("input");
  usernameInput.type = "text";
  usernameInput.id = "userField";

  usernameInput.style.width = "100%";
  usernameInput.style.marginBottom = "10px";

  const passwordLabel = document.createElement("label");
  passwordLabel.textContent = "Password:";
  passwordLabel.style.display = "block";
  passwordLabel.style.marginBottom = "5px";

  const passwordInput = document.createElement("input");
  passwordInput.id = "pwordField";
  passwordInput.type = "password";
  passwordInput.style.width = "100%";
  passwordInput.style.marginBottom = "10px";

  const loginButton = document.createElement("button");
  loginButton.textContent = "Login";
  loginButton.style.width = "100%";
  loginButton.style.padding = "10px";
  loginButton.style.backgroundColor = "#4CAF50";
  loginButton.style.color = "white";
  loginButton.style.border = "none";
  loginButton.style.borderRadius = "5px";
  loginButton.style.cursor = "pointer";

  function handleLogin() {
    username = usernameInput.value;
    password = passwordInput.value;
    login();
  }

  loginButton.addEventListener("click", handleLogin);

  passwordInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      handleLogin();
    }
  });

  loginForm.appendChild(usernameLabel);
  loginForm.appendChild(usernameInput);
  loginForm.appendChild(passwordLabel);
  loginForm.appendChild(passwordInput);
  loginForm.appendChild(loginButton);
  loginOverlay.appendChild(loginForm);
  document.body.appendChild(loginOverlay);
  usernameInput.focus();
}

function hidePage() {
  document.querySelector("#loginOverlay").style.display = "none";
}

async function login() {
  const storedToken = localStorage.getItem("refreshToken");

  const jsonData = {
    username: username,
    password: password,
    ldapSourceId: 1,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
    redirect: "follow",
  };
  try {
    const response = await fetch(
      "https://support.wmed.edu/LiveTime/services/v1/auth/login",
      requestOptions
    );
    if (!response.ok) {
      const errorMSG = document.createElement("P");
      errorMSG.id = "err";
      errorMSG.textContent =
        "Incorrect Username or Password. Please try again.";
      document.querySelector("#userField").focus();

      if (document.querySelector("#err")) {
        document.querySelector("#err").remove();
        setTimeout(() => {
          document.querySelector("#loginOverlay > div").append(errorMSG);
        }, 200);
      } else {
        document.querySelector("#loginOverlay > div").append(errorMSG);
      }
    } else {
      document.querySelector("#loginOverlay").remove();
    }
    const result = await response.text();
    const loginOBJ = JSON.parse(result);
    console.log(loginOBJ);
    localStorage.setItem("refreshToken", loginOBJ.refreshToken);
    localStorage.setItem("authToken", loginOBJ.token);
  } catch (error) {
    console.log(error);
  }
}

const subjectline = document.querySelector("#subjectLine");
const savedSubject = localStorage.getItem("subject");
if (savedSubject) {
  subjectline.value = savedSubject;
  subject = savedSubject;
}
subjectline.addEventListener("input", function (event) {
  localStorage.setItem("subject", event.target.value);
  subject = event.target.value;
});
const searchItem = document.querySelector("#search");
const lastSearch = localStorage.getItem("lastSearch");
if (lastSearch) {
  searchItem.value = lastSearch;
  const inputEvent = new Event("input");
  searchItem.dispatchEvent(inputEvent);
}
let debounceTimeout;
searchItem.addEventListener("input", function (event) {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(async function () {
    localStorage.setItem("lastSearch", event.target.value);
    searchUser(event);
  }, 500);
});
let currentIndex = -1; // Tracks the currently highlighted result
let resultsArray = []; // Stores fetched results
let navigatingWithKeys = false; // Tracks if you're navigating via keys

// Trigger search when the search input changes.
document.getElementById("search").addEventListener("input", searchUser);

async function searchUser(event) {
  // If you're navigating with keys, skip updating the search.
  if (navigatingWithKeys) return;

  const searchTerm = event.target.value;
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://support.wmed.edu/LiveTime/services/v1/user/client/findusers?internalOnly=true&clientTypes=8&searchTerm=" +
        encodeURIComponent(searchTerm) +
        "&offset=0&limit=10&locale=en-US",
      requestOptions
    );

    if (!response.ok) {
      refreshToken();
      searchUser(event);
      return;
    }

    const JSONresponse = await response.json();
    resultsArray = JSONresponse.results;
    const resultContainer = document.querySelector("#resultBox");
    resultContainer.innerHTML = "";

    resultsArray.forEach((result, index) => {
      const resultItem = document.createElement("p");
      resultItem.className = "result";
      resultItem.textContent = result.fullName;
      resultItem.style.cursor = "pointer";

      // Click selection – when a result is clicked, select the user.
      resultItem.onclick = function () {
        selectUser(result);
      };

      resultContainer.appendChild(resultItem);
    });

    // Reset highlighted index.
    currentIndex = -1;
  } catch (error) {
    const resultContainer = document.querySelector("#resultBox");
    resultContainer.innerHTML = "<p>No results found</p>";
    console.error("Error fetching users:", error);
  }
}

// Keyboard Navigation for the search input.
document.getElementById("search").addEventListener("keydown", function (event) {
  const resultItems = document.querySelectorAll("#resultBox .result");

  // If there are no results and Tab is pressed, allow default behavior
  if (resultItems.length === 0 && event.key === "Tab") {
    return; // Let the browser handle it
  }

  // Use Tab or ArrowDown to cycle forward through results.
  if (event.key === "ArrowDown" || event.key === "Tab") {
    event.preventDefault(); // Prevent default focus change **only if results exist**
    navigatingWithKeys = true;
    if (resultsArray.length === 0) return;
    currentIndex = (currentIndex + 1) % resultsArray.length;
    updateHighlight(resultItems);
    return;
  }

  // Use ArrowUp to cycle backward.
  if (event.key === "ArrowUp") {
    event.preventDefault();
    navigatingWithKeys = true;
    if (resultsArray.length === 0) return;
    currentIndex =
      (currentIndex - 1 + resultsArray.length) % resultsArray.length;
    updateHighlight(resultItems);
    return;
  }

  // Allow selection of the highlighted result with Enter or Space.
  if ((event.key === "Enter" || event.key === " ") && currentIndex !== -1) {
    event.preventDefault();
    navigatingWithKeys = false;
    selectUser(resultsArray[currentIndex]);
    return;
  }
});

// Allow normal typing by resetting the navigation flag for keys that are not navigation.
document.getElementById("search").addEventListener("keyup", function (event) {
  if (!["Tab", "ArrowDown", "ArrowUp", " "].includes(event.key)) {
    navigatingWithKeys = false;
  }
});

// Updates visual highlighting of search results.
function updateHighlight(resultItems) {
  resultItems.forEach((item, index) => {
    if (index === currentIndex) {
      item.classList.add("highlight");
      // Optionally, update the search field with the highlighted name:
      document.getElementById("search").value =
        resultsArray[currentIndex].fullName;
    } else {
      item.classList.remove("highlight");
    }
  });
}

// Called when a user is selected (via click, Enter, or Space).
function selectUser(result) {
  const searchInput = document.getElementById("search");
  searchInput.value = result.fullName;
  searchInput.dispatchEvent(new Event("input"));
  localStorage.setItem("clientId", result.clientId);
  localStorage.setItem("lastSearch", result.fullName);
  addCopyButton(result);

  // Automatically focus the subject line after selection.
  document.getElementById("subjectLine").focus();
}

// Adds (or updates) the copy button next to the search field.
function addCopyButton(result) {
  let copyUserButton = document.querySelector("#copyButton");
  if (!copyUserButton) {
    copyUserButton = document.createElement("img");
    copyUserButton.id = "copyButton";
    document.querySelector("#searchAndCopy").appendChild(copyUserButton);
  }
  copyUserButton.src = "./Copy.png";
  copyUserButton.onclick = function () {
    navigator.clipboard.writeText(result.userName);
    copyUserButton.src = "./Check.png";
  };
}

const button2 = document.querySelectorAll("#myButton2");
button2.forEach((button) => {
  button.onclick = function () {
    var clientId = localStorage.getItem("clientId");
    var subject = localStorage.getItem("subject");
    if (clientId && subject) {
      localStorage.removeItem("subject");
      localStorage.removeItem("lastSearch");
      localStorage.removeItem("clientId");

      switch (button.textContent) {
        case "Phone Call":
          createQuickCall(subject, clientId, 277657);
          break;
        case "Walk-Up":
          createQuickCall(subject, clientId, 277658);
          break;
        case "Teams Message":
          createQuickCall(subject, clientId, 277661);
          break;
        default:
          console.error("Something went wrong");
          break;
      }
    } else {
      const warning = document.createElement("p");
      warning.textContent =
        "There was an issue creating the ticket, Please double check your values and submit again.";
      warning.style.color = "red";
      document.body.appendChild(warning);
    }
  };
});

async function createQuickCall(subject, clientId, itemId) {
  switch (itemId) {
    case 277657:
      subject = "Phone Call - " + subject;
      index = 10;
      break;
    case 277658:
      subject = "Walk Up - " + subject;
      index = 11;
      break;
    case 277661:
      subject = "Teams - " + subject;
      index = 12;
      break;
    default:
      console.error("Invalid itemId");
      return;
  }
  const raw = JSON.stringify({
    requestProcessIndex: "INCIDENT",
    clientId: clientId,
    subject: subject,
    itemId: itemId,
    classfication: 54,
    source: "WIDGET",
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      "Content-Type": "application/json",
    },
    body: raw,
    referrer: "https://support.wmed.edu/LiveTime/WebObjects/LiveTime",
    referrerPolicy: "strict-origin-when-cross-origin",

    mode: "cors",
  };

  try {
    const response = await fetch(
      "https://support.wmed.edu/LiveTime/services/v1/user/quickcall/request/quickCall/" +
        index +
        "?locale=en-US",
      requestOptions
    );
    if (!response.ok) {
      refreshToken();
      createQuickCall(subject, clientId, itemId);
      return;
    }
    const result = await response.json();
    console.log(result);

    const requestIdDiv = document.createElement("div");
    requestIdDiv.innerHTML = `<p style="display: inline;">Incident Created ID: </p><a href="https://support.wmed.edu/LiveTime/WebObjects/LiveTime.woa/wa/LookupRequest?sourceId=New&requestId=${result.requestId}" target="_blank">${result.requestId}</a>`;
    document.body.appendChild(requestIdDiv);
    setTimeout(() => {
      window.close();
    }, 3000);
  } catch (error) {
    if (error.message.includes("401")) {
      refreshToken();
      createQuickCall(subject, clientId, itemId);
    } else {
      console.error("Error:", error.message);
    }
  }
}
const toggleDark = document.querySelector("#theme-toggle");
var flip = localStorage.getItem("isDarkMode");
toggleDark.addEventListener("click", function () {
  console.log(flip);
  if (localStorage.getItem("isDarkMode") === "true") {
    toggleDark.src = chrome.runtime.getURL("./sun-solid.svg");
  } else {
    toggleDark.src = chrome.runtime.getURL("./moon-solid.svg");
  }
  document.body.classList.toggle("dark-mode");
  const copyUser = document.querySelector("#copyButton");
  if (copyUser) {
    copyUser.classList.toggle("dark-mode");
  }
  quickCallButtons.forEach((button) => {
    button.classList.toggle("dark-mode");
  });
  const isDarkMode = document.body.classList.contains("dark-mode");
  localStorage.setItem("isDarkMode", isDarkMode);
});
const quickCallButtons = document.querySelectorAll("#myButton2");
// On page load, check the saved preference and apply dark mode if needed
document.addEventListener("DOMContentLoaded", function () {
  const savedTheme = localStorage.getItem("isDarkMode");
  if (savedTheme === "true") {
    toggleDark.src = chrome.runtime.getURL("./moon-solid.svg");
    document.body.classList.add("dark-mode");
    quickCallButtons.forEach((button) => {
      button.classList.add("dark-mode");
    });
  } else {
    toggleDark.src = chrome.runtime.getURL("./sun-solid.svg");
  }
});
