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
  loginForm.style.padding = "30px";
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
  loginButton.id = "loginBTN";
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
  const loginBTN = document.querySelector("#loginBTN");
  loginBTN.style.opacity = "0";

  const jsonData = {
    username,
    password,
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
      loginBTN.style.opacity = "1";

      // Ensure only one error message
      const existingError = document.querySelector("#err");
      if (existingError) existingError.remove();

      const errorMSG = document.createElement("p");
      errorMSG.id = "err";
      errorMSG.textContent =
        "Incorrect Username or Password. Please try again.";
      document.querySelector("#userField").focus();

      document.querySelector("#loginOverlay > div").append(errorMSG);

      return; // ✅ Stop here if login failed
    }

    // ✅ Success path
    const loginOBJ = await response.json();
    localStorage.setItem("refreshToken", loginOBJ.refreshToken);
    localStorage.setItem("authToken", loginOBJ.token);

    hidePage(); // consistent overlay removal
  } catch (error) {
    console.error("Login error:", error);
    loginBTN.style.opacity = "1";
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
let currentIndex = -1; // Tracks the currently highlighted result
let resultsArray = []; // Stores fetched results
let navigatingWithKeys = false; // Tracks if you're navigating via keys

// Debounce wrapper for searchUser
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

async function searchUser(event) {
  // If you're navigating with keys, skip updating the search.
  if (navigatingWithKeys) return;

  const searchTerm = event.target.value;
  // If the search term is empty, clear results and stop
  if (searchTerm.trim() === "") {
    const resultContainer = document.querySelector("#resultBox");
    resultContainer.innerHTML = "";
    resultsArray = [];
    currentIndex = -1;
    return;
  }

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
        encodeURIComponent(searchTerm.trim()) +
        "&offset=0&limit=10&locale=en-US",
      requestOptions
    );

    if (!response.ok) {
      // If the token is invalid, attempt to refresh and then retry the search
      const refreshed = await refreshToken();
      if (refreshed) {
        searchUser(event); // Retry the search after successful token refresh
      } else {
        createLoginPage(); // If refresh failed, show login page
      }
      return;
    }

    const JSONresponse = await response.json();
    resultsArray = JSONresponse.results;
    const resultContainer = document.querySelector("#resultBox");
    resultContainer.innerHTML = "";

    if (resultsArray.length === 0) {
      resultContainer.innerHTML = "<p>No results found</p>";
    } else {
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
    }

    // Reset highlighted index.
    currentIndex = -1;
  } catch (error) {
    const resultContainer = document.querySelector("#resultBox");
    resultContainer.innerHTML = "<p>Error fetching results</p>";
    console.error("Error fetching users:", error);
  }
}

const debouncedSearchUser = debounce(searchUser, 300); // Increased debounce time slightly

// Attach the *single* input event listener
searchItem.addEventListener("input", function (event) {
  localStorage.setItem("lastSearch", event.target.value); // Save immediately
  debouncedSearchUser(event);
});

// Load and trigger search if there's a last search
const lastSearch = localStorage.getItem("lastSearch");
if (lastSearch) {
  searchItem.value = lastSearch;
  // Manually call the debounced search. We don't need to dispatch an event.
  // We need to create a mock event object for searchUser to work correctly.
  debouncedSearchUser({ target: searchItem });
}

// Keyboard Navigation for the search input.
document.getElementById("search").addEventListener("keydown", function (event) {
  const resultItems = document.querySelectorAll("#resultBox .result");

  // If there are no results and Tab is pressed, allow default behavior
  if (resultsArray.length === 0 && event.key === "Tab") {
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
  // Only reset if a *typing* key is pressed and not a navigation key
  if (
    event.key.length === 1 || // Is it a printable character?
    event.key === "Backspace" ||
    event.key === "Delete"
  ) {
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
  // We no longer need to dispatch 'input' here because the value is set
  // and the search box is cleared.
  // searchInput.dispatchEvent(new Event("input"));
  localStorage.setItem("clientId", result.clientId);
  localStorage.setItem("lastSearch", result.fullName);
  addCopyButton(result);

  // Clear the search results box
  document.querySelector("#resultBox").innerHTML = "";
  resultsArray = []; // Clear the array as well
  currentIndex = -1; // Reset highlight

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
  copyUserButton.src = chrome.runtime.getURL("./images/Copy.png");
  copyUserButton.onclick = function () {
    navigator.clipboard.writeText(result.userName);
    copyUserButton.src = chrome.runtime.getURL("./images/Check.png");
    setTimeout(() => {
      // Reset the icon after a short delay
      copyUserButton.src = chrome.runtime.getURL("./images/Copy.png");
    }, 1500); // 1.5 seconds
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
      // Clear the input fields visually
      document.querySelector("#search").value = "";
      document.querySelector("#subjectLine").value = "";
      // Remove the copy button
      const copyButton = document.querySelector("#copyButton");
      if (copyButton) {
        copyButton.remove();
      }

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
      warning.id = "submissionWarning"; // Add an ID to easily remove it
      // Ensure only one warning message is present
      const existingWarning = document.querySelector("#submissionWarning");
      if (existingWarning) {
        existingWarning.remove();
      }
      document.body.appendChild(warning);
      // Remove the warning after a few seconds
      setTimeout(() => {
        if (document.querySelector("#submissionWarning")) {
          document.querySelector("#submissionWarning").remove();
        }
      }, 5000); // 5 seconds
    }
  };
});

async function createQuickCall(subject, clientId, itemId) {
  let index;
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
    classfication: 54, // Make sure this is a valid classification ID
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
      // If unauthorized, try to refresh token and retry.
      // If the status is 401, it means token is invalid.
      if (response.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          // Retry the request after successful token refresh
          await createQuickCall(subject, clientId, itemId);
        } else {
          // If refresh failed, display login page
          createLoginPage();
        }
      } else {
        // Handle other HTTP errors
        console.error(
          `Error creating quick call: ${response.status} ${response.statusText}`
        );
        const errorText = await response.text();
        console.error("Response body:", errorText);
        // Display a user-friendly error message
        const warning = document.createElement("p");
        warning.textContent = `Failed to create ticket: ${response.statusText}. Please try again or contact support.`;
        warning.style.color = "red";
        warning.id = "creationError";
        const existingError = document.querySelector("#creationError");
        if (existingError) {
          existingError.remove();
        }
        document.body.appendChild(warning);
        setTimeout(() => {
          if (document.querySelector("#creationError")) {
            document.querySelector("#creationError").remove();
          }
        }, 5000);
      }
      return; // Stop further execution in this try block if not ok
    }
    const result = await response.json();
    console.log(result);

    const requestIdDiv = document.createElement("div");
    requestIdDiv.innerHTML = `<p style="display: inline;">Incident Created ID: </p><a href="https://support.wmed.edu/LiveTime/WebObjects/LiveTime.woa/wa/LookupRequest?sourceId=New&requestId=${result.requestId}" target="_blank">${result.requestId}</a>`;

    // Remove any previous incident ID messages
    const existingRequestIdDiv = document.querySelector("#incidentIdMessage");
    if (existingRequestIdDiv) {
      existingRequestIdDiv.remove();
    }
    requestIdDiv.id = "incidentIdMessage"; // Add ID for easier removal
    document.body.appendChild(requestIdDiv);

    // Hide the incident ID message after a delay and close the window
    setTimeout(() => {
      if (document.querySelector("#incidentIdMessage")) {
        document.querySelector("#incidentIdMessage").remove();
      }
      window.close();
    }, 3000); // Hide message after 3 seconds and then close
  } catch (error) {
    console.error("Network or parsing error:", error.message);
    // Display a network error message
    const warning = document.createElement("p");
    warning.textContent =
      "Network error, please check your connection and try again.";
    warning.style.color = "red";
    warning.id = "networkError";
    const existingError = document.querySelector("#networkError");
    if (existingError) {
      existingError.remove();
    }
    document.body.appendChild(warning);
    setTimeout(() => {
      if (document.querySelector("#networkError")) {
        document.querySelector("#networkError").remove();
      }
    }, 5000);
  }
}
const toggleDark = document.querySelector("#theme-toggle");
var flip = localStorage.getItem("isDarkMode");
toggleDark.addEventListener("click", function () {
  console.log(flip);
  if (localStorage.getItem("isDarkMode") === "true") {
    toggleDark.src = chrome.runtime.getURL("./images/sun-solid.svg");
  } else {
    toggleDark.src = chrome.runtime.getURL("./images/moon-solid.svg");
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
    toggleDark.src = chrome.runtime.getURL("./images/moon-solid.svg");
    document.body.classList.add("dark-mode");
    quickCallButtons.forEach((button) => {
      button.classList.add("dark-mode");
    });
  } else {
    toggleDark.src = chrome.runtime.getURL("./images/sun-solid.svg");
  }
});
