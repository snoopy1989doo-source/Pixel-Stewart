/* ==========================================
   PIXEL STEWARD CORE ENGINE - APP.JS (V.3.0.0)
   Fixed: YOC Cost Basis, Net Worth + Dry Powder, Logo Fallback,
          Privacy Mode, Live Price, CSV Export, P/L Badges
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
    firebase.initializeApp(firebaseConfig);
    isFirebaseActive = true;
  } catch (e) {
    console.error("Firebase Sync Connection Failed:", e);
  }
}

const INITIAL_PORTFOLIOS = [];
const INITIAL_QUARTERLY_RECORDS = [];
const INITIAL_MONTHLY_RECORDS = [];

class PixelStewardApp {
  constructor() {
    this.portfolios = [];
    this.quarterlyRecords = [];
    this.monthlyRecords = [];
    this.dividendRecords = [];
    this.exchangeRate = 36.5;
    this.activeTab = 'dashboard';
    this.selectedPortId = '';
    /* [V2.3.0 NEW] Privacy Mode state */
    this.isPrivacyMode = localStorage.getItem('ps_privacy_mode_v23') === 'true';
    /* [V3.0.0 NEW] Debt Snowball tracking — used by the debt-aware Portfolio Health score */
    this.debtStartTHB = 0;
    this.debtRemainingTHB = 0;
    /* [V3.0.0 NEW] Quarterly page view state */
    this.quarterlyViewYear = new Date().getFullYear();
    this.quarterlyViewMode = localStorage.getItem('ps_quarterly_view_mode_v4') || 'card';
    this.pendingClearQuarterly = null;
    
    this.init();
  }

  formatMoney(val, category) {
    const isUSD = category === 'Option';
    const sym = isUSD ? '$' : '฿';
    if (this.isPrivacyMode) {
      return `<span class="pixel-money pixel-money-masked">${sym}***,***</span>`;
    }
    const numStr = Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    return `<span class="pixel-money">${sym}${numStr}</span>`;
  }

  /* [V2.3.0 FIX] Enhanced Logo Fetcher & Aspect Ratio Support */
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
    this.monthlyRecords = storedMonthlies ? JSON.parse(storedMonthlies) : INITIAL_MONTHLY_RECORDS;
    this.dividendRecords = storedDividends ? JSON.parse(storedDividends) : [];
    this.exchangeRate = storedRate ? Number(storedRate) : 36.5;
    this.debtStartTHB = storedDebtStart ? Number(storedDebtStart) : 0;
    this.debtRemainingTHB = storedDebtRemaining ? Number(storedDebtRemaining) : 0;

    if (Array.isArray(this.portfolios) && this.portfolios.length > 0 && !this.selectedPortId) {
      this.selectedPortId = this.portfolios[0].id;
    }

    this.connectCloudDatabase();
    this.updatePrivacyBtnState();

    // 🎮 GLOBAL EVENT DELEGATION
    document.addEventListener('click', (e) => {
      if (e.target.closest('.btn-close-modal')) {
        this.closeModals();
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

      /* [V2.3.0 UPDATE] Enhanced Asset Input Modal & Breakdown */
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

        const valStr = prompt(`ระบุมูลค่าปัจจุบันรวม (Market Value) ในสกุลเงินพอร์ต:`);
        const val = Number(valStr);
        if (isNaN(val) || val < 0) { alert('❌ โปรดกรอกตัวเลขมูลค่าให้ถูกต้อง'); return; }

        const costStr = prompt(`ระบุราคาทุนรวมทั้งหมด (Total Cost Basis) (ถ้าเท่ากับมูลค่าปัจจุบัน ให้พิมพ์ ${val}):`, val.toString());
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
    });

    const goalTypeSelect = document.getElementById('port-goal-type');
    if (goalTypeSelect) {
      goalTypeSelect.addEventListener('change', () => {
        const valInput = document.getElementById('port-goal-value');
        const schInput = document.getElementById('port-goal-schedule');
        const label = document.getElementById('port-goal-label');
        if (goalTypeSelect.value === 'numeric') {
          label.innerText = 'เป้าหมายเงินสะสม:';
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

    this.fetchRateOnLoad();
    this.refreshUI();
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

  connectCloudDatabase() {
    if (!isFirebaseActive) return;
    firebase.database().ref('pixel_steward_data_v4').on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.portfolios) this.portfolios = Array.isArray(data.portfolios) ? data.portfolios : Object.values(data.portfolios);
        if (data.quarterlyRecords) this.quarterlyRecords = Array.isArray(data.quarterlyRecords) ? data.quarterlyRecords : Object.values(data.quarterlyRecords);
        if (data.monthlyRecords) this.monthlyRecords = Array.isArray(data.monthlyRecords) ? data.monthlyRecords : Object.values(data.monthlyRecords);
        if (data.dividendRecords) this.dividendRecords = Array.isArray(data.dividendRecords) ? data.dividendRecords : Object.values(data.dividendRecords);
        if (data.exchangeRate) this.exchangeRate = Number(data.exchangeRate) || this.exchangeRate;
        if (typeof data.debtStartTHB === 'number') this.debtStartTHB = data.debtStartTHB;
        if (typeof data.debtRemainingTHB === 'number') this.debtRemainingTHB = data.debtRemainingTHB;
        this.refreshUI();
      }
    });
  }

  syncStateToCloud() {
    if (!isFirebaseActive) return;
    firebase.database().ref('pixel_steward_data_v4').set({
      portfolios: this.portfolios, quarterlyRecords: this.quarterlyRecords,
      monthlyRecords: this.monthlyRecords, dividendRecords: this.dividendRecords, exchangeRate: this.exchangeRate,
      debtStartTHB: this.debtStartTHB, debtRemainingTHB: this.debtRemainingTHB
    });
  }

  autoCalculatePortfolios() {
    /* [V2.3.0 FIX] Recalculate current from assets; do NOT zero out cashBuffer or dryPowder
       cashBuffer is a legacy field kept for backwards compatibility (always 0 now)
       dryPowder is the user-set "waiting cash" field stored on each portfolio */
    if (!Array.isArray(this.portfolios)) return;
    this.portfolios.forEach(p => {
      if (!p) return;
      p.current = Array.isArray(p.assets) ? p.assets.reduce((sum, asset) => sum + (Number(asset.value) || 0), 0) : 0;
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
    /* [V2.3.0 FIX] Net Worth = Invested Assets + Cash Buffer + Dry Powder
       Dry Powder is the user's uninvested "waiting cash" and IS part of net worth */
    this.autoCalculatePortfolios();
    let totalTHB = 0, totalUSD = 0, totalCashBufferTHB = 0, totalDryPowderTHB = 0;
    if (Array.isArray(this.portfolios)) {
      this.portfolios.forEach(p => {
        if (!p) return;
        const isUSD = p.category === 'Option';
        if (isUSD) {
          totalUSD += (p.current || 0);
          totalCashBufferTHB += (p.cashBuffer || 0) * this.exchangeRate;
          totalDryPowderTHB += (p.dryPowder || 0) * this.exchangeRate;
        } else {
          totalTHB += (p.current || 0);
          totalCashBufferTHB += (p.cashBuffer || 0);
          totalDryPowderTHB += (p.dryPowder || 0);
        }
      });
    }
    /* Net Worth includes: all invested assets (THB + USD converted) + cash buffer + dry powder */
    const netWorthTHB = totalTHB + (totalUSD * this.exchangeRate) + totalCashBufferTHB + totalDryPowderTHB;
    return { netWorthTHB, netWorthUSD: netWorthTHB / this.exchangeRate, totalTHB, totalUSD, totalCashBufferTHB, totalDryPowderTHB };
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
    return `🔮 เลเวลอัปขั้นถัดไป: ขาดอีกประมาณ ${p.category === 'Option' ? '$' : '฿'}${needed.toLocaleString(undefined,{maximumFractionDigits:0})}`;
  }

  getMeloAvatarState(score) {
    if (score >= 90) return { imgSrc: './assets/avatar/avatar-excited.png', text: '🤩 พอร์ตสเกลสุดยอด มหาอัศวิน!', cls: 'color:#3b82f6;' };
    if (score >= 70) return { imgSrc: './assets/avatar/avatar-happy.png', text: '🙂 พอร์ตกำลังเติบโตสมบูรณ์ดี!', cls: 'color:#10b981;' };
    if (score >= 40) return { imgSrc: './assets/avatar/avatar-normal.png', text: '😐 พอร์ตเสถียร รักษาวินัยต่อ!', cls: 'color:#eab308;' };
    return { imgSrc: './assets/avatar/avatar-concerned.png', text: '😟 วิกฤต! เติมเสบียงด่วน', cls: 'color:#ef4444;' };
  }

  refreshUI() {
    this.autoCalculatePortfolios();
    const mainHeader = document.querySelector('.main-header');
    if (mainHeader) mainHeader.style.display = 'flex';

    const tabContent = document.getElementById('tab-content');
    if (!tabContent) return;
    tabContent.innerHTML = '';
    switch (this.activeTab) {
      case 'dashboard': this.renderDashboard(tabContent); break;
      case 'portfolios': this.renderPortfolios(tabContent); break;
      case 'quarterly': this.renderQuarterly(tabContent); break;
      case 'dividends': this.renderDividends(tabContent); break;
      case 'option': this.renderOptionManual(tabContent); break;
      case 'comparison': this.renderComparison(tabContent); break;
      case 'settings': this.renderSettings(tabContent); break;
    }
  }

  renderDashboard(container) {
    const calc = this.getCalculations();
    const topGoals = Array.isArray(this.portfolios) ? this.portfolios.filter(p => p && p.goalType === 'numeric' && p.goal > 0).map(p => ({ name: p.name, pct: ((p.current + p.cashBuffer) / p.goal) * 100 })).sort((a, b) => b.pct - a.pct).slice(0, 3) : [];
    const yr = new Date().getFullYear();
    let q1 = 0, q2 = 0, q3 = 0, q4 = 0;
    if (Array.isArray(this.quarterlyRecords)) {
      this.quarterlyRecords.filter(r => r && r.year === yr).forEach(r => {
        const p = this.portfolios.find(port => port && port.id === r.portfolioId);
        const rate = p && p.category === 'Option' ? this.exchangeRate : 1;
        q1 += (r.q1||0)*rate; q2 += (r.q2||0)*rate; q3 += (r.q3||0)*rate; q4 += (r.q4||0)*rate;
      });
    }
    const maxQ = Math.max(q1, q2, q3, q4, 1);

    const categoryTotals = {};
    if (Array.isArray(this.portfolios)) {
      this.portfolios.forEach(p => {
        if (!p) return;
        const cat = p.category || 'Uncategorized';
        const rate = cat === 'Option' ? this.exchangeRate : 1;
        const valTHB = ((p.current || 0) + (p.cashBuffer || 0)) * rate;
        categoryTotals[cat] = (categoryTotals[cat] || 0) + valTHB;
      });
    }
    const totalAssetVal = calc.netWorthTHB > 0 ? calc.netWorthTHB : 1;
    const catBreakdown = Object.keys(categoryTotals).map(cat => ({
      name: cat, val: categoryTotals[cat], pct: (categoryTotals[cat] / totalAssetVal) * 100
    })).sort((a, b) => b.val - a.val);

    const dryPowderRatio = calc.netWorthTHB > 0 ? (calc.totalDryPowderTHB / calc.netWorthTHB) * 100 : 0;
    /* [V3.0.0 NEW] Debt-aware weighted Portfolio Health formula (max 100):
       - 25 pts: Debt-to-Net-Worth ratio (lower debt burden vs assets = more points, graded not binary)
       - 20 pts: Dry Powder ratio (graded 0-15%+ of net worth, instead of old all-or-nothing)
       - 20 pts: Debt Snowball progress = (debtStart - debtRemaining) / debtStart
       - 20 pts: Top goal progress (graded 0-100%, instead of old binary >=50% cliff)
       - 15 pts: Diversification (graded by number of portfolios, capped at 3+) */
    const debtRemaining = Math.max(0, this.debtRemainingTHB || 0);
    const debtStart = Math.max(0, this.debtStartTHB || 0);

    const debtToNetWorthRatio = calc.netWorthTHB > 0 ? debtRemaining / calc.netWorthTHB : (debtRemaining > 0 ? 1 : 0);
    const debtScore = 25 * Math.max(0, 1 - Math.min(1, debtToNetWorthRatio));

    const dryPowderScore = 20 * Math.min(1, dryPowderRatio / 15); // full points once dry powder >= 15% of net worth

    const snowballProgressPct = debtStart > 0 ? Math.max(0, Math.min(1, (debtStart - debtRemaining) / debtStart)) : (debtRemaining === 0 ? 1 : 0);
    const snowballScore = 20 * snowballProgressPct;

    const topGoalPct = topGoals.length > 0 ? Math.min(100, topGoals[0].pct) : 0;
    const goalScore = 20 * (topGoalPct / 100);

    const diversificationScore = 15 * Math.min(1, this.portfolios.length / 3);

    let healthScore = Math.round(debtScore + dryPowderScore + snowballScore + goalScore + diversificationScore);
    healthScore = Math.max(0, Math.min(100, healthScore));
    const meloState = this.getMeloAvatarState(healthScore);

    /* [V2.3.0 FIX] Net Worth = Invested + DryPowder (both are YOUR money); privacy mode supported */
    const investedTHB = calc.totalTHB + (calc.totalUSD * this.exchangeRate);
    const netWorthDisplay = this.isPrivacyMode ? '฿***,***' : `฿${calc.netWorthTHB.toLocaleString(undefined,{maximumFractionDigits:0})}`;
    const investedDisplay = this.isPrivacyMode ? '฿***,***' : `฿${investedTHB.toLocaleString(undefined,{maximumFractionDigits:0})}`;
    const dryDisplay = this.isPrivacyMode ? '฿***,***' : `฿${calc.totalDryPowderTHB.toLocaleString(undefined,{maximumFractionDigits:0})}`;

    container.innerHTML = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
        <div class="stat-card border-pixel">
          <div class="stat-header"><span>💰 Net Worth (ความมั่งคั่งสุทธิรวม)</span><img src="./assets/icons/icon-chest.png" class="card-title-icon"></div>
          <div class="stat-value text-accent">${netWorthDisplay}</div>
          <div class="stat-desc">📈 ลงทุนแล้ว: ${investedDisplay} + 💵 รอช้อน: ${dryDisplay}</div>
        </div>
        <div class="stat-card border-pixel">
          <div class="stat-header"><span>Dry Powder (กระสุนรอช้อน)</span><img src="./assets/icons/icon-coin-stack.png" class="card-title-icon"></div>
          <div class="stat-value" style="color:var(--color-warning)!important;">฿${calc.totalDryPowderTHB.toLocaleString(undefined,{maximumFractionDigits:2})}</div>
          <div class="stat-desc">สัดส่วนกระสุน: ${dryPowderRatio.toFixed(1)}% ของพอร์ตรวม</div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1.2fr 0.8fr; gap:20px; margin-top:20px;">
        <div class="border-pixel" style="padding:15px; background:#1f273e;">
          <h4 style="font-family:'Press Start 2P'; font-size:0.6rem; color:#10b981; margin-bottom:12px;">💎 ASSET ALLOCATION</h4>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${catBreakdown.length === 0 ? '<p class="text-muted" style="font-size:0.8rem;">ไม่มีข้อมูลพอร์ต</p>' : catBreakdown.map(c => `
              <div>
                <div style="display:flex; justify-content:space-between; font-size:0.75rem;"><span>${c.name}</span><b>฿${c.val.toLocaleString(undefined,{maximumFractionDigits:0})} (${c.pct.toFixed(1)}%)</b></div>
                <div class="progress-container" style="height:6px; background:#111625; border:1px solid #000;"><div style="width:${Math.min(100, c.pct)}%; background:#3b82f6; height:100%;"></div></div>
              </div>`).join('')}
          </div>
        </div>

        <div class="border-pixel" style="padding:15px; background:#1f273e;">
          <h4 style="font-family:'Press Start 2P'; font-size:0.6rem; color:#3b82f6; margin-bottom:12px;">📊 สรุปความเติบโตรายไตรมาส (${yr})</h4>
          <div style="display:flex; justify-content:space-around; align-items:flex-end; height:120px; background:#111625; padding:10px; border:2px solid #000;">
            <div style="width:20%; display:flex; flex-direction:column; align-items:center; height:100%; justify-content:flex-end;"><div style="font-size:0.55rem;">฿${q1.toLocaleString()}</div><div style="width:100%; height:${(q1/maxQ)*100}%; background:var(--color-primary); border:1px solid #000;"></div><div style="font-size:0.6rem;">Q1</div></div>
            <div style="width:20%; display:flex; flex-direction:column; align-items:center; height:100%; justify-content:flex-end;"><div style="font-size:0.55rem;">฿${q2.toLocaleString()}</div><div style="width:100%; height:${(q2/maxQ)*100}%; background:var(--color-success); border:1px solid #000;"></div><div style="font-size:0.6rem;">Q2</div></div>
            <div style="width:20%; display:flex; flex-direction:column; align-items:center; height:100%; justify-content:flex-end;"><div style="font-size:0.55rem;">฿${q3.toLocaleString()}</div><div style="width:100%; height:${(q3/maxQ)*100}%; background:var(--color-secondary); border:1px solid #000;"></div><div style="font-size:0.6rem;">Q3</div></div>
            <div style="width:20%; display:flex; flex-direction:column; align-items:center; height:100%; justify-content:flex-end;"><div style="font-size:0.55rem;">฿${q4.toLocaleString()}</div><div style="width:100%; height:${(q4/maxQ)*100}%; background:var(--color-accent); border:1px solid #000;"></div><div style="font-size:0.6rem;">Q4</div></div>
          </div>
        </div>

        <div class="border-pixel" style="padding:12px; background:#1f273e; text-align:center;">
          <h5 style="font-family:'Press Start 2P'; font-size:0.55rem; color:var(--color-accent);">❤️ PORTFOLIO HEALTH</h5>
          <div style="display:flex; align-items:center; justify-content:center; gap:10px; margin:8px 0; background:#111625; padding:8px; border:2px solid #000;">
            <img src="${meloState.imgSrc}" class="health-avatar-square-img">
            <div style="text-align:left;"><div style="font-size:1.1rem; font-family:'Press Start 2P'; color:#10b981;">${healthScore}/100</div><div style="font-size:0.65rem; font-weight:bold; ${meloState.cls}">${meloState.text}</div></div>
          </div>
          <div class="health-score-breakdown">
            <span>💳 หนี้ ${debtScore.toFixed(0)}/25</span>
            <span>💵 เงินสด ${dryPowderScore.toFixed(0)}/20</span>
            <span>❄️ Snowball ${snowballScore.toFixed(0)}/20</span>
            <span>🎯 เป้าหมาย ${goalScore.toFixed(0)}/20</span>
            <span>💎 กระจายพอร์ต ${diversificationScore.toFixed(0)}/15</span>
          </div>
        </div>
      </div>`;
  }

  // 🖼️ MEMORY CARD GRID RENDERER
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
    const isUSD = active.category === 'Option';
    const weight = this.getCalculations().netWorthTHB > 0 ? (((active.current+active.cashBuffer)*(isUSD?this.exchangeRate:1))/this.getCalculations().netWorthTHB)*100 : 0;

    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:20px;">
        <!-- 🎯 TOP SECTION: MEMORY CARD GRID RACK -->
        <div class="border-pixel" style="padding:16px; background:#111625;">
          <h3 style="font-family:'Press Start 2P'; font-size:0.75rem; color:var(--color-accent, #f59e0b); margin-bottom:14px; display:flex; align-items:center;">
            <img src="./assets/icons/icon-briefcase.png" alt="Rack" class="card-title-icon" style="width:24px; height:24px; margin-right:8px;"> CARTRIDGE MEMORY RACK
          </h3>
          <div class="memory-card-grid">
            ${this.portfolios.map(p => {
              if (!p) return '';
              const pct = p.goal > 0 ? (((p.current + p.cashBuffer) / p.goal) * 100) : 0;
              const isPurpleTier = pct >= 80 || p.category === 'Option';
              const tierClass = isPurpleTier ? 'tier-purple' : (pct >= 40 ? 'tier-gold' : 'tier-silver');
              const isActive = p.id === this.selectedPortId ? 'active' : '';

              return `
                <div class="memory-card-wrapper ${tierClass} ${isActive}" onclick="app.switchPortfolio('${p.id}')">
                  <img src="./assets/cards/card-folio.png" class="memory-card-bg" alt="Memory Card">
                  <div class="memory-card-content">
                    <div>
                      <div class="card-title-text">${p.name}</div>
                      <div class="card-cat-text">${p.category}</div>
                    </div>
                    <div>
                      <div class="card-val-text">${this.formatMoney(p.current + p.cashBuffer, p.category)}</div>
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

            <!-- ➕ ADD NEW DOTTED CARD -->
            <div class="memory-card-add-new">
              <div style="font-size:1.8rem;">➕</div>
              <div style="font-family:'Press Start 2P'; font-size:0.6rem; margin-top:8px;">ADD NEW</div>
            </div>
          </div>
        </div>

        <!-- 🔎 BOTTOM SECTION: ACTIVE PORTFOLIO DETAIL PANEL -->
        <div style="display:grid; grid-template-columns: 1.2fr 0.8fr; gap:20px;">
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
              🎯 เป้าหมาย: ${active.goalType==='numeric'?this.formatMoney(active.goal, active.category):active.goalSchedule} <span style="font-size:0.7rem; color:#64748b; float:right;">✏️ แก้ไข</span>
            </div>
            
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
              <div style="background:#111625; padding:10px; border:2px solid #000; font-size:0.85rem; color:#10b981; font-weight:bold;">
                💼 สุธิตลับพอร์ต: ${this.formatMoney(active.current+active.cashBuffer, active.category)}
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
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #000; padding-bottom:6px;">
                <span style="font-size:0.8rem; font-weight:bold; color:var(--color-success);">💎 สินทรัพย์ย่อยในตลับ:</span>
                <button class="btn btn-primary btn-retro btn-small" id="btn-add-asset"><span>➕ เพิ่มสินทรัพย์</span></button>
              </div>
              <div style="display:flex; flex-direction:column; gap:8px; margin-top:8px; max-height:220px; overflow-y:auto;">
                ${(!active.assets || active.assets.length===0)?'<p class="text-muted" style="font-size:0.85rem; text-align:center;">คลังว่างเปล่า กดปุ่ม ➕ ด้านบนเพื่อเพิ่ม</p>':active.assets.map((a,i)=>{
                  const cost = Number(a.costBasis) || Number(a.value) || 0;
                  const val = Number(a.value) || 0;
                  const diff = val - cost;
                  const pct = cost > 0 ? (diff / cost) * 100 : 0;
                  const isProfit = diff >= 0;
                  const isUSD = active.category === 'Option';
                  const sym = isUSD ? '$' : '฿';
                  const plBadgeClass = isProfit ? 'badge-pl-profit' : 'badge-pl-loss';
                  const sign = isProfit ? '+' : '';
                  
                  return `
                  <div style="display:flex; justify-content:space-between; background:#111625; padding:8px 12px; border:2px solid #000; font-size:0.85rem; align-items:center; border-radius:6px; flex-wrap:wrap; gap:6px;">
                    <div style="display:flex; align-items:center;">
                      ${this.getTickerLogoHtml(a.name, active.category)}
                      <div>
                        <b>${a.name}</b> ${a.shares ? `<span style="font-size:0.7rem; color:#94a3b8;">(${a.shares} หุ้น)</span>` : ''}
                        <div style="font-size:0.7rem; color:#64748b;">ทุน: ${this.formatMoney(cost, active.category)}</div>
                      </div>
                    </div>
                    <div style="display:flex; gap:6px; align-items:center;">
                      <div style="text-align:right;">
                        <div><b>${this.formatMoney(val, active.category)}</b></div>
                        <span class="badge-pl ${plBadgeClass}">${sign}${this.isPrivacyMode ? '***' : sym + Math.abs(diff).toLocaleString(undefined,{maximumFractionDigits:0})} (${sign}${pct.toFixed(1)}%)</span>
                      </div>
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
                <div style="background:#111625; padding:8px; border:2px solid #000; font-weight:bold; color:#10b981;">${this.formatMoney(active.current+active.cashBuffer, active.category)}</div>
                
                <label>ระบุเงินช้อน Dry Powder:</label>
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
      const newGoal = prompt(`✏️ แก้ไขเป้าหมายตัวเลขเงินสะสมของพอร์ต "${p.name}" เป็น:`, p.goal);
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
      const amount = prompt(`📥 [ฝากเสบียงเพิ่ม/➕] ระบุจำนวนเงินต้นที่ต้องการเติมเข้าช่อง "${p.assets[assetIdx].name}":`);
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
      const amount = prompt(`📤 [ถอนเสบียงออก/➖] ระบุจำนวนเงินที่ต้องการหักออกจากช่อง "${p.assets[assetIdx].name}":`);
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

  switchPortfolio(id) { this.selectedPortId = id; this.refreshUI(); }
  
  deleteAsset(id, idx) { 
    const p = this.portfolios.find(x => x && x.id === id);
    if (p && p.assets && p.assets[idx]) { 
      if (confirm(`ลบสินทรัพย์ย่อย "${p.assets[idx].name}" หรือไม่?`)) { 
        p.assets.splice(idx, 1);
        this.saveState(); this.refreshUI(); 
      } 
    } 
  }

  // 🗓️ [V3.0.0 NEW] Helpers for the redesigned Quarterly page
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
      const rate = p.category === 'Option' ? this.exchangeRate : 1;
      sums.q1 += (r.q1 || 0) * rate; sums.q2 += (r.q2 || 0) * rate;
      sums.q3 += (r.q3 || 0) * rate; sums.q4 += (r.q4 || 0) * rate;
    });
    const growth = this.getQuarterGrowth(sums.q2, 0, sums.q1);
    return { ...sums, growth };
  }

  renderQuarterly(container) {
    const stockPorts = Array.isArray(this.portfolios) ? this.portfolios.filter(p => p && p.category !== 'Option') : [];
    if (stockPorts.length === 0) { container.innerHTML = '<div class="border-pixel" style="padding:20px; background:#1f273e;">ไม่มีรายการหุ้นรายไตรมาส (โปรดตั้งค่าเปิดตลับพอร์ตหลักก่อนครับ)</div>'; return; }

    const year = this.quarterlyViewYear;
    const years = this.getQuarterlyYearsList();
    const summary = this.getGlobalQuarterSummary(stockPorts, year);
    const fmtQ = (v) => v > 0 ? `฿${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '฿0.00';

    const headerHtml = `
      <div class="border-pixel" style="padding:14px 16px; background:#1f273e; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div>
          <h3 style="font-family:'Press Start 2P'; font-size:0.8rem; margin:0;">🗓️ หุ้นรายไตรมาส</h3>
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

  // 🖼️ Card View for Quarterly page — mini pixel bar chart + awaiting-data empty state per portfolio
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
              <div class="quarterly-mini-chart-labels"><span>${(rec.q1 || 0) > 0 ? '฿' + rec.q1.toLocaleString() : '-'}</span><span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span></div>
              <div style="display:flex; justify-content:space-between; font-size:0.6rem; color:#64748b; padding:0 2px;">
                <span>-</span><span>${(rec.q2 || 0) > 0 ? '฿' + rec.q2.toLocaleString() : '-'}</span><span>${(rec.q3 || 0) > 0 ? '฿' + rec.q3.toLocaleString() : '-'}</span><span>${(rec.q4 || 0) > 0 ? '฿' + rec.q4.toLocaleString() : '-'}</span>
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

  // 📊 Table View for Quarterly page
  renderQuarterlyTable(stockPorts, year) {
    const rows = stockPorts.map((p, idx) => {
      if (!p) return '';
      const r = this.quarterlyRecords.find(x => x && x.portfolioId === p.id && x.year === year) || { q1: 0, f1: 0, q2: 0, f2: 0, q3: 0, f3: 0, q4: 0, f4: 0 };
      const g2 = this.getQuarterGrowth(r.q2, r.f2, r.q1);
      const g3 = this.getQuarterGrowth(r.q3, r.f3, r.q2);
      const g4 = this.getQuarterGrowth(r.q4, r.f4, r.q3);
      const cell = (v, g) => `${v > 0 ? '฿' + v.toLocaleString() : '<span class="text-muted">⏳ รอข้อมูล</span>'}${g ? `<div style="font-size:0.65rem;" class="${g.cls}">${g.text}</div>` : ''}`;
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

  // 🖼️ [V3.0.0 NEW] Map a portfolio to its assets/foliologo/*.png icon by name/category keyword
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

  // 🗑️ [V3.0.0 NEW] 2-step "ล้างข้อมูล" dangerous-action flow (step1 = are you sure, step2 = type DELETE)
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
    const optionPorts = Array.isArray(this.portfolios) ? this.portfolios.filter(p => p && p.category === 'Option') : [];
    const records = Array.isArray(this.monthlyRecords) ? this.monthlyRecords.filter(r => r && optionPorts.map(p => p.id).includes(r.portfolioId)) : [];
    container.innerHTML = `
      <div class="border-pixel" style="padding:15px; background:#1f273e;">
        <h4 style="font-family:'Press Start 2P'; font-size:0.65rem; color:var(--color-accent); margin-bottom:10px; display:flex; align-items:center;">
          <img src="./assets/icons/icon-daimon.png" alt="Diamond" class="card-title-icon"> บันทึกงวดสัญญา Option
        </h4>
        <div style="display:grid; grid-template-columns:1fr 2fr; gap:15px;">
          <div class="border-pixel-inset" style="padding:12px; background:#111625;">
            <label style="font-size:0.8rem;">เลือกพอร์ต:</label>
            <select id="opt-port-select" class="input-retro" style="width:100%; margin-bottom:8px;">${optionPorts.length===0?'<option>ไม่มีตลับพอร์ตออปชัน</option>':optionPorts.map(p=>`<option value="${p.id}">${p.name}</option>`).join('')}</select>
            <label style="font-size:0.8rem;">เดือนงวด:</label>
            <select id="opt-month-select" class="input-retro" style="width:100%; margin-bottom:8px;">${[...Array(12).keys()].map(i=>`<option value="${i+1}">เดือน ${i+1}</option>`).join('')}</select>
            <label style="font-size:0.8rem;">P/L สุทธิ (USD):</label>
            <input type="number" id="opt-pl-input" class="input-retro" style="width:100%; margin-bottom:12px;">
            <button class="btn btn-success btn-retro" id="btn-save-opt-manual" style="width:100%;"><span>💾 บันทึกงวดสัญญา</span></button>
          </div>
          <div class="border-pixel-inset" style="padding:12px; background:#111625;">
            <h5 style="display:flex; align-items:center; gap:6px;">
              <img src="./assets/icons/icon-document-chart.png" alt="Log" class="card-title-icon"> ประวัติสัญญารายเดือนย่อย
            </h5>
            <div style="max-height:220px; overflow-y:auto; font-size:0.85rem; margin-top:8px;">
              ${records.length===0?'<p class="text-muted">ไม่มีประวัติคงเหลือ</p>':records.map(r=>`<div style="display:flex; justify-content:space-between; border-bottom:1px solid #333; padding:6px 0;"><span><b>${this.portfolios.find(x=>x && x.id===r.portfolioId)?.name || ''}</b> (เดือน ${r.month})</span><b class="${(r.profitLossUSD||0)>=0?'text-success':'text-danger'}">${(r.profitLossUSD||0)>=0?'+':''}$${r.profitLossUSD || 0}</b></div>`).join('')}
            </div>
          </div>
        </div>
      </div>`;
    if(optionPorts.length>0){
      document.getElementById('btn-save-opt-manual').addEventListener('click', () => {
        const pId = document.getElementById('opt-port-select').value; const m = Number(document.getElementById('opt-month-select').value); const pl = Number(document.getElementById('opt-pl-input').value);
        if(!pId || isNaN(pl)) return;
        this.monthlyRecords.push({ id:'m-'+Date.now(), portfolioId:pId, year:new Date().getFullYear(), month:m, profitLossUSD:pl, notes:'Manual' });
        this.saveState(); this.refreshUI();
      });
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
              <th style="padding:8px; border:2px solid #000;">ต้นทุนเงินลงทุนสะสม</th>
              <th style="padding:8px; border:2px solid #000;">รวมรับปันผล</th>
              <th style="padding:8px; border:2px solid #000; color:var(--color-accent);">YOC Score</th>
            </tr>
          </thead>
          <tbody>
            ${(!Array.isArray(this.portfolios) || this.portfolios.length===0)?'<tr><td colspan="4" style="text-align:center;padding:15px;" class="text-muted">ไม่มีพอร์ตลงทุนในคลังคลาวด์</td></tr>':this.portfolios.map(p => {
              if(!p) return '';
              const divs = Array.isArray(this.dividendRecords) ? this.dividendRecords.filter(x=>x && x.portfolioId===p.id).reduce((s,x)=>s+Number(x.amount||0),0) : 0;
              /* [V2.3.0 FINANCIAL FIX] YOC = Total Dividends Received / Total Cost Basis (ไม่ใช่ Market Value) */
              const totalCostBasis = Array.isArray(p.assets) ? p.assets.reduce((sum, a) => sum + (Number(a.costBasis) || Number(a.value) || 0), 0) : (p.current || 0);
              const yoc = totalCostBasis > 0 ? ((divs / totalCostBasis) * 100).toFixed(2) + '%' : 'N/A';
              return `<tr><td style="padding:8px; border:2px solid #000;"><b>${p.name}</b></td><td style="padding:8px; border:2px solid #000;">${this.formatMoney(totalCostBasis, p.category)}</td><td style="padding:8px; border:2px solid #000; color:var(--color-success);">${this.formatMoney(divs,p.category)}</td><td style="padding:8px; border:2px solid #000; font-weight:bold; color:var(--color-accent); font-family:'Press Start 2P'!important; font-size:0.75rem!important;">${yoc}</td></tr>`;
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
                  <th style="padding:8px; border:1px solid #000; text-align:right; padding-right:10px;">จำนวนเงิน</th>
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
                      const pCat = p ? p.category : 'Thai Stock';
                      return `
                      <tr style="border-bottom:1px solid #222;">
                        <td style="padding:8px; border:1px solid #000; text-align:center; font-family:monospace; color:#94a3b8;">${r.date || ''}</td>
                        <td style="padding:8px; border:1px solid #000; color:#fff;"><b>${pName}</b></td>
                        <td style="padding:8px; border:1px solid #000; color:#94a3b8;">${r.notes || '-'}</td>
                        <td style="padding:8px; border:1px solid #000; text-align:right; padding-right:10px; font-weight:bold;">${this.formatMoney(r.amount || 0, pCat)}</td>
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
          <thead><tr style="background:#111625;"><th style="padding:8px; border:2px solid #000;">ชื่อพอร์ต</th><th style="padding:8px; border:2px solid #000;">เป้าหมายรวม</th><th style="padding:8px; border:2px solid #000;">พอร์ตรวมจริง (THB)</th><th style="padding:8px; border:2px solid #000;">ส่วนต่างที่ขาด (THB)</th><th style="padding:8px; border:2px solid #000; color:var(--color-success); min-width:180px;">เควสสเกล (EXP Bar)</th></tr></thead>
          <tbody>
            ${this.portfolios.map(p => {
              if(!p) return '';
              const r = p.category === 'Option' ? this.exchangeRate : 1;
              const curTHB = ((p.current||0)+(p.cashBuffer||0))*r; const goalTHB = p.goalType==='numeric'?((p.goal||0)*r):0; const diff = p.goalType==='numeric'?Math.max(goalTHB-curTHB,0):0;
              const pct = p.goalType==='numeric'?(p.goal>0?(curTHB/goalTHB)*100:0):(p.dcaDoneThisMonth?100:0);
              const fillPct = Math.min(100, Math.max(0, pct));
              return `<tr>
                <td style="padding:8px; border:2px solid #000;"><b>${p.name}</b></td>
                <td style="padding:8px; border:2px solid #000;">${p.goalType==='numeric'?this.formatMoney(p.goal||0,p.category):p.goalSchedule}</td>
                <td style="padding:8px; border:2px solid #000;">฿${curTHB.toLocaleString(undefined,{maximumFractionDigits:0})}</td>
                <td style="padding:8px; border:2px solid #000; color:#ef4444;">${diff>0?'฿'+diff.toLocaleString(undefined,{maximumFractionDigits:0}):'✔️ เควสเคลียร์'}</td>
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
        <div style="display:none;"><input type="number" id="global-usd-rate" value="${this.exchangeRate}"></div>

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
            this.selectedPortId = this.portfolios.length > 0 ? this.portfolios[0].id : '';
            this.saveState();
            this.refreshUI();
            alert('🎯 นำเข้าไฟล์เสร็จสิ้น ข้อมูลคาร์ทริจซิงก์เรียบร้อย!');
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
    const destId = document.getElementById('tf-target').value; const amt = Number(document.getElementById('tf-amount').value); const r = Number(document.getElementById('tf-rate').value)||this.exchangeRate; const src = this.portfolios.find(x=>x && x.id===srcId);
    if(!src || src.dryPowder < amt) { alert('❌ กระสุนไม่เพียงพอ'); return; }
    src.dryPowder -= amt;
    if(destId!=='system') {
      const dest = this.portfolios.find(x=>x && x.id===destId);
      if(dest) {
        const sUSD = src.category === 'Option'; const tUSD = dest.category === 'Option';
        let conv = amt; if(sUSD && !tUSD) conv = amt * r; else if(!sUSD && tUSD) conv = amt / r;
        dest.dryPowder += conv;
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
    const newAmount = prompt(`✏️ ระบุจำนวนตัวเลขเงินปันผลใหม่ที่ถูกต้อง:`, r.amount);
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
    document.getElementById('tf-source').innerHTML = this.portfolios.map(p=>p?`<option value="${p.id}">${p.name} (Dry: ${p.dryPowder})</option>`:'').join('');
    document.getElementById('tf-target').innerHTML = '<option value="system">ถอนเงินออกนอกคลัง</option>'+this.portfolios.map(p=>p?`<option value="${p.id}">${p.name}</option>`:'').join('');
    document.getElementById('tf-rate').value = this.exchangeRate;
    document.getElementById('transfer-modal').classList.remove('hidden');
  }
  
  closeModals() { 
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden')); 
  }

  /* [V2.3.0 NEW] Privacy Mode Button Handler */
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

  /* [V2.3.0 NEW] Live Market Price Fetcher Engine */
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
              const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${querySymbol}?interval=1d&range=1d`);
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

  /* [V2.3.0 NEW] CSV Export Engine for Dividends */
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
      const cat = p ? p.category : 'Thai Stock';
      const curr = cat === 'Option' ? 'USD' : 'THB';
      const cleanNotes = (r.notes || '').replace(/,/g, ' ');
      csvContent += `"${r.date || ''}","${pName}","${cleanNotes}",${r.amount || 0},"${curr}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pixel_steward_dividends_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /* [V2.3.0 NEW] CSV Export Engine for Portfolios */
  exportPortfoliosToCSV() {
    if (!Array.isArray(this.portfolios) || this.portfolios.length === 0) {
      alert('❌ ไม่มีข้อมูลพอร์ตสำหรับการส่งออก');
      return;
    }

    let csvContent = "\uFEFFชื่อพอร์ต,หมวดหมู่,ประเภทเป้าหมาย,เป้าหมายสะสม,มูลค่าปัจจุบัน,เงินสดช้อน (Dry Powder),ต้นทุนสะสม,กำไร/ขาดทุนสะสม,YOC Score\n";
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
}

window.app = new PixelStewardApp(); 