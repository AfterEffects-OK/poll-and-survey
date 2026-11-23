const CONFIG = {
  GAS_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
  POLL_INTERVAL_MS: 2500
};

async function postGas(payload) {
  const res = await fetch(CONFIG.GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

async function fetchGas(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query ? `${CONFIG.GAS_URL}?${query}` : CONFIG.GAS_URL;
  const res = await fetch(url, { cache: 'no-store' });
  return res.json();
}