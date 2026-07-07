let interval;
let element;
let incidentCount = -1; // Initialize to -1 to ensure first fetch sets it
let lastKnownActionDate = null;
let alertAudio;
let intervalSelection;

let monitoring = false;
let monitoringState = false;
let authToken = null;
function unlockAudio() {
  if (!alertAudio) return;

  alertAudio
    .play()
    .then(() => {
      alertAudio.pause();
      alertAudio.currentTime = 0;
      console.log("Audio unlocked");
      document.removeEventListener("click", unlockAudio);
    })
    .catch((err) => {
      console.warn(err);
    });
}

document.addEventListener("click", unlockAudio);

(async () => {
  try {
    const response = await chrome.runtime.sendMessage({ event: "pageLoad" });
    console.log(response);
    monitoring = response.monitoring;
    monitoringState = monitoring == "true";
    if (monitoringState) startMonitoring();
  } catch (error) {
    console.error("Failed to get monitoring state:", error);
  }
})();
fetch("https://support.wmed.edu/LiveTime/images/incident.jpg", {
  headers: {
    "sec-ch-ua": '"Brave";v="149", "Chromium";v="149", "Not)A;Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
  },
  referrer: "https://support.wmed.edu/LiveTime/WebObjects/LiveTime.woa",
  body: null,
  method: "GET",
  mode: "cors",
});
async function getAuthToken() {
  response = await fetch(
    `https://support.wmed.edu/LiveTime/services/v1/user/requests/121103/basic`,
    {
      headers: {
        "zsd-source": "LT",
      },
    },
  );
  const data = await response.json();
  authToken = data.subject;
  return authToken;
}
function sendNotif(message, index) {
  const lastIndex = message.length - 1;
  if (alertAudio) {
    alertAudio.play().catch((err) => console.warn("Audio play blocked:", err));
  }
  console.log(index, "index");
  document.title = "📣 Service Manager";
  Swal.fire({
    color: "#fff",
    title: `A ticket just landed!`,
    icon: "warning",
    iconColor: "#4ddfd4",
    background: "#282a2b",
    text: `Subject - ${message[index].title}`,
    confirmButtonText: "Take me there!",
    confirmButtonColor: "#07ada1",
    showCancelButton: true,
    cancelButtonText: "Close",
    reverseButtons: true,
    theme: "auto",
    padding: "0 0 2.5rem",
  }).then((result) => {
    document.title = "👁 Service Manager";

    if (result.isConfirmed) {
      window.open(
        `https://support.wmed.edu/LiveTime/WebObjects/LiveTime.woa/wa/LookupRequest?sourceId=New&requestId=${message[index].id}`,
      );
    }
    const refreshIcon = document.querySelector(
      "#requestfiltercard > div.card-body.pt-0 > zsd-requestfilter > div.main-filter-wrapper > div.tabheader > span.reseticon",
    );
    if (refreshIcon) refreshIcon.click();
    if (index < lastIndex) {
      sendNotif(message, ++index);
    }
  });
}
function startMonitoring() {
  document.title = "👁 Service Manager";
  monitoringState = true;
  let reconnectAttempts = 0;
  function retryConnection(delay) {
    reconnectAttempts++;
    if (!monitoringState) return;
    console.log(`Reconnecting in ${delay}ms...`);
    setTimeout(establishConnection, delay);
  }
  async function establishConnection() {
    const token = authToken || (await getAuthToken());
    websocket = new WebSocket(wsURI);
    websocket.onopen = () => {
      websocket.send(JSON.stringify({ type: "AUTH", token }));
    };
    console.log("establishing websocket Connection");
    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message?.type == "status") {
        console.log(message.status);
        return;
      } else if (message?.type == "notification") {
        for (const notif of message.notification) {
          console.log(notif);
        }
        sendNotif(message.notification, 0);
        return;
      }
    };
    websocket.onclose = () => {
      console.log("Connection closed:", event);

      let delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
      retryConnection(delay);
    };
  }
  establishConnection();
  alertAudio = new Audio(chrome.runtime.getURL("fearstofathom.mp3"));
}
let websocket = null;
// const wsURI = "wss://dev.slicepop.dev";
const wsURI = "wss://hephaestus.slicepop.dev";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startMonitoring") {
    startMonitoring();
  } else if (request.action === "stopMonitoring") {
    if (websocket) websocket.close();
    monitoringState = false;
    document.title = "Service Manager";
  }
});

// window.startMonitoring = startMonitoring;
// window.stopMonitoring = stopMonitoring;
