let interval;
let element;
let incidentCount = -1; // Initialize to -1 to ensure first fetch sets it
let lastKnownActionDate = null;
let alertAudio;
let intervalSelection;

let monitoring = false;
let monitoringState = false;
(async () => {
  try {
    const response = await chrome.runtime.sendMessage({ event: "pageLoad" });
    console.log(response, "ASDSADSD");
    monitoring = response.monitoring;
    monitoringState = monitoring == "true";
    if (monitoringState) startMonitoring();
  } catch (error) {
    console.error("Failed to get monitoring state:", error);
  }
})();
function sendNotif(message) {
  document.title = "📣 Service Manager";
  Swal.fire({
    color: "#fff",
    title: `A ticket just landed!`,
    icon: "warning",
    iconColor: "#4ddfd4",
    background: "#282a2b",
    text: `Subject - ${message.title}`,
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
        `https://support.wmed.edu/LiveTime/WebObjects/LiveTime.woa/wa/LookupRequest?sourceId=New&requestId=${message.id}`,
      );
    }
    const refreshIcon = document.querySelector(
      "#requestfiltercard > div.card-body.pt-0 > zsd-requestfilter > div.main-filter-wrapper > div.tabheader > span.reseticon",
    );
    if (refreshIcon) refreshIcon.click();
  });

  if (alertAudio) {
    alertAudio.play().catch((err) => console.warn("Audio play blocked:", err));
  }
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
  function establishConnection() {
    websocket = new WebSocket(wsURI);
    console.log("establishing websocket Connection");
    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      sendNotif(message);
    };
    websocket.onclose = () => {
      console.log("Connection closed:", event);

      let delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
      retryConnection(delay);
    };
  }
  establishConnection();
  alertAudio = new Audio(chrome.runtime.getURL("fearstofathom.mp3"));
  alertAudio.volume = 0;
  alertAudio
    .play()
    .then(() => {
      alertAudio.pause();
      alertAudio.currentTime = 0;
      alertAudio.volume = 1;
    })
    .catch((e) => console.warn("Audio pre warm failed:", e));
}
let websocket = null;
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
function unlockAudio() {
  if (!alertAudio) return;

  alertAudio
    .play()
    .then(() => {
      alertAudio.pause();
      alertAudio.currentTime = 0;
      console.log("Audio unlocked");
    })
    .catch(console.warn);

  document.removeEventListener("click", unlockAudio);
}

document.addEventListener("click", unlockAudio);
