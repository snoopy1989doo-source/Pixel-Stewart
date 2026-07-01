/* ==========================================
   PIXEL STEWARD CORE ENGINE - APP.JS (V.1.6.3 CLOUD-FIRST)
   ========================================== */

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

const INITIAL_PORTFOLIOS = [
  { id: '1', name: 'RedWing (กยศ.)', category: 'Thai Stock', goalType: 'numeric', goal: 60000, current: 0, cashBuffer: 0, dryPowder: 5000, assets: [{ name: 'หุ้นย่อย A', value: 25000 }, { name: 'Buffer', value: 15000 }], startDate: '2025-01-01', notes: 'เน้นสำรองจ่ายและรักษาสภาพคล่อง' },
  { id: '2', name: 'Zero 1 (เงินฉุกเฉิน)', category: 'Emergency', goalType: 'numeric', goal: 95000, current: 0, cashBuffer: 0, dryPowder: 0, assets: [{ name: 'Buffer', value: 90000 }], startDate: '2025-01-01', notes: 'เงินสำรองห้ามแตะต้องเว้นแต่จำเป็น' },
  { id: '3', name: 'Zero 2 (รถ)', category: 'Asset', goalType: 'numeric', goal: 1200000, current: 0, cashBuffer: 0, dryPowder: 300000, assets: [{ name: 'Buffer', value: 50000 }], startDate: '2025-01-01', notes: 'สะสมดาวน์รถยนต์คันใหม่' },
  { id: '4', name: 'Zero 3 (เกษียณ)', category: 'Retirement', goalType: 'numeric', goal: 4000000, current: 0, cashBuffer: 0, dryPowder: 750000, assets: [{ name: 'กองทุนดัชนี', value: 750000 }, { name: 'Buffer', value: 100000 }], startDate: '2025-01-01', notes: 'พอร์ตหลักระยะยาว พลิกฟื้นอิสรภาพ' },
  { id: '5', name: 'Zero 4 (แต่งงาน)', category: 'Life Goal', goalType: 'numeric', goal: 600000, current: 0, cashBuffer: 0, dryPowder: 120000, assets: [{ name: 'Buffer', value: 30000 }], startDate: '2025-05-01', notes: 'ทุนแต่งงานในอนาคต' },
  { id: '6', name: 'Zero 5 (บ้าน)', category: 'Asset', goalType: 'numeric', goal: 1500000, current: 0, cashBuffer: 0, dryPowder: 180000, assets: [{ name: 'Buffer', value: 20000 }], startDate: '2025-06-01', notes: 'เป้าหมายระยะกลางสำหรับที่อยู่อาศัย' },
  { id: '7', name: 'Dividend Yield (หุ้นโลก)', category: 'Global Stock', goalType: 'numeric', goal: 300000, current: 0, cashBuffer: 0, dryPowder: 100000, assets: [{ name: 'ETF โลก', value: 100000 }, { name: 'Buffer', value: 20000 }], startDate: '2025-02-01', notes: 'ปันผลสม่ำเสมอ ลดความเสี่ยงค่าเงิน' },
  { id: '8', name: 'THAI Dividend (หุ้นไทย)', category: 'Thai Stock', goalType: 'numeric', goal: 100000, current: 0, cashBuffer: 0, dryPowder: 55000, assets: [{ name: 'หุ้นปันผลไทย', value: 55000 }, { name: 'Buffer', value: 10000 }], startDate: '2025-01-15', notes: 'เน้นกระแสเงินสดจากปันผลในประเทศ' },
  { id: '9', name: 'NEXT GEN (หุ้นเติบโต)', category: 'Growth Stock', goalType: 'schedule', goalSchedule: 'DCA ทุกวันที่ 25', current: 0, cashBuffer: 0, dryPowder: 4000000, assets: [{ name: 'Tech Growth', value: 4000000 }, { name: 'Buffer', value: 500000 }], startDate: '2025-03-01', notes: 'พอร์ตซิ่ง ดุดัน ไม่เกรงใจใคร โตระยะยาว', dcaDoneThisMonth: true },
  { id: '10', name: 'FOREX LIFE', category: 'Forex', goalType: 'numeric', goal: 50000, current: 0, cashBuffer: 0, dryPowder: 10000, assets: [{ name: 'Trading Capital', value: 7500 }, { name: 'Buffer', value: 2500 }], startDate: '2025-01-01', notes: 'เทรดกระแสเงินสดรายเดือน ดอลลาร์สหรัฐ' },
  { id: '11', name: 'FOREX RISK', category: 'Forex', goalType: 'numeric', goal: 20000, current: 0, cashBuffer: 0, dryPowder: 4000, assets: [{ name: 'Trading Capital', value: 2800 }, { name: 'Buffer', value: 1200 }], startDate: '2025-01-01', notes: 'พอร์ตเสี่ยงสูง ปั้นพอร์ตคูณเท่า' },
  { id: '12', name: 'Option', category: 'Option', goalType: 'numeric', goal: 30000, current: 0, cashBuffer: 0, dryPowder: 7000, assets: [{ name: 'Option Collateral', value: 5100 }, { name: 'Buffer', value: 1900 }], startDate: '2025-02-01', notes: 'ใช้กลยุทธ์ออปชั่นในการ Hedging และทำกำไร' }
];

const INITIAL_QUARTERLY_RECORDS = [
  { id: 'q-1', portfolioId: '4', year: 2025, q1: 600000, f1: 0, q2: 680000, f2: 0, q3: 750000, f3: 0, q4: 820000, f4: 0, notes: 'ภาพรวมพอร์ตเกษียณเติบโตขึ้นตามเป้าหมาย' },
  { id: 'q-2', portfolioId: '7', year: 2025, q1: 90000, f1: 0, q2: 100000, f2: 0, q3: 110000, f3: 0, q4: 118000, f4: 0, notes: 'ปันผลสะสมต่อเนื่อง ได้รับอานิสงส์จากหุ้นกลุ่มการเงินโลก' },
  { id: 'q-3', portfolioId: '8', year: 2025, q1: 50000, f1: 0, q2: 55000, f2: 0, q3: 58000, f3: 0, q4: 62000, f4: 0, notes: 'สภาวะตลาดไทยค่อนข้างผันผวนแต่ปันผลยังคงสม่ำเสมอ' },
  { id: 'q-4', portfolioId: '9', year: 2025, q1: 3000000, f1: 0, q2: 3500000, f2: 0, q3: 4000000, f3: 0, q4: 4300000, f4: 0, notes: 'DCA หุ้นเทคฯ อย่างเข้มงวดทุกวันที่ 25' }
];

const INITIAL_MONTHLY_RECORDS = [
  { id: 'm-1', portfolioId: '10', year: 2025, month: 10, profitLossUSD: 450, notes: 'เทรดคู่ EURUSD รันเทรนดสวยงาม' },
  { id: 'm-2', portfolioId: '10', year: 2025, month: 11, profitLossUSD: 520, notes: 'ตลาดเคลื่อนไหวตามกรอบ Sideway' },
  { id: 'm-3', portfolioId: '10', year: 2025, month: 12, profitLossUSD: -120, notes: 'มีโดน Stop Loss ปลายปีเนื่องจากปริมาณการซื้อขายเบาบาง' },
  { id: 'm-4', portfolioId: '11', year: 2025, month: 10, profitLossUSD: 180, notes: 'เทรดทองคำ (XAUUSD) เสี่ยงสูง' },
  { id: 'm-5', portfolioId: '11', year: 2025, month: 11, profitLossUSD: -90, notes: 'ล้างพอร์ทย่อยบางส่วนแต่กู้คืนมาได้' },
  { id: 'm-6', portfolioId: '11', year: 2025, month: 12, profitLossUSD: 310, notes: 'ได้ไม้สไนเปอร์ช่วง FOMC' }
];

class PixelStewardApp {
  constructor() {
    this.portfolios = [];
    this.quarterlyRecords = [];
    this.monthlyRecords = [];
    this.dividendRecords = [];
    this.exchangeRate = 36.5;
    this.activeTab = 'dashboard';
    this.selectedPortId = '1';
    this.init();
  }

  formatMoney(val, category) {
    const isUSD = ['Forex', 'Option'].includes(category);
    return (isUSD ? '$' : '฿') + Number(val).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  init() {
    const storedPorts = localStorage.getItem('ps_portfolios_v3');
    const storedQuarters = localStorage.getItem('ps_quarterly_v3');
    const storedMonthlies = localStorage.getItem('ps_monthly_v3');
    const storedDividends = localStorage.getItem('ps_dividends_v3');
    const storedRate = localStorage.getItem('ps_ex_rate_v3');

    this.portfolios = storedPorts ? JSON.parse(storedPorts) : INITIAL_PORTFOLIOS;
    this.quarterlyRecords = storedQuarters ? JSON.parse(storedQuarters) : INITIAL_QUARTERLY_RECORDS;
    this.monthlyRecords = storedMonthlies ? JSON.parse(storedMonthlies) : INITIAL_MONTHLY_RECORDS;
    this.dividendRecords = storedDividends ? JSON.parse(storedDividends) : [];
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
        }
      });
    }

    document.getElementById('btn-add-portfolio').addEventListener('click', () => this.openPortfolioModal());
    document.getElementById('btn-quick-transfer').addEventListener('click', () => this.openTransferModal());

    document.getElementById('btn-save-quarterly').addEventListener('click', () => {
      const portId = document.getElementById('q-port-id').value;
      const yr = Number(document.getElementById('q-year').value);
      let target = this.quarterlyRecords.find(r => r.portfolioId === portId && r.year === yr);
      if (!target) {
        target = { id: 'q-' + Date.now(), portfolioId: portId, year: yr, q1: 0, f1: 0, q2: 0, f2: 0, q3: 0, f3: 0, q4: 0, f4: 0, notes: '' };
        this.quarterlyRecords.push(target);
      }
      target.q1 = Number(document.getElementById('q-val-q1').value) || 0;
      target.f1 = Number(document.getElementById('q-flow-q1').value) || 0;
      target.q2 = Number(document.getElementById('q-val-q2').value) || 0;
      target.f2 = Number(document.getElementById('q-flow-q2').value) || 0;
      target.q3 = Number(document.getElementById('q-val-q3').value) || 0;
      target.f3 = Number(document.getElementById('q-flow-q3').value) || 0;
      target.q4 = Number(document.getElementById('q-val-q4').value) || 0;
      target.f4 = Number(document.getElementById('q-flow-q4').value) || 0;
      target.notes = document.getElementById('q-notes').value;
      this.saveState(); this.closeModals(); this.refreshUI();
    });

    document.getElementById('portfolio-form').addEventListener('submit', (e) => {
      e.preventDefault(); this.handleSavePortfolio();
    });

    document.getElementById('transfer-form').addEventListener('submit', (e) => {
      e.preventDefault(); this.handleExecuteTransfer();
    });

    document.getElementById('dividend-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const pId = document.getElementById('div-port-id').value;
      const amount = Number(document.getElementById('div-amount').value);
      const date = document.getElementById('div-date').value;
      const notes = document.getElementById('div-notes').value;
      this.dividendRecords.push({ id: 'd-' + Date.now(), portfolioId: pId, amount, date, notes });
      this.saveState(); this.closeModals(); this.refreshUI();
      alert('💰 บันทึกเงินปันผลเรียบร้อย!');
    });

    document.querySelectorAll('.nav-menu .nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-menu .nav-item').forEach(n => n.classList.remove('active'));
        const btn = e.currentTarget;
        btn.classList.add('active');
        this.activeTab = btn.dataset.tab;
        this.refreshUI();
      });
    });

    document.querySelectorAll('.btn-close-modal').forEach(btn => {
      btn.addEventListener('click', () => this.closeModals());
    });

    this.refreshUI();
  }

  connectCloudDatabase() {
    const dbRef = firebase.database().ref('pixel_steward_data');
    dbRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.portfolios) this.portfolios = data.portfolios;
        if (data.quarterlyRecords) this.quarterlyRecords = data.quarterlyRecords;
        if (data.monthlyRecords) this.monthlyRecords = data.monthlyRecords;
        if (data.dividendRecords) this.dividendRecords = data.dividendRecords;
        if (data.exchangeRate) this.exchangeRate = data.exchangeRate;
        this.refreshUI();
      }
    });
  }

  autoCalculatePortfolios() {
    this.portfolios.forEach(p => {
      const totalAssets = Array.isArray(p.assets) ? p.assets.reduce((sum, asset) => sum + (Number(asset.value) || 0), 0) : 0;
      const bufferAsset = p.assets.find(a => a.name.toLowerCase().includes('buffer') || a.name.includes('สำรอง'));
      p.cashBuffer = bufferAsset ? (Number(bufferAsset.value) || 0) : 0;
      p.current = Math.max(totalAssets - p.cashBuffer, 0);
    });
  }

  saveState() {
    this.autoCalculatePortfolios();
    localStorage.setItem('ps_portfolios_v3', JSON.stringify(this.portfolios));
    localStorage.setItem('ps_quarterly_v3', JSON.stringify(this.quarterlyRecords));
    localStorage.setItem('ps_monthly_v3', JSON.stringify(this.monthlyRecords));
    localStorage.setItem('ps_dividends_v3', JSON.stringify(this.dividendRecords));
    localStorage.setItem('ps_ex_rate_v3', this.exchangeRate.toString());
    this.syncStateToCloud();
  }

  getCalculations() {
    this.autoCalculatePortfolios();
    let totalTHB = 0, totalUSD = 0, totalCashBufferTHB = 0, totalDryPowderTHB = 0;
    this.portfolios.forEach(p => {
      const isUSD = ['Forex', 'Option'].includes(p.category);
      if (isUSD) {
        totalUSD += p.current;
        totalCashBufferTHB += p.cashBuffer * this.exchangeRate;
        totalDryPowderTHB += p.dryPowder * this.exchangeRate;
      } else {
        totalTHB += p.current;
        totalCashBufferTHB += p.cashBuffer;
        totalDryPowderTHB += p.dryPowder;
      }
    });
    const netWorthTHB = totalTHB + (totalUSD * this.exchangeRate) + totalCashBufferTHB;
    return { netWorthTHB, netWorthUSD: netWorthTHB / this.exchangeRate, totalTHB, totalUSD, totalCashBufferTHB, totalDryPowderTHB };
  }

  getPortfolioLevel(p) {
    if (p.goalType === 'schedule') return { icon: p.dcaDoneThisMonth ? '🔥' : '⏳', label: 'ดีซีเอสายวินัย', desc: 'รักษาวินัยเควส DCA สม่ำเสมอ', pct: p.dcaDoneThisMonth ? 100 : 0 };
    const pct = p.goal > 0 ? ((p.current + p.cashBuffer) / p.goal) * 100 : 0;
    const n = p.name.toLowerCase();
    if (n.includes('บ้าน') || n.includes('house') || n.includes('5')) return pct >= 80 ? { icon: '🏰', label: 'วิหารทองคำ', desc: 'สกินขอบทองขั้นสูงสุดยอด!', pct } : pct >= 40 ? { icon: '🏡', label: 'บ้านโมเดิร์น', desc: 'ฐานรากมั่นคง คอนกรีตเสริมเหล็ก', pct } : { icon: '⛺', label: 'กระต๊อบ', desc: 'เพิ่งตั้งหลักเข็มเสร็จเลเวล 1', pct };
    if (n.includes('รถ') || n.includes('car') || n.includes('2')) return pct >= 80 ? { icon: '🏎️', label: 'ซูเปอร์คาร์', desc: 'ซิ่งแซงหน้าความจน!', pct } : pct >= 40 ? { icon: '🚗', label: 'รถเก๋ง', desc: 'เดินทางอุ่นใจสไตล์ครอบครัว', pct } : { icon: '🚲', label: 'จักรยาน', desc: 'เริ่มปั่นชิวสะสมไมล์', pct };
    if (pct >= 80) return { icon: '⚔️', label: 'มหาอัศวินขุมทรัพย์', desc: 'กองทัพการเงินมีกำลังมหาศาล!', pct };
    if (pct >= 40) return { icon: '🛡️', label: 'นักรบพิทักษ์เหรียญ', desc: 'มีโล่ป้องกัน ความเสี่ยงลดลง', pct };
    return { icon: '🐣', label: 'มอนสเตอร์เลเวล 1', desc: 'กำลังฝึกฝนวิทยายุทธ์ฟาร์มเงินสด', pct };
  }

  getNextRankPreview(p) {
    if (p.goalType === 'schedule') return `🔮 เควส: ทำ DCA ประจำงวดให้ตรงปฏิทิน`;
    const pct = p.goal > 0 ? ((p.current + p.cashBuffer) / p.goal) * 100 : 0;
    if (pct >= 80) return `🏆 เลเวลสูงสุดขอบทองทองแล้ว!`;
    const targetPct = pct < 40 ? 40 : 80;
    const needed = ((targetPct / 100) * p.goal) - (p.current + p.cashBuffer);
    return `🔮 เลเวลอัปขั้นถัดไป: ขาดอีกประมาณ ${this.formatMoney(needed, p.category)}`;
  }

  refreshUI() {
    this.autoCalculatePortfolios();
    const tabContent = document.getElementById('tab-content');
    if (!tabContent) return;
    tabContent.innerHTML = '';

    const titleMap = { dashboard: 'แดชบอร์ดภาพรวม', portfolios: 'พอร์ตการลงทุน', quarterly: 'หุ้นรายไตรมาส', dividends: 'เงินปันผล & Yield on Cost', forex: 'Forex รายเดือน', option: 'Option รายเดือน', cashflow: 'สภาพคล่อง Cashflow', comparison: 'ตารางเปรียบเทียบสัดส่วน', settings: 'ตั้งค่าคลาวด์เซฟ' };
    document.getElementById('page-title').innerText = titleMap[this.activeTab] || 'Pixel Steward';

    switch (this.activeTab) {
      case 'dashboard': this.renderDashboard(tabContent); break;
      case 'portfolios': this.renderPortfolios(tabContent); break;
      case 'quarterly': this.renderQuarterly(tabContent); break;
      case 'dividends': this.renderDividends(tabContent); break;
      case 'forex': tabContent.innerHTML = '<div class="border-pixel" style="padding:20px; background:#1f273e;">📊 โมดูลเชื่อมต่อประวัติการเทรด Forex จาก Retro Trading Journal กำลังแสตนด์บายคู่ขนาน</div>'; break;
      case 'option': this.renderOptionManual(tabContent); break;
      case 'cashflow': this.renderCashFlow(tabContent); break;
      case 'comparison': this.renderComparison(tabContent); break;
      case 'settings': this.renderSettings(tabContent); break;
    }
  }

  renderDashboard(container) {
    const calc = this.getCalculations();
    const topGoals = this.portfolios.filter(p => p.goalType === 'numeric' && p.goal > 0).map(p => ({ name: p.name, pct: ((p.current + p.cashBuffer) / p.goal) * 100 })).sort((a, b) => b.pct - a.pct).slice(0, 3);
    const yr = new Date().getFullYear();
    let q1 = 0, q2 = 0, q3 = 0, q4 = 0;
    this.quarterlyRecords.filter(r => r.year === yr).forEach(r => {
      const p = this.portfolios.find(port => port.id === r.portfolioId);
      const rate = p && ['Forex', 'Option'].includes(p.category) ? this.exchangeRate : 1;
      q1 += (r.q1||0)*rate; q2 += (r.q2||0)*rate; q3 += (r.q3||0)*rate; q4 += (r.q4||0)*rate;
    });
    const maxQ = Math.max(q1, q2, q3, q4, 1);

    container.innerHTML = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
        <div class="stat-card border-pixel"><div class="stat-header"><span>ความมั่งคั่งสุทธิ</span><span>👑</span></div><div class="stat-value text-accent">฿${calc.netWorthTHB.toLocaleString(undefined,{maximumFractionDigits:2})}</div><div class="stat-desc">เงินทุน: ฿${(calc.totalTHB+(calc.totalUSD*this.exchangeRate)).toLocaleString()} | สำรอง Buffer: ฿${calc.totalCashBufferTHB.toLocaleString()}</div></div>
        <div class="stat-card border-pixel"><div class="stat-header"><span>Dry Powder (กระสุนรอช้อน)</span><span>🥄</span></div><div class="stat-value" style="color:var(--color-warning)!important;">฿${calc.totalDryPowderTHB.toLocaleString(undefined,{maximumFractionDigits:2})}</div><div class="stat-desc">สภาพคล่องกองกลางสำหรับรอเข้าซื้อคลังของถูก</div></div>
      </div>
      <div style="display:grid; grid-template-columns:1.2fr 0.8fr; gap:20px; margin-top:20px;">
        <div class="border-pixel" style="padding:20px; background:#1f273e;">
          <h4 style="font-family:'Press Start 2P'; font-size:0.65rem; color:#3b82f6; margin-bottom:15px;">📊 สรุปความเติบโตรายไตรมาส (${yr})</h4>
          <div style="display:flex; justify-content:space-around; align-items:flex-end; height:150px; background:#111625; padding:15px; border:2px solid #000;">
            <div style="width:20%; display:flex; flex-direction:column; align-items:center; height:100%; justify-content:flex-end;"><div style="font-size:0.65rem;">฿${q1.toLocaleString(undefined,{maximumFractionDigits:0})}</div><div style="width:100%; height:${(q1/maxQ)*100}%; background:var(--color-primary); border:2px solid #000;"></div><div style="font-size:0.7rem; margin-top:4px;">Q1</div></div>
            <div style="width:20%; display:flex; flex-direction:column; align-items:center; height:100%; justify-content:flex-end;"><div style="font-size:0.65rem;">฿${q2.toLocaleString(undefined,{maximumFractionDigits:0})}</div><div style="width:100%; height:${(q2/maxQ)*100}%; background:var(--color-success); border:2px solid #000;"></div><div style="font-size:0.7rem; margin-top:4px;">Q2</div></div>
            <div style="width:20%; display:flex; flex-direction:column; align-items:center; height:100%; justify-content:flex-end;"><div style="font-size:0.65rem;">฿${q3.toLocaleString(undefined,{maximumFractionDigits:0})}</div><div style="width:100%; height:${(q3/maxQ)*100}%; background:var(--color-secondary); border:2px solid #000;"></div><div style="font-size:0.7rem; margin-top:4px;">Q3</div></div>
            <div style="width:20%; display:flex; flex-direction:column; align-items:center; height:100%; justify-content:flex-end;"><div style="font-size:0.65rem;">฿${q4.toLocaleString(undefined,{maximumFractionDigits:0})}</div><div style="width:100%; height:${(q4/maxQ)*100}%; background:var(--color-accent); border:2px solid #000;"></div><div style="font-size:0.7rem; margin-top:4px;">Q4</div></div>
          </div>
        </div>
        <div class="border-pixel" style="padding:20px; background:#1f273e;">
          <h4 style="font-family:'Press Start 2P'; font-size:0.65rem; color:var(--color-accent); margin-bottom:12px;">🚩 เควสใกล้บรรลุเป้าหมาย</h4>
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${topGoals.map(g => `<div style="background:#111625; padding:8px; border:2px solid #000;"><div style="display:flex; justify-content:space-between; font-size:0.8rem;"><span>${g.name}</span><b style="color:var(--color-success);">${g.pct.toFixed(1)}%</b></div><div class="progress-container" style="margin-top:4px; height:6px;"><div class="progress-bar-fill" style="width:${Math.min(100,g.pct)}%; background:var(--color-accent); height:100%;"></div></div></div>`).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderPortfolios(container) {
    let active = this.portfolios.find(p => p.id === this.selectedPortId) || this.portfolios[0];
    this.selectedPortId = active.id;
    const lvl = this.getPortfolioLevel(active);
    const isUSD = ['Forex', 'Option'].includes(active.category);
    const weight = this.getCalculations().netWorthTHB > 0 ? (((active.current+active.cashBuffer)*(isUSD?this.exchangeRate:1))/this.getCalculations().netWorthTHB)*100 : 0;

    container.innerHTML = `
      <div style="display:grid; grid-template-columns: 0.65fr 1.35fr; gap:20px;">
        <div class="border-pixel" style="padding:15px; background:#111625;">
          <h4 style="font-family:'Press Start 2P'; font-size:0.6rem; color:#3b82f6; margin-bottom:10px; border-bottom:2px solid #000; padding-bottom:6px;">🎮 CARTRIDGE RACK</h4>
          <div class="cartridge-list-rack">
            ${this.portfolios.map(p => `
              <div class="pixel-cartridge-card ${p.id === this.selectedPortId?'active':''}" onclick="app.switchPortfolio('${p.id}')">
                <div class="cartridge-title">📁 ${p.name}</div>
                <div class="cartridge-meta"><span>${p.category}</span><b>${this.getPortfolioLevel(p).icon}</b></div>
                <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-top:4px; font-weight:bold; color:#10b981;">
                  <span>${this.formatMoney(p.current+p.cashBuffer, p.category)}</span>
                  ${p.dryPowder<=0?'<span class="ammo-warning-tag">⚠️ NO AMMO</span>':''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div style="display:grid; grid-template-columns: 1.1fr 0.9fr; gap:20px;">
          <div class="border-pixel" style="background:#1f273e; padding:15px; display:flex; flex-direction:column; gap:12px;">
            <div style="display:flex; justify-content:space-between; border-bottom:2px solid #000; padding-bottom:6px;"><h3>📦 ${active.name}</h3><span class="port-card-cat">${active.category}</span></div>
            <div style="background:#111625; padding:10px; border:2px solid #000; font-size:0.85rem;">🎯 เป้าหมาย: ${active.goalType==='numeric'?this.formatMoney(active.goal, active.category):active.goalSchedule}</div>
            <div style="background:#111625; padding:10px; border:2px solid #000; font-size:0.85rem; color:#10b981; font-weight:bold;">💼 พอร์ตรวมสุทธิ: ${this.formatMoney(active.current+active.cashBuffer, active.category)}</div>
            <div style="background:#0c1020; padding:8px; border:2px solid #000; font-size:0.75rem; color:#94a3b8;">⚖️ Weight Score: <b>${weight.toFixed(1)}% ของความมั่งคั่งรวม</b></div>
            <div>
              <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:bold; margin-bottom:2px;"><span>เควสโปรเกรส:</span><span>${lvl.pct.toFixed(1)}%</span></div>
              <div class="progress-container" style="height:15px; background:#111625; border:2px solid #000; position:relative;"><div style="width:${Math.min(100,lvl.pct)}%; background:var(--color-success); height:100%;"></div></div>
            </div>
            <div style="margin-top:5px;">
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #000; padding-bottom:4px;"><span style="font-size:0.8rem; font-weight:bold;">💎 สินทรัพย์ย่อย</span><button class="btn btn-primary btn-retro btn-small" id="btn-add-asset" style="padding:2px 6px;">➕ เพิ่ม</button></div>
              <div style="display:flex; flex-direction:column; gap:6px; margin-top:8px; max-height:180px; overflow-y:auto;">
                ${active.assets.length===0?'<p class="text-muted" style="font-size:0.8rem; text-align:center;">คลังว่างเปล่า</p>':active.assets.map((a,i)=>`<div style="display:flex; justify-content:space-between; background:#111625; padding:6px; border:2px solid #000; font-size:0.8rem;"><span>🔸 ${a.name}</span><div><b style="margin-right:8px;">${this.formatMoney(a.value, active.category)}</b><button class="btn btn-danger btn-small" onclick="app.deleteAsset('${active.id}',${i})" style="padding:0 4px;">✖</button></div></div>`).join('')}
              </div>
            </div>
          </div>
          <div style="display:flex; flex-direction:column; gap:15px;">
            <div class="border-pixel" style="padding:12px; background:#1f273e; text-align:center;">
              <h5 style="font-family:'Press Start 2P'; font-size:0.55rem; color:var(--color-accent);">🏅 RANK SCORE</h5>
              <div style="font-size:1.8rem; margin:6px 0;">${lvl.icon}</div>
              <b>${lvl.label}</b><p style="font-size:0.75rem; color:#94a3b8; margin:2px 0;">${lvl.desc}</p>
              <div style="border-top:2px dashed #000; margin:6px 0;"></div>
              <div style="font-size:0.75rem; text-align:left; color:var(--color-accent); font-weight:bold;">${this.getNextRankPreview(active)}</div>
            </div>
            <div class="border-pixel" style="padding:12px; background:#1f273e;">
              <h5 style="font-family:'Press Start 2P'; font-size:0.55rem; color:var(--color-success); margin-bottom:8px;">🥄 จัดการเงินช้อน</h5>
              <form id="update-balance-form" style="display:flex; flex-direction:column; gap:6px; font-size:0.8rem;">
                <label>เงินในพอร์ตรวมจริง (Auto):</label>
                <div style="background:#111625; padding:6px; border:2px solid #000; font-weight:bold; color:#10b981;">${this.formatMoney(active.current+active.cashBuffer, active.category)}</div>
                <label>ระบุเงินช้อน Dry Powder:</label>
                <input type="number" id="update-dry" class="input-retro" value="${active.dryPowder}" required style="width:100%;">
                <button type="submit" class="btn btn-success btn-retro" style="width:100%; padding:4px; font-weight:bold;"><span>💾 บันทึกเงินช้อน</span></button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('update-balance-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const p = this.portfolios.find(x => x.id === active.id);
      if (p) { p.dryPowder = Number(document.getElementById('update-dry').value); this.saveState(); this.refreshUI(); alert('🎯 อัปเดตเงินช้อนสำเร็จ!'); }
    });

    document.getElementById('btn-add-asset').addEventListener('click', () => {
      const name = prompt('กรอกชื่อสินทรัพย์ย่อย (ตั้งชื่อว่า Buffer สำหรับเงินสำรองสภาพคล่อง):');
      const val = Number(prompt(`ระบุมูลค่าสินทรัพย์ (${isUSD?'$':'฿'}):`));
      if (name && !isNaN(val) && val >= 0) { active.assets.push({ name, value: val }); this.saveState(); this.refreshUI(); }
    });
  }

  switchPortfolio(id) { this.selectedPortId = id; this.refreshUI(); }
  deleteAsset(id, idx) { const p = this.portfolios.find(x=>x.id===id); if(p&&p.assets[idx]&&confirm('ลบสินทรัพย์ย่อยนี้?')) { p.assets.splice(idx,1); this.saveState(); this.refreshUI(); } }

  renderQuarterly(container) {
    const stockPorts = this.portfolios.filter(p => !['Forex', 'Option'].includes(p.category));
    const year = new Date().getFullYear();
    
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:16px;">
        ${stockPorts.map(p => {
          const r = this.quarterlyRecords.find(x => x.portfolioId === p.id && x.year === year) || { q1:0, f1:0, q2:0, f2:0, q3:0, f3:0, q4:0, f4:0, notes:'' };
          
          const calcTWR = (cur, flow, prev) => {
            if (!prev || prev <= 0) return { text: 'N/A', cls: 'text-muted' };
            const pct = ((cur - flow - prev) / prev) * 100;
            return { text: (pct >= 0 ? '+' : '') + pct.toFixed(2) + '%', cls: pct >= 0 ? 'text-success' : 'text-danger' };
          };

          const g2 = calcTWR(r.q2, r.f2, r.q1);
          const g3 = calcTWR(r.q3, r.f3, r.q2);
          const g4 = calcTWR(r.q4, r.f4, r.q3);

          return `
            <div class="border-pixel" style="padding:15px; background:#1f273e;">
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #000; padding-bottom:6px; margin-bottom:10px;">
                <h4 style="font-weight:bold;">📈 ${p.name} (${year})</h4>
                <button class="btn btn-secondary btn-retro btn-small" onclick="app.openQuarterlyModal('${p.id}', ${year})">✏️ บันทึกตารางงวด</button>
              </div>
              <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; text-align:center;">
                <div class="border-pixel-inset" style="padding:8px; background:#111625;"><b style="font-size:0.75rem; color:var(--color-accent);">Q1</b><div>฿${(r.q1||0).toLocaleString()}</div><span style="font-size:0.65rem; color:#64748b;">อัดฉีด: ฿${(r.f1||0).toLocaleString()}</span><div style="font-size:0.75rem;" class="text-muted">Base</div></div>
                <div class="border-pixel-inset" style="padding:8px; background:#111625;"><b style="font-size:0.75rem; color:var(--color-success);">Q2</b><div>฿${(r.q2||0).toLocaleString()}</div><span style="font-size:0.65rem; color:#64748b;">อัดฉีด: ฿${(r.f2||0).toLocaleString()}</span><div style="font-size:0.75rem;" class="${g2.cls}">โต: ${g2.text}</div></div>
                <div class="border-pixel-inset" style="padding:8px; background:#111625;"><b style="font-size:0.75rem; color:var(--color-secondary);">Q3</b><div>฿${(r.q3||0).toLocaleString()}</div><span style="font-size:0.65rem; color:#64748b;">อัดฉีด: ฿${(r.f3||0).toLocaleString()}</span><div style="font-size:0.75rem;" class="${g3.cls}">โต: ${g3.text}</div></div>
                <div class="border-pixel-inset" style="padding:8px; background:#111625;"><b style="font-size:0.75rem; color:var(--color-accent);">Q4</b><div>฿${(r.q4||0).toLocaleString()}</div><span style="font-size:0.65rem; color:#64748b;">อัดฉีด: ฿${(r.f4||0).toLocaleString()}</span><div style="font-size:0.75rem;" class="${g4.cls}">โต: ${g4.text}</div></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  openQuarterlyModal(portfolioId, year) {
    const port = this.portfolios.find(p => p.id === portfolioId); if (!port) return;
    document.getElementById('q-port-id').value = portfolioId; document.getElementById('q-year').value = year;
    document.getElementById('q-port-label').innerText = `พอร์ต: ${port.name} (${year})`;
    const rec = this.quarterlyRecords.find(r => r.portfolioId === portfolioId && r.year === year) || { q1:'', f1:0, q2:'', f2:0, q3:'', f3:0, q4:'', f4:0, notes:'' };
    document.getElementById('q-val-q1').value = rec.q1; document.getElementById('q-flow-q1').value = rec.f1;
    document.getElementById('q-val-q2').value = rec.q2; document.getElementById('q-flow-q2').value = rec.f2;
    document.getElementById('q-val-q3').value = rec.q3; document.getElementById('q-flow-q3').value = rec.f3;
    document.getElementById('q-val-q4').value = rec.q4; document.getElementById('q-flow-q4').value = rec.f4;
    document.getElementById('q-notes').value = rec.notes || '';
    document.getElementById('quarterly-modal').classList.remove('hidden');
  }

  renderOptionManual(container) {
    const optionPorts = this.portfolios.filter(p => p.category === 'Option');
    const records = this.monthlyRecords.filter(r => optionPorts.map(p => p.id).includes(r.portfolioId));
    container.innerHTML = `
      <div class="border-pixel" style="padding:15px; background:#1f273e;">
        <h4 style="font-family:'Press Start 2P'; font-size:0.65rem; color:var(--color-accent); margin-bottom:10px;">💎 บันทึกงวดสัญญา Option (แมนนวลร้อยเปอร์เซ็นต์)</h4>
        <div style="display:grid; grid-template-columns:1fr 2fr; gap:15px;">
          <div class="border-pixel-inset" style="padding:12px; background:#111625;">
            <label style="font-size:0.8rem;">เลือกพอร์ต:</label>
            <select id="opt-port-select" class="input-retro" style="width:100%; margin-bottom:8px;">${optionPorts.map(p=>`<option value="${p.id}">${p.name}</option>`).join('')}</select>
            <label style="font-size:0.8rem;">เดือนงวด:</label>
            <select id="opt-month-select" class="input-retro" style="width:100%; margin-bottom:8px;">${[...Array(12).keys()].map(i=>`<option value="${i+1}">เดือน ${i+1}</option>`).join('')}</select>
            <label style="font-size:0.8rem;">P/L สุทธิ (USD):</label>
            <input type="number" id="opt-pl-input" class="input-retro" style="width:100%; margin-bottom:12px;" placeholder="เช่น 150 หรือ -80">
            <button class="btn btn-success btn-retro" id="btn-save-opt-manual" style="width:100%;"><span>💾 บันทึกงวดสัญญา</span></button>
          </div>
          <div class="border-pixel-inset" style="padding:12px; background:#111625;">
            <h5>📜 ประวัติสัญญารายเดือนย่อย</h5>
            <div style="max-height:220px; overflow-y:auto; font-size:0.85rem; margin-top:8px;">
              ${records.length===0?'<p class="text-muted">ไม่มีประวัติ Mock Data ตกค้าง พร้อมบันทึกข้อมูลจริง</p>':records.map(r=>`<div style="display:flex; justify-content:space-between; border-bottom:1px solid #333; padding:6px 0;"><span><b>${this.portfolios.find(x=>x.id===r.portfolioId)?.name}</b> (เดือน ${r.month})</span><b class="${r.profitLossUSD>=0?'text-success':'text-danger'}">${r.profitLossUSD>=0?'+':''}$${r.profitLossUSD}</b></div>`).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
    document.getElementById('btn-save-opt-manual').addEventListener('click', () => {
      const pId = document.getElementById('opt-port-select').value;
      const m = Number(document.getElementById('opt-month-select').value);
      const pl = Number(document.getElementById('opt-pl-input').value);
      if(!pId || isNaN(pl)) return;
      this.monthlyRecords.push({ id:'m-'+Date.now(), portfolioId:pId, year:new Date().getFullYear(), month:m, profitLossUSD:pl, notes:'Manual' });
      this.saveState(); this.refreshUI();
    });
  }

  renderDividends(container) {
    container.innerHTML = `
      <div class="border-pixel" style="padding:15px; background:#1f273e;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;"><h4>💰 วิเคราะห์ข้อมูลปันผล & Yield on Cost (YOC)</h4><button class="btn btn-success btn-retro btn-small" onclick="document.getElementById('dividend-modal').classList.remove('hidden')">➕ บันทึกปันผล</button></div>
        <table class="retro-table" style="width:100%; border-collapse:collapse; font-size:0.85rem;">
          <thead><tr style="background:#111625;"><th style="padding:8px; border:2px solid #000;">ชื่อพอร์ต</th><th style="padding:8px; border:2px solid #000;">ต้นทุนสินทรัพย์ย่อย</th><th style="padding:8px; border:2px solid #000;">รวมรับปันผล</th><th style="padding:8px; border:2px solid #000; color:var(--color-accent);">YOC Score</th></tr></thead>
          <tbody>
            ${this.portfolios.map(p => {
              const divs = this.dividendRecords.filter(x=>x.portfolioId===p.id).reduce((s,x)=>s+Number(x.amount),0);
              const yoc = p.current>0?((divs/p.current)*100).toFixed(2)+'%':'0.00%';
              return `<tr><td style="padding:8px; border:2px solid #000;"><b>${p.name}</b></td><td style="padding:8px; border:2px solid #000;">${this.formatMoney(p.current,p.category)}</td><td style="padding:8px; border:2px solid #000; color:var(--color-success);">${this.formatMoney(divs,p.category)}</td><td style="padding:8px; border:2px solid #000; font-weight:bold; color:var(--color-accent);">${yoc}</td></tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
    const select = document.getElementById('div-port-id');
    if(select) select.innerHTML = this.portfolios.map(p=>`<option value="${p.id}">${p.name}</option>`).join('');
  }

  renderCashFlow(container) {
    container.innerHTML = `
      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap:16px;">
        ${this.portfolios.map(p => {
          const liquidity = p.cashBuffer + p.dryPowder;
          const statusText = liquidity > 50000 ? '🍀 สภาพคล่องพรีเมียม' : liquidity > 10000 ? '⚡ ระดับปกติ' : '⚠️ วิกฤตเสบียงต่ำ';
          const badgeClass = liquidity > 50000 ? 'badge-success' : liquidity > 10000 ? 'badge-warning' : 'badge-danger';
          return `
            <div class="border-pixel" style="background:#1f273e; padding:15px; position:relative;">
              <span class="badge ${badgeClass}" style="position:absolute; top:10px; right:10px; font-size:0.7rem;">${statusText}</span>
              <h4>${p.name}</h4><span class="port-card-cat" style="font-size:0.7rem;">${p.category}</span>
              <div class="border-pixel-inset" style="padding:10px; background:#111625; font-size:0.85rem; margin-top:10px; display:flex; flex-direction:column; gap:4px;">
                <div style="display:flex; justify-content:space-between;"><span>สำรอง Buffer:</span><span style="color:var(--color-secondary); font-weight:bold;">${this.formatMoney(p.cashBuffer,p.category)}</span></div>
                <div style="display:flex; justify-content:space-between;"><span>กองเงินช้อน Dry:</span><span style="color:var(--color-warning); font-weight:bold;">${this.formatMoney(p.dryPowder, p.category)}</span></div>
                <div style="border-top:1px solid #444; margin-top:4px; padding-top:4px; display:flex; justify-content:space-between;"><span>สภาพคล่องรวม:</span><b style="color:#fff;">${this.formatMoney(liquidity, p.category)}</b></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  renderComparison(container) {
    container.innerHTML = `
      <div class="border-pixel" style="padding:15px; background:#1f273e; overflow-x:auto;">
        <table class="retro-table" style="width:100%; border-collapse:collapse; font-size:0.8rem; text-align:left;">
          <thead><tr style="background:#111625;"><th style="padding:8px; border:2px solid #000;">ชื่อพอร์ต</th><th style="padding:8px; border:2px solid #000;">เป้าหมายรวม</th><th style="padding:8px; border:2px solid #000;">พอร์ตรวมจริง (THB)</th><th style="padding:8px; border:2px solid #000;">ส่วนต่างที่ขาด (THB)</th><th style="padding:8px; border:2px solid #000; color:var(--color-success);">เควสสเกล</th></tr></thead>
          <tbody>
            ${this.portfolios.map(p => {
              const r = ['Forex', 'Option'].includes(p.category)?this.exchangeRate:1;
              const curTHB = (p.current+p.cashBuffer)*r;
              const goalTHB = p.goalType==='numeric'?(p.goal*r):0;
              const diff = p.goalType==='numeric'?Math.max(goalTHB-curTHB,0):0;
              const pct = p.goalType==='numeric'?(p.goal>0?(curTHB/goalTHB)*100:0):(p.dcaDoneThisMonth?100:0);
              return `<tr><td style="padding:8px; border:2px solid #000;"><b>${p.name}</b></td><td style="padding:8px; border:2px solid #000;">${p.goalType==='numeric'?this.formatMoney(p.goal,p.category):p.goalSchedule}</td><td style="padding:8px; border:2px solid #000;">฿${curTHB.toLocaleString(undefined,{maximumFractionDigits:0})}</td><td style="padding:8px; border:2px solid #000; color:#ef4444;">${diff>0?'฿'+diff.toLocaleString(undefined,{maximumFractionDigits:0}):'✔️ เควสเคลียร์'}</td><td style="padding:8px; border:2px solid #000; font-family:'Press Start 2P'; font-size:0.55rem; color:var(--color-success);">${pct.toFixed(1)}%</td></tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  renderSettings(container) {
    container.innerHTML = `
      <div class="border-pixel" style="padding:20px; background:#1f273e; display:flex; flex-direction:column; gap:12px;">
        <h3>⚙️ จัดการคลาวด์เซฟสถิติระบบนิเวศ</h3>
        <p>การเชื่อมต่อ Realtime Firebase: <b>${isFirebaseActive?'🟢 CONNECTED':'🔴 LOCAL ONLY'}</b></p>
        <textarea id="import-json-area" class="input-retro" rows="8" style="width:100%; font-family:monospace; background:#0c1020; color:#10b981; padding:10px; border:2px solid #000;" placeholder="วางข้อความวัตถุดิบ JSON สำรองข้อมูลที่นี่..."></textarea>
        <button class="btn btn-success btn-retro" id="btn-execute-import" style="width:180px;"><span>📥 โหลดฐานข้อมูล</span></button>
      </div>
    `;
    document.getElementById('btn-execute-import').addEventListener('click', () => {
      const s = document.getElementById('import-json-area').value.trim(); if(!s) return;
      try {
        const p = JSON.parse(s);
        if(p.portfolios) { this.portfolios=p.portfolios; this.quarterlyRecords=p.quarterlyRecords||[]; this.monthlyRecords=p.monthlyRecords||[]; this.dividendRecords=p.dividendRecords||[]; this.exchangeRate=Number(p.exchangeRate)||36.5; this.saveState(); this.refreshUI(); alert('🎯 นำเข้าเสร็จสิ้น!'); }
      } catch(e) { alert('ข้อมูลเสียหาย: '+e.message); }
    });
  }

  handleSavePortfolio() {
    const name = document.getElementById('port-name').value;
    const category = document.getElementById('port-category').value;
    const goalType = document.getElementById('port-goal-type').value;
    const dry = Number(document.getElementById('port-dry-powder').value)||0;
    const newPort = { id:'p-'+Date.now(), name, category, goalType, goal:goalType==='numeric'?Number(document.getElementById('port-goal-value').value)||0:0, goalSchedule:document.getElementById('port-goal-schedule').value, current:0, cashBuffer:0, dryPowder:dry, assets:[], notes:'', dcaDoneThisMonth:false };
    this.portfolios.push(newPort); this.saveState(); this.closeModals(); this.refreshUI();
  }

  handleExecuteTransfer() {
    const srcId = document.getElementById('tf-source').value;
    const destId = document.getElementById('tf-target').value;
    const amt = Number(document.getElementById('tf-amount').value);
    const r = Number(document.getElementById('tf-rate').value)||this.exchangeRate;
    const src = this.portfolios.find(x=>x.id===srcId);
    if(!src || src.dryPowder < amt) { alert('❌ กระสุนไม่เพียงพอ'); return; }
    src.dryPowder -= amt;
    if(destId!=='system') {
      const dest = this.portfolios.find(x=>x.id===destId);
      if(dest) {
        const sUSD = ['Forex', 'Option'].includes(src.category);
        const tUSD = ['Forex', 'Option'].includes(dest.category);
        let conv = amt;
        if(sUSD && !tUSD) conv = amt * r; else if(!sUSD && tUSD) conv = amt / r;
        dest.dryPowder += conv;
      }
    }
    this.saveState(); this.closeModals(); this.refreshUI(); alert('⚡ โยกย้ายจัดสรรเรียบร้อย!');
  }

  openPortfolioModal() { document.getElementById('portfolio-modal').classList.remove('hidden'); }
  openTransferModal() {
    document.getElementById('tf-source').innerHTML = this.portfolios.map(p=>`<option value="${p.id}">${p.name} (Dry: ${p.dryPowder})</option>`).join('');
    document.getElementById('tf-target').innerHTML = '<option value="system">ถอนเงินออกนอกคลัง</option>'+this.portfolios.map(p=>`<option value="${p.id}">${p.name}</option>`).join('');
    document.getElementById('tf-rate').value = this.exchangeRate;
    document.getElementById('transfer-modal').classList.remove('hidden');
  }
  closeModals() { document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden')); }
}

window.app = new PixelStewardApp();