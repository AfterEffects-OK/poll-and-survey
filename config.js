const CONFIG = {
  GAS_URL: 'https://script.google.com/macros/s/AKfycbxS3iC24BL4mNjUkLw0XJU2aQB2322mdtSTSI_WwpER2Zx1529-Yc8k8zCMUM0lSiLw/exec',
  POLL_INTERVAL_MS: 2500,
  DEFAULT_ROOM_ID: 'default',
  DEFAULT_ADMIN_ID: 'default',
  // 空文字の場合は現在のページ基準で index.html（room / admin パラメータ付き）を生成します
  VOTE_URL: '',
  // 配信者（adminId）ごとのヘッダ画像パス（未指定のIDは ./headers/{adminId}.png を参照）
  STREAMER_HEADER_BANNERS: {
    // zWqUjfLm: './headers/zWqUjfLm.png'
  }
};

function sanitizeConfigKey(raw, fallback) {
  const cleaned = String(raw || '')
    .trim()
    .replace(/[^a-zA-Z0-9_@-]/g, '');
  return cleaned || fallback;
}

function getRoomId() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('room') || params.get('roomId') || params.get('stream') || params.get('streamId') || '';
  return sanitizeConfigKey(raw, CONFIG.DEFAULT_ROOM_ID);
}

function getAdminId() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('admin') || params.get('adminId') || params.get('adminKey') || params.get('ownerId') || '';
  return sanitizeConfigKey(raw, CONFIG.DEFAULT_ADMIN_ID);
}

function buildPageUrlWithContext(filename, extraParams = {}) {
  const url = new URL('./' + filename, window.location.href);
  const roomId = getRoomId();
  const adminId = getAdminId();

  if (roomId && roomId !== CONFIG.DEFAULT_ROOM_ID) {
    url.searchParams.set('room', roomId);
  }
  if (adminId && adminId !== CONFIG.DEFAULT_ADMIN_ID) {
    url.searchParams.set('admin', adminId);
  }

  Object.entries(extraParams || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v) !== '') {
      url.searchParams.set(k, String(v));
    }
  });

  return url.href;
}

async function fetchGas(params = {}) {
  const url = new URL(CONFIG.GAS_URL);
  url.searchParams.set('roomId', getRoomId());
  url.searchParams.set('adminId', getAdminId());
  url.searchParams.set('_t', String(Date.now()));

  Object.entries(params || {}).forEach(([key, val]) => {
    if (val !== undefined && val !== null && String(val) !== '') {
      url.searchParams.set(key, String(val));
    }
  });

  const res = await fetch(url.toString(), {
    method: 'GET',
    cache: 'no-store'
  });
  return res.json();
}

async function postGas(payload = {}) {
  const body = Object.assign(
    {
      roomId: getRoomId(),
      adminId: getAdminId()
    },
    payload || {}
  );

  const res = await fetch(CONFIG.GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body)
  });
  return res.json();
}
