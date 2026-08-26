/* ==========================================================================
   PIXEL STEWARD 2.0 - CORE JAVASCRIPT APPLICATION ENGINE
   Dual Currency (USD/THB) | Dime-Style Holdings | Dedicated Cash Buffer
   Realtime Firebase Sync | Live Market Data | Obsidian & AI Exporter
   ========================================================================== */

// --- 1. FIREBASE CONFIGURATION (Reusing Existing Project) ---
const firebaseConfig = {
  apiKey: "AIzaSyD-FLJd2vKaFX-2F8kzE87inrmGEH5pyzY",
  authDomain: "pixel-steward-db.firebaseapp.com",
  databaseURL: "https://pixel-steward-db-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pixel-steward-db",
  storageBucket: "pixel-steward-db.firebasestorage.app",
  messagingSenderId: "36576321084",
  appId: "1:36576321084:web:315c61237093e616e06d39"
};

// --- 2. DEFAULT INVESTMENT POLICY (Loaded from Latest User Backup & IPS) ---
const INITIAL_PORTFOLIOS = [
  {
    id: 'zero1',
    name: 'Zero 1 (เงินฉุกเฉิน & รักษาเยียวยา)',
    emoji: '🎃',
    color: '#ff6b6b',
    category: 'Emergency',
    tier: 'Tier 1',
    timeHorizon: '4 Years',
    goalTHB: 95000.00,
    goalUSD: 2915.00,
    cashBufferUSD: 15.08,
    notes: 'เงินสำรองห้ามแตะต้องเว้นแต่จำเป็น • Horizon: 4 Years',
    logo: 'assets/foliologo/zero1.png',
    holdings: [
      { id: 'h-wmt', ticker: 'WMT', name: 'Walmart Inc.', shares: 0.0470276, avgCostUSD: 116.5887, currentPriceUSD: 116.53, change1dPct: -0.13, targetTHB: 12000 },
      { id: 'h-msft', ticker: 'MSFT', name: 'Microsoft Corp.', shares: 0.0036587, avgCostUSD: 428.356, currentPriceUSD: 495.40, change1dPct: 0.45, targetTHB: 15000 },
      { id: 'h-v', ticker: 'V', name: 'Visa Inc.', shares: 0.0026955, avgCostUSD: 309.968, currentPriceUSD: 364.15, change1dPct: 0.12, targetTHB: 20000 },
      { id: 'h-tisco', ticker: 'TISCO.BK', name: 'TISCO Financial Group', shares: 0.00, avgCostUSD: 2.85, currentPriceUSD: 2.85, change1dPct: 0.00, targetTHB: 12000 },
      { id: 'h-kept', ticker: 'KEPT', name: 'Kept by Krungsri (Cash)', shares: 0.00, avgCostUSD: 1.00, currentPriceUSD: 1.00, change1dPct: 0.00, targetTHB: 36000 }
    ]
  },
  {
    id: 'zero2',
    name: 'Zero 2 (รถ)',
    emoji: '💐',
    color: '#a855f7',
    category: 'Asset',
    tier: 'Tier 2',
    timeHorizon: '3 Years',
    goalTHB: 1200000.00,
    goalUSD: 36821.11,
    targetCashBufferTHB: 180000,
    cashBufferUSD: 0.00,
    notes: 'สะสมดาวน์รถยนต์คันใหม่ • Cash Buffer = 180,000 ฿ • Horizon: 3 Years',
    logo: 'assets/foliologo/zero2.png',
    holdings: [
      { id: 'h-nvda', ticker: 'NVDA', name: 'NVIDIA Corporation', shares: 0.065108, avgCostUSD: 199.6682, currentPriceUSD: 225.16, change1dPct: -0.98, targetTHB: 120000 },
      { id: 'h-tmo', ticker: 'TMO', name: 'Thermo Fisher Scientific', shares: 0.012168, avgCostUSD: 585.4779, currentPriceUSD: 588.29, change1dPct: 0.85, targetTHB: 120000 },
      { id: 'h-pltr', ticker: 'PLTR', name: 'Palantir Technologies', shares: 0.0225434, avgCostUSD: 131.9289, currentPriceUSD: 174.04, change1dPct: 2.40, targetTHB: 60000 },
      { id: 'h-abt', ticker: 'ABT', name: 'Abbott Laboratories', shares: 0.0026639, avgCostUSD: 109.044, currentPriceUSD: 111.25, change1dPct: 0.20, targetTHB: 180000 },
      { id: 'h-nee', ticker: 'NEE', name: 'NextEra Energy', shares: 0.00, avgCostUSD: 75.00, currentPriceUSD: 75.00, change1dPct: 0.00, targetTHB: 300000 },
      { id: 'h-jpm', ticker: 'JPM', name: 'JPMorgan Chase & Co.', shares: 0.00, avgCostUSD: 200.00, currentPriceUSD: 200.00, change1dPct: 0.00, targetTHB: 120000 }
    ]
  },
  {
    id: 'zero4',
    name: 'Zero 4 (แต่งงาน)',
    emoji: '💖',
    color: '#ec4899',
    category: 'Life Goal',
    tier: 'Tier 2',
    timeHorizon: '5 Years',
    goalTHB: 600000.00,
    goalUSD: 18410.56,
    targetCashBufferTHB: 200000,
    cashBufferUSD: 0.00,
    notes: 'ทุนแต่งงานในอนาคต • Cash Buffer = 200,000 ฿ • Horizon: 5 Years',
    logo: 'assets/foliologo/zero4.png',
    holdings: [
      { id: 'h-cost', ticker: 'COST', name: 'Costco Wholesale Corp.', shares: 0.00, avgCostUSD: 850.00, currentPriceUSD: 870.00, change1dPct: 0.00, targetTHB: 80000 },
      { id: 'h-lly', ticker: 'LLY', name: 'Eli Lilly and Company', shares: 0.00, avgCostUSD: 920.00, currentPriceUSD: 940.00, change1dPct: 0.00, targetTHB: 80000 },
      { id: 'h-unh', ticker: 'UNH', name: 'UnitedHealth Group', shares: 0.00, avgCostUSD: 540.00, currentPriceUSD: 550.00, change1dPct: 0.00, targetTHB: 80000 },
      { id: 'h-hd', ticker: 'HD', name: 'Home Depot Inc.', shares: 0.00, avgCostUSD: 360.00, currentPriceUSD: 365.00, change1dPct: 0.00, targetTHB: 80000 },
      { id: 'h-mcd', ticker: 'MCD', name: 'McDonald\'s Corp.', shares: 0.00, avgCostUSD: 280.00, currentPriceUSD: 285.00, change1dPct: 0.00, targetTHB: 80000 }
    ]
  },
  {
    id: 'zero3',
    name: 'Zero 3 (เกษียณ)',
    emoji: '❄️🧊',
    color: '#38bdf8',
    category: 'Retirement',
    tier: 'Tier 3',
    timeHorizon: '37 Years',
    goalTHB: 4000000.00,
    goalUSD: 122737.04,
    cashBufferUSD: 0.00,
    notes: 'พอร์ตหลักระยะยาว พลิกฟื้นอิสรภาพ • Horizon: 37 Years',
    logo: 'assets/foliologo/zero3.png',
    holdings: [
      { id: 'h-tsla', ticker: 'TSLA', name: 'Tesla Inc.', shares: 0.0735078, avgCostUSD: 338.3906, currentPriceUSD: 342.27, change1dPct: -1.20, targetTHB: 785000 },
      { id: 'h-smr', ticker: 'SMR', name: 'NuScale Power Corp', shares: 2.0829913, avgCostUSD: 8.627, currentPriceUSD: 9.39, change1dPct: 3.20, targetTHB: 218400 },
      { id: 'h-crwd', ticker: 'CRWD', name: 'CrowdStrike Holdings', shares: 0.0050469, avgCostUSD: 89.09, currentPriceUSD: 216.95, change1dPct: 1.50, targetTHB: 390000 },
      { id: 'h-amzn', ticker: 'AMZN', name: 'Amazon.com Inc.', shares: 0.0005938, avgCostUSD: 205.43, currentPriceUSD: 262.65, change1dPct: 1.10, targetTHB: 624000 },
      { id: 'h-rklb', ticker: 'RKLB', name: 'Rocket Lab USA', shares: 0.0008445, avgCostUSD: 66.07, currentPriceUSD: 80.25, change1dPct: -0.50, targetTHB: 195000 },
      { id: 'h-sso', ticker: 'SSO', name: 'ประกันสังคม', shares: 1.00, avgCostUSD: 141.61, currentPriceUSD: 141.61, change1dPct: 0.00, targetTHB: 141.61 },
      { id: 'h-gpf', ticker: 'กอช.', name: 'กองทุนการออมแห่งชาติ', shares: 1.00, avgCostUSD: 76.52, currentPriceUSD: 76.52, change1dPct: 0.00, targetTHB: 100000 },
      { id: 'h-googl', ticker: 'GOOGL', name: 'Alphabet Inc.', shares: 0.00, avgCostUSD: 178.50, currentPriceUSD: 178.50, change1dPct: 0.70, targetTHB: 858000 },
      { id: 'h-etn', ticker: 'ETN', name: 'Eaton Corporation', shares: 0.00, avgCostUSD: 315.00, currentPriceUSD: 315.00, change1dPct: 0.00, targetTHB: 205600 },
      { id: 'h-abbv', ticker: 'ABBV', name: 'AbbVie Inc.', shares: 0.00, avgCostUSD: 175.00, currentPriceUSD: 175.00, change1dPct: 0.00, targetTHB: 390000 }
    ]
  },
  {
    id: 'zero5',
    name: 'Zero 5 (บ้าน)',
    emoji: '⛺',
    color: '#eab308',
    category: 'Asset',
    tier: 'Tier 3',
    timeHorizon: '37 Years',
    goalTHB: 1500000.00,
    goalUSD: 46026.39,
    targetCashBufferTHB: 300000,
    cashBufferUSD: 0.00,
    notes: 'เป้าหมายระยะกลางสำหรับที่อยู่อาศัย • Cash Buffer = 300,000 ฿ • Horizon: 37 Years',
    logo: 'assets/foliologo/zero5.png',
    holdings: [
      { id: 'h-tsm', ticker: 'TSM', name: 'Taiwan Semiconductor (TSMC)', shares: 0.00, avgCostUSD: 165.00, currentPriceUSD: 172.00, change1dPct: 0.00, targetTHB: 300000 },
      { id: 'h-asml', ticker: 'ASML', name: 'ASML Holding N.V.', shares: 0.00, avgCostUSD: 850.00, currentPriceUSD: 880.00, change1dPct: 0.00, targetTHB: 240000 },
      { id: 'h-lmt', ticker: 'LMT', name: 'Lockheed Martin Corp.', shares: 0.00, avgCostUSD: 540.00, currentPriceUSD: 555.00, change1dPct: 0.00, targetTHB: 240000 },
      { id: 'h-spgi', ticker: 'SPGI', name: 'S&P Global Inc.', shares: 0.00, avgCostUSD: 480.00, currentPriceUSD: 490.00, change1dPct: 0.00, targetTHB: 180000 },
      { id: 'h-bwxt', ticker: 'BWXT', name: 'BWX Technologies', shares: 0.00, avgCostUSD: 95.00, currentPriceUSD: 98.00, change1dPct: 0.00, targetTHB: 140000 },
      { id: 'h-amd', ticker: 'AMD', name: 'Advanced Micro Devices', shares: 0.00, avgCostUSD: 145.00, currentPriceUSD: 150.00, change1dPct: 0.00, targetTHB: 100000 }
    ]
  },
  {
    id: 'us_dividend',
    name: 'Dividend Yield (หุ้นโลก)',
    emoji: '💰',
    color: '#10b981',
    category: 'Global Stock',
    tier: 'Tier 4',
    timeHorizon: 'Ongoing',
    goalTHB: 300000.00,
    goalUSD: 9205.28,
    cashBufferUSD: 0.00,
    notes: 'ปันผลสม่ำเสมอ ลดความเสี่ยงค่าเงิน • Ongoing',
    logo: 'assets/foliologo/usdividentyield.png',
    holdings: [
      { id: 'h-avgo', ticker: 'AVGO', name: 'Broadcom Inc.', shares: 0.0459276, avgCostUSD: 388.6551, currentPriceUSD: 392.99, change1dPct: 0.00, targetTHB: 45000 },
      { id: 'h-o', ticker: 'O', name: 'Realty Income Corp.', shares: 0.1262319, avgCostUSD: 61.7118, currentPriceUSD: 62.74, change1dPct: 0.20, targetTHB: 45000 },
      { id: 'h-pg', ticker: 'PG', name: 'Procter & Gamble Co.', shares: 0.0327893, avgCostUSD: 144.3276, currentPriceUSD: 144.56, change1dPct: 0.30, targetTHB: 75000 },
      { id: 'h-cvx', ticker: 'CVX', name: 'Chevron Corporation', shares: 0.0185039, avgCostUSD: 180.1572, currentPriceUSD: 200.00, change1dPct: -0.40, targetTHB: 45000 },
      { id: 'h-ko', ticker: 'KO', name: 'Coca-Cola Company', shares: 0.0177449, avgCostUSD: 83.968, currentPriceUSD: 87.71, change1dPct: 0.00, targetTHB: 75000 },
      { id: 'h-pep', ticker: 'PEP', name: 'PepsiCo Inc.', shares: 0.00, avgCostUSD: 170.00, currentPriceUSD: 172.00, change1dPct: 0.00, targetTHB: 60000 }
    ]
  },
  {
    id: 'thai_dividend',
    name: 'THAI Dividend (หุ้นไทย)',
    emoji: '🇹🇭',
    color: '#6366f1',
    category: 'Thai Stock',
    tier: 'Tier 4',
    timeHorizon: 'Ongoing',
    goalTHB: 100000.00,
    goalUSD: 3068.43,
    cashBufferUSD: 0.00,
    notes: 'เน้นกระแสเงินสดจากปันผลในประเทศ • Ongoing',
    logo: 'assets/foliologo/thaidivident.png',
    holdings: [
      { id: 'h-advanc', ticker: 'ADVANC.BK', name: 'Advanced Info Service', shares: 0.00, avgCostUSD: 7.20, currentPriceUSD: 7.30, change1dPct: 0.00, targetTHB: 25000 },
      { id: 'h-scb', ticker: 'SCB.BK', name: 'SCB X Public Company', shares: 0.00, avgCostUSD: 3.10, currentPriceUSD: 3.15, change1dPct: 0.00, targetTHB: 20000 },
      { id: 'h-ptt', ticker: 'PTT.BK', name: 'PTT Public Company', shares: 0.00, avgCostUSD: 0.95, currentPriceUSD: 0.98, change1dPct: 0.00, targetTHB: 20000 },
      { id: 'h-dif', ticker: 'DIF.BK', name: 'Digital Telecom Infra Fund', shares: 0.00, avgCostUSD: 0.22, currentPriceUSD: 0.23, change1dPct: 0.00, targetTHB: 20000 },
      { id: 'h-whart', ticker: 'WHART.BK', name: 'WHA Premium Growth Freehold', shares: 0.00, avgCostUSD: 0.28, currentPriceUSD: 0.29, change1dPct: 0.00, targetTHB: 15000 }
    ]
  },
  {
    id: 'next_gen',
    name: 'NEXT GEN (หุ้นเติบโต)',
    emoji: '🚀',
    color: '#f97316',
    category: 'Growth Stock',
    tier: 'Tier 5',
    timeHorizon: 'Watchlist / รอจัดสรรงบ',
    goalTHB: 500000.00,
    goalUSD: 15342.13,
    cashBufferUSD: 0.00,
    notes: 'พอร์ตซิ่ง ดุดัน ไม่เกรงใจใคร โตระยะยาว • DE, GEV, ISRG, NU, VOO',
    logo: 'assets/foliologo/nextgen.png',
    holdings: [
      { id: 'h-isrg', ticker: 'ISRG', name: 'Intuitive Surgical', shares: 0.0313562, avgCostUSD: 379.829, currentPriceUSD: 394.51, change1dPct: 0.00, targetTHB: 100000 },
      { id: 'h-nu', ticker: 'NU', name: 'Nu Holdings Ltd.', shares: 0.4767802, avgCostUSD: 12.92, currentPriceUSD: 15.23, change1dPct: 1.80, targetTHB: 100000 },
      { id: 'h-gev', ticker: 'GEV', name: 'GE Vernova Inc.', shares: 0.0057378, avgCostUSD: 1030.004, currentPriceUSD: 1063.25, change1dPct: 0.00, targetTHB: 100000 },
      { id: 'h-voo', ticker: 'VOO', name: 'Vanguard S&P 500 ETF', shares: 0.00, avgCostUSD: 510.00, currentPriceUSD: 520.00, change1dPct: 0.00, targetTHB: 100000 },
      { id: 'h-de', ticker: 'DE', name: 'Deere & Company', shares: 0.00, avgCostUSD: 380.00, currentPriceUSD: 390.00, change1dPct: 0.00, targetTHB: 100000 }
    ]
  },
  {
    id: 'crypto',
    name: 'Crypto (สินทรัพย์ทางเลือก)',
    emoji: '🪙',
    color: '#f59e0b',
    category: 'Crypto',
    tier: 'Tier 5',
    timeHorizon: 'Ongoing / เก็งกำไร',
    goalTHB: 165000.00,
    goalUSD: 5062.90,
    cashBufferUSD: 0.00,
    notes: 'สินทรัพย์ดิจิทัลและเก็งกำไร • BTC, BNB, ETH',
    logo: 'assets/foliologo/crypto.png',
    holdings: [
      { id: 'h-btc', ticker: 'BTC', name: 'Bitcoin', shares: 0.00, avgCostUSD: 62000.00, currentPriceUSD: 64500.00, change1dPct: 1.40, targetTHB: 80000 },
      { id: 'h-eth', ticker: 'ETH', name: 'Ethereum', shares: 0.00, avgCostUSD: 3100.00, currentPriceUSD: 3350.00, change1dPct: 2.10, targetTHB: 50000 },
      { id: 'h-bnb', ticker: 'BNB', name: 'BNB Token', shares: 0.00, avgCostUSD: 550.00, currentPriceUSD: 580.00, change1dPct: 0.00, targetTHB: 35000 }
    ]
  }
];

// Default Monthly Forex & Option Trading Snapshots (From Backup)
const INITIAL_TRADING_DATA = {
  forex_life: {
    name: 'FOREX LIFE',
    monthlyBalances: [
      { year: 2025, month: 10, balanceUSD: 450.00, note: 'เทรดคู่ EURUSD รันเทรนดสวยงาม' },
      { year: 2025, month: 11, balanceUSD: 520.00, note: 'ตลาดเคลื่อนไหวตามกรอบ Sideway' },
      { year: 2025, month: 12, balanceUSD: -120.00, note: 'มีโดน Stop Loss ปลายปีเนื่องจากปริมาณการซื้อขายเบาบาง' },
      { year: 2026, month: 8, balanceUSD: 100.00, note: 'ยอดล่าสุดปัจจุบัน' }
    ]
  },
  forex_bottrade: {
    name: 'FOREX RISK (BOTTRADE)',
    monthlyBalances: [
      { year: 2025, month: 10, balanceUSD: 180.00, note: 'เทรดทองคำ (XAUUSD) เสี่ยงสูง' },
      { year: 2025, month: 11, balanceUSD: -90.00, note: 'ล้างพอร์ทย่อยบางส่วนแต่กู้คืนมาได้' },
      { year: 2025, month: 12, balanceUSD: 310.00, note: 'ได้ไม้สไนเปอร์ช่วง FOMC' },
      { year: 2026, month: 8, balanceUSD: 50.00, note: 'ยอดล่าสุดปัจจุบัน' }
    ]
  },
  option: {
    name: 'OPTION TRADING',
    monthlyBalances: [
      { year: 2025, month: 10, balanceUSD: 280.00, note: 'Hedging ค่าเงินด้วย Option' },
      { year: 2025, month: 11, balanceUSD: 340.00, note: 'กลยุทธ์ Iron Condor ได้พรีเมียมเต็ม' },
      { year: 2025, month: 12, balanceUSD: -80.00, note: 'โดนสควีซช่วงสิ้นปี' },
      { year: 2026, month: 8, balanceUSD: 80.00, note: 'ยอดล่าสุดปัจจุบัน' }
    ]
  }
};

// Default Quarterly Snapshots (From Backup)
const INITIAL_QUARTERLY_DATA = [
  {
    year: 2025,
    quarter: 'Q1',
    date: '2025-03-31',
    exchangeRate: 32.68,
    portValuesUSD: {
      zero3: 18360.00,
      us_dividend: 2754.00,
      thai_dividend: 1530.00,
      next_gen: 91800.00
    },
    totalUSD: 114444.00,
    notes: 'บันทึกไตรมาส 1/2025'
  },
  {
    year: 2025,
    quarter: 'Q2',
    date: '2025-06-30',
    exchangeRate: 32.68,
    portValuesUSD: {
      zero3: 20808.00,
      us_dividend: 3060.00,
      thai_dividend: 1683.00,
      next_gen: 107100.00
    },
    totalUSD: 132651.00,
    notes: 'บันทึกไตรมาส 2/2025'
  },
  {
    year: 2025,
    quarter: 'Q3',
    date: '2025-09-30',
    exchangeRate: 32.68,
    portValuesUSD: {
      zero3: 22950.00,
      us_dividend: 3366.00,
      thai_dividend: 1774.80,
      next_gen: 122400.00
    },
    totalUSD: 150490.80,
    notes: 'บันทึกไตรมาส 3/2025'
  },
  {
    year: 2025,
    quarter: 'Q4',
    date: '2025-12-31',
    exchangeRate: 32.68,
    portValuesUSD: {
      zero3: 25092.00,
      us_dividend: 3610.80,
      thai_dividend: 1897.20,
      next_gen: 131580.00
    },
    totalUSD: 162180.00,
    notes: 'บันทึกไตรมาส 4/2025'
  }
];

// Default Dividend Records (From Backup)
const INITIAL_DIVIDENDS = [
  { id: 'div-1', date: '2026-08-18', ticker: 'PG', portfolioId: 'us_dividend', grossUSD: 0.02, taxUSD: 0.00, netUSD: 0.02, notes: 'ปันผล PG' }
];

// --- 3. MAIN APPLICATION CLASS ---
class PixelStewardApp {
  constructor() {
    this.portfolios = [];
    this.tradingData = {};
    this.quarterlySnapshots = [];
    this.dividends = [];
    this.exchangeRate = 32.59;
    this.displayCurrency = 'USD'; // 'USD' or 'THB'
    this.currentTab = 'dashboard';
    this.selectedPortfolioId = 'zero1';
    this.isPrivacyMode = false;
    
    // Firebase & Sync State
    this.dbRef = null;
    this.isFirebaseOnline = false;
    this.charts = {};

    this.init();
  }

  async init() {
    this.initFirebase();
    this.loadLocalData();
    this.loadPrivacyPreference();
    this.setupEventListeners();
    this.setupModals();
    this.renderActiveTab();
    this.fetchLiveExchangeRate();
    this.registerPWA();
  }

  // --- PRIVACY MODE ---
  loadPrivacyPreference() {
    this.isPrivacyMode = localStorage.getItem('pixel_privacy_mode') === '1';
    this.applyPrivacyMode();
  }

  togglePrivacyMode() {
    this.isPrivacyMode = !this.isPrivacyMode;
    localStorage.setItem('pixel_privacy_mode', this.isPrivacyMode ? '1' : '0');
    this.applyPrivacyMode();
  }

  applyPrivacyMode() {
    const icon = document.getElementById('privacy-icon');
    if (this.isPrivacyMode) {
      document.body.classList.add('privacy-mode');
      if (icon) icon.textContent = '🙈';
    } else {
      document.body.classList.remove('privacy-mode');
      if (icon) icon.textContent = '👁️';
    }
  }

  // --- GAMIFICATION & MILESTONE BADGES ---
  evaluateMilestones() {
    const grand = this.calculateGrandTotalStats();
    const zero1 = this.portfolios.find(p => p.id === 'zero1');
    const zero1Stats = zero1 ? this.calculatePortfolioStats(zero1) : null;
    const totalDivUSD = this.dividends.reduce((acc, d) => acc + (parseFloat(d.netUSD) || 0), 0);
    
    let totalCash = 0;
    this.portfolios.forEach(p => totalCash += (parseFloat(p.cashBufferUSD) || 0));

    const totalHoldingsCount = this.portfolios.reduce((c, p) => c + (p.holdings || []).length, 0);

    const badges = [
      {
        id: 'emergency_shield',
        icon: '🛡️',
        name: 'Emergency Shield',
        desc: 'มีเงินสำรองฉุกเฉิน (Zero 1) ครบ 100%',
        unlocked: zero1Stats ? zero1Stats.goalProgressPct >= 100 : false
      },
      {
        id: 'cash_buffer',
        icon: '💧',
        name: 'Cash Buffer Master',
        desc: 'มีเงินสดไว้ช้อนรวมกันมากกว่า $50',
        unlocked: totalCash >= 50
      },
      {
        id: 'dividend_starter',
        icon: '💰',
        name: 'Dividend Pioneer',
        desc: 'ได้รับเงินปันผลสะสมเข้าพอร์ตแล้ว',
        unlocked: totalDivUSD > 0
      },
      {
        id: 'trader_discipline',
        icon: '📈',
        name: 'Cashflow Disciplined',
        desc: 'บันทึกยอดเงินเทรด Forex/Option ครบถ้วน',
        unlocked: grand.totalTradingUSD > 0
      },
      {
        id: 'portfolio_diversity',
        icon: '🌐',
        name: 'World Class Diversified',
        desc: 'มีสินทรัพย์ในพอร์ตมากกว่า 5 รายการ',
        unlocked: totalHoldingsCount >= 5
      },
      {
        id: 'millionaire_path',
        icon: '👑',
        name: 'Freedom Seeker',
        desc: 'มูลค่าสินทรัพย์รวมแตะระดับ $1,000',
        unlocked: grand.grandTotalUSD >= 1000
      }
    ];

    return badges;
  }

  triggerCelebration() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }

  // --- FIREBASE INITIALIZATION & REALTIME SYNC ---
  initFirebase() {
    if (typeof firebase !== 'undefined') {
      try {
        if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
        }
        this.db = firebase.database();
        this.dbRef = this.db.ref('pixel_steward_data');

        // Realtime Listener
        this.dbRef.on('value', (snapshot) => {
          const cloudData = snapshot.val();
          if (cloudData) {
            this.handleCloudSync(cloudData);
          } else {
            // First time sync -> push defaults
            this.pushDataToCloud();
          }
          this.setCloudStatus('online', 'Cloud Synced');
        }, (error) => {
          console.warn('Firebase sync error:', error);
          this.setCloudStatus('offline', 'Offline Mode');
        });

        this.isFirebaseOnline = true;
      } catch (e) {
        console.error('Firebase setup failed:', e);
        this.setCloudStatus('offline', 'Offline Mode');
      }
    } else {
      this.setCloudStatus('offline', 'Offline Mode');
    }
  }

  setCloudStatus(status, text) {
    const indicator = document.getElementById('cloud-indicator');
    const textEl = document.getElementById('cloud-status-text');
    if (indicator && textEl) {
      indicator.querySelector('.status-dot').className = `status-dot ${status}`;
      textEl.textContent = text;
    }
  }

  renderStockLogoHTML(ticker, borderColor = '#10b981', size = 42) {
    if (!ticker) return '';
    const clean = ticker.replace('.BK', '').toUpperCase().trim();

    if (clean === 'BTC') {
      return `<div class="ticker-icon-circle" style="width:${size}px; height:${size}px; border-color:${borderColor}; background:#151a24; overflow:hidden;"><img src="https://assets.coingecko.com/coins/images/1/small/bitcoin.png" alt="BTC" style="width:100%; height:100%; object-fit:contain; padding:4px;" referrerpolicy="no-referrer"></div>`;
    }
    if (clean === 'ETH') {
      return `<div class="ticker-icon-circle" style="width:${size}px; height:${size}px; border-color:${borderColor}; background:#151a24; overflow:hidden;"><img src="https://assets.coingecko.com/coins/images/279/small/ethereum.png" alt="ETH" style="width:100%; height:100%; object-fit:contain; padding:4px;" referrerpolicy="no-referrer"></div>`;
    }
    if (clean === 'BNB') {
      return `<div class="ticker-icon-circle" style="width:${size}px; height:${size}px; border-color:${borderColor}; background:#151a24; overflow:hidden;"><img src="https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png" alt="BNB" style="width:100%; height:100%; object-fit:contain; padding:4px;" referrerpolicy="no-referrer"></div>`;
    }

    if (['SSO', 'กอช.', 'KEPT', 'CASH', 'THB', 'USD'].includes(clean)) {
      return `<div class="ticker-icon-circle" style="width:${size}px; height:${size}px; border-color:${borderColor}; background:#151a24; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:${size > 36 ? 11 : 9}px; color:#fff;">${clean.slice(0, 4)}</div>`;
    }

    const primaryUrl = `https://assets.parqet.com/logos/symbol/${clean}?format=png`;
    const fallback1 = `https://financialmodelingprep.com/image-stock/${clean}.png`;
    const fallback2 = `https://raw.githubusercontent.com/nvstly/icons/main/ticker_icons/${clean}.png`;

    return `
      <div class="ticker-icon-circle" style="width:${size}px; height:${size}px; border-color:${borderColor}; background:#151a24; position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center;">
        <img src="${primaryUrl}" 
             alt="${clean}" 
             loading="lazy" 
             referrerpolicy="no-referrer"
             onerror="
               if (!this.dataset.step) {
                 this.dataset.step = '1';
                 this.src = '${fallback1}';
               } else if (this.dataset.step === '1') {
                 this.dataset.step = '2';
                 this.src = '${fallback2}';
               } else {
                 this.style.display = 'none';
                 if (this.nextElementSibling) this.nextElementSibling.style.display = 'flex';
               }
             " 
             style="width:100%; height:100%; object-fit:contain; padding:4px; border-radius:50%;">
        <span style="display:none; width:100%; height:100%; align-items:center; justify-content:center; font-weight:800; font-size:${size > 36 ? 11 : 9}px; color:#fff;">${clean.slice(0, 4)}</span>
      </div>
    `;
  }

  getTickerCompanyName(ticker) {
    if (!ticker) return '';
    const clean = ticker.replace('.BK', '').toUpperCase().trim();
    const map = {
      'NVDA': 'NVIDIA Corporation',
      'MSFT': 'Microsoft Corp.',
      'TSLA': 'Tesla Inc.',
      'AAPL': 'Apple Inc.',
      'AMZN': 'Amazon.com Inc.',
      'GOOGL': 'Alphabet Inc.',
      'GOOG': 'Alphabet Inc.',
      'META': 'Meta Platforms Inc.',
      'V': 'Visa Inc.',
      'WMT': 'Walmart Inc.',
      'CRWD': 'CrowdStrike Holdings',
      'SMR': 'NuScale Power Corp',
      'RKLB': 'Rocket Lab USA',
      'ABBV': 'AbbVie Inc.',
      'ETN': 'Eaton Corporation',
      'ABT': 'Abbott Laboratories',
      'TMO': 'Thermo Fisher Scientific',
      'NEE': 'NextEra Energy',
      'JPM': 'JPMorgan Chase & Co.',
      'PLTR': 'Palantir Technologies',
      'COST': 'Costco Wholesale Corp.',
      'LLY': 'Eli Lilly and Company',
      'UNH': 'UnitedHealth Group',
      'HD': 'Home Depot Inc.',
      'MCD': 'McDonald\'s Corp.',
      'TSM': 'Taiwan Semiconductor (TSMC)',
      'ASML': 'ASML Holding N.V.',
      'LMT': 'Lockheed Martin Corp.',
      'SPGI': 'S&P Global Inc.',
      'BWXT': 'BWX Technologies',
      'AMD': 'Advanced Micro Devices',
      'AVGO': 'Broadcom Inc.',
      'O': 'Realty Income Corp.',
      'PG': 'Procter & Gamble Co.',
      'CVX': 'Chevron Corporation',
      'KO': 'Coca-Cola Company',
      'PEP': 'PepsiCo Inc.',
      'ISRG': 'Intuitive Surgical',
      'NU': 'Nu Holdings Ltd.',
      'GEV': 'GE Vernova Inc.',
      'VOO': 'Vanguard S&P 500 ETF',
      'QQQ': 'Invesco QQQ Trust',
      'SPY': 'SPDR S&P 500 ETF',
      'DE': 'Deere & Company',
      'BTC': 'Bitcoin',
      'ETH': 'Ethereum',
      'BNB': 'BNB Token',
      'ADVANC': 'Advanced Info Service',
      'SCB': 'SCB X Public Company',
      'PTT': 'PTT Public Company',
      'DIF': 'Digital Telecom Infra Fund',
      'WHART': 'WHA Premium Growth Freehold',
      'TISCO': 'TISCO Financial Group',
      'KEPT': 'Kept by Krungsri (Cash)',
      'SSO': 'ประกันสังคม',
      'กอช.': 'กองทุนการออมแห่งชาติ'
    };
    return map[clean] || '';
  }

  updateHoldingTickerPreview(sym) {
    const logoBox = document.getElementById('holding-ticker-logo-preview');
    const nameInput = document.getElementById('holding-name');
    if (!logoBox) return;

    if (!sym) {
      logoBox.innerHTML = `<span id="holding-ticker-preview-text" style="font-size: 11px; font-weight: 800; color: var(--text-muted);">---</span>`;
      return;
    }

    logoBox.innerHTML = this.renderStockLogoHTML(sym, '#10b981', 42);

    if (nameInput && (!nameInput.value || nameInput.getAttribute('data-autofilled') === 'true')) {
      const compName = this.getTickerCompanyName(sym);
      if (compName) {
        nameInput.value = compName;
        nameInput.setAttribute('data-autofilled', 'true');
      }
    }
  }

  enrichPortfoliosWithIPS(ports) {
    if (!ports || ports.length === 0) return JSON.parse(JSON.stringify(INITIAL_PORTFOLIOS));
    
    // 1. Map legacy numeric IDs to standard slug IDs
    const idMap = {
      '2': 'zero1',
      '3': 'zero2',
      '4': 'zero3',
      '5': 'zero4',
      '6': 'zero5',
      '7': 'us_dividend',
      '8': 'thai_dividend',
      '9': 'next_gen'
    };

    // Filter out RedWing and misplaced Forex/Option portfolios from stock list
    const filtered = ports.filter(p => {
      if (!p) return false;
      const pid = String(p.id).toLowerCase();
      const pname = (p.name || '').toLowerCase();
      if (pid === 'redwing' || pname.includes('redwing')) return false;
      if (['10', '11', '12', 'forex_life', 'forex_bottrade', 'option'].includes(pid)) return false;
      if (pname.includes('forex') || pname.includes('option')) return false;
      return true;
    });

    // Remap IDs and normalize
    const normalized = filtered.map(p => {
      const mappedId = idMap[p.id] || p.id;
      return { ...p, id: mappedId };
    });

    // Deduplicate by ID
    const mergedMap = new Map();
    normalized.forEach(p => {
      if (!mergedMap.has(p.id)) {
        mergedMap.set(p.id, p);
      } else {
        // If duplicated, merge holdings without duplicate tickers
        const existing = mergedMap.get(p.id);
        const existingTickers = new Set((existing.holdings || []).map(h => h.ticker.toUpperCase()));
        (p.holdings || []).forEach(h => {
          if (!existingTickers.has(h.ticker.toUpperCase())) {
            existing.holdings.push(h);
            existingTickers.add(h.ticker.toUpperCase());
          }
        });
      }
    });

    const result = Array.from(mergedMap.values());

    // Enrich existing portfolios with IPS targets without re-adding deleted holdings
    INITIAL_PORTFOLIOS.forEach(initP => {
      const existingP = result.find(p => p.id === initP.id);
      if (existingP) {
        existingP.timeHorizon = existingP.timeHorizon || initP.timeHorizon;
        existingP.goalTHB = existingP.goalTHB || initP.goalTHB;
        existingP.goalUSD = existingP.goalUSD || initP.goalUSD;
        existingP.color = existingP.color || initP.color;
        existingP.emoji = existingP.emoji || initP.emoji;
        if (initP.targetCashBufferTHB && !existingP.targetCashBufferTHB) {
          existingP.targetCashBufferTHB = initP.targetCashBufferTHB;
        }
        
        // Enrich targetTHB on EXISTING holdings only (NEVER re-insert deleted holdings)
        if (existingP.holdings) {
          existingP.holdings.forEach(h => {
            const initH = (initP.holdings || []).find(x => x.ticker.toUpperCase() === h.ticker.toUpperCase());
            if (initH && initH.targetTHB && !h.targetTHB) {
              h.targetTHB = initH.targetTHB;
            }
          });
        }
      } else {
        // Brand new portfolio from initial list if totally missing
        result.push(JSON.parse(JSON.stringify(initP)));
      }
    });

    return result;
  }

  loadLocalData() {
    try {
      const saved = localStorage.getItem('pixel_steward_data_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.portfolios = this.enrichPortfoliosWithIPS(parsed.portfolios);
        this.tradingData = parsed.tradingData || INITIAL_TRADING_DATA;
        this.quarterlySnapshots = parsed.quarterlySnapshots || INITIAL_QUARTERLY_DATA;
        this.dividends = parsed.dividends || INITIAL_DIVIDENDS;
        this.exchangeRate = parsed.exchangeRate || 32.59;
      } else {
        this.portfolios = JSON.parse(JSON.stringify(INITIAL_PORTFOLIOS));
        this.tradingData = JSON.parse(JSON.stringify(INITIAL_TRADING_DATA));
        this.quarterlySnapshots = JSON.parse(JSON.stringify(INITIAL_QUARTERLY_DATA));
        this.dividends = JSON.parse(JSON.stringify(INITIAL_DIVIDENDS));
      }
    } catch (e) {
      console.warn('Failed to load localStorage:', e);
      this.portfolios = JSON.parse(JSON.stringify(INITIAL_PORTFOLIOS));
      this.tradingData = JSON.parse(JSON.stringify(INITIAL_TRADING_DATA));
      this.quarterlySnapshots = JSON.parse(JSON.stringify(INITIAL_QUARTERLY_DATA));
      this.dividends = JSON.parse(JSON.stringify(INITIAL_DIVIDENDS));
    }

    this.portfolios = this.portfolios.filter(p => p.id !== 'redwing' && !p.name.includes('RedWing'));
    this.updateSidebarFxRate();
  }

  saveData() {
    // Sanitize RedWing
    this.portfolios = this.portfolios.filter(p => p.id !== 'redwing' && !p.name.includes('RedWing'));

    const payload = {
      portfolios: this.portfolios,
      tradingData: this.tradingData,
      quarterlySnapshots: this.quarterlySnapshots,
      dividends: this.dividends,
      exchangeRate: this.exchangeRate,
      lastUpdated: new Date().toISOString()
    };

    localStorage.setItem('pixel_steward_data_v2', JSON.stringify(payload));

    if (this.isFirebaseOnline && this.dbRef) {
      this.setCloudStatus('syncing', 'Syncing...');
      this.dbRef.set(payload)
        .then(() => {
          this.setCloudStatus('online', 'Cloud Synced');
        })
        .catch(err => {
          console.error('Firebase save error:', err);
          this.setCloudStatus('offline', 'Offline (Saved Local)');
        });
    }

    this.renderActiveTab();
  }

  handleCloudSync(cloudData) {
    if (cloudData.portfolios) {
      this.portfolios = this.enrichPortfoliosWithIPS(cloudData.portfolios);
    }
    if (cloudData.tradingData) this.tradingData = cloudData.tradingData;
    if (cloudData.quarterlySnapshots) this.quarterlySnapshots = cloudData.quarterlySnapshots;
    if (cloudData.dividends) this.dividends = cloudData.dividends;
    if (cloudData.exchangeRate) this.exchangeRate = cloudData.exchangeRate;

    localStorage.setItem('pixel_steward_data_v2', JSON.stringify(cloudData));
    this.updateSidebarFxRate();
    this.renderActiveTab();
  }

  pushDataToCloud() {
    this.saveData();
  }

  // --- CURRENCY & FORMATTING HELPERS ---
  usdToThb(usdVal) {
    return (usdVal || 0) * this.exchangeRate;
  }

  thbToUsd(thbVal) {
    return (thbVal || 0) / (this.exchangeRate || 32.59);
  }

  formatUSD(num) {
    return '$' + (num || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  formatTHB(num) {
    return '฿' + (num || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  formatDual(usdVal, forcePrimary = null) {
    const primaryMode = forcePrimary || this.displayCurrency;
    const usdStr = this.formatUSD(usdVal);
    const thbStr = this.formatTHB(this.usdToThb(usdVal));
    if (primaryMode === 'USD') {
      return { main: usdStr, sub: `≈ ${thbStr}` };
    } else {
      return { main: thbStr, sub: `≈ ${usdStr}` };
    }
  }

  formatPercent(pct) {
    const p = pct || 0;
    const sign = p > 0 ? '+' : '';
    return `${sign}${p.toFixed(2)}%`;
  }

  updateSidebarFxRate() {
    const fxEl = document.getElementById('sidebar-fx-rate');
    if (fxEl) fxEl.textContent = this.exchangeRate.toFixed(2);
    const inputFx = document.getElementById('input-fx-rate');
    if (inputFx) inputFx.value = this.exchangeRate.toFixed(2);
  }

  // --- CALCULATIONS: HOLDING, PORTFOLIO & TOTAL NET WORTH ---
  calculateHoldingStats(h) {
    const shares = parseFloat(h.shares) || 0;
    const avgCost = parseFloat(h.avgCostUSD) || 0;
    const currentPrice = parseFloat(h.currentPriceUSD) || avgCost || 0;
    const change1d = parseFloat(h.change1dPct) || 0;

    const totalCostUSD = shares * avgCost;
    const marketValueUSD = shares * currentPrice;
    const unrealizedPLUSD = marketValueUSD - totalCostUSD;
    const unrealizedPLPct = totalCostUSD > 0 ? (unrealizedPLUSD / totalCostUSD) * 100 : 0;
    const marketValueTHB = this.usdToThb(marketValueUSD);
    const unrealizedPLTHB = this.usdToThb(unrealizedPLUSD);

    return {
      shares,
      avgCost,
      currentPrice,
      change1d,
      totalCostUSD,
      marketValueUSD,
      unrealizedPLUSD,
      unrealizedPLPct,
      marketValueTHB,
      unrealizedPLTHB
    };
  }

  calculatePortfolioStats(port) {
    let holdingsTotalUSD = 0;
    let holdingsCostUSD = 0;
    let weighted1dSum = 0;
    const holdings = port.holdings || [];

    holdings.forEach(h => {
      const stats = this.calculateHoldingStats(h);
      holdingsTotalUSD += stats.marketValueUSD;
      holdingsCostUSD += stats.totalCostUSD;
      weighted1dSum += (stats.marketValueUSD * stats.change1d);
    });

    const cashBufferUSD = parseFloat(port.cashBufferUSD) || 0;
    const totalValueUSD = holdingsTotalUSD + cashBufferUSD;
    const totalCostUSD = holdingsCostUSD + cashBufferUSD;
    const totalPLUSD = totalValueUSD - totalCostUSD;
    const totalPLPct = holdingsCostUSD > 0 ? ((holdingsTotalUSD - holdingsCostUSD) / holdingsCostUSD) * 100 : 0;
    const avg1dChangePct = holdingsTotalUSD > 0 ? (weighted1dSum / holdingsTotalUSD) : 0;
    const goalUSD = parseFloat(port.goalUSD) || 1;
    const goalProgressPct = Math.min(100, Math.max(0, (totalValueUSD / goalUSD) * 100));

    return {
      holdingsTotalUSD,
      holdingsCostUSD,
      cashBufferUSD,
      totalValueUSD,
      totalCostUSD,
      totalPLUSD,
      totalPLPct,
      avg1dChangePct,
      goalUSD,
      goalProgressPct,
      assetCount: holdings.filter(h => (parseFloat(h.shares) || 0) > 0).length,
      totalAssetsListed: holdings.length
    };
  }

  getTradingLatestBalances() {
    let totalTradingUSD = 0;
    const balances = {};
    for (const [key, item] of Object.entries(this.tradingData || {})) {
      const list = item.monthlyBalances || [];
      const latest = list.length > 0 ? list[list.length - 1].balanceUSD : 0;
      balances[key] = latest;
      totalTradingUSD += latest;
    }
    return { balances, totalTradingUSD };
  }

  calculateGrandTotalStats() {
    let totalStocksUSD = 0;
    let totalCashBufferUSD = 0;
    let totalStockCostUSD = 0;
    let weighted1dSum = 0;

    this.portfolios.forEach(p => {
      const stats = this.calculatePortfolioStats(p);
      totalStocksUSD += stats.holdingsTotalUSD;
      totalCashBufferUSD += stats.cashBufferUSD;
      totalStockCostUSD += stats.holdingsCostUSD;
      weighted1dSum += (stats.holdingsTotalUSD * stats.avg1dChangePct);
    });

    const { totalTradingUSD } = this.getTradingLatestBalances();
    const grandTotalUSD = totalStocksUSD + totalCashBufferUSD + totalTradingUSD;
    const grandTotalTHB = this.usdToThb(grandTotalUSD);
    const avg1dChangePct = totalStocksUSD > 0 ? (weighted1dSum / totalStocksUSD) : 0;
    const totalPLUSD = totalStocksUSD - totalStockCostUSD;
    const totalPLPct = totalStockCostUSD > 0 ? (totalPLUSD / totalStockCostUSD) * 100 : 0;

    return {
      grandTotalUSD,
      grandTotalTHB,
      totalStocksUSD,
      totalCashBufferUSD,
      totalTradingUSD,
      avg1dChangePct,
      totalPLUSD,
      totalPLPct
    };
  }

  // --- ULTRA-FAST & RESILIENT LIVE MARKET DATA ENGINE ---
  async fetchWithTimeout(url, timeoutMs = 4500) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      return response;
    } catch (e) {
      clearTimeout(timer);
      throw e;
    }
  }

  async fetchViaFastProxies(targetUrl) {
    const proxies = [
      (u) => `https://corsproxy.io/?url=${encodeURIComponent(u)}`,
      (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
      (u) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`
    ];

    for (const proxyFn of proxies) {
      try {
        const proxyUrl = proxyFn(targetUrl);
        const res = await this.fetchWithTimeout(proxyUrl, 4000);
        if (res.ok) {
          const data = await res.json();
          if (data) return data;
        }
      } catch (e) {
        // Fallback to next proxy
      }
    }
    return null;
  }

  async fetchLiveExchangeRate() {
    const fxEndpoints = [
      async () => {
        const res = await this.fetchWithTimeout('https://open.er-api.com/v6/latest/USD', 3000);
        if (res.ok) {
          const data = await res.json();
          return parseFloat(data?.rates?.THB);
        }
        return null;
      },
      async () => {
        const res = await this.fetchWithTimeout('https://api.exchangerate-api.com/v4/latest/USD', 3000);
        if (res.ok) {
          const data = await res.json();
          return parseFloat(data?.rates?.THB);
        }
        return null;
      },
      async () => {
        const res = await this.fetchWithTimeout('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json', 3000);
        if (res.ok) {
          const data = await res.json();
          return parseFloat(data?.usd?.thb);
        }
        return null;
      }
    ];

    for (const fetcher of fxEndpoints) {
      try {
        const rate = await fetcher();
        if (rate && rate > 20 && rate < 50) {
          this.exchangeRate = rate;
          this.updateSidebarFxRate();
          return rate;
        }
      } catch (e) {
        // Continue to next FX provider
      }
    }
    return this.exchangeRate;
  }

  async fetchCryptoPrices(cryptoTickers, priceUpdates) {
    if (!cryptoTickers || cryptoTickers.length === 0) return;

    // 1. Direct Binance Public API (CORS enabled, 0 proxy lag, sub-100ms)
    try {
      const symbolsParam = JSON.stringify(cryptoTickers.map(c => `${c}USDT`));
      const res = await this.fetchWithTimeout(`https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(symbolsParam)}`, 3000);
      if (res.ok) {
        const items = await res.json();
        if (Array.isArray(items)) {
          items.forEach(item => {
            const sym = item.symbol.replace('USDT', '');
            const price = parseFloat(item.lastPrice);
            const changePct = parseFloat(item.priceChangePercent);
            if (price > 0) {
              priceUpdates[sym] = { priceUSD: price, change1dPct: changePct };
            }
          });
          return;
        }
      }
    } catch (e) {
      console.warn('Binance crypto fast fetch fallback:', e);
    }

    // 2. CoinGecko Fallback
    try {
      const geckoMap = { 'BTC': 'bitcoin', 'ETH': 'ethereum', 'BNB': 'binancecoin', 'SOL': 'solana', 'XRP': 'ripple' };
      const ids = cryptoTickers.map(c => geckoMap[c]).filter(Boolean).join(',');
      if (ids) {
        const res = await this.fetchWithTimeout(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`, 3500);
        if (res.ok) {
          const data = await res.json();
          for (const [sym, gid] of Object.entries(geckoMap)) {
            if (data[gid]) {
              const price = data[gid].usd;
              const change = data[gid].usd_24h_change || 0;
              if (price > 0) {
                priceUpdates[sym] = { priceUSD: price, change1dPct: change };
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn('CoinGecko crypto fetch fallback:', e);
    }
  }

  async fetchBatchStockPrices(tickers, priceUpdates) {
    if (!tickers || tickers.length === 0) return;

    // Fast Single-Batch Request for all US stocks via Yahoo Finance Quote API
    const symbolsStr = tickers.join(',');
    const quoteUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbolsStr)}`;
    
    const data = await this.fetchViaFastProxies(quoteUrl);
    const results = data?.quoteResponse?.result;
    
    if (Array.isArray(results) && results.length > 0) {
      results.forEach(q => {
        const sym = q.symbol?.toUpperCase();
        const price = q.regularMarketPrice || q.postMarketPrice || q.preMarketPrice;
        const changePct = q.regularMarketChangePercent ?? 0;
        if (sym && price > 0) {
          priceUpdates[sym] = { priceUSD: price, change1dPct: changePct };
        }
      });
    }

    // Check if any ticker was missed, and query individual chart in parallel
    const missingTickers = tickers.filter(t => !priceUpdates[t]);
    if (missingTickers.length > 0) {
      const fallbackPromises = missingTickers.map(async (sym) => {
        try {
          const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${sym}?interval=1d&range=2d`;
          const chartData = await this.fetchViaFastProxies(chartUrl);
          const meta = chartData?.chart?.result?.[0]?.meta;
          if (meta && meta.regularMarketPrice) {
            const price = meta.regularMarketPrice;
            const prev = meta.previousClose || meta.chartPreviousClose || price;
            const changePct = prev > 0 ? ((price - prev) / prev) * 100 : 0;
            priceUpdates[sym] = { priceUSD: price, change1dPct: changePct };
          }
        } catch (e) {
          // Ignore individual failure
        }
      });
      await Promise.allSettled(fallbackPromises);
    }
  }

  async fetchThaiStockPrices(thaiTickers, priceUpdates) {
    if (!thaiTickers || thaiTickers.length === 0) return;

    const symbolsStr = thaiTickers.join(',');
    const quoteUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbolsStr)}`;
    
    const data = await this.fetchViaFastProxies(quoteUrl);
    const results = data?.quoteResponse?.result;

    if (Array.isArray(results)) {
      results.forEach(q => {
        const sym = q.symbol?.toUpperCase();
        const priceTHB = q.regularMarketPrice;
        const changePct = q.regularMarketChangePercent ?? 0;
        if (sym && priceTHB > 0) {
          const priceUSD = priceTHB / (this.exchangeRate || 32.59);
          priceUpdates[sym] = { priceUSD, change1dPct: changePct };
        }
      });
    }
  }

  async syncLiveMarketPrices() {
    const btnTop = document.getElementById('btn-sync-market-top');
    const btnSide = document.getElementById('btn-sync-market-desktop');
    if (btnTop) btnTop.classList.add('spinning');
    if (btnSide) btnSide.classList.add('spinning');

    const startTime = performance.now();

    // 1. Separate tickers into Categories: US Stocks, Crypto, Thai Stocks
    const usTickers = new Set();
    const cryptoTickers = new Set();
    const thaiTickers = new Set();

    const ignored = ['SSO', 'กอช.', 'KEPT', 'CASH', 'THB', 'USD'];

    this.portfolios.forEach(p => {
      (p.holdings || []).forEach(h => {
        if (!h.ticker) return;
        const clean = h.ticker.trim().toUpperCase();
        if (ignored.includes(clean)) return;

        if (['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'DOGE'].includes(clean)) {
          cryptoTickers.add(clean);
        } else if (clean.endsWith('.BK')) {
          thaiTickers.add(clean);
        } else {
          usTickers.add(clean);
        }
      });
    });

    const priceUpdates = {};
    const parallelTasks = [];

    // Parallel Task 1: Live Exchange Rate
    parallelTasks.push(this.fetchLiveExchangeRate());

    // Parallel Task 2: Crypto (Direct Binance API, sub-100ms)
    if (cryptoTickers.size > 0) {
      parallelTasks.push(this.fetchCryptoPrices(Array.from(cryptoTickers), priceUpdates));
    }

    // Parallel Task 3: US Stocks (Batch Yahoo Quote API via fast multi-proxies)
    if (usTickers.size > 0) {
      parallelTasks.push(this.fetchBatchStockPrices(Array.from(usTickers), priceUpdates));
    }

    // Parallel Task 4: Thai Stocks (.BK)
    if (thaiTickers.size > 0) {
      parallelTasks.push(this.fetchThaiStockPrices(Array.from(thaiTickers), priceUpdates));
    }

    // Run all tasks concurrently
    await Promise.allSettled(parallelTasks);

    // Apply updates
    let updatedCount = 0;
    this.portfolios.forEach(p => {
      (p.holdings || []).forEach(h => {
        const clean = h.ticker?.trim().toUpperCase();
        if (clean && priceUpdates[clean]) {
          const update = priceUpdates[clean];
          if (update.priceUSD > 0) {
            h.currentPriceUSD = update.priceUSD;
            h.change1dPct = update.change1dPct;
            updatedCount++;
          }
        }
      });
    });

    const elapsedSec = ((performance.now() - startTime) / 1000).toFixed(2);

    if (btnTop) btnTop.classList.remove('spinning');
    if (btnSide) btnSide.classList.remove('spinning');

    this.saveData();

    alert(`⚡ อัปเดตราคาตลาดสำเร็จ!\n• ปรับปรุง ${updatedCount} สินทรัพย์\n• ความเร็ว: ${elapsedSec} วินาที\n• อัตราแลกเปลี่ยน: ฿${this.exchangeRate.toFixed(2)} / USD`);
  }

  // --- VIEW RENDERING ENGINE ---
  renderActiveTab() {
    const container = document.getElementById('app-view-container');
    if (!container) return;

    // Destroy existing charts to avoid memory leaks
    Object.values(this.charts).forEach(c => { if (c && typeof c.destroy === 'function') c.destroy(); });
    this.charts = {};

    switch (this.currentTab) {
      case 'dashboard':
        this.renderDashboardView(container);
        break;
      case 'portfolios':
        this.renderPortfoliosView(container);
        break;
      case 'trading':
        this.renderTradingView(container);
        break;
      case 'dividends':
        this.renderDividendsView(container);
        break;
      case 'simulator':
        this.renderSimulatorView(container);
        break;
      case 'quarterly':
        this.renderQuarterlyView(container);
        break;
      case 'obsidian':
        this.renderObsidianExportView(container);
        break;
      case 'settings':
        this.renderSettingsView(container);
        break;
      default:
        this.renderDashboardView(container);
    }
  }

  // 1. DASHBOARD VIEW (DIME AESTHETIC & DUAL CHARTS)
  renderDashboardView(container) {
    const grand = this.calculateGrandTotalStats();
    const dualMain = this.formatDual(grand.grandTotalUSD);
    const dateStr = new Date().toLocaleDateString('th-TH', { year: '2-digit', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const milestones = this.evaluateMilestones();
    const unlockedCount = milestones.filter(m => m.unlocked).length;

    let html = `
      <!-- DIME HERO BANNER -->
      <div class="dime-hero-banner">
        <div class="dime-hero-header">
          <span class="dime-hero-label">สินทรัพย์รวมทั้งหมด (Total Net Worth)</span>
          <span class="dime-timestamp font-mono">อัปเดต: ${dateStr} น.</span>
        </div>
        <div class="dime-main-value font-mono">${dualMain.main}</div>
        <div class="dime-sub-value font-mono">${dualMain.sub} (อิงอัตราแลกเปลี่ยน ฿${this.exchangeRate.toFixed(2)})</div>

        <div class="dime-hero-metrics">
          <div class="hero-metric-item">
            <span class="text-muted">เปลี่ยนแปลงเฉลี่ย 1 วัน:</span>
            <span class="metric-pill ${grand.avg1dChangePct >= 0 ? 'positive' : 'negative'} font-mono">
              ${grand.avg1dChangePct >= 0 ? '↗' : '↘'} ${this.formatPercent(grand.avg1dChangePct)}
            </span>
          </div>
          <div class="hero-metric-item">
            <span class="text-muted">กำไร/ขาดทุนสินทรัพย์หุ้น:</span>
            <span class="metric-pill ${grand.totalPLUSD >= 0 ? 'positive' : 'negative'} font-mono">
              ${grand.totalPLUSD >= 0 ? '↗' : '↘'} ${this.formatPercent(grand.totalPLPct)} (${this.formatUSD(grand.totalPLUSD)} / ${this.formatTHB(this.usdToThb(grand.totalPLUSD))})
            </span>
          </div>
        </div>
      </div>

      <!-- GAMIFICATION: MILESTONE BADGES -->
      <div class="section-header">
        <div class="section-title">
          <span>🎯 เหรียญตราความสำเร็จทางการเงิน (Milestones & Badges)</span>
          <span class="section-count-badge font-mono">${unlockedCount}/${milestones.length} ปลดล็อก</span>
        </div>
      </div>
      <div class="milestones-grid">
        ${milestones.map(b => `
          <div class="milestone-badge-card ${b.unlocked ? 'unlocked' : 'locked'}" title="${b.desc}">
            <div class="milestone-badge-icon">${b.icon}</div>
            <div class="milestone-badge-info">
              <h5>${b.name} ${b.unlocked ? '✅' : '🔒'}</h5>
              <p>${b.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- ANALYTICS DONUT CHARTS (DIME ANALYTICS STYLE) -->
      <div class="analytics-charts-grid">
        <div class="chart-card">
          <div class="chart-title">
            <span>🍩 สัดส่วนตามประเภทสินทรัพย์ (Asset Allocation)</span>
          </div>
          <div class="chart-canvas-container">
            <canvas id="chart-asset-classes"></canvas>
          </div>
          <div class="chart-legend-list" id="legend-asset-classes"></div>
        </div>

        <div class="chart-card">
          <div class="chart-title">
            <span>🎯 สัดส่วนตามพอร์ตเป้าหมาย (Sub-Portfolios)</span>
          </div>
          <div class="chart-canvas-container">
            <canvas id="chart-portfolio-weights"></canvas>
          </div>
          <div class="chart-legend-list" id="legend-portfolio-weights"></div>
        </div>

        <div class="chart-card">
          <div class="chart-title">
            <span>🍩 สัดส่วนสินทรัพย์ย่อยทั้งหมด (Holdings Allocation)</span>
          </div>
          <div class="chart-canvas-container">
            <canvas id="chart-all-holdings"></canvas>
          </div>
          <div class="chart-legend-list" id="legend-all-holdings"></div>
        </div>
      </div>

      <!-- SUB-PORTFOLIOS CARDS (DIME CARDS) -->
      <div class="section-header">
        <div class="section-title">
          <span>พอร์ตการลงทุนตามเป้าหมาย (Goal-Based IPS)</span>
          <span class="section-count-badge font-mono">${this.portfolios.length} พอร์ต</span>
        </div>
        <button class="btn btn-sm btn-secondary" id="btn-add-portfolio-modal">
          <span>➕ เพิ่มพอร์ตใหม่</span>
        </button>
      </div>

      <div class="portfolios-grid">
    `;

    this.portfolios.forEach(p => {
      const stats = this.calculatePortfolioStats(p);
      const dualVal = this.formatDual(stats.totalValueUSD);
      const dualCash = this.formatDual(stats.cashBufferUSD);

      html += `
        <div class="port-card" data-open-port="${p.id}" style="border-left: 4px solid ${p.color || '#10b981'};">
          <div class="port-card-top">
            ${p.logo ? `<img src="${p.logo}" class="port-logo-img" alt="${p.name}" onerror="this.style.display='none'">` : ''}
            <div class="port-info-col">
              <div class="port-card-name">${p.emoji || '📁'} ${p.name}</div>
              <div class="port-card-tag">${p.tier} • ${p.category} (${stats.assetCount} สินทรัพย์)</div>
            </div>
            <div class="port-card-value-box">
              <div class="port-card-val-primary font-mono">${dualVal.main}</div>
              <div class="port-card-val-secondary font-mono">${dualVal.sub}</div>
            </div>
          </div>

          <div class="port-cash-buffer-tag">
            <span>💧 เงินไว้ช้อน (Cash Buffer):</span>
            <strong class="font-mono">${dualCash.main}</strong>
          </div>

          <div class="port-card-stats font-mono">
            <div>
              <div class="port-stat-label">1D Change</div>
              <div class="port-stat-val ${stats.avg1dChangePct >= 0 ? 'text-emerald' : 'text-rose'}">
                ${stats.avg1dChangePct >= 0 ? '↗' : '↘'} ${this.formatPercent(stats.avg1dChangePct)}
              </div>
            </div>
            <div style="text-align: right;">
              <div class="port-stat-label">P/L หุ้นที่ถือ</div>
              <div class="port-stat-val ${stats.totalPLPct >= 0 ? 'text-emerald' : 'text-rose'}">
                ${stats.totalPLPct >= 0 ? '↗' : '↘'} ${this.formatPercent(stats.totalPLPct)} (${this.formatUSD(stats.totalPLUSD)})
              </div>
            </div>
          </div>

          <div class="port-goal-progress-wrap">
            <div class="goal-label-row font-mono">
              <span>เป้าหมาย: ${this.formatUSD(stats.goalUSD)} (${this.formatTHB(this.usdToThb(stats.goalUSD))})</span>
              <strong>${stats.goalProgressPct.toFixed(1)}%</strong>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${stats.goalProgressPct}%; background: ${p.color || '#10b981'};"></div>
            </div>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;

    // Render Chart.js Donut Charts
    setTimeout(() => {
      this.initDashboardCharts();
    }, 50);
  }

  initDashboardCharts() {
    // 1. Asset Class Donut Chart
    const grand = this.calculateGrandTotalStats();
    const ctxAsset = document.getElementById('chart-asset-classes')?.getContext('2d');
    if (ctxAsset) {
      const labels = ['หุ้นและกองทุน (US Stocks)', 'เงินสดไว้ช้อน (Cash Buffer)', 'พอร์ตเทรด (Forex & Option)'];
      const dataValues = [grand.totalStocksUSD, grand.totalCashBufferUSD, grand.totalTradingUSD];
      const colors = ['#a855f7', '#38bdf8', '#f59e0b'];

      this.charts.asset = new Chart(ctxAsset, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data: dataValues,
            backgroundColor: colors,
            borderWidth: 0,
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '72%',
          plugins: { legend: { display: false } }
        }
      });

      // Render custom legend
      const legendEl = document.getElementById('legend-asset-classes');
      if (legendEl) {
        const total = grand.grandTotalUSD || 1;
        legendEl.innerHTML = labels.map((lbl, idx) => {
          const val = dataValues[idx];
          const pct = ((val / total) * 100).toFixed(2);
          return `
            <div class="chart-legend-item">
              <div><span class="legend-color-dot" style="background: ${colors[idx]}"></span>${lbl}</div>
              <strong class="font-mono">${pct}% (${this.formatUSD(val)})</strong>
            </div>
          `;
        }).join('');
      }
    }

    // 2. Sub-Portfolio Weights Donut Chart
    const ctxPort = document.getElementById('chart-portfolio-weights')?.getContext('2d');
    if (ctxPort) {
      const portLabels = [];
      const portValues = [];
      const portColors = [];

      this.portfolios.forEach(p => {
        const s = this.calculatePortfolioStats(p);
        if (s.totalValueUSD > 0) {
          portLabels.push(`${p.emoji || ''} ${p.name}`);
          portValues.push(s.totalValueUSD);
          portColors.push(p.color || '#10b981');
        }
      });

      const { totalTradingUSD } = this.getTradingLatestBalances();
      if (totalTradingUSD > 0) {
        portLabels.push('💱 Trading (Forex & Option)');
        portValues.push(totalTradingUSD);
        portColors.push('#f59e0b');
      }

      this.charts.ports = new Chart(ctxPort, {
        type: 'doughnut',
        data: {
          labels: portLabels,
          datasets: [{
            data: portValues,
            backgroundColor: portColors,
            borderWidth: 0,
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '72%',
          plugins: { legend: { display: false } }
        }
      });

      const legendEl = document.getElementById('legend-portfolio-weights');
      if (legendEl) {
        const grandTotal = grand.grandTotalUSD || 1;
        legendEl.innerHTML = portLabels.map((lbl, idx) => {
          const val = portValues[idx];
          const pct = ((val / grandTotal) * 100).toFixed(2);
          return `
            <div class="chart-legend-item">
              <div><span class="legend-color-dot" style="background: ${portColors[idx]}"></span>${lbl}</div>
              <strong class="font-mono">${pct}% (${this.formatUSD(val)})</strong>
            </div>
          `;
        }).join('');
      }
    }

    // 3. All Holdings Allocation Donut Chart (Dynamic Ticker Breakdown with Logos & %)
    const ctxHoldings = document.getElementById('chart-all-holdings')?.getContext('2d');
    if (ctxHoldings) {
      const tickerMap = {};
      let totalStockValue = 0;

      this.portfolios.forEach(p => {
        (p.holdings || []).forEach(h => {
          const stats = this.calculateHoldingStats(h);
          if (stats.marketValueUSD > 0) {
            const sym = h.ticker.toUpperCase().trim();
            if (!tickerMap[sym]) {
              tickerMap[sym] = { ticker: sym, marketValueUSD: 0 };
            }
            tickerMap[sym].marketValueUSD += stats.marketValueUSD;
            totalStockValue += stats.marketValueUSD;
          }
        });
      });

      const sortedHoldings = Object.values(tickerMap).sort((a, b) => b.marketValueUSD - a.marketValueUSD);

      const holdingsLabels = sortedHoldings.map(item => item.ticker);
      const holdingsValues = sortedHoldings.map(item => item.marketValueUSD);
      const palette = ['#3b82f6', '#f97316', '#a855f7', '#10b981', '#ec4899', '#eab308', '#06b6d4', '#8b5cf6', '#f43f5e', '#6366f1', '#14b8a6', '#f59e0b'];
      const holdingsColors = sortedHoldings.map((_, idx) => palette[idx % palette.length]);

      this.charts.allHoldings = new Chart(ctxHoldings, {
        type: 'doughnut',
        data: {
          labels: holdingsLabels,
          datasets: [{
            data: holdingsValues,
            backgroundColor: holdingsColors,
            borderWidth: 0,
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '72%',
          plugins: { legend: { display: false } }
        }
      });

      const legendEl = document.getElementById('legend-all-holdings');
      if (legendEl) {
        if (sortedHoldings.length === 0) {
          legendEl.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 12px;">ไม่มีรายการหุ้นในขณะนี้</div>`;
        } else {
          legendEl.innerHTML = sortedHoldings.map((item, idx) => {
            const pct = totalStockValue > 0 ? ((item.marketValueUSD / totalStockValue) * 100).toFixed(1) : '0.0';
            return `
              <div class="chart-legend-item" style="display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 6px 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="legend-color-dot" style="background: ${holdingsColors[idx]}; width: 10px; height: 10px; border-radius: 50%; display: inline-block;"></span>
                  ${this.renderStockLogoHTML(item.ticker, holdingsColors[idx], 24)}
                  <strong style="font-size: 13px; color: #fff;">${item.ticker}</strong>
                </div>
                <div style="text-align: right;" class="font-mono">
                  <span style="color: var(--color-emerald); font-weight: 700; font-size: 13px;">${pct}%</span>
                  <span style="font-size: 11px; color: var(--text-muted); margin-left: 4px;">(${this.formatUSD(item.marketValueUSD)})</span>
                </div>
              </div>
            `;
          }).join('');
        }
      }
    }
  }

  // 2. SUB-PORTFOLIO & DIME HOLDINGS VIEW
  renderPortfoliosView(container) {
    const port = this.portfolios.find(p => p.id === this.selectedPortfolioId) || this.portfolios[0];
    if (!port) return;

    const stats = this.calculatePortfolioStats(port);
    const dualTotal = this.formatDual(stats.totalValueUSD);
    const dualGoal = this.formatDual(stats.goalUSD);
    const dualCash = this.formatDual(stats.cashBufferUSD);
    const holdings = port.holdings || [];

    let html = `
      <!-- SUBPORTFOLIO HERO HEADER (DIME APP ACCURATE) -->
      <div class="subport-hero-header" style="--hero-theme-bg: ${port.color}15; --hero-theme-border: ${port.color}40;">
        <div class="subport-hero-top">
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            ${this.portfolios.map(p => `
              <button class="btn btn-sm ${p.id === port.id ? 'btn-primary' : 'btn-secondary'}" data-select-port="${p.id}" style="${p.id === port.id ? `background: ${p.color}; border-color: ${p.color};` : ''}">
                ${p.emoji || '📁'} ${p.name.split(' ')[0]}
              </button>
            `).join('')}
          </div>
          <button class="btn btn-sm btn-secondary" id="btn-edit-current-port">⚙️ แก้ไขพอร์ต</button>
        </div>

        <div class="subport-hero-main">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span style="font-size: 13px; color: ${port.color}; font-weight: 700; text-transform: uppercase;">${port.tier} • ${port.category}</span>
              ${port.timeHorizon ? `<span class="badge font-mono" style="background: rgba(255,255,255,0.08); padding: 2px 8px; border-radius: var(--radius-full); font-size: 11px; color: var(--text-secondary);">⏱️ Horizon: ${port.timeHorizon}</span>` : ''}
            </div>
            <h2 style="font-size: 26px; font-weight: 800; color: #fff; margin-top: 2px;">${port.emoji || ''} ${port.name}</h2>
            <div class="subport-target-goal-text font-mono">
              🎯 เป้าหมายพอร์ต: <strong class="text-white">${this.formatTHB(port.goalTHB || this.usdToThb(stats.goalUSD))}</strong> (${this.formatUSD(stats.goalUSD)}) • ความคืบหน้า <strong>${stats.goalProgressPct.toFixed(1)}%</strong>
            </div>
            <div class="progress-bar-bg" style="width: 280px; margin-top: 8px;">
              <div class="progress-bar-fill" style="width: ${stats.goalProgressPct}%; background: ${port.color || '#10b981'};"></div>
            </div>
          </div>

          <div style="text-align: right;">
            <div style="font-size: 12px; color: var(--text-muted);">มูลค่ารวมของพอร์ต</div>
            <div style="font-size: 32px; font-weight: 800; color: #fff;" class="font-mono">${dualTotal.main}</div>
            <div style="font-size: 14px; color: var(--text-secondary);" class="font-mono">${dualTotal.sub}</div>
            <div class="font-mono" style="margin-top: 4px; font-size: 13px;">
              1D: <span class="${stats.avg1dChangePct >= 0 ? 'text-emerald' : 'text-rose'} font-bold">${this.formatPercent(stats.avg1dChangePct)}</span> | 
              P/L: <span class="${stats.totalPLPct >= 0 ? 'text-emerald' : 'text-rose'} font-bold">${this.formatPercent(stats.totalPLPct)}</span>
            </div>
          </div>
        </div>

        ${port.notes ? `<div style="margin-top: 14px; padding: 8px 12px; background: rgba(0,0,0,0.3); border-radius: var(--radius-sm); font-size: 12px; color: var(--text-secondary);">📝 ${port.notes}</div>` : ''}
      </div>

      <!-- DEDICATED CASH BUFFER (เงินไว้ช้อน) SECTION -->
      <div class="subport-cash-buffer-box">
        <div class="cash-box-left">
          <div class="cash-box-icon">💧</div>
          <div>
            <div class="cash-box-title">Cash Buffer (เงินสดไว้ช้อนซื้อหุ้นของพอร์ตนี้)</div>
            <div class="cash-box-val font-mono">${dualCash.main}</div>
            <div class="cash-box-sub font-mono">${dualCash.sub} ${port.targetCashBufferTHB ? `• (เป้าหมายตาม IPS: ${this.formatTHB(port.targetCashBufferTHB)})` : ''}</div>
          </div>
        </div>
        <div class="cash-box-actions">
          <button class="btn btn-sm btn-secondary" id="btn-manage-cash-buffer" data-port-id="${port.id}">
            <span>➕/➖ ฝาก-ถอนเงินสด</span>
          </button>
          <button class="btn btn-sm btn-primary" id="btn-quick-buy-with-cash" data-port-id="${port.id}">
            <span>🛒 ช้อนซื้อหุ้นทันที</span>
          </button>
        </div>
      </div>

      <!-- SUBPORTFOLIO HOLDINGS DONUT CHART -->
      ${holdings.length > 0 ? `
        <div class="chart-card" style="margin-bottom: 20px;">
          <div class="chart-title">
            <span>🍩 สัดส่วนสินทรัพย์ย่อยในพอร์ต ${port.name}</span>
          </div>
          <div style="display: grid; grid-template-columns: 220px 1fr; gap: 16px; align-items: center;">
            <div class="chart-canvas-container" style="height: 180px; margin-bottom: 0;">
              <canvas id="chart-subport-holdings"></canvas>
            </div>
            <div class="chart-legend-list" id="legend-subport-holdings" style="max-height: 180px; overflow-y: auto;"></div>
          </div>
        </div>
      ` : ''}

      <!-- HOLDINGS LIST HEADER -->
      <div class="section-header">
        <div class="section-title">
          <span>รายการสินทรัพย์ที่ถือครอง (Dime Holdings)</span>
          <span class="section-count-badge font-mono">${(port.holdings || []).length} ตัว</span>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-sm btn-secondary" id="btn-add-holding-modal">
            <span>➕ เพิ่มหุ้นในพอร์ตนี้</span>
          </button>
        </div>
      </div>

      <!-- HOLDINGS LIST (DIME 4-METRIC CARDS) -->
      <div class="holdings-container">
    `;

    if (holdings.length === 0) {
      html += `
        <div style="text-align: center; padding: 48px 20px; background: var(--bg-card); border-radius: var(--radius-lg); color: var(--text-muted);">
          <div style="font-size: 40px; margin-bottom: 8px;">🛒</div>
          <h3>ยังไม่มีรายการหุ้นในพอร์ตนี้</h3>
          <p style="font-size: 13px; margin-top: 4px;">คลิกปุ่ม "➕ เพิ่มหุ้นในพอร์ตนี้" เพื่อเริ่มจดสินทรัพย์</p>
        </div>
      `;
    } else {
      holdings.forEach(h => {
        const s = this.calculateHoldingStats(h);
        const dualMarket = this.formatDual(s.marketValueUSD);
        const weightPct = stats.totalValueUSD > 0 ? ((s.marketValueUSD / stats.totalValueUSD) * 100).toFixed(2) : '0.00';
        const targetProgressPct = h.targetTHB > 0 ? Math.min(100, Math.max(0, (s.marketValueTHB / h.targetTHB) * 100)) : null;

        const isDipActive = h.dipTargetUSD > 0 && s.currentPrice > 0 && s.currentPrice <= h.dipTargetUSD;

        html += `
          <div class="holding-card ${isDipActive ? 'dip-active' : ''}">
            <div class="holding-header">
              <div class="holding-ticker-group">
                ${this.renderStockLogoHTML(h.ticker, port.color || '#10b981', 42)}
                <div class="ticker-name-box">
                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <h4 style="margin: 0;">${h.ticker}</h4>
                    ${isDipActive ? `<span class="dip-alert-badge">🔥 ถึงจุดช้อน ($${s.currentPrice.toFixed(2)} ≤ $${h.dipTargetUSD.toFixed(2)})</span>` : (h.dipTargetUSD ? `<span style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">🎯 เล็งช้อน: $${h.dipTargetUSD.toFixed(2)}</span>` : '')}
                  </div>
                  <div class="ticker-subname">${h.name || h.ticker}</div>
                </div>
              </div>

              <div class="holding-value-group">
                <div class="holding-market-val-thb font-mono">${dualMarket.main}</div>
                <div class="holding-market-val-usd font-mono">${dualMarket.sub}</div>
                <div class="holding-weight-tag font-mono">สัดส่วน: ${weightPct}%</div>
                <div class="holding-pl-badge font-mono ${s.unrealizedPLUSD >= 0 ? 'text-emerald' : 'text-rose'}">
                  ${s.unrealizedPLUSD >= 0 ? '↗' : '↘'} ${this.formatPercent(s.unrealizedPLPct)} (${this.formatUSD(s.unrealizedPLUSD)})
                </div>
              </div>
            </div>

            <!-- DIME 4-METRICS GRID -->
            <div class="dime-metrics-grid font-mono">
              <div class="metric-cell">
                <span class="metric-cell-label">จำนวนหุ้นคงเหลือ (Shares)</span>
                <span class="metric-cell-val">${s.shares.toFixed(7)}</span>
              </div>
              <div class="metric-cell" style="text-align: right;">
                <span class="metric-cell-label">ราคาตลาด ($) และ % 1 วัน</span>
                <span class="metric-cell-val ${s.change1d >= 0 ? 'text-emerald' : 'text-rose'}">
                  $${s.currentPrice.toFixed(2)} (${this.formatPercent(s.change1d)})
                </span>
              </div>
              <div class="metric-cell">
                <span class="metric-cell-label">ต้นทุนต่อหุ้นเฉลี่ย (Avg Cost)</span>
                <span class="metric-cell-val">$${s.avgCost.toFixed(4)}</span>
              </div>
              <div class="metric-cell" style="text-align: right;">
                <span class="metric-cell-label">ต้นทุนรวม (Total Cost)</span>
                <span class="metric-cell-val">${this.formatUSD(s.totalCostUSD)}</span>
              </div>
            </div>

            ${h.targetTHB ? `
              <div style="margin: -6px 0 16px 0; padding: 10px 14px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 5px;" class="font-mono">
                  <span style="color: var(--text-secondary);">🎯 เป้าหมายตาม IPS: <strong class="text-white">${this.formatTHB(h.targetTHB)} (${this.formatUSD(h.targetTHB / this.exchangeRate)})</strong></span>
                  <strong class="${(s.marketValueTHB >= h.targetTHB) ? 'text-emerald' : 'text-amber'}">${((s.marketValueTHB / h.targetTHB) * 100).toFixed(1)}%</strong>
                </div>
                <div class="progress-bar-bg" style="height: 5px;">
                  <div class="progress-bar-fill" style="width: ${targetProgressPct}%; background: ${port.color || '#10b981'};"></div>
                </div>
              </div>
            ` : ''}

            <div class="holding-actions-row">
              <button class="btn btn-sm btn-secondary" data-edit-holding="${h.id}" data-port-id="${port.id}">✏️ แก้ไข</button>
              <button class="btn btn-sm btn-primary" data-trade-holding="${h.id}" data-port-id="${port.id}">⚡ ซื้อ-ขาย</button>
            </div>
          </div>
        `;
      });
    }

    html += `</div>`;
    container.innerHTML = html;

    setTimeout(() => {
      this.initSubportCharts(port);
    }, 50);
  }

  initSubportCharts(port) {
    const ctxSub = document.getElementById('chart-subport-holdings')?.getContext('2d');
    if (!ctxSub || !port || !port.holdings || port.holdings.length === 0) return;

    const holdingsStats = port.holdings.map(h => {
      const stats = this.calculateHoldingStats(h);
      return {
        ticker: h.ticker,
        marketValueUSD: stats.marketValueUSD
      };
    }).filter(h => h.marketValueUSD > 0).sort((a, b) => b.marketValueUSD - a.marketValueUSD);

    const totalUSD = holdingsStats.reduce((sum, h) => sum + h.marketValueUSD, 0);
    const labels = holdingsStats.map(h => h.ticker);
    const dataValues = holdingsStats.map(h => h.marketValueUSD);
    const palette = ['#10b981', '#38bdf8', '#a855f7', '#f59e0b', '#ec4899', '#3b82f6', '#f97316', '#06b6d4'];
    const colors = holdingsStats.map((_, idx) => palette[idx % palette.length]);

    if (this.charts.subport) {
      this.charts.subport.destroy();
    }

    this.charts.subport = new Chart(ctxSub, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: dataValues,
          backgroundColor: colors,
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: { legend: { display: false } }
      }
    });

    const legendEl = document.getElementById('legend-subport-holdings');
    if (legendEl) {
      legendEl.innerHTML = holdingsStats.map((item, idx) => {
        const pct = totalUSD > 0 ? ((item.marketValueUSD / totalUSD) * 100).toFixed(1) : '0.0';
        return `
          <div class="chart-legend-item" style="display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 4px 6px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="legend-color-dot" style="background: ${colors[idx]}; width: 8px; height: 8px; border-radius: 50%;"></span>
              ${this.renderStockLogoHTML(item.ticker, colors[idx], 22)}
              <strong style="font-size: 12px; color: #fff;">${item.ticker}</strong>
            </div>
            <div style="text-align: right;" class="font-mono">
              <span style="color: var(--color-emerald); font-weight: 700; font-size: 12px;">${pct}%</span>
              <span style="font-size: 10px; color: var(--text-muted); margin-left: 4px;">(${this.formatUSD(item.marketValueUSD)})</span>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // 3. FOREX & OPTION MONTHLY CAPITAL JOURNAL VIEW
  renderTradingView(container) {
    const { balances, totalTradingUSD } = this.getTradingLatestBalances();
    const dualTotal = this.formatDual(totalTradingUSD);

    let html = `
      <div class="dime-hero-banner" style="background: linear-gradient(135deg, #2d1808 0%, #171108 40%, #0f131a 100%); border-color: rgba(245, 158, 11, 0.3);">
        <div class="dime-hero-header">
          <span class="dime-hero-label text-amber">พอร์ตเทรดกระแสเงินสด (Forex & Option Trading)</span>
        </div>
        <div class="dime-main-value font-mono">${dualTotal.main}</div>
        <div class="dime-sub-value font-mono">${dualTotal.sub} • อัปเดตเฉพาะยอดเงินรวมรายเดือน (USD)</div>
      </div>

      <!-- SECTION HEADER WITH ADD TRADING PORTFOLIO BUTTON -->
      <div class="section-header">
        <div class="section-title">
          <span>รายการพอร์ตเทรด (Trading Accounts)</span>
          <span class="section-count-badge font-mono">${Object.keys(this.tradingData || {}).length} พอร์ต</span>
        </div>
        <button class="btn btn-sm btn-primary" id="btn-add-trading-port-modal">
          <span>➕ เพิ่มพอร์ตเทรดใหม่</span>
        </button>
      </div>

      <div class="trading-summary-cards">
    `;

    for (const [key, item] of Object.entries(this.tradingData || {})) {
      const list = item.monthlyBalances || [];
      const latest = list.length > 0 ? list[list.length - 1] : { balanceUSD: 0, note: '' };
      const latestUSD = latest.balanceUSD || 0;

      html += `
        <div class="trading-port-card" style="border-top: 3px solid ${item.color || '#38bdf8'};">
          <div class="trading-port-header">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="trading-title">${item.name}</span>
              <button class="btn-icon-xs" data-edit-trading-port="${key}" title="แก้ไขชื่อหรือลบพอร์ต">⚙️ แก้ไข/ลบ</button>
            </div>
            <span class="badge font-mono text-amber">Latest: ${this.formatUSD(latestUSD)}</span>
          </div>

          <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 6px;">ยอดเงินทุนปัจจุบัน ($ USD)</div>
          <input type="number" step="any" class="trading-balance-input font-mono" data-trading-key="${key}" value="${latestUSD}">
          <div class="font-mono" style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">
            ≈ ${this.formatTHB(this.usdToThb(latestUSD))}
          </div>

          <div style="display: flex; gap: 8px;">
            <button class="btn btn-sm btn-primary" data-save-trading-key="${key}">💾 บันทึกยอดเงิน</button>
            <button class="btn btn-sm btn-secondary" data-log-trading-history="${key}">📅 ประวัติรายเดือน</button>
          </div>
        </div>
      `;
    }

    html += `
      </div>

      <!-- TRADING EQUITY CURVE CHART -->
      <div class="chart-card">
        <div class="chart-title">
          <span>📈 กราฟการเติบโตของทุนเทรดรายเดือน (Trading Capital Growth)</span>
        </div>
        <div class="chart-canvas-container" style="height: 280px;">
          <canvas id="chart-trading-equity"></canvas>
        </div>
      </div>
    `;

    container.innerHTML = html;

    setTimeout(() => {
      this.initTradingChart();
    }, 50);
  }

  initTradingChart() {
    const ctx = document.getElementById('chart-trading-equity')?.getContext('2d');
    if (!ctx) return;

    // Collect all unique sorted months
    const monthSet = new Set();
    for (const item of Object.values(this.tradingData || {})) {
      (item.monthlyBalances || []).forEach(m => {
        monthSet.add(`${m.year}-${String(m.month).padStart(2, '0')}`);
      });
    }

    let labels = Array.from(monthSet).sort();
    if (labels.length === 0) {
      labels = ['2026-06', '2026-07', '2026-08'];
    }

    const defaultColors = ['#38bdf8', '#f43f5e', '#a855f7', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];
    const datasets = [];

    let colorIdx = 0;
    for (const [key, item] of Object.entries(this.tradingData || {})) {
      const color = item.color || defaultColors[colorIdx % defaultColors.length];
      colorIdx++;

      const monthMap = {};
      (item.monthlyBalances || []).forEach(m => {
        monthMap[`${m.year}-${String(m.month).padStart(2, '0')}`] = m.balanceUSD;
      });

      const data = labels.map(lbl => monthMap[lbl] !== undefined ? monthMap[lbl] : null);

      datasets.push({
        label: item.name,
        data,
        borderColor: color,
        backgroundColor: color + '20',
        fill: true,
        spanGaps: true,
        tension: 0.3
      });
    }

    this.charts.trading = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: {
          y: {
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { callback: v => '$' + v }
          },
          x: { grid: { color: 'rgba(255,255,255,0.06)' } }
        }
      }
    });
  }

  // 4. DIVIDEND TRACKER & CASHFLOW VIEW
  renderDividendsView(container) {
    let totalGrossUSD = 0;
    let totalTaxUSD = 0;
    let totalNetUSD = 0;

    this.dividends.forEach(d => {
      totalGrossUSD += parseFloat(d.grossUSD) || 0;
      totalTaxUSD += parseFloat(d.taxUSD) || 0;
      totalNetUSD += parseFloat(d.netUSD) || 0;
    });

    const dualNet = this.formatDual(totalNetUSD);

    let html = `
      <div class="dime-hero-banner" style="background: linear-gradient(135deg, #0e291e 0%, #0d1e17 40%, #0f131a 100%);">
        <div class="dime-hero-header">
          <span class="dime-hero-label text-emerald">เงินปันผลสะสมทั้งหมด (Total Net Dividends)</span>
        </div>
        <div class="dime-main-value font-mono">${dualNet.main}</div>
        <div class="dime-sub-value font-mono">${dualNet.sub} (หักภาษี WHT 15% แล้ว)</div>
      </div>

      <div class="dividend-stats-row">
        <div class="div-stat-box">
          <span class="text-muted" style="font-size: 12px;">ปันผลรวม Gross (USD)</span>
          <div class="font-mono" style="font-size: 20px; font-weight: 700; color: #fff;">${this.formatUSD(totalGrossUSD)}</div>
        </div>
        <div class="div-stat-box">
          <span class="text-muted" style="font-size: 12px;">ภาษีหัก ณ ที่จ่าย 15% (USD)</span>
          <div class="font-mono text-rose" style="font-size: 20px; font-weight: 700;">-${this.formatUSD(totalTaxUSD)}</div>
        </div>
        <div class="div-stat-box">
          <span class="text-muted" style="font-size: 12px;">ปันผลสุทธิ Net (THB)</span>
          <div class="font-mono text-emerald" style="font-size: 20px; font-weight: 700;">${this.formatTHB(this.usdToThb(totalNetUSD))}</div>
        </div>
      </div>

      <div class="section-header">
        <div class="section-title">
          <span>ประวัติการรับเงินปันผล</span>
          <span class="section-count-badge font-mono">${this.dividends.length} รายการ</span>
        </div>
        <button class="btn btn-sm btn-primary" id="btn-add-dividend-modal">
          <span>➕ บันทึกเงินปันผลรับ</span>
        </button>
      </div>

      <div class="div-table-wrap">
        <table class="custom-table font-mono">
          <thead>
            <tr>
              <th>วันที่</th>
              <th>Ticker</th>
              <th>พอร์ตที่ได้รับ</th>
              <th>Gross ($)</th>
              <th>Tax 15%</th>
              <th>Net ($)</th>
              <th>Net (฿)</th>
              <th>หมายเหตุ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
    `;

    if (this.dividends.length === 0) {
      html += `<tr><td colspan="9" style="text-align: center; padding: 32px;">ยังไม่มีบันทึกเงินปันผล</td></tr>`;
    } else {
      this.dividends.forEach(d => {
        const port = this.portfolios.find(p => p.id === d.portfolioId);
        const netTHB = this.usdToThb(d.netUSD);
        html += `
          <tr>
            <td>${d.date}</td>
            <td><strong>${d.ticker}</strong></td>
            <td>${port ? port.emoji + ' ' + port.name : d.portfolioId}</td>
            <td>${this.formatUSD(d.grossUSD)}</td>
            <td class="text-rose">-${this.formatUSD(d.taxUSD)}</td>
            <td class="text-emerald font-bold">${this.formatUSD(d.netUSD)}</td>
            <td class="text-emerald font-bold">${this.formatTHB(netTHB)}</td>
            <td style="font-family: var(--font-ui);">${d.notes || '-'}</td>
            <td>
              <button class="btn btn-sm btn-danger" data-delete-dividend="${d.id}">ลบ</button>
            </td>
          </tr>
        `;
      });
    }

    html += `
          </tbody>
        </table>
      </div>
    `;

    container.innerHTML = html;
  }

  // 5. QUARTERLY COMPARISON & AUTO-SNAPSHOT VIEW
  renderQuarterlyView(container) {
    const currentYear = new Date().getFullYear();
    const currentQuarter = 'Q' + Math.ceil((new Date().getMonth() + 1) / 3);

    let html = `
      <div class="quarterly-action-banner">
        <div>
          <h3 style="font-size: 18px; font-weight: 700; color: #fff;">📸 ระบบบันทึกเปรียบเทียบการเติบโตรายไตรมาส (Quarterly Engine)</h3>
          <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
            บันทึก Snapshot สถานะพอร์ตล่าสุดลง Firebase อัตโนมัติ เพื่อเปรียบเทียบการเติบโต Q-on-Q
          </p>
        </div>
        <button class="btn btn-primary btn-glow" id="btn-take-quarter-snapshot">
          <span>📸 บันทึก Snapshot (${currentQuarter}/${currentYear})</span>
        </button>
      </div>

      <div class="section-header">
        <div class="section-title">
          <span>ตารางเปรียบเทียบผลงานรายไตรมาส (Quarterly Records)</span>
        </div>
      </div>

      <div class="div-table-wrap">
        <table class="custom-table font-mono">
          <thead>
            <tr>
              <th>พอร์ตการลงทุน</th>
              <th>Q1 Value ($)</th>
              <th>Q2 Value ($)</th>
              <th>Q3 Value ($)</th>
              <th>Q4 Value ($)</th>
              <th>ล่าสุด ($)</th>
              <th>การเติบโต</th>
            </tr>
          </thead>
          <tbody>
    `;

    const q1Map = this.quarterlySnapshots.find(q => q.quarter === 'Q1')?.portValuesUSD || {};
    const q2Map = this.quarterlySnapshots.find(q => q.quarter === 'Q2')?.portValuesUSD || {};
    const q3Map = this.quarterlySnapshots.find(q => q.quarter === 'Q3')?.portValuesUSD || {};
    const q4Map = this.quarterlySnapshots.find(q => q.quarter === 'Q4')?.portValuesUSD || {};

    this.portfolios.forEach(p => {
      const s = this.calculatePortfolioStats(p);
      const q1Val = q1Map[p.id] || 0;
      const q2Val = q2Map[p.id] || 0;
      const q3Val = q3Map[p.id] || 0;
      const q4Val = q4Map[p.id] || 0;

      const baseVal = q1Val || q2Val || s.totalValueUSD;
      const diff = s.totalValueUSD - baseVal;
      const pct = baseVal > 0 ? (diff / baseVal) * 100 : 0;

      html += `
        <tr>
          <td style="font-family: var(--font-ui); font-weight: 700;">${p.emoji || ''} ${p.name}</td>
          <td>${q1Val > 0 ? this.formatUSD(q1Val) : '-'}</td>
          <td>${q2Val > 0 ? this.formatUSD(q2Val) : '-'}</td>
          <td>${q3Val > 0 ? this.formatUSD(q3Val) : '-'}</td>
          <td>${q4Val > 0 ? this.formatUSD(q4Val) : '-'}</td>
          <td class="font-bold">${this.formatUSD(s.totalValueUSD)}</td>
          <td class="${pct >= 0 ? 'text-emerald' : 'text-rose'} font-bold">
            ${pct >= 0 ? '+' : ''}${this.formatUSD(diff)} (${this.formatPercent(pct)})
          </td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;

    container.innerHTML = html;
  }

  takeQuarterlySnapshot() {
    const currentYear = new Date().getFullYear();
    const currentQuarter = 'Q' + Math.ceil((new Date().getMonth() + 1) / 3);
    const dateStr = new Date().toISOString().split('T')[0];

    const portValuesUSD = {};
    let totalUSD = 0;

    this.portfolios.forEach(p => {
      const s = this.calculatePortfolioStats(p);
      portValuesUSD[p.id] = s.totalValueUSD;
      totalUSD += s.totalValueUSD;
    });

    const { balances, totalTradingUSD } = this.getTradingLatestBalances();
    Object.assign(portValuesUSD, balances);
    totalUSD += totalTradingUSD;

    // Check if exists
    const idx = this.quarterlySnapshots.findIndex(q => q.year === currentYear && q.quarter === currentQuarter);
    const newSnapshot = {
      year: currentYear,
      quarter: currentQuarter,
      date: dateStr,
      exchangeRate: this.exchangeRate,
      portValuesUSD,
      totalUSD,
      notes: `Snapshot อัตโนมัติ ${currentQuarter}/${currentYear}`
    };

    if (idx >= 0) {
      this.quarterlySnapshots[idx] = newSnapshot;
    } else {
      this.quarterlySnapshots.push(newSnapshot);
    }

    this.saveData();
    alert(`📸 บันทึก Snapshot ไตรมาส ${currentQuarter}/${currentYear} เรียบร้อยแล้ว!`);
  }

  // 5. FUTURE NET WORTH & COMPOUND INTEREST SIMULATOR VIEW
  renderSimulatorView(container) {
    const grand = this.calculateGrandTotalStats();
    const initCapital = Math.round(grand.grandTotalUSD) || 1000;

    let html = `
      <div class="dime-hero-banner" style="background: linear-gradient(135deg, #1e1b4b 0%, #17112d 40%, #0f131a 100%); border-color: rgba(168, 85, 247, 0.3);">
        <div class="dime-hero-header">
          <span class="dime-hero-label text-purple">🔮 จำลองการเติบโตของพอร์ต & ดอกเบี้ยทบต้น (Compound Simulator)</span>
        </div>
        <div class="dime-main-value font-mono" id="sim-hero-future-val">$0.00</div>
        <div class="dime-sub-value font-mono" id="sim-hero-future-thb">≈ ฿0.00 • พลังของดอกเบี้ยทบต้น (The Power of Compounding)</div>
      </div>

      <div class="simulator-layout">
        <!-- SIMULATOR CONTROLS CARD -->
        <div class="chart-card">
          <div class="chart-title">
            <span>⚙️ ปรับแต่งตัวแปรการลงทุน (Simulation Parameters)</span>
          </div>

          <div class="sim-slider-group">
            <div class="sim-slider-header">
              <span class="sim-slider-label">เงินลงทุนเริ่มต้น (Initial Capital)</span>
              <span class="sim-slider-val" id="sim-val-init">$${initCapital.toLocaleString()}</span>
            </div>
            <input type="range" min="0" max="50000" step="100" value="${initCapital}" class="sim-range-input" id="sim-slider-init">
          </div>

          <div class="sim-slider-group">
            <div class="sim-slider-header">
              <span class="sim-slider-label">เงินออมเติมพอร์ตต่อเดือน (Monthly DCA)</span>
              <span class="sim-slider-val" id="sim-val-monthly">$100 / เดือน</span>
            </div>
            <input type="range" min="0" max="2000" step="10" value="100" class="sim-range-input" id="sim-slider-monthly">
          </div>

          <div class="sim-slider-group">
            <div class="sim-slider-header">
              <span class="sim-slider-label">ผลตอบแทนคาดหวังเฉลี่ยต่อปี (CAGR %)</span>
              <span class="sim-slider-val" id="sim-val-cagr">10.0% / ปี</span>
            </div>
            <input type="range" min="4" max="25" step="0.5" value="10" class="sim-range-input" id="sim-slider-cagr">
          </div>

          <div class="sim-slider-group">
            <div class="sim-slider-header">
              <span class="sim-slider-label">ระยะเวลาลงทุน (Investment Horizon)</span>
              <span class="sim-slider-val" id="sim-val-years">10 ปี</span>
            </div>
            <input type="range" min="1" max="30" step="1" value="10" class="sim-range-input" id="sim-slider-years">
          </div>

          <button id="btn-trigger-celebrate-sim" class="btn btn-sm btn-secondary" style="width: 100%; margin-top: 10px;">
            <span>🎉 จุดพลุฉลองความสำเร็จ (Test Confetti)</span>
          </button>
        </div>

        <!-- SIMULATOR CHART & RESULT STATS -->
        <div class="chart-card">
          <div class="chart-title">
            <span>📈 กราฟเงินต้น vs ดอกเบี้ยทบต้น (Wealth Projection Curve)</span>
          </div>

          <div class="sim-stats-grid">
            <div class="sim-stat-box">
              <div class="sim-stat-box-label">เงินต้นรวมที่ใส่ไป</div>
              <div class="sim-stat-box-val text-blue font-mono" id="sim-stat-principal">$0.00</div>
            </div>
            <div class="sim-stat-box">
              <div class="sim-stat-box-label">กำไรทบต้นที่งอกเงย</div>
              <div class="sim-stat-box-val text-emerald font-mono" id="sim-stat-interest">$0.00</div>
            </div>
            <div class="sim-stat-box">
              <div class="sim-stat-box-label">มูลค่ารวมสุทธิ</div>
              <div class="sim-stat-box-val text-purple font-mono" id="sim-stat-total">$0.00</div>
            </div>
          </div>

          <div class="chart-canvas-container" style="height: 280px;">
            <canvas id="chart-compound-simulator"></canvas>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;

    setTimeout(() => {
      this.initSimulatorEvents();
      this.updateSimulatorChart();
    }, 50);
  }

  initSimulatorEvents() {
    ['init', 'monthly', 'cagr', 'years'].forEach(key => {
      const slider = document.getElementById(`sim-slider-${key}`);
      slider?.addEventListener('input', () => this.updateSimulatorChart());
    });

    document.getElementById('btn-trigger-celebrate-sim')?.addEventListener('click', () => {
      this.triggerCelebration();
    });
  }

  updateSimulatorChart() {
    const initCap = parseFloat(document.getElementById('sim-slider-init')?.value) || 0;
    const monthly = parseFloat(document.getElementById('sim-slider-monthly')?.value) || 0;
    const cagr = parseFloat(document.getElementById('sim-slider-cagr')?.value) || 10;
    const years = parseInt(document.getElementById('sim-slider-years')?.value) || 10;

    // Update label text
    const initEl = document.getElementById('sim-val-init');
    if (initEl) initEl.textContent = `$${initCap.toLocaleString()} (≈ ฿${Math.round(this.usdToThb(initCap)).toLocaleString()})`;
    const monthlyEl = document.getElementById('sim-val-monthly');
    if (monthlyEl) monthlyEl.textContent = `$${monthly.toLocaleString()} / เดือน (≈ ฿${Math.round(this.usdToThb(monthly)).toLocaleString()})`;
    const cagrEl = document.getElementById('sim-val-cagr');
    if (cagrEl) cagrEl.textContent = `${cagr.toFixed(1)}% / ปี`;
    const yearsEl = document.getElementById('sim-val-years');
    if (yearsEl) yearsEl.textContent = `${years} ปี`;

    // Monthly compound calculation
    const r = (cagr / 100) / 12;
    const labels = [];
    const principalData = [];
    const totalData = [];

    let currentBalance = initCap;
    let currentPrincipal = initCap;

    labels.push('ปี 0');
    principalData.push(Math.round(currentPrincipal));
    totalData.push(Math.round(currentBalance));

    for (let y = 1; y <= years; y++) {
      for (let m = 1; m <= 12; m++) {
        currentBalance = (currentBalance + monthly) * (1 + r);
        currentPrincipal += monthly;
      }
      labels.push(`ปี ${y}`);
      principalData.push(Math.round(currentPrincipal));
      totalData.push(Math.round(currentBalance));
    }

    const finalTotalUSD = currentBalance;
    const finalPrincipalUSD = currentPrincipal;
    const finalInterestUSD = Math.max(0, currentBalance - currentPrincipal);

    // Update stat boxes & hero
    const heroMain = document.getElementById('sim-hero-future-val');
    if (heroMain) heroMain.textContent = this.formatUSD(finalTotalUSD);
    const heroSub = document.getElementById('sim-hero-future-thb');
    if (heroSub) heroSub.textContent = `≈ ${this.formatTHB(this.usdToThb(finalTotalUSD))} • พลังของดอกเบี้ยทบต้น (${years} ปี)`;

    const statP = document.getElementById('sim-stat-principal');
    if (statP) statP.textContent = this.formatUSD(finalPrincipalUSD);
    const statI = document.getElementById('sim-stat-interest');
    if (statI) statI.textContent = this.formatUSD(finalInterestUSD);
    const statT = document.getElementById('sim-stat-total');
    if (statT) statT.textContent = this.formatUSD(finalTotalUSD);

    // Draw Chart
    const ctx = document.getElementById('chart-compound-simulator')?.getContext('2d');
    if (!ctx) return;

    if (this.charts.compound) {
      this.charts.compound.destroy();
    }

    this.charts.compound = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'มูลค่ารวมสุทธิ (Total Net Worth)',
            data: totalData,
            borderColor: '#a855f7',
            backgroundColor: 'rgba(168, 85, 247, 0.15)',
            fill: true,
            tension: 0.3
          },
          {
            label: 'เงินต้นที่ออม (Total Principal)',
            data: principalData,
            borderColor: '#38bdf8',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            fill: true,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { color: '#94a3b8' } },
          tooltip: {
            callbacks: {
              label: (c) => ` ${c.dataset.label}: $${c.raw.toLocaleString()} (฿${Math.round(this.usdToThb(c.raw)).toLocaleString()})`
            }
          }
        },
        scales: {
          y: {
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { color: '#64748b', callback: v => '$' + v.toLocaleString() }
          },
          x: {
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { color: '#64748b' }
          }
        }
      }
    });
  }

  // --- SMART REBALANCE & DCA CALCULATOR MODAL ---
  openRebalanceModal() {
    const select = document.getElementById('rebalance-port-select');
    if (select) {
      select.innerHTML = this.portfolios.map(p => `
        <option value="${p.id}" ${p.id === this.selectedPortfolioId ? 'selected' : ''}>${p.emoji || '📁'} ${p.name} (Goal: $${(p.goalUSD || 0).toLocaleString()})</option>
      `).join('');
    }
    this.updateRebalanceDepositHint();
    this.calculateAndRenderSmartDCA();
    this.openModal('modal-rebalance-calculator');
  }

  updateRebalanceDepositHint() {
    const val = parseFloat(document.getElementById('rebalance-deposit-usd')?.value) || 0;
    const hint = document.getElementById('rebalance-deposit-thb-hint');
    if (hint) hint.textContent = `≈ ${this.formatTHB(this.usdToThb(val))}`;
  }

  calculateAndRenderSmartDCA() {
    const portId = document.getElementById('rebalance-port-select')?.value || this.selectedPortfolioId;
    const depositUSD = parseFloat(document.getElementById('rebalance-deposit-usd')?.value) || 0;
    const container = document.getElementById('rebalance-results-container');
    if (!container) return;

    const port = this.portfolios.find(p => p.id === portId);
    if (!port || !port.holdings || port.holdings.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px;">ไม่มีรายการหุ้นในพอร์ตนี้</div>`;
      return;
    }

    if (depositUSD <= 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px;">กรุณาระบุจำนวนเงินที่จะเติม</div>`;
      return;
    }

    // Smart Allocation Algorithm
    const holdingItems = port.holdings.map(h => {
      const stats = this.calculateHoldingStats(h);
      const targetUSD = h.targetTHB > 0 ? this.thbToUsd(h.targetTHB) : (port.goalUSD / port.holdings.length);
      const gapUSD = Math.max(0, targetUSD - stats.marketValueUSD);
      return {
        holding: h,
        stats,
        targetUSD,
        gapUSD
      };
    });

    const totalGap = holdingItems.reduce((sum, item) => sum + item.gapUSD, 0);

    const allocation = holdingItems.map(item => {
      let shareUSD = 0;
      if (totalGap > 0) {
        shareUSD = (item.gapUSD / totalGap) * depositUSD;
      } else {
        shareUSD = depositUSD / holdingItems.length;
      }
      const buyShares = item.stats.currentPrice > 0 ? (shareUSD / item.stats.currentPrice) : 0;
      return {
        ticker: item.holding.ticker,
        name: item.holding.name,
        currentPrice: item.stats.currentPrice,
        shareUSD,
        buyShares,
        targetUSD: item.targetUSD,
        currentVal: item.stats.marketValueUSD
      };
    });

    container.innerHTML = `
      <div style="font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 10px;">📋 แผนการแบ่งเงินซื้อ ($${depositUSD.toFixed(2)}):</div>
      ${allocation.map(a => `
        <div class="rebalance-plan-card">
          <div class="rebalance-plan-left">
            ${this.renderStockLogoHTML(a.ticker, port.color || '#10b981', 38)}
            <div>
              <div class="rebalance-plan-ticker">${a.ticker}</div>
              <div class="rebalance-plan-shares">ช้อนซื้อ: <strong class="text-emerald font-mono">+${a.buyShares.toFixed(6)} หุ้น</strong> (@ $${a.currentPrice.toFixed(2)})</div>
            </div>
          </div>
          <div class="rebalance-plan-amount">
            <div class="text-emerald font-mono" style="font-size: 15px;">+$${a.shareUSD.toFixed(2)}</div>
            <div style="font-size: 11px; color: var(--text-muted); font-mono">≈ ฿${this.usdToThb(a.shareUSD).toFixed(0)}</div>
          </div>
        </div>
      `).join('')}
    `;
  }

  // 6. OBSIDIAN VAULT & AI SECOND BRAIN 1-CLICK EXPORT VIEW
  renderObsidianExportView(container) {
    const mdContent = this.generateObsidianMarkdown();

    let html = `
      <div class="obsidian-export-container">
        <div class="obsidian-preview-header">
          <div>
            <h3 style="font-size: 18px; font-weight: 700; color: #fff;">🤖 ส่งออกเข้า Obsidian Vault & AI Second Brain</h3>
            <p style="font-size: 13px; color: var(--text-secondary);">
              ฟอร์แมต Markdown ตรงตามสเปกของ <code>Luna/02_INVESTMENT/financial_results/</code> พร้อม YAML Tags และ Wikilinks
            </p>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-primary" id="btn-copy-obsidian-md">
              <span>📋 Copy Markdown for AI</span>
            </button>
            <button class="btn btn-secondary" id="btn-download-obsidian-md">
              <span>📥 Download .md File</span>
            </button>
          </div>
        </div>

        <pre class="markdown-preview-box" id="obsidian-md-preview">${this.escapeHtml(mdContent)}</pre>
      </div>
    `;

    container.innerHTML = html;
  }

  generateObsidianMarkdown() {
    const currentYear = new Date().getFullYear();
    const currentQuarter = 'Q' + Math.ceil((new Date().getMonth() + 1) / 3);
    const isoDate = new Date().toISOString();
    const grand = this.calculateGrandTotalStats();

    let md = `---
type: [[Financial_Review]]
quarter: [[${currentQuarter}_${currentYear}]]
year: ${currentYear}
export_date: ${isoDate}
exchange_rate_thb_usd: ${this.exchangeRate.toFixed(2)}
tags:
  - #Agent_Access
  - #Financial_Report
  - #${currentQuarter}_${currentYear}
  - #Portfolio_Tracking
  - #Data_Vault
---

# 📊 [[${currentQuarter}_${currentYear}]] Financial Quarter Review

**Metadata Information**
* **Exported At:** ${isoDate}
* **Exchange Rate Reference:** ${this.exchangeRate.toFixed(2)} THB/USD
* **Total Net Worth (USD):** ${this.formatUSD(grand.grandTotalUSD)} (≈ ${this.formatTHB(grand.grandTotalTHB)})

---

## 💼 1. Portfolio Summary (สรุปสถานะพอร์ตการลงทุน)

| ID | Portfolio Name | Tier / Category | Goal (USD) | Current Value (USD) | Cash Buffer (USD) | Notes / Strategy | Assets Held (Value USD) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
`;

    this.portfolios.forEach((p, idx) => {
      const s = this.calculatePortfolioStats(p);
      const holdingsList = (p.holdings || [])
        .filter(h => (parseFloat(h.shares) || 0) > 0)
        .map(h => {
          const stats = this.calculateHoldingStats(h);
          return `[[Asset_${h.ticker}]]: $${stats.marketValueUSD.toFixed(2)}`;
        }).join('<br>') || 'None';

      md += `| ${idx + 1} | **[[${p.name}]]** | #${p.tier.replace(' ', '_')} #${p.category.replace(' ', '_')} | ${this.formatUSD(s.goalUSD)} | ${this.formatUSD(s.totalValueUSD)} | ${this.formatUSD(s.cashBufferUSD)} | ${p.notes || '-'} | ${holdingsList} |\n`;
    });

    // Trading rows
    for (const [key, item] of Object.entries(this.tradingData || {})) {
      const list = item.monthlyBalances || [];
      const latest = list.length > 0 ? list[list.length - 1].balanceUSD : 0;
      md += `| Trading | **[[${item.name}]]** | #Trading #Forex | - | ${this.formatUSD(latest)} | - | อัปเดตรายเดือน | [[Cash]]: ${this.formatUSD(latest)} |\n`;
    }

    md += `\n---\n\n## 📈 2. Quarterly Records (บันทึกผลงานเปรียบเทียบไตรมาสปี ${currentYear})\n\n`;
    md += `| Portfolio | Q1 Value ($) | Q2 Value ($) | Q3 Value ($) | Q4 Value ($) | Current ($) |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n`;

    const q1Map = this.quarterlySnapshots.find(q => q.quarter === 'Q1')?.portValuesUSD || {};
    const q2Map = this.quarterlySnapshots.find(q => q.quarter === 'Q2')?.portValuesUSD || {};
    const q3Map = this.quarterlySnapshots.find(q => q.quarter === 'Q3')?.portValuesUSD || {};
    const q4Map = this.quarterlySnapshots.find(q => q.quarter === 'Q4')?.portValuesUSD || {};

    this.portfolios.forEach(p => {
      const s = this.calculatePortfolioStats(p);
      md += `| **[[${p.name}]]** | ${q1Map[p.id] ? this.formatUSD(q1Map[p.id]) : '-'} | ${q2Map[p.id] ? this.formatUSD(q2Map[p.id]) : '-'} | ${q3Map[p.id] ? this.formatUSD(q3Map[p.id]) : '-'} | ${q4Map[p.id] ? this.formatUSD(q4Map[p.id]) : '-'} | ${this.formatUSD(s.totalValueUSD)} |\n`;
    });

    md += `\n---\n\n## 📅 3. Monthly Trading Records (บันทึกประวัติการเทรด)\n\n`;
    md += `| Period | Product / Strategy | Balance (USD) | Remarks |\n| :--- | :--- | :--- | :--- |\n`;

    for (const [key, item] of Object.entries(this.tradingData || {})) {
      (item.monthlyBalances || []).forEach(m => {
        md += `| **[[${m.year}-${String(m.month).padStart(2, '0')}]]** | [[${item.name}]] | ${this.formatUSD(m.balanceUSD)} | ${m.note || '-'} |\n`;
      });
    }

    return md;
  }

  escapeHtml(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // 7. SETTINGS & BACKUP VIEW
  renderSettingsView(container) {
    let html = `
      <div class="dime-hero-banner">
        <h2 style="font-size: 24px; font-weight: 800; color: #fff;">⚙️ การตั้งค่าระบบและฐานข้อมูล</h2>
        <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
          จัดการการเชื่อมต่อ Firebase Cloud Realtime Sync, สำรองข้อมูล, และตั้งค่าทั่วไป
        </p>
      </div>

      <div class="analytics-charts-grid">
        <div class="chart-card">
          <div class="chart-title">☁️ สถานะการซิงค์ Firebase Cloud</div>
          <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">
            Project ID: <code>pixel-steward-db</code><br>
            Database URL: <code>pixel-steward-db-default-rtdb.asia-southeast1.firebasedatabase.app</code>
          </p>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-primary" id="btn-force-cloud-push">📤 อัปโหลดข้อมูลขึ้น Cloud</button>
            <button class="btn btn-secondary" id="btn-force-cloud-pull">📥 ดึงข้อมูลล่าสุดจาก Cloud</button>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-title">💾 สำรองข้อมูลแบบไฟล์ (JSON Backup)</div>
          <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">
            ดาวน์โหลดไฟล์ JSON สำรองเก็บไว้ในเครื่อง หรือนำเข้าไฟล์ข้อมูล
          </p>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-secondary" id="btn-export-json">📥 ดาวน์โหลด Backup JSON</button>
            <label class="btn btn-secondary" style="cursor: pointer;">
              <span>📤 นำเข้า JSON</span>
              <input type="file" id="input-import-json" accept=".json" style="display: none;">
            </label>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  // --- EVENT LISTENERS & INTERACTION ---
  setupEventListeners() {
    // Navigation Tabs (Desktop & Mobile)
    document.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-tab');
        this.switchTab(tab);
      });
    });

    // Currency Switcher (USD / THB)
    document.getElementById('cur-mode-usd')?.addEventListener('click', () => {
      this.displayCurrency = 'USD';
      document.getElementById('cur-mode-usd').classList.add('active');
      document.getElementById('cur-mode-thb').classList.remove('active');
      this.renderActiveTab();
    });

    document.getElementById('cur-mode-thb')?.addEventListener('click', () => {
      this.displayCurrency = 'THB';
      document.getElementById('cur-mode-thb').classList.add('active');
      document.getElementById('cur-mode-usd').classList.remove('active');
      this.renderActiveTab();
    });

    // Privacy Mode Toggle Button
    document.getElementById('btn-toggle-privacy')?.addEventListener('click', () => this.togglePrivacyMode());

    // Smart Rebalance Modal & Calculator
    document.getElementById('btn-open-rebalance-modal')?.addEventListener('click', () => this.openRebalanceModal());
    document.getElementById('btn-calc-smart-dca')?.addEventListener('click', () => this.calculateAndRenderSmartDCA());
    document.getElementById('rebalance-deposit-usd')?.addEventListener('input', () => this.updateRebalanceDepositHint());
    document.getElementById('rebalance-port-select')?.addEventListener('change', () => this.calculateAndRenderSmartDCA());

    // Market Sync Buttons
    document.getElementById('btn-sync-market-top')?.addEventListener('click', () => this.syncLiveMarketPrices());
    document.getElementById('btn-sync-market-desktop')?.addEventListener('click', () => this.syncLiveMarketPrices());

    // FX Rate Container Click (Opens FX Modal)
    document.getElementById('fx-rate-container')?.addEventListener('click', () => {
      document.getElementById('input-fx-rate').value = this.exchangeRate.toFixed(2);
      this.openModal('modal-fx-settings');
    });

    // Top Quick Action Button (Opens Trade Modal)
    document.getElementById('btn-quick-action')?.addEventListener('click', () => {
      this.populateTradeStockSelect();
      this.openModal('modal-trade');
    });

    // Dynamic Delegate clicks inside View Container
    const container = document.getElementById('app-view-container');
    container?.addEventListener('click', (e) => {
      const target = e.target.closest('button, [data-open-port]');
      if (!target) return;

      // Open Subportfolio from card
      if (target.hasAttribute('data-open-port')) {
        this.selectedPortfolioId = target.getAttribute('data-open-port');
        this.switchTab('portfolios');
        return;
      }

      // Subportfolio Selector Button
      if (target.hasAttribute('data-select-port')) {
        this.selectedPortfolioId = target.getAttribute('data-select-port');
        this.renderActiveTab();
        return;
      }

      // Add New Subportfolio Modal
      if (target.id === 'btn-add-portfolio-modal') {
        this.openPortfolioEditModal(null);
        return;
      }

      // Add Stock Modal
      if (target.id === 'btn-add-holding-modal') {
        this.openHoldingModal(null, this.selectedPortfolioId);
        return;
      }

      // Edit Stock Modal
      if (target.hasAttribute('data-edit-holding')) {
        const holdingId = target.getAttribute('data-edit-holding');
        const portId = target.getAttribute('data-port-id');
        this.openHoldingModal(holdingId, portId);
        return;
      }

      // Quick Trade Modal for specific stock
      if (target.hasAttribute('data-trade-holding')) {
        const holdingId = target.getAttribute('data-trade-holding');
        const portId = target.getAttribute('data-port-id');
        this.openTradeModalForHolding(holdingId, portId);
        return;
      }

      // Manage Cash Buffer
      if (target.id === 'btn-manage-cash-buffer' || target.hasAttribute('data-port-id') && target.id === 'btn-manage-cash-buffer') {
        const portId = target.getAttribute('data-port-id') || this.selectedPortfolioId;
        this.openCashBufferModal(portId);
        return;
      }

      // Quick Buy with Cash Buffer
      if (target.id === 'btn-quick-buy-with-cash') {
        const portId = target.getAttribute('data-port-id') || this.selectedPortfolioId;
        this.populateTradeStockSelect(portId);
        this.openModal('modal-trade');
        return;
      }

      // Edit Current Subportfolio
      if (target.id === 'btn-edit-current-port') {
        this.openPortfolioEditModal(this.selectedPortfolioId);
        return;
      }

      // Add Trading Portfolio Modal
      if (target.id === 'btn-add-trading-port-modal') {
        this.openTradingPortEditModal(null);
        return;
      }

      // Edit Trading Portfolio Modal
      if (target.hasAttribute('data-edit-trading-port')) {
        const key = target.getAttribute('data-edit-trading-port');
        this.openTradingPortEditModal(key);
        return;
      }

      // Open Trading History Modal
      if (target.hasAttribute('data-log-trading-history')) {
        const key = target.getAttribute('data-log-trading-history');
        this.openTradingHistoryModal(key);
        return;
      }

      // Delete Trading History Month Entry
      if (target.hasAttribute('data-delete-trading-month')) {
        const idx = parseInt(target.getAttribute('data-delete-trading-month'));
        const key = target.getAttribute('data-trading-key');
        this.deleteTradingHistoryEntry(key, idx);
        return;
      }

      // Save Trading Monthly Balance
      if (target.hasAttribute('data-save-trading-key')) {
        const key = target.getAttribute('data-save-trading-key');
        const input = document.querySelector(`input[data-trading-key="${key}"]`);
        if (input && this.tradingData[key]) {
          const val = parseFloat(input.value) || 0;
          const currentMonth = new Date().getMonth() + 1;
          const currentYear = new Date().getFullYear();
          if (!this.tradingData[key].monthlyBalances) this.tradingData[key].monthlyBalances = [];
          const list = this.tradingData[key].monthlyBalances;
          const lastIdx = list.findIndex(m => m.year === currentYear && m.month === currentMonth);
          if (lastIdx >= 0) {
            list[lastIdx].balanceUSD = val;
          } else {
            list.push({ year: currentYear, month: currentMonth, balanceUSD: val, note: 'อัปเดตรายเดือน' });
          }
          this.saveData();
          this.renderActiveTab();
          alert(`💾 บันทึกยอดเงิน ${this.tradingData[key].name}: $${val.toFixed(2)} สำเร็จ!`);
        }
        return;
      }

      // Add Dividend Modal
      if (target.id === 'btn-add-dividend-modal') {
        this.openDividendModal();
        return;
      }

      // Delete Dividend
      if (target.hasAttribute('data-delete-dividend')) {
        const id = target.getAttribute('data-delete-dividend');
        if (confirm('ต้องการลบรายการปันผลนี้ใช่หรือไม่?')) {
          this.dividends = this.dividends.filter(d => d.id !== id);
          this.saveData();
        }
        return;
      }

      // Take Quarterly Snapshot
      if (target.id === 'btn-take-quarter-snapshot') {
        this.takeQuarterlySnapshot();
        return;
      }

      // Copy Obsidian Markdown
      if (target.id === 'btn-copy-obsidian-md') {
        const md = this.generateObsidianMarkdown();
        navigator.clipboard.writeText(md).then(() => {
          alert('📋 คัดลอก Markdown สำหรับ AI และ Obsidian สำเร็จแล้ว!');
        });
        return;
      }

      // Download Obsidian Markdown
      if (target.id === 'btn-download-obsidian-md') {
        const md = this.generateObsidianMarkdown();
        const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `Financial_Quarter_Review_${new Date().toISOString().slice(0, 10)}.md`;
        a.click();
        return;
      }

      // Force Cloud Push / Pull
      if (target.id === 'btn-force-cloud-push') {
        this.pushDataToCloud();
        alert('📤 ส่งข้อมูลขึ้น Firebase Cloud สำเร็จ!');
        return;
      }

      if (target.id === 'btn-force-cloud-pull') {
        if (this.dbRef) {
          this.dbRef.once('value').then(snap => {
            if (snap.val()) {
              this.handleCloudSync(snap.val());
              alert('📥 ดึงข้อมูลล่าสุดจาก Firebase สำเร็จ!');
            }
          });
        }
        return;
      }

      // JSON Backup Export
      if (target.id === 'btn-export-json') {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
          portfolios: this.portfolios,
          tradingData: this.tradingData,
          quarterlySnapshots: this.quarterlySnapshots,
          dividends: this.dividends,
          exchangeRate: this.exchangeRate
        }, null, 2));
        const a = document.createElement('a');
        a.href = dataStr;
        a.download = `pixel_steward_backup_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        return;
      }
    });

    // JSON Backup Import
    container?.addEventListener('change', (e) => {
      if (e.target.id === 'input-import-json') {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const imported = JSON.parse(event.target.result);
              if (imported.portfolios) {
                this.handleCloudSync(imported);
                alert('📥 นำเข้าข้อมูล JSON สำเร็จเรียบร้อย!');
              }
            } catch (err) {
              alert('❌ ไฟล์ JSON ไม่ถูกต้อง');
            }
          };
          reader.readAsText(file);
        }
      }
    });
  }

  switchTab(tabName) {
    this.currentTab = tabName;

    // Update Nav links
    document.querySelectorAll('.nav-link, .mobile-nav-item').forEach(btn => {
      if (btn.getAttribute('data-tab') === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update Header titles
    const titleMap = {
      dashboard: { title: 'แดชบอร์ดภาพรวม', sub: 'สรุปสินทรัพย์และผลการเติบโตตามเป้าหมาย (IPS)' },
      portfolios: { title: 'แยกพอร์ต (Dime Holdings)', sub: 'รายละเอียดหุ้น, ทศนิยม, ต้นทุนเฉลี่ย, และเงินไว้ช้อน' },
      trading: { title: 'Forex & Option Trading', sub: 'บันทึกยอดเงินทุนรายเดือนและกราฟการเติบโต' },
      dividends: { title: 'บันทึกเงินปันผลรับ (Dividend Log)', sub: 'กระแสเงินสดปันผลสะสมและคำนวณหักภาษี 15%' },
      simulator: { title: 'จำลองเงินล้าน & ดอกเบี้ยทบต้น', sub: 'คำนวณและคาดการณ์มูลค่าพอร์ตในอนาคต (The Power of Compounding)' },
      quarterly: { title: 'เปรียบเทียบผลงานรายไตรมาส', sub: 'ระบบบันทึก Snapshot และเปรียบเทียบการเติบโต Q-on-Q' },
      obsidian: { title: 'Obsidian & AI Second Brain', sub: 'ส่งออกรายงานการเงินเข้า Luna Vault อัตโนมัติ' },
      settings: { title: 'ตั้งค่าระบบ & ฐานข้อมูล', sub: 'จัดการ Firebase Realtime Sync และสำรองข้อมูล' }
    };

    const info = titleMap[tabName] || titleMap.dashboard;
    const titleEl = document.getElementById('current-page-title');
    const subEl = document.getElementById('current-page-subtitle');
    if (titleEl) titleEl.textContent = info.title;
    if (subEl) subEl.textContent = info.sub;

    this.renderActiveTab();
  }

  // --- MODAL CONTROLS & FORMS ---
  setupModals() {
    // Close modal buttons
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modalId = e.currentTarget.getAttribute('data-close');
        this.closeModal(modalId);
      });
    });

    // Close on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('open');
        }
      });
    });

    // Trade Type Selector Toggle
    document.querySelectorAll('.trade-type-selector .radio-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const parent = card.closest('.trade-type-selector');
        parent.querySelectorAll('.radio-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;

        if (card.getAttribute('data-type')) {
          this.updateTradeCalculations();
        }
      });
    });

    // Trade Calculation Live Updates
    ['trade-shares', 'trade-price'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => this.updateTradeCalculations());
    });

    document.getElementById('trade-stock-select')?.addEventListener('change', () => this.updateTradeCalculations());

    // Holding Form Submit
    document.getElementById('form-holding')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveHoldingForm();
    });

    // Trade Form Submit
    document.getElementById('form-trade')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.executeTrade();
    });

    // Cash Buffer Form Submit
    document.getElementById('form-cash-buffer')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveCashBufferForm();
    });

    // Cash Buffer Live THB Calculator
    document.getElementById('cash-amount-usd')?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) || 0;
      const thbEl = document.getElementById('cash-amount-thb');
      if (thbEl) thbEl.value = this.formatTHB(this.usdToThb(val));
    });

    // Dividend Form Calculations & Submit
    document.getElementById('dividend-gross-usd')?.addEventListener('input', (e) => {
      const gross = parseFloat(e.target.value) || 0;
      const tax = gross * 0.15;
      const net = gross - tax;
      const taxInput = document.getElementById('dividend-tax-usd');
      if (taxInput) taxInput.value = tax.toFixed(2);
      document.getElementById('dividend-net-usd').textContent = this.formatUSD(net);
      document.getElementById('dividend-net-thb').textContent = this.formatTHB(this.usdToThb(net));
    });

    document.getElementById('dividend-tax-usd')?.addEventListener('input', () => {
      const gross = parseFloat(document.getElementById('dividend-gross-usd').value) || 0;
      const tax = parseFloat(document.getElementById('dividend-tax-usd').value) || 0;
      const net = gross - tax;
      document.getElementById('dividend-net-usd').textContent = this.formatUSD(net);
      document.getElementById('dividend-net-thb').textContent = this.formatTHB(this.usdToThb(net));
    });

    // Holding Form Submit & Live Ticker Lookup
    document.getElementById('holding-ticker')?.addEventListener('input', (e) => {
      const sym = e.target.value.trim().toUpperCase();
      this.updateHoldingTickerPreview(sym);
    });

    document.getElementById('form-holding')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveHoldingForm();
    });

    // Trade Form Submit
    document.getElementById('form-trade')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.executeTrade();
    });

    // Cash Buffer Form Submit
    document.getElementById('form-cash-buffer')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveCashBufferForm();
    });

    // Cash Buffer Live THB Calculator
    document.getElementById('cash-amount-usd')?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) || 0;
      const thbEl = document.getElementById('cash-amount-thb');
      if (thbEl) thbEl.value = this.formatTHB(this.usdToThb(val));
    });

    // Dividend Form Calculations & Submit
    document.getElementById('dividend-gross-usd')?.addEventListener('input', (e) => {
      const gross = parseFloat(e.target.value) || 0;
      const tax = gross * 0.15;
      const net = gross - tax;
      const taxInput = document.getElementById('dividend-tax-usd');
      if (taxInput) taxInput.value = tax.toFixed(2);
      document.getElementById('dividend-net-usd').textContent = this.formatUSD(net);
      document.getElementById('dividend-net-thb').textContent = this.formatTHB(this.usdToThb(net));
    });

    document.getElementById('dividend-tax-usd')?.addEventListener('input', () => {
      const gross = parseFloat(document.getElementById('dividend-gross-usd').value) || 0;
      const tax = parseFloat(document.getElementById('dividend-tax-usd').value) || 0;
      const net = gross - tax;
      document.getElementById('dividend-net-usd').textContent = this.formatUSD(net);
      document.getElementById('dividend-net-thb').textContent = this.formatTHB(this.usdToThb(net));
    });

    document.getElementById('form-dividend')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveDividendForm();
    });

    // FX Rate Form Submit
    document.getElementById('form-fx-settings')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const newRate = parseFloat(document.getElementById('input-fx-rate').value);
      if (newRate > 0) {
        this.exchangeRate = newRate;
        this.updateSidebarFxRate();
        this.saveData();
        this.closeModal('modal-fx-settings');
        alert(`💾 ตั้งค่าอัตราแลกเปลี่ยนเป็น ฿${newRate.toFixed(2)} เรียบร้อยแล้ว!`);
      }
    });

    document.getElementById('btn-fetch-live-fx')?.addEventListener('click', async () => {
      await this.fetchLiveExchangeRate();
      document.getElementById('input-fx-rate').value = this.exchangeRate.toFixed(2);
    });

    // Sub-Portfolio Edit Form Submit
    document.getElementById('form-portfolio-edit')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.savePortfolioEditForm();
    });

    document.getElementById('edit-port-goal-usd')?.addEventListener('input', (e) => {
      const usd = parseFloat(e.target.value) || 0;
      document.getElementById('edit-port-goal-thb').value = this.formatTHB(this.usdToThb(usd));
    });

    // Trading Port Edit Form Submit
    document.getElementById('form-trading-port-edit')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveTradingPortEditForm();
    });

    // Trading Month Add Form Submit
    document.getElementById('form-add-trading-month')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveTradingMonthForm();
    });
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('open');
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('open');
  }

  // --- HOLDING ADD / EDIT ---
  openHoldingModal(holdingId, portfolioId) {
    const portSelect = document.getElementById('holding-portfolio-id');
    if (portSelect) {
      portSelect.innerHTML = this.portfolios.map(p => `
        <option value="${p.id}" ${p.id === portfolioId ? 'selected' : ''}>${p.emoji || ''} ${p.name}</option>
      `).join('');
    }

    const deleteBtn = document.getElementById('btn-delete-holding');

    if (holdingId) {
      const port = this.portfolios.find(p => p.id === portfolioId);
      const h = port?.holdings?.find(x => x.id === holdingId);
      if (h) {
        document.getElementById('modal-holding-title').textContent = '✏️ แก้ไขสินทรัพย์หุ้น';
        document.getElementById('holding-id').value = h.id;
        document.getElementById('holding-ticker').value = h.ticker;
        document.getElementById('holding-name').value = h.name || '';
        document.getElementById('holding-name').removeAttribute('data-autofilled');
        document.getElementById('holding-shares').value = h.shares;
        document.getElementById('holding-avg-cost').value = h.avgCostUSD;
        document.getElementById('holding-current-price').value = h.currentPriceUSD || '';
        document.getElementById('holding-1d-change').value = h.change1dPct || '';
        document.getElementById('holding-dip-target').value = h.dipTargetUSD || '';
        
        this.updateHoldingTickerPreview(h.ticker);

        if (deleteBtn) {
          deleteBtn.classList.remove('hidden');
          deleteBtn.onclick = (e) => {
            e.preventDefault();
            if (confirm(`ต้องการลบ ${h.ticker} ออกจากพอร์ตใช่หรือไม่?`)) {
              const targetPort = this.portfolios.find(p => p.id === portfolioId);
              if (targetPort && targetPort.holdings) {
                targetPort.holdings = targetPort.holdings.filter(x => x.id !== h.id);
                this.saveData();
                this.closeModal('modal-holding');
                this.renderActiveTab();
              }
            }
          };
        }
      }
    } else {
      document.getElementById('modal-holding-title').textContent = '➕ เพิ่มสินทรัพย์หุ้นใหม่';
      document.getElementById('form-holding').reset();
      document.getElementById('holding-id').value = '';
      document.getElementById('holding-dip-target').value = '';
      document.getElementById('holding-name').removeAttribute('data-autofilled');
      if (portSelect) portSelect.value = portfolioId || this.selectedPortfolioId;
      this.updateHoldingTickerPreview('');
      deleteBtn?.classList.add('hidden');
    }

    this.openModal('modal-holding');
  }

  saveHoldingForm() {
    const portId = document.getElementById('holding-portfolio-id').value;
    const holdingId = document.getElementById('holding-id').value;
    const ticker = document.getElementById('holding-ticker').value.trim().toUpperCase();
    const name = document.getElementById('holding-name').value.trim();
    const shares = parseFloat(document.getElementById('holding-shares').value) || 0;
    const avgCostUSD = parseFloat(document.getElementById('holding-avg-cost').value) || 0;
    const currentPriceUSD = parseFloat(document.getElementById('holding-current-price').value) || avgCostUSD;
    const change1dPct = parseFloat(document.getElementById('holding-1d-change').value) || 0;
    const dipTargetUSD = parseFloat(document.getElementById('holding-dip-target').value) || null;

    const port = this.portfolios.find(p => p.id === portId);
    if (!port) return;

    if (!port.holdings) port.holdings = [];

    if (holdingId) {
      const idx = port.holdings.findIndex(h => h.id === holdingId);
      if (idx >= 0) {
        port.holdings[idx] = { ...port.holdings[idx], ticker, name, shares, avgCostUSD, currentPriceUSD, change1dPct, dipTargetUSD };
      }
    } else {
      const newHolding = {
        id: 'h-' + Date.now(),
        ticker,
        name: name || ticker,
        shares,
        avgCostUSD,
        currentPriceUSD,
        change1dPct,
        dipTargetUSD
      };
      port.holdings.push(newHolding);
    }

    this.saveData();
    this.closeModal('modal-holding');
  }

  // --- TRADE MODAL & DCA ENGINE ---
  populateTradeStockSelect(preselectedPortId = null, preselectedHoldingId = null) {
    const select = document.getElementById('trade-stock-select');
    if (!select) return;

    let html = '';
    this.portfolios.forEach(p => {
      html += `<optgroup label="${p.emoji || ''} ${p.name}">`;
      (p.holdings || []).forEach(h => {
        const isSelected = (p.id === preselectedPortId && h.id === preselectedHoldingId);
        html += `<option value="${p.id}:::${h.id}" ${isSelected ? 'selected' : ''}>${h.ticker} (${h.name || h.ticker})</option>`;
      });
      html += `</optgroup>`;
    });

    select.innerHTML = html;
    this.updateTradeCalculations();
  }

  openTradeModalForHolding(holdingId, portId) {
    this.populateTradeStockSelect(portId, holdingId);
    const port = this.portfolios.find(p => p.id === portId);
    const h = port?.holdings?.find(x => x.id === holdingId);
    if (h) {
      document.getElementById('trade-price').value = (h.currentPriceUSD || h.avgCostUSD || 100).toFixed(2);
      document.getElementById('trade-shares').value = '';
    }
    this.openModal('modal-trade');
  }

  updateTradeCalculations() {
    const selectVal = document.getElementById('trade-stock-select')?.value;
    if (!selectVal) return;

    const [portId, holdingId] = selectVal.split(':::');
    const port = this.portfolios.find(p => p.id === portId);
    const h = port?.holdings?.find(x => x.id === holdingId);
    if (!port || !h) return;

    const type = document.querySelector('input[name="trade-type"]:checked')?.value || 'BUY';
    const sharesInput = parseFloat(document.getElementById('trade-shares')?.value) || 0;
    const priceInput = parseFloat(document.getElementById('trade-price')?.value) || (h.currentPriceUSD || h.avgCostUSD || 0);

    const summaryEl = document.getElementById('trade-holding-summary');
    if (summaryEl) {
      summaryEl.innerHTML = `
        <div style="font-size: 13px; color: #fff;"><strong>${port.name} ➔ ${h.ticker}</strong></div>
        <div style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">
          หุ้นปัจจุบัน: <strong class="font-mono">${h.shares.toFixed(6)}</strong> | ต้นทุนเดิม: <strong class="font-mono">$${h.avgCostUSD.toFixed(4)}</strong> | ราคาตลาด: <strong class="font-mono text-emerald">$${(h.currentPriceUSD || h.avgCostUSD).toFixed(2)}</strong>
        </div>
      `;
    }

    const totalUSD = sharesInput * priceInput;
    const totalTHB = this.usdToThb(totalUSD);

    document.getElementById('trade-total-usd').textContent = this.formatUSD(totalUSD);
    document.getElementById('trade-total-thb').textContent = this.formatTHB(totalTHB);

    const btnSubmit = document.getElementById('btn-submit-trade');
    const avgLabel = document.getElementById('trade-avg-label');
    const avgVal = document.getElementById('trade-new-avg');

    if (type === 'BUY') {
      btnSubmit.textContent = `🟢 ยืนยันซื้อ ${h.ticker} ($${totalUSD.toFixed(2)})`;
      btnSubmit.className = 'btn btn-primary btn-glow';
      avgLabel.textContent = 'ต้นทุนเฉลี่ยใหม่หลังซื้อ (Weighted Avg Cost):';

      const oldTotalCost = (h.shares || 0) * (h.avgCostUSD || 0);
      const newTotalShares = (h.shares || 0) + sharesInput;
      const newAvgCost = newTotalShares > 0 ? (oldTotalCost + totalUSD) / newTotalShares : 0;
      avgVal.textContent = `$${newAvgCost.toFixed(4)}`;
      avgVal.className = 'font-mono text-emerald';
    } else {
      btnSubmit.textContent = `🔴 ยืนยันขาย ${h.ticker} ($${totalUSD.toFixed(2)})`;
      btnSubmit.className = 'btn btn-danger';
      avgLabel.textContent = 'กำไร/ขาดทุนรับรู้ (Realized P/L):';

      const costOfSoldShares = sharesInput * (h.avgCostUSD || 0);
      const realizedPL = totalUSD - costOfSoldShares;
      const realizedPct = costOfSoldShares > 0 ? (realizedPL / costOfSoldShares) * 100 : 0;
      avgVal.textContent = `${this.formatUSD(realizedPL)} (${this.formatPercent(realizedPct)})`;
      avgVal.className = `font-mono ${realizedPL >= 0 ? 'text-emerald' : 'text-rose'}`;
    }

    // Cash buffer helper text
    const cashBufEl = document.getElementById('trade-available-cash');
    if (cashBufEl) {
      cashBufEl.textContent = `เงินไว้ช้อนคงเหลือใน ${port.name.split(' ')[0]}: ${this.formatUSD(port.cashBufferUSD || 0)} (${this.formatTHB(this.usdToThb(port.cashBufferUSD || 0))})`;
    }
  }

  executeTrade() {
    const selectVal = document.getElementById('trade-stock-select').value;
    const [portId, holdingId] = selectVal.split(':::');
    const port = this.portfolios.find(p => p.id === portId);
    const h = port?.holdings?.find(x => x.id === holdingId);
    if (!port || !h) return;

    const type = document.querySelector('input[name="trade-type"]:checked').value;
    const tradeShares = parseFloat(document.getElementById('trade-shares').value) || 0;
    const tradePrice = parseFloat(document.getElementById('trade-price').value) || 0;
    const useCashBuffer = document.getElementById('trade-use-cash-buffer').checked;

    if (tradeShares <= 0 || tradePrice <= 0) {
      alert('กรุณากรอกจำนวนหุ้นและราคาให้ถูกต้อง');
      return;
    }

    const tradeTotalUSD = tradeShares * tradePrice;

    if (type === 'BUY') {
      // Check cash buffer
      if (useCashBuffer) {
        if ((port.cashBufferUSD || 0) < tradeTotalUSD) {
          if (!confirm(`เงินสดไว้ช้อนมี $${(port.cashBufferUSD || 0).toFixed(2)} แต่มูลค่าซื้อคือ $${tradeTotalUSD.toFixed(2)} ต้องการตัดจนหมดและติดลบหรือไม่?`)) {
            return;
          }
        }
        port.cashBufferUSD = Math.max(0, (port.cashBufferUSD || 0) - tradeTotalUSD);
      }

      // Calculate new weighted avg cost
      const oldTotalCost = (h.shares || 0) * (h.avgCostUSD || 0);
      const newTotalShares = (h.shares || 0) + tradeShares;
      const newAvgCost = newTotalShares > 0 ? (oldTotalCost + tradeTotalUSD) / newTotalShares : tradePrice;

      h.shares = newTotalShares;
      h.avgCostUSD = newAvgCost;
      h.currentPriceUSD = tradePrice; // update latest price

      alert(`🟢 ซื้อ ${h.ticker} จำนวน ${tradeShares} หุ้น สำเร็จ! (ต้นทุนเฉลี่ยใหม่: $${newAvgCost.toFixed(4)})`);
    } else {
      // SELL
      if ((h.shares || 0) < tradeShares) {
        alert(`มีหุ้นไม่พอขาย! (มี ${h.shares} หุ้น แต่ต้องการขาย ${tradeShares} หุ้น)`);
        return;
      }

      h.shares = Math.max(0, (h.shares || 0) - tradeShares);
      if (useCashBuffer) {
        port.cashBufferUSD = (port.cashBufferUSD || 0) + tradeTotalUSD;
      }

      alert(`🔴 ขาย ${h.ticker} จำนวน ${tradeShares} หุ้น สำเร็จ! ได้เงิน $${tradeTotalUSD.toFixed(2)}`);
    }

    this.saveData();
    this.closeModal('modal-trade');
  }

  // --- CASH BUFFER MODAL & LOGIC ---
  openCashBufferModal(portId) {
    const port = this.portfolios.find(p => p.id === portId);
    if (!port) return;

    document.getElementById('cash-buffer-port-id').value = port.id;
    document.getElementById('cash-buffer-port-name').textContent = `พอร์ต: ${port.emoji || ''} ${port.name}`;
    document.getElementById('cash-current-usd').textContent = this.formatUSD(port.cashBufferUSD || 0);
    document.getElementById('cash-current-thb').textContent = this.formatTHB(this.usdToThb(port.cashBufferUSD || 0));
    document.getElementById('cash-amount-usd').value = '';
    document.getElementById('cash-amount-thb').value = '';
    document.getElementById('cash-note').value = '';

    this.openModal('modal-cash-buffer');
  }

  saveCashBufferForm() {
    const portId = document.getElementById('cash-buffer-port-id').value;
    const port = this.portfolios.find(p => p.id === portId);
    if (!port) return;

    const action = document.querySelector('input[name="cash-action"]:checked').value;
    const amount = parseFloat(document.getElementById('cash-amount-usd').value) || 0;

    if (amount <= 0 && action !== 'SET') {
      alert('กรุณาระบุจำนวนเงิน');
      return;
    }

    if (action === 'DEPOSIT') {
      port.cashBufferUSD = (port.cashBufferUSD || 0) + amount;
    } else if (action === 'WITHDRAW') {
      port.cashBufferUSD = Math.max(0, (port.cashBufferUSD || 0) - amount);
    } else if (action === 'SET') {
      port.cashBufferUSD = amount;
    }

    this.saveData();
    this.closeModal('modal-cash-buffer');
    alert(`💾 อัปเดตเงินไว้ช้อนของ ${port.name}: $${(port.cashBufferUSD || 0).toFixed(2)} สำเร็จ!`);
  }

  // --- DIVIDEND MODAL & LOGIC ---
  openDividendModal() {
    const portSelect = document.getElementById('dividend-portfolio-id');
    if (portSelect) {
      portSelect.innerHTML = this.portfolios.map(p => `
        <option value="${p.id}">${p.emoji || ''} ${p.name}</option>
      `).join('');
    }

    document.getElementById('form-dividend').reset();
    document.getElementById('dividend-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('dividend-net-usd').textContent = '$0.00';
    document.getElementById('dividend-net-thb').textContent = '฿0.00';

    this.openModal('modal-dividend');
  }

  saveDividendForm() {
    const date = document.getElementById('dividend-date').value;
    const ticker = document.getElementById('dividend-ticker').value.trim().toUpperCase();
    const portfolioId = document.getElementById('dividend-portfolio-id').value;
    const grossUSD = parseFloat(document.getElementById('dividend-gross-usd').value) || 0;
    const taxUSD = parseFloat(document.getElementById('dividend-tax-usd').value) || 0;
    const netUSD = grossUSD - taxUSD;
    const notes = document.getElementById('dividend-notes').value.trim();
    const addToCash = document.getElementById('dividend-add-to-cash-buffer').checked;

    const newDiv = {
      id: 'div-' + Date.now(),
      date,
      ticker,
      portfolioId,
      grossUSD,
      taxUSD,
      netUSD,
      notes
    };

    this.dividends.unshift(newDiv);

    if (addToCash) {
      const port = this.portfolios.find(p => p.id === portfolioId);
      if (port) {
        port.cashBufferUSD = (port.cashBufferUSD || 0) + netUSD;
      }
    }

    this.saveData();
    this.closeModal('modal-dividend');
    alert(`💰 บันทึกเงินปันผล ${ticker}: Net $${netUSD.toFixed(2)} เรียบร้อยแล้ว!`);
  }

  // --- SUBPORTFOLIO EDIT / CREATE MODAL ---
  openPortfolioEditModal(portId) {
    const deletePortBtn = document.getElementById('btn-delete-portfolio');

    if (portId) {
      const port = this.portfolios.find(p => p.id === portId);
      if (!port) return;

      document.getElementById('modal-portfolio-title').textContent = '📁 แก้ไขข้อมูลพอร์ตการลงทุน';
      document.getElementById('edit-port-id').value = port.id;
      document.getElementById('edit-port-name').value = port.name;
      document.getElementById('edit-port-emoji').value = port.emoji || '📁';
      document.getElementById('edit-port-tier').value = port.tier || 'Tier 1';
      document.getElementById('edit-port-color').value = port.color || '#10b981';
      document.getElementById('edit-port-goal-usd').value = port.goalUSD || 0;
      document.getElementById('edit-port-goal-thb').value = this.formatTHB(this.usdToThb(port.goalUSD || 0));
      document.getElementById('edit-port-notes').value = port.notes || '';

      if (deletePortBtn) {
        deletePortBtn.classList.remove('hidden');
        deletePortBtn.onclick = (e) => {
          e.preventDefault();
          if (confirm(`⚠️ คุณแน่ใจหรือไม่ว่าต้องการลบพอร์ต "${port.name}" และสินทรัพย์ทั้งหมดในพอร์ตนี้?\n(การกระทำนี้ไม่สามารถย้อนกลับได้)`)) {
            this.portfolios = this.portfolios.filter(p => p.id !== port.id);
            if (this.selectedPortfolioId === port.id) {
              this.selectedPortfolioId = this.portfolios[0]?.id || 'zero1';
            }
            this.saveData();
            this.closeModal('modal-portfolio-edit');
            this.renderActiveTab();
            alert(`🗑️ ลบพอร์ต ${port.name} เรียบร้อยแล้ว`);
          }
        };
      }
    } else {
      document.getElementById('modal-portfolio-title').textContent = '➕ เพิ่มพอร์ตการลงทุนใหม่';
      document.getElementById('form-portfolio-edit').reset();
      document.getElementById('edit-port-id').value = '';
      document.getElementById('edit-port-color').value = '#10b981';
      document.getElementById('edit-port-goal-thb').value = '฿0.00';
      if (deletePortBtn) deletePortBtn.classList.add('hidden');
    }

    this.openModal('modal-portfolio-edit');
  }

  savePortfolioEditForm() {
    const portId = document.getElementById('edit-port-id').value;
    const name = document.getElementById('edit-port-name').value.trim();
    const emoji = document.getElementById('edit-port-emoji').value.trim() || '📁';
    const tier = document.getElementById('edit-port-tier').value;
    const color = document.getElementById('edit-port-color').value;
    const goalUSD = parseFloat(document.getElementById('edit-port-goal-usd').value) || 0;
    const notes = document.getElementById('edit-port-notes').value.trim();

    if (portId) {
      const port = this.portfolios.find(p => p.id === portId);
      if (port) {
        port.name = name;
        port.emoji = emoji;
        port.tier = tier;
        port.color = color;
        port.goalUSD = goalUSD;
        port.notes = notes;
      }
    } else {
      const newPort = {
        id: 'port-' + Date.now(),
        name,
        emoji,
        tier,
        category: 'Custom',
        color,
        goalUSD,
        cashBufferUSD: 0.00,
        notes,
        holdings: []
      };
      this.portfolios.push(newPort);
      this.selectedPortfolioId = newPort.id;
    }

    this.saveData();
    this.closeModal('modal-portfolio-edit');
    alert(`💾 บันทึกข้อมูลพอร์ต ${name} เรียบร้อย!`);
  }

  // --- TRADING PORTFOLIO CRUD & HISTORY METHODS ---
  openTradingPortEditModal(key) {
    const deleteBtn = document.getElementById('btn-delete-trading-port');
    if (key && this.tradingData[key]) {
      const item = this.tradingData[key];
      const list = item.monthlyBalances || [];
      const latestUSD = list.length > 0 ? list[list.length - 1].balanceUSD : 0;

      document.getElementById('modal-trading-port-title').textContent = '⚙️ แก้ไขข้อมูลพอร์ตเทรด';
      document.getElementById('edit-trading-key').value = key;
      document.getElementById('edit-trading-name').value = item.name;
      document.getElementById('edit-trading-color').value = item.color || '#38bdf8';
      document.getElementById('edit-trading-balance').value = latestUSD;

      if (deleteBtn) {
        deleteBtn.classList.remove('hidden');
        deleteBtn.onclick = (e) => {
          e.preventDefault();
          if (confirm(`⚠️ คุณแน่ใจหรือไม่ว่าต้องการลบพอร์ตเทรด "${item.name}" และประวัติทั้งหมด?\n(การกระทำนี้ไม่สามารถย้อนกลับได้)`)) {
            delete this.tradingData[key];
            this.saveData();
            this.closeModal('modal-trading-port-edit');
            this.renderActiveTab();
            alert(`🗑️ ลบพอร์ตเทรด ${item.name} เรียบร้อยแล้ว`);
          }
        };
      }
    } else {
      document.getElementById('modal-trading-port-title').textContent = '➕ เพิ่มพอร์ตเทรดใหม่';
      document.getElementById('form-trading-port-edit').reset();
      document.getElementById('edit-trading-key').value = '';
      document.getElementById('edit-trading-color').value = '#38bdf8';
      document.getElementById('edit-trading-balance').value = '0';
      if (deleteBtn) deleteBtn.classList.add('hidden');
    }

    this.openModal('modal-trading-port-edit');
  }

  saveTradingPortEditForm() {
    const key = document.getElementById('edit-trading-key').value;
    const name = document.getElementById('edit-trading-name').value.trim();
    const color = document.getElementById('edit-trading-color').value;
    const balanceUSD = parseFloat(document.getElementById('edit-trading-balance').value) || 0;

    if (!this.tradingData) this.tradingData = {};

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    if (key && this.tradingData[key]) {
      this.tradingData[key].name = name;
      this.tradingData[key].color = color;
      
      const list = this.tradingData[key].monthlyBalances || [];
      const lastIdx = list.findIndex(m => m.year === currentYear && m.month === currentMonth);
      if (lastIdx >= 0) {
        list[lastIdx].balanceUSD = balanceUSD;
      } else {
        list.push({ year: currentYear, month: currentMonth, balanceUSD, note: 'อัปเดตรายเดือน' });
      }
    } else {
      const newKey = 'trade_' + Date.now();
      this.tradingData[newKey] = {
        name,
        color,
        monthlyBalances: [
          { year: currentYear, month: currentMonth, balanceUSD, note: 'เปิดพอร์ต' }
        ]
      };
    }

    this.saveData();
    this.closeModal('modal-trading-port-edit');
    this.renderActiveTab();
    alert(`💾 บันทึกพอร์ตเทรด "${name}" สำเร็จ!`);
  }

  openTradingHistoryModal(key) {
    if (!key || !this.tradingData[key]) return;
    const item = this.tradingData[key];

    document.getElementById('modal-trading-history-title').textContent = `📅 ประวัติรายเดือน: ${item.name}`;
    document.getElementById('history-trading-key').value = key;
    document.getElementById('hist-year').value = new Date().getFullYear();
    document.getElementById('hist-month').value = new Date().getMonth() + 1;
    document.getElementById('hist-balance').value = '';
    document.getElementById('hist-note').value = '';

    this.renderTradingHistoryList(key);
    this.openModal('modal-trading-history');
  }

  renderTradingHistoryList(key) {
    const listEl = document.getElementById('trading-history-list');
    if (!listEl || !this.tradingData[key]) return;

    const balances = this.tradingData[key].monthlyBalances || [];
    if (balances.length === 0) {
      listEl.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 12px;">ยังไม่มีประวัติรายเดือน</div>`;
      return;
    }

    const sorted = [...balances].reverse();

    listEl.innerHTML = sorted.map((m) => {
      const origIdx = balances.indexOf(m);
      return `
        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.3); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.05);">
          <div>
            <div class="font-mono" style="font-weight: 700; color: #fff; font-size: 14px;">${m.year}-${String(m.month).padStart(2, '0')}: <span class="text-amber">$${(m.balanceUSD || 0).toFixed(2)}</span></div>
            <div style="font-size: 11px; color: var(--text-muted);">${m.note || 'ไม่มีโน้ต'}</div>
          </div>
          <button class="btn-icon-xs text-rose" data-delete-trading-month="${origIdx}" data-trading-key="${key}" title="ลบรายการนี้">🗑️</button>
        </div>
      `;
    }).join('');
  }

  saveTradingMonthForm() {
    const key = document.getElementById('history-trading-key').value;
    if (!key || !this.tradingData[key]) return;

    const year = parseInt(document.getElementById('hist-year').value) || new Date().getFullYear();
    const month = parseInt(document.getElementById('hist-month').value) || 1;
    const balanceUSD = parseFloat(document.getElementById('hist-balance').value) || 0;
    const note = document.getElementById('hist-note').value.trim();

    if (!this.tradingData[key].monthlyBalances) {
      this.tradingData[key].monthlyBalances = [];
    }

    const list = this.tradingData[key].monthlyBalances;
    const existIdx = list.findIndex(m => m.year === year && m.month === month);
    if (existIdx >= 0) {
      list[existIdx] = { year, month, balanceUSD, note };
    } else {
      list.push({ year, month, balanceUSD, note });
      list.sort((a, b) => (a.year * 100 + a.month) - (b.year * 100 + b.month));
    }

    this.saveData();
    this.renderTradingHistoryList(key);
    this.renderActiveTab();
    alert(`💾 บันทึกยอดเงินเดือน ${year}-${String(month).padStart(2, '0')} เรียบร้อย!`);
  }

  deleteTradingHistoryEntry(key, index) {
    if (!key || !this.tradingData[key]) return;
    if (confirm('ต้องการลบประวัติของเดือนนี้ใช่หรือไม่?')) {
      const list = this.tradingData[key].monthlyBalances || [];
      if (index >= 0 && index < list.length) {
        list.splice(index, 1);
        this.saveData();
        this.renderTradingHistoryList(key);
        this.renderActiveTab();
      }
    }
  }

  // --- PWA REGISTRATION ---
  registerPWA() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js?v=2.1.1')
          .then(reg => {
            console.log('PWA Service Worker registered:', reg.scope);
            reg.update();
          })
          .catch(err => console.log('Service Worker registration failed:', err));
      });
    }
  }
}

// --- INSTANTIATE APP ON DOM LOADED ---
document.addEventListener('DOMContentLoaded', () => {
  window.pixelApp = new PixelStewardApp();
});