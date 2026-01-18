
const BASE_URL = 'https://apis.luckylunricants.in/api';

const getHeaders = () => {
  const token = localStorage.getItem('lucky_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const getUserId = () => {
  const id = localStorage.getItem('lucky_user_id');
  return id ? parseInt(id, 10) : null;
};

const handleResponse = async (res: Response) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // If it's a 404 or 500, "Failed to fetch" usually doesn't trigger, 
    // but the error message from server will be caught here.
    throw new Error(data.message || data.error || `Server Error: ${res.status}`);
  }
  return data;
};

export const api = {
  // --- AUTH ---
  async login(payload: { identifier: string; password: string }) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await handleResponse(res);
    const userId = data.user?.id || data.userId || data.id;
    if (userId) {
      localStorage.setItem('lucky_user_id', userId.toString());
    }
    if (data.access_token) {
      localStorage.setItem('lucky_token', data.access_token);
      localStorage.setItem('lucky_session_start', Date.now().toString());
    }
    return data;
  },

  async register(payload: any) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async getProfile() {
    const userId = getUserId();
    const res = await fetch(`${BASE_URL}/auth/profile?user_id=${userId}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async uploadProfileImage(file: File) {
    const token = localStorage.getItem('lucky_token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('user_id', String(getUserId()));

    const res = await fetch(`${BASE_URL}/auth/profile/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return handleResponse(res);
  },

  // --- WALLET & SCANNING ---
  async getBalance() {
    const userId = getUserId();
    const res = await fetch(`${BASE_URL}/wallet/balance?user_id=${userId}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async scanVoucher(uuid: string) {
    const res = await fetch(`${BASE_URL}/wallet/scan`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        uuid: uuid,
        user_id: getUserId()
      }),
    });
    return handleResponse(res);
  },

  async getTransactions() {
    const userId = getUserId();
    const res = await fetch(`${BASE_URL}/wallet/transactions?user_id=${userId}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // --- REWARDS & REDEMPTION ---
  async getRewards() {
    const res = await fetch(`${BASE_URL}/rewards/list`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async redeemReward(rewardId: string | number) {
    const res = await fetch(`${BASE_URL}/rewards/redeem`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        reward_id: typeof rewardId === 'string' ? parseInt(rewardId, 10) : rewardId,
        user_id: getUserId()
      }),
    });
    return handleResponse(res);
  },

  async getRedemptionHistory() {
    const userId = getUserId();
    const res = await fetch(`${BASE_URL}/rewards/history?user_id=${userId}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // --- PRODUCT CATALOG & ORDERS ---
  async getProducts() {
    const res = await fetch(`${BASE_URL}/products/list`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async addToCart(productId: string | number) {
    const res = await fetch(`${BASE_URL}/products/cart/add`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        product_id: productId,
        user_id: getUserId()
      }),
    });
    return handleResponse(res);
  },

  async placeOrder() {
    const userId = getUserId();
    if (!userId) throw new Error("User session expired. Please login again.");

    const res = await fetch(`${BASE_URL}/products/order/place`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        user_id: userId
      }),
    });
    return handleResponse(res);
  },

  // --- CONTENT & SUPPORT ---
  async contactSupport(payload: { subject: string; message: string }) {
    const res = await fetch(`${BASE_URL}/content/support/contact`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        ...payload,
        user_id: getUserId()
      }),
    });
    return handleResponse(res);
  },

  async getBanners() {
    const res = await fetch(`${BASE_URL}/content/banners`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async getNotifications() {
    const userId = getUserId();
    const res = await fetch(`${BASE_URL}/content/notifications?user_id=${userId}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  }
};
