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

// Default Quarterly Snapshots (Auto-recorded at Q1: 31 Mar, Q2: 30 Jun, Q3: 30 Sep, Q4: 31 Dec)
const INITIAL_QUARTERLY_DATA = [];

// Default Dividend Records (From Backup)
const INITIAL_DIVIDENDS = [
  { id: 'div-1', date: '2026-08-18', ticker: 'PG', portfolioId: 'us_dividend', grossUSD: 0.02, taxUSD: 0.00, netUSD: 0.02, notes: 'ปันผล PG' }
];

// Default Achievements & Financial Goals
const DEFAULT_ACHIEVEMENTS = [
  { id: 'ach_1', emoji: '🛡️', name: 'Emergency Shield', desc: 'มีเงินสำรองฉุกเฉิน (Zero 1) ครบ 100%', completed: false, createdAt: '2026-08-01' },
  { id: 'ach_2', emoji: '💧', name: 'Cash Buffer Master', desc: 'มีเงินสดไว้ช้อนรวมกันมากกว่า $50', completed: false, createdAt: '2026-08-01' },
  { id: 'ach_3', emoji: '💰', name: 'Dividend Pioneer', desc: 'ได้รับเงินปันผลสะสมเข้าพอร์ตแล้ว', completed: true, createdAt: '2026-08-01' },
  { id: 'ach_4', emoji: '📈', name: 'Cashflow Disciplined', desc: 'บันทึกยอดเงินเทรด Forex/Option ครบถ้วน', completed: false, createdAt: '2026-08-01' },
  { id: 'ach_5', emoji: '🌐', name: 'World Class Diversified', desc: 'มีสินทรัพย์ในพอร์ตมากกว่า 5 รายการ', completed: true, createdAt: '2026-08-01' },
  { id: 'ach_6', emoji: '👑', name: 'Freedom Seeker', desc: 'มูลค่าสินทรัพย์รวมแตะระดับ $1,000', completed: false, createdAt: '2026-08-01' }
];

// --- 3. MAIN APPLICATION CLASS ---
class PixelStewardApp {
  constructor() {
    this.portfolios = [];
    this.tradingData = {};
    this.quarterlySnapshots = [];
    this.dividends = [];
    this.achievements = [];
    this.achievementFilter = 'in_progress'; // 'in_progress', 'completed', 'all'
    this.exchangeRate = 32.59;
    this.displayCurrency = 'USD'; // 'USD' or 'THB'
    this.currentTab = 'dashboard';
    this.selectedPortfolioId = 'zero1';
    this.selectedQuarterYear = new Date().getFullYear();
    this.isPrivacyMode = false;
    this.isSidebarCollapsed = false;
    this.allocationViewMode = 'donut'; // 'donut' or 'treemap'
    
    // Firebase & Sync State
    this.dbRef = null;
    this.isFirebaseOnline = false;
    this.charts = {};

    this.init();
  }

  async init() {
    this.initFirebase();
    this.loadLocalData();
    this.checkAndAutoRecordQuarterlySnapshots();
    this.loadPrivacyPreference();
    this.loadSidebarPreference();
    this.setupEventListeners();
    this.setupModals();
    this.renderActiveTab();
    this.fetchLiveExchangeRate();
    this.registerPWA();
  }

  // --- COLLAPSIBLE & SLIDE-OUT SIDEBAR ---
  loadSidebarPreference() {
    this.isSidebarCollapsed = localStorage.getItem('pixel_sidebar_collapsed') === '1';
    this.applySidebarState();
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    localStorage.setItem('pixel_sidebar_collapsed', this.isSidebarCollapsed ? '1' : '0');
    this.applySidebarState();
  }

  applySidebarState() {
    const icon1 = document.getElementById('sidebar-toggle-icon');
    const icon2 = document.getElementById('pin-sidebar-icon');
    if (this.isSidebarCollapsed) {
      document.body.classList.add('sidebar-collapsed');
      if (icon1) icon1.textContent = '▶';
      if (icon2) icon2.textContent = '▶';
    } else {
      document.body.classList.remove('sidebar-collapsed');
      if (icon1) icon1.textContent = '◀';
      if (icon2) icon2.textContent = '◀';
    }
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
    const raw = ticker.toUpperCase().trim();
    const isThai = raw.endsWith('.BK') || ['ADVANC', 'SCB', 'PTT', 'DIF', 'WHART', 'CPALL', 'KBANK', 'BBL', 'KTB', 'BDMS', 'AOT', 'DELTA', 'GULF', 'TISCO', 'CPN', 'MINT', 'SCC', 'TRUE', 'OR', 'CRC', 'BEM', 'BTS', 'LH', 'AP', 'SIRI', 'MEGA', 'EA', 'HMPRO', 'WHA', 'OSP', 'IVL', 'TOP', 'GPSC', 'BGRIM', 'EGCO', 'RATCH', 'STA', 'STGT', 'TU', 'CBG', 'SAWAD', 'MTC', 'TIDLOR', 'JMT', 'CHG', 'BCH', 'VGI', 'MAJOR'].includes(raw.replace('.BK', ''));
    const clean = raw.replace('.BK', '');

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
      return `<div class="ticker-icon-circle" style="width:${size}px; height:${size}px; border-color:${borderColor}; background:linear-gradient(135deg, #1e293b, #0f172a); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:${size > 36 ? 11 : 9}px; color:#fff; font-family:var(--font-mono);">${clean.slice(0, 4)}</div>`;
    }

    // Thai Stock Brand Color Map
    const thaiColors = {
      'ADVANC': '#72bf44',
      'SCB': '#4e2a84',
      'PTT': '#0072ce',
      'DIF': '#00a2e8',
      'WHART': '#ea580c',
      'CPALL': '#008037',
      'KBANK': '#138f2d',
      'BBL': '#1e3a8a',
      'KTB': '#00a3e0',
      'BDMS': '#004b87',
      'AOT': '#0066b2',
      'DELTA': '#0088cc',
      'GULF': '#002f6c',
      'TISCO': '#0055a5',
      'CPN': '#c9920e',
      'MINT': '#00508a',
      'SCC': '#d32f2f',
      'TRUE': '#ed1c24',
      'OR': '#0072ce',
      'CRC': '#e60000',
      'BEM': '#003399',
      'BTS': '#006633',
      'LH': '#800020',
      'SIRI': '#d97706',
      'HMPRO': '#005ba8',
      'CBG': '#008542',
      'EA': '#16a34a',
      'OSP': '#d97706',
      'MEGA': '#0284c7',
      'TU': '#0284c7',
      'IVL': '#1e40af',
      'TOP': '#0369a1',
      'GPSC': '#15803d',
      'BGRIM': '#0369a1',
      'EGCO': '#0284c7',
      'RATCH': '#0369a1',
      'STA': '#15803d',
      'STGT': '#0284c7',
      'SAWAD': '#d97706',
      'MTC': '#00508a',
      'TIDLOR': '#0284c7',
      'JMT': '#00508a',
      'CHG': '#008037',
      'BCH': '#004b87',
      'VGI': '#006633',
      'MAJOR': '#d32f2f'
    };

    const brandBg = thaiColors[clean] || '#334155';

    if (isThai) {
      const primaryThaiUrl = `https://assets.parqet.com/logos/symbol/${clean}.BK?format=png`;
      const fallbackThaiUrl = `https://financialmodelingprep.com/image-stock/${clean}.BK.png`;
      const fallbackUSUrl = `https://assets.parqet.com/logos/symbol/${clean}?format=png`;

      return `
        <div class="ticker-icon-circle" style="width:${size}px; height:${size}px; border-color:${borderColor}; background:#151a24; position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center;">
          <img src="${primaryThaiUrl}" 
               alt="${clean}" 
               loading="lazy" 
               referrerpolicy="no-referrer"
               onerror="
                 if (!this.dataset.step) {
                   this.dataset.step = '1';
                   this.src = '${fallbackThaiUrl}';
                 } else if (this.dataset.step === '1') {
                   this.dataset.step = '2';
                   this.src = '${fallbackUSUrl}';
                 } else {
                   this.style.display = 'none';
                   if (this.nextElementSibling) this.nextElementSibling.style.display = 'flex';
                 }
               " 
               style="width:100%; height:100%; object-fit:contain; padding:4px; border-radius:50%;">
          <div style="display:none; width:100%; height:100%; background:linear-gradient(135deg, ${brandBg}, #0f172a); flex-direction:column; align-items:center; justify-content:center; border-radius:50%; box-shadow:inset 0 0 6px rgba(0,0,0,0.6);">
            <span style="font-size:${size > 36 ? '11px' : '9px'}; font-weight:800; color:#fff; font-family:var(--font-mono); line-height:1;">${clean.slice(0, 4)}</span>
            <span style="font-size:${size > 36 ? '8px' : '6.5px'}; color:rgba(255,255,255,0.85); font-weight:700; margin-top:1px;">SET 🇹🇭</span>
          </div>
        </div>
      `;
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
        <div style="display:none; width:100%; height:100%; background:linear-gradient(135deg, #1e293b, #0f172a); align-items:center; justify-content:center; font-weight:800; font-size:${size > 36 ? 11 : 9}px; color:#fff; font-family:var(--font-mono);">${clean.slice(0, 4)}</div>
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
      'CPALL': 'CP ALL Public Company',
      'KBANK': 'Kasikornbank Public Company',
      'BBL': 'Bangkok Bank Public Company',
      'KTB': 'Krungthai Bank Public Company',
      'BDMS': 'Bangkok Dusit Medical Services',
      'AOT': 'Airports of Thailand Public Company',
      'DELTA': 'Delta Electronics (Thailand)',
      'GULF': 'Gulf Energy Development',
      'TISCO': 'TISCO Financial Group',
      'CPN': 'Central Pattana Public Company',
      'MINT': 'Minor International Public Company',
      'SCC': 'Siam Cement Public Company (SCG)',
      'TRUE': 'True Corporation Public Company',
      'OR': 'PTT Oil and Retail Business',
      'CRC': 'Central Retail Corporation',
      'BEM': 'Bangkok Expressway and Metro',
      'BTS': 'BTS Group Holdings',
      'LH': 'Land and Houses Public Company',
      'AP': 'AP (Thailand) Public Company',
      'SIRI': 'Sansiri Public Company',
      'HMPRO': 'Home Product Center',
      'CBG': 'Carabao Group Public Company',
      'EA': 'Energy Absolute Public Company',
      'OSP': 'Osotspa Public Company',
      'MEGA': 'Mega Lifesciences Public Company',
      'TU': 'Thai Union Group Public Company',
      'IVL': 'Indorama Ventures Public Company',
      'TOP': 'Thai Oil Public Company',
      'GPSC': 'Global Power Synergy',
      'BGRIM': 'B.Grimm Power Public Company',
      'EGCO': 'Electricity Generating Public Company',
      'RATCH': 'RATCH Group Public Company',
      'STA': 'Sri Trang Agro-Industry',
      'STGT': 'Sri Trang Gloves (Thailand)',
      'SAWAD': 'Srisawad Corporation',
      'MTC': 'Muangthai Capital Public Company',
      'TIDLOR': 'Ngern Tid Lor Public Company',
      'JMT': 'JMT Network Services',
      'CHG': 'Chularat Hospital Public Company',
      'BCH': 'Bangkok Chain Hospital',
      'VGI': 'VGI Public Company',
      'MAJOR': 'Major Cineplex Group',
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
        this.achievements = (parsed.achievements && Array.isArray(parsed.achievements)) ? parsed.achievements : JSON.parse(JSON.stringify(DEFAULT_ACHIEVEMENTS));
        this.exchangeRate = parsed.exchangeRate || 32.59;
      } else {
        this.portfolios = JSON.parse(JSON.stringify(INITIAL_PORTFOLIOS));
        this.tradingData = JSON.parse(JSON.stringify(INITIAL_TRADING_DATA));
        this.quarterlySnapshots = JSON.parse(JSON.stringify(INITIAL_QUARTERLY_DATA));
        this.dividends = JSON.parse(JSON.stringify(INITIAL_DIVIDENDS));
        this.achievements = JSON.parse(JSON.stringify(DEFAULT_ACHIEVEMENTS));
      }
    } catch (e) {
      console.warn('Failed to load localStorage:', e);
      this.portfolios = JSON.parse(JSON.stringify(INITIAL_PORTFOLIOS));
      this.tradingData = JSON.parse(JSON.stringify(INITIAL_TRADING_DATA));
      this.quarterlySnapshots = JSON.parse(JSON.stringify(INITIAL_QUARTERLY_DATA));
      this.dividends = JSON.parse(JSON.stringify(INITIAL_DIVIDENDS));
      this.achievements = JSON.parse(JSON.stringify(DEFAULT_ACHIEVEMENTS));
    }

    this.portfolios = this.portfolios.filter(p => p.id !== 'redwing' && !p.name.includes('RedWing'));

    // Sanitize old 2025 mock quarterly snapshots with fake inflated numbers
    this.quarterlySnapshots = (this.quarterlySnapshots || []).filter(q => {
      if (q.year === 2025 && q.totalUSD > 50000 && q.portValuesUSD && q.portValuesUSD.next_gen > 10000) {
        return false;
      }
      return true;
    });

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
      achievements: this.achievements,
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
    if (cloudData.achievements && Array.isArray(cloudData.achievements)) {
      this.achievements = cloudData.achievements;
    }
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
    const stockGainTHB = totalPLUSD * this.exchangeRate;
    // Historical base FX rate reference approx 32.50 THB/USD
    const baseFxRef = 32.50;
    const fxGainTHB = totalStockCostUSD * (this.exchangeRate - baseFxRef);
    const totalNetReturnTHB = stockGainTHB + (fxGainTHB > -99999 ? fxGainTHB : 0);

    return {
      grandTotalUSD,
      grandTotalTHB,
      totalStocksUSD,
      totalCashBufferUSD,
      totalTradingUSD,
      totalStockCostUSD,
      avg1dChangePct,
      totalPLUSD,
      totalPLPct,
      stockGainTHB,
      fxGainTHB,
      totalNetReturnTHB
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
    const fetchers = [
      async (u) => {
        // Direct fetch (sub-100ms in Android APK / WebView / Electron)
        const res = await this.fetchWithTimeout(u, 2500);
        if (res.ok) return await res.json();
        throw new Error('Direct failed');
      },
      async (u) => {
        const res = await this.fetchWithTimeout(`https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`, 3000);
        if (res.ok) return await res.json();
        throw new Error('Allorigins raw failed');
      },
      async (u) => {
        const res = await this.fetchWithTimeout(`https://api.allorigins.win/get?url=${encodeURIComponent(u)}`, 3000);
        if (res.ok) {
          const d = await res.json();
          if (d && d.contents) return JSON.parse(d.contents);
        }
        throw new Error('Allorigins get failed');
      },
      async (u) => {
        const res = await this.fetchWithTimeout(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`, 3000);
        if (res.ok) return await res.json();
        throw new Error('Codetabs failed');
      }
    ];

    try {
      // Race all proxy providers concurrently - the fastest responsive proxy wins immediately!
      return await Promise.any(fetchers.map(fn => fn(targetUrl)));
    } catch (e) {
      return null;
    }
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

    // 1. Try single batch quote first
    const symbolsStr = tickers.join(',');
    const quoteUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbolsStr)}`;
    
    try {
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
    } catch (e) {}

    // 2. Guaranteed concurrent chart fallback for all remaining tickers
    const missingTickers = tickers.filter(t => !priceUpdates[t]);
    if (missingTickers.length > 0) {
      const fallbackPromises = missingTickers.map(async (sym, idx) => {
        try {
          if (idx > 0) await new Promise(r => setTimeout(r, idx * 60));
          const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=2d`;
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

    const rate = this.exchangeRate || 32.59;
    const chartPromises = thaiTickers.map(async (sym, idx) => {
      try {
        if (idx > 0) await new Promise(r => setTimeout(r, idx * 60));
        const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=2d`;
        const chartData = await this.fetchViaFastProxies(chartUrl);
        const meta = chartData?.chart?.result?.[0]?.meta;
        if (meta && meta.regularMarketPrice) {
          const priceTHB = meta.regularMarketPrice;
          const prev = meta.previousClose || meta.chartPreviousClose || priceTHB;
          const changePct = prev > 0 ? ((priceTHB - prev) / prev) * 100 : 0;
          const priceUSD = priceTHB / rate;
          priceUpdates[sym] = { priceUSD, change1dPct: changePct };
        }
      } catch (e) {}
    });
    await Promise.allSettled(chartPromises);
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
    this.checkAllDipPriceAlerts();

    this.showToast({
      icon: '⚡',
      title: 'อัปเดตราคาตลาดสำเร็จ!',
      message: 'ปรับปรุงราคาหุ้นและคริปโตล่าสุดเรียบร้อยแล้ว',
      badges: [
        `📊 ${updatedCount} สินทรัพย์`,
        `⏱️ ${elapsedSec}s`,
        `🇺🇸 1 USD = ฿${this.exchangeRate.toFixed(2)}`
      ],
      type: 'success',
      duration: 4000
    });
    this.renderTickerTape();
    this.renderActiveTab();
  }

  // --- MODERN CYBERPUNK TOAST NOTIFICATION SYSTEM ---
  showToast({ icon = '⚡', title = '', message = '', badges = [], type = 'success', duration = 3800 }) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-card ${type}`;

    let badgesHTML = '';
    if (badges && badges.length > 0) {
      badgesHTML = `
        <div class="toast-meta-badges font-mono">
          ${badges.map(b => `<span class="toast-meta-badge">${b}</span>`).join('')}
        </div>
      `;
    }

    toast.innerHTML = `
      <div class="toast-icon-wrap">${icon}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-message">${message}</div>` : ''}
        ${badgesHTML}
      </div>
      <button type="button" class="toast-close-btn" aria-label="Close">&times;</button>
      <div class="toast-progress"></div>
    `;

    container.appendChild(toast);

    // Animate progress bar
    const progressBar = toast.querySelector('.toast-progress');
    if (progressBar) {
      progressBar.style.transition = `width ${duration}ms linear`;
      setTimeout(() => { progressBar.style.width = '0%'; }, 20);
    }

    const removeToast = () => {
      if (toast.classList.contains('closing')) return;
      toast.classList.add('closing');
      setTimeout(() => {
        if (toast.parentElement) toast.remove();
      }, 250);
    };

    const timer = setTimeout(removeToast, duration);

    toast.addEventListener('click', () => {
      clearTimeout(timer);
      removeToast();
    });
  }

  // --- REAL-TIME MARKET TICKER TAPE (MARQUEE) ---
  renderTickerTape() {
    const track = document.getElementById('ticker-tape-track');
    if (!track) return;

    // Collect unique stocks from portfolios
    const uniqueStocks = new Map();
    this.portfolios.forEach(p => {
      (p.holdings || []).forEach(h => {
        const sym = h.ticker.toUpperCase();
        if (!uniqueStocks.has(sym)) {
          const stats = this.calculateHoldingStats(h);
          uniqueStocks.set(sym, {
            sym,
            portId: p.id,
            price: stats.currentPrice,
            change1d: stats.change1d,
            color: p.color || '#10b981'
          });
        }
      });
    });

    const stockList = Array.from(uniqueStocks.values());
    if (stockList.length === 0) {
      track.innerHTML = `<span style="font-size:12px; color:var(--text-muted); padding:0 20px;">⚡ Pixel Steward Live Market Tape • บันทึกสินทรัพย์ในพอร์ตเพื่อเริ่มแสดงราคา Real-time</span>`;
      return;
    }

    const buildItemHTML = (s) => {
      const isUp = s.change1d >= 0;
      return `
        <div class="ticker-tape-item" data-tape-port="${s.portId}" data-tape-sym="${s.sym}" title="${s.sym} - คลิกเพื่อดูพอร์ต">
          ${this.renderStockLogoHTML(s.sym, s.color, 18)}
          <span class="tape-sym font-mono">${s.sym}</span>
          <span class="tape-price font-mono">$${s.price.toFixed(2)}</span>
          <span class="tape-change font-mono ${isUp ? 'text-emerald' : 'text-rose'}">
            ${isUp ? '▲ +' : '▼ '}${s.change1d.toFixed(2)}%
          </span>
        </div>
      `;
    };

    // Duplicate list to ensure seamless infinite loop
    const itemsHTML = stockList.map(buildItemHTML).join('');
    track.innerHTML = itemsHTML + itemsHTML + itemsHTML;

    // Smooth elegant pacing for ticker marquee (approx 3.5-4s per item, min 65s)
    const animDuration = Math.max(65, stockList.length * 4.5);
    track.style.animationDuration = `${animDuration}s`;

    // Click to navigate to portfolio
    track.querySelectorAll('.ticker-tape-item').forEach(el => {
      el.addEventListener('click', () => {
        const portId = el.getAttribute('data-tape-port');
        if (portId) {
          this.selectedPortfolioId = portId;
          this.switchTab('portfolios');
        }
      });
    });
  }

  // --- VIEW RENDERING ENGINE ---
  renderActiveTab() {
    this.renderTickerTape();
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

        <!-- FX RETURN VS STOCK GAIN BREAKDOWN CHIPS -->
        <div class="fx-breakdown-card">
          <div class="fx-chip">
            <span class="fx-chip-label">📈 กำไรจากหุ้น:</span>
            <strong class="${grand.totalPLUSD >= 0 ? 'text-emerald' : 'text-rose'} font-mono">
              ${grand.totalPLUSD >= 0 ? '+' : ''}${this.formatUSD(grand.totalPLUSD)} (${this.formatPercent(grand.totalPLPct)})
            </strong>
          </div>
          <div class="fx-chip">
            <span class="fx-chip-label">💵 ผลกระทบค่าเงิน (FX):</span>
            <strong class="${grand.fxGainTHB >= 0 ? 'text-emerald' : 'text-rose'} font-mono">
              ${grand.fxGainTHB >= 0 ? '+' : ''}${this.formatTHB(grand.fxGainTHB)}
            </strong>
          </div>
          <div class="fx-chip">
            <span class="fx-chip-label">🏆 ผลตอบแทนรวมสุทธิ:</span>
            <strong class="${grand.totalNetReturnTHB >= 0 ? 'text-emerald' : 'text-rose'} font-mono">
              ${grand.totalNetReturnTHB >= 0 ? '+' : ''}${this.formatTHB(grand.totalNetReturnTHB)}
            </strong>
          </div>
        </div>
      </div>

      <!-- CUSTOM FINANCIAL ACHIEVEMENTS & GOALS SECTION -->
      <div class="achievements-section-wrapper">
        <div class="achievements-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 15px; font-weight: 800; color: #fff;">🏆 เป้าหมาย & เหรียญความสำเร็จ (Goals & Achievements)</span>
            <span class="badge font-mono" style="background: rgba(16, 185, 129, 0.15); color: var(--color-emerald); font-size: 11px; padding: 2px 8px; border-radius: var(--radius-full);">
              ${this.achievements.filter(a => a.completed).length}/${this.achievements.length} สำเร็จแล้ว
            </span>
          </div>

          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <div class="achievement-filter-tabs">
              <button type="button" class="ach-tab-btn ${this.achievementFilter === 'in_progress' ? 'active' : ''}" data-ach-filter="in_progress">
                ⏳ กำลังพิชิต (${this.achievements.filter(a => !a.completed).length})
              </button>
              <button type="button" class="ach-tab-btn ${this.achievementFilter === 'completed' ? 'active' : ''}" data-ach-filter="completed">
                ✅ สำเร็จแล้ว (${this.achievements.filter(a => a.completed).length})
              </button>
              <button type="button" class="ach-tab-btn ${this.achievementFilter === 'all' ? 'active' : ''}" data-ach-filter="all">
                🌟 ทั้งหมด (${this.achievements.length})
              </button>
            </div>
            <button type="button" class="btn btn-sm btn-secondary" id="btn-add-achievement-modal" title="สร้างเป้าหมายทางการเงินใหม่">
              <span>➕ เพิ่มเป้าหมาย</span>
            </button>
          </div>
        </div>

        <div class="achievements-list-grid" id="achievements-list-container">
          ${this.renderAchievementsListHTML()}
        </div>
      </div>

      <!-- VIEW MODE SWITCHER: DONUT VS TREEMAP -->
      <div class="view-mode-selector-wrapper">
        <div class="section-title" style="margin: 0;">
          <span>📊 แผนภาพสัดส่วนการลงทุน (Asset Allocation)</span>
        </div>
        <div class="view-mode-pill">
          <button type="button" class="view-pill-btn ${this.allocationViewMode !== 'treemap' ? 'active' : ''}" id="btn-view-donut">
            <span>🍩 กราฟโดนัท</span>
          </button>
          <button type="button" class="view-pill-btn ${this.allocationViewMode === 'treemap' ? 'active' : ''}" id="btn-view-treemap">
            <span>🌲 แผนภาพ Treemap</span>
          </button>
        </div>
      </div>

      <!-- 1. DONUT CHARTS CONTAINER -->
      <div class="analytics-charts-wrapper" id="dashboard-donut-container" style="${this.allocationViewMode === 'treemap' ? 'display:none;' : ''}">
        <div class="donut-tabs-header">
          <button type="button" class="donut-tab-btn active" data-donut-target="asset">💼 สัดส่วนประเภทสินทรัพย์</button>
          <button type="button" class="donut-tab-btn" data-donut-target="port">📁 สัดส่วนตามพอร์ตเป้าหมาย</button>
          <button type="button" class="donut-tab-btn" data-donut-target="holding">📈 สัดส่วนหุ้นย่อยทั้งหมด</button>
        </div>

        <div class="analytics-charts-grid">
          <div class="chart-card donut-chart-slide active" id="donut-slide-asset">
            <div class="chart-title">
              <span>🍩 สัดส่วนตามประเภทสินทรัพย์ (Asset Allocation)</span>
            </div>
            <div class="chart-canvas-container">
              <canvas id="chart-asset-classes"></canvas>
            </div>
            <div class="chart-legend-list" id="legend-asset-classes"></div>
          </div>

          <div class="chart-card donut-chart-slide" id="donut-slide-port">
            <div class="chart-title">
              <span>🎯 สัดส่วนตามพอร์ตเป้าหมาย (Sub-Portfolios)</span>
            </div>
            <div class="chart-canvas-container">
              <canvas id="chart-portfolio-weights"></canvas>
            </div>
            <div class="chart-legend-list" id="legend-portfolio-weights"></div>
          </div>

          <div class="chart-card donut-chart-slide" id="donut-slide-holding">
            <div class="chart-title">
              <span>🍩 สัดส่วนสินทรัพย์ย่อยทั้งหมด (Holdings Allocation)</span>
            </div>
            <div class="chart-canvas-container">
              <canvas id="chart-all-holdings"></canvas>
            </div>
            <div class="chart-legend-list" id="legend-all-holdings"></div>
          </div>
        </div>
      </div>

      <!-- 2. TREEMAP CONTAINER -->
      <div class="treemap-wrapper" id="dashboard-treemap-container" style="${this.allocationViewMode === 'treemap' ? '' : 'display:none;'}">
        <div class="treemap-header">
          <div style="font-size:13px; font-weight:700; color:#fff;">🌲 แผนภาพขนาดพอร์ตตามมูลค่าและผลกำไร/ขาดทุน (Market Value & P/L Heatmap)</div>
          <span style="font-size:11px; color:var(--text-muted);">คลิกที่กล่องเพื่อเปิดพอร์ต</span>
        </div>
        <div class="treemap-grid" id="treemap-tiles-grid">
          ${this.renderTreemapTilesHTML()}
        </div>
      </div>

      <!-- SUB-PORTFOLIOS CARDS (DIME CARDS) -->
      <div class="section-header">
        <div class="section-title">
          <span>พอร์ตการลงทุนตามเป้าหมาย (Goal-Based IPS)</span>
          <span class="section-count-badge font-mono">${this.portfolios.length} พอร์ต</span>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-sm btn-secondary" id="btn-open-reorder-modal">
            <span>↕️ จัดเรียงลำดับ</span>
          </button>
          <button class="btn btn-sm btn-secondary" id="btn-add-portfolio-modal">
            <span>➕ เพิ่มพอร์ตใหม่</span>
          </button>
        </div>
      </div>

      <div class="portfolios-grid">
    `;

    this.portfolios.forEach(p => {
      const stats = this.calculatePortfolioStats(p);
      const dualVal = this.formatDual(stats.totalValueUSD);
      const dualCash = this.formatDual(stats.cashBufferUSD);

      html += `
        <div class="port-card port-card-compact" data-open-port="${p.id}" style="border-left: 4px solid ${p.color || '#10b981'};">
          <div class="port-card-top">
            ${p.logo ? `<img src="${p.logo}" class="port-logo-img" alt="${p.name}" onerror="this.style.display='none'">` : ''}
            <div class="port-info-col">
              <div class="port-card-name-row">
                <span class="port-card-name">${p.emoji || '📁'} ${p.name}</span>
                <span class="port-card-compact-badge font-mono">${p.tier}</span>
                <span class="port-cash-buffer-pill font-mono">💧 ${dualCash.main}</span>
              </div>
            </div>
            <div class="port-card-value-box">
              <div class="port-card-val-primary font-mono">${dualVal.main}</div>
              <div class="port-card-val-secondary font-mono">${dualVal.sub}</div>
            </div>
          </div>

          <div class="port-card-compact-meta font-mono">
            <div class="port-meta-left">
              <span class="${stats.avg1dChangePct >= 0 ? 'text-emerald' : 'text-rose'}">
                ${stats.avg1dChangePct >= 0 ? '▲ +' : '▼ '}${stats.avg1dChangePct.toFixed(2)}% (1D)
              </span>
              <span class="text-muted">•</span>
              <span class="${stats.totalPLPct >= 0 ? 'text-emerald' : 'text-rose'}">
                P/L ${stats.totalPLPct >= 0 ? '+' : ''}${stats.totalPLPct.toFixed(2)}% (${this.formatUSD(stats.totalPLUSD)})
              </span>
            </div>
            <div class="port-meta-right">
              <span class="text-muted">เป้า: ${this.formatUSD(stats.goalUSD)}</span>
              <strong style="color:#fff;">${stats.goalProgressPct.toFixed(1)}%</strong>
            </div>
          </div>

          <div class="progress-bar-bg compact">
            <div class="progress-bar-fill" style="width: ${stats.goalProgressPct}%; background: ${p.color || '#10b981'};"></div>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;

    // Setup View Mode Toggle (Donut vs Treemap)
    const btnDonut = document.getElementById('btn-view-donut');
    const btnTreemap = document.getElementById('btn-view-treemap');
    const donutContainer = document.getElementById('dashboard-donut-container');
    const treemapContainer = document.getElementById('dashboard-treemap-container');

    btnDonut?.addEventListener('click', () => {
      this.allocationViewMode = 'donut';
      btnDonut.classList.add('active');
      btnTreemap?.classList.remove('active');
      if (donutContainer) donutContainer.style.display = 'block';
      if (treemapContainer) treemapContainer.style.display = 'none';
    });

    btnTreemap?.addEventListener('click', () => {
      this.allocationViewMode = 'treemap';
      btnTreemap.classList.add('active');
      btnDonut?.classList.remove('active');
      if (donutContainer) donutContainer.style.display = 'none';
      if (treemapContainer) treemapContainer.style.display = 'block';
    });

    // Treemap Tile click to view portfolio
    container.querySelectorAll('.treemap-tile').forEach(tile => {
      tile.addEventListener('click', () => {
        const portId = tile.getAttribute('data-treemap-port');
        if (portId) {
          this.selectedPortfolioId = portId;
          this.switchTab('portfolios');
        }
      });
    });

    // Setup Achievements Mini-Tabs & Click Events
    this.setupAchievementsEvents(container);

    // Setup Donut Carousel Tabs & Charts
    this.setupDonutTabs();
    setTimeout(() => {
      this.initDashboardCharts();
    }, 50);
  }

  setupAchievementsEvents(container) {
    // Mini-Tab Filter Click
    container.querySelectorAll('[data-ach-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-ach-filter');
        this.achievementFilter = filter;
        container.querySelectorAll('[data-ach-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const listEl = document.getElementById('achievements-list-container');
        if (listEl) {
          listEl.innerHTML = this.renderAchievementsListHTML();
          this.rebindAchievementItemEvents(container);
        }
      });
    });

    // Add Achievement Modal Button
    document.getElementById('btn-add-achievement-modal')?.addEventListener('click', () => {
      this.openAchievementModal(null);
    });

    this.rebindAchievementItemEvents(container);
  }

  rebindAchievementItemEvents(container) {
    // Toggle Completion (Check button)
    container.querySelectorAll('[data-ach-toggle]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-ach-toggle');
        this.toggleAchievementCompleted(id);
      });
    });

    // Edit Achievement on Edit Button Click
    container.querySelectorAll('[data-ach-edit]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-ach-edit');
        this.openAchievementModal(id);
      });
    });

    // Edit Achievement on Card Click
    container.querySelectorAll('.achievement-card-compact').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('[data-ach-toggle]')) return;
        const id = card.getAttribute('data-ach-id');
        if (id) this.openAchievementModal(id);
      });
    });
  }

  renderAchievementsListHTML() {
    let list = this.achievements || [];
    if (this.achievementFilter === 'in_progress') {
      list = list.filter(a => !a.completed);
    } else if (this.achievementFilter === 'completed') {
      list = list.filter(a => a.completed);
    }

    if (list.length === 0) {
      const msg = this.achievementFilter === 'completed' 
        ? 'ยังไม่มีเป้าหมายที่สำเร็จ มาเริ่มพิชิตเป้าหมายกันเถอะ!' 
        : (this.achievementFilter === 'in_progress' ? '🎉 ยินดีด้วย! คุณพิชิตเป้าหมายทั้งหมดเรียบร้อยแล้ว' : 'ยังไม่มีเป้าหมายที่บันทึกไว้');
      return `<div style="text-align: center; padding: 20px; color: var(--text-muted); grid-column: 1/-1; font-size: 13px;">${msg}</div>`;
    }

    return list.map(a => `
      <div class="achievement-card-compact ${a.completed ? 'unlocked' : 'locked'}" data-ach-id="${a.id}">
        <div class="ach-card-left">
          <span class="ach-icon">${a.emoji || '🎯'}</span>
          <div class="ach-meta">
            <div class="ach-title">
              <span>${this.escapeHtml(a.name)}</span>
              ${a.completed ? '<span style="color:var(--color-emerald); font-size:11px;">✅</span>' : '<span style="color:var(--text-muted); font-size:11px;">⏳</span>'}
            </div>
            <div class="ach-desc" title="${this.escapeHtml(a.desc || '')}">${this.escapeHtml(a.desc || 'เป้าหมายทางการเงิน')}</div>
          </div>
        </div>
        <div class="ach-actions">
          <button type="button" class="ach-check-btn ${a.completed ? 'completed' : ''}" data-ach-toggle="${a.id}" title="${a.completed ? 'คลิกเพื่อเปลี่ยนเป็นกำลังทำ' : 'คลิกเมื่อทำสำเร็จแล้ว 🎉'}">
            ${a.completed ? '✓' : '○'}
          </button>
          <button type="button" class="ach-edit-btn" data-ach-edit="${a.id}" title="แก้ไขเป้าหมาย">✏️</button>
        </div>
      </div>
    `).join('');
  }

  openAchievementModal(achId = null) {
    const titleEl = document.getElementById('modal-achievement-title');
    const idInput = document.getElementById('achievement-id');
    const emojiInput = document.getElementById('achievement-emoji');
    const nameInput = document.getElementById('achievement-name');
    const descInput = document.getElementById('achievement-desc');
    const completedInput = document.getElementById('achievement-completed');
    const btnDelete = document.getElementById('btn-delete-achievement');

    if (achId) {
      const ach = (this.achievements || []).find(a => a.id === achId);
      if (!ach) return;
      if (titleEl) titleEl.textContent = '✏️ แก้ไขเป้าหมายความสำเร็จ';
      if (idInput) idInput.value = ach.id;
      if (emojiInput) emojiInput.value = ach.emoji || '🎯';
      if (nameInput) nameInput.value = ach.name || '';
      if (descInput) descInput.value = ach.desc || '';
      if (completedInput) completedInput.checked = !!ach.completed;
      btnDelete?.classList.remove('hidden');
    } else {
      if (titleEl) titleEl.textContent = '➕ สร้างเป้าหมายความสำเร็จใหม่';
      if (idInput) idInput.value = '';
      if (emojiInput) emojiInput.value = '🎯';
      if (nameInput) nameInput.value = '';
      if (descInput) descInput.value = '';
      if (completedInput) completedInput.checked = false;
      btnDelete?.classList.add('hidden');
    }

    this.setupAchievementEmojiPicker();
    this.openModal('modal-achievement');
  }

  setupAchievementEmojiPicker() {
    const container = document.getElementById('achievement-emoji-picker');
    const emojiInput = document.getElementById('achievement-emoji');
    if (!container || !emojiInput) return;

    container.querySelectorAll('.emoji-pick-btn').forEach(btn => {
      btn.onclick = () => {
        const em = btn.getAttribute('data-emoji');
        if (em) {
          emojiInput.value = em;
          container.querySelectorAll('.emoji-pick-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        }
      };
    });
  }

  saveAchievementFromForm(e) {
    if (e) e.preventDefault();
    const id = document.getElementById('achievement-id')?.value;
    const emoji = (document.getElementById('achievement-emoji')?.value || '🎯').trim();
    const name = (document.getElementById('achievement-name')?.value || '').trim();
    const desc = (document.getElementById('achievement-desc')?.value || '').trim();
    const completed = !!document.getElementById('achievement-completed')?.checked;

    if (!name) {
      alert('กรุณากรอกชื่อเป้าหมายความสำเร็จ');
      return;
    }

    if (id) {
      // Edit existing
      const idx = this.achievements.findIndex(a => a.id === id);
      if (idx >= 0) {
        const wasCompleted = this.achievements[idx].completed;
        this.achievements[idx] = {
          ...this.achievements[idx],
          emoji,
          name,
          desc,
          completed
        };
        if (!wasCompleted && completed) {
          this.triggerCelebration();
        }
      }
    } else {
      // Create new
      const newAch = {
        id: 'ach_' + Date.now(),
        emoji,
        name,
        desc,
        completed,
        createdAt: new Date().toISOString().split('T')[0]
      };
      this.achievements.push(newAch);
      if (completed) {
        this.triggerCelebration();
      }
    }

    this.saveData();
    this.closeModal('modal-achievement');
    this.showToast({
      icon: emoji,
      title: 'บันทึกเป้าหมายสำเร็จ!',
      message: name,
      type: 'success'
    });
  }

  deleteAchievement(achId) {
    if (!achId) return;
    if (confirm('คุณต้องการลบเป้าหมายนี้ใช่หรือไม่?')) {
      this.achievements = this.achievements.filter(a => a.id !== achId);
      this.saveData();
      this.closeModal('modal-achievement');
      this.showToast({
        icon: '🗑️',
        title: 'ลบเป้าหมายแล้ว',
        type: 'info'
      });
    }
  }

  toggleAchievementCompleted(achId) {
    const ach = (this.achievements || []).find(a => a.id === achId);
    if (!ach) return;
    ach.completed = !ach.completed;
    if (ach.completed) {
      this.triggerCelebration();
      this.showToast({
        icon: ach.emoji || '🎉',
        title: '🏆 ปลดล็อกเป้าหมายสำเร็จ!',
        message: ach.name,
        type: 'success'
      });
    } else {
      this.showToast({
        icon: '⏳',
        title: 'เปลี่ยนสถานะเป็นกำลังพิชิต',
        message: ach.name,
        type: 'info'
      });
    }
    this.saveData();
  }

  renderTreemapTilesHTML() {
    const allHoldings = [];
    this.portfolios.forEach(p => {
      (p.holdings || []).forEach(h => {
        const stats = this.calculateHoldingStats(h);
        if (stats.marketValueUSD > 0) {
          allHoldings.push({
            ticker: h.ticker,
            name: h.name || h.ticker,
            portId: p.id,
            portName: p.name,
            portEmoji: p.emoji || '📁',
            color: p.color || '#10b981',
            valUSD: stats.marketValueUSD,
            valTHB: stats.marketValueTHB,
            plPct: stats.unrealizedPLPct,
            plUSD: stats.unrealizedPLUSD,
            shares: stats.shares
          });
        }
      });
    });

    if (allHoldings.length === 0) {
      return `<div style="text-align:center; padding:32px; color:var(--text-muted); grid-column: 1/-1;">ยังไม่มีรายการสินทรัพย์ในพอร์ต</div>`;
    }

    allHoldings.sort((a, b) => b.valUSD - a.valUSD);
    const maxVal = allHoldings[0].valUSD || 1;

    return allHoldings.map(h => {
      const isUp = h.plPct >= 0;
      const colSpan = (h.valUSD / maxVal > 0.45 && allHoldings.length > 2) ? 'grid-column: span 2;' : '';
      return `
        <div class="treemap-tile ${isUp ? 'positive' : 'negative'}" style="${colSpan}" data-treemap-port="${h.portId}" title="${h.ticker} (${h.name}) - คลิกเพื่อเปิดพอร์ต">
          <div class="treemap-tile-header">
            <div style="display:flex; align-items:center; gap:6px;">
              ${this.renderStockLogoHTML(h.ticker, h.color, 24)}
              <span class="treemap-tile-sym">${h.ticker}</span>
            </div>
            <span class="treemap-tile-pct ${isUp ? 'positive' : 'negative'} font-mono">
              ${isUp ? '+' : ''}${h.plPct.toFixed(1)}%
            </span>
          </div>
          <div>
            <div class="treemap-tile-val">${this.formatUSD(h.valUSD)}</div>
            <div class="treemap-tile-sub">≈ ${this.formatTHB(h.valTHB)} • ${h.portEmoji} ${h.portName}</div>
          </div>
        </div>
      `;
    }).join('');
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

  setupDonutTabs() {
    const tabBtns = document.querySelectorAll('.donut-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-donut-target');
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.donut-chart-slide').forEach(slide => {
          slide.classList.remove('active');
        });
        const activeSlide = document.getElementById(`donut-slide-${target}`);
        if (activeSlide) activeSlide.classList.add('active');
      });
    });
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
              P/L: <span class="${stats.totalPLPct >= 0 ? 'text-emerald' : 'text-rose'} font-bold">${stats.totalPLPct >= 0 ? '+' : ''}${this.formatPercent(stats.totalPLPct)} (${this.formatUSD(stats.totalPLUSD)} / ${this.formatTHB(this.usdToThb(stats.totalPLUSD))})</span>
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

        const dip1 = h.dipTarget1 || h.dipTargetUSD || 0;
        const dip2 = h.dipTarget2 || 0;
        const dip3 = h.dipTarget3 || 0;

        const isDip3 = dip3 > 0 && s.currentPrice > 0 && s.currentPrice <= dip3;
        const isDip2 = !isDip3 && dip2 > 0 && s.currentPrice > 0 && s.currentPrice <= dip2;
        const isDip1 = !isDip3 && !isDip2 && dip1 > 0 && s.currentPrice > 0 && s.currentPrice <= dip1;
        const isDipActive = isDip1 || isDip2 || isDip3;

        let dipBadgeText = '';
        if (isDip3) dipBadgeText = `🔥 ถึงจุดช้อนไม้ 3 ($${s.currentPrice.toFixed(2)} ≤ $${dip3.toFixed(2)})`;
        else if (isDip2) dipBadgeText = `🔥 ถึงจุดช้อนไม้ 2 ($${s.currentPrice.toFixed(2)} ≤ $${dip2.toFixed(2)})`;
        else if (isDip1) dipBadgeText = `🎯 ถึงจุดช้อนไม้ 1 ($${s.currentPrice.toFixed(2)} ≤ $${dip1.toFixed(2)})`;

        const hasAnyDip = (dip1 > 0 || dip2 > 0 || dip3 > 0);

        html += `
          <div class="holding-card ${isDipActive ? 'dip-active' : ''}">
            <div class="holding-header">
              <div class="holding-ticker-group">
                ${this.renderStockLogoHTML(h.ticker, port.color || '#10b981', 42)}
                <div class="ticker-name-box">
                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <h4 style="margin: 0;">${h.ticker}</h4>
                    ${isDipActive ? `<span class="dip-alert-badge">${dipBadgeText}</span>` : ''}
                  </div>
                  <div class="ticker-subname">${h.name || h.ticker}</div>
                  ${hasAnyDip ? `
                    <div class="dip-targets-pill-row font-mono">
                      ${dip1 > 0 ? `<span class="dip-tier-pill ${s.currentPrice <= dip1 && s.currentPrice > 0 ? 'hit' : ''}">🎯 ไม้ 1: $${dip1.toFixed(2)}</span>` : ''}
                      ${dip2 > 0 ? `<span class="dip-tier-pill ${s.currentPrice <= dip2 && s.currentPrice > 0 ? 'hit' : ''}">🎯 ไม้ 2: $${dip2.toFixed(2)}</span>` : ''}
                      ${dip3 > 0 ? `<span class="dip-tier-pill ${s.currentPrice <= dip3 && s.currentPrice > 0 ? 'hit' : ''}">🎯 ไม้ 3: $${dip3.toFixed(2)}</span>` : ''}
                    </div>
                  ` : ''}
                </div>
              </div>

              <div class="holding-value-group">
                <div class="holding-market-val-thb font-mono">${dualMarket.main}</div>
                <div class="holding-market-val-usd font-mono">${dualMarket.sub}</div>
                <div class="holding-weight-tag font-mono">สัดส่วน: ${weightPct}%</div>
                <div class="holding-pl-badge font-mono ${s.unrealizedPLUSD >= 0 ? 'text-emerald' : 'text-rose'}">
                  ${s.unrealizedPLUSD >= 0 ? '↗ +' : '↘ '}${this.formatPercent(s.unrealizedPLPct)} (${this.formatUSD(s.unrealizedPLUSD)} / ${this.formatTHB(this.usdToThb(s.unrealizedPLUSD))})
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

  // 4. DIVIDEND TRACKER & 12-MONTH FORECAST VIEW
  renderDividendsView(container) {
    let totalGrossUSD = 0;
    let totalTaxUSD = 0;
    let totalNetUSD = 0;

    this.dividends.forEach(d => {
      totalGrossUSD += parseFloat(d.grossUSD) || 0;
      totalTaxUSD += parseFloat(d.taxUSD) || 0;
      totalNetUSD += parseFloat(d.netUSD) || 0;
    });

    const grand = this.calculateGrandTotalStats();
    
    // Estimate Forward Annual Dividend Run-Rate based on current holdings
    let estAnnualUSD = 0;
    let totalCostUSD = 0;

    const yieldMap = {
      'O': 0.053,
      'SCB': 0.075,
      'PTT': 0.060,
      'DIF': 0.082,
      'WHART': 0.065,
      'ADVANC': 0.042,
      'CPALL': 0.025,
      'ABBV': 0.038,
      'KO': 0.031,
      'PEP': 0.029,
      'PG': 0.024,
      'VOO': 0.0135,
      'SPY': 0.0135,
      'QQQ': 0.006,
      'MSFT': 0.0075,
      'AAPL': 0.0055,
      'NVDA': 0.0008,
      'TISCO': 0.078
    };

    this.portfolios.forEach(p => {
      const isDivPort = (p.id || '').includes('dividend') || (p.category || '').includes('Dividend');
      (p.holdings || []).forEach(h => {
        const stats = this.calculateHoldingStats(h);
        if (stats.marketValueUSD > 0) {
          totalCostUSD += stats.totalCostUSD;
          const sym = h.ticker.replace('.BK', '').toUpperCase();
          const yld = yieldMap[sym] || (isDivPort ? 0.045 : 0.012);
          estAnnualUSD += (stats.marketValueUSD * yld);
        }
      });
    });

    // If no holdings yet, fallback to recorded history
    if (estAnnualUSD === 0 && totalNetUSD > 0) {
      estAnnualUSD = totalNetUSD;
    }

    const estMonthlyUSD = estAnnualUSD / 12;
    const estDailyUSD = estAnnualUSD / 365;
    const yocPct = totalCostUSD > 0 ? (estAnnualUSD / totalCostUSD) * 100 : (grand.totalStocksUSD > 0 ? (estAnnualUSD / grand.totalStocksUSD) * 100 : 0);

    const dualNet = this.formatDual(totalNetUSD);

    let html = `
      <div class="dime-hero-banner" style="background: linear-gradient(135deg, #0e291e 0%, #0d1e17 40%, #0f131a 100%);">
        <div class="dime-hero-header">
          <span class="dime-hero-label text-emerald">เงินปันผลสะสมทั้งหมด (Total Net Dividends)</span>
          <span class="dime-timestamp font-mono">สุทธิหลังหักภาษี WHT 15%</span>
        </div>
        <div class="dime-main-value font-mono">${dualNet.main}</div>
        <div class="dime-sub-value font-mono">${dualNet.sub} (เข้ากระเป๋าจริงแล้ว)</div>
      </div>

      <!-- PASSIVE INCOME RUN-RATE CARDS -->
      <div class="runrate-grid">
        <div class="runrate-card">
          <div class="runrate-label">💵 คาดการณ์ต่อปี (Annual Run-Rate)</div>
          <div class="runrate-val text-emerald">${this.formatUSD(estAnnualUSD)}</div>
          <div class="runrate-sub">≈ ${this.formatTHB(this.usdToThb(estAnnualUSD))} / ปี</div>
        </div>
        <div class="runrate-card">
          <div class="runrate-label">📆 เฉลี่ยต่อเดือน (Monthly Average)</div>
          <div class="runrate-val text-blue">${this.formatUSD(estMonthlyUSD)}</div>
          <div class="runrate-sub">≈ ${this.formatTHB(this.usdToThb(estMonthlyUSD))} / เดือน</div>
        </div>
        <div class="runrate-card">
          <div class="runrate-label">☕ เฉลี่ยต่อวัน (Daily Income)</div>
          <div class="runrate-val text-purple">${this.formatUSD(estDailyUSD)}</div>
          <div class="runrate-sub">≈ ${this.formatTHB(this.usdToThb(estDailyUSD))} / วัน</div>
        </div>
        <div class="runrate-card">
          <div class="runrate-label">📈 Yield on Cost (YOC)</div>
          <div class="runrate-val font-bold" style="color: #f59e0b;">${yocPct.toFixed(2)}%</div>
          <div class="runrate-sub">ผลตอบแทนเทียบต้นทุนจริง</div>
        </div>
      </div>

      <!-- 12-MONTH DIVIDEND FORECAST BAR CHART -->
      <div class="chart-card" style="margin-bottom: 24px;">
        <div class="chart-title">
          <span>📅 ปฏิทินคาดการณ์รับเงินปันผลรายเดือน 12 เดือน (Monthly Dividend Forecast)</span>
        </div>
        <div class="chart-canvas-container" style="height: 260px;">
          <canvas id="chart-dividend-forecast"></canvas>
        </div>
      </div>

      <div class="section-header">
        <div class="section-title">
          <span>ประวัติการรับเงินปันผลรับเข้าพอร์ต</span>
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

    setTimeout(() => {
      this.initDividendForecastChart(estAnnualUSD);
    }, 50);
  }

  initDividendForecastChart(annualTotalUSD) {
    const ctx = document.getElementById('chart-dividend-forecast')?.getContext('2d');
    if (!ctx) return;

    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const monthlyBase = annualTotalUSD > 0 ? (annualTotalUSD / 12) : 10;

    // Distribute typical dividend quarterly peaks (Mar, Jun, Sep, Dec + May/Nov for Thai)
    const weights = [0.85, 0.75, 1.45, 0.80, 1.30, 1.50, 0.75, 0.80, 1.40, 0.80, 1.25, 1.55];
    const dataValues = weights.map(w => parseFloat((monthlyBase * w).toFixed(2)));

    this.charts.divForecast = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [{
          label: 'คาดการณ์ปันผลสุทธิ ($ USD)',
          data: dataValues,
          backgroundColor: 'rgba(16, 185, 129, 0.65)',
          hoverBackgroundColor: '#10b981',
          borderRadius: 6,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (c) => ` ปันผลคาดการณ์: $${c.raw.toFixed(2)} (≈ ฿${Math.round(this.usdToThb(c.raw)).toLocaleString()})`
            }
          }
        },
        scales: {
          y: {
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { color: '#64748b', callback: v => '$' + v }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#94a3b8', font: { weight: '600' } }
          }
        }
      }
    });
  }


  // --- AUTO QUARTERLY SNAPSHOT ENGINE (Q1: 31 Mar, Q2: 30 Jun, Q3: 30 Sep, Q4: 31 Dec) ---
  checkAndAutoRecordQuarterlySnapshots() {
    const now = new Date();
    const currentYear = now.getFullYear();

    // 4 Quarter End Milestones specified by User:
    // Q1 = 31 มีนาคม (31 March)
    // Q2 = 30 มิถุนายน (30 June)
    // Q3 = 30 กันยายน (30 September)
    // Q4 = 31 ธันวาคม (31 December)
    const quarterMilestones = [
      { quarter: 'Q1', month: 2, day: 31, dateStr: `${currentYear}-03-31`, label: 'Q1 (31 มี.ค.)' },
      { quarter: 'Q2', month: 5, day: 30, dateStr: `${currentYear}-06-30`, label: 'Q2 (30 มิ.ย.)' },
      { quarter: 'Q3', month: 8, day: 30, dateStr: `${currentYear}-09-30`, label: 'Q3 (30 ก.ย.)' },
      { quarter: 'Q4', month: 11, day: 31, dateStr: `${currentYear}-12-31`, label: 'Q4 (31 ธ.ค.)' }
    ];

    if (!Array.isArray(this.quarterlySnapshots)) {
      this.quarterlySnapshots = [];
    }

    let hasNewSnapshot = false;

    quarterMilestones.forEach(q => {
      const qDate = new Date(currentYear, q.month, q.day, 23, 59, 59);
      
      // If current date has reached or passed this quarter's cutoff
      if (now >= qDate) {
        const existingIdx = this.quarterlySnapshots.findIndex(s => s.year === currentYear && s.quarter === q.quarter);
        if (existingIdx < 0) {
          const snapshot = this.createCurrentPortfolioSnapshot(currentYear, q.quarter, q.dateStr, `บันทึกอัตโนมัติสิ้น ${q.label}`);
          this.quarterlySnapshots.push(snapshot);
          hasNewSnapshot = true;
        }
      }
    });

    if (hasNewSnapshot) {
      this.saveData();
    }
  }

  createCurrentPortfolioSnapshot(year, quarter, dateStr, notes = '') {
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

    return {
      year: parseInt(year),
      quarter,
      date: dateStr || new Date().toISOString().split('T')[0],
      exchangeRate: this.exchangeRate,
      portValuesUSD,
      totalUSD,
      notes: notes || `Snapshot ${quarter}/${year}`
    };
  }

  // 5. QUARTERLY COMPARISON & AUTO-SNAPSHOT VIEW
  renderQuarterlyView(container) {
    const now = new Date();
    const currentYear = now.getFullYear();
    this.selectedQuarterYear = this.selectedQuarterYear || currentYear;
    const currentQuarter = 'Q' + Math.ceil((now.getMonth() + 1) / 3);

    // Auto-record any due quarters on view open
    this.checkAndAutoRecordQuarterlySnapshots();

    // Get available snapshot years
    const availableYears = Array.from(new Set([
      currentYear,
      ...this.quarterlySnapshots.map(q => q.year)
    ])).sort((a, b) => b - a);

    const yearSnapshots = this.quarterlySnapshots.filter(q => q.year === this.selectedQuarterYear);
    const q1Obj = yearSnapshots.find(q => q.quarter === 'Q1');
    const q2Obj = yearSnapshots.find(q => q.quarter === 'Q2');
    const q3Obj = yearSnapshots.find(q => q.quarter === 'Q3');
    const q4Obj = yearSnapshots.find(q => q.quarter === 'Q4');

    const q1Map = q1Obj?.portValuesUSD || {};
    const q2Map = q2Obj?.portValuesUSD || {};
    const q3Map = q3Obj?.portValuesUSD || {};
    const q4Map = q4Obj?.portValuesUSD || {};

    let html = `
      <div class="quarterly-action-banner">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px;">
            <h3 style="font-size: 18px; font-weight: 700; color: #fff; margin: 0;">📸 ระบบบันทึกเปรียบเทียบการเติบโตรายไตรมาส</h3>
            <span class="badge font-mono" style="background: rgba(16, 185, 129, 0.15); color: var(--color-emerald); border: 1px solid rgba(16, 185, 129, 0.3); font-size: 11px; padding: 2px 8px; border-radius: var(--radius-full);">
              ⚡ Auto Snapshot: 31 มี.ค. | 30 มิ.ย. | 30 ก.ย. | 31 ธ.ค.
            </span>
          </div>
          <p style="font-size: 13px; color: var(--text-secondary); margin: 0;">
            บันทึก Snapshot มูลค่าพอร์ตอัตโนมัติทุกสิ้นไตรมาสเพื่อวิเคราะห์การเติบโต Q-on-Q ที่แม่นยำ
          </p>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button class="btn btn-primary btn-glow" id="btn-take-quarter-snapshot">
            <span>📸 บันทึก Snapshot (${currentQuarter}/${currentYear})</span>
          </button>
          <button class="btn btn-secondary" id="btn-reset-quarter-data" title="ล้างข้อมูลไตรมาสปีนี้แล้วบันทึกใหม่">
            <span>🔄 เริ่มต้นบันทึกปีนี้ใหม่</span>
          </button>
        </div>
      </div>

      <!-- SECTION HEADER WITH YEAR SELECTOR -->
      <div class="section-header">
        <div class="section-title">
          <span>ตารางเปรียบเทียบผลงานรายไตรมาส (Quarterly Records)</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 13px; color: var(--text-secondary);">เลือกปี:</span>
          <select id="select-quarter-year" class="form-select font-mono" style="width: auto; padding: 6px 12px; font-size: 13px;">
            ${availableYears.map(y => `
              <option value="${y}" ${y === this.selectedQuarterYear ? 'selected' : ''}>ปี ${y}</option>
            `).join('')}
          </select>
        </div>
      </div>

      <div class="div-table-wrap">
        <table class="custom-table font-mono">
          <thead>
            <tr>
              <th style="font-family: var(--font-ui);">พอร์ตการลงทุน</th>
              <th>Q1 (31 มี.ค.)</th>
              <th>Q2 (30 มิ.ย.)</th>
              <th>Q3 (30 ก.ย.)</th>
              <th>Q4 (31 ธ.ค.)</th>
              <th>ล่าสุด ($)</th>
              <th>การเติบโต</th>
            </tr>
          </thead>
          <tbody>
    `;

    let totalQ1 = 0, totalQ2 = 0, totalQ3 = 0, totalQ4 = 0, totalCurrent = 0;

    this.portfolios.forEach(p => {
      const s = this.calculatePortfolioStats(p);
      const q1Val = q1Map[p.id] || 0;
      const q2Val = q2Map[p.id] || 0;
      const q3Val = q3Map[p.id] || 0;
      const q4Val = q4Map[p.id] || 0;

      totalQ1 += q1Val;
      totalQ2 += q2Val;
      totalQ3 += q3Val;
      totalQ4 += q4Val;
      totalCurrent += s.totalValueUSD;

      // Base value: earliest non-zero recorded quarter or current
      const baseVal = q1Val || q2Val || q3Val || q4Val || s.totalValueUSD;
      const diff = s.totalValueUSD - baseVal;
      const pct = baseVal > 0 ? (diff / baseVal) * 100 : 0;

      html += `
        <tr>
          <td style="font-family: var(--font-ui); font-weight: 700;">${p.emoji || '📁'} ${p.name}</td>
          <td>${q1Val > 0 ? this.formatUSD(q1Val) : `<span style="color:var(--text-muted);">-</span>`}</td>
          <td>${q2Val > 0 ? this.formatUSD(q2Val) : `<span style="color:var(--text-muted);">-</span>`}</td>
          <td>${q3Val > 0 ? this.formatUSD(q3Val) : `<span style="color:var(--text-muted);">-</span>`}</td>
          <td>${q4Val > 0 ? this.formatUSD(q4Val) : `<span style="color:var(--text-muted);">-</span>`}</td>
          <td class="font-bold text-white">${this.formatUSD(s.totalValueUSD)}</td>
          <td class="${pct >= 0 ? 'text-emerald' : 'text-rose'} font-bold">
            ${pct >= 0 ? '+' : ''}${this.formatUSD(diff)} (${this.formatPercent(pct)})
          </td>
        </tr>
      `;
    });

    // Forex & Option Trading Accounts Row in Quarterly view
    const { balances: tradingBalances } = this.getTradingLatestBalances();
    if (Object.keys(this.tradingData || {}).length > 0) {
      Object.keys(this.tradingData).forEach(accKey => {
        const acc = this.tradingData[accKey];
        const latestVal = tradingBalances[accKey] || 0;
        const q1Val = q1Map[accKey] || 0;
        const q2Val = q2Map[accKey] || 0;
        const q3Val = q3Map[accKey] || 0;
        const q4Val = q4Map[accKey] || 0;

        totalQ1 += q1Val;
        totalQ2 += q2Val;
        totalQ3 += q3Val;
        totalQ4 += q4Val;
        totalCurrent += latestVal;

        const baseVal = q1Val || q2Val || q3Val || q4Val || latestVal;
        const diff = latestVal - baseVal;
        const pct = baseVal > 0 ? (diff / baseVal) * 100 : 0;

        html += `
          <tr style="background: rgba(245, 158, 11, 0.02);">
            <td style="font-family: var(--font-ui); font-weight: 700; color: var(--color-amber);">📈 ${acc.name}</td>
            <td>${q1Val > 0 ? this.formatUSD(q1Val) : `<span style="color:var(--text-muted);">-</span>`}</td>
            <td>${q2Val > 0 ? this.formatUSD(q2Val) : `<span style="color:var(--text-muted);">-</span>`}</td>
            <td>${q3Val > 0 ? this.formatUSD(q3Val) : `<span style="color:var(--text-muted);">-</span>`}</td>
            <td>${q4Val > 0 ? this.formatUSD(q4Val) : `<span style="color:var(--text-muted);">-</span>`}</td>
            <td class="font-bold text-white">${this.formatUSD(latestVal)}</td>
            <td class="${pct >= 0 ? 'text-emerald' : 'text-rose'} font-bold">
              ${pct >= 0 ? '+' : ''}${this.formatUSD(diff)} (${this.formatPercent(pct)})
            </td>
          </tr>
        `;
      });
    }

    // Total Net Worth Summary Row
    const grandBaseVal = totalQ1 || totalQ2 || totalQ3 || totalQ4 || totalCurrent;
    const grandDiff = totalCurrent - grandBaseVal;
    const grandPct = grandBaseVal > 0 ? (grandDiff / grandBaseVal) * 100 : 0;

    html += `
          </tbody>
          <tfoot>
            <tr style="background: rgba(255,255,255,0.06); font-weight: 800; border-top: 2px solid var(--border-active);">
              <td style="font-family: var(--font-ui); color: #fff;">📊 รวมพอร์ตทั้งหมด (Grand Total)</td>
              <td>${totalQ1 > 0 ? this.formatUSD(totalQ1) : `<span style="color:var(--text-muted);">-</span>`}</td>
              <td>${totalQ2 > 0 ? this.formatUSD(totalQ2) : `<span style="color:var(--text-muted);">-</span>`}</td>
              <td>${totalQ3 > 0 ? this.formatUSD(totalQ3) : `<span style="color:var(--text-muted);">-</span>`}</td>
              <td>${totalQ4 > 0 ? this.formatUSD(totalQ4) : `<span style="color:var(--text-muted);">-</span>`}</td>
              <td class="text-emerald" style="font-size: 15px;">${this.formatUSD(totalCurrent)}</td>
              <td class="${grandPct >= 0 ? 'text-emerald' : 'text-rose'}" style="font-size: 15px;">
                ${grandPct >= 0 ? '+' : ''}${this.formatUSD(grandDiff)} (${this.formatPercent(grandPct)})
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- BENCHMARK COMPARISON CHART -->
      <div class="benchmark-card">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 14px;">
          <div>
            <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin: 0;">⚖️ เปรียบเทียบผลตอบแทนกับดัชนีตลาดโลก (Benchmark Comparison)</h3>
            <p style="font-size: 12px; color: var(--text-secondary); margin: 3px 0 0 0;">
              วัดประสิทธิภาพพอร์ตเทียบกับดัชนี S&P 500 (SPY/VOO) และตลาดหุ้นไทย (SET Index)
            </p>
          </div>
          <div class="benchmark-legend font-mono">
            <div class="benchmark-item"><span class="benchmark-color-dot" style="background: #a855f7;"></span> <strong>พอร์ตของคุณ (${grandPct >= 0 ? '+' : ''}${grandPct.toFixed(1)}%)</strong></div>
            <div class="benchmark-item"><span class="benchmark-color-dot" style="background: #10b981;"></span> S&P 500 (+9.8%)</div>
            <div class="benchmark-item"><span class="benchmark-color-dot" style="background: #38bdf8;"></span> SET Index (+3.2%)</div>
          </div>
        </div>

        <div class="chart-canvas-container" style="height: 280px;">
          <canvas id="chart-benchmark-comparison"></canvas>
        </div>
      </div>
    `;

    container.innerHTML = html;

    setTimeout(() => {
      this.initBenchmarkChart(grandPct);
    }, 50);
  }

  initBenchmarkChart(portfolioReturnPct) {
    const ctx = document.getElementById('chart-benchmark-comparison')?.getContext('2d');
    if (!ctx) return;

    const labels = ['Q1 (31 มี.ค.)', 'Q2 (30 มิ.ย.)', 'Q3 (30 ก.ย.)', 'Q4 (31 ธ.ค.)', 'ปัจจุบัน'];
    
    // Simulate gradual realistic trajectory leading to current return
    const currentVal = parseFloat(portfolioReturnPct) || 0;
    const portTrajectory = [0, currentVal * 0.25, currentVal * 0.55, currentVal * 0.85, currentVal];
    const sp500Trajectory = [0, 2.8, 5.4, 7.6, 9.8];
    const setTrajectory = [0, 0.8, -1.2, 1.5, 3.2];

    this.charts.benchmark = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'พอร์ตของคุณ (Portfolio %)',
            data: portTrajectory,
            borderColor: '#a855f7',
            backgroundColor: 'rgba(168, 85, 247, 0.15)',
            borderWidth: 3,
            fill: true,
            tension: 0.3
          },
          {
            label: 'S&P 500 Index (%)',
            data: sp500Trajectory,
            borderColor: '#10b981',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.3
          },
          {
            label: 'SET Index (%)',
            data: setTrajectory,
            borderColor: '#38bdf8',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [3, 3],
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (c) => ` ${c.dataset.label}: ${c.raw >= 0 ? '+' : ''}${c.raw.toFixed(2)}%`
            }
          }
        },
        scales: {
          y: {
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { color: '#64748b', callback: v => v + '%' }
          },
          x: {
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { color: '#94a3b8' }
          }
        }
      }
    });
  }

  takeQuarterlySnapshot() {
    const currentYear = new Date().getFullYear();
    const currentQuarter = 'Q' + Math.ceil((new Date().getMonth() + 1) / 3);
    const dateStr = new Date().toISOString().split('T')[0];

    const snapshot = this.createCurrentPortfolioSnapshot(currentYear, currentQuarter, dateStr, `Snapshot ${currentQuarter}/${currentYear}`);

    const idx = this.quarterlySnapshots.findIndex(q => q.year === currentYear && q.quarter === currentQuarter);
    if (idx >= 0) {
      this.quarterlySnapshots[idx] = snapshot;
    } else {
      this.quarterlySnapshots.push(snapshot);
    }

    this.saveData();
    this.renderActiveTab();
    alert(`📸 บันทึก Snapshot ไตรมาส ${currentQuarter}/${currentYear} เรียบร้อยแล้ว!`);
  }

  resetCurrentYearQuarterlySnapshots() {
    const year = this.selectedQuarterYear || new Date().getFullYear();
    if (confirm(`คุณต้องการล้างข้อมูล Snapshot ของปี ${year} แล้วเริ่มบันทึกใหม่ใช่หรือไม่?`)) {
      this.quarterlySnapshots = this.quarterlySnapshots.filter(q => q.year !== year);
      this.checkAndAutoRecordQuarterlySnapshots();
      this.saveData();
      this.renderActiveTab();
      alert(`🔄 เริ่มต้นบันทึกข้อมูลไตรมาสปี ${year} ใหม่เรียบร้อยแล้ว!`);
    }
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
              <div class="sim-input-row">
                <span class="sim-cur-symbol">$</span>
                <input type="number" id="sim-input-init" class="sim-number-input font-mono" min="0" max="500000" step="50" value="${initCapital}">
              </div>
            </div>
            <input type="range" min="0" max="50000" step="50" value="${initCapital}" class="sim-range-input" id="sim-slider-init">
            <div class="sim-sub-hint font-mono" id="sim-val-init">≈ ฿0</div>
          </div>

          <div class="sim-slider-group">
            <div class="sim-slider-header">
              <span class="sim-slider-label">เงินออมเติมพอร์ตต่อเดือน (Monthly DCA)</span>
              <div class="sim-input-row">
                <span class="sim-cur-symbol">$</span>
                <input type="number" id="sim-input-monthly" class="sim-number-input font-mono" min="0" max="10000" step="10" value="100">
              </div>
            </div>
            <input type="range" min="0" max="2000" step="10" value="100" class="sim-range-input" id="sim-slider-monthly">
            <div class="sim-sub-hint font-mono" id="sim-val-monthly">≈ ฿3,259 / เดือน</div>
          </div>

          <div class="sim-slider-group">
            <div class="sim-slider-header">
              <span class="sim-slider-label">ผลตอบแทนคาดหวังเฉลี่ยต่อปี (CAGR %)</span>
              <div class="sim-input-row">
                <input type="number" id="sim-input-cagr" class="sim-number-input font-mono" min="1" max="40" step="0.5" value="10">
                <span class="sim-cur-symbol">%</span>
              </div>
            </div>
            <input type="range" min="1" max="30" step="0.5" value="10" class="sim-range-input" id="sim-slider-cagr">
            <div class="sim-sub-hint font-mono" id="sim-val-cagr">10.0% / ปี</div>
          </div>

          <div class="sim-slider-group">
            <div class="sim-slider-header">
              <span class="sim-slider-label">ระยะเวลาลงทุน (Investment Horizon)</span>
              <div class="sim-input-row">
                <input type="number" id="sim-input-years" class="sim-number-input font-mono" min="1" max="50" step="1" value="10">
                <span class="sim-cur-symbol">ปี</span>
              </div>
            </div>
            <input type="range" min="1" max="40" step="1" value="10" class="sim-range-input" id="sim-slider-years">
            <div class="sim-sub-hint font-mono" id="sim-val-years">10 ปี</div>
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
      const input = document.getElementById(`sim-input-${key}`);

      slider?.addEventListener('input', (e) => {
        if (input) input.value = e.target.value;
        this.updateSimulatorChart();
      });

      input?.addEventListener('input', (e) => {
        if (slider) slider.value = e.target.value;
        this.updateSimulatorChart();
      });
    });

    document.getElementById('btn-trigger-celebrate-sim')?.addEventListener('click', () => {
      this.triggerCelebration();
    });
  }

  updateSimulatorChart() {
    const initCap = parseFloat(document.getElementById('sim-input-init')?.value) || parseFloat(document.getElementById('sim-slider-init')?.value) || 0;
    const monthly = parseFloat(document.getElementById('sim-input-monthly')?.value) || parseFloat(document.getElementById('sim-slider-monthly')?.value) || 0;
    const cagr = parseFloat(document.getElementById('sim-input-cagr')?.value) || parseFloat(document.getElementById('sim-slider-cagr')?.value) || 10;
    const years = parseInt(document.getElementById('sim-input-years')?.value) || parseInt(document.getElementById('sim-slider-years')?.value) || 10;

    // Update label text
    const initEl = document.getElementById('sim-val-init');
    if (initEl) initEl.textContent = `≈ ฿${Math.round(this.usdToThb(initCap)).toLocaleString()}`;
    const monthlyEl = document.getElementById('sim-val-monthly');
    if (monthlyEl) monthlyEl.textContent = `≈ ฿${Math.round(this.usdToThb(monthly)).toLocaleString()} / เดือน`;
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

  // --- COMMAND PALETTE & SPOTLIGHT SEARCH (CTRL + K) ---
  openCommandPalette() {
    this.openModal('modal-command-palette');
    const input = document.getElementById('command-search-input');
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 80);
    }
    this.renderCommandResults('');
  }

  renderCommandResults(query = '') {
    const listEl = document.getElementById('command-results-list');
    if (!listEl) return;

    const q = query.trim().toLowerCase();
    
    // 1. Stocks & Crypto Holdings
    const stockResults = [];
    this.portfolios.forEach(p => {
      (p.holdings || []).forEach(h => {
        const sym = h.ticker.toUpperCase();
        const name = (h.name || '').toLowerCase();
        const portName = (p.name || '').toLowerCase();
        if (!q || sym.toLowerCase().includes(q) || name.includes(q) || portName.includes(q)) {
          const stats = this.calculateHoldingStats(h);
          stockResults.push({
            type: 'stock',
            ticker: sym,
            name: h.name || h.ticker,
            portId: p.id,
            portName: p.name,
            portEmoji: p.emoji || '📁',
            marketValueUSD: stats.marketValueUSD,
            unrealizedPLPct: stats.unrealizedPLPct,
            currentPrice: stats.currentPrice,
            shares: stats.shares,
            color: p.color || '#10b981'
          });
        }
      });
    });

    // 2. Sub-Portfolios
    const portResults = [];
    this.portfolios.forEach(p => {
      const name = (p.name || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      const tier = (p.tier || '').toLowerCase();
      if (!q || name.includes(q) || cat.includes(q) || tier.includes(q)) {
        const stats = this.calculatePortfolioStats(p);
        portResults.push({
          type: 'portfolio',
          id: p.id,
          name: p.name,
          emoji: p.emoji || '📁',
          tier: p.tier,
          category: p.category,
          totalValueUSD: stats.totalValueUSD,
          holdingsCount: (p.holdings || []).length,
          color: p.color || '#10b981'
        });
      }
    });

    // 3. Navigation Views
    const navItems = [
      { id: 'dashboard', icon: '📊', title: 'แดชบอร์ดภาพรวม', sub: 'สรุปพอร์ตและเป้าหมายตาม IPS' },
      { id: 'portfolios', icon: '📁', title: 'แยกพอร์ต (Dime Holdings)', sub: 'จัดการสินทรัพย์หุ้นและเงินไว้ช้อน' },
      { id: 'trading', icon: '💱', title: 'Forex & Option Trading', sub: 'บันทึกยอดเงินพอร์ตเทรดกระแสเงินสด' },
      { id: 'dividends', icon: '💰', title: 'บันทึกเงินปันผล', sub: 'ประวัติรับปันผลและ Passive Income' },
      { id: 'simulator', icon: '🔮', title: 'จำลองเงินล้าน (Simulator)', sub: 'พลังดอกเบี้ยทบต้นและเป้าหมายสู่อิสรภาพ' },
      { id: 'quarterly', icon: '📈', title: 'เปรียบเทียบผลงานรายไตรมาส', sub: 'Snapshot Q1/Q2/Q3/Q4 และการเติบโต' },
      { id: 'obsidian', icon: '🤖', title: 'Obsidian & AI Second Brain', sub: 'ส่งออกรายงาน Markdown สำหรับ AI' },
      { id: 'settings', icon: '⚙️', title: 'ตั้งค่า & ฐานข้อมูล', sub: 'จัดการ Firebase และอัตราแลกเปลี่ยน' }
    ].filter(item => !q || item.title.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q));

    // 4. Quick Actions
    const actionItems = [
      { action: 'trade', icon: '➕', title: 'ซื้อ / ขายสินทรัพย์ (Quick Trade)', sub: 'บันทึกซื้อ-ขายหุ้นหรือตัดเงินไว้ช้อน' },
      { action: 'dca', icon: '⚖️', title: 'Smart DCA & Rebalance Calculator', sub: 'คำนวณแบ่งเงินซื้อหุ้นตามเป้าหมาย IPS' },
      { action: 'cash_buffer', icon: '💧', title: 'ฝาก / ถอนเงินไว้ช้อน (Cash Buffer)', sub: 'จัดการเงินสดสำรองรอช้อนซื้อ' },
      { action: 'reorder', icon: '↕️', title: 'จัดเรียงลำดับพอร์ต', sub: 'ปรับสลับลำดับการแสดงผลของพอร์ต' },
      { action: 'sync', icon: '🔄', title: 'อัปเดตราคาตลาดสด (Sync Market)', sub: 'ดึงราคาหุ้นและคริปโตล่าสุด' },
      { action: 'privacy', icon: '👁️', title: 'เปิด / ปิด Privacy Mode', sub: 'ซ่อน/แสดงตัวเลขทางการเงิน' }
    ].filter(item => !q || item.title.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q));

    let html = '';

    // Render Stocks Group
    if (stockResults.length > 0) {
      html += `<div class="command-group-title">📈 หุ้นและสินทรัพย์ (${stockResults.length})</div>`;
      html += stockResults.slice(0, 6).map(s => `
        <div class="command-item" data-cmd-type="stock" data-cmd-port="${s.portId}" data-cmd-ticker="${s.ticker}">
          <div class="command-item-left">
            ${this.renderStockLogoHTML(s.ticker, s.color, 32)}
            <div>
              <div class="command-item-title">${s.ticker} <span style="font-size:12px; font-weight:400; color:var(--text-secondary);">- ${s.name}</span></div>
              <div class="command-item-sub">${s.portEmoji} ${s.portName} • ${s.shares.toFixed(4)} หุ้น @ $${s.currentPrice.toFixed(2)}</div>
            </div>
          </div>
          <div class="command-item-right font-mono">
            <div style="text-align: right;">
              <strong style="color:#fff; font-size:13px;">${this.formatUSD(s.marketValueUSD)}</strong>
              <div style="font-size:11px;" class="${s.unrealizedPLPct >= 0 ? 'text-emerald' : 'text-rose'}">
                ${s.unrealizedPLPct >= 0 ? '+' : ''}${s.unrealizedPLPct.toFixed(2)}%
              </div>
            </div>
            <span class="command-item-tag">ดูพอร์ต ↵</span>
          </div>
        </div>
      `).join('');
    }

    // Render Portfolios Group
    if (portResults.length > 0) {
      html += `<div class="command-group-title">📁 พอร์ตการลงทุน (${portResults.length})</div>`;
      html += portResults.map(p => `
        <div class="command-item" data-cmd-type="portfolio" data-cmd-port="${p.id}">
          <div class="command-item-left">
            <div class="command-item-icon" style="font-size:24px;">${p.emoji}</div>
            <div>
              <div class="command-item-title">${p.name}</div>
              <div class="command-item-sub">${p.tier} • ${p.category} (${p.holdingsCount} สินทรัพย์)</div>
            </div>
          </div>
          <div class="command-item-right font-mono">
            <strong style="color:#fff; font-size:13px;">${this.formatUSD(p.totalValueUSD)}</strong>
            <span class="command-item-tag">เปิดพอร์ต ↵</span>
          </div>
        </div>
      `).join('');
    }

    // Render Actions Group
    if (actionItems.length > 0) {
      html += `<div class="command-group-title">⚡ การทำงานด่วน (Quick Actions)</div>`;
      html += actionItems.map(a => `
        <div class="command-item" data-cmd-type="action" data-cmd-action="${a.action}">
          <div class="command-item-left">
            <div class="command-item-icon" style="background:rgba(255,255,255,0.06); width:32px; height:32px; border-radius:var(--radius-sm);">${a.icon}</div>
            <div>
              <div class="command-item-title">${a.title}</div>
              <div class="command-item-sub">${a.sub}</div>
            </div>
          </div>
          <div class="command-item-right">
            <span class="command-item-tag">เรียกใช้ ↵</span>
          </div>
        </div>
      `).join('');
    }

    // Render Navigation Views Group
    if (navItems.length > 0) {
      html += `<div class="command-group-title">🧭 หน้าและเครื่องมือ</div>`;
      html += navItems.map(n => `
        <div class="command-item" data-cmd-type="nav" data-cmd-tab="${n.id}">
          <div class="command-item-left">
            <div class="command-item-icon" style="font-size:22px;">${n.icon}</div>
            <div>
              <div class="command-item-title">${n.title}</div>
              <div class="command-item-sub">${n.sub}</div>
            </div>
          </div>
          <div class="command-item-right">
            <span class="command-item-tag">สลับหน้า ↵</span>
          </div>
        </div>
      `).join('');
    }

    if (!html) {
      html = `<div style="text-align:center; padding:36px 16px; color:var(--text-muted);">
        <div style="font-size:32px; margin-bottom:8px;">🔍</div>
        <div>ไม่พบผลลัพธ์สำหรับ "<strong>${query}</strong>"</div>
        <div style="font-size:12px; margin-top:4px;">ลองค้นหาด้วยชื่อย่อหุ้น เช่น NVDA, หรือชื่อพอร์ต เช่น Next Gen</div>
      </div>`;
    }

    listEl.innerHTML = html;

    // Highlight first item
    const firstItem = listEl.querySelector('.command-item');
    if (firstItem) firstItem.classList.add('active');
  }

  executeCommandItem(itemEl) {
    if (!itemEl) return;
    const type = itemEl.getAttribute('data-cmd-type');

    if (type === 'stock') {
      const portId = itemEl.getAttribute('data-cmd-port');
      this.selectedPortfolioId = portId;
      this.switchTab('portfolios');
      this.closeModal('modal-command-palette');
    } else if (type === 'portfolio') {
      const portId = itemEl.getAttribute('data-cmd-port');
      this.selectedPortfolioId = portId;
      this.switchTab('portfolios');
      this.closeModal('modal-command-palette');
    } else if (type === 'nav') {
      const tab = itemEl.getAttribute('data-cmd-tab');
      this.switchTab(tab);
      this.closeModal('modal-command-palette');
    } else if (type === 'action') {
      const action = itemEl.getAttribute('data-cmd-action');
      this.closeModal('modal-command-palette');
      if (action === 'trade') {
        this.populateTradeStockSelect();
        this.openModal('modal-trade');
      } else if (action === 'dca') {
        this.openRebalanceModal();
      } else if (action === 'cash_buffer') {
        this.openCashBufferModal(this.selectedPortfolioId);
      } else if (action === 'reorder') {
        this.openReorderPortfoliosModal();
      } else if (action === 'sync') {
        this.syncLiveMarketPrices();
      } else if (action === 'privacy') {
        this.togglePrivacyMode();
      }
    }
  }

  setupCommandPaletteKeyboard() {
    // Global shortcut Ctrl+K / Cmd+K
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const modal = document.getElementById('modal-command-palette');
        if (modal && modal.classList.contains('open')) {
          this.closeModal('modal-command-palette');
        } else {
          this.openCommandPalette();
        }
      }
    });

    const searchInput = document.getElementById('command-search-input');
    const resultsList = document.getElementById('command-results-list');

    searchInput?.addEventListener('input', (e) => {
      this.renderCommandResults(e.target.value);
    });

    searchInput?.addEventListener('keydown', (e) => {
      const items = Array.from(resultsList.querySelectorAll('.command-item'));
      if (items.length === 0) return;

      const activeIdx = items.findIndex(item => item.classList.contains('active'));

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIdx = (activeIdx + 1) % items.length;
        items.forEach(i => i.classList.remove('active'));
        items[nextIdx].classList.add('active');
        items[nextIdx].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIdx = (activeIdx - 1 + items.length) % items.length;
        items.forEach(i => i.classList.remove('active'));
        items[prevIdx].classList.add('active');
        items[prevIdx].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const currentActive = items[activeIdx >= 0 ? activeIdx : 0];
        if (currentActive) {
          this.executeCommandItem(currentActive);
        }
      }
    });

    // Delegate click on command items
    resultsList?.addEventListener('click', (e) => {
      const item = e.target.closest('.command-item');
      if (item) {
        this.executeCommandItem(item);
      }
    });
  }

  // --- SUB-PORTFOLIO REORDERING SYSTEM ---
  openReorderPortfoliosModal() {
    this.renderReorderPortfoliosList();
    this.openModal('modal-reorder-portfolios');
  }

  renderReorderPortfoliosList() {
    const listEl = document.getElementById('reorder-portfolios-list');
    if (!listEl) return;

    listEl.innerHTML = this.portfolios.map((p, idx) => `
      <div class="reorder-list-item" draggable="true" data-index="${idx}" style="border-left: 4px solid ${p.color || '#10b981'};">
        <div class="reorder-item-left">
          <span class="reorder-drag-handle" title="ลากเพื่อสลับตำแหน่ง">⠿</span>
          <div>
            <div class="reorder-item-name">${p.emoji || '📁'} ${p.name}</div>
            <div class="reorder-item-sub">${p.tier} • ${p.category} (${(p.holdings || []).length} สินทรัพย์)</div>
          </div>
        </div>
        <div class="reorder-item-actions">
          <button type="button" class="btn btn-icon-xs btn-secondary" data-move-up="${idx}" ${idx === 0 ? 'disabled style="opacity:0.3;cursor:not-allowed;"' : ''} title="เลื่อนขึ้น">⬆️</button>
          <button type="button" class="btn btn-icon-xs btn-secondary" data-move-down="${idx}" ${idx === this.portfolios.length - 1 ? 'disabled style="opacity:0.3;cursor:not-allowed;"' : ''} title="เลื่อนลง">⬇️</button>
        </div>
      </div>
    `).join('');

    this.setupReorderDragAndDropEvents();
  }

  movePortfolioUp(index) {
    if (index <= 0 || index >= this.portfolios.length) return;
    const temp = this.portfolios[index];
    this.portfolios[index] = this.portfolios[index - 1];
    this.portfolios[index - 1] = temp;
    this.renderReorderPortfoliosList();
  }

  movePortfolioDown(index) {
    if (index < 0 || index >= this.portfolios.length - 1) return;
    const temp = this.portfolios[index];
    this.portfolios[index] = this.portfolios[index + 1];
    this.portfolios[index + 1] = temp;
    this.renderReorderPortfoliosList();
  }

  setupReorderDragAndDropEvents() {
    const listEl = document.getElementById('reorder-portfolios-list');
    if (!listEl) return;

    listEl.onclick = (e) => {
      const btnUp = e.target.closest('[data-move-up]');
      if (btnUp && !btnUp.disabled) {
        const idx = parseInt(btnUp.getAttribute('data-move-up'));
        this.movePortfolioUp(idx);
        return;
      }

      const btnDown = e.target.closest('[data-move-down]');
      if (btnDown && !btnDown.disabled) {
        const idx = parseInt(btnDown.getAttribute('data-move-down'));
        this.movePortfolioDown(idx);
        return;
      }
    };

    let dragSrcIndex = null;
    const items = listEl.querySelectorAll('.reorder-list-item');

    items.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        dragSrcIndex = parseInt(item.getAttribute('data-index'));
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', dragSrcIndex);
      });

      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
      });

      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      });

      item.addEventListener('drop', (e) => {
        e.preventDefault();
        const dropTargetIndex = parseInt(item.getAttribute('data-index'));
        if (dragSrcIndex !== null && dragSrcIndex !== dropTargetIndex) {
          const movedItem = this.portfolios.splice(dragSrcIndex, 1)[0];
          this.portfolios.splice(dropTargetIndex, 0, movedItem);
          this.renderReorderPortfoliosList();
        }
      });
    });
  }

  saveReorderedPortfolios() {
    this.saveData();
    this.closeModal('modal-reorder-portfolios');
    this.renderActiveTab();
    this.showToast({
      icon: '💾',
      title: 'บันทึกลำดับพอร์ตสำเร็จ!',
      message: 'ปรับลำดับการแสดงผลของพอร์ตเรียบร้อยแล้ว',
      type: 'success'
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
total_net_worth_usd: ${grand.grandTotalUSD.toFixed(2)}
total_net_worth_thb: ${grand.grandTotalTHB.toFixed(2)}
total_stocks_usd: ${grand.totalStocksUSD.toFixed(2)}
total_cash_buffer_usd: ${grand.totalCashBufferUSD.toFixed(2)}
total_trading_usd: ${grand.totalTradingUSD.toFixed(2)}
tags:
  - #Agent_Access
  - #Financial_Report
  - #${currentQuarter}_${currentYear}
  - #Portfolio_Tracking
  - #Data_Vault
---

# 📊 [[${currentQuarter}_${currentYear}]] Financial Review & AI Portfolio Analysis

**Financial Metadata & Macro Parameters**
* **Exported At:** ${isoDate}
* **Exchange Rate (THB/USD):** ฿${this.exchangeRate.toFixed(2)} / USD
* **Total Net Worth:** **${this.formatUSD(grand.grandTotalUSD)}** (≈ **${this.formatTHB(grand.grandTotalTHB)}**)
  * 📈 **Stock Holdings:** ${this.formatUSD(grand.totalStocksUSD)} (${((grand.totalStocksUSD / (grand.grandTotalUSD || 1)) * 100).toFixed(1)}%)
  * 💧 **Cash Buffer (เงินไว้ช้อน):** ${this.formatUSD(grand.totalCashBufferUSD)} (${((grand.totalCashBufferUSD / (grand.grandTotalUSD || 1)) * 100).toFixed(1)}%)
  * 💱 **Trading Capital:** ${this.formatUSD(grand.totalTradingUSD)} (${((grand.totalTradingUSD / (grand.grandTotalUSD || 1)) * 100).toFixed(1)}%)
* **Unrealized Stock P/L:** ${grand.totalPLUSD >= 0 ? '+' : ''}${this.formatUSD(grand.totalPLUSD)} (${grand.totalPLPct >= 0 ? '+' : ''}${grand.totalPLPct.toFixed(2)}%)
* **Average 1D Change:** ${grand.avg1dChangePct >= 0 ? '+' : ''}${grand.avg1dChangePct.toFixed(2)}%

---

## 💼 1. Goal-Based Portfolios Summary (เป้าหมายตาม IPS)

| # | Portfolio Name | Tier / Category | Target Goal (USD) | Target Goal (THB) | Current Value (USD) | Progress (%) | Cash Buffer (USD) | Strategy Notes |
| :-: | :--- | :--- | :-: | :-: | :-: | :-: | :-: | :--- |
`;

    this.portfolios.forEach((p, idx) => {
      const s = this.calculatePortfolioStats(p);
      md += `| ${idx + 1} | **[[${p.name}]]** | #${p.tier.replace(/\s+/g, '_')} #${p.category.replace(/\s+/g, '_')} | ${this.formatUSD(s.goalUSD)} | ${this.formatTHB(p.goalTHB || this.usdToThb(s.goalUSD))} | ${this.formatUSD(s.totalValueUSD)} | **${s.goalProgressPct.toFixed(1)}%** | ${this.formatUSD(s.cashBufferUSD)} | ${p.notes || '-'} |\n`;
    });

    // Trading rows
    for (const [key, item] of Object.entries(this.tradingData || {})) {
      const list = item.monthlyBalances || [];
      const latest = list.length > 0 ? list[list.length - 1].balanceUSD : 0;
      md += `| 💱 | **[[${item.name}]]** | #Trading #Forex_Option | - | - | ${this.formatUSD(latest)} | 100% | - | อัปเดตรายเดือน |\n`;
    }

    md += `\n---\n\n## 📈 2. Detailed Stock & Asset Holdings (รายการสินทรัพย์ทั้งหมด)\n\n`;
    md += `| Ticker | Company Name | Portfolio | Shares | Avg Cost ($) | Price ($) | Market Val ($) | Market Val (฿) | Unrealized P/L ($) | P/L (%) | Port Weight (%) | Dip Target ($) |\n`;
    md += `| :--- | :--- | :--- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |\n`;

    this.portfolios.forEach(p => {
      const pStats = this.calculatePortfolioStats(p);
      (p.holdings || []).forEach(h => {
        const s = this.calculateHoldingStats(h);
        if (s.shares > 0 || (p.holdings || []).length <= 6) {
          const weight = pStats.totalValueUSD > 0 ? ((s.marketValueUSD / pStats.totalValueUSD) * 100).toFixed(1) : '0.0';
          const plSign = s.unrealizedPLUSD >= 0 ? '+' : '';
          md += `| **[[${h.ticker}]]** | ${h.name || h.ticker} | ${p.name} | ${s.shares.toFixed(6)} | $${s.avgCost.toFixed(2)} | $${s.currentPrice.toFixed(2)} | ${this.formatUSD(s.marketValueUSD)} | ${this.formatTHB(s.marketValueTHB)} | ${plSign}${this.formatUSD(s.unrealizedPLUSD)} | ${plSign}${s.unrealizedPLPct.toFixed(2)}% | ${weight}% | ${h.dipTargetUSD ? '$' + h.dipTargetUSD.toFixed(2) : '-'} |\n`;
        }
      });
    });

    md += `\n---\n\n## 📊 3. Quarterly Snapshots (ประวัติผลงานรายไตรมาสปี ${currentYear})\n\n`;
    md += `| Portfolio | Q1 Value ($) | Q2 Value ($) | Q3 Value ($) | Q4 Value ($) | Current ($) |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n`;

    const q1Map = this.quarterlySnapshots.find(q => q.quarter === 'Q1')?.portValuesUSD || {};
    const q2Map = this.quarterlySnapshots.find(q => q.quarter === 'Q2')?.portValuesUSD || {};
    const q3Map = this.quarterlySnapshots.find(q => q.quarter === 'Q3')?.portValuesUSD || {};
    const q4Map = this.quarterlySnapshots.find(q => q.quarter === 'Q4')?.portValuesUSD || {};

    this.portfolios.forEach(p => {
      const s = this.calculatePortfolioStats(p);
      md += `| **[[${p.name}]]** | ${q1Map[p.id] ? this.formatUSD(q1Map[p.id]) : '-'} | ${q2Map[p.id] ? this.formatUSD(q2Map[p.id]) : '-'} | ${q3Map[p.id] ? this.formatUSD(q3Map[p.id]) : '-'} | ${q4Map[p.id] ? this.formatUSD(q4Map[p.id]) : '-'} | ${this.formatUSD(s.totalValueUSD)} |\n`;
    });

    md += `\n---\n\n## 📅 4. Monthly Trading Performance Records\n\n`;
    md += `| Period | Account / Strategy | Balance (USD) | Balance (THB) | Note |\n| :--- | :--- | :--- | :--- | :--- |\n`;

    for (const [key, item] of Object.entries(this.tradingData || {})) {
      (item.monthlyBalances || []).forEach(m => {
        md += `| **[[${m.year}-${String(m.month).padStart(2, '0')}]]** | [[${item.name}]] | ${this.formatUSD(m.balanceUSD)} | ${this.formatTHB(this.usdToThb(m.balanceUSD))} | ${m.note || '-'} |\n`;
      });
    }

    if (this.dividends && this.dividends.length > 0) {
      md += `\n---\n\n## 💰 5. Dividend Cash Flow History (ประวัติเงินปันผล)\n\n`;
      md += `| Date | Ticker | Portfolio | Gross ($) | Tax 15% ($) | Net ($) | Net (฿) | Notes |\n| :--- | :--- | :--- | :-: | :-: | :-: | :-: | :--- |\n`;
      this.dividends.forEach(d => {
        const p = this.portfolios.find(x => x.id === d.portfolioId);
        md += `| ${d.date} | **[[${d.ticker}]]** | ${p ? p.name : '-'} | ${this.formatUSD(d.grossUSD)} | ${this.formatUSD(d.taxUSD)} | **${this.formatUSD(d.netUSD)}** | ${this.formatTHB(this.usdToThb(d.netUSD))} | ${d.notes || '-'} |\n`;
      });
    }

    md += `\n---\n\n## 🧠 6. AI Prompt Directives for Financial Advisor\n\n`;
    md += `> **Instruction for AI / Financial Agent:**\n`;
    md += `> 1. วิเคราะห์สุขภาพทางการเงินโดยรวม (Financial Health & Risk Profile) ตามแผน IPS\n`;
    md += `> 2. ประเมินการกระจายความเสี่ยง (Asset Allocation) หุ้นตัวใด Overweight หรือ Underweight เกินไป\n`;
    md += `> 3. ให้คำแนะนำการเติมเงิน DCA ในเดือนถัดไป (Smart Rebalance Priority)\n`;
    md += `> 4. ประเมินจุดช้อน (Buy-the-Dip Targets) และความคุ้มค่าของการถือ Cash Buffer\n`;

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

    // Command Palette & Spotlight Search Trigger
    document.getElementById('btn-open-command-palette')?.addEventListener('click', () => this.openCommandPalette());
    this.setupCommandPaletteKeyboard();

    // Sidebar Toggle & Pin Buttons
    document.getElementById('btn-toggle-sidebar')?.addEventListener('click', () => this.toggleSidebar());
    document.getElementById('btn-pin-sidebar')?.addEventListener('click', () => this.toggleSidebar());

    // Privacy Mode Toggle Button
    document.getElementById('btn-toggle-privacy')?.addEventListener('click', () => this.togglePrivacyMode());

    // Reorder Portfolios Modal & Save Button
    document.getElementById('btn-open-reorder-modal')?.addEventListener('click', () => this.openReorderPortfoliosModal());
    document.getElementById('btn-save-reorder-portfolios')?.addEventListener('click', () => this.saveReorderedPortfolios());

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

      // Open Reorder Modal
      if (target.id === 'btn-open-reorder-modal') {
        this.openReorderPortfoliosModal();
        return;
      }

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
          this.showToast({
            icon: '💾',
            title: 'บันทึกยอดเงินสำเร็จ!',
            message: `${this.tradingData[key].name}: $${val.toFixed(2)} (${this.formatTHB(this.usdToThb(val))})`,
            type: 'success'
          });
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
          this.showToast({
            icon: '🗑️',
            title: 'ลบรายการปันผลแล้ว',
            type: 'info'
          });
        }
        return;
      }

      // Take Quarterly Snapshot
      if (target.id === 'btn-take-quarter-snapshot') {
        this.takeQuarterlySnapshot();
        return;
      }

      // Reset Quarterly Snapshots for selected year
      if (target.id === 'btn-reset-quarter-data') {
        this.resetCurrentYearQuarterlySnapshots();
        return;
      }

      // Copy Obsidian Markdown
      if (target.id === 'btn-copy-obsidian-md') {
        const md = this.generateObsidianMarkdown();
        navigator.clipboard.writeText(md).then(() => {
          this.showToast({
            icon: '📋',
            title: 'คัดลอก Markdown สำเร็จ!',
            message: 'นำไปวางใน Obsidian หรือ AI Prompt ได้ทันที',
            type: 'info'
          });
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

    // Change events inside view container
    container?.addEventListener('change', (e) => {
      // Quarter Year Change
      if (e.target.id === 'select-quarter-year') {
        this.selectedQuarterYear = parseInt(e.target.value);
        this.renderActiveTab();
        return;
      }

      // JSON Backup Import
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

    // Update Header title
    const titleMap = {
      dashboard: 'แดชบอร์ดภาพรวม',
      portfolios: 'แยกพอร์ต (Dime Holdings)',
      trading: 'Forex & Option Trading',
      dividends: 'บันทึกเงินปันผลรับ (Dividend Log)',
      simulator: 'จำลองเงินล้าน & ดอกเบี้ยทบต้น',
      quarterly: 'เปรียบเทียบผลงานรายไตรมาส',
      obsidian: 'Obsidian & AI Second Brain',
      settings: 'ตั้งค่าระบบ & ฐานข้อมูล'
    };

    const titleEl = document.getElementById('current-page-title');
    if (titleEl) titleEl.textContent = titleMap[tabName] || titleMap.dashboard;

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

    // Cash Buffer Live Two-Way USD <-> THB Converter
    document.getElementById('cash-amount-usd')?.addEventListener('input', (e) => {
      const usdVal = parseFloat(e.target.value);
      const thbEl = document.getElementById('cash-amount-thb');
      if (thbEl) {
        if (!isNaN(usdVal) && usdVal > 0) {
          thbEl.value = (usdVal * this.exchangeRate).toFixed(2);
        } else if (e.target.value === '') {
          thbEl.value = '';
        }
      }
    });

    document.getElementById('cash-amount-thb')?.addEventListener('input', (e) => {
      const thbVal = parseFloat(e.target.value);
      const usdEl = document.getElementById('cash-amount-usd');
      if (usdEl) {
        if (!isNaN(thbVal) && thbVal > 0) {
          usdEl.value = (thbVal / this.exchangeRate).toFixed(2);
        } else if (e.target.value === '') {
          usdEl.value = '';
        }
      }
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

    // Custom Financial Achievement Form Submit & Delete
    document.getElementById('form-achievement')?.addEventListener('submit', (e) => {
      this.saveAchievementFromForm(e);
    });

    document.getElementById('btn-delete-achievement')?.addEventListener('click', (e) => {
      e.preventDefault();
      const id = document.getElementById('achievement-id')?.value;
      this.deleteAchievement(id);
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
        document.getElementById('holding-shares').value = h.shares !== undefined && h.shares !== null ? h.shares : '';
        document.getElementById('holding-avg-cost').value = h.avgCostUSD !== undefined && h.avgCostUSD !== null ? h.avgCostUSD : '';
        document.getElementById('holding-current-price').value = (h.currentPriceUSD !== undefined && h.currentPriceUSD !== null && h.currentPriceUSD > 0) ? Number(parseFloat(h.currentPriceUSD).toFixed(3)) : (h.avgCostUSD || '');
        document.getElementById('holding-1d-change').value = (h.change1dPct !== undefined && h.change1dPct !== null) ? Number(parseFloat(h.change1dPct).toFixed(2)) : '';
        
        // Populate 3-Tier Dip Targets
        const target1 = h.dipTarget1 !== undefined && h.dipTarget1 !== null ? h.dipTarget1 : (h.dipTargetUSD || '');
        const target2 = h.dipTarget2 !== undefined && h.dipTarget2 !== null ? h.dipTarget2 : '';
        const target3 = h.dipTarget3 !== undefined && h.dipTarget3 !== null ? h.dipTarget3 : '';

        const dt1 = document.getElementById('holding-dip-target-1');
        const dt2 = document.getElementById('holding-dip-target-2');
        const dt3 = document.getElementById('holding-dip-target-3');
        if (dt1) dt1.value = target1;
        if (dt2) dt2.value = target2;
        if (dt3) dt3.value = target3;
        
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
      document.getElementById('holding-shares').value = '';
      document.getElementById('holding-avg-cost').value = '';
      document.getElementById('holding-current-price').value = '';
      document.getElementById('holding-1d-change').value = '';
      const dt1 = document.getElementById('holding-dip-target-1');
      const dt2 = document.getElementById('holding-dip-target-2');
      const dt3 = document.getElementById('holding-dip-target-3');
      if (dt1) dt1.value = '';
      if (dt2) dt2.value = '';
      if (dt3) dt3.value = '';
      document.getElementById('holding-name').removeAttribute('data-autofilled');
      if (portSelect) portSelect.value = portfolioId || this.selectedPortfolioId;
      this.updateHoldingTickerPreview('');
      deleteBtn?.classList.add('hidden');
    }

    this.openModal('modal-holding');
  }

  saveHoldingForm() {
    const portId = document.getElementById('holding-portfolio-id')?.value;
    const holdingId = document.getElementById('holding-id')?.value;
    const ticker = (document.getElementById('holding-ticker')?.value || '').trim().toUpperCase();
    const name = (document.getElementById('holding-name')?.value || ticker).trim();

    let originalHolding = null;
    if (holdingId) {
      this.portfolios.forEach(p => {
        const found = p.holdings?.find(h => h.id === holdingId);
        if (found) originalHolding = found;
      });
    }

    const rawShares = parseFloat(document.getElementById('holding-shares')?.value);
    const rawAvgCost = parseFloat(document.getElementById('holding-avg-cost')?.value);
    const rawCurrentPrice = parseFloat(document.getElementById('holding-current-price')?.value);
    const raw1dChange = parseFloat(document.getElementById('holding-1d-change')?.value);

    const shares = !isNaN(rawShares) && rawShares >= 0 ? rawShares : (originalHolding?.shares || 0);
    const avgCostUSD = !isNaN(rawAvgCost) && rawAvgCost > 0 ? rawAvgCost : (originalHolding?.avgCostUSD || 0);
    const currentPriceUSD = !isNaN(rawCurrentPrice) && rawCurrentPrice > 0 ? rawCurrentPrice : (originalHolding?.currentPriceUSD || avgCostUSD);
    const change1dPct = !isNaN(raw1dChange) ? raw1dChange : (originalHolding?.change1dPct || 0);

    const dip1Val = parseFloat(document.getElementById('holding-dip-target-1')?.value);
    const dip2Val = parseFloat(document.getElementById('holding-dip-target-2')?.value);
    const dip3Val = parseFloat(document.getElementById('holding-dip-target-3')?.value);

    const dipTarget1 = !isNaN(dip1Val) && dip1Val > 0 ? dip1Val : null;
    const dipTarget2 = !isNaN(dip2Val) && dip2Val > 0 ? dip2Val : null;
    const dipTarget3 = !isNaN(dip3Val) && dip3Val > 0 ? dip3Val : null;
    const dipTargetUSD = dipTarget1; // For backward compatibility

    if (!ticker) {
      alert('กรุณาระบุสัญลักษณ์หุ้น (Ticker)');
      return;
    }

    const targetPort = this.portfolios.find(p => p.id === portId);
    if (!targetPort) {
      alert('ไม่พบพอร์ตการลงทุนที่เลือก');
      return;
    }

    if (!targetPort.holdings) targetPort.holdings = [];

    // Safely remove existing holding across all portfolios (to support moving across portfolios)
    if (holdingId) {
      this.portfolios.forEach(p => {
        if (p.holdings) {
          p.holdings = p.holdings.filter(h => h.id !== holdingId);
        }
      });
    }

    const finalHolding = {
      id: holdingId || ('h-' + Date.now()),
      ticker,
      name,
      shares,
      avgCostUSD,
      currentPriceUSD,
      change1dPct,
      dipTargetUSD,
      dipTarget1,
      dipTarget2,
      dipTarget3
    };

    targetPort.holdings.push(finalHolding);

    this.saveData();
    this.closeModal('modal-holding');
    this.renderActiveTab();
    
    // Check if price reached dip targets immediately
    this.checkSingleHoldingDipAlert(finalHolding);

    this.showToast({
      icon: '💾',
      title: 'บันทึกสินทรัพย์สำเร็จ!',
      message: `${ticker} (${name}) • บันทึกเป้าหมายช้อนเรียบร้อย`,
      type: 'success'
    });
  }

  checkSingleHoldingDipAlert(h) {
    const price = h.currentPriceUSD || 0;
    if (price <= 0) return;

    const hits = [];
    if (h.dipTarget3 && price <= h.dipTarget3) {
      hits.push(`ไม้ 3 ($${h.dipTarget3})`);
    } else if (h.dipTarget2 && price <= h.dipTarget2) {
      hits.push(`ไม้ 2 ($${h.dipTarget2})`);
    } else if (h.dipTarget1 && price <= h.dipTarget1) {
      hits.push(`ไม้ 1 ($${h.dipTarget1})`);
    } else if (h.dipTargetUSD && price <= h.dipTargetUSD) {
      hits.push(`$${h.dipTargetUSD}`);
    }

    if (hits.length > 0) {
      this.showToast({
        icon: '🎯',
        title: `🔥 [${h.ticker}] ราคาถึงจุดช้อนแล้ว!`,
        message: `ราคาตลาดปัจจุบัน $${price.toFixed(2)} ถึงแนวรับ ${hits.join(', ')}`,
        type: 'warning',
        duration: 6000
      });
    }
  }

  checkAllDipPriceAlerts() {
    let triggeredCount = 0;
    this.portfolios.forEach(p => {
      (p.holdings || []).forEach(h => {
        const price = h.currentPriceUSD || 0;
        if (price <= 0) return;

        const dip1 = h.dipTarget1 || h.dipTargetUSD || 0;
        const dip2 = h.dipTarget2 || 0;
        const dip3 = h.dipTarget3 || 0;

        if ((dip1 > 0 && price <= dip1) || (dip2 > 0 && price <= dip2) || (dip3 > 0 && price <= dip3)) {
          triggeredCount++;
        }
      });
    });

    if (triggeredCount > 0) {
      this.showToast({
        icon: '🎯',
        title: `🔥 พบ ${triggeredCount} สินทรัพย์ถึงจุดเล็งช้อน!`,
        message: 'ราคาตลาดลงมาแตะแนวรับที่คุณตั้งไว้ เปิดดูได้ในแท็บแยกพอร์ต',
        type: 'warning',
        duration: 6000
      });
    }
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

      this.showToast({
        icon: '🟢',
        title: 'ซื้อหุ้นสำเร็จ!',
        message: `ซื้อ ${h.ticker} จำนวน ${tradeShares} หุ้น (ต้นทุนเฉลี่ยใหม่: $${newAvgCost.toFixed(4)})`,
        type: 'success'
      });
    } else {
      // SELL
      if ((h.shares || 0) < tradeShares) {
        this.showToast({
          icon: '⚠️',
          title: 'มีหุ้นไม่พอขาย!',
          message: `มี ${h.shares} หุ้น แต่ต้องการขาย ${tradeShares} หุ้น`,
          type: 'error'
        });
        return;
      }

      h.shares = Math.max(0, (h.shares || 0) - tradeShares);
      if (useCashBuffer) {
        port.cashBufferUSD = (port.cashBufferUSD || 0) + tradeTotalUSD;
      }

      this.showToast({
        icon: '🔴',
        title: 'ขายหุ้นสำเร็จ!',
        message: `ขาย ${h.ticker} จำนวน ${tradeShares} หุ้น ได้เงิน $${tradeTotalUSD.toFixed(2)}`,
        type: 'success'
      });
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
    let amount = parseFloat(document.getElementById('cash-amount-usd').value);

    // Fallback to calculate from THB if USD was blank
    if (isNaN(amount) || amount <= 0) {
      const thbVal = parseFloat(document.getElementById('cash-amount-thb').value);
      if (!isNaN(thbVal) && thbVal > 0) {
        amount = thbVal / this.exchangeRate;
      } else {
        amount = 0;
      }
    }

    if (amount <= 0 && action !== 'SET') {
      this.showToast({
        icon: '⚠️',
        title: 'กรุณาระบุจำนวนเงิน',
        type: 'error'
      });
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
    this.renderActiveTab();
    this.showToast({
      icon: '💧',
      title: 'อัปเดตเงินไว้ช้อนสำเร็จ!',
      message: `พอร์ต ${port.name}: $${(port.cashBufferUSD || 0).toFixed(2)} (${this.formatTHB(this.usdToThb(port.cashBufferUSD || 0))})`,
      type: 'success'
    });
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
    this.showToast({
      icon: '💰',
      title: 'บันทึกเงินปันผลสำเร็จ!',
      message: `${ticker}: Net $${netUSD.toFixed(2)} (${this.formatTHB(this.usdToThb(netUSD))})`,
      type: 'success'
    });
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
            this.showToast({
              icon: '🗑️',
              title: 'ลบพอร์ตแล้ว',
              message: `ลบพอร์ต ${port.name} เรียบร้อย`,
              type: 'info'
            });
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
    this.showToast({
      icon: '💾',
      title: 'บันทึกพอร์ตสำเร็จ!',
      message: `ข้อมูลพอร์ต ${name} ได้รับการอัปเดตแล้ว`,
      type: 'success'
    });
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