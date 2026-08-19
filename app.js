/* ==========================================
   PIXEL STEWARD CORE ENGINE - APP.JS (V.3.3.0)
   Fixed: Dashboard & Forex Black Screen (Render Container Fix),
          Auto Quarterly Snapshot Engine 100%,
          Sub-Asset Inline Editor (Dime Sync)
   ========================================== */

// ⏰ 1. RETRO TIME SYSTEM ENGINE
class TimeSystemEngine {
  constructor() {
    this.imgElement = document.getElementById('time-scene-img');
    this.badgeElement = document.getElementById('time-badge-label');
    this.clockElement = document.getElementById('time-clock-display');
    this.init();
  }

  init() {
    this.updateTimeSystem();
    setInterval(() => this.updateTimeSystem(), 1000);
  }

  getTimeState(hours) {
    if (hours >= 6 && hours < 12) {
      return { label: '🌅 MORNING', imgSrc: './assets/time/morning.png' };
    } else if (hours >= 12 && hours < 17) {
      return { label: '☀️ AFTERNOON', imgSrc: './assets/time/afternoon.png' };
    } else if (hours >= 17 && hours < 20) {
      return { label: '🌆 EVENING', imgSrc: './assets/time/evening.png' };
    } else {
      return { label: '🌙 NIGHT', imgSrc: './assets/time/night.png' };
    }
  }

  updateTimeSystem() {
    const now = new Date();
    const hours = now.getHours();
    const timeState = this.getTimeState(hours);

    if (this.imgElement && !this.imgElement.src.endsWith(timeState.imgSrc)) {
      this.imgElement.src = timeState.imgSrc;
    }
    if (this.badgeElement && this.badgeElement.innerText !== timeState.label) {
      this.badgeElement.innerText = timeState.label;
    }

    if (this.clockElement) {
      this.clockElement.innerText = now.toLocaleTimeString('en-US', { hour12: false });
    }
  }
}

// 🔥 2. FIREBASE REALTIME CLOUD CONFIGURATION
const firebaseConfig = {
  apiKey: "AIzaSyD-FLJd2vKaFX-2F8kzE87inrmGEH5pyzY",
  authDomain: "pixel-steward-db.firebaseapp.com",
  databaseURL: "https://pixel-steward-db-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pixel-steward-db",
  storageBucket: "pixel-steward-db.firebasestorage.app",
  messagingSenderId: "36576321084",
  appId: "1:36576321084:web:315c61237093e616e06d39"
};

let isFirebaseActive = false;
if (typeof firebase !== 'undefined' && firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
  try {
    if (!firebase.apps || firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
    }
    isFirebaseActive = true;
  } catch (e) {
    console.error("Firebase Sync Connection Failed:", e);
  }
}

/* ==========================================================================
   🏰 PIXEL STEWARD MAIN APPLICATION CLASS
   ========================================================================== */
const INITIAL_PORTFOLIOS = [
  { 
    id: 'p-redwing', name: 'RedWing (กยศ.)', category: 'Life Goal', goalType: 'numeric', goal: 8000, goalSchedule: '', current: 0, cashBuffer: 0, dryPowder: 0, assets: [], notes: '', dcaDoneThisMonth: false 
  },
  { 
    id: 'p-zero1', name: 'Zero 1 (เงินฉุกเฉิน)', category: 'Emergency Fund', goalType: 'numeric', goal: 2740, goalSchedule: '', current: 1096, cashBuffer: 0, dryPowder: 0, assets: [
      { name: 'KEPT', shares: 1, costPrice: 1096, costBasis: 1096, currentPrice: 1096, value: 1096, targetPct: 40 },
      { name: 'V', shares: 0.0026955, costPrice: 309.968, costBasis: 0.84, currentPrice: 359.42, value: 0.97, targetPct: 20 },
      { name: 'MSFT', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 430, value: 0, targetPct: 15 },
      { name: 'WMT', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 68, value: 0, targetPct: 12.5 },
      { name: 'TISCO', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 3.42, value: 0, targetPct: 12.5 }
    ], notes: '', dcaDoneThisMonth: false 
  },
  { 
    id: 'p-zero2', name: 'Zero 2 (พอร์ตซื้อรถ)', category: 'Global Stock', goalType: 'numeric', goal: 32876, goalSchedule: '', current: 13, cashBuffer: 6575, dryPowder: 0, assets: [
      { name: 'NEE', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 75, value: 0, targetPct: 25 },
      { name: 'ABT', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 110, value: 0, targetPct: 15 },
      { name: 'NVDA', shares: 0.065108, costPrice: 199.6858, costBasis: 13.00, currentPrice: 199.6858, value: 13.00, targetPct: 15 },
      { name: 'TMO', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 550, value: 0, targetPct: 10 },
      { name: 'JPM', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 210, value: 0, targetPct: 10 },
      { name: 'PLTR', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 28, value: 0, targetPct: 5 }
    ], notes: '', dcaDoneThisMonth: false 
  },
  { 
    id: 'p-zero4', name: 'Zero 4 (พอร์ตแต่งงาน)', category: 'Global Stock', goalType: 'numeric', goal: 16438, goalSchedule: '', current: 0, cashBuffer: 4931, dryPowder: 0, assets: [
      { name: 'COST', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 850, value: 0, targetPct: 14 },
      { name: 'LLY', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 880, value: 0, targetPct: 14 },
      { name: 'UNH', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 560, value: 0, targetPct: 14 },
      { name: 'HD', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 370, value: 0, targetPct: 14 },
      { name: 'MCD', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 290, value: 0, targetPct: 14 }
    ], notes: '', dcaDoneThisMonth: false 
  },
  { 
    id: 'p-zero3', name: 'Zero 3 (พอร์ตเกษียณ 37 ปี)', category: 'Global Stock', goalType: 'numeric', goal: 109589, goalSchedule: '', current: 0, cashBuffer: 0, dryPowder: 0, assets: [
      { name: 'GOOGL', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 175, value: 0, targetPct: 20 },
      { name: 'TSLA', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 210, value: 0, targetPct: 20 },
      { name: 'AMZN', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 180, value: 0, targetPct: 15 },
      { name: 'CRWD', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 260, value: 0, targetPct: 10 },
      { name: 'ABBV', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 190, value: 0, targetPct: 10 },
      { name: 'SMR', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 10, value: 0, targetPct: 6 },
      { name: 'ETN', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 310, value: 0, targetPct: 6 },
      { name: 'RKLB', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 6.5, value: 0, targetPct: 5 },
      { name: 'กอช.', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 1, value: 0, targetPct: 3 }
    ], notes: '', dcaDoneThisMonth: false 
  },
  { 
    id: 'p-zero5', name: 'Zero 5 (พอร์ตซื้อบ้าน)', category: 'Global Stock', goalType: 'numeric', goal: 41095, goalSchedule: '', current: 0, cashBuffer: 8219, dryPowder: 0, assets: [
      { name: 'TSM', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 170, value: 0, targetPct: 20 },
      { name: 'ASML', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 840, value: 0, targetPct: 15 },
      { name: 'LMT', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 560, value: 0, targetPct: 15 },
      { name: 'SPGI', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 510, value: 0, targetPct: 12 },
      { name: 'BWXT', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 105, value: 0, targetPct: 10 },
      { name: 'AMD', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 140, value: 0, targetPct: 8 }
    ], notes: '', dcaDoneThisMonth: false 
  },
  { 
    id: 'p-divyield', name: 'US Dividend Yield', category: 'Global Stock', goalType: 'numeric', goal: 8219, goalSchedule: '', current: 0, cashBuffer: 0, dryPowder: 0, assets: [
      { name: 'PG', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 170, value: 0, targetPct: 25 },
      { name: 'KO', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 68, value: 0, targetPct: 25 },
      { name: 'O', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 60, value: 0, targetPct: 20 },
      { name: 'AVGO', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 160, value: 0, targetPct: 15 },
      { name: 'CVX', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 145, value: 0, targetPct: 15 }
    ], notes: '', dcaDoneThisMonth: false 
  },
  { 
    id: 'p-thaidiv', name: 'THAI Dividend', category: 'THAI Dividend', goalType: 'numeric', goal: 2740, goalSchedule: '', current: 0, cashBuffer: 0, dryPowder: 0, assets: [
      { name: 'ADVANC', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 7, value: 0, targetPct: 25 },
      { name: 'SCB', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 3, value: 0, targetPct: 20 },
      { name: 'PTT', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 0.9, value: 0, targetPct: 20 },
      { name: 'DIF', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 0.25, value: 0, targetPct: 20 },
      { name: 'WHART', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 0.26, value: 0, targetPct: 15 }
    ], notes: '', dcaDoneThisMonth: false 
  },
  { 
    id: 'p-nextgen', name: 'NEXT GEN', category: 'Global Stock', goalType: 'numeric', goal: 15000, goalSchedule: '', current: 0, cashBuffer: 0, dryPowder: 0, assets: [
      { name: 'DE', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 360, value: 0, targetPct: 20 },
      { name: 'GEV', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 175, value: 0, targetPct: 20 },
      { name: 'ISRG', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 460, value: 0, targetPct: 20 },
      { name: 'NU', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 13, value: 0, targetPct: 20 },
      { name: 'VOO', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 500, value: 0, targetPct: 20 }
    ], notes: '', dcaDoneThisMonth: false 
  },
  { 
    id: 'p-crypto', name: 'Crypto', category: 'Crypto', goalType: 'numeric', goal: 6000, goalSchedule: '', current: 0, cashBuffer: 0, dryPowder: 0, assets: [], notes: '', dcaDoneThisMonth: false 
  }
];
const INITIAL_QUARTERLY_RECORDS = [];
const INITIAL_MONTHLY_RECORDS = [];

const DEFAULT_ACHIEVEMENTS = [
  { id: 'ach-networth', title: '🌟 First $10,000 Net Worth', desc: 'มูลค่าคลังทรัพย์สินรวมสะสมบรรลุ $10,000', completed: false },
  { id: 'ach-debtfree', title: '⚔️ Debt-Free Hero (ปลดหนี้กยศ.)', desc: 'ปลดภาระหนี้กยศ. ครบถ้วน ยอดคงเหลือเป็น $0 / ฿0', completed: false },
  { id: 'ach-dca365', title: '📅 365-Day DCA Master', desc: 'รักษาวินัยการลงทุน DCA ต่อเนื่องสม่ำเสมอครบ 1 ปี', completed: false },
  { id: 'ach-collector', title: '💎 Treasure Collector', desc: 'สะสมสินทรัพย์ย่อยในตลับพอร์ตมากกว่า 5 รายการขึ้นไป', completed: false },
  { id: 'ach-quest', title: '🎯 First Quest Cleared', desc: 'พอร์ตการลงทุนบรรลุเป้าหมายที่ตั้งไว้ 100%', completed: false },
  { id: 'ach-master', title: '🏆 Master Steward', desc: 'มูลค่าคลังรวมทุกพอร์ตเกิน $50,000 ขึ้นไป', completed: false }
];

class PixelStewardApp {
  constructor() {
    this.portfolios = [];
    this.quarterlyRecords = [];
    this.monthlyRecords = [];
    this.dividendRecords = [];
    this.exchangeRate = 36.5;
    this.activeTab = 'dashboard';
    this.selectedPortId = '';
    this.isPrivacyMode = localStorage.getItem('ps_privacy_mode_v23') === 'true';
    this.debtStartTHB = 0;
    this.debtRemainingTHB = 0;
    this.quarterlyViewYear = new Date().getFullYear();
    this.quarterlyViewMode = localStorage.getItem('ps_quarterly_view_mode_v4') || 'card';
    this.pendingClearQuarterly = null;
    this.subAssetSortOption = 'default';
    this.achievements = this.loadAchievements();
    
    this.init();
  }

  isPortfolioUSD(category) {
    if (!category) return false;
    const cat = category.toLowerCase();
    return cat.includes('option') || 
           cat.includes('global') || 
           cat.includes('growth') || 
           cat.includes('foreign') ||
           cat.includes('ต่างประเทศ') ||
           cat.includes('next gen') || 
           cat.includes('nextgen') ||
           cat.includes('crypto');
  }

  formatMoney(valUSD, category, showBoth = true) {
    if (this.isPrivacyMode) {
      return `<span class="pixel-money pixel-money-masked">$***,***</span>` +
             (showBoth ? ` <span style="font-size:0.75rem; color:#94a3b8; font-family:'Kanit', sans-serif;">(฿***,***)</span>` : '');
    }
    const usdNum = Number(valUSD || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    let html = `<span class="pixel-money">$${usdNum}</span>`;
    if (showBoth) {
      const thbVal = (Number(valUSD || 0) * this.exchangeRate).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      html += ` <span style="font-size:0.75rem; color:#94a3b8; font-family:'Kanit', sans-serif;">(฿${thbVal})</span>`;
    }
    return html;
  }

  getTickerLogoHtml(assetName, category) {
    let rawSymbol = (assetName || '').trim().toUpperCase().split(' ')[0];
    if (!rawSymbol) return `<span class="card-title-icon">📦</span>`;
    
    let cleanTicker = rawSymbol;
    let isThai = false;
    const thaiTickers = ['PTT', 'CPALL', 'BDMS', 'KBANK', 'SCB', 'AOT', 'ADVANC', 'DELTA', 'SCC', 'CPN', 'GULF', 'OR', 'TRUE', 'BANPU', 'MINT'];
    if (thaiTickers.includes(cleanTicker) || cleanTicker.endsWith('.BK')) {
      isThai = true;
      cleanTicker = cleanTicker.replace('.BK', '');
    }

    const primaryUrl = `https://assets.parqet.com/logos/symbol/${cleanTicker}`;
    const secondaryUrl = isThai 
      ? `https://financialmodelingprep.com/image-stock/${cleanTicker}.BK.png`
      : `https://financialmodelingprep.com/image-stock/${cleanTicker}.png`;
    const defaultIconUrl = this.getCategoryIconPath(category);

    return `<img src="${primaryUrl}" class="ticker-logo-img" 
              onerror="this.onerror=null; this.src='${secondaryUrl}'; this.onerror=function(){this.src='${defaultIconUrl}';}" alt="${cleanTicker}">`;
  }

  getCategoryIconPath(category) {
    const cat = (category || '').toLowerCase();
    if (cat.includes('option')) return './assets/icons/icon-daimon.png';
    if (cat.includes('emergency') || cat.includes('ฉุกเฉิน')) return './assets/icons/icon-shield.png';
    if (cat.includes('retirement') || cat.includes('เกษียณ') || cat.includes('dca')) return './assets/icons/icon-piggy-bank.png';
    if (cat.includes('dividend') || cat.includes('ปันผล') || cat.includes('asset')) return './assets/icons/icon-money-bag.png';
    return './assets/icons/icon-briefcase.png';
  }

  init() {
    this.timeEngine = new TimeSystemEngine();

    const storedPorts = localStorage.getItem('ps_portfolios_v4');
    const storedQuarters = localStorage.getItem('ps_quarterly_v4');
    const storedMonthlies = localStorage.getItem('ps_monthly_v4');
    const storedDividends = localStorage.getItem('ps_dividends_v4');
    const storedRate = localStorage.getItem('ps_ex_rate_v4');
    const storedDebtStart = localStorage.getItem('ps_debt_start_v4');
    const storedDebtRemaining = localStorage.getItem('ps_debt_remaining_v4');

    this.portfolios = storedPorts ? JSON.parse(storedPorts) : INITIAL_PORTFOLIOS;
    this.quarterlyRecords = storedQuarters ? JSON.parse(storedQuarters) : INITIAL_QUARTERLY_RECORDS;
    
    // Clean 2026 Q1 and Q2 test data as requested by user to start tracking officially from Q3 2026
    if (Array.isArray(this.quarterlyRecords)) {
      this.quarterlyRecords.forEach(r => {
        if (r && (r.year === 2026 || r.year === '2026')) {
          r.q1 = 0; r.f1 = 0; r.flowQ1 = 0;
          r.q2 = 0; r.f2 = 0; r.flowQ2 = 0;
        }
      });
    }

    this.monthlyRecords = storedMonthlies ? JSON.parse(storedMonthlies) : INITIAL_MONTHLY_RECORDS;
    this.dividendRecords = storedDividends ? JSON.parse(storedDividends) : [];
    this.exchangeRate = storedRate ? Number(storedRate) : 36.5;
    this.debtStartTHB = storedDebtStart ? Number(storedDebtStart) : 0;
    this.debtRemainingTHB = storedDebtRemaining ? Number(storedDebtRemaining) : 0;

    // Auto-clean duplicate sub-assets if any exist in storage
    if (Array.isArray(this.portfolios)) {
      this.portfolios.forEach(p => {
        if (p && Array.isArray(p.assets)) {
          const uniqueMap = new Map();
          p.assets.forEach(a => {
            if (a && a.name) {
              const key = a.name.trim().toUpperCase();
              if (!uniqueMap.has(key)) {
                uniqueMap.set(key, a);
              } else {
                const prev = uniqueMap.get(key);
                if ((Number(a.shares) || 0) > (Number(prev.shares) || 0) || (Number(a.value) || 0) > (Number(prev.value) || 0)) {
                  uniqueMap.set(key, a);
                }
              }
            }
          });
          p.assets = Array.from(uniqueMap.values());
        }
      });
    }

    if (Array.isArray(this.portfolios) && this.portfolios.length > 0 && !this.selectedPortId) {
      this.selectedPortId = this.portfolios[0].id;
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(err => console.warn('PWA SW Register:', err));
    }

    this.connectCloudDatabase();
    this.updatePrivacyBtnState();

    document.addEventListener('click', (e) => {
      if (e.target.closest('.btn-close-modal') || e.target.classList.contains('modal-overlay')) {
        this.closeModals();
        return;
      }

      const trophyBtn = e.target.closest('#btn-open-achievements');
      if (trophyBtn) {
        this.openAchievementModal();
        return;
      }

      const refreshRateBtn = e.target.closest('#btn-refresh-rate');
      if (refreshRateBtn) {
        this.manualRefreshExchangeRate();
        return;
      }

      const addCustomAchBtn = e.target.closest('#btn-add-custom-achievement');
      if (addCustomAchBtn) {
        const input = document.getElementById('new-achievement-title');
        if (input && input.value) {
          this.addCustomAchievement(input.value);
          input.value = '';
        }
        return;
      }

      const privacyBtn = e.target.closest('#btn-toggle-privacy');
      if (privacyBtn) {
        this.isPrivacyMode = !this.isPrivacyMode;
        localStorage.setItem('ps_privacy_mode_v23', this.isPrivacyMode ? 'true' : 'false');
        this.updatePrivacyBtnState();
        this.refreshUI();
        return;
      }

      const livePriceBtn = e.target.closest('#btn-fetch-live-prices');
      if (livePriceBtn) {
        this.fetchLivePrices();
        return;
      }

      if (e.target.closest('#btn-open-converter')) {
        this.openCurrencyConverterModal();
        return;
      }

      const navItem = e.target.closest('.nav-menu .nav-item');
      if (navItem) {
        document.querySelectorAll('.nav-menu .nav-item').forEach(n => n.classList.remove('active'));
        navItem.classList.add('active');
        this.activeTab = navItem.dataset.tab;
        this.refreshUI();
        return;
      }

      const addAssetBtn = e.target.closest('#btn-add-asset');
      if (addAssetBtn) {
        let active = this.portfolios.find(p => p.id === this.selectedPortId);
        if (!active && this.portfolios.length > 0) active = this.portfolios[0];
        if (!active) { alert('❌ โปรดเพิ่มตลับพอร์ตหลักก่อนจัดการสินทรัพย์ย่อยครับ'); return; }
        this.openAssetAddModal(active.id);
        return;
      }

      if (e.target.closest('#btn-add-portfolio') || e.target.closest('.memory-card-add-new')) {
        this.openPortfolioModal();
        return;
      }

      if (e.target.closest('#btn-quick-transfer')) {
        this.openTransferModal();
        return;
      }

      if (e.target.closest('#btn-open-rebalance')) {
        this.openRebalanceModal();
        return;
      }

      if (e.target.closest('#btn-open-compound')) {
        this.openCompoundModal();
        return;
      }

      if (e.target.closest('#btn-apply-rebalance')) {
        this.applyRebalancePlan();
        return;
      }

      if (e.target.closest('#btn-manual-pull-cloud')) {
        this.pullDataFromCloudManual();
        return;
      }

      if (e.target.closest('#btn-copy-sync-code')) {
        this.copyInstantSyncCode();
        return;
      }

      if (e.target.closest('#btn-import-sync-code')) {
        this.importInstantSyncCode();
        return;
      }
    });

    const goalTypeSelect = document.getElementById('port-goal-type');
    if (goalTypeSelect) {
      goalTypeSelect.addEventListener('change', () => {
        const valInput = document.getElementById('port-goal-value');
        const schInput = document.getElementById('port-goal-schedule');
        const label = document.getElementById('port-goal-label');
        if (goalTypeSelect.value === 'numeric') {
          label.innerText = 'เป้าหมายเงินสะสม ($ USD):';
          valInput.classList.remove('hidden'); schInput.classList.add('hidden');
        } else {
          label.innerText = 'เป้าหมายแผนวินัย DCA:';
          valInput.classList.add('hidden'); schInput.classList.remove('hidden');
        }
      });
    }

    const portForm = document.getElementById('portfolio-form');
    if(portForm) portForm.addEventListener('submit', (e) => { e.preventDefault(); this.handleSavePortfolio(); });
    const transForm = document.getElementById('transfer-form');
    if(transForm) transForm.addEventListener('submit', (e) => { e.preventDefault(); this.handleExecuteTransfer(); });
    const quarterlyForm = document.getElementById('quarterly-form');
    if (quarterlyForm) quarterlyForm.addEventListener('submit', (e) => { e.preventDefault(); this.handleSaveQuarterly(); });
    const divForm = document.getElementById('dividend-form');
    if (divForm) divForm.addEventListener('submit', (e) => { e.preventDefault(); this.handleSaveDividend(); });
    const assetEditForm = document.getElementById('asset-edit-form');
    if (assetEditForm) assetEditForm.addEventListener('submit', (e) => { e.preventDefault(); this.handleSaveAssetEdit(); });
    const cashEditForm = document.getElementById('cash-edit-form');
    if (cashEditForm) cashEditForm.addEventListener('submit', (e) => { e.preventDefault(); this.handleSaveCashEdit(e); });
    const btnSaveCash = document.getElementById('btn-save-cash-edit');
    if (btnSaveCash) btnSaveCash.addEventListener('click', (e) => { e.preventDefault(); this.handleSaveCashEdit(e); });

    const assetAddForm = document.getElementById('asset-add-form');
    if (assetAddForm) assetAddForm.addEventListener('submit', (e) => { e.preventDefault(); this.handleSaveAssetAdd(e); });

    const globalRateInput = document.getElementById('global-usd-rate');
    if (globalRateInput) {
      globalRateInput.value = this.exchangeRate.toFixed(2);
      globalRateInput.addEventListener('change', (e) => {
        const val = Number(e.target.value);
        if (val > 0) {
          this.exchangeRate = val;
          this.saveState();
          this.refreshUI();
        }
      });
      globalRateInput.addEventListener('input', (e) => {
        const val = Number(e.target.value);
        if (val > 0) {
          this.exchangeRate = val;
          this.saveState();
        }
      });
    }

    // 🇹🇭 THB ➔ USD Helper Box in Portfolio Modal
    const thbHelperInput = document.getElementById('port-thb-helper-input');
    const thbHelperPreview = document.getElementById('port-thb-helper-preview');
    const btnFillBuffer = document.getElementById('btn-fill-cash-buffer-from-thb');

    if (thbHelperInput) {
      thbHelperInput.addEventListener('input', (e) => {
        const thbVal = Number(e.target.value) || 0;
        const rate = this.exchangeRate || 33.16;
        const usdVal = thbVal > 0 ? (thbVal / rate) : 0;
        if (thbHelperPreview) {
          thbHelperPreview.textContent = `≈ $${usdVal.toFixed(2)} USD (@${rate.toFixed(2)} ฿/$)`;
        }
      });
    }

    if (btnFillBuffer) {
      btnFillBuffer.addEventListener('click', () => {
        const thbVal = Number(document.getElementById('port-thb-helper-input')?.value) || 0;
        const rate = this.exchangeRate || 33.16;
        const usdVal = thbVal > 0 ? (thbVal / rate) : 0;
        const cashBufferInput = document.getElementById('port-cash-buffer');
        if (cashBufferInput) {
          cashBufferInput.value = usdVal.toFixed(2);
          this.showRetroToast(`🇹🇭 เติมช่องเงินสดสำรอง: $${usdVal.toFixed(2)} USD (จาก ฿${thbVal.toLocaleString()}) เรียบร้อย!`, "success");
        }
      });
    }

    // 🧮 Standalone THB ↔ USD Converter Modal Inputs
    const calcThb = document.getElementById('calc-thb-input');
    const calcUsd = document.getElementById('calc-usd-input');
    const calcRes = document.getElementById('calc-result-text');

    if (calcThb) {
      calcThb.addEventListener('input', (e) => {
        const thb = Number(e.target.value) || 0;
        const rate = this.exchangeRate || 33.16;
        const usd = thb > 0 ? (thb / rate) : 0;
        if (calcUsd) calcUsd.value = usd > 0 ? usd.toFixed(2) : '';
        if (calcRes) calcRes.textContent = `${thb.toLocaleString()} บาท = $${usd.toFixed(2)} USD`;
      });
    }

    if (calcUsd) {
      calcUsd.addEventListener('input', (e) => {
        const usd = Number(e.target.value) || 0;
        const rate = this.exchangeRate || 33.16;
        const thb = usd * rate;
        if (calcThb) calcThb.value = thb > 0 ? thb.toFixed(2) : '';
        if (calcRes) calcRes.textContent = `$${usd.toLocaleString()} USD = ${thb.toLocaleString(undefined, {maximumFractionDigits:2})} บาท`;
      });
    }

    this.fetchRateOnLoad();
    this.autoSnapshotQuarterly();
    this.refreshUI();
  }

  /* 🤖 AUTO QUARTERLY SNAPSHOT ENGINE 100% */
  autoSnapshotQuarterly() {
    if (!Array.isArray(this.portfolios) || this.portfolios.length === 0) return;
    
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    
    let targetQuarterField = '';
    let targetYear = year;
    
    if (month >= 1 && month <= 3) {
      targetQuarterField = 'q4';
      targetYear = year - 1;
    } else if (month >= 4 && month <= 6) {
      targetQuarterField = 'q1';
    } else if (month >= 7 && month <= 9) {
      targetQuarterField = 'q2';
    } else if (month >= 10 && month <= 12) {
      targetQuarterField = 'q3';
    }

    // Skip auto-snapshotting Q1 and Q2 for 2026 since user starts tracking from Q3 2026
    if (targetYear === 2026 && (targetQuarterField === 'q1' || targetQuarterField === 'q2')) {
      return;
    }

    let autoSnapCount = 0;
    const stockPorts = this.portfolios.filter(p => p && (p.category || '').toLowerCase() !== 'option');

    stockPorts.forEach(p => {
      let rec = this.quarterlyRecords.find(r => r && r.portfolioId === p.id && r.year === targetYear);
      if (!rec) {
        rec = { id: 'q-' + Date.now() + '-' + Math.random().toString(36).slice(2, 5), portfolioId: p.id, year: targetYear, q1: 0, f1: 0, q2: 0, f2: 0, q3: 0, f3: 0, q4: 0, f4: 0, notes: 'Auto-Snapshot' };
        this.quarterlyRecords.push(rec);
      }

      if (!rec[targetQuarterField] || rec[targetQuarterField] === 0) {
        const currentValUSD = (p.current || 0) + (p.cashBuffer || 0);
        if (currentValUSD > 0) {
          rec[targetQuarterField] = currentValUSD;
          autoSnapCount++;
        }
      }
    });

    if (autoSnapCount > 0) {
      this.saveState();
    }
  }

  async fetchRateOnLoad() {
    const API_KEY = "ef6e99ffeeaacd06b19c0d2a";
    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("API Offline");
      const data = await response.json();
      const rate = Number(data.conversion_rates.THB);
      if (rate > 0) {
        this.exchangeRate = rate;
        const rateInput = document.getElementById('global-usd-rate');
        if (rateInput) rateInput.value = rate.toFixed(2);
        localStorage.setItem('ps_ex_rate_v4', this.exchangeRate.toString());
      }
    } catch (error) { console.warn("⚠️ API Mode ค้างชั่วคราว:", error); }
  }

  async manualRefreshExchangeRate() {
    const btn = document.getElementById('btn-refresh-rate');
    if (btn) btn.disabled = true;
    const API_KEY = "ef6e99ffeeaacd06b19c0d2a";
    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("API Offline");
      const data = await response.json();
      const rate = Number(data.conversion_rates.THB);
      if (rate > 0) {
        this.exchangeRate = rate;
        const rateInput = document.getElementById('global-usd-rate');
        if (rateInput) rateInput.value = rate.toFixed(2);
        this.saveState();
        this.refreshUI();
        alert(`⚡ ดึงอัตราแลกเปลี่ยนล่าสุดสำเร็จ: ${rate.toFixed(2)} THB/USD`);
      } else {
        alert("⚠️ ไม่พบข้อมูลอัตราแลกเปลี่ยน THB จาก API");
      }
    } catch (error) {
      console.warn("⚠️ API Refresh Error:", error);
      alert("⚠️ ไม่สามารถดึงค่าอัตราแลกเปลี่ยนได้ในขณะนี้ กรุณากรอกตัวเลขเองหรือลองใหม่ในภายหลัง");
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  applyCloudDataSnapshot(data) {
    if (!data) return;
    if (data.portfolios) {
      this.portfolios = Array.isArray(data.portfolios) ? data.portfolios : Object.values(data.portfolios);
      localStorage.setItem('ps_portfolios_v4', JSON.stringify(this.portfolios));
    }
    if (data.quarterlyRecords) {
      this.quarterlyRecords = Array.isArray(data.quarterlyRecords) ? data.quarterlyRecords : Object.values(data.quarterlyRecords);
      localStorage.setItem('ps_quarterly_v4', JSON.stringify(this.quarterlyRecords));
    }
    if (data.monthlyRecords) {
      this.monthlyRecords = Array.isArray(data.monthlyRecords) ? data.monthlyRecords : Object.values(data.monthlyRecords);
      localStorage.setItem('ps_monthly_v4', JSON.stringify(this.monthlyRecords));
    }
    if (data.dividendRecords) {
      this.dividendRecords = Array.isArray(data.dividendRecords) ? data.dividendRecords : Object.values(data.dividendRecords);
      localStorage.setItem('ps_dividends_v4', JSON.stringify(this.dividendRecords));
    }
    if (data.exchangeRate) {
      this.exchangeRate = Number(data.exchangeRate) || this.exchangeRate;
      localStorage.setItem('ps_ex_rate_v4', this.exchangeRate.toString());
    }
    if (typeof data.debtStartTHB === 'number') {
      this.debtStartTHB = data.debtStartTHB;
      localStorage.setItem('ps_debt_start_v4', this.debtStartTHB.toString());
    }
    if (typeof data.debtRemainingTHB === 'number') {
      this.debtRemainingTHB = data.debtRemainingTHB;
      localStorage.setItem('ps_debt_remaining_v4', this.debtRemainingTHB.toString());
    }
    if (data.achievements) {
      this.achievements = Array.isArray(data.achievements) ? data.achievements : Object.values(data.achievements);
      localStorage.setItem('ps_achievements_v4', JSON.stringify(this.achievements));
    }

    if (this.portfolios && this.portfolios.length > 0 && !this.selectedPortId) {
      this.selectedPortId = this.portfolios[0].id;
    }
    this.refreshUI();
  }

  async pullDataFromCloudManual() {
    if (!isFirebaseActive) {
      alert("⚠️ ระบบ Firebase Cloud ไม่ได้เปิดใช้งานอยู่ หรือออฟไลน์");
      return;
    }
    const btn = document.getElementById('btn-manual-pull-cloud');
    if (btn) btn.innerText = "⏳ กำลังดึง...";

    const nodes = ['pixel_steward_data_v4', 'pixel_steward_data', 'pixel_steward_data_v3', 'data'];
    let success = false;
    let lastError = null;

    for (const nodeName of nodes) {
      try {
        const snapshot = await firebase.database().ref(nodeName).once('value');
        const data = snapshot.val();
        if (data && data.portfolios) {
          this.applyCloudDataSnapshot(data);
          this.showRetroToast(`☁️ ดึงข้อมูลล่าสุดจาก Cloud (${nodeName}) เรียบร้อยแล้ว!`, "success");
          success = true;
          break;
        }
      } catch (err) {
        lastError = err;
      }
    }

    if (!success) {
      if (lastError && (lastError.message.includes('permission_denied') || lastError.code === 'PERMISSION_DENIED')) {
        const modal = document.getElementById('firebase-fix-modal');
        if (modal) modal.classList.remove('hidden');
        else alert("⚠️ สิทธิ์ Firebase Rules ถูกล็อก (Permission Denied)\n\nกรุณาตั้งค่า Rules บน Firebase Console เป็น {\".read\": true, \".write\": true}\nหรือใช้วิธี '📋 คัดลอกรหัสซิงค์' ส่งไปเปิดบนมือถือได้เลยครับ!");
      } else {
        alert("❌ ดึงข้อมูลไม่สำเร็จ: " + (lastError ? lastError.message : "ไม่พบข้อมูลบน Cloud"));
      }
    }

    if (btn) btn.innerHTML = "<span>📥 ดึงข้อมูล Cloud</span>";
  }

  copyInstantSyncCode() {
    try {
      const payload = {
        portfolios: this.portfolios,
        quarterlyRecords: this.quarterlyRecords,
        monthlyRecords: this.monthlyRecords,
        dividendRecords: this.dividendRecords,
        exchangeRate: this.exchangeRate,
        debtStartTHB: this.debtStartTHB,
        debtRemainingTHB: this.debtRemainingTHB,
        achievements: this.achievements
      };

      const jsonStr = JSON.stringify(payload);
      const b64 = btoa(encodeURIComponent(jsonStr));

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(b64).then(() => {
          alert("📋 คัดลอกรหัสซิงค์ด่วนเรียบร้อยแล้ว!\n\nส่งรหัสนี้ไปวางบนมือถือ (หรือส่งเข้า Line/Messenger) แล้วกด '📥 วางรหัสซิงค์' บนมือถือได้ทันทีครับ!");
        }).catch(() => {
          prompt("📋 รหัสซิงค์ด่วนของคุณ (คัดลอกทั้งหมดนี้ไปวางบนมือถือ):", b64);
        });
      } else {
        prompt("📋 รหัสซิงค์ด่วนของคุณ (คัดลอกทั้งหมดนี้ไปวางบนมือถือ):", b64);
      }
    } catch (err) {
      alert("❌ สร้างรหัสซิงค์ไม่สำเร็จ: " + err.message);
    }
  }

  importInstantSyncCode() {
    const input = prompt("📥 วางรหัสซิงค์ด่วน (Sync Code) ที่คัดลอกจาก PC หรือมือถือที่นี่:");
    if (!input || !input.trim()) return;

    try {
      const jsonStr = decodeURIComponent(atob(input.trim()));
      const data = JSON.parse(jsonStr);
      if (data) {
        this.applyCloudDataSnapshot(data);
        this.syncStateToCloud();
        alert("🎉 ซิงค์ข้อมูลสำเร็จ 100%! ข้อมูลทั้งหมดบน PC ถูกนำมาอัปเดตบนเครื่องนี้เรียบร้อยแล้ว");
      } else {
        alert("❌ รหัสซิงค์ไม่ถูกต้อง");
      }
    } catch (err) {
      alert("❌ รูปแบบรหัสซิงค์ไม่ถูกต้อง: " + err.message);
    }
  }

  connectCloudDatabase() {
    if (!isFirebaseActive) return;
    try {
      const nodes = ['pixel_steward_data_v4', 'pixel_steward_data', 'pixel_steward_data_v3'];
      nodes.forEach(nodeName => {
        firebase.database().ref(nodeName).once('value').then((snapshot) => {
          if (snapshot.exists() && snapshot.val()) {
            this.applyCloudDataSnapshot(snapshot.val());
          }
        }).catch(err => console.warn(`Initial cloud snapshot notice (${nodeName}):`, err));

        firebase.database().ref(nodeName).on('value', (snapshot) => {
          const data = snapshot.val();
          if (data) {
            this.applyCloudDataSnapshot(data);
          }
        }, (error) => {
          console.warn(`⚠️ Firebase sync read notice (${nodeName}):`, error);
        });
      });
    } catch (e) {
      console.warn("Firebase connect error:", e);
    }
  }

  syncStateToCloud() {
    if (!isFirebaseActive) return;
    try {
      const payload = {
        portfolios: this.portfolios, 
        quarterlyRecords: this.quarterlyRecords,
        monthlyRecords: this.monthlyRecords, 
        dividendRecords: this.dividendRecords, 
        exchangeRate: this.exchangeRate,
        debtStartTHB: this.debtStartTHB, 
        debtRemainingTHB: this.debtRemainingTHB
      };

      const nodes = ['pixel_steward_data_v4', 'pixel_steward_data'];
      nodes.forEach(nodeName => {
        firebase.database().ref(nodeName).set(payload).catch(err => {
          console.warn(`⚠️ Firebase sync write notice (${nodeName}):`, err);
        });
      });
    } catch (e) {
      console.error("Firebase sync write failed:", e);
    }
  }

  autoCalculatePortfolios() {
    if (!Array.isArray(this.portfolios)) return;
    this.portfolios.forEach(p => {
      if (!p) return;
      const cat = (p.category || '').toLowerCase();
      if (cat.includes('option')) {
        const records = Array.isArray(this.monthlyRecords) ? this.monthlyRecords.filter(r => r && r.portfolioId === p.id) : [];
        p.current = records.reduce((sum, r) => sum + (Number(r.profitLossUSD) || 0), 0);
      } else {
        p.current = Array.isArray(p.assets) ? p.assets.reduce((sum, asset) => sum + (Number(asset.value) || 0), 0) : 0;
      }
      if (typeof p.cashBuffer !== 'number') p.cashBuffer = 0;
    });
  }

  saveState() {
    this.autoCalculatePortfolios();
    localStorage.setItem('ps_portfolios_v4', JSON.stringify(this.portfolios));
    localStorage.setItem('ps_quarterly_v4', JSON.stringify(this.quarterlyRecords));
    localStorage.setItem('ps_monthly_v4', JSON.stringify(this.monthlyRecords));
    localStorage.setItem('ps_dividends_v4', JSON.stringify(this.dividendRecords));
    localStorage.setItem('ps_ex_rate_v4', this.exchangeRate.toString());
    localStorage.setItem('ps_debt_start_v4', this.debtStartTHB.toString());
    localStorage.setItem('ps_debt_remaining_v4', this.debtRemainingTHB.toString());
    this.syncStateToCloud();
  }

  getCalculations() {
    this.autoCalculatePortfolios();
    let totalUSD = 0, totalCashBufferUSD = 0, totalDryPowderUSD = 0;
    if (Array.isArray(this.portfolios)) {
      this.portfolios.forEach(p => {
        if (!p) return;
        totalUSD += (p.current || 0);
        totalCashBufferUSD += (p.cashBuffer || 0);
        totalDryPowderUSD += (p.dryPowder || 0);
      });
    }
    const netWorthUSD = totalUSD + totalCashBufferUSD + totalDryPowderUSD;
    const netWorthTHB = netWorthUSD * this.exchangeRate;
    return { netWorthUSD, netWorthTHB, totalUSD, totalCashBufferUSD, totalDryPowderUSD };
  }

  getPortfolioLevel(p) {
    if (!p) return { icon: '⏳', label: 'N/A', desc: '', pct: 0 };
    if (p.goalType === 'schedule') return { icon: p.dcaDoneThisMonth ? '🔥' : '⏳', label: 'ดีซีเอสายวินัย', desc: 'รักษาวินัยเควส DCA สม่ำเสมอ', pct: p.dcaDoneThisMonth ? 100 : 0 };
    const pct = p.goal > 0 ? ((p.current + p.cashBuffer) / p.goal) * 100 : 0;
    const n = (p.name || '').toLowerCase();
    if (n.includes('บ้าน') || n.includes('house')) return pct >= 80 ? { icon: '🏰', label: 'วิหารทองคำ', desc: 'สกินขอบทองขั้นสูงสุดยอด!', pct } : pct >= 40 ? { icon: '🏡', label: 'บ้านโมเดิร์น', desc: 'ฐานรากมั่นคง คอนกรีตเสริมเหล็ก', pct } : { icon: '⛺', label: 'กระต๊อบ', desc: 'เพิ่งตั้งหลักเข็มเสร็จเลเวล 1', pct };
    if (n.includes('รถ') || n.includes('car')) return pct >= 80 ? { icon: '🏎️', label: 'ซูเปอร์คาร์', desc: 'ซิ่งแซงหน้าความจน!', pct } : pct >= 40 ? { icon: '🚗', label: 'รถเก๋ง', desc: 'เดินทางอุ่นใจสไตล์ครอบครัว', pct } : { icon: '🚲', label: 'จักรยาน', desc: 'เริ่มปั่นชิวสะสมไมล์', pct };
    if (pct >= 80) return { icon: '⚔️', label: 'มหาอัศวินขุมทรัพย์', desc: 'กองทัพการเงินมีกำลังมหาศาล!', pct };
    if (pct >= 40) return { icon: '🛡️', label: 'นักรบพิทักษ์เหรียญ', desc: 'มีโล่ป้องกัน ความเสี่ยงลดลง', pct };
    return { icon: '🐣', label: 'มอนสเตอร์เลเวล 1', desc: 'กำลังฝึกฝนวิทยายุทธ์ฟาร์มเงินสด', pct };
  }

  getNextRankPreview(p) {
    if (!p) return '';
    if (p.goalType === 'schedule') return `🔮 เควส: ทำ DCA ประจำงวดให้ตรงปฏิทิน`;
    const pct = p.goal > 0 ? ((p.current + p.cashBuffer) / p.goal) * 100 : 0;
    if (pct >= 80) return `🏆 เลเวลสูงสุดขอบทองแล้ว!`;
    const targetPct = pct < 40 ? 40 : 80;
    const needed = ((targetPct / 100) * p.goal) - (p.current + p.cashBuffer);
    return `🔮 เลเวลอัปขั้นถัดไป: ขาดอีกประมาณ $${needed.toLocaleString(undefined,{maximumFractionDigits:0})}`;
  }

  getMeloAvatarState(score) {
    if (score >= 90) return { imgSrc: './assets/avatar/avatar-excited.png', text: '🤩 พอร์ตสเกลสุดยอด มหาอัศวิน!', cls: 'color:#3b82f6;' };
    if (score >= 70) return { imgSrc: './assets/avatar/avatar-happy.png', text: '🙂 พอร์ตกำลังเติบโตสมบูรณ์ดี!', cls: 'color:#10b981;' };
    if (score >= 40) return { imgSrc: './assets/avatar/avatar-normal.png', text: '😐 พอร์ตเสถียร รักษาวินัยต่อ!', cls: 'color:#eab308;' };
    return { imgSrc: './assets/avatar/avatar-concerned.png', text: '😟 วิกฤต! เติมเสบียงด่วน', cls: 'color:#ef4444;' };
  }

  /* 📊 DASHBOARD RENDERER */
  renderDashboard(container) {
    const calc = this.getCalculations();
    const topGoals = Array.isArray(this.portfolios) ? this.portfolios.filter(p => p && p.goalType === 'numeric' && p.goal > 0).map(p => ({ name: p.name, pct: ((p.current + p.cashBuffer) / p.goal) * 100 })).sort((a, b) => b.pct - a.pct).slice(0, 3) : [];
    const yr = new Date().getFullYear();
    let q1 = 0, q2 = 0, q3 = 0, q4 = 0;
    if (Array.isArray(this.quarterlyRecords)) {
      this.quarterlyRecords.filter(r => r && r.year === yr).forEach(r => {
        q1 += (r.q1||0); q2 += (r.q2||0); q3 += (r.q3||0); q4 += (r.q4||0);
      });
    }
    const maxQ = Math.max(q1, q2, q3, q4, 1);

    let catAlloc = { thai: 0, global: 0, deriv: 0, crypto: 0, other: 0 };
    let grandTotalUSD = 0;
    
    if (Array.isArray(this.portfolios)) {
      this.portfolios.forEach(p => {
        if(!p) return;
        const valUSD = (p.current||0) + (p.cashBuffer||0);
        grandTotalUSD += valUSD;
        
        const cat = (p.category || '').toLowerCase();
        if(cat.includes('thai')) {
          catAlloc.thai += valUSD;
        } else if(cat.includes('global') || cat.includes('growth') || cat.includes('foreign') || cat.includes('ต่างประเทศ') || cat.includes('next')) {
          catAlloc.global += valUSD;
        } else if(cat.includes('option')) {
          catAlloc.deriv += valUSD;
        } else if(cat.includes('crypto') || cat.includes('คริปโต')) {
          catAlloc.crypto += valUSD;
        } else {
          catAlloc.other += valUSD;
        }
      });
    }

    const dryPowderRatio = calc.netWorthUSD > 0 ? (calc.totalDryPowderUSD / calc.netWorthUSD) * 100 : 0;
    const debtRemainingUSD = Math.max(0, (this.debtRemainingTHB || 0) / this.exchangeRate);
    const debtStartUSD = Math.max(0, (this.debtStartTHB || 0) / this.exchangeRate);

    const debtToNetWorthRatio = calc.netWorthUSD > 0 ? debtRemainingUSD / calc.netWorthUSD : (debtRemainingUSD > 0 ? 1 : 0);
    const debtScore = 25 * Math.max(0, 1 - Math.min(1, debtToNetWorthRatio));
    const dryPowderScore = 20 * Math.min(1, dryPowderRatio / 15);
    const snowballProgressPct = debtStartUSD > 0 ? Math.max(0, Math.min(1, (debtStartUSD - debtRemainingUSD) / debtStartUSD)) : (debtRemainingUSD === 0 ? 1 : 0);
    const snowballScore = 20 * snowballProgressPct;
    const topGoalPct = topGoals.length > 0 ? Math.min(100, topGoals[0].pct) : 0;
    const goalScore = 20 * (topGoalPct / 100);
    const diversificationScore = 15 * Math.min(1, this.portfolios.length / 3);

    let healthScore = Math.round(debtScore + dryPowderScore + snowballScore + goalScore + diversificationScore);
    healthScore = Math.max(0, Math.min(100, healthScore));
    const meloState = this.getMeloAvatarState(healthScore);

    const investedUSD = calc.totalUSD;

    const nwTHB = this.isPrivacyMode ? '฿***,***' : `฿${calc.netWorthTHB.toLocaleString(undefined,{maximumFractionDigits:0})}`;
    const nwUSD = this.isPrivacyMode ? '$***,***' : `$${calc.netWorthUSD.toLocaleString(undefined,{maximumFractionDigits:0})}`;
    const investedTHB = investedUSD * this.exchangeRate;
    const invTHBStr = this.isPrivacyMode ? '฿***,***' : `฿${investedTHB.toLocaleString(undefined,{maximumFractionDigits:0})}`;
    const invUSDStr = this.isPrivacyMode ? '$***,***' : `$${investedUSD.toLocaleString(undefined,{maximumFractionDigits:0})}`;
    const dryTHBVal = calc.totalDryPowderUSD * this.exchangeRate;
    const dryTHBStr = this.isPrivacyMode ? '฿***,***' : `฿${dryTHBVal.toLocaleString(undefined,{maximumFractionDigits:0})}`;
    const dryUSDStr = this.isPrivacyMode ? '$***,***' : `$${calc.totalDryPowderUSD.toLocaleString(undefined,{maximumFractionDigits:0})}`;

    container.innerHTML = `
      <!-- 💰 TREASURY INVENTORY -->
      <div class="inventory-grid">
        <div class="inventory-slot border-pixel">
          <div class="slot-icon-frame">
            <img src="./assets/icons/icon-chest.png" class="pixelated">
          </div>
          <div class="slot-details">
            <div class="slot-title">NET WORTH รวม</div>
            <div class="slot-value text-accent">${nwUSD}</div>
            <div class="slot-subtitle">(${nwTHB})</div>
          </div>
        </div>
        
        <div class="inventory-slot border-pixel">
          <div class="slot-icon-frame">
            <img src="./assets/icons/icon-briefcase.png" class="pixelated">
          </div>
          <div class="slot-details">
            <div class="slot-title">เงินลงทุนแล้ว</div>
            <div class="slot-value" style="color:var(--color-success);">${invUSDStr}</div>
            <div class="slot-subtitle">(${invTHBStr})</div>
          </div>
        </div>

        <div class="inventory-slot border-pixel">
          <div class="slot-icon-frame">
            <img src="./assets/icons/icon-coin-stack.png" class="pixelated">
          </div>
          <div class="slot-details">
            <div class="slot-title">กระสุนรอช้อน (Dry Powder)</div>
            <div class="slot-value" style="color:var(--color-warning);">${dryUSDStr}</div>
            <div class="slot-subtitle">(${dryTHBStr})</div>
          </div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: 1.1fr 0.9fr; gap:20px; margin-top:20px;">
        <!-- ⚔️ ACTIVE QUEST LOG -->
        <div class="border-pixel" style="padding:15px; background:#1f273e;">
          <h4 style="font-family:'Press Start 2P'; font-size:0.6rem; color:var(--color-accent); margin-bottom:12px; display:flex; align-items:center; gap:8px;">
            ⚔️ ACTIVE QUEST LOG (ภารกิจการเงิน)
          </h4>
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${!Array.isArray(this.portfolios) || this.portfolios.length === 0 ? '<p class="text-muted" style="font-size:0.8rem;">ไม่มีเควสการเงิน โปรดสร้างพอร์ตเพื่อลงทะเบียนเควส</p>' : this.portfolios.map(p => {
              const curUSD = (p.current||0)+(p.cashBuffer||0);
              const goalUSD = p.goalType==='numeric'?(p.goal||0):0;
              const pct = p.goalType==='numeric'?(p.goal>0?(curUSD/goalUSD)*100:0):(p.dcaDoneThisMonth?100:0);
              const isCleared = pct >= 100;
              
              let questBadge = isCleared ? '<span class="quest-status cleared">🏆 CLEARED</span>' : '<span class="quest-status active">⚔️ ACTIVE</span>';
              if (p.goalType === 'schedule') {
                questBadge = p.dcaDoneThisMonth ? '<span class="quest-status cleared">🏆 CLEARED</span>' : '<span class="quest-status schedule">📅 PLAN</span>';
              }

              const curTHBSub = (curUSD * this.exchangeRate).toLocaleString(undefined,{maximumFractionDigits:0});
              const goalTHBSub = (goalUSD * this.exchangeRate).toLocaleString(undefined,{maximumFractionDigits:0});

              return `
                <div class="quest-card border-pixel ${isCleared ? 'quest-cleared' : ''}">
                  <div class="quest-header">
                    <span class="quest-title">${p.name} <span style="font-size:0.75rem; color:#94a3b8; font-weight:normal;">(${p.category})</span></span>
                    ${questBadge}
                  </div>
                  <div class="quest-desc">
                    มูลค่า: $${curUSD.toLocaleString(undefined,{maximumFractionDigits:2})} <span style="color:#94a3b8; font-size:0.7rem;">(฿${curTHBSub})</span> / ${p.goalType==='numeric' ? '$' + goalUSD.toLocaleString(undefined,{maximumFractionDigits:0}) + ' <span style="color:#94a3b8; font-size:0.7rem;">(฿' + goalTHBSub + ')</span>' : 'DCA ' + p.goalSchedule}
                  </div>
                  <div class="quest-progress">
                    <div class="quest-hp-bar">
                      <div class="quest-hp-fill" style="width: ${Math.min(100, pct)}%; background: ${isCleared ? 'var(--color-success)' : 'var(--color-primary)'};"></div>
                    </div>
                    <span class="quest-pct">${pct.toFixed(0)}%</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:20px;">
          <!-- 📊 ALLOCATION MATRIX -->
          <div class="border-pixel" style="padding:15px; background:#1f273e;">
            <h4 style="font-family:'Press Start 2P'; font-size:0.6rem; color:#10b981; margin-bottom:12px;">📊 ALLOCATION MATRIX (การจัดสรรคลังรวม)</h4>
            <div class="segmented-bar border-pixel-inset" style="height:20px; display:flex; overflow:hidden; background:#111625; margin-bottom:15px;">
              ${grandTotalUSD === 0 ? '<div style="width:100%; text-align:center; font-size:0.7rem; color:#64748b; line-height:20px;">คลังว่างเปล่า</div>' : `
                <div style="width:${(catAlloc.thai/grandTotalUSD)*100}%; background:#22c55e; height:100%;" title="หุ้นไทย"></div>
                <div style="width:${(catAlloc.global/grandTotalUSD)*100}%; background:#3b82f6; height:100%;" title="หุ้นต่างประเทศ"></div>
                <div style="width:${(catAlloc.deriv/grandTotalUSD)*100}%; background:#a855f7; height:100%;" title="ออปชัน"></div>
                <div style="width:${(catAlloc.crypto/grandTotalUSD)*100}%; background:#eab308; height:100%;" title="คริปโต"></div>
                <div style="width:${(catAlloc.other/grandTotalUSD)*100}%; background:#64748b; height:100%;" title="อื่นๆ"></div>
              `}
            </div>
            
            <div style="margin-bottom:12px;" id="dashboard-donut-chart-mount"></div>
            
            <div style="display:flex; flex-direction:column; gap:10px; font-size:0.75rem;">
              <div>
                <div style="display:flex; justify-content:space-between;"><span>🟢 หุ้นไทย</span><b>${grandTotalUSD>0?((catAlloc.thai/grandTotalUSD)*100).toFixed(1):0}%</b></div>
                <div class="bar-mini"><div class="bar-mini-fill" style="width:${grandTotalUSD>0?(catAlloc.thai/grandTotalUSD)*100:0}%; background:#22c55e;"></div></div>
              </div>
              <div>
                <div style="display:flex; justify-content:space-between;"><span>🔵 หุ้นต่างประเทศ</span><b>${grandTotalUSD>0?((catAlloc.global/grandTotalUSD)*100).toFixed(1):0}%</b></div>
                <div class="bar-mini"><div class="bar-mini-fill" style="width:${grandTotalUSD>0?(catAlloc.global/grandTotalUSD)*100:0}%; background:#3b82f6;"></div></div>
              </div>
              <div>
                <div style="display:flex; justify-content:space-between;"><span>🟣 ออปชัน</span><b>${grandTotalUSD>0?((catAlloc.deriv/grandTotalUSD)*100).toFixed(1):0}%</b></div>
                <div class="bar-mini"><div class="bar-mini-fill" style="width:${grandTotalUSD>0?(catAlloc.deriv/grandTotalUSD)*100:0}%; background:#a855f7;"></div></div>
              </div>
              <div>
                <div style="display:flex; justify-content:space-between;"><span>🟡 คริปโต</span><b>${grandTotalUSD>0?((catAlloc.crypto/grandTotalUSD)*100).toFixed(1):0}%</b></div>
                <div class="bar-mini"><div class="bar-mini-fill" style="width:${grandTotalUSD>0?(catAlloc.crypto/grandTotalUSD)*100:0}%; background:#eab308;"></div></div>
              </div>
              <div>
                <div style="display:flex; justify-content:space-between;"><span>⚪ อื่นๆ (เป้าหมายชีวิต/เงินสำรอง)</span><b>${grandTotalUSD>0?((catAlloc.other/grandTotalUSD)*100).toFixed(1):0}%</b></div>
                <div class="bar-mini"><div class="bar-mini-fill" style="width:${grandTotalUSD>0?(catAlloc.other/grandTotalUSD)*100:0}%; background:#64748b;"></div></div>
              </div>
            </div>
          </div>

          <!-- 📈 QUARTERLY GROWTH -->
          <div class="border-pixel" style="padding:15px; background:#1f273e;">
            <h4 style="font-family:'Press Start 2P'; font-size:0.6rem; color:#3b82f6; margin-bottom:12px;">📈 สรุปความเติบโตรายไตรมาส (${yr})</h4>
            <div style="display:flex; justify-content:space-around; align-items:flex-end; height:120px; background:#111625; padding:10px; border:2px solid #000;">
              <div style="width:20%; display:flex; flex-direction:column; align-items:center; height:100%; justify-content:flex-end;"><div style="font-size:0.55rem;">$${q1.toLocaleString(undefined,{maximumFractionDigits:0})}</div><div style="width:100%; height:${maxQ>0?(q1/maxQ)*100:0}%; background:var(--color-primary); border:1px solid #000;"></div><div style="font-size:0.6rem;">Q1</div></div>
              <div style="width:20%; display:flex; flex-direction:column; align-items:center; height:100%; justify-content:flex-end;"><div style="font-size:0.55rem;">$${q2.toLocaleString(undefined,{maximumFractionDigits:0})}</div><div style="width:100%; height:${maxQ>0?(q2/maxQ)*100:0}%; background:var(--color-success); border:1px solid #000;"></div><div style="font-size:0.6rem;">Q2</div></div>
              <div style="width:20%; display:flex; flex-direction:column; align-items:center; height:100%; justify-content:flex-end;"><div style="font-size:0.55rem;">$${q3.toLocaleString(undefined,{maximumFractionDigits:0})}</div><div style="width:100%; height:${maxQ>0?(q3/maxQ)*100:0}%; background:var(--color-secondary); border:1px solid #000;"></div><div style="font-size:0.6rem;">Q3</div></div>
              <div style="width:20%; display:flex; flex-direction:column; align-items:center; height:100%; justify-content:flex-end;"><div style="font-size:0.55rem;">$${q4.toLocaleString(undefined,{maximumFractionDigits:0})}</div><div style="width:100%; height:${maxQ>0?(q4/maxQ)*100:0}%; background:var(--color-accent); border:1px solid #000;"></div><div style="font-size:0.6rem;">Q4</div></div>
            </div>
          </div>

          <!-- ❤️ PORTFOLIO HEALTH -->
          <div class="border-pixel" style="padding:12px; background:#1f273e; text-align:center;">
            <h5 style="font-family:'Press Start 2P'; font-size:0.55rem; color:var(--color-accent);">❤️ PORTFOLIO HEALTH STATUS</h5>
            <div style="display:flex; align-items:center; justify-content:center; gap:10px; margin:8px 0; background:#111625; padding:8px; border:2px solid #000;">
              <img src="${meloState.imgSrc}" class="health-avatar-square-img">
              <div style="text-align:left;"><div style="font-size:1.1rem; font-family:'Press Start 2P'; color:#10b981;">${healthScore}/100</div><div style="font-size:0.65rem; font-weight:bold; ${meloState.cls}">${meloState.text}</div></div>
            </div>
            <div class="health-score-breakdown" style="display:flex; flex-wrap:wrap; justify-content:center; gap:6px; font-size:0.65rem;">
              <span class="badge" style="background:#0c1020; border:1px solid #334155; padding:2px 4px;">💳 หหนี้ ${debtScore.toFixed(0)}/25</span>
              <span class="badge" style="background:#0c1020; border:1px solid #334155; padding:2px 4px;">💵 เงินสด ${dryPowderScore.toFixed(0)}/20</span>
              <span class="badge" style="background:#0c1020; border:1px solid #334155; padding:2px 4px;">❄️ Snowball ${snowballScore.toFixed(0)}/20</span>
              <span class="badge" style="background:#0c1020; border:1px solid #334155; padding:2px 4px;">🎯 เป้าหมาย ${goalScore.toFixed(0)}/20</span>
              <span class="badge" style="background:#0c1020; border:1px solid #334155; padding:2px 4px;">💎 พอร์ต ${diversificationScore.toFixed(0)}/15</span>
            </div>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      this.renderAssetAllocationSvgChart('dashboard-donut-chart-mount', [
        { label: 'หุ้นไทย', value: catAlloc.thai, color: '#22c55e' },
        { label: 'หุ้นต่างประเทศ', value: catAlloc.global, color: '#3b82f6' },
        { label: 'ออปชัน', value: catAlloc.deriv, color: '#a855f7' },
        { label: 'คริปโต', value: catAlloc.crypto, color: '#eab308' },
        { label: 'อื่นๆ / เสบียง', value: catAlloc.other, color: '#64748b' }
      ]);
    }, 50);
  }

  renderPortfolios(container) {
    if (!Array.isArray(this.portfolios) || this.portfolios.length === 0) {
      container.innerHTML = `
        <div class="border-pixel" style="padding:40px; text-align:center; background:#1f273e;">
          🎮 ยินดีต้อนรับสู่ระบบ Pixel Steward<br><br>
          <button class="btn btn-primary" onclick="app.openPortfolioModal()">➕ เริ่มจัดตั้งพอร์ตลงทุนแรก</button>
        </div>`;
      return;
    }

    let active = this.portfolios.find(p => p && p.id === this.selectedPortId) || this.portfolios[0];
    this.selectedPortId = active.id;
    const lvl = this.getPortfolioLevel(active);
    const weight = this.getCalculations().netWorthUSD > 0 ? (((active.current+active.cashBuffer))/this.getCalculations().netWorthUSD)*100 : 0;

    let displayAssets = active.assets ? active.assets.map((a, i) => ({ ...a, originalIndex: i })) : [];
    if (this.subAssetSortOption === 'value') {
      displayAssets.sort((a, b) => (Number(b.value) || 0) - (Number(a.value) || 0));
    } else if (this.subAssetSortOption === 'gain') {
      displayAssets.sort((a, b) => ((Number(b.value) || 0) - (Number(b.costBasis) || Number(b.value) || 0)) - ((Number(a.value) || 0) - (Number(a.costBasis) || Number(a.value) || 0)));
    } else if (this.subAssetSortOption === 'loss') {
      displayAssets.sort((a, b) => ((Number(a.value) || 0) - (Number(a.costBasis) || Number(a.value) || 0)) - ((Number(b.value) || 0) - (Number(b.costBasis) || Number(b.value) || 0)));
    }

    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:20px;">
        <div class="border-pixel" style="padding:16px; background:#111625;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 style="font-family:'Press Start 2P'; font-size:0.75rem; color:var(--color-accent, #f59e0b); margin:0; display:flex; align-items:center;">
              <img src="./assets/icons/icon-briefcase.png" alt="Rack" class="card-title-icon" style="width:24px; height:24px; margin-right:8px;"> CARTRIDGE MEMORY RACK
            </h3>
            <span style="font-size:0.72rem; color:#94a3b8;">✋ คลิกสลับ หรือ ลากเพื่อเรียงลำดับใหม่</span>
          </div>
          <div class="memory-card-grid">
            ${this.portfolios.map((p, idx) => {
              if (!p) return '';
              const hasGoal = p.goalType !== 'none' && Number(p.goal) > 0;
              const pct = hasGoal ? (((p.current + p.cashBuffer) / p.goal) * 100) : 0;
              const isPurpleTier = pct >= 80;
              const tierClass = hasGoal ? (isPurpleTier ? 'tier-purple' : (pct >= 40 ? 'tier-gold' : 'tier-silver')) : 'tier-silver';
              const isActive = p.id === this.selectedPortId ? 'active' : '';

              return `
                <div class="memory-card-wrapper ${tierClass} ${isActive}" draggable="true" data-port-id="${p.id}" data-port-index="${idx}" onclick="app.switchPortfolio('${p.id}')">
                  <img src="./assets/cards/card-folio.png" class="memory-card-bg" alt="Memory Card">
                  <div class="memory-card-content">
                    <div>
                      <div class="card-title-text">${p.name}</div>
                      <div class="card-cat-text">${p.category}</div>
                    </div>
                    <div>
                      <div class="card-val-text">${this.formatMoney(p.current + p.cashBuffer, p.category, false)}</div>
                      ${hasGoal ? `
                      <div style="display:flex; justify-content:space-between; align-items:center; font-family:'Press Start 2P'; font-size:0.5rem; color:#94a3b8; margin-top:3px;">
                        <span>${pct.toFixed(0)}%</span>
                        <div class="card-progress-bar" style="width:70%; margin:0;">
                          <div class="card-progress-fill" style="width:${Math.min(100, pct)}%;"></div>
                        </div>
                      </div>` : '<div style="font-size:0.65rem; color:#64748b; margin-top:4px;">ไม่ตั้งเป้าหมาย</div>'}
                    </div>
                  </div>
                  <div class="card-footer-tag">MEMORY CARD</div>
                </div>
              `;
            }).join('')}

            <div class="memory-card-add-new" onclick="app.openPortfolioModal()">
              <div style="font-size:1.8rem;">➕</div>
              <div style="font-family:'Press Start 2P'; font-size:0.6rem; margin-top:8px;">ADD NEW</div>
            </div>
          </div>
        </div>

        <div class="portfolio-detail-grid">
          <div class="border-pixel" style="background:#1f273e; padding:18px; display:flex; flex-direction:column; gap:12px;">
            <div style="display:flex; justify-content:space-between; border-bottom:3px solid #000; padding-bottom:10px; align-items:center;">
              <h3 style="display:flex; align-items:center; gap:8px; margin:0;">
                <img src="${this.getCategoryIconPath(active.category)}" alt="Active Icon" class="card-title-icon">
                <span>${active.name}</span>
              </h3>
              <div style="display:flex; gap:6px; align-items:center;">
                <span class="port-card-cat" style="cursor:pointer; border:1px dashed #3b82f6; padding:2px 6px; font-size:0.75rem;" onclick="app.inlineEditCategory('${active.id}')">${active.category} ✏️</span>
                <button class="btn btn-danger btn-small" onclick="app.deletePortfolio('${active.id}')">✖ ลบพอร์ต</button>
              </div>
            </div>
            
            ${(active.goalType !== 'none' && Number(active.goal) > 0) ? `
            <div style="background:#111625; padding:10px; border:2px solid #000; font-size:0.85rem; cursor:pointer;" onclick="app.inlineEditGoal('${active.id}')">
              🎯 เป้าหมาย: ${active.goalType==='numeric'?this.formatMoney(active.goal, active.category, false):active.goalSchedule} <span style="font-size:0.7rem; color:#64748b; float:right;">✏️ แก้ไข</span>
            </div>` : `
            <div style="background:#111625; padding:10px; border:2px solid #000; font-size:0.85rem; cursor:pointer; color:#94a3b8;" onclick="app.inlineEditGoal('${active.id}')">
              🎯 เป้าหมาย: ไม่ได้ตั้งเป้าหมาย (ซ่อนหลอดเป้าอัตโนมัติ) <span style="font-size:0.7rem; color:#64748b; float:right;">✏️ ตั้งเป้าหมาย</span>
            </div>`}
            
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
              <div style="background:#111625; padding:10px; border:2px solid #000; font-size:0.85rem; color:#10b981; font-weight:bold;">
                💼 สุทธิพอร์ต: ${this.formatMoney(active.current+active.cashBuffer, active.category, false)}
              </div>
              <div style="background:#0c1020; padding:10px; border:2px solid #000; font-size:0.8rem; color:#94a3b8;">
                ⚖️ Weight: <b>${weight.toFixed(1)}% ของคลังรวม</b>
              </div>
            </div>

            <!-- 💵 DEDICATED CASH STORAGE SLOTS -->
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:2px;">
              <div style="background:#064e3b; padding:8px 12px; border:2px solid #059669; border-radius:6px; font-size:0.8rem; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="app.inlineEditDryPowder('${active.id}')" title="คลิกเพื่อแก้ไขเงินสดรอช้อน">
                <span>🎯 เงินสดรอช้อน (Dry Powder):</span>
                <b style="color:#34d399; font-size:0.9rem;">${this.formatMoney(active.dryPowder, active.category, false)} ✏️</b>
              </div>
              <div style="background:#1e1b4b; padding:8px 12px; border:2px solid #6366f1; border-radius:6px; font-size:0.8rem; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="app.inlineEditCashBuffer('${active.id}')" title="คลิกเพื่อแก้ไขเงินสดสำรอง">
                <span>💵 เงินสดสำรอง (Cash Buffer):</span>
                <b style="color:#a78bfa; font-size:0.9rem;">${this.formatMoney(active.cashBuffer, active.category, false)} ✏️</b>
              </div>
            </div>

            ${(active.goalType !== 'none' && Number(active.goal) > 0) ? `
            <div>
              <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:bold; margin-bottom:2px;"><span>เควสโปรเกรส:</span><span>${lvl.pct.toFixed(1)}%</span></div>
              <div class="progress-container" style="height:12px; background:#111625; border:2px solid #000;"><div style="width:${Math.min(100,lvl.pct)}%; background:var(--color-success); height:100%;"></div></div>
            </div>` : ''}

            <div style="margin-top:5px;">
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #000; padding-bottom:6px; flex-wrap:wrap; gap:6px;">
                <span style="font-size:0.8rem; font-weight:bold; color:var(--color-success);">💎 สินทรัพย์ย่อยในตลับ:</span>
                <div style="display:flex; gap:4px; align-items:center;">
                  <button class="sub-asset-sort-btn ${this.subAssetSortOption==='default'?'active':''}" onclick="app.setSubAssetSort('default')">📌 ตามเดิม</button>
                  <button class="sub-asset-sort-btn ${this.subAssetSortOption==='value'?'active':''}" onclick="app.setSubAssetSort('value')">💰 มูลค่าสูงสุด</button>
                  <button class="sub-asset-sort-btn ${this.subAssetSortOption==='gain'?'active':''}" onclick="app.setSubAssetSort('gain')">📈 กำไรสูงสุด</button>
                  <button class="sub-asset-sort-btn ${this.subAssetSortOption==='loss'?'active':''}" onclick="app.setSubAssetSort('loss')">📉 ขาดทุนสูงสุด</button>
                  <button class="btn btn-primary btn-retro btn-small" id="btn-add-asset" style="margin-left:4px;"><span>➕ เพิ่มสินทรัพย์</span></button>
                </div>
              </div>
              <div style="display:flex; flex-direction:column; gap:8px; margin-top:8px; max-height:220px; overflow-y:auto;">
                ${(displayAssets.length===0)?'<p class="text-muted" style="font-size:0.85rem; text-align:center;">คลังว่างเปล่า กดปุ่ม ➕ ด้านบนเพื่อเพิ่ม</p>':displayAssets.map((a)=>{
                  const i = a.originalIndex;
                  const val = Number(a.value) || 0;
                  const cost = Number(a.costBasis) || val;
                  const cPrice = Number(a.currentPrice) || (a.shares > 0 ? val / a.shares : val);
                  const cCostPrice = Number(a.costPrice) || (a.shares > 0 ? cost / a.shares : cost);
                  const diff = val - cost;
                  const pct = (cCostPrice > 0 && cPrice > 0) ? (((cPrice - cCostPrice) / cCostPrice) * 100) : (cost > 0 ? (diff / cost) * 100 : 0);
                  const isProfit = diff >= 0;
                  const plBadgeClass = isProfit ? 'badge-pl-profit' : 'badge-pl-loss';
                  const sign = isProfit ? '+' : '';

                  return `
                  <div style="display:flex; justify-content:space-between; background:#111625; padding:8px 12px; border:2px solid #000; font-size:0.85rem; align-items:center; border-radius:6px; flex-wrap:wrap; gap:6px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                      ${this.getTickerLogoHtml(a.name, active.category)}
                      <div>
                        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                          <b style="font-size:0.9rem; color:#fff;">${a.name}</b>
                          <span style="font-size:0.65rem; color:#60a5fa; background:rgba(96,165,250,0.1); padding:1px 4px; border-radius:3px;">Dime Sync</span>
                          ${(a.targetPct !== undefined && a.targetPct !== null && a.targetPct !== '') ? `<span style="font-size:0.65rem; color:#f59e0b; background:rgba(245,158,11,0.15); padding:1px 5px; border-radius:3px; border:1px solid #f59e0b;" title="เป้าหมายสัดส่วนในพอร์ต">🎯 เป้าหมาย ${a.targetPct}%</span>` : ''}
                        </div>
                        <div style="font-size:0.72rem; color:#94a3b8; margin-top:2px;">
                          จำนวน: <b>${Number(a.shares || 1).toLocaleString(undefined, {maximumFractionDigits: 6})}</b> หุ้น
                          | ต้นทุน: <b>$${cCostPrice.toFixed(2)}</b>/หุ้น
                        </div>
                        <div style="font-size:0.7rem; color:#64748b; margin-top:1px;">
                          ทุนรวม: $${cost.toFixed(2)} | ราคาปัจจุบัน: $${cPrice.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div style="display:flex; gap:6px; align-items:center;">
                      <div style="text-align:right; margin-right:4px;">
                        <div><b>${this.formatMoney(val, active.category, false)}</b></div>
                        <span class="badge-pl ${plBadgeClass}">${sign}${this.isPrivacyMode ? '***' : '$' + Math.abs(diff).toLocaleString(undefined,{maximumFractionDigits:2})} (${sign}${pct.toFixed(1)}%)</span>
                      </div>
                      <button class="btn btn-warning btn-small" onclick="app.openAssetEditModal('${active.id}', ${i})" style="padding:2px 6px; font-size:0.7rem; font-weight:bold; color:#000;" title="แก้ไขสินทรัพย์ (Dime Sync)">✏️</button>
                      <button class="btn btn-success btn-small" onclick="app.modularDepositAsset('${active.id}', ${i})" style="padding:2px 6px; font-size:0.7rem; font-weight:bold;" title="ฝากเพิ่ม">📥 ➕</button>
                      <button class="btn btn-warning btn-small" onclick="app.modularWithdrawAsset('${active.id}', ${i})" style="padding:2px 6px; font-size:0.7rem; font-weight:bold; color:#000;" title="ถอนออก">📤 ➖</button>
                      <button class="btn btn-danger btn-small" onclick="app.deleteAsset('${active.id}',${i})" style="padding:2px 6px; font-size:0.7rem;">✖</button>
                    </div>
                  </div>`;
                }).join('')}
              </div>
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:15px;">
            <div class="border-pixel" style="padding:15px; background:#1f273e; text-align:center;">
              <h5 style="font-family:'Press Start 2P'; font-size:0.55rem; color:var(--color-accent); display:flex; align-items:center; justify-content:center;">
                <img src="./assets/icons/icon-star.png" alt="Rank" class="card-title-icon"> RANK SCORE
              </h5>
              <div style="font-size:2rem; margin:8px 0;">${lvl.icon}</div>
              <b>${lvl.label}</b><p style="font-size:0.75rem; color:#94a3b8; margin:4px 0;">${lvl.desc}</p>
              <div style="border-top:2px dashed #000; margin:8px 0;"></div>
              <div style="font-size:0.75rem; text-align:left; color:var(--color-accent); font-weight:bold;">${this.getNextRankPreview(active)}</div>
            </div>
            
            <div class="border-pixel" style="padding:15px; background:#1f273e;">
              <h5 style="font-family:'Press Start 2P'; font-size:0.55rem; color:var(--color-success); margin-bottom:10px; display:flex; align-items:center;">
                <img src="./assets/icons/icon-chest.png" alt="Chest" class="card-title-icon"> กระสุนรอช้อน (DRY POWDER)
              </h5>
              <form id="update-balance-form" style="display:flex; flex-direction:column; gap:8px; font-size:0.8rem;">
                <label>มูลค่าอัตโนมัติ (หลังบ้าน):</label>
                <div style="background:#111625; padding:8px; border:2px solid #000; font-weight:bold; color:#10b981;">${this.formatMoney(active.current+active.cashBuffer, active.category, false)}</div>
                
                <label>ระบุเงินช้อน Dry Powder ($ USD):</label>
                <input type="number" id="update-dry" class="input-retro" value="${active.dryPowder||0}" required style="width:100%;">
                <input type="submit" class="btn btn-success btn-retro" style="width:100%; padding:6px; font-weight:bold;" value="💾 บันทึกเงินช้อน">
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('update-balance-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const p = this.portfolios.find(x => x && x.id === active.id);
      if (p) { 
        p.dryPowder = Number(document.getElementById('update-dry').value); 
        this.saveState(); this.refreshUI(); alert('🎯 อัปเดตเงินช้อนสำเร็จ!'); 
      }
    });

    this.attachMemoryCardDragEvents();
  }

  setSubAssetSort(option) {
    this.subAssetSortOption = option;
    this.refreshUI();
  }

  attachMemoryCardDragEvents() {
    const grid = document.querySelector('.memory-card-grid');
    if (!grid) return;

    let draggedItemIndex = null;
    let touchStartX = 0;
    let touchStartY = 0;
    let isTouchDragging = false;
    let touchedCard = null;

    grid.querySelectorAll('.memory-card-wrapper').forEach((card) => {
      // 💻 Desktop HTML5 Drag Events
      card.addEventListener('dragstart', (e) => {
        this.isDraggingMemoryCard = true;
        draggedItemIndex = parseInt(card.dataset.portIndex);
        card.classList.add('dragging');
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', draggedItemIndex);
        }
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        grid.querySelectorAll('.memory-card-wrapper').forEach(c => c.classList.remove('drag-over'));
        setTimeout(() => { this.isDraggingMemoryCard = false; }, 200);
      });

      card.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
        card.classList.add('drag-over');
      });

      card.addEventListener('dragleave', () => {
        card.classList.remove('drag-over');
      });

      card.addEventListener('drop', (e) => {
        e.preventDefault();
        card.classList.remove('drag-over');
        const targetIndex = parseInt(card.dataset.portIndex);
        if (draggedItemIndex !== null && !isNaN(targetIndex) && draggedItemIndex !== targetIndex) {
          const movedPort = this.portfolios.splice(draggedItemIndex, 1)[0];
          this.portfolios.splice(targetIndex, 0, movedPort);
          this.saveState();
          this.refreshUI();
        }
      });

      // 📲 Mobile Touch Events (iOS Safari & Android Chrome)
      card.addEventListener('touchstart', (e) => {
        if (!e.touches || e.touches.length !== 1) return;
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchedCard = card;
        draggedItemIndex = parseInt(card.dataset.portIndex);
        isTouchDragging = false;
      }, { passive: true });

      card.addEventListener('touchmove', (e) => {
        if (!touchedCard || !e.touches || e.touches.length !== 1) return;
        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - touchStartX);
        const deltaY = Math.abs(touch.clientY - touchStartY);

        if (deltaX > 12 || deltaY > 12) {
          if (!isTouchDragging) {
            isTouchDragging = true;
            this.isDraggingMemoryCard = true;
            touchedCard.classList.add('dragging');
          }

          if (e.cancelable) e.preventDefault();

          const targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
          const targetCard = targetEl ? targetEl.closest('.memory-card-wrapper') : null;

          grid.querySelectorAll('.memory-card-wrapper').forEach(c => c.classList.remove('drag-over'));
          if (targetCard && targetCard !== touchedCard) {
            targetCard.classList.add('drag-over');
          }
        }
      }, { passive: false });

      card.addEventListener('touchend', (e) => {
        if (isTouchDragging && touchedCard) {
          touchedCard.classList.remove('dragging');
          grid.querySelectorAll('.memory-card-wrapper').forEach(c => c.classList.remove('drag-over'));

          if (e.changedTouches && e.changedTouches.length > 0) {
            const touch = e.changedTouches[0];
            const targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
            const targetCard = targetEl ? targetEl.closest('.memory-card-wrapper') : null;

            if (targetCard && targetCard !== touchedCard) {
              const targetIndex = parseInt(targetCard.dataset.portIndex);
              if (draggedItemIndex !== null && !isNaN(targetIndex) && draggedItemIndex !== targetIndex) {
                const movedPort = this.portfolios.splice(draggedItemIndex, 1)[0];
                this.portfolios.splice(targetIndex, 0, movedPort);
                this.saveState();
                this.refreshUI();
              }
            }
          }

          setTimeout(() => {
            this.isDraggingMemoryCard = false;
            isTouchDragging = false;
            touchedCard = null;
          }, 200);
        } else {
          // Short tap on mobile touchscreen -> switch portfolio
          const portId = card.dataset.portId;
          if (portId && !this.isDraggingMemoryCard) {
            this.switchPortfolio(portId);
          }
          touchedCard = null;
        }
      });
    });
  }

  loadAchievements() {
    const stored = localStorage.getItem('ps_achievements_v4');
    return stored ? JSON.parse(stored) : DEFAULT_ACHIEVEMENTS;
  }

  saveAchievements() {
    localStorage.setItem('ps_achievements_v4', JSON.stringify(this.achievements));
    this.syncStateToCloud();
  }

  openAchievementModal() {
    const modal = document.getElementById('achievement-modal');
    if (!modal) return;
    this.renderAchievements();
    modal.classList.remove('hidden');
  }

  setAchievementFilter(option) {
    this.achievementFilterOption = option;
    this.renderAchievements();
  }

  renderAchievements() {
    const container = document.getElementById('achievement-checklist-container');
    const countEl = document.getElementById('achievement-unlocked-count');
    if (!container) return;

    if (!Array.isArray(this.achievements)) this.achievements = DEFAULT_ACHIEVEMENTS;
    if (!this.achievementFilterOption) this.achievementFilterOption = 'all';

    const completedQuests = this.achievements.filter(a => a && a.completed);
    const activeQuests = this.achievements.filter(a => a && !a.completed);

    if (countEl) countEl.innerText = `🏆 สำเร็จ ${completedQuests.length} / ${this.achievements.length} เควส`;

    const renderCard = (a) => {
      if (!a) return '';
      return `
        <div class="achievement-item ${a.completed ? 'completed' : ''}">
          <input type="checkbox" class="achievement-checkbox" ${a.completed ? 'checked' : ''} onchange="app.toggleAchievement('${a.id}')">
          <div style="flex:1;">
            <div class="achievement-title">${a.title}</div>
            <div class="achievement-desc">${a.desc}</div>
          </div>
          ${a.isCustom ? `<button class="btn btn-danger btn-small" onclick="app.deleteCustomAchievement('${a.id}')" style="padding:2px 6px; font-size:0.7rem;">✖</button>` : ''}
        </div>
      `;
    };

    let html = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:6px;">
        <div style="display:flex; gap:4px; flex-wrap:wrap;">
          <button class="sub-asset-sort-btn ${this.achievementFilterOption === 'all' ? 'active' : ''}" onclick="app.setAchievementFilter('all')">📌 ทั้งหมด (${this.achievements.length})</button>
          <button class="sub-asset-sort-btn ${this.achievementFilterOption === 'active' ? 'active' : ''}" onclick="app.setAchievementFilter('active')">🎯 รอดำเนินการ (${activeQuests.length})</button>
          <button class="sub-asset-sort-btn ${this.achievementFilterOption === 'completed' ? 'active' : ''}" onclick="app.setAchievementFilter('completed')">🏆 ปลดล็อกแล้ว (${completedQuests.length})</button>
        </div>
      </div>
    `;

    if (this.achievementFilterOption === 'active') {
      html += `<div style="display:flex; flex-direction:column; gap:8px;">${activeQuests.length === 0 ? '<p class="text-muted" style="font-size:0.8rem; text-align:center; padding:15px;">🎉 ไม่มีเควสรอดำเนินการ (บรรลุเป้าหมายทั้งหมดแล้ว!)</p>' : activeQuests.map(renderCard).join('')}</div>`;
    } else if (this.achievementFilterOption === 'completed') {
      html += `<div style="display:flex; flex-direction:column; gap:8px;">${completedQuests.length === 0 ? '<p class="text-muted" style="font-size:0.8rem; text-align:center; padding:15px;">ยังไม่มีเควสที่ปลดล็อก</p>' : completedQuests.map(renderCard).join('')}</div>`;
    } else {
      html += `
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${activeQuests.length > 0 ? `<h5 style="font-family:'Press Start 2P'; font-size:0.55rem; color:#60a5fa; margin:4px 0;">🎯 เควสกำลังดำเนินการ (${activeQuests.length})</h5>` : ''}
          ${activeQuests.map(renderCard).join('')}
          
          ${completedQuests.length > 0 ? `
            <details open style="margin-top:10px; border-top:2px dashed #000; padding-top:10px;">
              <summary style="font-family:'Press Start 2P'; font-size:0.55rem; color:#10b981; cursor:pointer; user-select:none; margin-bottom:8px;">
                🏆 เควสที่ปลดล็อกสำเร็จแล้ว (${completedQuests.length}) ▾
              </summary>
              <div style="display:flex; flex-direction:column; gap:8px; margin-top:6px;">
                ${completedQuests.map(renderCard).join('')}
              </div>
            </details>
          ` : ''}
        </div>
      `;
    }

    container.innerHTML = html;
  }

  toggleAchievement(id) {
    const item = this.achievements.find(a => a && a.id === id);
    if (item) {
      item.completed = !item.completed;
      this.saveAchievements();
      this.renderAchievements();
    }
  }

  addCustomAchievement(title) {
    if (!title || !title.trim()) return;
    const newAch = {
      id: 'custom-' + Date.now(),
      title: '🎯 ' + title.trim(),
      desc: 'เควสส่วนตัวกำหนดเอง',
      completed: false,
      isCustom: true
    };
    this.achievements.push(newAch);
    this.saveAchievements();
    this.renderAchievements();
  }

  deleteCustomAchievement(id) {
    this.achievements = this.achievements.filter(a => a && a.id !== id);
    this.saveAchievements();
    this.renderAchievements();
  }

  /* ✏️ OPEN SUB-ASSET EDIT MODAL (DIME SYNC SYSTEM) */
  openAssetEditModal(portId, assetIdx) {
    const p = this.portfolios.find(x => x && x.id === portId);
    if (!p || !p.assets || !p.assets[assetIdx]) return;
    const a = p.assets[assetIdx];

    const shares = a.shares !== undefined ? Number(a.shares) : 1;
    const costBasis = Number(a.costBasis) || Number(a.value) || 0;
    const costPrice = Number(a.costPrice) || (shares > 0 ? costBasis / shares : costBasis);
    const val = Number(a.value) || 0;
    const currPrice = Number(a.currentPrice) || (shares > 0 ? val / shares : val);

    document.getElementById('asset-edit-port-id').value = portId;
    document.getElementById('asset-edit-index').value = assetIdx;
    document.getElementById('asset-edit-name').value = a.name || '';
    document.getElementById('asset-edit-shares').value = shares;
    document.getElementById('asset-edit-cost-price').value = costPrice > 0 ? costPrice : '';
    document.getElementById('asset-edit-curr-price').value = currPrice > 0 ? currPrice : '';
    document.getElementById('asset-edit-market-val').value = val > 0 ? val : '';
    const targetPctEl = document.getElementById('asset-edit-target-pct');
    if (targetPctEl) targetPctEl.value = (a.targetPct !== undefined && a.targetPct !== null) ? a.targetPct : '';

    const rate = this.exchangeRate || 32.90;

    const updatePreview = (e) => {
      const targetId = e && e.target ? e.target.id : '';
      const sh = Number(document.getElementById('asset-edit-shares')?.value) || 0;
      let currP = Number(document.getElementById('asset-edit-curr-price')?.value) || 0;
      let costP = Number(document.getElementById('asset-edit-cost-price')?.value) || 0;
      let marketVal = Number(document.getElementById('asset-edit-market-val')?.value) || 0;

      if (targetId === 'asset-edit-curr-price' || (targetId === 'asset-edit-shares' && currP > 0)) {
        if (sh > 0 && currP > 0) {
          marketVal = sh * currP;
          const valInput = document.getElementById('asset-edit-market-val');
          if (valInput) valInput.value = marketVal.toFixed(2);
        }
      } else if (targetId === 'asset-edit-market-val') {
        if (sh > 0 && marketVal > 0) {
          currP = marketVal / sh;
          const currInput = document.getElementById('asset-edit-curr-price');
          if (currInput) currInput.value = currP.toFixed(2);
        }
      }

      if (marketVal <= 0 && sh > 0 && currP > 0) marketVal = sh * currP;
      const totalCost = costP > 0 ? sh * costP : marketVal;
      const totalPL = marketVal - totalCost;
      const pctPL = (costP > 0 && currP > 0) ? (((currP - costP) / costP) * 100) : (totalCost > 0 ? (totalPL / totalCost) * 100 : 0);
      const isProfit = totalPL >= 0;
      const totalPLTHB = totalPL * rate;

      const costEl = document.getElementById('preview-total-cost');
      const valEl = document.getElementById('preview-current-val');
      const plEl = document.getElementById('preview-total-pl');

      if (costEl) costEl.textContent = `$${totalCost.toFixed(2)} (${(totalCost * rate).toFixed(2)} ฿)`;
      if (valEl) valEl.textContent = `$${marketVal.toFixed(2)} (${(marketVal * rate).toFixed(2)} ฿)`;
      if (plEl) {
        const sign = isProfit ? '+' : '';
        const arrow = isProfit ? '↗ ' : '↘ ';
        plEl.textContent = `${sign}$${totalPL.toFixed(2)} (${sign}${totalPLTHB.toFixed(2)} ฿) ${arrow}${sign}${pctPL.toFixed(2)}%`;
        plEl.style.color = isProfit ? '#10b981' : '#ef4444';
      }
    };

    ['asset-edit-shares', 'asset-edit-curr-price', 'asset-edit-cost-price', 'asset-edit-market-val'].forEach(id => {
      const input = document.getElementById(id);
      if (input) input.oninput = updatePreview;
    });

    const btnFetchEdit = document.getElementById('btn-fetch-edit-price');
    if (btnFetchEdit) {
      btnFetchEdit.onclick = async () => {
        const sym = (document.getElementById('asset-edit-name')?.value || '').trim().toUpperCase();
        if (!sym) {
          alert('❌ โปรดระบุชื่อย่อ Ticker ก่อนกดดึงราคาครับ');
          return;
        }
        btnFetchEdit.innerText = '⏳...';
        const price = await this.fetchSingleTickerPrice(sym);
        btnFetchEdit.innerText = '🔄 ดึงราคาตลาดสด';
        if (price && price > 0) {
          const currPriceInput = document.getElementById('asset-edit-curr-price');
          if (currPriceInput) currPriceInput.value = price;
          updatePreview({ target: currPriceInput });
          this.showRetroToast(`🎯 ดึงราคาตลาดสด ${sym} สำเร็จ: $${price.toFixed(2)}`, 'success');
        } else {
          this.showRetroToast(`⚠️ ไม่สามารถดึงราคา ${sym} ได้ โปรดกรอกราคาเองครับ`, 'error');
        }
      };
    }

    updatePreview();
    const modal = document.getElementById('asset-edit-modal');
    if (modal) modal.classList.remove('hidden');
  }

  handleSaveAssetEdit() {
    const portId = document.getElementById('asset-edit-port-id').value;
    const idx = Number(document.getElementById('asset-edit-index').value);
    const p = this.portfolios.find(x => x && x.id === portId);
    if (!p || !p.assets || !p.assets[idx]) return;

    const name = document.getElementById('asset-edit-name').value.trim().toUpperCase();
    const shares = Number(document.getElementById('asset-edit-shares').value) || 1;
    let currPrice = Number(document.getElementById('asset-edit-curr-price').value) || 0;
    let costPrice = Number(document.getElementById('asset-edit-cost-price').value) || 0;
    let marketVal = Number(document.getElementById('asset-edit-market-val').value) || 0;

    if (marketVal <= 0 && currPrice > 0 && shares > 0) marketVal = shares * currPrice;
    if (currPrice <= 0 && marketVal > 0 && shares > 0) currPrice = marketVal / shares;

    const targetPctVal = document.getElementById('asset-edit-target-pct')?.value;
    const targetPct = (targetPctVal !== undefined && targetPctVal !== '') ? Number(targetPctVal) : p.assets[idx].targetPct;

    if (!name) { alert('❌ โปรดระบุชื่อ Ticker สินทรัพย์!'); return; }

    p.assets[idx] = {
      name: name,
      shares: shares,
      costPrice: costPrice,
      costBasis: costPrice > 0 ? shares * costPrice : (p.assets[idx].costBasis || marketVal),
      currentPrice: currPrice,
      value: marketVal,
      targetPct: targetPct
    };

    this.saveState();
    this.closeModals();
    this.refreshUI();
    this.showRetroToast(`🎯 แก้ไขสินทรัพย์ย่อย "${name}" สำเร็จ!`, 'success');
  }

  openAssetAddModal(portId) {
    let p = this.portfolios.find(x => x && x.id === portId);
    if (!p && this.portfolios.length > 0) p = this.portfolios.find(x => x && x.id === this.selectedPortId) || this.portfolios[0];
    if (!p) return;

    document.getElementById('asset-add-port-id').value = p.id;
    const nameEl = document.getElementById('asset-add-port-name');
    if (nameEl) nameEl.textContent = p.name;

    const nameInput = document.getElementById('asset-add-name');
    const sharesInput = document.getElementById('asset-add-shares');
    const currPriceInput = document.getElementById('asset-add-curr-price');
    const costPriceInput = document.getElementById('asset-add-cost-price');
    const costInput = document.getElementById('asset-add-cost');
    const thbInput = document.getElementById('asset-add-thb');
    const valInput = document.getElementById('asset-add-value');
    const targetPctInput = document.getElementById('asset-add-target-pct');

    if (nameInput) nameInput.value = '';
    if (sharesInput) sharesInput.value = '1';
    if (currPriceInput) currPriceInput.value = '';
    if (costPriceInput) costPriceInput.value = '';
    if (costInput) costInput.value = '';
    if (thbInput) thbInput.value = '';
    if (valInput) valInput.value = '';
    if (targetPctInput) targetPctInput.value = '';

    const rate = this.exchangeRate || 32.90;

    const updateAddPreview = (e) => {
      const targetId = e && e.target ? e.target.id : '';
      const sh = Number(document.getElementById('asset-add-shares')?.value) || 0;
      let currP = Number(document.getElementById('asset-add-curr-price')?.value) || 0;
      let costP = Number(document.getElementById('asset-add-cost-price')?.value) || 0;
      let cost = Number(document.getElementById('asset-add-cost')?.value) || 0;
      let val = Number(document.getElementById('asset-add-value')?.value) || 0;
      let thb = Number(document.getElementById('asset-add-thb')?.value) || 0;

      // 1. Two-way binding for Market Price ↔ Total Value ↔ THB
      if (targetId === 'asset-add-curr-price' || (targetId === 'asset-add-shares' && currP > 0)) {
        if (sh > 0 && currP > 0) {
          val = sh * currP;
          if (valInput) valInput.value = val.toFixed(2);
          if (thbInput) thbInput.value = (val * rate).toFixed(2);
        }
      } else if (targetId === 'asset-add-value') {
        if (sh > 0 && val > 0) {
          currP = val / sh;
          if (currPriceInput) currPriceInput.value = currP.toFixed(2);
          if (thbInput) thbInput.value = (val * rate).toFixed(2);
        }
      } else if (targetId === 'asset-add-thb') {
        if (thb > 0) {
          val = thb / rate;
          if (valInput) valInput.value = val.toFixed(2);
          if (sh > 0) {
            currP = val / sh;
            if (currPriceInput) currPriceInput.value = currP.toFixed(2);
          }
        }
      }

      // 2. Two-way binding for Cost Price ↔ Total Cost
      if (targetId === 'asset-add-cost-price' || (targetId === 'asset-add-shares' && costP > 0)) {
        if (sh > 0 && costP > 0) {
          cost = sh * costP;
          if (costInput) costInput.value = cost.toFixed(4);
        }
      } else if (targetId === 'asset-add-cost') {
        if (sh > 0 && cost > 0) {
          costP = cost / sh;
          if (costPriceInput) costPriceInput.value = costP.toFixed(4);
        }
      }

      // Fallbacks
      if (val <= 0 && sh > 0 && currP > 0) val = sh * currP;
      if (cost <= 0 && sh > 0 && costP > 0) cost = sh * costP;
      if (cost <= 0) cost = val;

      const cCostPrice = costP > 0 ? costP : (sh > 0 ? cost / sh : cost);
      const cPrice = currP > 0 ? currP : (sh > 0 ? val / sh : val);
      const diff = val - cost;
      const pct = (cCostPrice > 0 && cPrice > 0) ? (((cPrice - cCostPrice) / cCostPrice) * 100) : (cost > 0 ? (diff / cost) * 100 : 0);
      const isProfit = diff >= 0;
      const diffTHB = diff * rate;

      const pVal = document.getElementById('asset-add-preview-val');
      const pCost = document.getElementById('asset-add-preview-cost');
      const pPl = document.getElementById('asset-add-preview-pl');

      if (pVal) pVal.textContent = `$${val.toFixed(2)} (${(val * rate).toFixed(2)} ฿)`;
      if (pCost) pCost.textContent = `$${cost.toFixed(4)} (${(cost * rate).toFixed(2)} ฿)`;
      if (pPl) {
        const sign = isProfit ? '+' : '';
        const arrow = isProfit ? '↗ ' : '↘ ';
        pPl.textContent = `${sign}$${diff.toFixed(2)} (${sign}${diffTHB.toFixed(2)} ฿) ${arrow}${sign}${pct.toFixed(2)}%`;
        pPl.style.color = isProfit ? '#10b981' : '#ef4444';
      }
    };

    ['asset-add-shares', 'asset-add-curr-price', 'asset-add-cost-price', 'asset-add-cost', 'asset-add-value', 'asset-add-thb'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.oninput = updateAddPreview;
    });

    const btnFetchAdd = document.getElementById('btn-fetch-add-price');
    if (btnFetchAdd) {
      btnFetchAdd.onclick = async () => {
        const sym = (nameInput?.value || '').trim().toUpperCase();
        if (!sym) {
          alert('❌ โปรดระบุชื่อย่อ Ticker ก่อนกดดึงราคาครับ (เช่น WMT, NVDA, BTC)');
          return;
        }
        btnFetchAdd.innerText = '⏳ กำลังดึง...';
        const price = await this.fetchSingleTickerPrice(sym);
        btnFetchAdd.innerText = '🔄 ดึงราคาตลาดสด';
        if (price && price > 0) {
          if (currPriceInput) currPriceInput.value = price;
          updateAddPreview({ target: currPriceInput });
          this.showRetroToast(`🎯 ดึงราคาตลาดสด ${sym} สำเร็จ: $${price.toFixed(2)}`, 'success');
        } else {
          this.showRetroToast(`⚠️ ไม่สามารถดึงราคาตลาดสด ${sym} ได้ในขณะนี้ โปรดกรอกราคาเองครับ`, 'error');
        }
      };
    }

    if (nameInput) {
      nameInput.onchange = async () => {
        const sym = (nameInput.value || '').trim().toUpperCase();
        if (sym && !currPriceInput.value) {
          const price = await this.fetchSingleTickerPrice(sym);
          if (price && price > 0) {
            currPriceInput.value = price;
            updateAddPreview({ target: currPriceInput });
            this.showRetroToast(`🎯 ดึงราคาตลาดสด ${sym} อัตโนมัติ: $${price.toFixed(2)}`, 'success');
          }
        }
      };
    }

    updateAddPreview();
    const modal = document.getElementById('asset-add-modal');
    if (modal) modal.classList.remove('hidden');
    if (nameInput) setTimeout(() => nameInput.focus(), 100);
  }

  handleSaveAssetAdd(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (this._isSavingAsset) return;
    this._isSavingAsset = true;

    try {
      const portId = document.getElementById('asset-add-port-id')?.value;
      let p = this.portfolios.find(x => x && x.id === portId);
      if (!p && this.portfolios.length > 0) p = this.portfolios.find(x => x && x.id === this.selectedPortId) || this.portfolios[0];
      if (!p) { alert('❌ ไม่พบตลับพอร์ตเพื่อบันทึก'); return; }

      const name = (document.getElementById('asset-add-name')?.value || '').trim().toUpperCase();
      const shares = Number(document.getElementById('asset-add-shares')?.value) || 1;
      let currPrice = Number(document.getElementById('asset-add-curr-price')?.value) || 0;
      let costPrice = Number(document.getElementById('asset-add-cost-price')?.value) || 0;
      let val = Number(document.getElementById('asset-add-value')?.value) || 0;
      const thb = Number(document.getElementById('asset-add-thb')?.value) || 0;

      if (val <= 0 && currPrice > 0 && shares > 0) {
        val = shares * currPrice;
      } else if (val <= 0 && thb > 0) {
        val = thb / (this.exchangeRate || 32.90);
      }

      let costStr = document.getElementById('asset-add-cost')?.value;
      let costBasis = costStr !== '' && costStr !== undefined && !isNaN(Number(costStr)) && Number(costStr) > 0 
        ? Number(costStr) 
        : (costPrice > 0 ? shares * costPrice : val);

      if (isNaN(costPrice) || costPrice <= 0) {
        costPrice = shares > 0 ? costBasis / shares : costBasis;
      }
      if (isNaN(currPrice) || currPrice <= 0) {
        currPrice = shares > 0 ? val / shares : val;
      }

      if (!name) { alert('❌ โปรดระบุชื่อ Ticker สินทรัพย์ย่อย!'); return; }
      if (val < 0) { alert('❌ โปรดระบุมูลค่าสินทรัพย์ให้ถูกต้อง!'); return; }

      const targetPctVal = document.getElementById('asset-add-target-pct')?.value;
      const targetPct = targetPctVal !== undefined && targetPctVal !== '' ? Number(targetPctVal) : undefined;

      if (!Array.isArray(p.assets)) p.assets = [];

      const existingIdx = p.assets.findIndex(a => a && a.name && a.name.trim().toUpperCase() === name);
      if (existingIdx >= 0) {
        p.assets[existingIdx] = {
          name: name,
          shares: shares,
          costPrice: costPrice,
          costBasis: costBasis,
          currentPrice: currPrice,
          value: val,
          targetPct: targetPct !== undefined ? targetPct : p.assets[existingIdx].targetPct
        };
        this.showRetroToast(`🎯 อัปเดตข้อมูลสินทรัพย์ "${name}" ในพอร์ต "${p.name}" เรียบร้อย!`, 'success');
      } else {
        p.assets.push({
          name: name,
          shares: shares,
          costPrice: costPrice,
          costBasis: costBasis,
          currentPrice: currPrice,
          value: val,
          targetPct: targetPct
        });
        this.showRetroToast(`💎 เพิ่มสินทรัพย์ย่อย "${name}" เข้าพอร์ต "${p.name}" สำเร็จ!`, 'success');
      }
    } catch (err) {
      console.error('Error in handleSaveAssetAdd:', err);
    } finally {
      this.saveState();
      const modal = document.getElementById('asset-add-modal');
      if (modal) modal.classList.add('hidden');
      this.closeModals();
      this.refreshUI();
      setTimeout(() => { this._isSavingAsset = false; }, 300);
    }
  }

  deletePortfolio(portId) {
    const p = this.portfolios.find(x => x && x.id === portId);
    if (!p) return;
    if (confirm(`⚠️ ยืนยันการทำลายตลับพอร์ต "${p.name}"? การดำเนินการนี้ไม่สามารถย้อนกลับได้`)) {
      this.portfolios = this.portfolios.filter(x => x.id !== portId);
      this.selectedPortId = this.portfolios.length > 0 ? this.portfolios[0].id : '';
      this.saveState(); this.refreshUI();
    }
  }

  inlineEditCategory(id) {
    const p = this.portfolios.find(x => x && x.id === id);
    if (!p) return;
    const currentCat = p.category || '';
    const newCat = prompt(`✏️ แก้ไขหมวดหมู่ของพอร์ต "${p.name}" เป็น:`, currentCat);
    if (newCat !== null && newCat.trim() !== "") {
      p.category = newCat.trim();
      this.saveState(); this.refreshUI();
    }
  }

  inlineEditGoal(id) {
    this.openCashEditModal(id, 'goal');
  }

  inlineEditCashBuffer(id) {
    this.openCashEditModal(id, 'cashBuffer');
  }

  inlineEditDryPowder(id) {
    this.openCashEditModal(id, 'dryPowder');
  }

  openCashEditModal(portId, editType) {
    const p = this.portfolios.find(x => x && x.id === portId);
    if (!p) return;

    const rate = this.exchangeRate || 33.16;
    document.getElementById('cash-edit-port-id').value = portId;
    document.getElementById('cash-edit-type').value = editType;

    const rateLbl = document.getElementById('cash-edit-rate-label');
    if (rateLbl) rateLbl.textContent = `1 USD = ${rate.toFixed(2)} THB`;

    const titleEl = document.getElementById('cash-edit-modal-title');
    let currentUsd = 0;

    if (editType === 'cashBuffer') {
      if (titleEl) titleEl.textContent = `💵 แก้ไขเงินสดสำรอง (Cash Buffer): ${p.name}`;
      currentUsd = Number(p.cashBuffer) || 0;
    } else if (editType === 'dryPowder') {
      if (titleEl) titleEl.textContent = `🎯 แก้ไขเงินสดรอช้อน (Dry Powder): ${p.name}`;
      currentUsd = Number(p.dryPowder) || 0;
    } else if (editType === 'goal') {
      if (titleEl) titleEl.textContent = `🎯 แก้ไขเป้าหมายเงินสะสม (Goal): ${p.name}`;
      currentUsd = Number(p.goal) || 0;
    }

    const currentThb = currentUsd * rate;
    const usdInput = document.getElementById('cash-edit-usd-input');
    const thbInput = document.getElementById('cash-edit-thb-input');

    if (usdInput) usdInput.value = currentUsd > 0 ? currentUsd : '';
    if (thbInput) thbInput.value = currentThb > 0 ? Math.round(currentThb) : '';

    const updateCashPreview = () => {
      const usdVal = Number(document.getElementById('cash-edit-usd-input').value) || 0;
      const thbVal = usdVal * rate;
      const previewUsd = document.getElementById('cash-edit-preview-usd');
      const previewThb = document.getElementById('cash-edit-preview-thb');

      if (previewUsd) previewUsd.textContent = `$${usdVal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
      if (previewThb) previewThb.textContent = `฿${Math.round(thbVal).toLocaleString()} บาท`;
    };

    if (thbInput) {
      thbInput.oninput = () => {
        const thb = Number(thbInput.value) || 0;
        const usd = thb > 0 ? (thb / rate) : 0;
        if (usdInput) usdInput.value = usd > 0 ? usd.toFixed(2) : '';
        updateCashPreview();
      };
    }

    if (usdInput) {
      usdInput.oninput = () => {
        const usd = Number(usdInput.value) || 0;
        const thb = usd * rate;
        if (thbInput) thbInput.value = thb > 0 ? Math.round(thb) : '';
        updateCashPreview();
      };
    }

    updateCashPreview();
    const modal = document.getElementById('cash-edit-modal');
    if (modal) modal.classList.remove('hidden');
  }

  handleSaveCashEdit(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    try {
      const portIdInput = document.getElementById('cash-edit-port-id');
      const editTypeInput = document.getElementById('cash-edit-type');
      
      if (!portIdInput || !editTypeInput) return;
      const portId = portIdInput.value;
      const editType = editTypeInput.value;

      let p = this.portfolios.find(x => x && (x.id === portId || (x.id || '').toLowerCase() === (portId || '').toLowerCase()));
      if (!p && this.portfolios.length > 0) {
        p = this.portfolios.find(x => x && x.id === this.selectedPortId) || this.portfolios[0];
      }
      if (!p) {
        alert('❌ ไม่พบตลับพอร์ตเพื่อบันทึก');
        return;
      }

      let usdVal = Number(document.getElementById('cash-edit-usd-input')?.value);
      if (isNaN(usdVal) || usdVal < 0) {
        const thbVal = Number(document.getElementById('cash-edit-thb-input')?.value) || 0;
        const rate = this.exchangeRate || 33.16;
        usdVal = thbVal > 0 ? (thbVal / rate) : 0;
      }

      if (editType === 'cashBuffer') {
        p.cashBuffer = usdVal;
        this.showRetroToast(`💵 บันทึกเงินสดสำรอง "${p.name}" เป็น $${usdVal.toFixed(2)} เรียบร้อย!`, 'success');
      } else if (editType === 'dryPowder') {
        p.dryPowder = usdVal;
        this.showRetroToast(`🎯 บันทึกเงินสดรอช้อน "${p.name}" เป็น $${usdVal.toFixed(2)} เรียบร้อย!`, 'success');
      } else if (editType === 'goal') {
        p.goal = usdVal;
        if (usdVal > 0) p.goalType = 'numeric';
        this.showRetroToast(`🎯 บันทึกเป้าหมาย "${p.name}" เป็น $${usdVal.toFixed(2)} เรียบร้อย!`, 'success');
      }
    } catch (err) {
      console.error('Error in handleSaveCashEdit:', err);
    } finally {
      this.saveState();
      const modal = document.getElementById('cash-edit-modal');
      if (modal) modal.classList.add('hidden');
      this.closeModals();
      this.refreshUI();
    }
  }

  modularDepositAsset(portId, assetIdx) {
    const p = this.portfolios.find(x => x && x.id === portId);
    if (p && p.assets && p.assets[assetIdx]) {
      const amount = prompt(`📥 [ฝากเสบียงเพิ่ม/➕] ระบุจำนวนเงินต้น ($ USD) ที่ต้องการเติมเข้าช่อง "${p.assets[assetIdx].name}":`);
      if (amount !== null && !isNaN(Number(amount)) && Number(amount) > 0) {
        const numAmt = Number(amount);
        p.assets[assetIdx].value += numAmt;
        p.assets[assetIdx].costBasis = (p.assets[assetIdx].costBasis || (p.assets[assetIdx].value - numAmt)) + numAmt;
        this.saveState(); this.refreshUI();
      }
    }
  }

  modularWithdrawAsset(portId, assetIdx) {
    const p = this.portfolios.find(x => x && x.id === portId);
    if (p && p.assets && p.assets[assetIdx]) {
      const amount = prompt(`📤 [ถอนเสบียงออก/➖] ระบุจำนวนเงิน ($ USD) ที่ต้องการหักออกจากช่อง "${p.assets[assetIdx].name}":`);
      if (amount !== null && !isNaN(Number(amount)) && Number(amount) > 0) {
        if (p.assets[assetIdx].value < Number(amount)) {
          alert('❌ จำนวนเงินถอนออกมากกว่าเสบียงคงเหลือในตลับสินทรัพย์ย่อยครับ');
          return;
        }
        const numAmt = Number(amount);
        p.assets[assetIdx].value -= numAmt;
        p.assets[assetIdx].costBasis = Math.max(0, (p.assets[assetIdx].costBasis || p.assets[assetIdx].value) - numAmt);
        this.saveState(); this.refreshUI();
      }
    }
  }

  switchPortfolio(id) {
    if (this.isDraggingMemoryCard) return;
    this.selectedPortId = id;
    this.refreshUI();
  }

  deleteAsset(id, idx) { 
    const p = this.portfolios.find(x => x && x.id === id);
    if (p && p.assets && p.assets[idx]) { 
      if (confirm(`ลบสินทรัพย์ย่อย "${p.assets[idx].name}" หรือไม่?`)) { 
        p.assets.splice(idx, 1);
        this.saveState(); this.refreshUI(); 
      } 
    } 
  }

  getQuarterlyYearsList() {
    const years = new Set([new Date().getFullYear()]);
    if (Array.isArray(this.quarterlyRecords)) {
      this.quarterlyRecords.forEach(r => { if (r && r.year) years.add(r.year); });
    }
    years.add(this.quarterlyViewYear);
    return Array.from(years).sort((a, b) => b - a);
  }

  getQuarterGrowth(cur, flow, prev) {
    if (!cur || cur <= 0) return { text: '-', cls: 'text-muted', pct: null };
    if (!prev || prev <= 0) return { text: 'Base', cls: 'text-muted', pct: null };
    const pct = ((cur - flow - prev) / prev) * 100;
    return { text: (pct >= 0 ? '+' : '') + pct.toFixed(2) + '%', cls: pct >= 0 ? 'text-success' : 'text-danger', pct };
  }

  getGlobalQuarterSummary(stockPorts, year) {
    const sums = { q1: 0, q2: 0, q3: 0, q4: 0 };
    stockPorts.forEach(p => {
      if (!p) return;
      const r = this.quarterlyRecords.find(x => x && x.portfolioId === p.id && x.year === year);
      if (!r) return;
      sums.q1 += (r.q1 || 0); sums.q2 += (r.q2 || 0);
      sums.q3 += (r.q3 || 0); sums.q4 += (r.q4 || 0);
    });
    const growth = this.getQuarterGrowth(sums.q2, 0, sums.q1);
    return { ...sums, growth };
  }

  renderQuarterly(container) {
    const stockPorts = Array.isArray(this.portfolios) ? this.portfolios.filter(p => p && (p.category || '').toLowerCase() !== 'option') : [];
    if (stockPorts.length === 0) { container.innerHTML = '<div class="border-pixel" style="padding:20px; background:#1f273e;">ไม่มีรายการหุ้นรายไตรมาส (โปรดตั้งค่าเปิดตลับพอร์ตหลักก่อนครับ)</div>'; return; }

    const year = this.quarterlyViewYear;
    const years = this.getQuarterlyYearsList();
    const summary = this.getGlobalQuarterSummary(stockPorts, year);
    const fmtQ = (v) => v > 0 ? `$${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '$0.00';

    const headerHtml = `
      <div class="border-pixel" style="padding:14px 16px; background:#1f273e; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div>
          <h3 style="font-family:'Press Start 2P'; font-size:0.8rem; margin:0;">🗓️ หุ้นรายไตรมาส ($ USD)</h3>
          <p class="text-muted" style="font-size:0.78rem; margin:4px 0 0 0;">ติดตามประวัติการเติบโตของพอร์ตการลงทุนรายไตรมาส</p>
        </div>
        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
          <select id="quarterly-year-select" class="input-retro" style="width:auto; padding:6px 8px;">
            ${years.map(y => `<option value="${y}" ${y === year ? 'selected' : ''}>ปี ${y}</option>`).join('')}
          </select>
          <button class="btn btn-retro ${this.quarterlyViewMode === 'card' ? 'btn-primary' : 'btn-secondary'}" id="btn-quarterly-view-card" style="padding:6px 10px;">🖼️ Card View</button>
          <button class="btn btn-retro ${this.quarterlyViewMode === 'table' ? 'btn-primary' : 'btn-secondary'}" id="btn-quarterly-view-table" style="padding:6px 10px;">📊 Table View</button>
        </div>
      </div>

      <div class="border-pixel" style="padding:14px 16px; background:#111625; margin-top:14px;">
        <h5 style="font-family:'Press Start 2P'; font-size:0.6rem; color:var(--color-accent); margin-bottom:10px;">🌍 GLOBAL QUARTER SUMMARY (รวมทุกพอร์ต)</h5>
        <div style="display:grid; grid-template-columns:repeat(4, 1fr) auto; gap:10px; align-items:center;">
          <div class="border-pixel-inset" style="padding:8px; text-align:center; background:#1f273e;"><b style="color:var(--color-accent); font-size:0.7rem;">Q1 รวม</b><div style="font-size:0.9rem; font-weight:bold;">${fmtQ(summary.q1)}</div></div>
          <div class="border-pixel-inset" style="padding:8px; text-align:center; background:#1f273e;"><b style="color:var(--color-success); font-size:0.7rem;">Q2 รวม</b><div style="font-size:0.9rem; font-weight:bold;">${fmtQ(summary.q2)}</div></div>
          <div class="border-pixel-inset" style="padding:8px; text-align:center; background:#1f273e;"><b style="color:var(--color-secondary); font-size:0.7rem;">Q3 รวม</b><div style="font-size:0.9rem; font-weight:bold;">${fmtQ(summary.q3)}</div></div>
          <div class="border-pixel-inset" style="padding:8px; text-align:center; background:#1f273e;"><b style="color:var(--color-accent); font-size:0.7rem;">Q4 รวม</b><div style="font-size:0.9rem; font-weight:bold;">${fmtQ(summary.q4)}</div></div>
          <div class="border-pixel-inset" style="padding:8px 14px; text-align:center; background:#1f273e;"><b style="font-size:0.65rem;">GROWTH (Q2 vs Q1)</b><div style="font-size:1rem; font-weight:bold;" class="${summary.growth.cls}">${summary.growth.text}</div></div>
        </div>
      </div>`;

    const bodyHtml = this.quarterlyViewMode === 'table'
      ? this.renderQuarterlyTable(stockPorts, year)
      : this.renderQuarterlyCards(stockPorts, year);

    container.innerHTML = `<div style="display:flex; flex-direction:column; gap:0;">${headerHtml}<div style="margin-top:16px;">${bodyHtml}</div></div>`;

    const yearSelect = document.getElementById('quarterly-year-select');
    if (yearSelect) yearSelect.addEventListener('change', (e) => { this.quarterlyViewYear = Number(e.target.value); this.refreshUI(); });
    const btnCard = document.getElementById('btn-quarterly-view-card');
    if (btnCard) btnCard.addEventListener('click', () => { this.quarterlyViewMode = 'card'; localStorage.setItem('ps_quarterly_view_mode_v4', 'card'); this.refreshUI(); });
    const btnTable = document.getElementById('btn-quarterly-view-table');
    if (btnTable) btnTable.addEventListener('click', () => { this.quarterlyViewMode = 'table'; localStorage.setItem('ps_quarterly_view_mode_v4', 'table'); this.refreshUI(); });
  }

  renderQuarterlyCards(stockPorts, year) {
    return `<div class="quarterly-card-grid">
      ${stockPorts.map((p, idx) => {
        if (!p) return '';
        const r = this.quarterlyRecords.find(x => x && x.portfolioId === p.id && x.year === year);
        const hasAnyData = r && (r.q1 || r.q2 || r.q3 || r.q4);
        const rec = r || { q1: 0, f1: 0, q2: 0, f2: 0, q3: 0, f3: 0, q4: 0, f4: 0, notes: '' };
        const g2 = this.getQuarterGrowth(rec.q2, rec.f2, rec.q1);
        const g3 = this.getQuarterGrowth(rec.q3, rec.f3, rec.q2);
        const g4 = this.getQuarterGrowth(rec.q4, rec.f4, rec.q3);
        const overallGrowth = rec.q1 > 0 && rec.q4 > 0 ? g4 : (rec.q1 > 0 && rec.q3 > 0 ? g3 : (rec.q1 > 0 && rec.q2 > 0 ? g2 : null));
        const maxQ = Math.max(rec.q1 || 0, rec.q2 || 0, rec.q3 || 0, rec.q4 || 0, 1);
        const logoSrc = this.getFolioLogoPath(p, idx);

        const miniBar = (val, color) => `<div class="quarterly-mini-bar-col"><div class="quarterly-mini-bar-fill" style="height:${val > 0 ? Math.max(6, (val / maxQ) * 100) : 2}%; background:${color};"></div></div>`;

        return `
          <div class="border-pixel quarterly-card">
            <div class="quarterly-card-header">
              <span class="quarterly-card-badge">${idx + 1}</span>
              <img src="${logoSrc}" class="quarterly-card-logo" alt="${p.name}" onerror="this.style.display='none';">
              <div>
                <div class="quarterly-card-title">${p.name}</div>
                <div class="quarterly-card-cat text-muted">${p.category}</div>
              </div>
            </div>

            ${hasAnyData ? `
              <div class="quarterly-mini-chart">
                ${miniBar(rec.q1, '#3b82f6')}${miniBar(rec.q2, '#10b981')}${miniBar(rec.q3, '#8b5cf6')}${miniBar(rec.q4, '#f59e0b')}
              </div>
              <div class="quarterly-mini-chart-labels"><span>${(rec.q1 || 0) > 0 ? '$' + rec.q1.toLocaleString() : '-'}</span><span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span></div>
              <div style="display:flex; justify-content:space-between; font-size:0.6rem; color:#64748b; padding:0 2px;">
                <span>-</span><span>${(rec.q2 || 0) > 0 ? '$' + rec.q2.toLocaleString() : '-'}</span><span>${(rec.q3 || 0) > 0 ? '$' + rec.q3.toLocaleString() : '-'}</span><span>${(rec.q4 || 0) > 0 ? '$' + rec.q4.toLocaleString() : '-'}</span>
              </div>
            ` : `
              <div class="quarterly-empty-state">
                <img src="./assets/icons/icon-hourglass.png" alt="⏳" class="quarterly-empty-icon" onerror="this.outerHTML='⏳';">
                <div class="quarterly-empty-title">AWAITING DATA</div>
                <div class="quarterly-empty-sub">รอข้อมูลไตรมาสนี้</div>
              </div>
            `}

            <div class="quarterly-card-growth ${overallGrowth ? overallGrowth.cls : 'text-muted'}">${overallGrowth ? overallGrowth.text : '- -'}</div>

            <div style="display:flex; gap:6px; margin-top:10px;">
              <button class="btn btn-secondary btn-retro btn-small" style="flex:1;" onclick="app.openQuarterlyModal('${p.id}', ${year})">✏️ บันทึกตาราง</button>
              <button class="btn btn-danger btn-retro btn-small" style="background:#ef4444; color:#fff;" onclick="app.openClearQuarterlyModal('${p.id}', ${year})">✖</button>
            </div>
          </div>`;
      }).join('')}
    </div>`;
  }

  renderQuarterlyTable(stockPorts, year) {
    const rows = stockPorts.map((p, idx) => {
      if (!p) return '';
      const r = this.quarterlyRecords.find(x => x && x.portfolioId === p.id && x.year === year) || { q1: 0, f1: 0, q2: 0, f2: 0, q3: 0, f3: 0, q4: 0, f4: 0 };
      const g2 = this.getQuarterGrowth(r.q2, r.f2, r.q1);
      const g3 = this.getQuarterGrowth(r.q3, r.f3, r.q2);
      const g4 = this.getQuarterGrowth(r.q4, r.f4, r.q3);
      const cell = (v, g) => `${v > 0 ? '$' + v.toLocaleString() : '<span class="text-muted">⏳ รอข้อมูล</span>'}${g ? `<div style="font-size:0.65rem;" class="${g.cls}">${g.text}</div>` : ''}`;
      return `
        <tr>
          <td style="padding:8px; border:2px solid #000;">${idx + 1}. ${p.name}</td>
          <td style="padding:8px; border:2px solid #000; text-align:center;">${cell(r.q1 || 0, null)}</td>
          <td style="padding:8px; border:2px solid #000; text-align:center;">${cell(r.q2 || 0, g2)}</td>
          <td style="padding:8px; border:2px solid #000; text-align:center;">${cell(r.q3 || 0, g3)}</td>
          <td style="padding:8px; border:2px solid #000; text-align:center;">${cell(r.q4 || 0, g4)}</td>
          <td style="padding:8px; border:2px solid #000; text-align:center;">
            <button class="btn btn-secondary btn-retro btn-small" onclick="app.openQuarterlyModal('${p.id}', ${year})">✏️</button>
            <button class="btn btn-danger btn-retro btn-small" style="background:#ef4444; color:#fff;" onclick="app.openClearQuarterlyModal('${p.id}', ${year})">✖</button>
          </td>
        </tr>`;
    }).join('');

    return `
      <div class="border-pixel" style="padding:12px; background:#1f273e; overflow-x:auto;">
        <table class="retro-table" style="width:100%; border-collapse:collapse; font-size:0.8rem;">
          <thead><tr style="background:#111625;">
            <th style="padding:8px; border:2px solid #000; text-align:left;">พอร์ต</th>
            <th style="padding:8px; border:2px solid #000;">Q1</th><th style="padding:8px; border:2px solid #000;">Q2</th>
            <th style="padding:8px; border:2px solid #000;">Q3</th><th style="padding:8px; border:2px solid #000;">Q4</th>
            <th style="padding:8px; border:2px solid #000;">จัดการ</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  }

  getFolioLogoPath(portfolio, indexFallback) {
    const name = (portfolio.name || '').toLowerCase();
    const cat = (portfolio.category || '').toLowerCase();
    const table = [
      { keys: ['red wing', 'redwing'], file: 'redwing.png' },
      { keys: ['zero 1', 'zero1'], file: 'zero1.png' },
      { keys: ['zero 2', 'zero2'], file: 'zero2.png' },
      { keys: ['zero 3', 'zero3'], file: 'zero3.png' },
      { keys: ['zero 4', 'zero4'], file: 'zero4.png' },
      { keys: ['zero 5', 'zero5'], file: 'zero5.png' },
      { keys: ['us dividend', 'dividend yield', 'usdividend'], file: 'usdividentyield.png' },
      { keys: ['thai dividend', 'thaidividend'], file: 'thaidivident.png' },
      { keys: ['next gen', 'nextgen'], file: 'nextgen.png' },
      { keys: ['crypto'], file: 'crypto.png' }
    ];
    const byName = table.find(t => t.keys.some(k => name.includes(k)));
    if (byName) return `./assets/foliologo/${byName.file}`;

    if (cat.includes('emergency')) return './assets/foliologo/zero1.png';
    if (cat.includes('retirement')) return './assets/foliologo/zero3.png';
    if (cat.includes('life goal')) return './assets/foliologo/redwing.png';

    const fallbackOrder = ['redwing', 'zero1', 'zero2', 'zero3', 'zero4', 'zero5', 'usdividentyield', 'thaidivident', 'nextgen', 'crypto'];
    const fallback = fallbackOrder[(indexFallback || 0) % fallbackOrder.length];
    return `./assets/foliologo/${fallback}.png`;
  }

  openQuarterlyModal(portfolioId, year) {
    const port = this.portfolios.find(p => p && p.id === portfolioId); if (!port) return;
    document.getElementById('q-port-id').value = portfolioId; 
    document.getElementById('q-year').value = year;
    document.getElementById('q-port-label').innerText = `พอร์ต: ${port.name} (${year})`;
 
    const rec = this.quarterlyRecords.find(r => r && r.portfolioId === portfolioId && r.year === year) || {};
    for (let i = 1; i <= 4; i++) {
      document.getElementById(`q-val-q${i}`).value = rec[`q${i}`] !== undefined ? rec[`q${i}`] : 0;
      document.getElementById(`q-flow-q${i}`).value = rec[`f${i}`] !== undefined ? rec[`f${i}`] : 0;
    }
    document.getElementById('q-notes').value = rec.notes || '';
    document.getElementById('quarterly-modal').classList.remove('hidden');
  }

  handleSaveQuarterly() {
    const portfolioId = document.getElementById('q-port-id').value;
    const year = Number(document.getElementById('q-year').value);
    if (!portfolioId) return;

    let rec = this.quarterlyRecords.find(r => r && r.portfolioId === portfolioId && r.year === year);
    if (!rec) {
      rec = { id: 'q-' + Date.now(), portfolioId, year };
      this.quarterlyRecords.push(rec);
    }

    for (let i = 1; i <= 4; i++) {
      rec[`q${i}`] = Number(document.getElementById(`q-val-q${i}`).value) || 0;
      rec[`f${i}`] = Number(document.getElementById(`q-flow-q${i}`).value) || 0;
    }
    rec.notes = document.getElementById('q-notes').value || '';

    this.saveState();
    this.closeModals();
    this.refreshUI();
  }

  openClearQuarterlyModal(portfolioId, year) {
    const port = this.portfolios.find(p => p && p.id === portfolioId); if (!port) return;
    this.pendingClearQuarterly = { portfolioId, year };
    document.getElementById('clear-quarterly-port-label').innerText = `${port.name} — ปี ${year}`;
    document.getElementById('clear-quarterly-step1').classList.remove('hidden');
    document.getElementById('clear-quarterly-step2').classList.add('hidden');
    document.getElementById('clear-quarterly-confirm-input').value = '';
    document.getElementById('quarterly-clear-modal').classList.remove('hidden');
  }

  goToClearQuarterlyStep2() {
    document.getElementById('clear-quarterly-step1').classList.add('hidden');
    document.getElementById('clear-quarterly-step2').classList.remove('hidden');
  }

  executeClearQuarterly() {
    const typed = (document.getElementById('clear-quarterly-confirm-input').value || '').trim();
    if (typed !== 'DELETE') { alert('❌ กรุณาพิมพ์คำว่า DELETE ให้ตรงตัวอักษรพิมพ์ใหญ่เพื่อยืนยัน'); return; }
    if (!this.pendingClearQuarterly) return;
    const { portfolioId, year } = this.pendingClearQuarterly;
    this.quarterlyRecords = this.quarterlyRecords.filter(r => !(r && r.portfolioId === portfolioId && r.year === year));
    this.pendingClearQuarterly = null;
    this.saveState();
    this.closeModals();
    this.refreshUI();
  }

  renderOptionManual(container) {
    const optionPorts = Array.isArray(this.portfolios) 
      ? this.portfolios.filter(p => p && (p.category || '').toLowerCase().includes('option')) 
      : [];

    const records = Array.isArray(this.monthlyRecords) 
      ? this.monthlyRecords.filter(r => r && optionPorts.map(p => p.id).includes(r.portfolioId)) 
      : [];

    container.innerHTML = `
      <div class="border-pixel" style="padding:15px; background:#1f273e;">
        <h4 style="font-family:'Press Start 2P'; font-size:0.65rem; color:var(--color-accent); margin-bottom:10px; display:flex; align-items:center;">
          <img src="./assets/icons/icon-daimon.png" alt="Diamond" class="card-title-icon"> บันทึกงวดสัญญา Option ($ USD)
        </h4>
        <div style="display:grid; grid-template-columns:1fr 2fr; gap:15px;">
          <div class="border-pixel-inset" style="padding:12px; background:#111625;">
            <label style="font-size:0.8rem;">เลือกพอร์ต:</label>
            <select id="opt-port-select" class="input-retro" style="width:100%; margin-bottom:8px;">
              ${optionPorts.length === 0 
                ? '<option value="">❌ ไม่พบตลับพอร์ต Option</option>' 
                : optionPorts.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
            </select>

            <label style="font-size:0.8rem;">เดือนงวด:</label>
            <select id="opt-month-select" class="input-retro" style="width:100%; margin-bottom:8px;">
              ${[...Array(12).keys()].map(i => `<option value="${i+1}">เดือน ${i+1}</option>`).join('')}
            </select>

            <label style="font-size:0.8rem;">P/L สุทธิ ($ USD):</label>
            <input type="number" id="opt-pl-input" class="input-retro" placeholder="เช่น 150 หรือ -50" style="width:100%; margin-bottom:12px;">

            <button class="btn btn-success btn-retro" id="btn-save-opt-manual" style="width:100%;">
              <span>💾 บันทึกงวดสัญญา</span>
            </button>
          </div>

          <div class="border-pixel-inset" style="padding:12px; background:#111625;">
            <h5 style="display:flex; align-items:center; gap:6px;">
              <img src="./assets/icons/icon-document-chart.png" alt="Log" class="card-title-icon"> ประวัติสัญญารายเดือนย่อย
            </h5>
            <div style="max-height:220px; overflow-y:auto; font-size:0.85rem; margin-top:8px;">
              ${records.length === 0 ? '<p class="text-muted">ไม่มีประวัติคงเหลือ</p>' : records.map(r => `
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #333; padding:6px 0;">
                  <span><b>${this.portfolios.find(x => x && x.id === r.portfolioId)?.name || ''}</b> (เดือน ${r.month})</span>
                  <div style="display:flex; gap:6px; align-items:center;">
                    <b class="${(r.profitLossUSD || 0) >= 0 ? 'text-success' : 'text-danger'}">
                      ${(r.profitLossUSD || 0) >= 0 ? '+' : ''}$${r.profitLossUSD || 0}
                    </b>
                    <button class="btn btn-warning btn-small" onclick="app.inlineEditOption('${r.id}')" style="padding:2px 6px; font-size:0.7rem; color:#000;" title="แก้ไขงวดสัญญา">✏️</button>
                    <button class="btn btn-danger btn-small" onclick="app.deleteOptionRecord('${r.id}')" style="padding:2px 6px; font-size:0.7rem;" title="ลบรายการนี้">✖</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>`;

    const btnSave = document.getElementById('btn-save-opt-manual');
    if (btnSave) {
      btnSave.addEventListener('click', () => {
        const portSelect = document.getElementById('opt-port-select');
        const pId = portSelect ? portSelect.value : '';
        const m = Number(document.getElementById('opt-month-select').value);
        const plInput = document.getElementById('opt-pl-input').value;

        if (!pId) {
          alert('❌ โปรดสร้างพอร์ตหมวดหมู่ "Option" ก่อนบันทึกรายการครับ');
          return;
        }

        if (plInput.trim() === '' || isNaN(Number(plInput))) {
          alert('❌ โปรดระบุตัวเลข P/L สุทธิ ($ USD) ให้ถูกต้อง');
          return;
        }

        const pl = Number(plInput);
        this.monthlyRecords.push({
          id: 'm-' + Date.now(),
          portfolioId: pId,
          year: new Date().getFullYear(),
          month: m,
          profitLossUSD: pl,
          notes: 'Manual'
        });

        this.saveState();
        this.refreshUI();
        alert('🎯 บันทึกงวดสัญญา Option สำเร็จ!');
      });
    }
  }

  inlineEditOption(id) {
    const r = this.monthlyRecords.find(x => x && x.id === id);
    if (!r) return;
    const newPL = prompt(`✏️ ระบุ P/L สุทธิ ($ USD) ใหม่สำหรับงวดเดือน ${r.month}:`, r.profitLossUSD);
    if (newPL !== null && !isNaN(Number(newPL))) {
      r.profitLossUSD = Number(newPL);
      this.saveState();
      this.refreshUI();
    }
  }

  deleteOptionRecord(id) {
    if (confirm('⚠️ คุณต้องการลบประวัติรายการงวดสัญญานี้ใช่หรือไม่?')) {
      this.monthlyRecords = this.monthlyRecords.filter(x => x && x.id !== id);
      this.saveState();
      this.refreshUI();
    }
  }

  renderDividends(container) {
    container.innerHTML = `
      <div class="border-pixel" style="padding:15px; background:#1f273e; display:flex; flex-direction:column; gap:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; flex-wrap:wrap; gap:8px;">
          <h4 style="display:flex; align-items:center; gap:6px;">
            <img src="./assets/icons/icon-coin.png" alt="Coin" class="card-title-icon"> วิเคราะห์ข้อมูลปันผล & Yield on Cost (YOC)
          </h4>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-secondary btn-retro btn-small" onclick="app.exportDividendsToCSV()" style="background:#0284c7; color:#fff;"><span>📊 ส่งออก CSV</span></button>
            <button class="btn btn-success btn-retro btn-small" onclick="document.getElementById('dividend-modal').classList.remove('hidden')">➕ บันทึกปันผล</button>
          </div>
        </div>
        
        <table class="retro-table" style="width:100%; border-collapse:collapse; font-size:0.85rem;">
          <thead>
            <tr style="background:#111625;">
              <th style="padding:8px; border:2px solid #000;">ชื่อพอร์ต</th>
              <th style="padding:8px; border:2px solid #000;">ต้นทุนเงินลงทุนสะสม ($ USD)</th>
              <th style="padding:8px; border:2px solid #000;">รวมรับปันผล ($ USD)</th>
              <th style="padding:8px; border:2px solid #000; color:var(--color-accent);">YOC Score</th>
            </tr>
          </thead>
          <tbody>
            ${(!Array.isArray(this.portfolios) || this.portfolios.length===0)?'<tr><td colspan="4" style="text-align:center;padding:15px;" class="text-muted">ไม่มีพอร์ตลงทุนในคลังคลาวด์</td></tr>':this.portfolios.map(p => {
              if(!p) return '';
              const divs = Array.isArray(this.dividendRecords) ? this.dividendRecords.filter(x=>x && x.portfolioId===p.id).reduce((s,x)=>s+Number(x.amount||0),0) : 0;
              const totalCostBasis = Array.isArray(p.assets) ? p.assets.reduce((sum, a) => sum + (Number(a.costBasis) || Number(a.value) || 0), 0) : (p.current || 0);
              const yoc = totalCostBasis > 0 ? ((divs / totalCostBasis) * 100).toFixed(2) + '%' : 'N/A';
              return `<tr><td style="padding:8px; border:2px solid #000;"><b>${p.name}</b></td><td style="padding:8px; border:2px solid #000;">${this.formatMoney(totalCostBasis, p.category, false)}</td><td style="padding:8px; border:2px solid #000; color:var(--color-success);">${this.formatMoney(divs, p.category, false)}</td><td style="padding:8px; border:2px solid #000; font-weight:bold; color:var(--color-accent); font-family:'Press Start 2P'!important; font-size:0.75rem!important;">${yoc}</td></tr>`;
            }).join('')}
          </tbody>
        </table>

        <div style="margin-top:5px;">
          <h5 style="font-family:'Press Start 2P'; font-size:0.55rem; color:#64748b; margin-bottom:10px; display:flex; align-items:center;">
            <img src="./assets/icons/icon-document-chart.png" alt="Log" class="card-title-icon"> DIVIDEND LOG HISTORY
          </h5>
          <div style="background:#111625; padding:8px; border:2px solid #000; max-height:280px; overflow-y:auto;">
            <table class="retro-table" style="width:100%; border-collapse:collapse; text-align:left;">
              <thead>
                <tr style="background:#0c1020; color:#94a3b8; border-bottom:2px solid #000;">
                  <th style="padding:8px; border:1px solid #000; text-align:center;">วันรับเงิน</th>
                  <th style="padding:8px; border:1px solid #000;">ตลับพอร์ตหลัก</th>
                  <th style="padding:8px; border:1px solid #000;">หมายเหตุ/ชื่อหุ้น</th>
                  <th style="padding:8px; border:1px solid #000; text-align:right; padding-right:10px;">จำนวนเงิน ($ USD)</th>
                  <th style="padding:8px; border:1px solid #000; text-align:center;">ตัวจัดการ</th>
                </tr>
              </thead>
              <tbody>
                ${(!Array.isArray(this.dividendRecords) || this.dividendRecords.length === 0)
                  ? '<tr><td colspan="5" style="text-align:center; padding:20px; color:#64748b;">📭 ไม่พบรายการบัญชีเงินปันผล</td></tr>'
                  : this.dividendRecords.map(r => {
                      if(!r) return '';
                      const p = this.portfolios.find(x => x && x.id === r.portfolioId);
                      const pName = p ? p.name : 'Unknown';
                      const pCat = p ? p.category : 'Global Stock';
                      return `
                      <tr style="border-bottom:1px solid #222;">
                        <td style="padding:8px; border:1px solid #000; text-align:center; font-family:monospace; color:#94a3b8;">${r.date || ''}</td>
                        <td style="padding:8px; border:1px solid #000; color:#fff;"><b>${pName}</b></td>
                        <td style="padding:8px; border:1px solid #000; color:#94a3b8;">${r.notes || '-'}</td>
                        <td style="padding:8px; border:1px solid #000; text-align:right; padding-right:10px; font-weight:bold;">${this.formatMoney(r.amount || 0, pCat, false)}</td>
                        <td style="padding:8px; border:1px solid #000; text-align:center;">
                          <button class="btn btn-warning btn-small" onclick="app.inlineEditDividend('${r.id}')" style="padding:2px 6px; font-size:0.7rem; font-weight:bold; color:#000;">✏️ แก้ไข</button>
                          <button class="btn btn-danger btn-small" onclick="app.deleteDividend('${r.id}')" style="padding:2px 6px; font-size:0.7rem; font-weight:bold; color:#fff; margin-left:4px;">✖ ลบ</button>
                        </td>
                      </tr>`;
                    }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>`;
    const select = document.getElementById('div-port-id'); if(select && Array.isArray(this.portfolios)) select.innerHTML = this.portfolios.map(p=>p?`<option value="${p.id}">${p.name}</option>`:'').join('');
  }

  renderComparison(container) {
    if(!Array.isArray(this.portfolios) || this.portfolios.length===0){ container.innerHTML='<div class="border-pixel" style="padding:20px; background:#1f273e;">ไม่มีตารางเปรียบเทียบ (ตลับเซฟว่างเปล่า)</div>'; return; }
    container.innerHTML = `
      <div class="border-pixel" style="padding:15px; background:#1f273e; overflow-x:auto;">
        <table class="retro-table" style="width:100%; border-collapse:collapse; font-size:0.8rem; text-align:left;">
          <thead><tr style="background:#111625;"><th style="padding:8px; border:2px solid #000;">ชื่อพอร์ต</th><th style="padding:8px; border:2px solid #000;">เป้าหมายรวม ($ USD)</th><th style="padding:8px; border:2px solid #000;">พอร์ตรวมจริง ($ USD)</th><th style="padding:8px; border:2px solid #000;">ส่วนต่างที่ขาด ($ USD)</th><th style="padding:8px; border:2px solid #000; color:var(--color-success); min-width:180px;">เควสสเกล (EXP Bar)</th></tr></thead>
          <tbody>
            ${this.portfolios.map(p => {
              if(!p) return '';
              const curUSD = (p.current||0)+(p.cashBuffer||0); 
              const goalUSD = p.goalType==='numeric'?(p.goal||0):0; 
              const diff = p.goalType==='numeric'?Math.max(goalUSD-curUSD,0):0;
              const pct = p.goalType==='numeric'?(p.goal>0?(curUSD/goalUSD)*100:0):(p.dcaDoneThisMonth?100:0);
              const fillPct = Math.min(100, Math.max(0, pct));
              return `<tr>
                <td style="padding:8px; border:2px solid #000;"><b>${p.name}</b></td>
                <td style="padding:8px; border:2px solid #000;">${p.goalType==='numeric'?this.formatMoney(p.goal||0,p.category, false):p.goalSchedule}</td>
                <td style="padding:8px; border:2px solid #000;">$${curUSD.toLocaleString(undefined,{maximumFractionDigits:2})}</td>
                <td style="padding:8px; border:2px solid #000; color:#ef4444;">${diff>0?'$'+diff.toLocaleString(undefined,{maximumFractionDigits:2}):'✔️ เควสเคลียร์'}</td>
                <td style="padding:8px; border:2px solid #000;">
                  <div style="position:relative; width:100%; height:18px; background:#111625; border:2px solid #000; display:flex; align-items:center; overflow:hidden;">
                    <div style="width:${fillPct}%; background:var(--color-success); height:100%; transition:width 0.4s ease;"></div>
                    <span style="position:absolute; width:100%; text-align:center; font-family:'Press Start 2P'!important; font-size:0.55rem!important; color:#fff; text-shadow:1px 1px 0 #000; z-index:2;">${pct.toFixed(1)}%</span>
                  </div>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>`;
  }

  renderSettings(container) {
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:20px;">
        <div style="display:none;"><input type="number" id="settings-usd-rate-hidden" value="${this.exchangeRate}"></div>

        <div class="border-pixel" style="padding:20px; background:#1f273e; display:flex; flex-direction:column; gap:12px;">
          <h3 style="display:flex; align-items:center; gap:6px;">❄️ DEBT SNOWBALL (ใช้คำนวณ Portfolio Health)</h3>
          <p class="text-muted" style="font-size:0.8rem; color:#94a3b8;">กรอก "ยอดหนี้เริ่มต้น" แค่ครั้งเดียวตอนเริ่มแผน แล้วอัปเดต "ยอดหนี้คงเหลือ" เรื่อยๆ ระบบจะคำนวณ % ความคืบหน้าปลดหนี้ให้อัตโนมัติ</p>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div class="form-group">
              <label for="settings-debt-start">ยอดหนี้เริ่มต้น (THB):</label>
              <input type="number" id="settings-debt-start" class="input-retro" step="any" min="0" value="${this.debtStartTHB || 0}">
            </div>
            <div class="form-group">
              <label for="settings-debt-remaining">ยอดหนี้คงเหลือ (THB):</label>
              <input type="number" id="settings-debt-remaining" class="input-retro" step="any" min="0" value="${this.debtRemainingTHB || 0}">
            </div>
          </div>
          <button class="btn btn-success btn-retro" id="btn-save-debt" style="width:200px;"><span>💾 บันทึกยอดหนี้</span></button>
        </div>

        <div class="border-pixel" style="padding:20px; background:#1f273e; display:flex; flex-direction:column; gap:12px;">
          <h3 style="display:flex; align-items:center; gap:6px;">
            <img src="./assets/icons/icon-gear.png" alt="Settings" class="card-title-icon"> IMPORT DATA (โหลดไฟล์ข้อมูลเข้าคลังบราวเซอร์)
          </h3>
          <p class="text-muted" style="font-size:0.8rem; color:#94a3b8;">เลือกไฟล์สำรองข้อมูล (.json) จากเครื่องของคุณเพื่อกู้คืนฐานข้อมูล:</p>
          <input type="file" id="import-file-input" class="input-retro" accept=".json" style="width:100%; background:#0c1020; color:#fff; border:2px solid #000; padding:8px;">
          <button class="btn btn-success btn-retro" id="btn-execute-file-import" style="width:200px; margin-top:8px;"><span>📥 โหลดฐานข้อมูล</span></button>
        </div>

        <div class="border-pixel" style="padding:20px; background:#1f273e; display:flex; flex-direction:column; gap:12px;">
          <h3>📤 DOWNLOAD BACKUP FOR SECOND BRAIN (ดาวน์โหลดข้อมูลออกไฟล์)</h3>
          <p class="text-muted" style="font-size:0.8rem; color:#94a3b8;">ดาวน์โหลดข้อมูลคลังพอร์ต สถิติไตรมาส และเงินปันผลทั้งหมดออกเป็นไฟล์ JSON:</p>
          <button class="btn btn-primary btn-retro" id="btn-execute-download" style="width:280px; padding:10px;"><span>💾 ดาวน์โหลดไฟล์ JSON สำรองข้อมูล</span></button>
        </div>
        
        <div class="border-pixel" style="padding:20px; background:#1f273e; display:flex; flex-direction:column; gap:12px;">
          <h3>🎮 COMMANDER INITIALIZATION (โหลดตลับพอร์ตเริ่มต้น Q3)</h3>
          <p class="text-muted" style="font-size:0.8rem; color:#94a3b8;">โหลดพอร์ตของระบบทั้ง 10 ตลับพร้อมสินทรัพย์ต่างประเทศตามข้อกำหนด Q3 (RedWing, Zero 1-5, Dividend Yield, THAI Dividend, NEXT GEN, Crypto) เข้าสู่บราวเซอร์:</p>
          <button class="btn btn-warning btn-retro" id="btn-load-commander-presets" style="width:320px; padding:10px;"><span>📥 โหลดตลับพอร์ตของพี่ Commander</span></button>
        </div>

        <div class="border-pixel" style="padding:15px; background:#111625; font-size:0.8rem;">
          📡 สถานะการซิงก์เครือข่าย Firebase Realtime Cloud: 
          <b style="color:${isFirebaseActive ? '#10b981' : '#ef4444'};">
            ${isFirebaseActive ? '🟢 CONNECTED (เชื่อมต่อสำเร็จ)' : '🔴 OFFLINE LOCAL MODE'}
          </b>
        </div>
      </div>
    `;

    document.getElementById('btn-save-debt').addEventListener('click', () => {
      const startVal = Number(document.getElementById('settings-debt-start').value) || 0;
      const remainingVal = Number(document.getElementById('settings-debt-remaining').value) || 0;
      if (remainingVal > startVal && startVal > 0) {
        if (!confirm('⚠️ ยอดหนี้คงเหลือมากกว่ายอดเริ่มต้น ต้องการบันทึกต่อหรือไม่?')) return;
      }
      this.debtStartTHB = startVal;
      this.debtRemainingTHB = remainingVal;
      this.saveState();
      this.refreshUI();
      alert('❄️ บันทึกยอดหนี้เรียบร้อย! Portfolio Health จะอัปเดตให้อัตโนมัติ');
    });

    document.getElementById('btn-execute-file-import').addEventListener('click', () => {
      const fileInput = document.getElementById('import-file-input');
      if (!fileInput.files || fileInput.files.length === 0) {
        alert('❌ โปรดทำการคลิกเลือกไฟล์สำรองข้อมูล JSON ก่อนกดปุ่มนี้ครับ');
        return;
      }
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const p = JSON.parse(e.target.result);
          if (p.portfolios) {
            this.portfolios = Array.isArray(p.portfolios) ? p.portfolios : Object.values(p.portfolios);
            this.quarterlyRecords = Array.isArray(p.quarterlyRecords) ? p.quarterlyRecords : Object.values(p.quarterlyRecords || {});
            this.monthlyRecords = Array.isArray(p.monthlyRecords) ? p.monthlyRecords : Object.values(p.monthlyRecords || {});
            this.dividendRecords = Array.isArray(p.dividendRecords) ? p.dividendRecords : Object.values(p.dividendRecords || {});
            this.exchangeRate = Number(p.exchangeRate) || 36.5;
            this.debtStartTHB = Number(p.debtStartTHB) || 0;
            this.debtRemainingTHB = Number(p.debtRemainingTHB) || 0;
            if (p.achievements) this.achievements = Array.isArray(p.achievements) ? p.achievements : Object.values(p.achievements || {});

            this.selectedPortId = this.portfolios.length > 0 ? this.portfolios[0].id : '';
            this.saveState();
            this.syncStateToCloud();
            this.refreshUI();
            alert('🎯 นำเข้าไฟล์เสร็จสิ้น ข้อมูลคาร์ทริจซิงก์ลงคลาวด์แบบเรียลไทม์เรียบร้อย!');
          } else {
            alert('❌ โครงสร้างไฟล์ไม่ถูกต้อง');
          }
        } catch (err) { alert('❌ ไฟล์เกิดความเสียหาย: ' + err.message); }
      };
      reader.readAsText(file);
    });

    document.getElementById('btn-execute-download').addEventListener('click', () => {
      const currentDataState = {
        portfolios: this.portfolios,
        quarterlyRecords: this.quarterlyRecords,
        monthlyRecords: this.monthlyRecords,
        dividendRecords: this.dividendRecords,
        exchangeRate: this.exchangeRate,
        debtStartTHB: this.debtStartTHB,
        debtRemainingTHB: this.debtRemainingTHB
      };
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentDataState, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `pixel_steward_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });

    document.getElementById('btn-load-commander-presets').addEventListener('click', () => {
      if (!confirm('⚠️ คำเตือน: การโหลดชุดพอร์ตเริ่มต้นนี้จะทับซ้อนพอร์ตที่บราวเซอร์เก็บอยู่ปัจจุบันทั้งหมด ต้องการดำเนินการต่อหรือไม่?')) return;
      this.portfolios = JSON.parse(JSON.stringify(INITIAL_PORTFOLIOS));
      this.selectedPortId = this.portfolios.length > 0 ? this.portfolios[0].id : '';
      this.saveState();
      this.refreshUI();
      alert('🎮 โหลดพอร์ตและสินทรัพย์จำลอง Q3 (ชุดพอร์ต STEWARD) สำเร็จ!');
    });
  }

  handleSavePortfolio() {
    const name = document.getElementById('port-name').value;
    const category = document.getElementById('port-category').value;
    const goalType = document.getElementById('port-goal-type').value;
    const dry = Number(document.getElementById('port-dry-powder').value)||0;
    const newPort = { id:'p-'+Date.now(), name, category, goalType, goal:goalType==='numeric'?Number(document.getElementById('port-goal-value').value)||0:0, goalSchedule:document.getElementById('port-goal-schedule').value, current:0, cashBuffer:0, dryPowder:dry, assets:[], notes:'', dcaDoneThisMonth:false };
    this.portfolios.push(newPort);
    this.selectedPortId = newPort.id;
    this.saveState(); this.closeModals(); this.refreshUI();
  }

  handleExecuteTransfer() {
    const srcId = document.getElementById('tf-source').value;
    const destId = document.getElementById('tf-target').value; 
    const amt = Number(document.getElementById('tf-amount').value); 
    const src = this.portfolios.find(x=>x && x.id===srcId);
    if(!src || src.dryPowder < amt) { alert('❌ กระสุนไม่เพียงพอ'); return; }
    src.dryPowder -= amt;
    if(destId!=='system') {
      const dest = this.portfolios.find(x=>x && x.id===destId);
      if(dest) {
        dest.dryPowder += amt;
      }
    }
    this.saveState(); this.closeModals(); this.refreshUI(); alert('⚡ โยกย้ายจัดสรรเรียบร้อย!');
  }

  handleSaveDividend() {
    const portfolioId = document.getElementById('div-port-id').value;
    const amount = Number(document.getElementById('div-amount').value) || 0;
    const date = document.getElementById('div-date').value;
    const notes = document.getElementById('div-notes').value || '';
    if (!portfolioId || amount <= 0 || !date) { alert('❌ โปรดกรอกข้อมูลให้ครบถ้วนครับ'); return; }
    const newDiv = { id: 'd-' + Date.now(), portfolioId, amount, date, notes };
    this.dividendRecords.push(newDiv);
    this.saveState(); this.closeModals(); this.refreshUI(); alert('💰 บันทึกรับเงินปันผลเข้าคลังสำเร็จ!');
  }

  inlineEditDividend(id) {
    const r = this.dividendRecords.find(x => x && x.id === id);
    if (!r) return;
    const newAmount = prompt(`✏️ ระบุจำนวนตัวเลขเงินปันผล ($ USD) ใหม่ที่ถูกต้อง:`, r.amount);
    if (newAmount !== null && !isNaN(Number(newAmount)) && Number(newAmount) > 0) {
      const newNotes = prompt(`✏️ ระบุโน้ตชื่อหุ้นหรือหมายเหตุใหม่:`, r.notes || '');
      if (newNotes !== null) { r.amount = Number(newAmount); r.notes = newNotes.trim(); this.saveState(); this.refreshUI(); }
    }
  }

  deleteDividend(id) {
    if (confirm('⚠️ คุณต้องการสั่ง "ลบประวัติ" รายการปันผลนี้ใช่หรือไม่?')) {
      this.dividendRecords = this.dividendRecords.filter(x => x && x.id !== id);
      this.saveState(); this.refreshUI(); alert('🗑️ ลบรายการสำเร็จ!');
    }
  }

  openPortfolioModal() { 
    const m = document.getElementById('portfolio-modal');
    if (m) m.classList.remove('hidden'); 
  }

  openCurrencyConverterModal() {
    const modal = document.getElementById('currency-converter-modal');
    if (!modal) return;
    const rateLbl = document.getElementById('modal-live-rate-display');
    if (rateLbl) rateLbl.textContent = `1 USD = ${(this.exchangeRate || 33.16).toFixed(2)} THB`;
    modal.classList.remove('hidden');
  }
  
  openTransferModal() {
    if(!Array.isArray(this.portfolios) || this.portfolios.length===0){ alert('❌ โปรดสร้างตลับพอร์ตเพื่อทำรายการโยกย้ายเสบียง'); return; }
    document.getElementById('tf-source').innerHTML = this.portfolios.map(p=>p?`<option value="${p.id}">${p.name} (Dry: $${p.dryPowder})</option>`:'').join('');
    document.getElementById('tf-target').innerHTML = '<option value="system">ถอนเงินออกนอกคลัง</option>'+this.portfolios.map(p=>p?`<option value="${p.id}">${p.name}</option>`:'').join('');
    document.getElementById('tf-rate').value = this.exchangeRate;
    document.getElementById('transfer-modal').classList.remove('hidden');
  }
  
  closeModals() { 
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden')); 
  }

  showRetroToast(msg, type = 'info') {
    try {
      let toastContainer = document.getElementById('retro-toast-container');
      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'retro-toast-container';
        toastContainer.style.cssText = 'position:fixed; bottom:24px; right:24px; z-index:999999; display:flex; flex-direction:column; gap:8px; pointer-events:none;';
        document.body.appendChild(toastContainer);
      }
      const item = document.createElement('div');
      const borderCol = type === 'success' ? '#10b981' : (type === 'error' ? '#ef4444' : '#38bdf8');
      const bgCol = type === 'success' ? '#064e3b' : (type === 'error' ? '#7f1d1d' : '#0c4a6e');
      item.style.cssText = `background:${bgCol}; color:#fff; border:2px solid ${borderCol}; padding:10px 14px; border-radius:6px; font-size:0.8rem; font-family:sans-serif; font-weight:bold; box-shadow:0 4px 12px rgba(0,0,0,0.5); opacity:0; transition:all 0.3s ease; transform:translateY(10px);`;
      item.textContent = msg;
      toastContainer.appendChild(item);

      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, 10);

      setTimeout(() => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(10px)';
        setTimeout(() => item.remove(), 300);
      }, 3000);
    } catch (e) {
      console.log('Toast output:', msg);
    }
  }

  updatePrivacyBtnState() {
    const privacyBtn = document.getElementById('btn-toggle-privacy');
    if (privacyBtn) {
      if (this.isPrivacyMode) {
        privacyBtn.classList.add('active');
        privacyBtn.innerHTML = '<span>👁️‍🗨️ แสดงตัวเลข</span>';
      } else {
        privacyBtn.classList.remove('active');
        privacyBtn.innerHTML = '<span>👁️ ซ่อนตัวเลข</span>';
      }
    }
  }

  async fetchSingleTickerPrice(rawSymbol) {
    let symbol = (rawSymbol || '').trim().toUpperCase();
    if (!symbol) return null;

    // 1. Crypto support via Binance API (Fast & Direct)
    const cryptoMap = {
      'BTC': 'BTCUSDT', 'ETH': 'ETHUSDT', 'BNB': 'BNBUSDT', 'SOL': 'SOLUSDT',
      'ADA': 'ADAUSDT', 'XRP': 'XRPUSDT', 'DOGE': 'DOGEUSDT'
    };
    if (cryptoMap[symbol] || symbol.endsWith('USDT')) {
      const pair = cryptoMap[symbol] || symbol;
      try {
        const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${pair}`);
        if (res.ok) {
          const data = await res.json();
          const p = Number(data?.price);
          if (p > 0) return p;
        }
      } catch (err) {
        console.warn('Crypto fetch skipped:', err);
      }
    }

    // 2. Stock support (US & Thai stocks)
    let querySymbol = symbol;
    const thaiTickers = ['PTT', 'CPALL', 'BDMS', 'KBANK', 'SCB', 'AOT', 'ADVANC', 'DELTA', 'SCC', 'CPN', 'GULF', 'OR', 'TRUE', 'BANPU', 'MINT', 'TISCO', 'WHART'];
    if (thaiTickers.includes(querySymbol) && !querySymbol.endsWith('.BK')) {
      querySymbol += '.BK';
    }

    const candidateUrls = [
      `https://query1.finance.yahoo.com/v8/finance/chart/${querySymbol}?interval=1d&range=1d`,
      `https://query2.finance.yahoo.com/v8/finance/chart/${querySymbol}?interval=1d&range=1d`,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${querySymbol}?interval=1d&range=1d`)}`,
      `https://corsproxy.org/?${encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${querySymbol}?interval=1d&range=1d`)}`
    ];

    for (const targetUrl of candidateUrls) {
      try {
        const res = await fetch(targetUrl);
        if (res.ok) {
          const text = await res.text();
          const data = JSON.parse(text);
          const p = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
          if (p && p > 0) return p;
        }
      } catch (e) {
        // try next candidate
      }
    }
    return null;
  }

  async fetchLivePrices() {
    if (!Array.isArray(this.portfolios) || this.portfolios.length === 0) {
      alert('❌ ไม่พบสินทรัพย์ย่อยในพอร์ตเพื่อดึงราคา');
      return;
    }

    const liveBtn = document.getElementById('btn-fetch-live-prices');
    if (liveBtn) liveBtn.innerText = '⏳ กำลังดึงราคา...';

    let updatedCount = 0;
    try {
      for (const p of this.portfolios) {
        if (p && Array.isArray(p.assets)) {
          for (const a of p.assets) {
            const sym = (a.name || '').trim().toUpperCase();
            if (!sym) continue;

            const price = await this.fetchSingleTickerPrice(sym);
            if (price && price > 0) {
              a.currentPrice = price;
              a.value = (Number(a.shares) || 1) * price;
              updatedCount++;
            }
          }
        }
      }

      this.saveState();
      this.refreshUI();
      alert(`🎯 อัปเดตราคาตลาดสดสำเร็จ! (ปรับปรุงไปแล้ว ${updatedCount} รายการ)`);
    } catch (e) {
      alert('⚠️ ดึงราคาตลาดสดบางรายการไม่สำเร็จ: ระบบใช้ราคาเดิมล่าสุด');
    } finally {
      if (liveBtn) liveBtn.innerHTML = '<span>🔄 ดึงราคาตลาดสด</span>';
    }
  }

  exportDividendsToCSV() {
    if (!Array.isArray(this.dividendRecords) || this.dividendRecords.length === 0) {
      alert('❌ ไม่มีประวัติเงินปันผลสำหรับการส่งออก');
      return;
    }

    let csvContent = "\uFEFFวันที่,พอร์ตลงทุน,ชื่อหุ้น/หมายเหตุ,จำนวนเงินปันผล,สกุลเงิน\n";
    this.dividendRecords.forEach(r => {
      if (!r) return;
      const p = this.portfolios.find(x => x && x.id === r.portfolioId);
      const pName = p ? p.name : 'Unassigned';
      const cleanNotes = (r.notes || '').replace(/,/g, ' ');
      csvContent += `"${r.date || ''}","${pName}","${cleanNotes}",${r.amount || 0},"USD"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pixel_steward_dividends_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportPortfoliosToCSV() {
    if (!Array.isArray(this.portfolios) || this.portfolios.length === 0) {
      alert('❌ ไม่มีข้อมูลพอร์ตสำหรับการส่งออก');
      return;
    }

    let csvContent = "\uFEFFชื่อพอร์ต,หมวดหมู่,ประเภทเป้าหมาย,เป้าหมายสะสม ($),มูลค่าปัจจุบัน ($),เงินสดช้อน Dry Powder ($),ต้นทุนสะสม ($),กำไร/ขาดทุนสะสม ($),YOC Score\n";
    this.portfolios.forEach(p => {
      if (!p) return;
      const divs = Array.isArray(this.dividendRecords) ? this.dividendRecords.filter(x=>x && x.portfolioId===p.id).reduce((s,x)=>s+Number(x.amount||0),0) : 0;
      const totalCost = Array.isArray(p.assets) ? p.assets.reduce((sum, a) => sum + (Number(a.costBasis) || Number(a.value) || 0), 0) : 0;
      const curVal = p.current || 0;
      const pl = curVal - totalCost;
      const yoc = totalCost > 0 ? ((divs / totalCost) * 100).toFixed(2) + '%' : '0.00%';

      csvContent += `"${p.name}","${p.category}","${p.goalType}",${p.goal || 0},${curVal},${p.dryPowder || 0},${totalCost},${pl},"${yoc}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pixel_steward_portfolios_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /* ==========================================================================
     ⚖️ 1. ASSET REBALANCING CALCULATOR ENGINE (V3.5.0)
     ========================================================================== */
  openRebalanceModal() {
    if (!Array.isArray(this.portfolios) || this.portfolios.length === 0) {
      alert('❌ ไม่พบพอร์ตลงทุนเพื่อทำการ Rebalance');
      return;
    }
    const select = document.getElementById('rebalance-port-select');
    if (select) {
      select.innerHTML = this.portfolios.map(p => p ? `<option value="${p.id}">${p.name} (Dry Powder: $${(p.dryPowder || 0).toFixed(2)})</option>` : '').join('');
      select.onchange = () => this.renderRebalanceSummary();
    }
    const modal = document.getElementById('rebalance-modal');
    if (modal) modal.classList.remove('hidden');
    this.renderRebalanceSummary();
  }

  renderRebalanceSummary() {
    const select = document.getElementById('rebalance-port-select');
    const container = document.getElementById('rebalance-summary-container');
    if (!select || !container) return;

    const p = this.portfolios.find(x => x && x.id === select.value);
    if (!p) { container.innerHTML = '<p class="text-muted">ไม่พบข้อมูลพอร์ต</p>'; return; }

    const assets = Array.isArray(p.assets) ? p.assets : [];
    const totalAssetsVal = assets.reduce((s, a) => s + (Number(a.value) || 0), 0);
    const dryPowder = Number(p.dryPowder) || 0;
    const totalPortEquity = totalAssetsVal + dryPowder;

    if (assets.length === 0) {
      container.innerHTML = '<p class="text-muted" style="padding:10px;">⚠️ ไม่พบสินทรัพย์ย่อยในพอร์ตนี้ กรุณาเพิ่มสินทรัพย์ย่อยก่อนทำ Rebalance</p>';
      return;
    }

    let html = `
      <div class="border-pixel-inset" style="padding:10px; background:#0c1020; font-size:0.8rem;">
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span>มูลค่าสินทรัพย์รวม: <b>$${totalAssetsVal.toFixed(2)}</b></span>
          <span style="color:#38bdf8;">กระสุนเงินสด (Dry Powder): <b>$${dryPowder.toFixed(2)}</b></span>
        </div>
        <div style="display:flex; justify-content:space-between; font-weight:bold; color:var(--color-accent);">
          <span>มูลค่าพอร์ตสุทธิ (Net Equity):</span>
          <span>$${totalPortEquity.toFixed(2)}</span>
        </div>
      </div>
      
      <table class="retro-table" style="width:100%; border-collapse:collapse; font-size:0.8rem; margin-top:8px;">
        <thead>
          <tr style="background:#111625; text-align:left;">
            <th style="padding:6px; border:1px solid #26304d;">Ticker</th>
            <th style="padding:6px; border:1px solid #26304d;">มูลค่า ($)</th>
            <th style="padding:6px; border:1px solid #26304d;">% ปัจจุบัน</th>
            <th style="padding:6px; border:1px solid #26304d;">% เป้าหมาย</th>
            <th style="padding:6px; border:1px solid #26304d; text-align:right;">แผนเสบียงเติม ($)</th>
          </tr>
        </thead>
        <tbody>
    `;

    const totalDefinedTargetPct = assets.reduce((s, a) => s + (Number(a.targetPct) || 0), 0);
    const defaultPct = totalDefinedTargetPct < 100 ? (100 - totalDefinedTargetPct) / Math.max(1, assets.filter(a => !a.targetPct).length) : 0;

    assets.forEach((a) => {
      const val = Number(a.value) || 0;
      const curPct = totalAssetsVal > 0 ? (val / totalAssetsVal) * 100 : 0;
      const targetPct = a.targetPct !== undefined ? Number(a.targetPct) : defaultPct;
      
      const idealTargetVal = (totalPortEquity * (targetPct / 100));
      const diffVal = idealTargetVal - val;
      const actionText = diffVal > 0 
        ? `<span style="color:#10b981; font-weight:bold;">➕ ซื้อเพิ่ม $${diffVal.toFixed(2)}</span>`
        : (diffVal < 0 ? `<span style="color:#f59e0b;">⚖️ เกินเป้า $${Math.abs(diffVal).toFixed(2)}</span>` : '<span style="color:#94a3b8;">✓ สมดุลแล้ว</span>');

      html += `
        <tr>
          <td style="padding:6px; border:1px solid #26304d; font-weight:bold;">${a.name}</td>
          <td style="padding:6px; border:1px solid #26304d;">$${val.toFixed(2)}</td>
          <td style="padding:6px; border:1px solid #26304d;">${curPct.toFixed(1)}%</td>
          <td style="padding:6px; border:1px solid #26304d; color:#a78bfa;">${targetPct.toFixed(1)}%</td>
          <td style="padding:6px; border:1px solid #26304d; text-align:right;">${actionText}</td>
        </tr>
      `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
  }

  applyRebalancePlan() {
    const select = document.getElementById('rebalance-port-select');
    if (!select) return;
    const p = this.portfolios.find(x => x && x.id === select.value);
    if (!p || !Array.isArray(p.assets) || p.assets.length === 0) return;

    const assets = p.assets;
    const totalAssetsVal = assets.reduce((s, a) => s + (Number(a.value) || 0), 0);
    const dryPowder = Number(p.dryPowder) || 0;
    const totalPortEquity = totalAssetsVal + dryPowder;

    if (dryPowder <= 0) {
      alert('⚠️ ไม่มีเสบียง (Dry Powder) เหลืออยู่ในพอร์ตสำหรับเติมเพิ่ม');
      return;
    }

    const totalDefinedTargetPct = assets.reduce((s, a) => s + (Number(a.targetPct) || 0), 0);
    const defaultPct = totalDefinedTargetPct < 100 ? (100 - totalDefinedTargetPct) / Math.max(1, assets.filter(a => !a.targetPct).length) : 0;

    let remainingDry = dryPowder;
    assets.forEach(a => {
      const val = Number(a.value) || 0;
      const targetPct = a.targetPct !== undefined ? Number(a.targetPct) : defaultPct;
      const idealTargetVal = totalPortEquity * (targetPct / 100);
      const diffVal = idealTargetVal - val;

      if (diffVal > 0 && remainingDry > 0) {
        const allocate = Math.min(diffVal, remainingDry);
        a.value = val + allocate;
        const shares = Number(a.shares) || 1;
        a.currentPrice = shares > 0 ? a.value / shares : a.value;
        remainingDry -= allocate;
      }
    });

    p.dryPowder = Math.max(0, remainingDry);
    this.saveState();
    this.closeModals();
    this.refreshUI();
    this.showRetroToast(`⚖️ จัดสรรเสบียง Rebalance พอร์ต "${p.name}" สำเร็จ!`, 'success');
  }

  /* ==========================================================================
     📊 2. RETRO SVG ALLOCATION DONUT CHART GENERATOR (V3.5.0)
     ========================================================================== */
  renderAssetAllocationSvgChart(containerId, slicesData) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!Array.isArray(slicesData) || slicesData.length === 0) {
      container.innerHTML = '<p class="text-muted" style="text-align:center; padding:10px;">ไม่มีข้อมูลสัดส่วนสินทรัพย์</p>';
      return;
    }

    const total = slicesData.reduce((s, x) => s + (Number(x.value) || 0), 0);
    if (total <= 0) {
      container.innerHTML = '<p class="text-muted" style="text-align:center; padding:10px;">มูลค่าสินทรัพย์เป็น 0</p>';
      return;
    }

    const colors = ['#38bdf8', '#34d399', '#f59e0b', '#a78bfa', '#f43f5e', '#fbbf24', '#818cf8'];
    let accumulatedAngle = 0;
    const size = 160;
    const center = size / 2;
    const radius = 60;
    const strokeWidth = 24;

    let pathsSvg = '';
    slicesData.forEach((slice, idx) => {
      const val = Number(slice.value) || 0;
      const pct = val / total;
      const angle = pct * 360;

      if (angle <= 0) return;

      const startAngle = accumulatedAngle;
      const endAngle = accumulatedAngle + angle;
      accumulatedAngle = endAngle;

      const x1 = center + radius * Math.cos((Math.PI * (startAngle - 90)) / 180);
      const y1 = center + radius * Math.sin((Math.PI * (startAngle - 90)) / 180);
      const x2 = center + radius * Math.cos((Math.PI * (endAngle - 90)) / 180);
      const y2 = center + radius * Math.sin((Math.PI * (endAngle - 90)) / 180);

      const largeArc = angle > 180 ? 1 : 0;
      const color = slice.color || colors[idx % colors.length];

      pathsSvg += `<path d="M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${strokeWidth}"><title>${slice.label}: $${val.toFixed(2)} (${(pct * 100).toFixed(1)}%)</title></path>`;
    });

    let legendHtml = slicesData.map((slice, idx) => {
      const val = Number(slice.value) || 0;
      const pct = total > 0 ? (val / total) * 100 : 0;
      const color = slice.color || colors[idx % colors.length];
      return `
        <div style="display:flex; align-items:center; justify-content:space-between; gap:6px; font-size:0.75rem; margin-bottom:3px;">
          <span style="display:inline-block; width:10px; height:10px; background:${color}; border-radius:2px; flex-shrink:0;"></span>
          <span style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${slice.label}</span>
          <b style="color:#fff;">${pct.toFixed(1)}%</b>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap; justify-content:center;">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform:rotate(-90deg); filter:drop-shadow(0 2px 6px rgba(0,0,0,0.5));">
          ${pathsSvg}
        </svg>
        <div style="flex:1; min-width:140px;">
          ${legendHtml}
        </div>
      </div>
    `;
  }

  /* ==========================================================================
     📈 4. COMPOUND GROWTH SIMULATOR ENGINE (V3.5.0)
     ========================================================================== */
  openCompoundModal() {
    const totalEquity = Array.isArray(this.portfolios) 
      ? this.portfolios.reduce((s, p) => s + (p ? Number(p.current || 0) + Number(p.dryPowder || 0) : 0), 0)
      : 1000;

    const initInput = document.getElementById('cg-initial');
    if (initInput) initInput.value = totalEquity > 0 ? totalEquity.toFixed(0) : 1000;

    ['cg-initial', 'cg-dca', 'cg-rate'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.oninput = () => this.renderCompoundResults();
    });

    const modal = document.getElementById('compound-modal');
    if (modal) modal.classList.remove('hidden');

    this.renderCompoundResults();
  }

  renderCompoundResults() {
    const container = document.getElementById('compound-projection-results');
    if (!container) return;

    const initial = Number(document.getElementById('cg-initial').value) || 0;
    const monthlyDCA = Number(document.getElementById('cg-dca').value) || 0;
    const ratePct = Number(document.getElementById('cg-rate').value) || 0;
    const r = ratePct / 100 / 12;

    const calcWealth = (years) => {
      const months = years * 12;
      if (r === 0) return initial + (monthlyDCA * months);
      const fvInitial = initial * Math.pow(1 + r, months);
      const fvDca = monthlyDCA * ((Math.pow(1 + r, months) - 1) / r);
      return fvInitial + fvDca;
    };

    const horizons = [1, 3, 5, 10];
    let rowsHtml = horizons.map(yrs => {
      const totalFuture = calcWealth(yrs);
      const totalInvested = initial + (monthlyDCA * yrs * 12);
      const totalInterest = Math.max(0, totalFuture - totalInvested);
      const gainPct = totalInvested > 0 ? (totalInterest / totalInvested) * 100 : 0;

      return `
        <tr>
          <td style="padding:8px; border:1px solid #26304d; font-weight:bold; color:var(--color-accent);">${yrs} ปี</td>
          <td style="padding:8px; border:1px solid #26304d;">$${totalInvested.toFixed(0)}</td>
          <td style="padding:8px; border:1px solid #26304d; color:#10b981;">+$${totalInterest.toFixed(0)} (${gainPct.toFixed(0)}%)</td>
          <td style="padding:8px; border:1px solid #26304d; font-weight:bold; color:#38bdf8; font-family:'Press Start 2P'; font-size:0.75rem;">$${totalFuture.toFixed(0)}</td>
        </tr>
      `;
    }).join('');

    container.innerHTML = `
      <table class="retro-table" style="width:100%; border-collapse:collapse; font-size:0.8rem;">
        <thead>
          <tr style="background:#111625; text-align:left;">
            <th style="padding:8px; border:1px solid #26304d;">ระยะเวลา</th>
            <th style="padding:8px; border:1px solid #26304d;">เงินต้นสะสม ($)</th>
            <th style="padding:8px; border:1px solid #26304d;">กำไรทบต้น ($)</th>
            <th style="padding:8px; border:1px solid #26304d;">พอร์ตเป้าหมาย ($)</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;
  }

  restoreMasterPortfolios() {
    if (!confirm("⚠️ คุณต้องการกู้คืนพอร์ตโครงสร้างหลัก (Master 10 Portfolios) ให้กลับมาเป๊ะ 100% หรือไม่?\n\n(ระบบจะเซ็ตพอร์ตและ % สัดส่วนเป้าหมายทั้งหมดให้ถูกต้องเรียบร้อยครับ)")) return;
    this.portfolios = JSON.parse(JSON.stringify(INITIAL_PORTFOLIOS));
    if (this.portfolios.length > 0) this.selectedPortId = this.portfolios[0].id;
    this.saveState();
    this.refreshUI();
    this.showRetroToast("🔄 กู้คืนโครงสร้างพอร์ตเป๊ะ 100% เรียบร้อยแล้ว!", "success");
  }

  refreshUI() {
    const container = document.getElementById('tab-content');
    if (!container) return;

    const pageTitles = {
      dashboard:  { title: 'แดชบอร์ดภาพรวม', sub: 'วิเคราะห์สถานะความมั่งคั่ง กระสุนรอช้อน และแนวโน้มการเติบโตรายไตรมาส' },
      portfolios: { title: 'พอร์ตการลงทุน', sub: 'จัดการตลับพอร์ต เพิ่มสินทรัพย์ย่อย และติดตามแต่ละเควสเป้าหมาย' },
      journal:    { title: 'Forex — Retro Trading Journal', sub: 'สมุดบันทึกเทรด Forex แบบเรโทรอาเขตพร้อมสถิติขั้นสูง' },
      quarterly:  { title: 'หุ้นรายไตรมาส', sub: 'สรุปผลรายงานไตรมาสทุกพอร์ตเปรียบเทียบการเติบโต' },
      dividends:  { title: 'เงินปันผล & YOC', sub: 'ติดตามเงินปันผลที่ได้รับและ Yield on Cost' },
      option:     { title: 'Option รายเดือน', sub: 'บันทึกผลกำไร/ขาดทุนจากสัญญาออปชันรายเดือน' },
      comparison: { title: 'ตารางเปรียบเทียบ', sub: 'เปรียบเทียบเควสเป้าหมายทุกพอร์ตในมุมมองเดียว' },
      settings:   { title: 'ตั้งค่าคลาวด์เซฟ', sub: 'ตั้งค่าระบบ สำรองข้อมูล นำเข้าไฟล์ และจัดการหนี้สิน' }
    };

    const info = pageTitles[this.activeTab] || pageTitles.dashboard;
    const titleEl = document.getElementById('page-title');
    const subEl = document.getElementById('page-subtitle');
    if (titleEl) titleEl.textContent = info.title;
    if (subEl) subEl.textContent = info.sub;

    switch (this.activeTab) {
      case 'dashboard':  this.renderDashboard(container); break;
      case 'portfolios': this.renderPortfolios(container); break;
      case 'quarterly':  this.renderQuarterly(container); break;
      case 'dividends':  this.renderDividends(container); break;
      case 'option':     this.renderOptionManual(container); break;
      case 'comparison': this.renderComparison(container); break;
      case 'settings':   this.renderSettings(container); break;
      default:           this.renderDashboard(container); break;
    }
  }
}

// 🚀 INITIALIZATION INSTANTIATION
window.app = new PixelStewardApp();
