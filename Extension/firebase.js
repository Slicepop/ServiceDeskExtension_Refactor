import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  remove,
  onDisconnect,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

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

// Chrome extension ID: gdggomhjdiocifkeokonihfmmmajflmnS
const ticketId = new URLSearchParams(window.location.search).get("requestId");
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

  const result = await response.json();
  const USERNAME = result.username;
  const CLIENT_ID = result.clientId;
  const FULL_NAME = result.fullName;
  console.log(USERNAME);
  const presenceRef = ref(db, `presence/${ticketId}/${CLIENT_ID}`);
  await set(presenceRef, {
    user: USERNAME,
    FullName: FULL_NAME,
    timestamp: Date.now(),
  });
  console.log("✅ Data written");

  // Read test
  const viewersRef = ref(db, `presence/${ticketId}`);
  onValue(viewersRef, (snapshot) => {
    const viewers = snapshot.val() || {};
    const names = Object.values(viewers)
      .map((user) => user.FullName)
      .join(", and ");

    displayPresence(names);
  });

  function displayPresence(names) {
    let el = document.getElementById("ViewTag");
    if (!el) {
      el = document.createElement("p");
      el.id = "ViewTag";
    }
    // Split names by ", and " and wrap each in <span style="font-weight: 500">
    const boldNames = names
      .split(", and ")
      .map((name) => `<span style="font-weight: 500">${name}</span>`)
      .join(", and ");
    el.innerHTML =
      boldNames.indexOf(", and ") === -1
        ? `👀 ${boldNames} is also viewing this ticket`
        : `👀 ${boldNames} are also viewing this ticket`;
    el.style.color = "#fff";
    document
      .querySelector("#editRequest > div.section_heading.mt-2.mb-2")
      .appendChild(el);
  }
  onDisconnect(presenceRef)
    .remove()
    .then(() => {
      set(presenceRef, {
        user: USERNAME,
        FullName: FULL_NAME,
        timestamp: Date.now(),
      });
    });
} catch (error) {
  console.log(error);
}
