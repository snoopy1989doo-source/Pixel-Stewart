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
   🕹️ RETRO TRADER JOURNAL ENGINE (DECLARED FIRST TO PREVENT TDZ BUG)
   ========================================================================== */
const rtjKEY = {
  TRADES:       'rtj_trades_v2',
  CFS:          'rtj_cfs_v2',
  BALANCES:     'rtj_balances_v3',
  SOUND:        'rtj_sound_v2',
  CRT:          'rtj_crt_v2',
  LAST_ACCOUNT: 'rtj_last_account_v1'
};

const rtjDEFAULT_BALANCES = {
  Demo: 10000,
  LIFE: 1000,
  RISK: 500,
  Swingtrade: 2000
};

function rtjLoad(key, def) { 
  try { 
    const v = localStorage.getItem(key); 
    if (v === null || v === 'undefined') return def;
    if (key === rtjKEY.BALANCES) {
      const parsed = JSON.parse(v);
      if (typeof parsed === 'number') {
        return { ...rtjDEFAULT_BALANCES, Demo: parsed };
      }
      return { ...rtjDEFAULT_BALANCES, ...parsed };
    }
    return JSON.parse(v);
  } catch { return def; } 
}

function rtjSave(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }

function rtjBeep(type) {
  if (!rtjState || !rtjState.sound) return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    const ctx = new AC(), osc = ctx.createOscillator(), g = ctx.createGain(); osc.connect(g); g.connect(ctx.destination);
    if (type === 'win') {
      osc.type = 'square'; osc.frequency.setValueAtTime(523, ctx.currentTime); osc.frequency.setValueAtTime(659, ctx.currentTime + .09);
      g.gain.setValueAtTime(.07, ctx.currentTime); g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .3);
      osc.start(); osc.stop(ctx.currentTime + .3);
    } else if (type === 'lose') {
      osc.type = 'sawtooth'; osc.frequency.setValueAtTime(220, ctx.currentTime); osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + .5);
      g.gain.setValueAtTime(.08, ctx.currentTime); g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .5);
      osc.start(); osc.stop(ctx.currentTime + .5);
    } else if (type === 'alert') {
      osc.type = 'sawtooth'; osc.frequency.setValueAtTime(400, ctx.currentTime); osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + .2); osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + .4);
      g.gain.setValueAtTime(.1, ctx.currentTime); g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .4);
      osc.start(); osc.stop(ctx.currentTime + .4);
    } else {
      osc.type = 'triangle'; osc.frequency.setValueAtTime(600, ctx.currentTime); g.gain.setValueAtTime(.04, ctx.currentTime); g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .06);
      osc.start(); osc.stop(ctx.currentTime + .06);
    }
  } catch {}
}

function rtjToday() { return new Date().toISOString().split('T')[0]; }
function rtjFmt(n, d = 2) { return Number(n || 0).toFixed(d); }
function rtjFmtDate(s) { if (!s) return ''; const [y, m, d] = s.split('-'); return `${d}/${m}/${y.slice(2)}`; }
function rtjUid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }

function rtjWeekStart(dateStr) { const d = new Date(dateStr); const day = d.getDay(); const diff = day === 0 ? -6 : 1 - day; d.setDate(d.getDate() + diff); return d.toISOString().split('T')[0]; }
function rtjWeekEnd(dateStr) { const ws = rtjWeekStart(dateStr); const d = new Date(ws); d.setDate(d.getDate() + 6); return d.toISOString().split('T')[0]; }
function rtjMonthStart(dateStr) { return dateStr.slice(0, 7) + '-01'; }
function rtjMonthEnd(dateStr) { const [y, m] = dateStr.split('-'); const last = new Date(+y, +m, 0); return `${y}-${m}-${String(last.getDate()).padStart(2, '0')}`; }

function rtjFilterByPeriod(trades, period) {
  const safeTrades = Array.isArray(trades) ? trades : [];
  const safePeriod = period || { mode: 'all' };
  if (!safePeriod || safePeriod.mode === 'all') return safeTrades;
  const t = rtjToday();
  if (safePeriod.mode === 'daily') { return safeTrades.filter(tr => tr && tr.date === (safePeriod.date || t)); }
  if (safePeriod.mode === 'weekly') { return safeTrades.filter(tr => tr && tr.date >= rtjWeekStart(t) && tr.date <= rtjWeekEnd(t)); }
  if (safePeriod.mode === 'monthly') { return safeTrades.filter(tr => tr && tr.date >= rtjMonthStart(t) && tr.date <= rtjMonthEnd(t)); }
  if (safePeriod.mode === 'custom') { return safeTrades.filter(tr => tr && tr.date >= (safePeriod.from || '') && tr.date <= (safePeriod.to || '9999-12-31')); }
  return safeTrades;
}

const rtjSavedLastAccount = rtjLoad(rtjKEY.LAST_ACCOUNT, 'Demo');

const rtjState = {
  page:     'HOME', inputTab: 'TRADE', logTab: 'TRADE',
  sound:    rtjLoad(rtjKEY.SOUND, true), 
  balances: rtjLoad(rtjKEY.BALANCES, rtjDEFAULT_BALANCES),
  trades:   rtjLoad(rtjKEY.TRADES, []), 
  cfs:      rtjLoad(rtjKEY.CFS, []),
  crt:      rtjLoad(rtjKEY.CRT, false),
  calYear:  new Date().getFullYear(),
  calMonth: new Date().getMonth(),
  f: {
    date: rtjToday(), symbol: 'GOLD', dir: 'Buy', entry: '', exit: '',
    sl: '', lot: '', pnl: '', status: 'TP', tf: '1H',
    conf: false, fear: false, greed: false, account: rtjSavedLastAccount
  },
  cf: { date: rtjToday(), type: 'Deposit', amount: '', desc: '', account: rtjSavedLastAccount },
  filter: { symbol: 'ALL', status: 'ALL', period: { mode: 'all' }, account: rtjSavedLastAccount },
  statsPeriod: { mode: 'all', account: rtjSavedLastAccount }
};

/* ==========================================================================
   🏰 PIXEL STEWARD MAIN APPLICATION CLASS
   ========================================================================== */
const INITIAL_PORTFOLIOS = [
  { id: 'p-redwing', name: 'RedWing (กยศ.)', category: 'Life Goal', goalType: 'numeric', goal: 8000, goalSchedule: '', current: 0, cashBuffer: 0, dryPowder: 0, assets: [], notes: '', dcaDoneThisMonth: false },
  { id: 'p-zero1', name: 'Zero 1', category: 'Emergency Fund', goalType: 'numeric', goal: 4500, goalSchedule: '', current: 0, cashBuffer: 0, dryPowder: 0, assets: [], notes: '', dcaDoneThisMonth: false },
  { id: 'p-zero2', name: 'Zero 2', category: 'Global Stock', goalType: 'numeric', goal: 30000, goalSchedule: '', current: 0, cashBuffer: 0, dryPowder: 0, assets: [
    { name: 'NVDA', shares: 0.065108, costPrice: 199.6858, costBasis: 13.00, currentPrice: 199.6858, value: 13.00 },
    { name: 'PLTR', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 0, value: 0 }
  ], notes: '', dcaDoneThisMonth: false },
  { id: 'p-zero3', name: 'Zero 3', category: 'Global Stock', goalType: 'numeric', goal: 15000, goalSchedule: '', current: 0, cashBuffer: 0, dryPowder: 0, assets: [
    { name: 'SMR', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 0, value: 0 },
    { name: 'TSLA', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 0, value: 0 }
  ], notes: '', dcaDoneThisMonth: false },
  { id: 'p-zero4', name: 'Zero 4', category: 'Global Stock', goalType: 'numeric', goal: 15000, goalSchedule: '', current: 0, cashBuffer: 0, dryPowder: 0, assets: [], notes: '', dcaDoneThisMonth: false },
  { id: 'p-zero5', name: 'Zero 5', category: 'Global Stock', goalType: 'numeric', goal: 15000, goalSchedule: '', current: 0, cashBuffer: 0, dryPowder: 0, assets: [], notes: '', dcaDoneThisMonth: false },
  { id: 'p-divyield', name: 'Dividend Yield', category: 'Global Stock', goalType: 'numeric', goal: 15000, goalSchedule: '', current: 0, cashBuffer: 0, dryPowder: 0, assets: [
    { name: 'KO', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 0, value: 0 },
    { name: 'AVGO', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 0, value: 0 },
    { name: 'CVX', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 0, value: 0 }
  ], notes: '', dcaDoneThisMonth: false },
  { id: 'p-thaidiv', name: 'THAI Dividend', category: 'THAI Dividend', goalType: 'numeric', goal: 15000, goalSchedule: '', current: 0, cashBuffer: 0, dryPowder: 0, assets: [], notes: '', dcaDoneThisMonth: false },
  { id: 'p-nextgen', name: 'NEXT GEN', category: 'Global Stock', goalType: 'numeric', goal: 15000, goalSchedule: '', current: 0, cashBuffer: 0, dryPowder: 0, assets: [
    { name: 'VOO', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 0, value: 0 },
    { name: 'GEV', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 0, value: 0 },
    { name: 'ISRG', shares: 0, costPrice: 0, costBasis: 0, currentPrice: 0, value: 0 }
  ], notes: '', dcaDoneThisMonth: false },
  { id: 'p-crypto', name: 'Crypto', category: 'Crypto', goalType: 'numeric', goal: 6000, goalSchedule: '', current: 0, cashBuffer: 0, dryPowder: 0, assets: [], notes: '', dcaDoneThisMonth: false }
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
           cat.includes('forex') || 
           cat.includes('global') || 
           cat.includes('growth') || 
           cat.includes('foreign') ||
           cat.includes('ต่างประเทศ') ||
           cat.includes('next gen') || 
           cat.includes('nextgen') ||
           cat.includes('crypto');
  }

  getForexAccountEquity(accountName) {
    if (typeof rtjState === 'undefined' || !rtjState) return 0;
    const safeBalances = rtjState.balances || rtjDEFAULT_BALANCES;
    const key = Object.keys(safeBalances).find(k => k.toLowerCase() === (accountName || '').trim().toLowerCase());
    const targetAcc = key || 'ALL';

    let accStartBal = 0;
    if (targetAcc === 'ALL') {
      accStartBal = Object.values(safeBalances).reduce((a, b) => a + (Number(b) || 0), 0);
    } else {
      accStartBal = Number(safeBalances[targetAcc]) || 0;
    }

    const safeCFs = Array.isArray(rtjState.cfs) ? rtjState.cfs : [];
    const netDeposit = safeCFs
      .filter(c => c && (targetAcc === 'ALL' || (c.account || 'Demo') === targetAcc))
      .reduce((s, c) => s + (c.type === 'Deposit' ? Number(c.amount || 0) : -Number(c.amount || 0)), 0);

    const safeTrades = Array.isArray(rtjState.trades) ? rtjState.trades : [];
    const filteredTrades = safeTrades.filter(t => t && (targetAcc === 'ALL' || (t.account || 'Demo') === targetAcc));
    const netPnl = filteredTrades.reduce((s, t) => s + (Number(t.pnl) || 0), 0);

    return accStartBal + netDeposit + netPnl;
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
        
        const rawName = prompt('กรอก Ticker/ชื่อสินทรัพย์ย่อย (เช่น NVDA, PTT, AAPL, BTC):');
        if (!rawName) return;
        const name = rawName.trim().toUpperCase();
        
        const sharesStr = prompt(`ระบุจำนวนหุ้น/หน่วย (ถ้าไม่ต้องการระบุ ให้เว้นว่างหรือพิมพ์ 1):`, '1');
        const shares = Number(sharesStr) || 1;

        const valStr = prompt(`ระบุมูลค่าปัจจุบันรวม ($ USD) ในสกุลเงินพอร์ต:`);
        const val = Number(valStr);
        if (isNaN(val) || val < 0) { alert('❌ โปรดกรอกตัวเลขมูลค่าให้ถูกต้อง'); return; }

        const costStr = prompt(`ระบุราคาทุนรวมทั้งหมด ($ USD) (ถ้าเท่ากับมูลค่าปัจจุบัน ให้พิมพ์ ${val}):`, val.toString());
        const costBasis = Number(costStr) >= 0 ? Number(costStr) : val;

        if (!active.assets) active.assets = [];
        active.assets.push({
          name: name,
          shares: shares,
          costPrice: shares > 0 ? costBasis / shares : costBasis,
          costBasis: costBasis,
          currentPrice: shares > 0 ? val / shares : val,
          value: val
        });
        this.saveState(); this.refreshUI();
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
    const stockPorts = this.portfolios.filter(p => p && (p.category || '').toLowerCase() !== 'option' && (p.category || '').toLowerCase() !== 'forex');

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

  connectCloudDatabase() {
    if (!isFirebaseActive) return;
    try {
      firebase.database().ref('pixel_steward_data_v4').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
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

          // Sync consolidated Forex journal database
          if (typeof rtjState !== 'undefined' && rtjState) {
            if (data.rtjTrades) { rtjState.trades = Array.isArray(data.rtjTrades) ? data.rtjTrades : Object.values(data.rtjTrades); rtjSave(rtjKEY.TRADES, rtjState.trades); }
            if (data.rtjCfs) { rtjState.cfs = Array.isArray(data.rtjCfs) ? data.rtjCfs : Object.values(data.rtjCfs); rtjSave(rtjKEY.CFS, rtjState.cfs); }
            if (data.rtjBalances) { rtjState.balances = { ...rtjDEFAULT_BALANCES, ...data.rtjBalances }; rtjSave(rtjKEY.BALANCES, rtjState.balances); }
            rtjSyncCrtView();
            if (this.activeTab === 'journal') rtjRender();
          }

          this.refreshUI();
        }
      }, (error) => {
        console.warn("⚠️ Firebase sync read permission denied or offline:", error);
      });
    } catch (e) {
      console.error("Firebase sync setup failed:", e);
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

      if (typeof rtjState !== 'undefined' && rtjState) {
        payload.rtjTrades = rtjState.trades || [];
        payload.rtjCfs = rtjState.cfs || [];
        payload.rtjBalances = rtjState.balances || {};
      }

      firebase.database().ref('pixel_steward_data_v4').set(payload).catch(err => {
        console.warn("⚠️ Firebase sync write permission denied:", err);
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
      } else if (cat.includes('forex')) {
        p.current = this.getForexAccountEquity(p.name);
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
        } else if(cat.includes('option') || cat.includes('forex') || cat.includes('ฟอเร็กซ์') || cat.includes('ออปชัน')) {
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
                <div style="width:${(catAlloc.deriv/grandTotalUSD)*100}%; background:#a855f7; height:100%;" title="ออปชัน & ฟอเร็กซ์"></div>
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
                <div style="display:flex; justify-content:space-between;"><span>🟣 ออปชัน & ฟอเร็กซ์</span><b>${grandTotalUSD>0?((catAlloc.deriv/grandTotalUSD)*100).toFixed(1):0}%</b></div>
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
        { label: 'ออปชัน & ฟอเร็กซ์', value: catAlloc.deriv, color: '#a855f7' },
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
              const pct = p.goal > 0 ? (((p.current + p.cashBuffer) / p.goal) * 100) : 0;
              const isPurpleTier = pct >= 80;
              const tierClass = isPurpleTier ? 'tier-purple' : (pct >= 40 ? 'tier-gold' : 'tier-silver');
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
                      <div style="display:flex; justify-content:space-between; align-items:center; font-family:'Press Start 2P'; font-size:0.5rem; color:#94a3b8; margin-top:3px;">
                        <span>${pct.toFixed(0)}%</span>
                        <div class="card-progress-bar" style="width:70%; margin:0;">
                          <div class="card-progress-fill" style="width:${Math.min(100, pct)}%;"></div>
                        </div>
                      </div>
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
            
            <div style="background:#111625; padding:10px; border:2px solid #000; font-size:0.85rem; cursor:pointer;" onclick="app.inlineEditGoal('${active.id}')">
              🎯 เป้าหมาย: ${active.goalType==='numeric'?this.formatMoney(active.goal, active.category, false):active.goalSchedule} <span style="font-size:0.7rem; color:#64748b; float:right;">✏️ แก้ไข</span>
            </div>
            
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
              <div style="background:#111625; padding:10px; border:2px solid #000; font-size:0.85rem; color:#10b981; font-weight:bold;">
                💼 สุธิตลับพอร์ต: ${this.formatMoney(active.current+active.cashBuffer, active.category, false)}
              </div>
              <div style="background:#0c1020; padding:10px; border:2px solid #000; font-size:0.8rem; color:#94a3b8;">
                ⚖️ Weight: <b>${weight.toFixed(1)}% ของคลังรวม</b>
              </div>
            </div>

            <div>
              <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:bold; margin-bottom:2px;"><span>เควสโปรเกรส:</span><span>${lvl.pct.toFixed(1)}%</span></div>
              <div class="progress-container" style="height:12px; background:#111625; border:2px solid #000;"><div style="width:${Math.min(100,lvl.pct)}%; background:var(--color-success); height:100%;"></div></div>
            </div>

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
                  const cost = Number(a.costBasis) || Number(a.value) || 0;
                  const val = Number(a.value) || 0;
                  const diff = val - cost;
                  const pct = cost > 0 ? (diff / cost) * 100 : 0;
                  const isProfit = diff >= 0;
                  const plBadgeClass = isProfit ? 'badge-pl-profit' : 'badge-pl-loss';
                  const sign = isProfit ? '+' : '';
                  const cPrice = Number(a.currentPrice) || (a.shares > 0 ? val / a.shares : val);
                  const cCostPrice = Number(a.costPrice) || (a.shares > 0 ? cost / a.shares : cost);

                  return `
                  <div style="display:flex; justify-content:space-between; background:#111625; padding:8px 12px; border:2px solid #000; font-size:0.85rem; align-items:center; border-radius:6px; flex-wrap:wrap; gap:6px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                      ${this.getTickerLogoHtml(a.name, active.category)}
                      <div>
                        <div style="display:flex; align-items:center; gap:6px;">
                          <b style="font-size:0.9rem; color:#fff;">${a.name}</b>
                          <span style="font-size:0.65rem; color:#60a5fa; background:rgba(96,165,250,0.1); padding:1px 4px; border-radius:3px;">Dime Sync</span>
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

    const shares = a.shares !== undefined ? a.shares : 1;
    const costPrice = a.costPrice !== undefined ? a.costPrice : (shares > 0 ? a.costBasis / shares : a.costBasis);
    const value = a.value !== undefined ? a.value : 0;
    const currentPrice = a.currentPrice !== undefined ? a.currentPrice : (shares > 0 ? value / shares : 0);

    document.getElementById('asset-edit-port-id').value = portId;
    document.getElementById('asset-edit-index').value = assetIdx;
    document.getElementById('asset-edit-name').value = a.name || '';
    document.getElementById('asset-edit-shares').value = shares;
    document.getElementById('asset-edit-cost-price').value = costPrice;
    
    const currPriceEl = document.getElementById('asset-edit-curr-price');
    if (currPriceEl) currPriceEl.value = currentPrice > 0 ? currentPrice : '';
    document.getElementById('asset-edit-market-val').value = value;
    const targetPctEl = document.getElementById('asset-edit-target-pct');
    if (targetPctEl) targetPctEl.value = a.targetPct !== undefined ? a.targetPct : '';

    const modal = document.getElementById('asset-edit-modal');
    if (modal) modal.classList.remove('hidden');

    const updatePreview = (e) => {
      const sh = Number(document.getElementById('asset-edit-shares').value) || 0;
      const cp = Number(document.getElementById('asset-edit-cost-price').value) || 0;
      let currPriceInput = document.getElementById('asset-edit-curr-price');
      let mktValInput = document.getElementById('asset-edit-market-val');

      if (e && e.target && e.target.id === 'asset-edit-curr-price') {
        const currP = Number(currPriceInput.value) || 0;
        if (sh > 0 && currP > 0) {
          mktValInput.value = (sh * currP).toFixed(2);
        }
      } else if (e && e.target && e.target.id === 'asset-edit-market-val') {
        const mv = Number(mktValInput.value) || 0;
        if (sh > 0 && mv > 0 && currPriceInput) {
          currPriceInput.value = (mv / sh).toFixed(4);
        }
      } else {
        const currP = Number(currPriceInput ? currPriceInput.value : 0) || 0;
        const mv = Number(mktValInput.value) || 0;
        if (sh > 0 && currP > 0 && mv === 0) {
          mktValInput.value = (sh * currP).toFixed(2);
        }
      }

      const totalCost = sh * cp;
      const marketVal = Number(document.getElementById('asset-edit-market-val').value) || 0;
      const totalPL = marketVal - totalCost;
      const pctPL = totalCost > 0 ? (totalPL / totalCost) * 100 : 0;
      const isProfit = totalPL >= 0;

      const costEl = document.getElementById('preview-total-cost');
      const valEl = document.getElementById('preview-current-val');
      const plEl = document.getElementById('preview-total-pl');

      if (costEl) costEl.textContent = `$${totalCost.toFixed(2)}`;
      if (valEl) valEl.textContent = `$${marketVal.toFixed(2)}`;
      if (plEl) {
        plEl.textContent = `${isProfit ? '+' : ''}$${totalPL.toFixed(2)} (${isProfit ? '+' : ''}${pctPL.toFixed(2)}%)`;
        plEl.style.color = isProfit ? '#10b981' : '#ef4444';
      }
    };

    ['asset-edit-shares', 'asset-edit-cost-price', 'asset-edit-curr-price', 'asset-edit-market-val', 'asset-edit-target-pct'].forEach(id => {
      const input = document.getElementById(id);
      if (input) input.oninput = updatePreview;
    });

    updatePreview();
  }

  handleSaveAssetEdit() {
    const portId = document.getElementById('asset-edit-port-id').value;
    const idx = Number(document.getElementById('asset-edit-index').value);
    const p = this.portfolios.find(x => x && x.id === portId);
    if (!p || !p.assets || !p.assets[idx]) return;

    const name = document.getElementById('asset-edit-name').value.trim().toUpperCase();
    const shares = Number(document.getElementById('asset-edit-shares').value) || 1;
    const costPrice = Number(document.getElementById('asset-edit-cost-price').value) || 0;
    const currPriceEl = document.getElementById('asset-edit-curr-price');
    const currPrice = currPriceEl ? Number(currPriceEl.value) || 0 : 0;
    const marketVal = Number(document.getElementById('asset-edit-market-val').value) || (shares * currPrice);
    const targetPctInput = document.getElementById('asset-edit-target-pct');
    const targetPct = targetPctInput && targetPctInput.value !== '' ? Number(targetPctInput.value) : undefined;

    if (!name) { alert('❌ โปรดระบุชื่อ Ticker สินทรัพย์!'); return; }

    p.assets[idx] = {
      name: name,
      shares: shares,
      costPrice: costPrice,
      costBasis: shares * costPrice,
      currentPrice: currPrice > 0 ? currPrice : (shares > 0 ? marketVal / shares : marketVal),
      value: marketVal,
      targetPct: targetPct
    };

    this.saveState();
    this.closeModals();
    this.refreshUI();
    this.showRetroToast(`🎯 แก้ไขสินทรัพย์ย่อย "${name}" สำเร็จ!`, 'success');
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
    const p = this.portfolios.find(x => x && x.id === id);
    if (!p) return;
    if (p.goalType === 'numeric') {
      const newGoal = prompt(`✏️ แก้ไขเป้าหมายตัวเลขเงินสะสม ($ USD) ของพอร์ต "${p.name}" เป็น:`, p.goal);
      if (newGoal !== null && !isNaN(Number(newGoal)) && Number(newGoal) >= 0) {
        p.goal = Number(newGoal);
        this.saveState(); this.refreshUI();
      }
    } else {
      const newSched = prompt(`✏️ แก้ไขเป้าหมายตาราง DCA ของพอร์ต "${p.name}" เป็น:`, p.goalSchedule);
      if (newSched !== null && newSched.trim() !== "") {
        p.goalSchedule = newSched.trim();
        this.saveState(); this.refreshUI();
      }
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

  openAssetEditModal(portId, assetIdx) {
    const p = this.portfolios.find(x => x && x.id === portId);
    if (!p || !p.assets || !p.assets[assetIdx]) return;
    const a = p.assets[assetIdx];

    document.getElementById('asset-edit-port-id').value = portId;
    document.getElementById('asset-edit-index').value = assetIdx;
    document.getElementById('asset-edit-name').value = a.name || '';
    document.getElementById('asset-edit-shares').value = a.shares !== undefined ? a.shares : 1;
    document.getElementById('asset-edit-cost-price').value = a.costPrice !== undefined ? a.costPrice : (a.shares > 0 ? a.costBasis / a.shares : a.costBasis);
    document.getElementById('asset-edit-market-val').value = a.value !== undefined ? a.value : 0;

    const modal = document.getElementById('asset-edit-modal');
    if (modal) modal.classList.remove('hidden');

    const updatePreview = () => {
      const shares = Number(document.getElementById('asset-edit-shares').value) || 0;
      const costPrice = Number(document.getElementById('asset-edit-cost-price').value) || 0;
      const marketVal = Number(document.getElementById('asset-edit-market-val').value) || 0;

      const totalCost = shares * costPrice;
      const totalPL = marketVal - totalCost;
      const pctPL = totalCost > 0 ? (totalPL / totalCost) * 100 : 0;
      const isProfit = totalPL >= 0;

      const costEl = document.getElementById('preview-total-cost');
      const plEl = document.getElementById('preview-total-pl');

      if (costEl) costEl.textContent = `$${totalCost.toFixed(2)}`;
      if (plEl) {
        plEl.textContent = `${isProfit ? '+' : ''}$${totalPL.toFixed(2)} (${isProfit ? '+' : ''}${pctPL.toFixed(1)}%)`;
        plEl.style.color = isProfit ? '#10b981' : '#ef4444';
      }
    };

    ['asset-edit-shares', 'asset-edit-cost-price', 'asset-edit-market-val'].forEach(id => {
      const input = document.getElementById(id);
      if (input) input.oninput = updatePreview;
    });

    updatePreview();
  }

  handleSaveAssetEdit() {
    const portId = document.getElementById('asset-edit-port-id').value;
    const idx = Number(document.getElementById('asset-edit-index').value);
    const p = this.portfolios.find(x => x && x.id === portId);
    if (!p || !p.assets || !p.assets[idx]) return;

    const name = document.getElementById('asset-edit-name').value.trim().toUpperCase();
    const shares = Number(document.getElementById('asset-edit-shares').value) || 1;
    const costPrice = Number(document.getElementById('asset-edit-cost-price').value) || 0;
    const marketVal = Number(document.getElementById('asset-edit-market-val').value) || 0;

    if (!name) { alert('❌ โปรดระบุชื่อ Ticker สินทรัพย์!'); return; }

    p.assets[idx] = {
      name: name,
      shares: shares,
      costPrice: costPrice,
      costBasis: shares * costPrice,
      currentPrice: shares > 0 ? marketVal / shares : marketVal,
      value: marketVal
    };

    this.saveState();
    this.closeModals();
    this.refreshUI();
    alert(`🎯 แก้ไขสินทรัพย์ย่อย "${name}" สำเร็จ!`);
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
    const stockPorts = Array.isArray(this.portfolios) ? this.portfolios.filter(p => p && (p.category || '').toLowerCase() !== 'option' && (p.category || '').toLowerCase() !== 'forex') : [];
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

            if (typeof rtjState !== 'undefined' && rtjState) {
              if (p.rtjTrades) { rtjState.trades = Array.isArray(p.rtjTrades) ? p.rtjTrades : Object.values(p.rtjTrades); rtjSave(rtjKEY.TRADES, rtjState.trades); }
              if (p.rtjCfs) { rtjState.cfs = Array.isArray(p.rtjCfs) ? p.rtjCfs : Object.values(p.rtjCfs); rtjSave(rtjKEY.CFS, rtjState.cfs); }
              if (p.rtjBalances) { rtjState.balances = { ...rtjDEFAULT_BALANCES, ...p.rtjBalances }; rtjSave(rtjKEY.BALANCES, rtjState.balances); }
              rtjSyncCrtView();
            }

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
            let symbol = (a.name || '').trim().toUpperCase();
            if (!symbol) continue;
            
            let querySymbol = symbol;
            const thaiTickers = ['PTT', 'CPALL', 'BDMS', 'KBANK', 'SCB', 'AOT', 'ADVANC', 'DELTA', 'SCC', 'CPN', 'GULF', 'OR', 'TRUE', 'BANPU', 'MINT'];
            if (thaiTickers.includes(querySymbol) && !querySymbol.endsWith('.BK')) {
              querySymbol += '.BK';
            }

            try {
              const res = await fetch(`https://proxy.cors.sh/https://query1.finance.yahoo.com/v8/finance/chart/${querySymbol}?interval=1d&range=1d`);
              if (res.ok) {
                const data = await res.json();
                const meta = data?.chart?.result?.[0]?.meta;
                const price = meta?.regularMarketPrice;
                if (price && price > 0) {
                  a.currentPrice = price;
                  a.value = (a.shares || 1) * price;
                  updatedCount++;
                }
              }
            } catch (err) {
              console.warn(`Price fetch skipped for ${querySymbol}:`, err);
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
      case 'journal':
        container.innerHTML = '<div class="journal-scope" id="tab-content-journal-mount"></div>';
        rtjRender();
        break;
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

function rtjComputeStats(trades, startBal) {
  const safeTrades = Array.isArray(trades) ? trades : [];
  const total = safeTrades.length;
  const wins = safeTrades.filter(t => t && t.status === 'TP').length;
  const loses = safeTrades.filter(t => t && t.status === 'SL').length;
  const bes = safeTrades.filter(t => t && t.status === 'BE').length;
  const wr = total > 0 ? (wins / total * 100).toFixed(1) : 0;
  const netPnl = safeTrades.reduce((s, t) => s + (Number(t.pnl) || 0), 0);

  function calcRR(t) {
    if (!t) return null;
    const entryExitDist = Math.abs((Number(t.entry) || 0) - (Number(t.exit) || 0)); 
    const entrySLDist = Math.abs((Number(t.entry) || 0) - (Number(t.sl) || 0));
    if (entryExitDist === 0 || entrySLDist === 0 || (Number(t.lot) || 0) === 0) return null;
    const pipVal = Math.abs(Number(t.pnl) || 0) / (entryExitDist * Number(t.lot));
    const riskUSD = entrySLDist * Number(t.lot) * pipVal; 
    const rewardUSD = Math.abs(Number(t.pnl) || 0);
    return riskUSD > 0 ? rewardUSD / riskUSD : null;
  }

  const rrs = safeTrades.map(calcRR).filter(r => r !== null && r > 0);
  const avgRR = rrs.length > 0 ? (rrs.reduce((a, b) => a + b, 0) / rrs.length).toFixed(2) + 'R' : '-';

  const grossProfit = safeTrades.filter(t => t && Number(t.pnl) > 0).reduce((s, t) => s + Number(t.pnl), 0);
  const grossLoss = Math.abs(safeTrades.filter(t => t && Number(t.pnl) < 0).reduce((s, t) => s + Number(t.pnl), 0));
  const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : (grossProfit > 0 ? '∞' : '0.00');
  const expectancy = total > 0 ? (netPnl / total).toFixed(2) : '0.00';

  const lossTrades = safeTrades.filter(t => t && Number(t.pnl) < 0);
  const greedCost = Math.abs(lossTrades.filter(t => t.psychology && t.psychology.greed).reduce((s, t) => s + Number(t.pnl), 0));
  const fearCost = Math.abs(lossTrades.filter(t => t.psychology && t.psychology.fear).reduce((s, t) => s + Number(t.pnl), 0));

  let maxWinStreak = 0, maxLossStreak = 0;
  let currentWinStreak = 0, currentLossStreak = 0;
  
  const streakTrades = safeTrades.filter(t => t && (t.status === 'TP' || t.status === 'SL'));
  for (let t of streakTrades) {
    if (t.status === 'TP') {
      currentWinStreak++; currentLossStreak = 0;
      if (currentWinStreak > maxWinStreak) maxWinStreak = currentWinStreak;
    } else if (t.status === 'SL') {
      currentLossStreak++; currentWinStreak = 0;
      if (currentLossStreak > maxLossStreak) maxLossStreak = currentLossStreak;
    }
  }

  return { total, wins, loses, bes, wr, netPnl, avgRR, profitFactor, expectancy, greedCost, fearCost, maxWinStreak, maxLossStreak };
}

function rtjGetAccountAge(account) {
  const allDates = [];
  if (rtjState && Array.isArray(rtjState.trades)) {
    rtjState.trades.forEach(t => { if(t && (account === 'ALL' || (t.account || 'Demo') === account)) allDates.push(new Date(t.date)); });
  }
  if (rtjState && Array.isArray(rtjState.cfs)) {
    rtjState.cfs.forEach(c => { if(c && (account === 'ALL' || (c.account || 'Demo') === account)) allDates.push(new Date(c.date)); });
  }
  
  if (allDates.length === 0) return "0Y 0M 0D";
  
  const minDate = new Date(Math.min(...allDates));
  const now = new Date();
  
  let years = now.getFullYear() - minDate.getFullYear();
  let months = now.getMonth() - minDate.getMonth();
  let days = now.getDate() - minDate.getDate();
  
  if (days < 0) {
    months--;
    const prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  return `${years}Y ${months}M ${days}D`;
}

function rtjGetAccountList() {
  const safeBalances = (rtjState && rtjState.balances) ? rtjState.balances : rtjDEFAULT_BALANCES;
  const defaultAccs = Object.keys(safeBalances);
  const tradeAccs = (rtjState && Array.isArray(rtjState.trades)) ? rtjState.trades.map(t => t ? (t.account || 'Demo') : 'Demo') : [];
  const cfAccs = (rtjState && Array.isArray(rtjState.cfs)) ? rtjState.cfs.map(c => c ? (c.account || 'Demo') : 'Demo') : [];
  return [...new Set([...defaultAccs, ...tradeAccs, ...cfAccs])].filter(Boolean);
}

/* ==========================================================================
   🕹️ RETRO TRADER JOURNAL FUNCTIONS & EVENT ATTACHMENTS
   ========================================================================== */
function rtjGetTodayLosses() { 
  if (!rtjState || !Array.isArray(rtjState.trades)) return 0;
  return rtjState.trades.filter(tr => tr && tr.date === rtjToday() && tr.status === 'SL').length; 
}
function rtjShouldShowAlert() { return rtjGetTodayLosses() >= 2; }

function rtjSyncToCloud() {
  try {
    rtjSave(rtjKEY.TRADES, rtjState.trades);
    rtjSave(rtjKEY.CFS, rtjState.cfs);
    rtjSave(rtjKEY.BALANCES, rtjState.balances);
    if (window.app) {
      window.app.syncStateToCloud();
    }
  } catch (e) {
    console.error("Local save / sync trigger failed:", e);
  }
}

function rtjInitCloudDatabase() {
  // Main app's connectCloudDatabase handles the unified cloud sync.
  // Locally load data on startup
  rtjState.trades = rtjLoad(rtjKEY.TRADES, []);
  rtjState.cfs = rtjLoad(rtjKEY.CFS, []);
  rtjState.balances = rtjLoad(rtjKEY.BALANCES, rtjDEFAULT_BALANCES);
  rtjSyncCrtView();
  if (window.app && window.app.activeTab === 'journal') rtjRender();
}

function rtjSyncCrtView() {
  const crtLayer = document.getElementById('crt-layer');
  if(crtLayer) {
    if(rtjState && rtjState.crt) crtLayer.classList.remove('disabled');
    else crtLayer.classList.add('disabled');
  }
}

function rtjUpdateActiveAccount(accName) {
  if (!accName) return;
  rtjState.f.account = accName;
  rtjState.cf.account = accName;
  rtjState.filter.account = accName;
  rtjState.statsPeriod.account = accName;
  rtjSave(rtjKEY.LAST_ACCOUNT, accName);
  rtjRender();
}

function rtjRender() {
  const mountEl = document.getElementById('tab-content-journal-mount');
  if (!mountEl) return;
  rtjSyncCrtView();
  mountEl.innerHTML = rtjBuildApp();
  if (rtjState && rtjState.crt) {
    mountEl.classList.add('crt-active');
  } else {
    mountEl.classList.remove('crt-active');
  }
  rtjAttachEvents();
}

function rtjBuildApp() {
  return `
    <div id="crt-layer" class="crt"></div>
    ${rtjBuildHubHeader()}
    ${rtjBuildAlert()}
    <div class="page-wrap">
      ${rtjState.page === 'HOME'     ? rtjBuildHome()     : ''}
      ${rtjState.page === 'LOG'      ? rtjBuildLog()      : ''}
      ${rtjState.page === 'STATS'    ? rtjBuildStats()    : ''}
      ${rtjState.page === 'SETTINGS' ? rtjBuildSettings() : ''}
    </div>
    ${rtjBuildNav()}
  `;
}

function rtjBuildHubHeader() {
  const allTrades = Array.isArray(rtjState.trades) ? rtjState.trades : [];
  const targetAcc = rtjState.f.account || 'Demo';

  let filteredTrades = rtjFilterByPeriod(allTrades, rtjState.statsPeriod);
  if (targetAcc !== 'ALL') filteredTrades = filteredTrades.filter(t => t && (t.account || 'Demo') === targetAcc);

  let accStartBal = 0;
  const safeBalances = rtjState.balances || rtjDEFAULT_BALANCES;
  if (targetAcc === 'ALL') {
    accStartBal = Object.values(safeBalances).reduce((a, b) => a + (Number(b) || 0), 0);
  } else {
    accStartBal = Number(safeBalances[targetAcc]) || 0;
  }

  const safeCFs = Array.isArray(rtjState.cfs) ? rtjState.cfs : [];
  const netDeposit = safeCFs.filter(c => c && (targetAcc === 'ALL' || (c.account || 'Demo') === targetAcc))
                            .reduce((s, cf) => s + (cf.type === 'Deposit' ? Number(cf.amount)||0 : -Number(cf.amount)||0), 0);
  const equity = accStartBal + netDeposit + filteredTrades.reduce((s, t) => s + (Number(t.pnl)||0), 0);
  
  const todayTrades = allTrades.filter(tr => tr && tr.date === rtjToday() && (targetAcc === 'ALL' || (tr.account || 'Demo') === targetAcc));
  const todayPnl = todayTrades.reduce((s, tr) => s + (Number(tr.pnl)||0), 0);
  
  return `
    <div class="rpg-hub-header">
      <div class="rpg-avatar-box" id="hub-acc-trigger" title="คลิกสลับพอร์ตอย่างรวดเร็ว">🧙‍♂️</div>
      <div class="rpg-hub-info">
        <div class="rpg-hub-row">
          <span class="rpg-hub-label">ACC:</span>
          <span class="rpg-hub-value" style="color:#33D6FF; text-decoration:underline; cursor:pointer;" id="hub-acc-label">${targetAcc} ▾</span>
        </div>
        <div class="rpg-hub-row">
          <span class="rpg-hub-label">NET EQUITY:</span>
          <span class="rpg-hub-value" style="color:#52FF6B;">$${rtjFmt(equity,1)}</span>
        </div>
        <div class="rpg-hub-row">
          <span class="rpg-hub-label">TODAY P/L:</span>
          <span class="rpg-hub-value ${todayPnl >= 0 ? 'glow-green' : 'glow-red'}">${todayPnl >= 0 ? '+' : ''}$${rtjFmt(todayPnl,1)}</span>
        </div>
      </div>
      <button class="rpg-setting-trigger" id="hub-setting-btn">⚙️</button>
    </div>
  `;
}

function rtjBuildAlert() {
  if (!rtjShouldShowAlert()) return '';
  return `
    <div class="alert-banner">
      <div class="alert-title">⚠ STOP TRADING TODAY ⚠</div>
      <div class="alert-sub">คุณพ่ายแพ้ครบ ${rtjGetTodayLosses()} ไม้แล้วในวันนี้ — ปิดจอ พักผ่อนทันที!</div>
    </div>`;
}

function rtjBuildNav() {
  const pages = [
    { id: 'HOME', icon: '📝', label: 'INPUT' },
    { id: 'LOG', icon: '📋', label: 'LOG' },
    { id: 'STATS', icon: '📊', label: 'STATS' }
  ];
  return `<div class="bottom-nav">
    ${pages.map(p => `<button class="nav-btn ${rtjState.page === p.id ? 'active' : ''}" data-nav="${p.id}"><span class="nav-icon">${p.icon}</span>${p.label}</button>`).join('')}
  </div>`;
}

function rtjBuildHome() {
  return `
    <div class="card">
      <div class="card-title">
        <span>▶ RETRO TRADER ARCADE</span>
        <span class="glow-cyan" style="font-size:7px;">${rtjToday()}</span>
      </div>
      <div class="tabs">
        <button class="tab ${rtjState.inputTab === 'TRADE' ? 'active' : ''}" data-tab-input="TRADE">TRADE</button>
        <button class="tab ${rtjState.inputTab === 'CASHFLOW' ? 'active' : ''}" data-tab-input="CASHFLOW">CASHFLOW</button>
      </div>
      ${rtjState.inputTab === 'TRADE' ? rtjBuildTradeForm() : rtjBuildCFForm()}
    </div>`;
}

function rtjBuildTradeForm() {
  const f = rtjState.f; 
  const symbols = ['GOLD','XAUUSD','BTCUSD','US30','NAS100','EURUSD','GBPUSD','Other']; 
  const tfs = ['1M','5M','15M','30M','1H','4H','D1','W1'];
  const accList = rtjGetAccountList();
  return `
    <label>🎯 พอร์ตบัญชีปลายทาง (LOCKED PERSISTENT)</label>
    <select id="f-account">
      ${accList.map(a => `<option value="${a}" ${f.account === a ? 'selected' : ''}>${a}</option>`).join('')}
    </select>
    <label>วันที่ทำรายการ</label><input type="date" id="f-date" value="${f.date}">
    <label>คู่เงิน / สินทรัพย์</label><select id="f-symbol">${symbols.map(s => `<option ${f.symbol === s ? 'selected' : ''}>${s}</option>`).join('')}</select>
    <label>ทิศทางคำสั่ง</label>
    <div class="status-row" style="margin-bottom:10px">
      <button class="status-btn ${f.dir === 'Buy' ? 'active-tp' : 'tp'}" data-dir="Buy">▲ BUY</button>
      <button class="status-btn ${f.dir === 'Sell' ? 'active-sl' : 'sl'}" data-dir="Sell">▼ SELL</button>
    </div>
    <label>Timeframe</label><select id="f-tf">${tfs.map(t => `<option ${f.tf === t ? 'selected' : ''}>${t}</option>`).join('')}</select>
    <label>Entry Price (ราคาเข้า)</label><input type="number" id="f-entry" placeholder="0.00" value="${f.entry}" inputmode="decimal">
    <label>Exit Price (ราคาออก)</label><input type="number" id="f-exit" placeholder="0.00" value="${f.exit}" inputmode="decimal">
    <label>Stop Loss Price (จุดยอมแพ้)</label><input type="number" id="f-sl" placeholder="0.00" value="${f.sl}" inputmode="decimal">
    <label>Lot Size</label><input type="number" id="f-lot" placeholder="0.01" value="${f.lot}" inputmode="decimal">
    <label>P&amp;L (USD) สุทธิ</label><input type="number" id="f-pnl" placeholder="+/- ใส่ตามจริง" value="${f.pnl}" inputmode="decimal">
    <label>ผลลัพธ์ไม้เทรด</label>
    <div class="status-row">
      <button class="status-btn tp ${f.status === 'TP' ? 'active-tp' : ''}" data-status="TP">✓ TP</button>
      <button class="status-btn sl ${f.status === 'SL' ? 'active-sl' : ''}" data-status="SL">✗ SL</button>
      <button class="status-btn be ${f.status === 'BE' ? 'active-be' : ''}" data-status="BE">= BE</button>
    </div>
    <label>สภาวะอารมณ์ตอนเทรด</label>
    <div class="psych-row">
      <button class="psych-btn ${f.conf ? 'checked' : ''}" data-psych="conf">🔥 Conf</button>
      <button class="psych-btn ${f.fear ? 'checked' : ''}" data-psych="fear">🙀 Fear</button>
      <button class="psych-btn ${f.greed ? 'checked' : ''}" data-psych="greed">💢 Greed</button>
    </div>
    <button class="btn btn-green" id="btn-add-trade">► ADD TACTICAL TRADE</button>`;
}

function rtjBuildCFForm() {
  const cf = rtjState.cf;
  const accList = rtjGetAccountList();
  return `
    <label>🎯 คลังบัญชีเงินสด</label>
    <select id="cf-account">
      ${accList.map(a => `<option value="${a}" ${cf.account === a ? 'selected' : ''}>${a}</option>`).join('')}
    </select>
    <label>วันที่</label><input type="date" id="cf-date" value="${cf.date}">
    <label>ประเภทกระแสเงินสด</label>
    <div class="status-row" style="margin-bottom:10px">
      <button class="status-btn tp ${cf.type === 'Deposit' ? 'active-tp' : ''}" data-cftype="Deposit">▲ ฝากเงิน</button>
      <button class="status-btn sl ${cf.type === 'Withdraw' ? 'active-sl' : ''}" data-cftype="Withdraw">▼ ถอนเงิน</button>
    </div>
    <label>จำนวนเงินสุทธิ (USD)</label><input type="number" id="cf-amount" placeholder="0.00" value="${cf.amount}" inputmode="decimal">
    <label>หมายเหตุบันทึกจำ</label><input type="text" id="cf-desc" placeholder="เพิ่มทุน..." value="${cf.desc}">
    <button class="btn btn-green" id="btn-add-cf">► ADD CASHFLOW RECORD</button>`;
}

function rtjBuildLog() {
  const allTrades = Array.isArray(rtjState.trades) ? rtjState.trades : [];
  const symbols = ['ALL', ...new Set(allTrades.map(t => t ? t.symbol : ''))].filter(Boolean);
  return `
    <div class="card">
      <div class="card-title"><span>📋 DATA LEDGER LOG</span></div>
      <div class="tabs">
        <button class="tab ${rtjState.logTab === 'TRADE' ? 'active' : ''}" data-tab-log="TRADE">TRADE</button>
        <button class="tab ${rtjState.logTab === 'CASHFLOW' ? 'active' : ''}" data-tab-log="CASHFLOW">CASHFLOW</button>
      </div>
      ${rtjState.logTab === 'TRADE' ? rtjBuildTradeLog(symbols) : rtjBuildCFLog()}
    </div>`;
}

function rtjBuildPeriodFilter(prefix, period) {
  const safePeriod = period || { mode: 'all' };
  return `
    <div class="filter-bar">
      <div class="filter-row">
        <select id="${prefix}-period-mode" style="flex:1">
          <option value="all" ${safePeriod.mode === 'all' ? 'selected' : ''}>All Time History</option>
          <option value="daily" ${safePeriod.mode === 'daily' ? 'selected' : ''}>Daily Summary</option>
          <option value="weekly" ${safePeriod.mode === 'weekly' ? 'selected' : ''}>Weekly Range</option>
          <option value="monthly" ${safePeriod.mode === 'monthly' ? 'selected' : ''}>Monthly Range</option>
          <option value="custom" ${safePeriod.mode === 'custom' ? 'selected' : ''}>Custom Range Target</option>
        </select>
      </div>
      ${safePeriod.mode === 'daily' ? `<div class="filter-row"><input type="date" id="${prefix}-period-date" value="${safePeriod.date || rtjToday()}" style="flex:1"></div>` : ''}
      ${safePeriod.mode === 'custom' ? `<div class="filter-row"><input type="date" id="${prefix}-period-from" value="${safePeriod.from || ''}" style="flex:1"><input type="date" id="${prefix}-period-to" value="${safePeriod.to || ''}" style="flex:1"></div>` : ''}
    </div>`;
}

function rtjBuildTradeLog(symbols) {
  const safeFilter = rtjState.filter || { period: { mode: 'all' }, symbol: 'ALL', status: 'ALL', account: 'ALL' };
  const p = safeFilter.period || { mode: 'all' }; 
  const allTrades = Array.isArray(rtjState.trades) ? rtjState.trades : [];
  let filtered = [...allTrades].sort((a,b) => (b && a && b.date && a.date) ? b.date.localeCompare(a.date) : 0); 
  filtered = rtjFilterByPeriod(filtered, p);
  
  if (safeFilter.symbol !== 'ALL') filtered = filtered.filter(t => t && t.symbol === safeFilter.symbol);
  if (safeFilter.status !== 'ALL') filtered = filtered.filter(t => t && t.status === safeFilter.status);
  if (safeFilter.account !== 'ALL') filtered = filtered.filter(t => t && (t.account || 'Demo') === safeFilter.account);
  
  const accList = rtjGetAccountList();
  return `
    ${rtjBuildPeriodFilter('log', p)}
    <div class="filter-row" style="gap:4px;margin-bottom:10px">
      <select id="flt-account" style="flex:1;font-size:7px">
        <option value="ALL" ${safeFilter.account === 'ALL' ? 'selected' : ''}>ALL ACCOUNTS</option>
        ${accList.map(a => `<option value="${a}" ${safeFilter.account === a ? 'selected' : ''}>${a}</option>`).join('')}
      </select>
      <select id="flt-symbol" style="flex:1;font-size:7px">${symbols.map(s => `<option ${safeFilter.symbol === s ? 'selected' : ''}>${s}</option>`).join('')}</select>
      <select id="flt-status" style="flex:1;font-size:7px">${['ALL','TP','SL','BE'].map(s => `<option ${safeFilter.status === s ? 'selected' : ''}>${s}</option>`).join('')}</select>
    </div>
    ${filtered.length === 0 ? `<div class="empty">ไม่พบประวัติข้อมูลชุดนี้</div>` : filtered.map(t => rtjBuildTradeItem(t)).join('')}`;
}

function rtjBuildTradeItem(t) {
  if (!t) return '';
  const pnlVal = Number(t.pnl) || 0;
  const pnlClass = pnlVal > 0 ? 'glow-green' : pnlVal < 0 ? 'glow-red' : 'glow-yellow'; 
  const pnlSign = pnlVal > 0 ? '+' : ''; 
  const badgeCls = t.status === 'TP' ? 'badge-tp' : t.status === 'SL' ? 'badge-sl' : 'badge-be'; 
  const em = t.psychology || {}; 
  const emTags = [em.conf && '🔥', em.fear && '🙀', em.greed && '💢'].filter(Boolean).join(' ');
  return `
    <div class="trade-item">
      <div class="trade-header">
        <span class="trade-symbol">${t.symbol} [${t.account || 'Demo'}] <span class="${t.dir === 'Buy' ? 'glow-green' : 'glow-red'}">${t.dir === 'Buy' ? '▲ BUY' : '▼ SELL'}</span></span>
        <span class="badge ${badgeCls}">${t.status}</span>
      </div>
      <div class="trade-row"><span class="trade-label">EXECUTION DATE</span><span class="trade-value">${rtjFmtDate(t.date)}</span></div>
      <div class="trade-row"><span class="trade-label">ENTRY / EXIT</span><span class="trade-value">${rtjFmt(t.entry,2)} → ${rtjFmt(t.exit,2)}</span></div>
      <div class="trade-row"><span class="trade-label">SL / LOT SIZE</span><span class="trade-value">${rtjFmt(t.sl,2)} / ${t.lot}</span></div>
      <div class="trade-row"><span class="trade-label">TIMEFRAME</span><span class="trade-value">${t.tf || '1H'}</span></div>
      <div class="trade-row"><span class="trade-label">NET P&L (USD)</span><span class="${pnlClass}">${pnlSign}$${rtjFmt(t.pnl,2)}</span></div>
      ${emTags ? `<div style="margin-top:4px;font-size:10px">${emTags}</div>` : ''}
      <div style="margin-top:8px;text-align:right"><button class="del-btn" data-del-trade="${t.id}">✕ DELETE RECORD</button></div>
    </div>`;
}

function rtjBuildCFLog() {
  const safeCFs = Array.isArray(rtjState.cfs) ? rtjState.cfs : [];
  const safeFilter = rtjState.filter || { account: 'ALL' };
  let sorted = [...safeCFs].sort((a,b) => (b && a && b.date && a.date) ? b.date.localeCompare(a.date) : 0);
  if (safeFilter.account !== 'ALL') sorted = sorted.filter(c => c && (c.account || 'Demo') === safeFilter.account);
  if (sorted.length === 0) return `<div class="empty">ไม่มีรายการกระแสเงินสด</div>`;
  return sorted.map(cf => `
    <div class="cf-item">
      <div>
        <div style="color:#FFD54F;font-size:7px;margin-bottom:3px">${rtjFmtDate(cf.date)} [${cf.account || 'Demo'}]</div>
        <div style="font-size:8px;color:#F5F5F5">${cf.desc || cf.type}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <span class="${cf.type === 'Deposit' ? 'cf-deposit' : 'cf-withdraw'}" style="font-size:9px">${cf.type === 'Deposit' ? '+' : '-'}$${rtjFmt(cf.amount,0)}</span>
        <button class="del-btn" data-del-cf="${cf.id}">✕</button>
      </div>
    </div>`).join('');
}

function rtjBuildCalendarSection(allTrades, accountFilter) {
  const safeTrades = Array.isArray(allTrades) ? allTrades : [];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const year = rtjState.calYear || new Date().getFullYear(); 
  const month = rtjState.calMonth !== undefined ? rtjState.calMonth : new Date().getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1; 
  const totalDays = new Date(year, month + 1, 0).getDate();

  const weekdays = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
  let htmlMesh = weekdays.map(w => `<div class="cal-weekday">${w}</div>`).join('');

  for (let i = 0; i < adjustedFirstDay; i++) { htmlMesh += `<div class="cal-day-node skin-cal-blank"></div>`; }

  const tStr = rtjToday();
  for (let day = 1; day <= totalDays; day++) {
    const currentStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    let dayTrades = safeTrades.filter(t => t && t.date === currentStr);
    if (accountFilter !== 'ALL') dayTrades = dayTrades.filter(t => t && (t.account || 'Demo') === accountFilter);

    const tradeCount = dayTrades.length;
    const totalPnl = dayTrades.reduce((s, t) => s + (Number(t.pnl) || 0), 0);

    let skinClass = "skin-cal-neutral";
    let pnlDisplay = "$0.00";
    if (tradeCount > 0) {
      if (totalPnl > 0) { skinClass = "skin-cal-win"; pnlDisplay = `+$${totalPnl.toFixed(0)}`; }
      else if (totalPnl < 0) { skinClass = "skin-cal-loss"; pnlDisplay = `-$${Math.abs(totalPnl).toFixed(0)}`; }
    }
    
    const isToday = currentStr === tStr;
    if(isToday) skinClass += " skin-cal-today";

    htmlMesh += `
      <div class="cal-day-node ${skinClass}">
        <div class="cal-day-idx">${isToday ? '★' + day : day}</div>
        <div class="cal-day-pnl">${tradeCount > 0 ? pnlDisplay : '$0'}</div>
        <div class="cal-day-count">${tradeCount}T</div>
      </div>`;
  }

  const totalCells = adjustedFirstDay + totalDays;
  const remainingCells = (7 - (totalCells % 7)) % 7;
  for (let i = 0; i < remainingCells; i++) { htmlMesh += `<div class="cal-day-node skin-cal-blank"></div>`; }

  return `
    <div class="cal-box">
      <div class="cal-header-layout">
        <button class="btn" id="cal-prev" style="width:35px; margin:0; padding:4px 0;"><</button>
        <span class="glow-cyan" style="font-size:7px;">${monthNames[month]} ${year}</span>
        <button class="btn" id="cal-next" style="width:35px; margin:0; padding:4px 0;">></button>
      </div>
      <div class="cal-grid-mesh">${htmlMesh}</div>
    </div>`;
}

function rtjBuildWeekdayBreakdown(filteredTrades) {
  const safeTrades = Array.isArray(filteredTrades) ? filteredTrades : [];
  const daysConfig = [
    { idx: 1, label: "MON 🌙" },
    { idx: 2, label: "TUE ☄️" },
    { idx: 3, label: "WED 🛰️" },
    { idx: 4, label: "THU 🚀" },
    { idx: 5, label: "FRI 🛸" },
    { idx: 6, label: "SAT 🪐" },
    { idx: 0, label: "SUN 🌌" }
  ];

  const weekdayPnl = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 0: 0 };
  safeTrades.forEach(t => {
    if (t && t.date) {
      const [y, m, d] = t.date.split('-');
      const dayOfWeek = new Date(+y, +m - 1, +d).getDay();
      weekdayPnl[dayOfWeek] += Number(t.pnl) || 0;
    }
  });

  return `
    <div class="stats-block">
      <div class="stats-block-title">📦 BLOCK 3: WEEKDAY PERFORMANCE MATRIX</div>
      <div class="weekday-grid">
        ${daysConfig.map(d => {
          const val = weekdayPnl[d.idx];
          const colorClass = val > 0 ? 'glow-green' : (val < 0 ? 'glow-red' : 'txt-white');
          return `
            <div class="weekday-node">
              <div class="weekday-lbl">${d.label}</div>
              <div class="weekday-val ${colorClass}">${val >= 0 ? '+' : ''}$${val.toFixed(0)}</div>
            </div>`;
        }).join('')}
      </div>
    </div>`;
}

function rtjBuildStats() {
  const p = rtjState.statsPeriod || { mode: 'all', account: 'ALL' }; 
  const targetAcc = p.account || 'ALL'; 
  const allTrades = Array.isArray(rtjState.trades) ? rtjState.trades : []; 
  let filtered = rtjFilterByPeriod(allTrades, p);
  if (targetAcc !== 'ALL') filtered = filtered.filter(t => t && (t.account || 'Demo') === targetAcc);

  let accStartBal = 0;
  const safeBalances = rtjState.balances || rtjDEFAULT_BALANCES;
  if (targetAcc === 'ALL') {
    accStartBal = Object.values(safeBalances).reduce((a, b) => a + (Number(b) || 0), 0);
  } else {
    accStartBal = Number(safeBalances[targetAcc]) || 0;
  }

  const todayTrades = allTrades.filter(tr => tr && tr.date === rtjToday() && (targetAcc === 'ALL' || (tr.account || 'Demo') === targetAcc));
  const todayPnl = todayTrades.reduce((s, tr) => s + (Number(tr.pnl) || 0), 0); 
  const st = rtjComputeStats(filtered, accStartBal); 
  
  const safeCFs = Array.isArray(rtjState.cfs) ? rtjState.cfs : [];
  const netDeposit = safeCFs.filter(c => c && (targetAcc === 'ALL' || (c.account || 'Demo') === targetAcc))
                           .reduce((s, cf) => s + (cf.type === 'Deposit' ? Number(cf.amount) || 0 : -Number(cf.amount) || 0), 0); 
  const equity = accStartBal + netDeposit + filtered.reduce((s, t) => s + (Number(t.pnl) || 0), 0);

  const pfClass = parseFloat(st.profitFactor) >= 1.5 ? 'glow-green' : (parseFloat(st.profitFactor) < 1.0 ? 'glow-red' : 'txt-white');
  const expClass = parseFloat(st.expectancy) >= 0 ? 'glow-green' : 'glow-red';
  
  const accAgeStr = rtjGetAccountAge(targetAcc);
  const accList = rtjGetAccountList();

  return `
    <div class="card">
      <div class="card-title"><span>📊 COMMAND STATS MODULE</span></div>
      
      <div style="color:#FFD54F;font-size:7px;margin-bottom:6px">GLOBAL STATE FILTERS</div>
      ${rtjBuildPeriodFilter('stats', p)}
      <div class="filter-row" style="margin-bottom:12px">
        <select id="stats-account" style="width:100%;font-size:7px">
          <option value="ALL" ${p.account === 'ALL' ? 'selected' : ''}>ALL ACCOUNTS CONSOLIDATED</option>
          ${accList.map(a => `<option value="${a}" ${p.account === a ? 'selected' : ''}>${a}</option>`).join('')}
        </select>
      </div>

      <div class="stats-block">
        <div class="stats-block-title">📦 BLOCK 1: ACCOUNT PROFILE DATABASE [ ${targetAcc} ]</div>
        <div class="inner-grid">
          <div class="stat-subbox"><div class="stat-sublabel">NET EQUITY CAPITAL</div><div class="stat-subvalue glow-cyan">$${rtjFmt(equity,2)}</div></div>
          <div class="stat-subbox"><div class="stat-sublabel">ACCOUNT AGE HISTORY</div><div class="stat-subvalue glow-yellow" style="font-size:7px">${accAgeStr}</div></div>
          <div class="stat-subbox" style="grid-column: span 2">
            <div class="stat-sublabel">WIN RATE HP STATUS [ ${st.wr}% ]</div>
            <div class="hp-bar-wrap"><div class="hp-bar-fill" style="width: ${st.wr}%;"></div></div>
          </div>
        </div>
      </div>

      <div class="stats-block">
        <div class="stats-block-title">📦 BLOCK 2: QUANT PERFORMANCE RADAR</div>
        <div class="inner-grid">
          <div class="stat-subbox"><div class="stat-sublabel">PROFIT FACTOR</div><div class="stat-subvalue ${pfClass}">${st.profitFactor}</div></div>
          <div class="stat-subbox"><div class="stat-sublabel">EXPECTANCY / TRADE</div><div class="stat-subvalue ${expClass}">${parseFloat(st.expectancy) >= 0 ? '+' : ''}$${st.expectancy}</div></div>
          <div class="stat-subbox"><div class="stat-sublabel">MAX WIN STREAK</div><div class="stat-subvalue glow-green">${st.maxWinStreak}</div></div>
          <div class="stat-subbox"><div class="stat-sublabel">MAX LOSS STREAK</div><div class="stat-subvalue glow-red">${st.maxLossStreak}</div></div>
          <div class="stat-subbox"><div class="stat-sublabel">AVG WIN R:R</div><div class="stat-subvalue txt-white">${st.avgRR}</div></div>
          <div class="stat-subbox"><div class="stat-sublabel">TOTAL TRADES</div><div class="stat-subvalue glow-cyan">${st.total}</div></div>
          
          <div class="stat-subbox" style="grid-column: span 2">
            <div class="stat-sublabel">CORE ACTION MATRIX RATIO</div>
            <div style="display:flex; justify-content:space-around; margin-top:4px; font-size:7px;">
              <span>W: <span class="glow-green">${st.wins}</span></span>
              <span>BE: <span class="glow-yellow">${st.bes}</span></span>
              <span>L: <span class="glow-red">${st.loses}</span></span>
            </div>
          </div>
        </div>
      </div>

      ${rtjBuildWeekdayBreakdown(filtered)}

      <div class="stats-block">
        <div class="stats-block-title">📦 BLOCK 4: ANALYTICS CHANNELS &amp; DIARY</div>
        
        <div class="psych-cost-box" style="margin-bottom:10px;">
          <div style="color:#FF4E63; font-size:7px; margin-bottom:6px;">⚠️ PSYCHOLOGY LOSS SPECTRUM</div>
          <div class="psych-cost-row"><span>GREED COST:</span><span class="glow-red">-$${rtjFmt(st.greedCost,2)}</span></div>
          <div class="psych-cost-row"><span>FEAR COST:</span><span class="glow-red">-$${rtjFmt(st.fearCost,2)}</span></div>
        </div>

        ${rtjBuildCalendarSection(allTrades, targetAcc)}
      </div>

      <div class="stats-block">
        <div class="stats-block-title">📊 SYSTEM DATA CHARTS</div>
        <div class="stat-subbox" style="margin-bottom:6px;"><div class="stat-sublabel">TODAY'S NET P&amp;L HUM</div><div class="stat-subvalue ${todayPnl >= 0 ? 'glow-green' : 'glow-red'}">${todayPnl >= 0 ? '+' : ''}$${rtjFmt(todayPnl,2)}</div></div>
        ${rtjBuildEquityCurve(filtered)}
        ${rtjBuildPieChart(st)}
      </div>

    </div>`;
}

function rtjBuildEquityCurve(trades) {
  const safeTrades = Array.isArray(trades) ? trades : [];
  if (safeTrades.length < 2) return `<div class="empty" style="margin-top:12px">เพิ่มประวัติการเทรดเพื่อสร้างสายกราฟพอร์ต</div>`;
  const sorted = [...safeTrades].sort((a,b) => (a && b && a.date && b.date) ? a.date.localeCompare(b.date) : 0); 
  let cum = 0; const points = sorted.map(t => { cum += Number(t.pnl) || 0; return cum; }); 
  const maxV = Math.max(...points, 0); const minV = Math.min(...points, 0); const range = maxV - minV || 1; 
  const W = 300, H = 110, PL = 4, PR = 4, PT = 8, PB = 20; const IW = W - PL - PR, IH = H - PT - PB;
  const pts = points.map((v, i) => { const x = PL + (i / (points.length - 1 || 1)) * IW; const y = PT + IH - ((v - minV) / range) * IH; return `${x.toFixed(1)},${y.toFixed(1)}`; }).join(' ');
  const zeroY = (PT + IH - ((0 - minV) / range) * IH).toFixed(1);
  return `
    <div style="margin-top:12px;color:#FFD54F;font-size:7px;margin-bottom:4px">📈 EQUITY GROWTH TRAJECTORY</div>
    <div style="overflow-x:auto">
      <svg width="${W}" height="${H}" style="display:block;background:#090B15;border:2px solid #304FFE">
        <line x1="${PL}" y1="${zeroY}" x2="${W-PR}" y2="${zeroY}" stroke="#111827" stroke-width="1" stroke-dasharray="4,3"/>
        <polyline points="${pts}" fill="none" stroke="#33D6FF" stroke-width="2"/>
      </svg>
    </div>`;
}

function rtjBuildPieChart(st) {
  const total = st.wins + st.loses + st.bes; if (total === 0) return `<div class="empty" style="margin-top:12px">ไม่มีข้อมูลเรนเดอร์อัตราส่วนสถิติ</div>`;
  const cx = 60, cy = 60, r = 50;
  const slices = [{ label: 'Win', val: st.wins, color: '#52FF6B' }, { label: 'BE', val: st.bes, color: '#FFD54F' }, { label: 'Lose', val: st.loses, color: '#FF4E63' }].filter(s => s.val > 0);
  let paths = ''; let startAngle = -Math.PI / 2;
  slices.forEach(s => {
    const angle = (s.val / total) * Math.PI * 2; const endAngle = startAngle + angle;
    const x1 = cx + r * Math.cos(startAngle); const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle); const y2 = cy + r * Math.sin(endAngle);
    const large = angle > Math.PI ? 1 : 0;
    if (slices.length === 1) { paths += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${s.color}" opacity="0.85"/>`; }
    else { paths += `<path d="M${cx},${cy} L${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${large},1 ${x2.toFixed(2)},${y2.toFixed(2)} Z" fill="${s.color}" opacity="0.85" stroke="#090B15" stroke-width="1"/>`; }
    startAngle = endAngle;
  });
  const legend = [{ label: 'Win', pct: st.wins, color: '#52FF6B' }, { label: 'BE', pct: st.bes, color: '#FFD54F' }, { label: 'Lose', pct: st.loses, color: '#FF4E63' }];
  return `
    <div style="margin-top:12px;color:#FFD54F;font-size:7px;margin-bottom:4px">🥧 ACTION WIN/BE/LOSE RATIO</div>
    <div class="pie-wrap">
      <svg width="120" height="120" style="flex-shrink:0">${paths}</svg>
      <div class="pie-legend">
        ${legend.map(l => `
          <div class="pie-legend-item">
            <div class="pie-dot" style="background:${l.color}"></div>
            <span style="color:#F5F5F5">${l.label}</span>
            <span style="color:#33D6FF">${l.pct} <span style="color:#FFD54F">(${total > 0 ? (l.pct / total * 100).toFixed(0) : 0}%)</span></span>
          </div>`).join('')}
      </div>
    </div>`;
}

function rtjBuildSettings() {
  const accList = rtjGetAccountList();
  const safeBalances = rtjState.balances || rtjDEFAULT_BALANCES;
  return `
    <div class="card">
      <div class="card-title"><span>⚙ CONFIG OPERATIONS</span></div>
      <div class="setting-row">
        <span>จอแก้ว CRT FILTER</span>
        <div class="toggle" id="toggle-crt"><div class="toggle-knob ${rtjState.crt ? 'on' : 'off'}"></div></div>
      </div>
      <div class="setting-row">
        <span>เสียง 8-bit ALERTS</span>
        <div class="toggle" id="toggle-sound"><div class="toggle-knob ${rtjState.sound ? 'on' : 'off'}"></div></div>
      </div>
      
      <div class="divider"></div>
      <div style="color:#FFD54F;font-size:7px;margin-bottom:8px">💰 STARTING BALANCES BY PORTFOLIO ($)</div>
      <div id="balances-list-container">
        ${accList.map(a => `
          <div class="bal-card-item">
            <span style="color:#33D6FF;">${a}</span>
            <div style="display:flex; gap:6px; align-items:center;">
              <input type="number" class="bal-input-node" data-acc="${a}" value="${safeBalances[a] !== undefined ? safeBalances[a] : 0}" style="width:100px; margin-bottom:0; font-size:8px;">
              ${!['Demo','LIFE','RISK','Swingtrade'].includes(a) ? `<button class="del-btn" data-del-acc="${a}" style="min-width:44px; min-height:44px;">✕</button>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
      <button class="btn btn-green" id="btn-save-all-bal" style="margin-bottom:8px">💾 SAVE ALL BALANCES</button>
      
      <div style="margin-top:10px;">
        <label>➕ สร้างบัญชีพอร์ตใหม่ (DYNAMIC ACCOUNT)</label>
        <div style="display:flex; gap:6px;">
          <input type="text" id="new-acc-name" placeholder="เช่น Scalping, Fund1" style="margin-bottom:0; flex:1;">
          <button class="btn" id="btn-add-acc" style="margin-top:0; width:80px;">ADD</button>
        </div>
      </div>

      <div class="divider"></div>
      <div style="color:#FFD54F;font-size:7px;margin-bottom:8px">💾 DATA DISK MANAGEMENT</div>
      <button class="btn btn-green" id="btn-backup" style="margin-bottom:8px">▼ BACKUP CORE DATA</button>
      <button class="btn" id="btn-import-trigger" style="margin-bottom:8px">▲ IMPORT DATA DISK</button>
      <input type="file" id="btn-import" accept=".json" style="display:none">
      <div class="divider"></div>
      <div style="color:#FF4E63;font-size:7px;margin-bottom:8px">⚠ DANGER ZONE DEPOT</div>
      <button class="btn btn-red" id="btn-clear-trades">✕ ล้างประวัติการเทรดทั้งหมด</button>
    </div>`;
}

function rtjAttachEvents() {
  document.querySelectorAll('.journal-scope [data-nav]').forEach(el => { el.addEventListener('click', () => { rtjState.page = el.dataset.nav; rtjBeep('click'); rtjRender(); }); });
  document.querySelectorAll('.journal-scope [data-tab-input]').forEach(el => { el.addEventListener('click', () => { rtjState.inputTab = el.dataset.tabInput; rtjRender(); }); });
  document.querySelectorAll('.journal-scope [data-tab-log]').forEach(el => { el.addEventListener('click', () => { rtjState.logTab = el.dataset.tabLog; rtjRender(); }); });
  
  const hubSetting = document.getElementById('hub-setting-btn');
  if(hubSetting) { hubSetting.addEventListener('click', () => { rtjState.page = 'SETTINGS'; rtjBeep('click'); rtjRender(); }); }

  const hubAccTrigger = document.getElementById('hub-acc-trigger');
  const hubAccLabel = document.getElementById('hub-acc-label');
  const triggerSwitch = () => {
    const accs = rtjGetAccountList();
    const currIndex = accs.indexOf(rtjState.f.account);
    const nextAcc = accs[(currIndex + 1) % accs.length];
    rtjUpdateActiveAccount(nextAcc);
    rtjBeep('click');
  };
  if(hubAccTrigger) hubAccTrigger.addEventListener('click', triggerSwitch);
  if(hubAccLabel) hubAccLabel.addEventListener('click', triggerSwitch);

  const liveF = {'f-date':v=>rtjState.f.date=v,'f-symbol':v=>rtjState.f.symbol=v,'f-tf':v=>rtjState.f.tf=v,'f-entry':v=>rtjState.f.entry=v,'f-exit':v=>rtjState.f.exit=v,'f-sl':v=>rtjState.f.sl=v,'f-lot':v=>rtjState.f.lot=v,'f-pnl':v=>rtjState.f.pnl=v};
  Object.entries(liveF).forEach(([id,fn]) => { const el = document.getElementById(id); if(el) el.addEventListener('input', e => fn(e.target.value)); });

  const fAcc = document.getElementById('f-account');
  if(fAcc) fAcc.addEventListener('change', e => rtjUpdateActiveAccount(e.target.value));

  document.querySelectorAll('.journal-scope [data-dir]').forEach(el => { el.addEventListener('click', () => { rtjState.f.dir = el.dataset.dir; rtjRender(); }); });
  document.querySelectorAll('.journal-scope [data-status]').forEach(el => { el.addEventListener('click', () => { rtjState.f.status = el.dataset.status; rtjRender(); }); });
  document.querySelectorAll('.journal-scope [data-psych]').forEach(el => { el.addEventListener('click', () => { const k = el.dataset.psych; rtjState.f[k] = !rtjState.f[k]; el.classList.toggle('checked'); rtjBeep('click'); }); });
  document.querySelectorAll('.journal-scope [data-cftype]').forEach(el => { el.addEventListener('click', () => { rtjState.cf.type = el.dataset.cftype; rtjRender(); }); });

  const cfAcc = document.getElementById('cf-account'); if(cfAcc) cfAcc.addEventListener('change', e => rtjUpdateActiveAccount(e.target.value));
  ['cf-date','cf-amount','cf-desc'].forEach(id => { const el = document.getElementById(id); if(el) el.addEventListener('input', e => { if(id === 'cf-date') rtjState.cf.date = e.target.value; if(id === 'cf-amount') rtjState.cf.amount = e.target.value; if(id === 'cf-desc') rtjState.cf.desc = e.target.value; }); });

  const fltAcc = document.getElementById('flt-account'); if(fltAcc) fltAcc.addEventListener('change', e => rtjUpdateActiveAccount(e.target.value));
  const fltSym = document.getElementById('flt-symbol'); if(fltSym) fltSym.addEventListener('change', e => { if(!rtjState.filter) rtjState.filter = {account:'ALL',symbol:'ALL',status:'ALL',period:{mode:'all'}}; rtjState.filter.symbol = e.target.value; rtjRender(); });
  const fltSt = document.getElementById('flt-status'); if(fltSt) fltSt.addEventListener('change', e => { if(!rtjState.filter) rtjState.filter = {account:'ALL',symbol:'ALL',status:'ALL',period:{mode:'all'}}; rtjState.filter.status = e.target.value; rtjRender(); });
  
  const statsAcc = document.getElementById('stats-account'); if(statsAcc) statsAcc.addEventListener('change', e => rtjUpdateActiveAccount(e.target.value));

  rtjBindPeriodFilter('log', rtjState.filter ? rtjState.filter.period : {mode:'all'}, (p) => { rtjState.filter.period = p; rtjRender(); });
  rtjBindPeriodFilter('stats', rtjState.statsPeriod || {mode:'all',account:'ALL'}, (p) => { rtjState.statsPeriod = p; rtjRender(); });

  const btnTrade = document.getElementById('btn-add-trade');
  if(btnTrade) btnTrade.addEventListener('click', () => {
    const f = rtjState.f; if(!f.entry || !f.exit || !f.sl || !f.lot || f.pnl === ''){ alert('กรอกตัวเลขราคาและหลอดให้ครบถ้วนก่อนส่งข้อมูล!'); return; }
    if(!Array.isArray(rtjState.trades)) rtjState.trades = [];
    rtjState.trades.push({id:rtjUid(), date:f.date, symbol:f.symbol, dir:f.dir, entry:parseFloat(f.entry)||0, exit:parseFloat(f.exit)||0, sl:parseFloat(f.sl)||0, lot:parseFloat(f.lot)||0, pnl:parseFloat(f.pnl)||0, status:f.status, tf:f.tf, psychology:{conf:f.conf, fear:f.fear, greed:f.greed}, account:f.account});
    rtjSave(rtjKEY.TRADES, rtjState.trades); rtjSyncToCloud();
    if(f.status === 'TP') rtjBeep('win'); else if(f.status === 'SL') rtjBeep('lose'); else rtjBeep('click');
    const currentAccount = rtjState.f.account;
    rtjState.f = {...rtjState.f, entry:'', exit:'', sl:'', lot:'', pnl:'', status:'TP', conf:false, fear:false, greed:false, account: currentAccount}; 
    rtjRender();
  });

  const btnCF = document.getElementById('btn-add-cf');
  if(btnCF) btnCF.addEventListener('click', () => {
    const cf = rtjState.cf; if(!cf.amount || parseFloat(cf.amount) <= 0){ alert('ระบุจำนวนเงินสดเป็นตัวเลขด้วย!'); return; }
    if(!Array.isArray(rtjState.cfs)) rtjState.cfs = [];
    rtjState.cfs.push({id:rtjUid(), date:cf.date, type:cf.type, amount:parseFloat(cf.amount), desc:cf.desc, account:cf.account});
    rtjSave(rtjKEY.CFS, rtjState.cfs); rtjSyncToCloud(); rtjBeep('win');
    const currentAccount = rtjState.cf.account;
    rtjState.cf = {date:rtjToday(), type:'Deposit', amount:'', desc:'', account:currentAccount}; 
    rtjRender();
  });

  document.querySelectorAll('.journal-scope [data-del-trade]').forEach(el => { el.addEventListener('click', () => { if(!confirm('ยืนยันลบประวัติไม้เทรดนี้ถาวร?')) return; rtjState.trades = rtjState.trades.filter(t => t && t.id !== el.dataset.delTrade); rtjSave(rtjKEY.TRADES, rtjState.trades); rtjSyncToCloud(); rtjRender(); }); });
  document.querySelectorAll('.journal-scope [data-del-cf]').forEach(el => { el.addEventListener('click', () => { if(!confirm('ลบรายการกระแสเงินสดนี้?')) return; rtjState.cfs = rtjState.cfs.filter(c => c && c.id !== el.dataset.delCf); rtjSave(rtjKEY.CFS, rtjState.cfs); rtjSyncToCloud(); rtjRender(); }); });
  
  const tog = document.getElementById('toggle-sound'); if(tog) tog.addEventListener('click', () => { rtjState.sound = !rtjState.sound; rtjSave(rtjKEY.SOUND, rtjState.sound); rtjRender(); });
  const togCrt = document.getElementById('toggle-crt'); if(togCrt) togCrt.addEventListener('click', () => { rtjState.crt = !rtjState.crt; rtjSave(rtjKEY.CRT, rtjState.crt); rtjRender(); });

  const btnSaveAllBal = document.getElementById('btn-save-all-bal');
  if (btnSaveAllBal) {
    btnSaveAllBal.addEventListener('click', () => {
      const inputs = document.querySelectorAll('#balances-list-container .bal-input-node');
      inputs.forEach(inp => {
        const acc = inp.dataset.acc;
        const val = parseFloat(inp.value);
        if (acc && !isNaN(val)) {
          rtjState.balances[acc] = val;
        }
      });
      rtjSave(rtjKEY.BALANCES, rtjState.balances);
      rtjSyncToCloud();
      rtjBeep('win');
      alert('💾 บันทึกยอดเงินเริ่มต้นทุกพอร์ตสำเร็จ!');
      rtjRender();
    });
  }

  const btnAddAcc = document.getElementById('btn-add-acc');
  if (btnAddAcc) {
    btnAddAcc.addEventListener('click', () => {
      const input = document.getElementById('new-acc-name');
      const name = input ? input.value.trim() : '';
      if (!name) { alert('โปรดกรอกชื่อพอร์ต!'); return; }
      if (!rtjState.balances[name]) {
        rtjState.balances[name] = 0;
        rtjSave(rtjKEY.BALANCES, rtjState.balances);
        rtjSyncToCloud();
        rtjUpdateActiveAccount(name);
      } else { alert('มีชื่อพอร์ตนี้อยู่แล้ว!'); }
    });
  }

  const btnBackup = document.getElementById('btn-backup');
  if (btnBackup) {
    btnBackup.addEventListener('click', () => {
      const data = { trades: rtjState.trades, cfs: rtjState.cfs, balances: rtjState.balances };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `rtj_backup_${rtjToday()}.json`;
      a.click();
    });
  }

  const btnImpTrig = document.getElementById('btn-import-trigger');
  const fileImp = document.getElementById('btn-import');
  if (btnImpTrig && fileImp) {
    btnImpTrig.addEventListener('click', () => fileImp.click());
    fileImp.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const d = JSON.parse(evt.target.result);
          if (d.trades) rtjState.trades = d.trades;
          if (d.cfs) rtjState.cfs = d.cfs;
          if (d.balances) rtjState.balances = d.balances;
          rtjSave(rtjKEY.TRADES, rtjState.trades);
          rtjSave(rtjKEY.CFS, rtjState.cfs);
          rtjSave(rtjKEY.BALANCES, rtjState.balances);
          rtjSyncToCloud();
          alert('นำเข้าข้อมูลสำเร็จ!');
          rtjRender();
        } catch (err) { alert('ไฟล์ไม่ถูกต้อง!'); }
      };
      reader.readAsText(file);
    });
  }

  const btnClear = document.getElementById('btn-clear-trades');
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      if (confirm('⚠️ เตือน: คุณต้องการลบประวัติการเทรดทั้งหมดใช่หรือไม่?')) {
        rtjState.trades = [];
        rtjSave(rtjKEY.TRADES, rtjState.trades);
        rtjSyncToCloud();
        rtjRender();
      }
    });
  }

  document.querySelectorAll('.journal-scope [data-del-acc]').forEach(el => {
    el.addEventListener('click', () => {
      const acc = el.dataset.delAcc;
      if (confirm(`ลบบัญชี ${acc} หรือไม่?`)) {
        delete rtjState.balances[acc];
        rtjSave(rtjKEY.BALANCES, rtjState.balances);
        rtjSyncToCloud();
        if (rtjState.f.account === acc) rtjUpdateActiveAccount('Demo');
        else rtjRender();
      }
    });
  });
}

function rtjBindPeriodFilter(prefix, currentPeriod, onChange) {
  const modeEl = document.getElementById(`${prefix}-period-mode`);
  if (!modeEl) return;
  modeEl.addEventListener('change', e => {
    const mode = e.target.value;
    if (mode === 'all' || mode === 'weekly' || mode === 'monthly') onChange({ mode });
    else if (mode === 'daily') onChange({ mode, date: rtjToday() });
    else if (mode === 'custom') onChange({ mode, from: '', to: '' });
  });
  const dateEl = document.getElementById(`${prefix}-period-date`);
  if (dateEl) dateEl.addEventListener('change', e => onChange({ mode: 'daily', date: e.target.value }));
  const fromEl = document.getElementById(`${prefix}-period-from`);
  const toEl = document.getElementById(`${prefix}-period-to`);
  if (fromEl) fromEl.addEventListener('change', () => onChange({ mode: 'custom', from: fromEl.value, to: toEl ? toEl.value : '' }));
  if (toEl) toEl.addEventListener('change', () => onChange({ mode: 'custom', from: fromEl ? fromEl.value : '', to: toEl.value }));
}

// 🚀 Automatic initialization on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => rtjInitCloudDatabase());
} else {
  rtjInitCloudDatabase();
}