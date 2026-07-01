/* ==========================================
   PIXEL STEWARD CORE ENGINE - APP.JS (V.1.3.0)
   ========================================== */

// --- FIREBASE CONFIGURATION HOOK ---
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let isFirebaseActive = false;
if (typeof firebase !== 'undefined' && firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
  firebase.initializeApp(firebaseConfig);
  isFirebaseActive = true;
}

// --- INITIAL STATE / MOCK DATA ---
const INITIAL_PORTFOLIOS = [
  { id: '1', name: 'RedWing (กยศ.)', category: 'Thai Stock', goalType: 'numeric', goal: 60000, current: 30000, cashBuffer: 15000, dryPowder: 5000, assets: [{ name: 'หุ้นย่อย A', value: 25000 }], startDate: '2025-01-01', notes: 'เน้นสำรองจ่ายและรักษาสภาพคล่อง' },
  { id: '2', name: 'Zero 1 (เงินฉุกเฉิน)', category: 'Emergency', goalType: 'numeric', goal: 95000, current: 0, cashBuffer: 90000, dryPowder: 0, assets: [], startDate: '2025-01-01', notes: 'เงินสำรองห้ามแตะต้องเว้นแต่จำเป็น' },
  { id: '3', name: 'Zero 2 (รถ)', category: 'Asset', goalType: 'numeric', goal: 1200000, current: 300000, cashBuffer: 50000, dryPowder: 300000, assets: [], startDate: '2025-01-01', notes: 'สะสมดาวน์รถยนต์คันใหม่' },
  { id: '4', name: 'Zero 3 (เกษียณ)', category: 'Retirement', goalType: 'numeric', goal: 4000000, current: 750000, cashBuffer: 100000, dryPowder: 750000, assets: [{ name: 'กองทุนดัชนี', value: 750000 }], startDate: '2025-01-01', notes: 'พอร์ตหลักระยะยาว พลิกฟื้นอิสรภาพ' },
  { id: '5', name: 'Zero 4 (แต่งงาน)', category: 'Life Goal', goalType: 'numeric', goal: 600000, current: 120000, cashBuffer: 30000, dryPowder: 120000, assets: [], startDate: '2025-05-01', notes: 'ทุนแต่งงานในอนาคต' },
  { id: '6', name: 'Zero 5 (บ้าน)', category: 'Asset', goalType: 'numeric', goal: 1500000, current: 180000, cashBuffer: 20000, dryPowder: 180000, assets: [], startDate: '2025-06-01', notes: 'เป้าหมายระยะกลางสำหรับที่อยู่อาศัย' },
  { id: '7', name: 'Dividend Yield (หุ้นโลก)', category: 'Global Stock', goalType: 'numeric', goal: 300000, current: 100000, cashBuffer: 20000, dryPowder: 100000, assets: [{ name: 'ETF โลก', value: 100000 }], startDate: '2025-02-01', notes: 'ปันผลสม่ำเสมอ ลดความเสี่ยงค่าเงิน' },
  { id: '8', name: 'THAI Dividend (หุ้นไทย)', category: 'Thai Stock', goalType: 'numeric', goal: 100000, current: 55000, cashBuffer: 10000, dryPowder: 55000, assets: [{ name: 'หุ้นปันผลไทย', value: 55000 }], startDate: '2025-01-15', notes: 'เน้นกระแสเงินสดจากปันผลในประเทศ' },
  { id: '9', name: 'NEXT GEN (หุ้นเติบโต)', category: 'Growth Stock', goalType: 'schedule', goalSchedule: 'DCA ทุกวันที่ 25', current: 4000000, cashBuffer: 500000, dryPowder: 4000000, assets: [{ name: 'Tech Growth', value: 4000000 }], startDate: '2025-03-01', notes: 'พอร์ตซิ่ง ดุดัน ไม่เกรงใจใคร โตระยะยาว', dcaDoneThisMonth: true },
  { id: '10', name: 'FOREX LIFE', category: 'Forex', goalType: 'numeric', goal: 50000, current: 10000, cashBuffer: 2500, dryPowder: 10000, assets: [], startDate: '2025-01-01', notes: 'เทรดกระแสเงินสดรายเดือน ดอลลาร์สหรัฐ' },
  { id: '11', name: 'FOREX RISK', category: 'Forex', goalType: 'numeric', goal: 20000, current: 4000, cashBuffer: 1200, dryPowder: 4000, assets: [], startDate: '2025-01-01', notes: 'พอร์ตเสี่ยงสูง ปั้นพอร์ตคูณเท่า' },
  { id: '12', name: 'Option', category: 'Option', goalType: 'numeric', goal: 30000, current: 7000, cashBuffer: 1900, dryPowder: 7000, assets: [], startDate: '2025-02-01', notes: 'ใช้กลยุทธ์ออปชั่นในการ Hedging และทำกำไร' }
];

const INITIAL_QUARTERLY_RECORDS = [
  { id: 'q-1', portfolioId: '4', year: 2025, q1: 600000, q2: 680000, q3: 750000, q4: 820000, capitalAdded: 0, capitalWithdrawn: 0, notes: 'ภาพรวมพอร์ตเกษียณเติบโตขึ้นตามเป้าหมาย' },
  { id: 'q-2', portfolioId: '7', year: 2025, q1: 90000, q2: 100000, q3: 110000, q4: 118000, capitalAdded: 0, capitalWithdrawn: 0, notes: 'ปันผลสะสมต่อเนื่อง' },
  { id: 'q-3', portfolioId: '8', year: 2025, q1: 50000, q2: 55000, q3: 58000, q4: 62000, capitalAdded: 0, capitalWithdrawn: 0, notes: 'สภาวะตลาดไทยค่อนข้างผันผวนแต่ปันผลยังคงสม่ำเสมอ' },
  { id: 'q-4', portfolioId: '9', year: 2025, q1: 3000000, q2: 3500000, q3: 4000000, q4: 4300000, capitalAdded: 0, capitalWithdrawn: 0, notes: 'DCA หุ้นเทคฯ อย่างเข้มงวดทุกวันที่ 25' }
];

const INITIAL_MONTHLY_RECORDS = [
  { id: 'm-1', portfolioId: '10', year: 2025, month: 10, profitLossUSD: 450, notes: 'เทรดคู่ EURUSD รันเทรนดสวยงาม' },
  { id: 'm-2', portfolioId: '10', year: 2025, month: 11, profitLossUSD: 520, notes: 'ตลาดเคลื่อนไหวตามกรอบ Sideway' },
  { id: 'm-3', portfolioId: '10', year: 2025, month: 12, profitLossUSD: -120, notes: 'มีโดน Stop Loss ปลายปี' },
  { id: 'm-4', portfolioId: '11', year: 2025, month: 10, profitLossUSD: 180, notes: 'เทรดทองคำ (XAUUSD) เสี่ยงสูง' },
  { id: 'm-5', portfolioId: '11', year: 2025, month: 11, profitLossUSD: -90, notes: 'ล้างพอร์ทย่อยบางส่วนแต่กู้คืนมาได้' },
  { id: 'm-6', portfolioId: '11', year: 2025, month: 12, profitLossUSD: 310, notes: 'ได้ไม้สไนเปอร์ช่วง FOMC' },
  { id: 'm-7', portfolioId: '12', year: 2025, month: 10, profitLossUSD: 280, notes: 'Hedging ค่าเงินด้วย Option' },
  { id: 'm-8', portfolioId: '12', year: 2025, month: 11, profitLossUSD: 340, notes: 'กลยุทธ์ Iron Condor ได้พรีเมียมเต็ม' },
  { id: 'm-9', portfolioId: '12', year: 2025, month: 12, profitLossUSD: -80, notes: 'โดนสควีซช่วงสิ้นปี' }
];

const INITIAL_DIVIDEND_RECORDS = [
  { id: 'd-1', portfolioId: '8', amount: 1200, date: '2025-04-10', notes: 'ปันผล INTUCH' },
  { id: 'd-2', portfolioId: '7', amount: 45, date: '2025-06-15', notes: 'VT Dividend USD' }
];

// --- CORE APP CLASS ---
class PixelStewardApp {
  constructor() {
    this.portfolios = [];
    this.quarterlyRecords = [];
    this.monthlyRecords = [];
    this.dividendRecords = [];
    this.exchangeRate = 36.5;
    this.activeTab = 'dashboard';
    this.selectedPortId = '1';
    this.sortKey = 'goalPct';
    this.sortAsc = false;
    this.init();
  }

  init() {
    const storedPorts = localStorage.getItem('ps_portfolios_v2');
    const storedQuarters = localStorage.getItem('ps_quarterly_v2');
    const storedMonthlies = localStorage.getItem('ps_monthly_v2');
    const storedDividends = localStorage.getItem('ps_dividends_v2');
    const storedRate = localStorage.getItem('ps_ex_rate_v2');

    this.portfolios = this.normalizePortfolios(storedPorts ? JSON.parse(storedPorts) : INITIAL_PORTFOLIOS);
    this.quarterlyRecords = storedQuarters ? JSON.parse(storedQuarters) : INITIAL_QUARTERLY_RECORDS;
    this.monthlyRecords = storedMonthlies ? JSON.parse(storedMonthlies) : INITIAL_MONTHLY_RECORDS;
    this.dividendRecords = storedDividends ? JSON.parse(storedDividends) : INITIAL_DIVIDEND_RECORDS;
    this.exchangeRate = storedRate ? Number(storedRate) : 36.5;

    if (isFirebaseActive) this.connectCloudDatabase();

    const rateInput = document.getElementById('global-usd-rate');
    if (rateInput) {
      rateInput.value = this.exchangeRate;
      rateInput.addEventListener('input', (e) => {
        const val = Number(e.target.value);
        if (val > 0) {
          this.exchangeRate = val;
          this.saveState();
          this.refreshUI();
          this.showToast('💱 อัปเดตอัตราแลกเปลี่ยนสำเร็จ!');
        }
      });
    }

    document.getElementById('btn-add-portfolio').addEventListener('click', () => this.openPortfolioModal());
    document.getElementById('btn-quick-transfer').addEventListener('click', () => this.openTransferModal());

    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const btn = e.currentTarget;
        const tabName = btn.dataset.tab;
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        btn.classList.add('active');
        this.activeTab = tabName;
        this.refreshUI();
      });
    });

    document.querySelectorAll('.btn-close-modal').forEach(btn => {
      btn.addEventListener('click', () => this.closeModals());
    });

    const pfForm = document.getElementById('portfolio-form');
    if (pfForm) pfForm.addEventListener('submit', (e) => { e.preventDefault(); this.handleSavePortfolio(); });

    const tfForm = document.getElementById('transfer-form');
    if (tfForm) tfForm.addEventListener('submit', (e) => { e.preventDefault(); this.handleExecuteTransfer(); });

    const divForm = document.getElementById('dividend-form');
    if (divForm) divForm.addEventListener('submit', (e) => { e.preventDefault(); this.handleSaveDividend(); });

    const goalTypeSelect = document.getElementById('port-goal-type');
    if (goalTypeSelect) {
      const valInput = document.getElementById('port-goal-value');
      const schInput = document.getElementById('port-goal-schedule');
      const label = document.getElementById('port-goal-label');
      goalTypeSelect.addEventListener('change', () => {
        if (goalTypeSelect.value === 'numeric') {
          label.innerText = 'เป้าหมาย (จำนวนเงิน):';
          valInput.classList.remove('hidden'); valInput.required = true;
          schInput.classList.add('hidden'); schInput.required = false;
        } else {
          label.innerText = 'เป้าหมาย (ตารางเวลา):';
          valInput.classList.add('hidden'); valInput.required = false;
          schInput.classList.remove('hidden'); schInput.required = true;
        }
      });
    }

    // Quarterly modal real-time CF display
    const capAdded = document.getElementById('q-cap-added');
    const capWithdrawn = document.getElementById('q-cap-withdrawn');
    if (capAdded && capWithdrawn) {
      const updateCFDisplay = () => {
        const net = (Number(capAdded.value) || 0) - (Number(capWithdrawn.value) || 0);
        const el = document.getElementById('q-net-cf-display');
        if (el) {
          el.textContent = (net >= 0 ? '+' : '') + '฿' + net.toLocaleString();
          el.style.color = net > 0 ? 'var(--color-success)' : net < 0 ? 'var(--color-danger)' : 'var(--color-text-muted)';
        }
      };
      capAdded.addEventListener('input', updateCFDisplay);
      capWithdrawn.addEventListener('input', updateCFDisplay);
    }

    // Quarterly modal save button
    const btnSaveQ = document.getElementById('btn-save-quarterly');
    if (btnSaveQ) {
      btnSaveQ.addEventListener('click', () => {
        const portId = document.getElementById('q-port-id').value;
        const yr = Number(document.getElementById('q-year').value);
        let target = this.quarterlyRecords.find(r => r.portfolioId === portId && r.year === yr);
        if (!target) {
          target = { id: 'q-' + Date.now(), portfolioId: portId, year: yr, q1: 0, q2: 0, q3: 0, q4: 0, capitalAdded: 0, capitalWithdrawn: 0, notes: '' };
          this.quarterlyRecords.push(target);
        }
        target.q1 = Number(document.getElementById('q-val-q1').value) || 0;
        target.q2 = Number(document.getElementById('q-val-q2').value) || 0;
        target.q3 = Number(document.getElementById('q-val-q3').value) || 0;
        target.q4 = Number(document.getElementById('q-val-q4').value) || 0;
        target.capitalAdded = Number(document.getElementById('q-cap-added').value) || 0;
        target.capitalWithdrawn = Number(document.getElementById('q-cap-withdrawn').value) || 0;
        target.notes = document.getElementById('q-notes').value;
        this.saveState();
        this.closeModals();
        this.refreshUI();
        this.showToast('📈 บันทึกรายงานไตรมาส TWR เรียบร้อย!');
      });
    }

    this.refreshUI();
  }

  // --- FIREBASE CLOUD SYNC ---
  connectCloudDatabase() {
    const dbRef = firebase.database().ref('pixel_steward_data');
    dbRef.once('value', (snapshot) => {
      if (!snapshot.exists()) this.syncStateToCloud();
    });
    dbRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.portfolios) this.portfolios = this.normalizePortfolios(data.portfolios);
        if (data.quarterlyRecords) this.quarterlyRecords = data.quarterlyRecords;
        if (data.monthlyRecords) this.monthlyRecords = data.monthlyRecords;
        if (data.dividendRecords) this.dividendRecords = data.dividendRecords;
        if (data.exchangeRate) this.exchangeRate = data.exchangeRate;
        this.refreshUI();
      }
    });
  }

  syncStateToCloud() {
    if (!isFirebaseActive) return;
    firebase.database().ref('pixel_steward_data').set({
      portfolios: this.portfolios,
      quarterlyRecords: this.quarterlyRecords,
      monthlyRecords: this.monthlyRecords,
      dividendRecords: this.dividendRecords,
      exchangeRate: this.exchangeRate
    });
  }

  saveState() {
    this.syncAllPortfolioCurrents({ clampDry: true });
    localStorage.setItem('ps_portfolios_v2', JSON.stringify(this.portfolios));
    localStorage.setItem('ps_quarterly_v2', JSON.stringify(this.quarterlyRecords));
    localStorage.setItem('ps_monthly_v2', JSON.stringify(this.monthlyRecords));
    localStorage.setItem('ps_dividends_v2', JSON.stringify(this.dividendRecords));
    localStorage.setItem('ps_ex_rate_v2', this.exchangeRate.toString());
    this.syncStateToCloud();
  }

  refreshUI() {
    const tabContent = document.getElementById('tab-content');
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
    if (!tabContent) return;
    tabContent.innerHTML = '';

    switch (this.activeTab) {
      case 'dashboard':
        pageTitle.innerText = 'แดชบอร์ดภาพรวม';
        pageSubtitle.innerText = 'สรุปขุมทรัพย์และความมั่งคั่งของพอร์ตทั้งหมดใน 5 วินาที';
        this.renderDashboard(tabContent); break;
      case 'portfolios':
        pageTitle.innerText = 'พอร์ตการลงทุน';
        pageSubtitle.innerText = 'ดูรายละเอียด จัดสรรเงินลงทุนรายสินทรัพย์ และวางแผนสภาพคล่อง';
        this.renderPortfolios(tabContent); break;
      case 'quarterly':
        pageTitle.innerText = 'สรุปหุ้นรายไตรมาส';
        pageSubtitle.innerText = 'ติดตามผลการดำเนินงานกองทุนและหุ้นรายไตรมาส แยกตามปีปฏิทิน';
        this.renderQuarterly(tabContent); break;
      case 'forex':
        pageTitle.innerText = 'บันทึก Forex รายเดือน';
        pageSubtitle.innerText = 'จดบันทึกกระแสเงินสดรายเดือนจากการเทรดคู่สกุลเงินสไตล์เรโทร (USD)';
        this.renderForexOption(tabContent, 'Forex'); break;
      case 'option':
        pageTitle.innerText = 'บันทึก Option รายเดือน';
        pageSubtitle.innerText = 'บันทึกผลกำไรขาดทุนรายเดือนสำหรับการ Hedging ค่าเงินและเก็งกำไร (USD)';
        this.renderForexOption(tabContent, 'Option'); break;
      case 'dividends':
        pageTitle.innerText = 'แดชบอร์ดเงินปันผล & YOC';
        pageSubtitle.innerText = 'วิเคราะห์กระแสเงินสดจากไข่ทองคำและการคำนวณ Yield on Cost จริง';
        this.renderDividends(tabContent); break;
      case 'cashflow':
        pageTitle.innerText = 'ตัวช่วยติดตามสภาพคล่อง';
        pageSubtitle.innerText = 'เปรียบเทียบเงินสดรอจังหวะช้อน Dry Powder ของแต่ละพอร์ต';
        this.renderCashFlow(tabContent); break;
      case 'comparison':
        pageTitle.innerText = 'ตารางเปรียบเทียบเติบโต';
        pageSubtitle.innerText = 'ข้อมูลมวลรวมและส่วนต่างเป้าหมาย นำมาประเมินเปรียบเทียบในตารางเดียว';
        this.renderComparison(tabContent); break;
      case 'settings':
        pageTitle.innerText = 'ตั้งค่า & สำรองข้อมูล';
        pageSubtitle.innerText = 'จัดการสำรองข้อมูลพอร์ตด้วยระบบ Import/Export หรือล้างตลับเซฟเริ่มใหม่';
        this.renderSettings(tabContent); break;
    }
  }

  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast border-pixel';
    const icons = { success: '🎯', error: '💥', level: '👑' };
    toast.innerHTML = `<span style="font-size:1.5rem">${icons[type] || '🔔'}</span> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'slideIn 0.2s reverse forwards';
      setTimeout(() => toast.remove(), 200);
    }, 3000);
  }

  closeModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
  }

  normalizePortfolios(portfolios) {
    return portfolios.map(p => {
      const port = { ...p };
      port.assets = Array.isArray(port.assets) ? port.assets : [];
      port.dryPowder = Number(port.dryPowder) || 0;
      port.current = Number(port.current) || 0;
      if (port.assets.length === 0 && port.current > 0) {
        port.assets = [{ name: 'Legacy Portfolio Balance', value: port.current }];
      }
      this.syncPortfolioCurrent(port, { clampDry: true });
      return port;
    });
  }

  getPortfolioTotalValue(port) {
    if (!port || !Array.isArray(port.assets)) return 0;
    return port.assets.reduce((sum, asset) => sum + (Number(asset.value) || 0), 0);
  }

  syncPortfolioCurrent(port, options = {}) {
    if (!port) return 0;
    const totalValue = this.getPortfolioTotalValue(port);
    port.dryPowder = Number(port.dryPowder) || 0;
    if (options.clampDry && port.dryPowder > totalValue) port.dryPowder = totalValue;
    port.current = Math.max(totalValue - port.dryPowder, 0);
    return totalValue;
  }

  syncAllPortfolioCurrents(options = {}) {
    this.portfolios.forEach(p => this.syncPortfolioCurrent(p, options));
  }

  adjustPortfolioTotalValue(port, delta, assetName = 'Dry Powder Movement') {
    if (!port) return;
    port.assets = Array.isArray(port.assets) ? port.assets : [];
    if (delta > 0) { port.assets.push({ name: assetName, value: delta }); return; }
    let remaining = Math.abs(delta);
    for (let i = port.assets.length - 1; i >= 0 && remaining > 0; i--) {
      const currentValue = Number(port.assets[i].value) || 0;
      const deduction = Math.min(currentValue, remaining);
      port.assets[i].value = currentValue - deduction;
      remaining -= deduction;
      if (port.assets[i].value <= 0) port.assets.splice(i, 1);
    }
  }

  getCalculations() {
    this.syncAllPortfolioCurrents();
    let totalTHB = 0, totalUSD = 0, totalInvestedTHB = 0, totalDryPowderTHB = 0;
    this.portfolios.forEach(p => {
      const isUSD = ['Forex', 'Option'].includes(p.category);
      const totalValue = this.getPortfolioTotalValue(p);
      if (isUSD) {
        totalUSD += totalValue;
        totalInvestedTHB += p.current * this.exchangeRate;
        totalDryPowderTHB += p.dryPowder * this.exchangeRate;
      } else {
        totalTHB += totalValue;
        totalInvestedTHB += p.current;
        totalDryPowderTHB += p.dryPowder;
      }
    });
    const netWorthTHB = totalTHB + (totalUSD * this.exchangeRate);
    return {
      netWorthTHB, netWorthUSD: netWorthTHB / this.exchangeRate,
      totalTHB, totalUSD, totalInvestedTHB, totalDryPowderTHB,
      totalLiquidityTHB: totalDryPowderTHB
    };
  }

  getPortfolioLevel(p) {
    if (p.goalType === 'schedule') {
      return { icon: p.dcaDoneThisMonth ? '🔥' : '⏳', label: p.dcaDoneThisMonth ? 'DCA เดือนนี้เรียบร้อย' : 'รอบรรลุการ DCA', desc: 'สะสมแต้มพลังบวกรายสัปดาห์/เดือน', pct: p.dcaDoneThisMonth ? 100 : 0 };
    }
    const totalValue = this.getPortfolioTotalValue(p);
    const pct = p.goal > 0 ? (totalValue / p.goal) * 100 : 0;
    const n = p.name.toLowerCase();
    if (n.includes('บ้าน') || n.includes('zero 5')) {
      if (pct >= 80) return { icon: '🏰', label: 'วิหารทองคำ', desc: 'ปลดล็อกสกินขอบทองขั้นสุดยอด!', pct };
      if (pct >= 40) return { icon: '🏡', label: 'บ้านโมเดิร์น', desc: 'ฐานรากมั่นคง คอนกรีตเสริมเหล็ก', pct };
      return { icon: '⛺', label: 'กระต๊อบ', desc: 'เพิ่งปักหลักเข็มเสร็จเลเวล 1', pct };
    }
    if (n.includes('รถ') || n.includes('zero 2')) {
      if (pct >= 80) return { icon: '🏎️', label: 'ซูเปอร์คาร์', desc: 'ซิ่งแซงหน้าความจน!', pct };
      if (pct >= 40) return { icon: '🚗', label: 'รถเก๋ง', desc: 'เดินทางอุ่นใจสไตล์ครอบครัว', pct };
      return { icon: '🚲', label: 'จักรยาน', desc: 'เริ่มปั่นชิวสะสมไมล์', pct };
    }
    if (n.includes('แต่งงาน') || n.includes('zero 4')) {
      if (pct >= 80) return { icon: '👑', label: 'มงกุฎราชา', desc: 'งานแต่งในฝันดั่งนิยายกรีก', pct };
      if (pct >= 40) return { icon: '💍', label: 'แหวนแต่งงาน', desc: 'เควสหัวใจเริ่มสว่างสดใส', pct };
      return { icon: '🌸', label: 'ดอกไม้', desc: 'จุดเริ่มต้นความสัมพันธ์ที่งดงาม', pct };
    }
    if (n.includes('เกษียณ') || n.includes('zero 3')) {
      if (pct >= 80) return { icon: '🏛️', label: 'วิหารทวยเทพ', desc: 'เสถียรสถาพร นั่งชิวสวรรค์ชั้นฟ้า', pct };
      if (pct >= 40) return { icon: '🔱', label: 'ป้อมปราการ', desc: 'สร้างกองทุนรับเงินปันผลรายสัปดาห์', pct };
      return { icon: '🪵', label: 'กองฟืนเก้าอี้โยก', desc: 'สะสมฟืนรอความอบอุ่นยามชรา', pct };
    }
    if (pct >= 80) return { icon: '⚔️', label: 'มหาอัศวินขุมทรัพย์', desc: 'กองทัพการเงินมีกำลังมหาศาล!', pct };
    if (pct >= 40) return { icon: '🛡️', label: 'นักรบพิทักษ์เหรียญ', desc: 'มีโล่ป้องกัน ความเสี่ยงลดลง', pct };
    return { icon: '🐣', label: 'มอนสเตอร์เลเวล 1', desc: 'กำลังฝึกฝนวิทยายุทธ์ฟาร์มเงินสด', pct };
  }

  getNextRankPreview(p) {
    if (p.goalType === 'schedule') return '🔮 ขั้นต่อไป: รักษาวินัยการลงทุนในเดือนถัดไป!';
    const totalValue = this.getPortfolioTotalValue(p);
    const pct = p.goal > 0 ? (totalValue / p.goal) * 100 : 0;
    const n = p.name.toLowerCase();
    if (pct >= 80) return `🏆 เลเวลสูงสุดแล้ว: ${this.getPortfolioLevel(p).icon} ${this.getPortfolioLevel(p).label}`;
    const targetPct = pct < 40 ? 40 : 80;
    let nextIcon = '⚔️', nextLabel = 'มหาอัศวินขุมทรัพย์';
    if (n.includes('บ้าน') || n.includes('zero 5')) { nextIcon = pct < 40 ? '🏡' : '🏰'; nextLabel = pct < 40 ? 'บ้านโมเดิร์น' : 'วิหารทองคำ'; }
    else if (n.includes('รถ') || n.includes('zero 2')) { nextIcon = pct < 40 ? '🚗' : '🏎️'; nextLabel = pct < 40 ? 'รถเก๋ง' : 'ซูเปอร์คาร์'; }
    else if (n.includes('แต่งงาน') || n.includes('zero 4')) { nextIcon = pct < 40 ? '💍' : '👑'; nextLabel = pct < 40 ? 'แหวนแต่งงาน' : 'มงกุฎราชา'; }
    else if (n.includes('เกษียณ') || n.includes('zero 3')) { nextIcon = pct < 40 ? '🔱' : '🏛️'; nextLabel = pct < 40 ? 'ป้อมปราการ' : 'วิหารทวยเทพ'; }
    else if (pct < 40) { nextIcon = '🛡️'; nextLabel = 'นักรบพิทักษ์เหรียญ'; }
    const neededVal = ((targetPct / 100) * p.goal) - totalValue;
    return `🔮 ขั้นต่อไป: ${nextIcon} ${nextLabel}<br><span style="font-size:0.75rem; color:var(--color-text-muted);">สะสมอีก ${this.formatMoney(neededVal, p.category)} เพื่อเลเวลอัป!</span>`;
  }

  formatMoney(val, category) {
    const isUSD = ['Forex', 'Option'].includes(category);
    return (isUSD ? '$' : '฿') + Number(val).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  // --- RENDER 1: DASHBOARD ---
  renderDashboard(container) {
    const calc = this.getCalculations();
    const portsWithGoals = this.portfolios.filter(p => p.goalType === 'numeric' && p.goal > 0);
    const closestToGoal = [...portsWithGoals].sort((a, b) => (this.getPortfolioTotalValue(b) / b.goal) - (this.getPortfolioTotalValue(a) / a.goal))[0];
    const highestCashPort = [...this.portfolios].sort((a, b) => b.dryPowder - a.dryPowder)[0];
    const totalDivTHB = this.dividendRecords.reduce((sum, r) => {
      const p = this.portfolios.find(port => port.id === r.portfolioId);
      const rate = (p && ['Forex', 'Option'].includes(p.category)) ? this.exchangeRate : 1;
      return sum + (r.amount * rate);
    }, 0);

    container.innerHTML = `
      <div class="dashboard-grid">
        <div class="stat-card border-pixel" style="--card-accent-color: var(--color-accent)">
          <div class="stat-header"><span class="stat-title">คลังมหาสมบัติสุทธิ</span><span class="stat-icon">👑</span></div>
          <div class="stat-value text-accent">฿${calc.netWorthTHB.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div class="stat-desc">ประมาณ $${calc.netWorthUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD (อัตรา ฿${this.exchangeRate})</div>
        </div>
        <div class="stat-card border-pixel" style="--card-accent-color: var(--color-secondary)">
          <div class="stat-header"><span class="stat-title">Invested Amount</span><span class="stat-icon">💼</span></div>
          <div class="stat-value text-success" style="color: var(--color-secondary) !important;">฿${calc.totalInvestedTHB.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div class="stat-desc">มูลค่าสินทรัพย์ย่อยไม่รวม Dry Powder</div>
        </div>
        <div class="stat-card border-pixel" style="--card-accent-color: var(--color-warning)">
          <div class="stat-header"><span class="stat-title">Dry Powder (กระสุนช้อน)</span><span class="stat-icon">🎯</span></div>
          <div class="stat-value" style="color: var(--color-warning);">฿${calc.totalDryPowderTHB.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div class="stat-desc">เงินสดสำรองรอช้อนในทุกพอร์ต</div>
        </div>
        <div class="stat-card border-pixel" style="--card-accent-color: var(--color-success)">
          <div class="stat-header"><span class="stat-title">กระแสเงินสดปันผลสะสม</span><span class="stat-icon">✨</span></div>
          <div class="stat-value text-success">฿${totalDivTHB.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div class="stat-desc">รวมปันผลรับทั้งหมดที่บันทึกในระบบ</div>
        </div>
      </div>

      <div class="dashboard-grid" style="grid-template-columns: 1fr 1fr">
        <div class="border-pixel" style="padding:20px;">
          <h4 style="font-family:var(--font-press-start); font-size:0.85rem; color:var(--color-accent); margin-bottom:16px;">🏆 มหาสงครามแย่งชิงความสำเร็จ</h4>
          <div style="display:flex; flex-direction:column; gap:16px;">
            ${closestToGoal ? `<div class="border-pixel-inset" style="padding:12px; display:flex; align-items:center; gap:12px;"><span style="font-size:2rem">🚩</span><div><div style="font-size:0.75rem; font-family:var(--font-press-start); color:var(--color-primary-light);">ใกล้เป้าหมายมากที่สุด</div><div style="font-weight:bold">${closestToGoal.name}</div><div style="font-size:0.85rem">${((this.getPortfolioTotalValue(closestToGoal)/closestToGoal.goal)*100).toFixed(1)}% ถึงเป้าหมาย</div></div></div>` : ''}
            ${highestCashPort ? `<div class="border-pixel-inset" style="padding:12px; display:flex; align-items:center; gap:12px;"><span style="font-size:2rem">💰</span><div><div style="font-size:0.75rem; font-family:var(--font-press-start); color:var(--color-success);">สภาพคล่องสูงสุด</div><div style="font-weight:bold">${highestCashPort.name}</div><div style="font-size:0.85rem">กระสุนในพอร์ต: ${this.formatMoney(highestCashPort.dryPowder, highestCashPort.category)}</div></div></div>` : ''}
          </div>
        </div>
        <div class="border-pixel" style="padding:20px; display:flex; flex-direction:column; justify-content:space-between;">
          <h4 style="font-family:var(--font-press-start); font-size:0.85rem; color:var(--color-accent); margin-bottom:12px;">📊 สรุปพอร์ตรวมระบบ</h4>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <div class="port-row"><span class="label">พอร์ตเงินบาท (THB):</span><span class="value" style="color:var(--color-info)">฿${calc.totalTHB.toLocaleString()}</span></div>
            <div class="port-row"><span class="label">พอร์ตเก็งกำไร (USD):</span><span class="value" style="color:var(--color-success)">$${calc.totalUSD.toLocaleString()} USD</span></div>
            <div class="port-row"><span class="label">สัดส่วนเงินสด/พอร์ตรวม:</span><span class="value">${calc.netWorthTHB > 0 ? ((calc.totalLiquidityTHB / calc.netWorthTHB)*100).toFixed(1) : '0.0'}%</span></div>
          </div>
          <div style="margin-top:16px;"><button class="btn btn-primary btn-retro btn-small" id="btn-dashboard-to-ports" style="width:100%">🔍 ตรวจสอบพอร์ตทั้งหมด</button></div>
        </div>
      </div>

      <div class="section-header"><h3>🥇 ระดับพอร์ตลงทุนปัจจุบัน</h3></div>
      <div class="portfolio-grid">
        ${this.portfolios.map(p => {
          const lvl = this.getPortfolioLevel(p);
          const color = p.category === 'Forex' ? 'var(--cat-forex)' : p.category === 'Option' ? 'var(--cat-option)' : 'var(--color-primary-light)';
          return `<div class="port-card border-pixel" data-id="${p.id}">
            <div class="port-card-header">
              <div><div class="port-card-title">${p.name}</div><span class="port-card-cat" style="background-color: var(--cat-${p.category.toLowerCase().replace(/[^a-z0-9]/g, '')}, var(--color-primary))">${p.category}</span></div>
              <div style="font-size:1.8rem; filter: drop-shadow(1px 1px 0px #000);">${lvl.icon}</div>
            </div>
            <div class="port-card-body">
              <div class="port-row"><span class="label">เงินสะสม:</span><span class="value">${this.formatMoney(this.getPortfolioTotalValue(p), p.category)}</span></div>
              <div class="progress-container"><div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${Math.min(100, lvl.pct)}%; --fill-color: ${color}"></div><div class="progress-text-overlay">${lvl.pct.toFixed(0)}%</div></div></div>
              <div style="font-size:0.75rem; color:var(--color-text-muted); margin-top:4px; text-align:center; font-weight:bold;">${lvl.label}</div>
            </div>
          </div>`;
        }).join('')}
      </div>
    `;

    container.querySelectorAll('.port-card').forEach(card => {
      card.addEventListener('click', () => {
        this.selectedPortId = card.dataset.id;
        this.activeTab = 'portfolios';
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        document.querySelector('.nav-item[data-tab="portfolios"]').classList.add('active');
        this.refreshUI();
      });
    });
    document.getElementById('btn-dashboard-to-ports').addEventListener('click', () => {
      this.activeTab = 'portfolios';
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      document.querySelector('.nav-item[data-tab="portfolios"]').classList.add('active');
      this.refreshUI();
    });
  }

  // --- RENDER 2: PORTFOLIOS DETAIL ---
  renderPortfolios(container) {
    const activePort = this.portfolios.find(p => p.id === this.selectedPortId) || this.portfolios[0];
    if (!activePort) {
      container.innerHTML = '<div class="border-pixel" style="padding:20px">กรุณาเพิ่มพอร์ตการลงทุนที่ปุ่มด้านบน ➕</div>';
      return;
    }
    const lvl = this.getPortfolioLevel(activePort);
    const isUSD = ['Forex', 'Option'].includes(activePort.category);
    const activeTotalValue = this.syncPortfolioCurrent(activePort, { clampDry: true });

    container.innerHTML = `
      <div class="portfolio-detail-container">
        <div class="detail-main-card border-pixel">
          <div class="detail-header-row">
            <div><span class="port-card-cat" style="background-color: var(--cat-${activePort.category.toLowerCase().replace(/[^a-z0-9]/g, '')}, var(--color-primary))">${activePort.category}</span><h3 style="margin-top:6px;">${activePort.name}</h3></div>
            <div class="detail-actions">
              <button class="btn btn-secondary btn-retro btn-small" id="btn-edit-port-detail">✏️ แก้ไขพอร์ต</button>
              <button class="btn btn-danger btn-retro btn-small" id="btn-delete-port-detail">💥 ลบพอร์ต</button>
            </div>
          </div>
          <div class="details-grid-stats">
            <div class="detail-stat-box"><span class="label">เป้าหมายพอร์ต:</span><span class="value text-accent">${activePort.goalType === 'numeric' ? this.formatMoney(activePort.goal, activePort.category) : activePort.goalSchedule}</span></div>
            <div class="detail-stat-box"><span class="label">ยอดลงทุนปัจจุบัน:</span><span class="value text-success">${this.formatMoney(activePort.current, activePort.category)}</span></div>
            <div class="detail-stat-box"><span class="label">Dry Powder:</span><span class="value" style="color:var(--color-primary-light);">${this.formatMoney(activePort.dryPowder, activePort.category)}</span></div>
          </div>
          <div>
            <div class="progress-bar-bg" style="height:24px;">
              <div class="progress-bar-fill" style="width: ${Math.min(100, lvl.pct)}%; --fill-color: var(--color-success)"></div>
              <div class="progress-text-overlay" style="font-size:0.85rem">${lvl.pct.toFixed(0)}% ถึงเป้าหมาย</div>
            </div>
          </div>
          ${activePort.goalType === 'schedule' ? `
            <div class="border-pixel-inset" style="padding:12px; display:flex; align-items:center; gap:8px; background-color:#1a2238;">
              <input type="checkbox" id="chk-dca-status" style="width:20px; height:20px; cursor:pointer;" ${activePort.dcaDoneThisMonth ? 'checked' : ''}>
              <label for="chk-dca-status" style="font-weight:bold; cursor:pointer;">ทำ DCA ประจำเดือนนี้แล้ว (${activePort.goalSchedule})</label>
            </div>` : ''}
          <div class="assets-section">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 2px solid #000; padding-bottom:6px;">
              <h4 style="font-family:var(--font-press-start); font-size:0.75rem;">💼 สินทรัพย์ย่อยในพอร์ต</h4>
              <button class="btn btn-primary btn-retro btn-small" id="btn-add-asset">➕ เพิ่มสินทรัพย์ย่อย</button>
            </div>
            <div class="assets-list">
              ${activePort.assets.length === 0 ? '<p class="text-muted" style="text-align:center; padding:12px;">ไม่มีสินทรัพย์ย่อย</p>' : activePort.assets.map((a, index) => `
                <div class="asset-item">
                  <div style="display:flex; align-items:center; gap:10px;"><span>💎</span><div><div style="font-weight:bold">${a.name}</div><div style="font-size:0.8rem; color:var(--color-text-muted);">มูลค่า: ${this.formatMoney(a.value, activePort.category)}</div></div></div>
                  <div class="asset-actions">
                    <button class="btn btn-secondary btn-retro btn-small" onclick="app.editAsset('${activePort.id}', ${index})">✏️</button>
                    <button class="btn btn-danger btn-retro btn-small" onclick="app.deleteAsset('${activePort.id}', ${index})">✖</button>
                  </div>
                </div>`).join('')}
            </div>
          </div>
          <div class="notes-section">
            <h4 style="font-family:var(--font-press-start); font-size:0.75rem; border-bottom: 2px solid #000; padding-bottom:6px;">📝 บันทึกความจำเสบียง</h4>
            <textarea id="active-port-notes" class="notes-area" rows="4">${activePort.notes || ''}</textarea>
            <button class="btn btn-success btn-retro btn-small" id="btn-save-notes" style="align-self:flex-end;">💾 บันทึกโน้ต</button>
          </div>
        </div>
        <div class="detail-side-column">
          <div class="widget-card border-pixel">
            <h4>🏅 ระดับของพอร์ต</h4>
            <div class="level-widget">
              <div class="level-icon">${lvl.icon}</div>
              <div class="level-title">${lvl.label}</div>
              <div class="level-desc">${lvl.desc}</div>
              <div style="border-top: 2px dashed #000; width: 100%; margin: 12px 0;"></div>
              <div style="font-size: 0.8rem; font-weight: bold; color: var(--color-accent);">${this.getNextRankPreview(activePort)}</div>
            </div>
          </div>
          <div class="widget-card border-pixel">
            <h4>📁 เลือกเปลี่ยนพอร์ต</h4>
            <div class="input-retro-group">
              <select id="select-active-port" class="input-retro" style="width:100%;">
                ${this.portfolios.map(p => `<option value="${p.id}" ${p.id === activePort.id ? 'selected' : ''}>${p.name}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="widget-card border-pixel">
            <h4>💰 อัปเดตยอดคงคลัง</h4>
            <form id="update-balance-form">
              <div class="input-retro-group"><label>เงินในพอร์ตรวม (${isUSD ? 'USD' : 'THB'}):</label><input type="number" id="update-current" class="input-retro" value="${activeTotalValue}" readonly style="background:#202638; color:var(--color-text-muted); cursor:not-allowed;"></div>
              <div class="input-retro-group"><label>ในนั้นเป็นเงินช้อน Dry:</label><input type="number" id="update-dry" class="input-retro" value="${activePort.dryPowder}" required></div>
              <button type="submit" class="btn btn-success btn-retro" style="width:100%; margin-top:8px;">💾 บันทึกยอด</button>
            </form>
          </div>
        </div>
      </div>
    `;

    document.getElementById('select-active-port').addEventListener('change', (e) => { this.selectedPortId = e.target.value; this.refreshUI(); });
    document.getElementById('btn-save-notes').addEventListener('click', () => {
      const port = this.portfolios.find(p => p.id === activePort.id);
      if (port) { port.notes = document.getElementById('active-port-notes').value; this.saveState(); this.showToast('📝 อัปเดตบันทึกเสร็จสิ้น!'); }
    });
    document.getElementById('update-balance-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const dry = Number(document.getElementById('update-dry').value);
      const port = this.portfolios.find(p => p.id === activePort.id);
      if (port) {
        const totalValue = this.getPortfolioTotalValue(port);
        port.dryPowder = dry > totalValue ? totalValue : Math.max(dry, 0);
        this.syncPortfolioCurrent(port, { clampDry: true });
        this.saveState(); this.refreshUI(); this.showToast('🎯 อัปเดตเงินในตลับเซฟเรียบร้อย!');
      }
    });
    document.getElementById('btn-edit-port-detail').addEventListener('click', () => this.openPortfolioModal(activePort));
    document.getElementById('btn-delete-port-detail').addEventListener('click', () => {
      if (confirm(`💥 ลบพอร์ต ${activePort.name}? ประวัติจะหายถาวร`)) {
        this.portfolios = this.portfolios.filter(p => p.id !== activePort.id);
        this.saveState();
        if (this.portfolios.length > 0) this.selectedPortId = this.portfolios[0].id;
        this.refreshUI(); this.showToast('💥 ลบพอร์ตสำเร็จ!', 'error');
      }
    });
    const dcaChk = document.getElementById('chk-dca-status');
    if (dcaChk) {
      dcaChk.addEventListener('change', (e) => {
        const port = this.portfolios.find(p => p.id === activePort.id);
        if (port) { port.dcaDoneThisMonth = e.target.checked; this.saveState(); this.refreshUI(); }
      });
    }
    document.getElementById('btn-add-asset').addEventListener('click', () => {
      const assetName = prompt('➕ กรอกชื่อสินทรัพย์ย่อย/หุ้น:');
      if (assetName) {
        const assetValue = Number(prompt(`กรอกมูลค่า (${isUSD ? 'USD' : 'THB'}):`));
        if (!isNaN(assetValue) && assetValue >= 0) {
          const port = this.portfolios.find(p => p.id === activePort.id);
          if (port) { port.assets.push({ name: assetName, value: assetValue }); this.syncPortfolioCurrent(port, { clampDry: true }); this.saveState(); this.refreshUI(); this.showToast('➕ เพิ่มสินทรัพย์สำเร็จ!'); }
        }
      }
    });
  }

  editAsset(portId, index) {
    const port = this.portfolios.find(p => p.id === portId);
    if (port && port.assets[index]) {
      const asset = port.assets[index];
      const isUSD = ['Forex', 'Option'].includes(port.category);
      const newName = prompt('แก้ไขชื่อสินทรัพย์:', asset.name);
      if (newName) {
        const newVal = Number(prompt(`แก้ไขมูลค่า (${isUSD ? 'USD' : 'THB'}):`, asset.value));
        if (!isNaN(newVal) && newVal >= 0) {
          asset.name = newName; asset.value = newVal;
          this.syncPortfolioCurrent(port, { clampDry: true }); this.saveState(); this.refreshUI(); this.showToast('✏️ แก้ไขเรียบร้อย!');
        }
      }
    }
  }

  deleteAsset(portId, index) {
    const port = this.portfolios.find(p => p.id === portId);
    if (port && port.assets[index]) {
      if (confirm(`ลบสินทรัพย์ ${port.assets[index].name}?`)) {
        port.assets.splice(index, 1);
        this.syncPortfolioCurrent(port, { clampDry: true }); this.saveState(); this.refreshUI(); this.showToast('✖ ลบสินทรัพย์ย่อยออกแล้ว', 'error');
      }
    }
  }

  // --- RENDER 3: QUARTERLY (TWR v1.3.0) ---
  calcTruePerformance(qOld, qNew, netCF) {
    const base = qOld + netCF;
    if (base === 0) return null;
    return ((qNew - base) / base) * 100;
  }

  calcYTD(rec) {
    const netCF = Number(rec.capitalAdded || 0) - Number(rec.capitalWithdrawn || 0);
    const qVals = [rec.q1, rec.q2, rec.q3, rec.q4].map(v => Number(v) || 0);
    const prevVals = [0, rec.q1, rec.q2, rec.q3].map(v => Number(v) || 0);
    let compound = 1, hasAny = false;
    for (let i = 0; i < 4; i++) {
      if (qVals[i] === 0) continue;
      const perf = this.calcTruePerformance(prevVals[i], qVals[i], i === 0 ? netCF : 0);
      if (perf !== null) { compound *= (1 + perf / 100); hasAny = true; }
    }
    return hasAny ? (compound - 1) * 100 : null;
  }

  renderQuarterly(container) {
    const stockPorts = this.portfolios.filter(p => !['Forex', 'Option'].includes(p.category));
    if (stockPorts.length === 0) {
      container.innerHTML = '<div class="border-pixel" style="padding:20px;">กรุณาสร้างพอร์ตหุ้นก่อนจดบันทึกไตรมาส 📈</div>';
      return;
    }
    const years = [...new Set(this.quarterlyRecords.map(r => r.year))];
    if (!years.includes(new Date().getFullYear())) years.push(new Date().getFullYear());
    years.sort((a, b) => b - a);
    if (!this.selectedQuarterlyYear) this.selectedQuarterlyYear = years[0];
    const yearRecords = this.quarterlyRecords.filter(r => r.year === this.selectedQuarterlyYear);

    container.innerHTML = `
      <div class="border-pixel" style="padding:20px; margin-bottom:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <label style="font-weight:bold;">เลือกปีปฏิทิน:</label>
            <select id="select-q-year" class="input-retro" style="padding: 4px 12px;">
              ${years.map(y => `<option value="${y}" ${y === this.selectedQuarterlyYear ? 'selected' : ''}>ปี ${y}</option>`).join('')}
            </select>
          </div>
          <button class="btn btn-primary btn-retro btn-small" id="btn-add-q-record">➕ บันทึกไตรมาสใหม่</button>
        </div>
      </div>
      <div class="portfolio-grid">
        ${stockPorts.map(p => {
          const rawRec = yearRecords.find(r => r.portfolioId === p.id);
          const rec = rawRec ? {
            ...rawRec,
            q1: Number(rawRec.q1) || 0,
            q2: Number(rawRec.q2) || 0,
            q3: Number(rawRec.q3) || 0,
            q4: Number(rawRec.q4) || 0,
            capitalAdded: Number(rawRec.capitalAdded) || 0,
            capitalWithdrawn: Number(rawRec.capitalWithdrawn) || 0,
          } : { q1: 0, q2: 0, q3: 0, q4: 0, capitalAdded: 0, capitalWithdrawn: 0, notes: 'ไม่มีประวัติ' };

          const netCF = rec.capitalAdded - rec.capitalWithdrawn;
          const perfQ1 = this.calcTruePerformance(0, rec.q1, netCF);
          const perfQ2 = this.calcTruePerformance(rec.q1, rec.q2, 0);
          const perfQ3 = this.calcTruePerformance(rec.q2, rec.q3, 0);
          const perfQ4 = this.calcTruePerformance(rec.q3, rec.q4, 0);
          const fmtPerf = (perf) => perf === null
            ? { text: 'N/A', cls: 'text-muted' }
            : { text: (perf >= 0 ? '+' : '') + perf.toFixed(1) + '%', cls: perf >= 0 ? 'text-success' : 'text-danger' };
          const p1 = fmtPerf(perfQ1), p2 = fmtPerf(perfQ2), p3 = fmtPerf(perfQ3), p4 = fmtPerf(perfQ4);
          const ytd = this.calcYTD(rec);
          const ytdCls = ytd === null ? 'text-muted' : ytd >= 0 ? 'text-success' : 'text-danger';
          const cfSign = netCF >= 0 ? '+' : '';
          const cfColor = netCF > 0 ? 'var(--color-success)' : netCF < 0 ? 'var(--color-danger)' : 'var(--color-text-muted)';

          return `
            <div class="border-pixel" style="padding:16px; display:flex; flex-direction:column; gap:12px;">
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #000; padding-bottom:6px;">
                <h4 style="font-weight:bold;">${p.name}</h4>
                <button class="btn btn-secondary btn-retro btn-small" onclick="app.openQuarterlyModal('${p.id}', ${this.selectedQuarterlyYear})">✏️ บันทึก</button>
              </div>
              <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px; text-align:center;">
                <div class="border-pixel-inset" style="padding:6px 2px;">
                  <div style="font-size:0.65rem; font-family:var(--font-press-start);">Q1</div>
                  <div style="font-weight:bold; font-size:0.8rem;">฿${rec.q1.toLocaleString()}</div>
                  <div class="${p1.cls}" style="font-size:0.65rem;">${rec.q1 ? p1.text : ''}</div>
                  ${rec.q1 ? '<div style="font-size:0.6rem; color:' + cfColor + '; margin-top:2px;">CF: ' + cfSign + '฿' + Math.abs(netCF).toLocaleString() + '</div>' : ''}
                </div>
                <div class="border-pixel-inset" style="padding:6px 2px;">
                  <div style="font-size:0.65rem; font-family:var(--font-press-start);">Q2</div>
                  <div style="font-weight:bold; font-size:0.8rem;">฿${rec.q2.toLocaleString()}</div>
                  <div class="${p2.cls}" style="font-size:0.65rem;">${rec.q2 ? p2.text : ''}</div>
                </div>
                <div class="border-pixel-inset" style="padding:6px 2px;">
                  <div style="font-size:0.65rem; font-family:var(--font-press-start);">Q3</div>
                  <div style="font-weight:bold; font-size:0.8rem;">฿${rec.q3.toLocaleString()}</div>
                  <div class="${p3.cls}" style="font-size:0.65rem;">${rec.q3 ? p3.text : ''}</div>
                </div>
                <div class="border-pixel-inset" style="padding:6px 2px;">
                  <div style="font-size:0.65rem; font-family:var(--font-press-start);">Q4</div>
                  <div style="font-weight:bold; font-size:0.8rem;">฿${rec.q4.toLocaleString()}</div>
                  <div class="${p4.cls}" style="font-size:0.65rem;">${rec.q4 ? p4.text : ''}</div>
                </div>
              </div>
              <div style="background:#111827; border:2px solid #1e3a5f; padding:8px 12px; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:0.75rem; color:var(--color-text-muted); font-weight:bold;">📊 กำไร/ขาดทุนสะสม YTD:</span>
                <span class="${ytdCls}" style="font-family:var(--font-press-start); font-size:0.75rem; font-weight:bold;">${ytd !== null ? (ytd >= 0 ? '+' : '') + ytd.toFixed(2) + '%' : 'N/A'}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    document.getElementById('select-q-year').addEventListener('change', (e) => {
      this.selectedQuarterlyYear = Number(e.target.value);
      this.refreshUI();
    });
    document.getElementById('btn-add-q-record').addEventListener('click', () => this.openQuarterlyModal());
  }

  openQuarterlyModal(portfolioId = '', year = new Date().getFullYear()) {
    const stockPorts = this.portfolios.filter(p => !['Forex', 'Option'].includes(p.category));
    const targetPortId = portfolioId || (stockPorts.length > 0 ? stockPorts[0].id : '');
    if (!targetPortId) return;
    const port = this.portfolios.find(p => p.id === targetPortId);
    if (!port) return;

    let rec = this.quarterlyRecords.find(r => r.portfolioId === targetPortId && r.year === year);
    if (!rec) {
      rec = { id: 'q-' + Date.now(), portfolioId: targetPortId, year, q1: 0, q2: 0, q3: 0, q4: 0, capitalAdded: 0, capitalWithdrawn: 0, notes: '' };
      this.quarterlyRecords.push(rec);
    }
    // Backward compat defaults
    rec.capitalAdded = Number(rec.capitalAdded) || 0;
    rec.capitalWithdrawn = Number(rec.capitalWithdrawn) || 0;

    document.getElementById('quarterly-modal').classList.remove('hidden');
    document.getElementById('q-port-id').value = targetPortId;
    document.getElementById('q-year').value = year;
    document.getElementById('q-port-label').textContent = 'พอร์ต: ' + port.name;
    document.getElementById('q-year-label').textContent = 'ปีที่บันทึก: ' + year;
    document.getElementById('q-val-q1').value = rec.q1 || '';
    document.getElementById('q-val-q2').value = rec.q2 || '';
    document.getElementById('q-val-q3').value = rec.q3 || '';
    document.getElementById('q-val-q4').value = rec.q4 || '';
    document.getElementById('q-cap-added').value = rec.capitalAdded;
    document.getElementById('q-cap-withdrawn').value = rec.capitalWithdrawn;
    document.getElementById('q-notes').value = rec.notes || '';

    // Trigger CF display update
    const netCF = rec.capitalAdded - rec.capitalWithdrawn;
    const el = document.getElementById('q-net-cf-display');
    if (el) {
      el.textContent = (netCF >= 0 ? '+' : '') + '฿' + netCF.toLocaleString();
      el.style.color = netCF > 0 ? 'var(--color-success)' : netCF < 0 ? 'var(--color-danger)' : 'var(--color-text-muted)';
    }
  }

  // --- RENDER 4 & 5: FOREX / OPTION MONTHLY ---
  renderForexOption(container, categoryName) {
    const ports = this.portfolios.filter(p => p.category === categoryName);
    if (ports.length === 0) {
      container.innerHTML = `<div class="border-pixel" style="padding:20px;">กรุณาสร้างพอร์ตหมวดหมู่ ${categoryName} ก่อน 💸</div>`;
      return;
    }
    if (!this.selectedSpecPortId || !ports.find(p => p.id === this.selectedSpecPortId)) {
      this.selectedSpecPortId = ports[0].id;
    }
    const years = [...new Set(this.monthlyRecords.map(r => r.year))];
    if (!years.includes(new Date().getFullYear())) years.push(new Date().getFullYear());
    years.sort((a, b) => b - a);
    if (!this.selectedMonthlyYear) this.selectedMonthlyYear = years[0];

    const portRecords = this.monthlyRecords.filter(r => r.portfolioId === this.selectedSpecPortId && r.year === this.selectedMonthlyYear);
    portRecords.sort((a, b) => a.month - b.month);
    const totalProfitLoss = portRecords.reduce((a, c) => a + c.profitLossUSD, 0);
    const monthsTH = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];

    container.innerHTML = `
      <div class="forex-header-summary">
        <div class="border-pixel" style="padding:16px; text-align:center;">
          <div style="font-size:0.75rem; font-family:var(--font-press-start); color:var(--color-text-muted);">สะสม YTD (${this.selectedMonthlyYear})</div>
          <div style="font-size:1.6rem; font-weight:900;" class="${totalProfitLoss >= 0 ? 'text-success' : 'text-danger'}">${totalProfitLoss >= 0 ? '+' : ''}$${totalProfitLoss.toLocaleString()} USD</div>
          <div style="font-size:0.8rem; color:var(--color-text-muted);">ประมาณ ฿${(totalProfitLoss * this.exchangeRate).toLocaleString(undefined, { maximumFractionDigits: 0 })} THB</div>
        </div>
      </div>
      <div class="forex-main-layout">
        <div class="detail-side-column">
          <div class="widget-card border-pixel">
            <h4>📁 เลือกพอร์ตและปี</h4>
            <div class="input-retro-group">
              <select id="select-monthly-port" class="input-retro" style="width:100%;">
                ${ports.map(p => `<option value="${p.id}" ${p.id === this.selectedSpecPortId ? 'selected' : ''}>${p.name}</option>`).join('')}
              </select>
            </div>
            <div class="input-retro-group" style="margin-top:12px;">
              <select id="select-monthly-year" class="input-retro" style="width:100%;">
                ${years.map(y => `<option value="${y}" ${y === this.selectedMonthlyYear ? 'selected' : ''}>ปี ${y}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="widget-card border-pixel">
            <h4>➕ บันทึกผลรายเดือน</h4>
            <form id="monthly-entry-form">
              <div class="input-retro-group">
                <label for="ent-month">เดือน:</label>
                <select id="ent-month" class="input-retro" required>
                  ${[...Array(12).keys()].map(i => `<option value="${i+1}">${monthsTH[i]} (${i+1})</option>`).join('')}
                </select>
              </div>
              <div class="input-retro-group"><label for="ent-pl">กำไร/ขาดทุนสุทธิ (USD):</label><input type="number" id="ent-pl" class="input-retro" placeholder="ใส่เครื่องหมายลบหากขาดทุน" required></div>
              <div class="input-retro-group"><label for="ent-notes">บันทึกช่วยจำ:</label><textarea id="ent-notes" class="input-retro" rows="3"></textarea></div>
              <button type="submit" class="btn btn-primary btn-retro" style="width:100%; margin-top:8px;">🎯 บันทึกผลเดือนนี้</button>
            </form>
          </div>
        </div>
        <div class="border-pixel entries-grid-box">
          <h4 style="font-family:var(--font-press-start); font-size:0.75rem; border-bottom: 2px solid #000; padding-bottom:8px; margin-bottom:12px;">📈 ประวัติรายเดือนปี ${this.selectedMonthlyYear}</h4>
          <div class="entries-list">
            ${portRecords.length === 0 ? '<p class="text-muted" style="text-align:center; padding:24px;">ยังไม่มีการบันทึกของปีนี้ 🚀</p>' : portRecords.map(r => `
              <div class="entry-item">
                <div>
                  <span class="entry-month-lbl text-accent">${monthsTH[r.month - 1]} ${r.year}</span>
                  <div style="font-size:0.75rem; color:var(--color-text-muted); margin-top:4px;">${r.notes || ''}</div>
                </div>
                <div style="display:flex; align-items:center; gap:16px;">
                  <div style="text-align:right;">
                    <div class="${r.profitLossUSD >= 0 ? 'text-success' : 'text-danger'}" style="font-weight:bold;">${r.profitLossUSD >= 0 ? '+' : ''}$${r.profitLossUSD.toLocaleString()}</div>
                    <div style="font-size:0.7rem; color:var(--color-text-muted);">~ ฿${(r.profitLossUSD * this.exchangeRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  </div>
                  <button class="btn btn-secondary btn-retro btn-small" onclick="app.deleteMonthlyRecord('${r.id}')">✖</button>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </div>
    `;

    document.getElementById('select-monthly-port').addEventListener('change', (e) => { this.selectedSpecPortId = e.target.value; this.refreshUI(); });
    document.getElementById('select-monthly-year').addEventListener('change', (e) => { this.selectedMonthlyYear = Number(e.target.value); this.refreshUI(); });
    document.getElementById('monthly-entry-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const monthVal = Number(document.getElementById('ent-month').value);
      const plVal = Number(document.getElementById('ent-pl').value);
      const notesVal = document.getElementById('ent-notes').value;
      let match = this.monthlyRecords.find(r => r.portfolioId === this.selectedSpecPortId && r.year === this.selectedMonthlyYear && r.month === monthVal);
      if (match) { match.profitLossUSD = plVal; match.notes = notesVal; this.showToast('✏️ อัปเดตข้อมูลเดือนเดิมเรียบร้อย!'); }
      else { this.monthlyRecords.push({ id: 'm-' + Date.now(), portfolioId: this.selectedSpecPortId, year: this.selectedMonthlyYear, month: monthVal, profitLossUSD: plVal, notes: notesVal }); this.showToast('🎯 บันทึกประวัติเดือนใหม่สำเร็จ!'); }
      this.saveState(); this.refreshUI();
    });
  }

  deleteMonthlyRecord(id) {
    if (confirm('ลบรายการนี้?')) {
      this.monthlyRecords = this.monthlyRecords.filter(r => r.id !== id);
      this.saveState(); this.refreshUI(); this.showToast('✖ ลบประวัติเดือนเสร็จสิ้น', 'error');
    }
  }

  // --- RENDER 6: DIVIDEND & YOC DASHBOARD ---
  renderDividends(container) {
    const years = [...new Set(this.dividendRecords.map(r => new Date(r.date).getFullYear()))];
    if (!years.includes(new Date().getFullYear())) years.push(new Date().getFullYear());
    years.sort((a, b) => b - a);
    if (!this.selectedDividendYear) this.selectedDividendYear = years[0];

    container.innerHTML = `
      <div class="forex-header-summary">
        <div class="border-pixel" style="padding:16px; text-align:center;">
          <div style="font-size:0.75rem; font-family:var(--font-press-start); color:var(--color-text-muted);">ปันผลรวมในปี ${this.selectedDividendYear}</div>
          <div style="font-size:1.6rem; font-weight:900; color:var(--color-success);" id="total-div-year">฿0</div>
        </div>
        <div class="border-pixel" style="padding:16px; text-align:center;">
          <div style="font-size:0.75rem; font-family:var(--font-press-start); color:var(--color-text-muted);">ปันผลสะสม All-Time</div>
          <div style="font-size:1.6rem; font-weight:900; color:var(--color-accent);" id="total-div-alltime">฿0</div>
        </div>
      </div>
      <div class="forex-main-layout">
        <div class="detail-side-column">
          <div class="widget-card border-pixel">
            <h4>📁 ตัวกรองปี</h4>
            <select id="select-div-year" class="input-retro" style="width:100%;">
              ${years.map(y => `<option value="${y}" ${y === this.selectedDividendYear ? 'selected' : ''}>ปี ${y}</option>`).join('')}
            </select>
            <button class="btn btn-success btn-retro" id="btn-trigger-div-modal" style="width:100%; margin-top:12px;">➕ บันทึกเงินปันผลรับ</button>
          </div>
        </div>
        <div class="border-pixel" style="padding:16px; overflow-x:auto;">
          <h4 style="font-family:var(--font-press-start); font-size:0.75rem; margin-bottom:12px;">📈 ตาราง Yield on Cost (YOC)</h4>
          <table class="retro-table" style="width:100%">
            <thead><tr><th>ชื่อพอร์ต</th><th>ต้นทุน (Invested)</th><th>ปันผลรับรวม</th><th>YOC %</th></tr></thead>
            <tbody>
              ${this.portfolios.filter(p => !['Forex', 'Option', 'Emergency'].includes(p.category)).map(p => {
                const pCost = p.current;
                const pDivs = this.dividendRecords.filter(r => r.portfolioId === p.id).reduce((sum, r) => sum + Number(r.amount), 0);
                const yoc = pCost > 0 ? (pDivs / pCost) * 100 : 0;
                return `<tr>
                  <td style="font-weight:bold;">${p.name}</td>
                  <td>${this.formatMoney(pCost, p.category)}</td>
                  <td style="color:var(--color-success); font-weight:bold;">${this.formatMoney(pDivs, p.category)}</td>
                  <td style="font-family:var(--font-press-start); font-size:0.75rem; color:var(--color-accent);">${yoc.toFixed(2)}%</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
          <h4 style="font-family:var(--font-press-start); font-size:0.75rem; margin-top:24px; margin-bottom:12px;">📜 ประวัติปันผลปี ${this.selectedDividendYear}</h4>
          <div class="entries-list">
            ${this.dividendRecords.filter(r => new Date(r.date).getFullYear() === this.selectedDividendYear).map(r => {
              const p = this.portfolios.find(port => port.id === r.portfolioId);
              return `<div class="entry-item">
                <div><span style="font-weight:bold;">${p ? p.name : 'ไม่พบพอร์ต'}</span><div style="font-size:0.75rem; color:var(--color-text-muted);">${r.date} — ${r.notes || ''}</div></div>
                <div style="display:flex; align-items:center; gap:12px;">
                  <div style="font-weight:bold; color:var(--color-success);">${this.formatMoney(r.amount, p ? p.category : '')}</div>
                  <button class="btn btn-secondary btn-retro btn-small" onclick="app.deleteDividendRecord('${r.id}')">✖</button>
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    let yearSum = 0, alltimeSum = 0;
    this.dividendRecords.forEach(r => {
      const p = this.portfolios.find(port => port.id === r.portfolioId);
      const rate = (p && ['Forex', 'Option'].includes(p.category)) ? this.exchangeRate : 1;
      const thbVal = r.amount * rate;
      alltimeSum += thbVal;
      if (new Date(r.date).getFullYear() === this.selectedDividendYear) yearSum += thbVal;
    });
    document.getElementById('total-div-year').innerText = '฿' + yearSum.toLocaleString(undefined, { maximumFractionDigits: 2 });
    document.getElementById('total-div-alltime').innerText = '฿' + alltimeSum.toLocaleString(undefined, { maximumFractionDigits: 2 });

    document.getElementById('select-div-year').addEventListener('change', (e) => { this.selectedDividendYear = Number(e.target.value); this.refreshUI(); });
    document.getElementById('btn-trigger-div-modal').addEventListener('click', () => {
      const select = document.getElementById('div-port-id');
      if (select) select.innerHTML = this.portfolios.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
      const divDate = document.getElementById('div-date');
      if (divDate) divDate.value = new Date().toISOString().split('T')[0];
      const divModal = document.getElementById('dividend-modal');
      if (divModal) divModal.classList.remove('hidden');
    });
  }

  handleSaveDividend() {
    const newDiv = {
      id: 'd-' + Date.now(),
      portfolioId: document.getElementById('div-port-id').value,
      amount: Number(document.getElementById('div-amount').value) || 0,
      date: document.getElementById('div-date').value,
      notes: document.getElementById('div-notes').value
    };
    this.dividendRecords.push(newDiv);
    this.saveState(); this.closeModals(); this.refreshUI();
    this.showToast('💰 บันทึกปันผลสำเร็จ!');
  }

  deleteDividendRecord(id) {
    if (confirm('ลบรายการเงินปันผลนี้หรือไม่?')) {
      this.dividendRecords = this.dividendRecords.filter(r => r.id !== id);
      this.saveState(); this.refreshUI(); this.showToast('✖ ลบรายการปันผลออกแล้ว', 'error');
    }
  }

  // --- RENDER 7: CASH FLOW TRACKER ---
  renderCashFlow(container) {
    container.innerHTML = `
      <div class="cashflow-grid">
        ${this.portfolios.map(p => {
          const totalCash = p.dryPowder;
          const ratio = p.goal > 0 ? totalCash / p.goal : 0;
          let statusText = '⚠️ ควรเติมเสบียงด่วน', statusCls = 'badge-danger';
          if ((p.goalType === 'schedule' && totalCash > 100000) || ratio >= 0.15) { statusText = '🍀 หล่อเลี้ยงตัวเองได้'; statusCls = 'badge-success'; }
          else if ((p.goalType === 'schedule' && totalCash > 30000) || ratio >= 0.05) { statusText = '⚡ สภาพคล่องนิ่ง'; statusCls = 'badge-warning'; }
          return `<div class="cashflow-card border-pixel">
            <span class="badge ${statusCls} cashflow-status-badge">${statusText}</span>
            <div><h4 style="font-weight:bold;">${p.name}</h4><span class="port-card-cat" style="background-color: var(--cat-${p.category.toLowerCase().replace(/[^a-z0-9]/g, '')}, var(--color-primary))">${p.category}</span></div>
            <div class="border-pixel-inset" style="padding:12px; margin-top:4px;"><div class="port-row"><span class="label">Dry Powder:</span><span class="value" style="color:var(--color-accent);">${this.formatMoney(p.dryPowder, p.category)}</span></div></div>
          </div>`;
        }).join('')}
      </div>
    `;
  }

  // --- RENDER 8: COMPARISON TABLE ---
  renderComparison(container) {
    const data = this.portfolios.map(p => {
      const rate = ['Forex', 'Option'].includes(p.category) ? this.exchangeRate : 1;
      const totalVal = this.getPortfolioTotalValue(p);
      const goalPct = p.goalType === 'numeric' ? (p.goal > 0 ? (totalVal / p.goal) * 100 : 0) : (p.dcaDoneThisMonth ? 100 : 0);
      const lvl = this.getPortfolioLevel(p);
      return { name: p.name, category: p.category, goalText: p.goalType === 'numeric' ? this.formatMoney(p.goal, p.category) : p.goalSchedule, goalRaw: p.goal || 0, currentTHB: totalVal * rate, diffTHB: p.goalType === 'numeric' ? (p.goal - totalVal) * rate : 0, goalPct, cashFlowTHB: p.dryPowder * rate, level: lvl.label };
    });
    data.sort((a, b) => this.sortAsc ? a[this.sortKey] - b[this.sortKey] : b[this.sortKey] - a[this.sortKey]);
    const ind = (key) => this.sortKey === key ? (this.sortAsc ? ' 🔺' : ' 🔻') : '';

    container.innerHTML = `
      <div class="table-responsive">
        <table class="retro-table">
          <thead><tr>
            <th onclick="app.handleSort('name')">ชื่อพอร์ต${ind('name')}</th>
            <th>ประเภท</th>
            <th onclick="app.handleSort('goalRaw')">เป้าหมาย${ind('goalRaw')}</th>
            <th onclick="app.handleSort('currentTHB')">ยอด THB${ind('currentTHB')}</th>
            <th onclick="app.handleSort('diffTHB')">ส่วนต่างที่ขาด${ind('diffTHB')}</th>
            <th onclick="app.handleSort('goalPct')">% สำเร็จ${ind('goalPct')}</th>
            <th onclick="app.handleSort('cashFlowTHB')">กระแสเงินสด${ind('cashFlowTHB')}</th>
            <th>สถานะ</th>
          </tr></thead>
          <tbody>
            ${data.map(d => {
              const pctCls = d.goalPct >= 80 ? 'text-success' : d.goalPct >= 40 ? 'text-accent' : 'text-danger';
              const diffText = d.diffTHB <= 0 ? '✔️ ถึงเป้าหมาย' : '฿' + d.diffTHB.toLocaleString(undefined, { maximumFractionDigits: 0 });
              return `<tr>
                <td style="font-weight:bold;">${d.name}</td>
                <td><span class="port-card-cat" style="background-color: var(--cat-${d.category.toLowerCase().replace(/[^a-z0-9]/g, '')}, var(--color-primary))">${d.category}</span></td>
                <td>${d.goalText}</td>
                <td style="font-family:var(--font-press-start); font-size:0.75rem;">฿${d.currentTHB.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                <td>${diffText}</td>
                <td class="${pctCls}" style="font-family:var(--font-press-start); font-size:0.75rem; font-weight:bold;">${d.goalPct.toFixed(1)}%</td>
                <td>฿${d.cashFlowTHB.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                <td><span class="badge ${d.goalPct >= 80 ? 'badge-success' : d.goalPct >= 40 ? 'badge-info' : 'badge-warning'}">${d.level}</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  handleSort(key) {
    if (this.sortKey === key) this.sortAsc = !this.sortAsc;
    else { this.sortKey = key; this.sortAsc = true; }
    this.refreshUI();
  }

  // --- RENDER 9: SETTINGS ---
  renderSettings(container) {
    container.innerHTML = `
      <div class="portfolio-detail-container" style="grid-template-columns: 1fr 1fr;">
        <div class="border-pixel" style="padding:24px;">
          <h3 style="font-family:var(--font-press-start); font-size:0.85rem; color:var(--color-accent); border-bottom:3px solid #000; padding-bottom:8px; margin-bottom:16px;">💾 การสำรองข้อมูล (JSON Backup)</h3>
          <p class="text-muted" style="font-size:0.9rem; margin-bottom:16px;">เนื่องจากแอปจัดเก็บข้อมูลแบบ Local ควรส่งออกไฟล์สำรองอย่างน้อยเดือนละครั้ง</p>
          <div style="display:flex; flex-direction:column; gap:12px;">
            <button class="btn btn-success btn-retro" id="btn-export-backup" style="width:100%;">💾 ส่งออกข้อมูลสำรอง (EXPORT JSON)</button>
            <div class="border-pixel-inset" style="padding:16px; margin-top:8px;">
              <h4 style="font-size:0.85rem; margin-bottom:8px;">📥 นำเข้าไฟล์สำรอง (IMPORT)</h4>
              <input type="file" id="import-file-selector" accept=".json" style="width:100%; font-family:var(--font-kanit); color:#94a3b8; margin-bottom:12px; cursor:pointer;">
              <button class="btn btn-primary btn-retro btn-small" id="btn-import-backup" style="width:100%;">📥 ดำเนินการนำเข้าข้อมูล</button>
            </div>
          </div>
          <div style="margin-top:16px; padding:12px; background:#0c0f1a; border:2px solid #2a3a5a;">
            <div style="font-size:0.8rem; color:var(--color-text-muted);">สถานะ Cloud Sync: <b style="color:${isFirebaseActive ? 'var(--color-success)' : 'var(--color-danger)'}">${isFirebaseActive ? '🟢 Realtime Active' : '🔴 Local-Only Mode'}</b></div>
          </div>
        </div>
        <div class="border-pixel" style="padding:24px; border-color:var(--color-danger)">
          <h3 style="font-family:var(--font-press-start); font-size:0.85rem; color:var(--color-danger); border-bottom:3px solid #000; padding-bottom:8px; margin-bottom:16px;">💥 เขตอันตราย (DANGER ZONE)</h3>
          <p class="text-muted" style="font-size:0.9rem; margin-bottom:16px;">การรีเซ็ตจะล้างฐานข้อมูลทั้งหมดในเบราว์เซอร์และเริ่มนับใหม่</p>
          <button class="btn btn-danger btn-retro" id="btn-reset-system" style="width:100%; margin-top:16px;">💥 รีเซ็ตพอร์ตกลับค่าเริ่มต้น</button>
        </div>
      </div>
    `;

    document.getElementById('btn-export-backup').addEventListener('click', () => {
      const backupData = { portfolios: this.portfolios, quarterlyRecords: this.quarterlyRecords, monthlyRecords: this.monthlyRecords, dividendRecords: this.dividendRecords, exchangeRate: this.exchangeRate, exportedAt: new Date().toISOString() };
      const a = document.createElement('a');
      a.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2)));
      a.setAttribute('download', 'pixel_steward_backup_' + new Date().toISOString().split('T')[0] + '.json');
      document.body.appendChild(a); a.click(); a.remove();
      this.showToast('💾 ส่งออกไฟล์สำรองสำเร็จ!');
    });

    document.getElementById('btn-import-backup').addEventListener('click', () => {
      const fileInput = document.getElementById('import-file-selector');
      if (!fileInput.files[0]) { alert('❌ กรุณาเลือกไฟล์ JSON ก่อน'); return; }
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (parsed.portfolios && parsed.quarterlyRecords && parsed.monthlyRecords) {
            this.portfolios = this.normalizePortfolios(parsed.portfolios);
            this.quarterlyRecords = parsed.quarterlyRecords;
            this.monthlyRecords = parsed.monthlyRecords;
            this.dividendRecords = parsed.dividendRecords || [];
            this.exchangeRate = parsed.exchangeRate || 36.5;
            this.saveState(); this.refreshUI(); this.showToast('📥 นำเข้าข้อมูลเสร็จสิ้น!');
          } else { alert('❌ โครงสร้างข้อมูลไม่ถูกต้อง'); }
        } catch (err) { alert('❌ แปลงไฟล์ผิดพลาด: ' + err.message); }
      };
      reader.readAsText(fileInput.files[0]);
    });

    document.getElementById('btn-reset-system').addEventListener('click', () => {
      if (confirm('⚠️ ยืนยันเคลียร์ข้อมูลกลับค่าเริ่มต้น? ข้อมูลในเบราว์เซอร์จะหายทั้งหมด!')) {
        ['ps_portfolios_v2','ps_quarterly_v2','ps_monthly_v2','ps_dividends_v2','ps_ex_rate_v2'].forEach(k => localStorage.removeItem(k));
        window.location.reload();
      }
    });
  }

  // --- MODAL: ADD / EDIT PORTFOLIO ---
  openPortfolioModal(portfolio = null) {
    const modal = document.getElementById('portfolio-modal');
    if (!modal) return;
    const title = document.getElementById('portfolio-modal-title');
    if (portfolio) {
      title.innerText = '✏️ แก้ไขข้อมูลพอร์ตลงทุน';
      document.getElementById('edit-port-id').value = portfolio.id;
      document.getElementById('port-name').value = portfolio.name;
      document.getElementById('port-category').value = portfolio.category;
      document.getElementById('port-start-date').value = portfolio.startDate;
      const goalTypeSelect = document.getElementById('port-goal-type');
      goalTypeSelect.value = portfolio.goalType || 'numeric';
      const valInput = document.getElementById('port-goal-value');
      const schInput = document.getElementById('port-goal-schedule');
      const label = document.getElementById('port-goal-label');
      if (portfolio.goalType === 'schedule') {
        label.innerText = 'เป้าหมาย (ตารางเวลา):';
        valInput.classList.add('hidden'); valInput.required = false;
        schInput.classList.remove('hidden'); schInput.value = portfolio.goalSchedule || ''; schInput.required = true;
      } else {
        label.innerText = 'เป้าหมาย (จำนวนเงิน):';
        valInput.classList.remove('hidden'); valInput.value = portfolio.goal || 0; valInput.required = true;
        schInput.classList.add('hidden'); schInput.required = false;
      }
      document.getElementById('port-dry-powder').value = portfolio.dryPowder;
      document.getElementById('port-notes').value = portfolio.notes || '';
    } else {
      title.innerText = '📦 เพิ่มพอร์ตการลงทุนใหม่';
      document.getElementById('edit-port-id').value = '';
      document.getElementById('portfolio-form').reset();
      document.getElementById('port-goal-label').innerText = 'เป้าหมาย (จำนวนเงิน):';
      document.getElementById('port-goal-value').classList.remove('hidden');
      document.getElementById('port-goal-value').required = true;
      document.getElementById('port-goal-schedule').classList.add('hidden');
      document.getElementById('port-goal-schedule').required = false;
      document.getElementById('port-start-date').value = new Date().toISOString().split('T')[0];
    }
    modal.classList.remove('hidden');
  }

  handleSavePortfolio() {
    const editId = document.getElementById('edit-port-id').value;
    const name = document.getElementById('port-name').value;
    const category = document.getElementById('port-category').value;
    const startDate = document.getElementById('port-start-date').value;
    const goalType = document.getElementById('port-goal-type').value;
    const goalVal = Number(document.getElementById('port-goal-value').value) || 0;
    const goalScheduleVal = document.getElementById('port-goal-schedule').value;
    const dryPowder = Number(document.getElementById('port-dry-powder').value) || 0;
    const notes = document.getElementById('port-notes').value;

    if (editId) {
      const port = this.portfolios.find(p => p.id === editId);
      if (port) {
        port.name = name; port.category = category; port.startDate = startDate; port.goalType = goalType;
        if (goalType === 'numeric') port.goal = goalVal; else port.goalSchedule = goalScheduleVal;
        const totalValue = this.getPortfolioTotalValue(port);
        port.dryPowder = dryPowder > totalValue ? totalValue : dryPowder;
        this.syncPortfolioCurrent(port, { clampDry: true });
        port.notes = notes;
        this.showToast('✏️ แก้ไขข้อมูลพอร์ตเรียบร้อย!');
      }
    } else {
      const newPort = { id: 'p-' + Date.now(), name, category, startDate, goalType, goal: goalType === 'numeric' ? goalVal : 0, goalSchedule: goalType === 'schedule' ? goalScheduleVal : '', dryPowder, assets: dryPowder > 0 ? [{ name: 'Initial Dry Powder', value: dryPowder }] : [], notes, dcaDoneThisMonth: false };
      this.syncPortfolioCurrent(newPort, { clampDry: true });
      this.portfolios.push(newPort);
      this.selectedPortId = newPort.id;
      this.showToast('📦 เพิ่มพอร์ตลงทุนใหม่เรียบร้อย!');
    }
    this.saveState(); this.closeModals(); this.refreshUI();
  }

  // --- MODAL: QUICK TRANSFER ---
  openTransferModal() {
    const modal = document.getElementById('transfer-modal');
    if (!modal) return;
    const sourceSelect = document.getElementById('tf-source');
    const targetSelect = document.getElementById('tf-target');
    sourceSelect.innerHTML = this.portfolios.map(p => `<option value="${p.id}">${p.name} (Dry: ${this.formatMoney(p.dryPowder, p.category)})</option>`).join('');

    const updateTargetOptions = () => {
      const srcId = sourceSelect.value;
      let targetsHTML = '<option value="system">ถอนออกนอกระบบ</option>';
      this.portfolios.forEach(p => { if (p.id !== srcId) targetsHTML += `<option value="${p.id}">${p.name}</option>`; });
      targetSelect.innerHTML = targetsHTML;
      const alloc = document.querySelector('.id-allocation-group');
      if (alloc) alloc.classList.toggle('hidden', targetSelect.value === 'system');
    };

    sourceSelect.addEventListener('change', updateTargetOptions);
    targetSelect.addEventListener('change', () => {
      const alloc = document.querySelector('.id-allocation-group');
      if (alloc) alloc.classList.toggle('hidden', targetSelect.value === 'system');
    });
    updateTargetOptions();
    document.getElementById('tf-rate').value = this.exchangeRate;
    modal.classList.remove('hidden');
  }

  handleExecuteTransfer() {
    const srcId = document.getElementById('tf-source').value;
    const destId = document.getElementById('tf-target').value;
    const amount = Number(document.getElementById('tf-amount').value);
    const rate = Number(document.getElementById('tf-rate').value) || this.exchangeRate;
    if (isNaN(amount) || amount <= 0) { alert('❌ กรุณาระบุจำนวนเงินที่ถูกต้อง'); return; }
    const srcPort = this.portfolios.find(p => p.id === srcId);
    if (!srcPort || srcPort.dryPowder < amount) { alert('❌ Dry Powder ไม่เพียงพอ'); return; }
    const isSourceUSD = ['Forex', 'Option'].includes(srcPort.category);
    srcPort.dryPowder -= amount;
    this.adjustPortfolioTotalValue(srcPort, -amount);
    this.syncPortfolioCurrent(srcPort, { clampDry: true });
    if (destId !== 'system') {
      const destPort = this.portfolios.find(p => p.id === destId);
      if (destPort) {
        const isTargetUSD = ['Forex', 'Option'].includes(destPort.category);
        let converted = amount;
        if (isSourceUSD && !isTargetUSD) converted = amount * rate;
        else if (!isSourceUSD && isTargetUSD) converted = amount / rate;
        destPort.dryPowder += converted;
        this.adjustPortfolioTotalValue(destPort, converted, 'Transfer In');
        this.syncPortfolioCurrent(destPort, { clampDry: true });
        this.showToast(`⚡ โยกย้าย ${this.formatMoney(converted, destPort.category)} ปลายทางเรียบร้อย!`);
      }
    } else {
      this.showToast(`⚡ ถอนเงิน ${this.formatMoney(amount, srcPort.category)} สู่ภายนอกสำเร็จ!`);
    }
    this.saveState(); this.closeModals(); this.refreshUI();
  }
}

window.app = new PixelStewardApp();