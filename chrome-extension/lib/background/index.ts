const BLOCKED_SITES_URL = 'https://raw.githubusercontent.com/jankocian/smejdb/main/smejdb.json';
const UPDATE_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

type BlockedSite = {
  url: string;
  sourceUrl: string;
  sourceName: string;
  sourceSlug: string;
};

/**
 * Fetching and updating the blocklist
 */
async function fetchBlockedSites() {
  const response = await fetch(BLOCKED_SITES_URL);
  const sites: BlockedSite[] = await response.json();
  const timestamp = Date.now();
  chrome.storage.local.set({ blockedSites: sites, lastUpdate: timestamp });
}

chrome.runtime.onInstalled.addListener(() => {
  fetchBlockedSites();
});

async function checkForUpdates() {
  const { lastUpdate } = await chrome.storage.local.get('lastUpdate');
  const now = Date.now();
  if (!lastUpdate || now - lastUpdate > UPDATE_INTERVAL) {
    fetchBlockedSites();
  }
}

chrome.runtime.onStartup.addListener(() => {
  checkForUpdates();
});

chrome.alarms.create('smejdblockUpdateChecker', { periodInMinutes: 60 * 24 * 7 }); // Check once a week
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'smejdblockUpdateChecker') {
    checkForUpdates();
  }
});

/**
 * Blocking the sites
 */
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    const { blockedSites } = await chrome.storage.local.get('blockedSites');
    const isBlocked = blockedSites.some((site: BlockedSite) => tab?.url?.includes(site.url));

    if (isBlocked) {
      chrome.tabs.update(tabId, { url: chrome.runtime.getURL('blocked-tab/index.html') });
    }
  }
});

/**
 * Manual block
 */
export async function blockCurrentPage() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const blockedSites = (await chrome.storage.local.get('blockedSites')).blockedSites || [];
  blockedSites.push({ url: tab.url, sourceUrl: '', sourceName: 'Manual Block', sourceSlug: 'manual' });
  chrome.storage.local.set({ blockedSites });
  alert('Current page blocked.');
  // Optionally send this information to a remote server
  // fetch('https://your-server.com/block', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ url: tab.url }),
  // });
}
