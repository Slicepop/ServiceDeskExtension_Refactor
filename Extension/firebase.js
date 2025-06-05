import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onDisconnect,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
import {
  getAuth,
  signInWithCustomToken,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDNV2liFFMknbW_vIk5SsnvFsnRdgEfhDE",
  authDomain: "test-1a7d4.firebaseapp.com",
  databaseURL: "https://test-1a7d4-default-rtdb.firebaseio.com",
  projectId: "test-1a7d4",
  storageBucket: "test-1a7d4.firebasestorage.app",
  messagingSenderId: "509430067696",
  appId: "1:509430067696:web:f28e1f4c6d21ab32776d35",
  measurementId: "G-PNVVZD749V",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

const ticketId = new URLSearchParams(window.location.search).get("requestId");

let darkreaderActive = false;
if (window.DarkReader && typeof window.DarkReader.isEnabled === "function") {
  darkreaderActive = window.DarkReader.isEnabled();
} else if (
  document.querySelector('meta[name="darkreader"]') ||
  document.querySelector("style#dark-reader-style")
) {
  darkreaderActive = true;
}

// Fetch user info from /me endpoint
async function fetchUserInfo() {
  try {
    const response = await fetch(
      `https://support.wmed.edu/LiveTime/services/v1/me`,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "zsd-source": "LT",
        },
        referrerPolicy: "strict-origin-when-cross-origin",
        method: "GET",
        mode: "cors",
        credentials: "include",
      }
    );
    if (!response.ok)
      throw new Error(`Failed fetching /me: ${response.status}`);
    const result = await response.json();
    return result; // Expect { username, fullName, clientId? }
  } catch (error) {
    console.error("Failed to fetch user info:", error);
    throw error;
  }
}

// Fetch Firebase custom token from your backend using clientID
async function fetchCustomToken(clientID) {
  try {
    const response = await fetch(
      "https://w1fxzn8yp9.execute-api.us-east-2.amazonaws.com/PROD/SupplyFireBaseAuth",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientID }),
      }
    );
    if (!response.ok)
      throw new Error(`Failed fetching custom token: ${response.status}`);
    const data = await response.json();
    if (data && data.token) {
      return data.token;
    } else {
      throw new Error("No token received from backend");
    }
  } catch (err) {
    console.error("Failed to fetch custom token:", err);
    throw err;
  }
}

// Handle presence in Firebase Realtime Database
async function handlePresence(user, fullName) {
  try {
    const CLIENT_ID = user.uid;

    const presenceRef = ref(db, `presence/${ticketId}/${CLIENT_ID}`);
    await set(presenceRef, {
      clientId: CLIENT_ID,
      FullName: fullName,
      timestamp: Date.now(),
    });

    onDisconnect(presenceRef).remove();

    const viewersRef = ref(db, `presence/${ticketId}`);
    onValue(viewersRef, (snapshot) => {
      const viewers = snapshot.val() || {};
      const names = Object.values(viewers)
        .filter((user) => user.clientId !== CLIENT_ID)
        .map((user) => user.FullName)
        .join(", and ");

      displayPresence(names);
    });
    function injectPresenceStyles() {
      if (document.getElementById("presence-style")) return;

      const style = document.createElement("style");
      style.id = "presence-style";
      style.textContent = `
      @keyframes subtleFadeIn {
        from { opacity: 0; transform: translateY(-8px);}
        to { opacity: 1; transform: translateY(0);}
      }

      #ViewTag.presence-banner {
        background: linear-gradient(90deg, ${
          darkreaderActive ? "#23272e" : "#e8f7f6"
        } 0%, ${darkreaderActive ? "#1a1d22" : "#fafdfe"} 100%);
        color: ${darkreaderActive ? "#e0e0e0" : "#222"};
        border-left: 5px solid #07ada1;
        border-right: 1px solid ${darkreaderActive ? "#222" : "#e0f7f7"};
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 1rem;
        font-family: 'Segoe UI', 'Arial', sans-serif;
        text-align: left;
        margin-bottom: 16px;
        box-shadow: 0 4px 18px 0 rgba(7,173,161,0.09), 0 1.5px 4px 0 rgba(0,0,0,0.03);
        animation: subtleFadeIn 0.7s cubic-bezier(.4,1.4,.6,1) 1;
        transition: background 0.25s, color 0.25s, box-shadow 0.25s;
        z-index: 1000;
        position: relative;
        user-select: none;
      }

      #ViewTag.presence-banner:hover {
        background: linear-gradient(90deg, ${
          darkreaderActive ? "#1a1d22" : "#d2f5f2"
        } 0%, ${darkreaderActive ? "#23272e" : "#e8f7f6"} 100%);
        color: ${darkreaderActive ? "#fff" : "#111"};
        box-shadow: 0 6px 24px 0 rgba(7,173,161,0.18), 0 2px 8px 0 rgba(0,0,0,0.04);
      }

      .viewer-name {
        font-weight: 600;
        color: #07ada1;
        padding: 2px 6px;
        border-radius: 4px;
        background: ${
          darkreaderActive ? "rgba(7,173,161,0.13)" : "rgba(7,173,161,0.11)"
        };
        margin: 0 2px;
        transition: background 0.18s, color 0.18s;
        display: inline-block;
      }

      .viewer-name:hover {
        background: ${
          darkreaderActive ? "rgba(7,173,161,0.22)" : "rgba(7,173,161,0.19)"
        };
        color: #048c7e;
        cursor: pointer;
      }

      .viewer-icon {
        margin-right: 8px;
        color: #07ada1;
        font-size: 1.15em;
        vertical-align: middle;
        filter: drop-shadow(0 1px 1px rgba(7,173,161,0.08));
      }
    `;
      document.head.appendChild(style);
    }

    function displayPresence(names) {
      injectPresenceStyles();

      let el = document.getElementById("ViewTag");
      if (!el) {
        el = document.createElement("div");
        el.id = "ViewTag";
        el.className = "presence-banner";
      }

      if (!names || names.trim() === "") {
        el.innerHTML = "";
        el.style.display = "none";
      } else {
        const formattedNames = names
          .split(", and ")
          .map((name) => `<span class="viewer-name">${name}</span>`)
          .join(", and ");

        const isMultiple = names.includes(", and ");
        const icon = isMultiple
          ? '<i class="fa fa-users viewer-icon"></i>'
          : darkreaderActive === true
          ? '<i class="fa fa-user darkMode"></i>'
          : `<i class="fa fa-user lightMode"></i>`;

        el.innerHTML = `
      ${icon} ${formattedNames} ${
          isMultiple ? "are" : "is"
        } also viewing this ticket
    `;
        el.style.display = "block";
      }

      const container = document.querySelector(
        "#editRequest > div.section_heading.mt-2.mb-2"
      );
      if (container && !el.parentNode) {
        container.prepend(el);
      }
    }
  } catch (error) {
    console.error("Error handling presence:", error);
  }
}

// Main async IIFE to orchestrate auth and presence flow
(async function main() {
  try {
    const userInfo = await fetchUserInfo();
    const CLIENT_ID = userInfo.clientId || userInfo.username || null;
    if (!CLIENT_ID) throw new Error("No client ID found in /me response");

    const customToken = await fetchCustomToken(CLIENT_ID);

    await signInWithCustomToken(auth, customToken);

    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Signed in with custom token:", user.uid);
        handlePresence(user, userInfo.fullName);
      } else {
        console.log("User signed out");
      }
    });
  } catch (err) {
    console.error("Authentication or initialization failed:", err);
  }
})();
