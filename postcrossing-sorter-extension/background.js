// background.js (Chrome MV3)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action !== "sort_tabs") return;

  chrome.tabs.query({}, (tabs) => {
    try {
      // Keep only tabs that match the postcard URL pattern
      const postcardTabs = tabs
        .map(t => {
          const m = t.url && t.url.match(/postcards\/[A-Z]{2}-(\d+)/i);
          if (!m) return null;
          return {
            id: t.id,
            windowId: t.windowId,
            index: t.index,
            url: t.url,
            num: parseInt(m[1], 10)
          };
        })
        .filter(Boolean);

      if (postcardTabs.length === 0) {
        console.log("No postcard tabs found.");
        return;
      }

      // Group by windowId so we reorder inside each window separately
      const byWindow = postcardTabs.reduce((acc, t) => {
        (acc[t.windowId] ||= []).push(t);
        return acc;
      }, {});

      // For each window, sort by numeric id and move tabs
      for (const windowIdStr of Object.keys(byWindow)) {
        const windowId = Number(windowIdStr);
        const arr = byWindow[windowId];

        // Find the smallest index among these tabs so we can place sorted tabs starting there
        const startIndex = Math.min(...arr.map(t => t.index));

        // Sort by numeric id ascending
        arr.sort((a, b) => a.num - b.num);

        // Move each tab to its new spot (one by one)
        // We move them to consecutive indices starting at startIndex.
        // Note: Chrome will adjust indices as we move tabs—moving in order from i=0.. keeps intended order.
        arr.forEach((tabObj, i) => {
          chrome.tabs.move(tabObj.id, { index: startIndex + i }, () => {
            if (chrome.runtime.lastError) {
              console.warn("Move error:", chrome.runtime.lastError.message);
            }
          });
        });
      }

      console.log("Sorted postcard tabs by numeric ID.");
    } catch (err) {
      console.error("Error sorting tabs:", err);
    }
  });
});
