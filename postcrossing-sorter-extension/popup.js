// popup.js
document.getElementById("sortTabs").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "sort_tabs" });
  // optionally close popup after triggering
  window.close();
});
