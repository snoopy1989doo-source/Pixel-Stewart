/* ==========================================
   PIXEL STEWARD CORE ENGINE - APP.JS (V.1.6.3 CLOUD-FIRST)
   ========================================== */

// --- FIREBASE CONFIGURATION HOOK ---
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

// --- 🥇 ⚙️ ฐานข้อมูลสถิติมวลรวมฉบับกระชับ (คำนวณระบบอัตโนมัติ) ---
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

// 🛑 ล้างประวัติงวดสัญญารายเดือนของพอร์ตออปชันออกทั้งหมดตามคำสั่งเด็ดขาด คงเหลือเฉพาะประวัติ Forex พอร์ต 10 และ 11 เท่านั้น
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

    // ปรับปรุงฟังก์ชันยืนยันบันทึกรายงานไตรมาสรองรับท่อนทุนอัดฉีด
    const btnSaveQ = document.getElementById('btn-save-quarterly');
    if (btnSaveQ) {
      btnSaveQ.addEventListener('click', () => {
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
        this.saveState();
        this.closeModals();
        this.refreshUI();
        alert('📈 บันทึกรายงานไตรมาสสำเร็จ!');
      });
    }

    document.getElementById('portfolio-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSavePortfolio();
    });

    document.getElementById('transfer-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleExecuteTransfer();
    });

    const goalTypeSelect = document.getElementById('port-goal-type');
    if (goalTypeSelect) {
      goalTypeSelect.addEventListener('change', () => {
        const valInput = document.getElementById('port-goal-value');
        const schInput = document.getElementById('port-goal-schedule');
        const label = document.getElementById('port-goal-label');
        if (goalTypeSelect.value === 'numeric') {
          label.innerText = 'เป้าหมายเงินสะสม:';
          valInput.classList.remove('hidden');
          schInput.classList.add('hidden');
        } else {
          label.innerText = 'เป้าหมายแผนวินัย DCA:';
          valInput.classList.add('hidden');
          schInput.classList.remove('hidden');
        }
      });
    }

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

  syncStateToCloud() {
    if (!isFirebaseActive) return;
    firebase.database().ref('pixel_steward_data').set({
      portfolios: this.portfolios, quarterlyRecords: this.quarterlyRecords,
      monthlyRecords: this.monthlyRecords, dividendRecords: this.dividendRecords, exchangeRate: this.exchangeRate
    });
  }

  // --- ⚙️ AUTOMATED ASSET CALCULATION ENGINE ---
  autoCalculatePortfolios() {
    this.portfolios.forEach(p => {
      const totalAssets = Array.isArray(p.assets) 
        ? p.assets.reduce((sum, asset) => sum + (Number(asset.value) || 0), 0)
        : 0;

      const bufferAsset = p.assets.find(a => a.name.toLowerCase().includes('buffer') || a.name.includes('สำรอง'));
      if (bufferAsset) {
        p.cashBuffer = Number(bufferAsset.value) || 0;
      } else {
        p.cashBuffer = 0; 
      }
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
    if (p.goalType === 'schedule') {
      return { icon: p.dcaDoneThisMonth ? '🔥' : '⏳', label: 'ดีซีเอสายวินัย', desc: 'สะสมพลังบวกรายสัปดาห์', pct: p.dcaDoneThisMonth ? 100 : 0 };
    }
    const pct = p.goal > 0 ? ((p.current + p.cashBuffer) / p.goal) * 100 : 0;
    const nameLower = p.name.toLowerCase();

    if (nameLower.includes('บ้าน') || nameLower.includes('house') || nameLower.includes('zero 5')) {
      if (pct >= 80) return { icon: '🏰', label: 'วิหารทองคำ', desc: 'ปลดล็อกสกินขอบทองขั้นสุดยอด!', pct };
      if (pct >= 40) return { icon: '🏡', label: 'บ้านโมเดิร์น', desc: 'ฐานรากมั่นคง คอนกรีตเสริมเหล็ก', pct };
      return { icon: '⛺', label: 'กระต๊อบ', desc: 'เพิ่งปักหลักเข็มเสร็จเลเวล 1', pct };
    }
    if (nameLower.includes('รถ') || nameLower.includes('car') || nameLower.includes('zero 2')) {
      if (pct >= 80) return { icon: '🏎️', label: 'ซูเปอร์คาร์', desc: 'ซิ่งแซงหน้าความจน!', pct };
      if (pct >= 40) return { icon: '🚗', label: 'รถเก๋ง', desc: 'เดินทางอุ่นใจสไตล์ครอบครัว', pct };
      return { icon: '🚲', label: 'จักรยาน', desc: 'เริ่มปั่นชิวสะสมไมล์', pct };
    }
    if (nameLower.includes('แต่งงาน') || nameLower.includes('wedding') || nameLower.includes('zero 4')) {
      if (pct >= 80) return { icon: '👑', label: 'มงกุฎราชา', desc: 'งานแต่งในฝันดั่งนิยายกรีก', pct };
      if (pct >= 40) return { icon: '💍', label: 'แหวนแต่งงาน', desc: 'เควสหัวใจเริ่มสว่างสดใส', pct };
      return { icon: '🌸', label: 'ดอกไม้', desc: 'จุดเริ่มต้นความสัมพันธ์ที่งดงาม', pct };
    }
    if (nameLower.includes('เกษียณ') || nameLower.includes('retirement') || nameLower.includes('zero 3')) {
      if (pct >= 80) return { icon: '🏛️', label: 'วิหารทวยเทพ', desc: 'เสถียรสถาพร นั่งชิวสวรรค์ชั้นฟ้า', pct };
      if (pct >= 40) return { icon: '🔱', label: 'ป้อมปราการ', desc: 'สร้างกองทุนรับเงินปันผลรายสัปดาห์', pct };
      return { icon: '🪵', label: 'กองฟืนเก้าอี้โยก', desc: 'สะสมฟืนรอความอบอุ่นยามชรา', pct };
    }
    if (pct >= 80) return { icon: '⚔️', label: 'มหาอัศวินขุมทรัพย์', desc: 'กองทัพการเงินมีกำลังมหาศาล!', pct };
    if (pct >= 40) return { icon: '🛡️', label: 'นักรบพิทักษ์เหรียญ', desc: 'มีโล่ป้องกัน ความเสี่ยงลดลง', pct };
    return { icon: '🐣', label: 'มอนสเตอร์เลเวล 1', desc: 'กำลังฝึกฝนวิทยายุทธ์ฟาร์มเงินสด', pct };
  }

  getNextRankPreview(p) {
    if (p.goalType === 'schedule') return `🔮 เควส: รักษาวินัย DCA สม่ำเสมอ`;
    const pct = p.goal > 0 ? ((p.current + p.cashBuffer) / p.goal) * 100 : 0;
    const nameLower = p.name.toLowerCase();
    let nextIcon = '🛡️', nextLabel = 'นักรบพิทักษ์เหรียญ', targetPct = 40;

    if (pct < 40) {
      if (nameLower.includes('บ้าน')) { nextIcon = '🏡'; nextLabel = 'บ้านโมเดิร์น'; }
      else if (nameLower.includes('รถ')) { nextIcon = '🚗'; nextLabel = 'รถเก๋ง'; }
      else if (nameLower.includes('แต่งงาน')) { nextIcon = '💍'; nextLabel = 'แหวนแต่งงาน'; }
      else if (nameLower.includes('เกษียณ')) { nextIcon = '🔱'; nextLabel = 'ป้อมปราการ'; }
    } else if (pct < 80) {
      targetPct = 80;
      if (nameLower.includes('บ้าน')) { nextIcon = '🏰'; nextLabel = 'วิหารทองคำ'; }
      else if (nameLower.includes('รถ')) { nextIcon = '🏎️'; nextLabel = 'ซูเปอร์คาร์'; }
      else if (nameLower.includes('แต่งงาน')) { nextIcon = '👑'; nextLabel = 'มงกุฎราชา'; }
      else if (nameLower.includes('เกษียณ')) { nextIcon = '🏛️'; nextLabel = 'วิหารทวยเทพ'; }
      else { nextIcon = '⚔️'; nextLabel = 'มหาอัศวินขุมทรัพย์'; }
    } else {
      return `🏆 เลเวลสูงสุดขอบทองทองแล้ว!`;
    }
    const neededVal = ((targetPct / 100) * p.goal) - (p.current + p.cashBuffer);
    return `🔮 ขั้นต่อไป: ${nextIcon} ${nextLabel} (ขาดอีก ${this.formatMoney(neededVal, p.category)})`;
  }

  refreshUI() {
    this.autoCalculatePortfolios();
    const tabContent = document.getElementById('tab-content');
    if (!tabContent) return;
    tabContent.innerHTML = '';

    switch (this.activeTab) {
      case 'dashboard': this.renderDashboard(tabContent); break;
      case 'portfolios': this.renderPortfolios(tabContent); break;
      case 'quarterly': this.renderQuarterly(tabContent); break;
      case 'dividends': this.renderDividends(tabContent); break;
      case 'forex':
        tabContent.innerHTML = '<div class="border-pixel" style="padding:20px;">📊 โมดูลเชื่อมต่อประวัติการเทรด Forex จาก Retro Trading Journal กำลังแสตนด์บายคู่ขนาน</div>';
        break;
      case 'option': this.renderOptionManual(tabContent); break;
      case 'cashflow': this.renderCashFlow(tabContent); break; 
      case 'comparison': this.renderComparison(tabContent); break; 
      case 'settings': this.renderSettings(tabContent); break;
    }
  }

  // --- 📊 RENDER 1: CLEAN DASHBOARD ---
  renderDashboard(container) {
    const calc = this.getCalculations();
    const topGoals = this.portfolios
      .filter(p => p.goalType === 'numeric' && p.goal > 0)
      .map(p => {
        const totalVal = p.current + p.cashBuffer;
        return { name: p.name, pct: (totalVal / p.goal) * 100 };
      })
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 3);

    const currentYear = new Date().getFullYear();
    let q1Total = 0, q2Total = 0, q3Total = 0, q4Total = 0;
    this.quarterlyRecords.filter(r => r.year === currentYear).forEach(r => {
      const p = this.portfolios.find(port => port.id === r.portfolioId);
      const rate = (p && ['Forex', 'Option'].includes(p.category)) ? this.exchangeRate : 1;
      q1Total += (Number(r.q1) || 0) * rate;
      q2Total += (Number(r.q2) || 0) * rate;
      q3Total += (Number(r.q3) || 0) * rate;
      q4Total += (Number(r.q4) || 0) * rate;
    });

    const maxQVal = Math.max(q1Total, q2Total, q3Total, q4Total, 1);
    const getBarHeight = (val) => (val / maxQVal) * 100;

    container.innerHTML = `
      <div class="dashboard-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
        <div class="stat-card border-pixel" style="--card-accent-color: var(--color-accent)">
          <div class="stat-header"><span class="stat-title">ความมั่งคั่งสุทธิ (พอร์ตรวมทุกการลงทุน)</span><span class="stat-icon">👑</span></div>
          <div class="stat-value text-accent">฿${calc.netWorthTHB.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          <div class="stat-desc">เงินลงทุนรวม: ฿${(calc.totalTHB + (calc.totalUSD * this.exchangeRate)).toLocaleString(undefined, { maximumFractionDigits: 0 })} | สำรอง Buffer: ฿${calc.totalCashBufferTHB.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        </div>
        <div class="stat-card border-pixel" style="--card-accent-color: var(--color-warning)">
          <div class="stat-header"><span class="stat-title">Dry Powder (กระสุนรอช้อน)</span><span class="stat-icon">🥄</span></div>
          <div class="stat-value" style="color:var(--color-warning)!important">฿${calc.totalDryPowderTHB.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          <div class="stat-desc">สภาพคล่องสะสมรอสอยของถูกประจำพอร์ต</div>
        </div>
      </div>

      <div class="dashboard-grid" style="display:grid; grid-template-columns: 1.2fr 0.8fr; gap:20px; margin-top:20px;">
        <div class="border-pixel" style="padding:20px; background:#1f273e;">
          <h4 style="font-family:var(--font-press-start); font-size:0.75rem; color:var(--color-primary-light); margin-bottom:20px;">📈 สรุปความเติบโตของเงินทุนรายไตรมาส (${currentYear})</h4>
          <div style="display:flex; justify-content:space-around; align-items:flex-end; height:180px; background:#111625; padding:20px 10px; border:2px solid #000; border-radius:4px;">
            <div style="display:flex; flex-direction:column; align-items:center; width:20%; height:100%; justify-content:flex-end;">
              <div style="font-size:0.65rem; margin-bottom:4px;">฿${q1Total.toLocaleString(undefined,{maximumFractionDigits:0})}</div>
              <div style="width:100%; height:${getBarHeight(q1Total)}%; background:var(--color-primary); border:2px solid #000;"></div>
              <div style="font-size:0.7rem; font-family:var(--font-press-start); margin-top:8px;">Q1</div>
            </div>
            <div style="display:flex; flex-direction:column; align-items:center; width:20%; height:100%; justify-content:flex-end;">
              <div style="font-size:0.65rem; margin-bottom:4px; color:var(--color-success);">฿${q2Total.toLocaleString(undefined,{maximumFractionDigits:0})}</div>
              <div style="width:100%; height:${getBarHeight(q2Total)}%; background:var(--color-success); border:2px solid #000;"></div>
              <div style="font-size:0.7rem; font-family:var(--font-press-start); margin-top:8px;">Q2</div>
            </div>
            <div style="display:flex; flex-direction:column; align-items:center; width:20%; height:100%; justify-content:flex-end;">
              <div style="font-size:0.65rem; margin-bottom:4px;">฿${q3Total.toLocaleString(undefined,{maximumFractionDigits:0})}</div>
              <div style="width:100%; height:${getBarHeight(q3Total)}%; background:var(--color-secondary); border:2px solid #000;"></div>
              <div style="font-size:0.7rem; font-family:var(--font-press-start); margin-top:8px;">Q3</div>
            </div>
            <div style="display:flex; flex-direction:column; align-items:center; width:20%; height:100%; justify-content:flex-end;">
              <div style="font-size:0.65rem; margin-bottom:4px;">฿${q4Total.toLocaleString(undefined,{maximumFractionDigits:0})}</div>
              <div style="width:100%; height:${getBarHeight(q4Total)}%; background:var(--color-accent); border:2px solid #000;"></div>
              <div style="font-size:0.7rem; font-family:var(--font-press-start); margin-top:8px;">Q4</div>
            </div>
          </div>
        </div>

        <div class="border-pixel" style="padding:20px; background:#1f273e;">
          <h4 style="font-family:var(--font-press-start); font-size:0.7rem; color:var(--color-accent); margin-bottom:12px;">🚩 3 อันดับพอร์ตใกล้ถึงเป้าหมาย</h4>
          <div style="display:flex; flex-direction:column; gap:12px;">
            ${topGoals.length === 0 ? '<p class="text-muted">ไม่มีรายการ</p>' : topGoals.map((g, idx) => `
              <div style="background:#111625; padding:10px; border:2px solid #000;">
                <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:bold;">
                  <span>${idx+1}. ${g.name}</span>
                  <span style="color:var(--color-success);">${g.pct.toFixed(1)}%</span>
                </div>
                <div class="progress-container" style="margin-top:6px; height:8px;">
                  <div class="progress-bar-bg" style="height:100%;">
                    <div class="progress-bar-fill" style="width:${Math.min(100, g.pct)}%; height:100%; background:var(--color-accent);"></div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // --- 📁 RENDER 2: PORTFOLIOS CARTRIDGE RACK ---
  renderPortfolios(container) {
    if (this.portfolios.length === 0) {
      container.innerHTML = '<div class="border-pixel" style="padding:20px;">ไม่พบรายการพอร์ตในเซฟ</div>';
      return;
    }
    let activePort = this.portfolios.find(p => p.id === this.selectedPortId) || this.portfolios[0];
    this.selectedPortId = activePort.id;
    
    const lvl = this.getPortfolioLevel(activePort);
    const isUSD = ['Forex', 'Option'].includes(activePort.category);
    const netWorth = this.getCalculations().netWorthTHB;
    const currentPortWorthTHB = (activePort.current + activePort.cashBuffer) * (isUSD ? this.exchangeRate : 1);
    const weightPct = netWorth > 0 ? (currentPortWorthTHB / netWorth) * 100 : 0;

    container.innerHTML = `
      <div class="portfolio-detail-container" style="display:grid; grid-template-columns: 0.65fr 1.35fr; gap:24px;">
        
        <div class="border-pixel" style="padding:16px; background:#111625; display:flex; flex-direction:column; gap:10px;">
          <h4 style="font-family:var(--font-press-start); font-size:0.65rem; color:var(--color-primary-light); margin-bottom:8px; border-bottom:2px solid #000; padding-bottom:8px;">🎮 RETRO CARTRIDGE RACK</h4>
          <div class="cartridge-list">
            ${this.portfolios.map(p => {
              const pLvl = this.getPortfolioLevel(p);
              const ammoWarn = p.dryPowder <= 0 ? '<span class="ammo-warning">⚠️ NO AMMO</span>' : '';
              return `
                <div class="pixel-cartridge-card ${p.id === this.selectedPortId ? 'active' : ''}" onclick="app.switchPortfolio('${p.id}')">
                  <div class="cartridge-title">📁 ${p.name}</div>
                  <div class="cartridge-meta">
                    <span>${p.category}</span>
                    <span>${pLvl.icon}</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-top:2px;">
                    <span style="font-size:0.7rem; color:#10b981; font-weight:bold;">${this.formatMoney(p.current + p.cashBuffer, p.category)}</span>
                    ${ammoWarn}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 1.2fr 0.8fr; gap:20px;">
          <div class="detail-main-card border-pixel" style="background:#1f273e; padding:20px; display:flex; flex-direction:column; gap:16px; box-shadow: 6px 6px 0px #000;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #000; padding-bottom:10px;">
              <h3>📦 ${activePort.name}</h3>
              <span class="port-card-cat" style="background:var(--color-primary); font-size:0.8rem; padding:4px 10px;">${activePort.category}</span>
            </div>

            <div class="details-grid-stats" style="display:grid; grid-template-columns:1fr; gap:12px;">
              <div class="detail-stat-box" style="background:#111625; padding:12px; border:2px solid #000;">🎯 เป้าหมายพอร์ต: ${activePort.goalType === 'numeric' ? this.formatMoney(activePort.goal, activePort.category) : activePort.goalSchedule}</div>
              <div class="detail-stat-box" style="background:#111625; padding:12px; border:2px solid #000; color:var(--color-success)">💼 ยอดเงินพอร์ตรวมจริง: ${this.formatMoney(activePort.current + activePort.cashBuffer, activePort.category)}</div>
            </div>

            <div class="border-pixel-inset" style="padding:10px; background:#111625; font-size:0.8rem; display:flex; justify-content:space-between;">
              <span style="color:#94a3b8;">⚖️ น้ำหนักพอร์ต (Portfolio Weight Score):</span>
              <b style="color:var(--color-accent); font-family:var(--font-press-start); font-size:0.65rem;">${weightPct.toFixed(1)}% OF NET</b>
            </div>

            <div>
              <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:0.85rem; margin-bottom:4px;">
                <span>สเกลความก้าวหน้าเควส:</span>
                <span style="font-family:var(--font-press-start); font-size:0.75rem;">${lvl.pct.toFixed(1)}%</span>
              </div>
              <div class="progress-container" style="height:22px; background:#111625; border:2px solid #000; position:relative;">
                <div style="width: ${Math.min(100, lvl.pct)}%; height:100%; background:var(--color-success);"></div>
                <div style="position:absolute; width:100%; text-align:center; top:0; font-size:0.75rem; line-height:18px; font-weight:bold; color:#fff;">${lvl.pct.toFixed(0)}%</div>
              </div>
            </div>

            <div class="assets-section" style="margin-top:10px;">
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #000; padding-bottom:6px;">
                <h4 style="font-family:var(--font-press-start); font-size:0.65rem; color:var(--color-text-muted);">💎 สินทรัพย์ย่อยในตลับเซฟ</h4>
                <button class="btn btn-primary btn-retro btn-small" id="btn-add-asset" style="padding:2px 8px;">➕ เพิ่มสินทรัพย์ย่อย</button>
              </div>
              <div class="assets-list" style="margin-top:12px; display:flex; flex-direction:column; gap:6px; max-height:200px; overflow-y:auto;">
                ${activePort.assets.length === 0 ? '<p class="text-muted" style="text-align:center; padding:10px;">ไม่มีรายการสินทรัพย์ย่อย</p>' : activePort.assets.map((a, i) => `
                  <div style="display:flex; justify-content:space-between; background:#111625; padding:10px; border:2px solid #000;">
                    <span>🔸 ${a.name}</span>
                    <div>
                      <b style="margin-right:12px;">${this.formatMoney(a.value, activePort.category)}</b>
                      <button class="btn btn-danger btn-small" onclick="app.deleteAsset('${activePort.id}', ${i})" style="padding:2px 6px;">✖</button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:16px;">
            <div class="border-pixel" style="padding:12px; background:#1f273e; text-align:center; box-shadow: 4px 4px 0px #000;">
              <h5 style="font-family:var(--font-press-start); font-size:0.6rem; color:var(--color-accent); margin-bottom:8px;">🏅 ระดับของพอร์ต</h5>
              <div style="font-size:2rem; filter:drop-shadow(1px 1px 0px #000);">${lvl.icon}</div>
              <div style="font-weight:bold; margin-top:4px;">${lvl.label}</div>
              <div style="font-size:0.75rem; color:var(--color-text-muted);">${lvl.desc}</div>
              <div style="border-top:2px dashed #000; margin:8px 0;"></div>
              <div style="font-size:0.75rem; font-weight:bold; color:var(--color-accent); text-align:left;">${this.getNextRankPreview(activePort)}</div>
            </div>

            <div class="border-pixel" style="padding:14px; background:#1f273e; box-shadow: 4px 4px 0px #000;">
              <h5 style="font-family:var(--font-press-start); font-size:0.6rem; color:var(--color-success); margin-bottom:10px;">💰 อัปเดตเงินช้อน</h5>
              <form id="update-balance-form" style="display:flex; flex-direction:column; gap:8px; font-size:0.85rem;">
                <div>
                  <label style="font-weight:bold; display:block; margin-bottom:2px;">เงินในพอร์ตรวมจริง (${isUSD ? 'USD' : 'THB'}):</label>
                  <div style="background:#111625; padding:8px; border:2px solid #000; font-family:monospace; color:#10b981; font-weight:bold;">
                    ${this.formatMoney(activePort.current + activePort.cashBuffer, activePort.category)}
                  </div>
                  <small style="color:#64748b;">* คำนวณรวมออโต้จากตลับสินทรัพย์ย่อย</small>
                </div>
                <div>
                  <label style="font-weight:bold; display:block; margin-bottom:2px;">ในนั้นเป็นเงินช้อน Dry Powder:</label>
                  <input type="number" id="update-dry" class="input-retro" value="${activePort.dryPowder}" style="width:100%; padding:4px;" required>
                </div>
                <button type="submit" class="btn btn-success btn-retro" style="width:100%; padding:6px; margin-top:4px; font-weight:bold;"><span>💾 บันทึกเงินช้อน Dry Powder</span></button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('update-balance-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const dry = Number(document.getElementById('update-dry').value);
      const port = this.portfolios.find(p => p.id === activePort.id);
      if (port) {
        port.dryPowder = dry;
        this.saveState();
        this.refreshUI();
        alert('🎯 บันทึกเสบียงเงินช้อนเรียบร้อย!');
      }
    });

    const addAssetBtn = document.getElementById('btn-add-asset');
    if (addAssetBtn) {
      addAssetBtn.addEventListener('click', () => {
        const name = prompt('กรอกชื่อสินทรัพย์ย่อย (เช่น AGG, MSFT หรือตั้งชื่อว่า Buffer สำหรับเงินสำรอง):');
        const val = Number(prompt(`ระบุมูลค่าเงินลงทุนสุทธิ (${isUSD ? 'USD' : 'THB'}):`));
        if (name && !isNaN(val) && val >= 0) {
          activePort.assets.push({ name, value: val });
          this.saveState();
          this.refreshUI();
        }
      });
    }
  }

  switchPortfolio(id) { this.selectedPortId = id; this.refreshUI(); }
  deleteAsset(portId, index) {
    const port = this.portfolios.find(p => p.id === portId);
    if (port && port.assets[index]) {
      if (confirm(`ลบสินทรัพย์ย่อย ${port.assets[index].name}?`)) {
        port.assets.splice(index, 1);
        this.saveState(); this.refreshUI();
      }
    }
  }

  // --- 📈 RENDER 3: QUARTERLY ADVANCED ENGINE (คำนวณกำไรสุทธิด้วยสูตรสากลหักเงินอัดฉีด) ---
  renderQuarterly(container) {
    const stockPorts = this.portfolios.filter(p => !['Forex', 'Option'].includes(p.category));
    const year = new Date().getFullYear();
    
    container.innerHTML = `
      <div class="portfolio-grid" style="display:flex; flex-direction:column; gap:20px;">
        ${stockPorts.map(p => {
          const raw = this.quarterlyRecords.find(r => r.portfolioId === p.id && r.year === year) || { q1:0, f1:0, q2:0, f2:0, q3:0, f3:0, q4:0, f4:0, notes:'' };
          
          // ตรรกะสูตรคำนวณทางการเงินสากล (Net Flow Adjusted Return) เทียบงวดเพื่อไม่ให้เป้าเพี้ยนจากการอัดเงินทุนเพิ่มเอง
          const calcGrowth = (currentVal, capitalFlow, prevVal) => {
            if (!prevVal || prevVal <= 0) return { text: 'N/A', cls: 'text-muted' };
            const netReturn = currentVal - capitalFlow - prevVal;
            const pct = (netReturn / prevVal) * 100;
            return {
              text: (pct >= 0 ? '+' : '') + pct.toFixed(2) + '%',
              cls: pct >= 0 ? 'text-success' : 'text-danger'
            };
          };

          const g2 = calcGrowth(raw.q2, raw.f2, raw.q1);
          const g3 = calcGrowth(raw.q3, raw.f3, raw.q2);
          const g4 = calcGrowth(raw.q4, raw.f4, raw.q3);

          return `
            <div class="border-pixel" style="padding:20px; background:#1f273e; border:2px solid #000; box-shadow: 4px 4px 0px #000;">
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #000; padding-bottom:8px; margin-bottom:12px;">
                <h4 style="font-weight:bold; font-size:1.1rem; color:#fff;">📊 ${p.name} (${year})</h4>
                <button class="btn btn-secondary btn-retro btn-small" onclick="app.openQuarterlyModal('${p.id}', ${year})">✏️ บันทึกรายงานไตรมาส</button>
              </div>
              
              <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:16px; text-align:center;">
                <div class="border-pixel-inset" style="padding:10px; background:#111625;">
                  <b style="color:var(--color-accent); font-size:0.75rem; font-family:var(--font-press-start);">Q1</b>
                  <div style="margin:4px 0; font-weight:bold;">฿${(raw.q1||0).toLocaleString()}</div>
                  <div style="font-size:0.7rem; color:#64748b;">ทุนอัดฉีด: ฿${(raw.f1||0).toLocaleString()}</div>
                  <span style="font-size:0.75rem;" class="text-muted">Base Line</span>
                </div>

                <div class="border-pixel-inset" style="padding:10px; background:#111625;">
                  <b style="color:var(--color-success); font-size:0.75rem; font-family:var(--font-press-start);">Q2</b>
                  <div style="margin:4px 0; font-weight:bold;">฿${(raw.q2||0).toLocaleString()}</div>
                  <div style="font-size:0.7rem; color:#64748b;">ทุนอัดฉีด: ฿${(raw.f2||0).toLocaleString()}</div>
                  <b style="font-size:0.8rem; font-family:monospace;" class="${g2.cls}">${g2.text}</b>
                </div>

                <div class="border-pixel-inset" style="padding:10px; background:#111625;">
                  <b style="color:var(--color-secondary); font-size:0.75rem; font-family:var(--font-press-start);">Q3</b>
                  <div style="margin:4px 0; font-weight:bold;">฿${(raw.q3||0).toLocaleString()}</div>
                  <div style="font-size:0.7rem; color:#64748b;">ทุนอัดฉีด: ฿${(raw.f3||0).toLocaleString()}</div>
                  <b style="font-size:0.8rem; font-family:monospace;" class="${g3.cls}">${g3.text}</b>
                </div>

                <div class="border-pixel-inset" style="padding:10px; background:#111625;">
                  <b style="color:var(--color-accent); font-size:0.75rem; font-family:var(--font-press-start);">Q4</b>
                  <div style="margin:4px 0; font-weight:bold;">฿${(raw.q4||0).toLocaleString()}</div>
                  <div style="font-size:0.7rem; color:#64748b;">ทุนอัดฉีด: ฿${(raw.f4||0).toLocaleString()}</div>
                  <b style="font-size:0.8rem; font-family:monospace;" class="${g4.cls}">${g4.text}</b>
                </div>
              </div>
              <div style="background:#0c1020; border:2px solid #000; padding:8px; margin-top:12px; font-size:0.8rem; color:#94a3b8;">
                📌 <b>โน้ตผลการดำเนินงาน:</b> ${raw.notes || 'ไม่มีบันทึกข้อมูลย่อย'}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  openQuarterlyModal(portfolioId, year) {
    const port = this.portfolios.find(p => p.id === portfolioId); if (!port) return;
    document.getElementById('q-port-id').value = portfolioId; 
    document.getElementById('q-year').value = year;
    document.getElementById('q-port-label').innerText = `พอร์ต: ${port.name} (${year})`;
    
    let rec = this.quarterlyRecords.find(r => r.portfolioId === portfolioId && r.year === year) || { q1:0, f1:0, q2:0, f2:0, q3:0, f3:0, q4:0, f4:0, notes:'' };
    document.getElementById('q-val-q1').value = rec.q1 || ''; document.getElementById('q-flow-q1').value = rec.f1 || 0;
    document.getElementById('q-val-q2').value = rec.q2 || ''; document.getElementById('q-flow-q2').value = rec.f2 || 0;
    document.getElementById('q-val-q3').value = rec.q3 || ''; document.getElementById('q-flow-q3').value = rec.f3 || 0;
    document.getElementById('q-val-q4').value = rec.q4 || ''; document.getElementById('q-flow-q4').value = rec.f4 || 0;
    document.getElementById('q-notes').value = rec.notes || '';
    document.getElementById('quarterly-modal').classList.remove('hidden');
  }

  // --- 💎 RENDER 4: OPTION MANUAL ---
  renderOptionManual(container) {
    const optionPorts = this.portfolios.filter(p => p.category === 'Option');
    const records = this.monthlyRecords.filter(r => optionPorts.map(p => p.id).includes(r.portfolioId));

    container.innerHTML = `
      <div class="border-pixel" style="padding:20px; background:#1f273e; box-shadow: 4px 4px 0px #000;">
        <h4 style="font-family:var(--font-press-start); font-size:0.75rem; color:var(--color-accent); margin-bottom:12px;">💎 ระบบบันทึกรายเดือนพอร์ต Option (โหมดจดมือแมนนวล)</h4>
        
        <div style="display:grid; grid-template-columns:1fr 2fr; gap:20px;">
          <div class="border-pixel-inset" style="padding:16px; background:#111625;">
            <div class="form-group" style="margin-bottom:12px;"><label>เลือกพอร์ตออปชัน:</label>
              <select id="opt-port-select" class="input-retro" style="width:100%;">
                ${optionPorts.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
              </select>
            </div>
            <div class="form-group" style="margin-bottom:12px;"><label>เดือนประจำงวด:</label>
              <select id="opt-month-select" class="input-retro" style="width:100%;">
                ${[...Array(12).keys()].map(i => `<option value="${i+1}">เดือน ${i+1}</option>`).join('')}
              </select>
            </div>
            <div class="form-group" style="margin-bottom:16px;"><label>ผลกำไร/ขาดทุนสุทธิ (USD):</label>
              <input type="number" id="opt-pl-input" class="input-retro" placeholder="เช่น 250 หรือ -120" style="width:100%;">
            </div>
            <button class="btn btn-success btn-retro" id="btn-save-opt-manual" style="width:100%;"><span>💾 บันทึกยอดออปชัน</span></button>
          </div>
          
          <div class="border-pixel-inset" style="padding:16px; background:#111625;">
            <h5 style="margin-bottom:10px;">📜 ประวัติการบันทึกงวดสัญญารายเดือน</h5>
            <div style="max-height:300px; overflow-y:auto; font-size:0.85rem;">
              ${records.length === 0 ? '<p class="text-muted">ตลับข้อมูล Option สะอาดเรียบร้อย ไม่มีประวัติ Mock Data ตกค้าง</p>' : records.map(r => {
                const p = this.portfolios.find(port => port.id === r.portfolioId);
                return `
                  <div style="display:flex; justify-content:space-between; border-bottom:1px solid #444; padding:8px 0;">
                    <span><b>${p?p.name:''}</b> (เดือน ${r.month})</span>
                    <b class="${r.profitLossUSD >= 0 ? 'text-success' : 'text-danger'}">${r.profitLossUSD >= 0 ? '+' : ''}$${r.profitLossUSD}</b>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-save-opt-manual').addEventListener('click', () => {
      const pId = document.getElementById('opt-port-select').value;
      const month = Number(document.getElementById('opt-month-select').value);
      const pl = Number(document.getElementById('opt-pl-input').value);
      if (!pId || isNaN(pl)) { alert('❌ กรอกตัวเลขไม่ถูกต้อง'); return; }
      
      this.monthlyRecords.push({ id: 'm-' + Date.now(), portfolioId: pId, year: new Date().getFullYear(), month: month, profitLossUSD: pl, notes: 'บันทึกแมนนวล' });
      this.saveState(); this.refreshUI();
    });
  }

  // --- 💰 RENDER 5: DIVIDENDS ---
  renderDividends(container) {
    container.innerHTML = `
      <div class="border-pixel" style="padding:16px; background:#1f273e; box-shadow: 4px 4px 0px #000;">
        <h4>💰 แดชบอร์ดวิเคราะห์เงินปันผล & Yield on Cost (YOC)</h4>
        <table class="retro-table" style="width:100%; margin-top:12px; text-align:left; border-collapse:collapse;">
          <thead>
            <tr style="background:#111625;">
              <th style="padding:10px; border:2px solid #000;">ชื่อพอร์ต</th>
              <th style="padding:10px; border:2px solid #000;">ต้นทุนปัจจุบัน</th>
              <th style="padding:10px; border:2px solid #000;">ปันผลสะสม</th>
              <th style="padding:10px; border:2px solid #000; color:var(--color-accent);">YOC (%)</th>
            </tr>
          </thead>
          <tbody>
            ${this.portfolios.map(p => {
              const divs = this.dividendRecords ? this.dividendRecords.filter(r => r.portfolioId === p.id).reduce((s, r) => s + Number(r.amount), 0) : 0;
              const yoc = p.current > 0 ? ((divs / p.current) * 100).toFixed(2) + '%' : '0.00%';
              return `<tr><td style="padding:10px; border:2px solid #000;"><b>${p.name}</b></td><td style="padding:10px; border:2px solid #000;">${this.formatMoney(p.current, p.category)}</td><td style="padding:10px; border:2px solid #000; color:var(--color-success)">${this.formatMoney(divs, p.category)}</td><td style="padding:10px; border:2px solid #000; font-weight:bold; color:var(--color-accent);">${yoc}</td></tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // --- 🛡️ RENDER 6: CASH FLOW TRACKER ---
  renderCashFlow(container) {
    const getLiquidityStatus = (p) => {
      const totalCash = p.cashBuffer + p.dryPowder;
      if (p.goalType === 'schedule') {
        if (totalCash > 100000) return { text: '🍀 หล่อเลี้ยงตัวเองได้', cls: 'badge-success', desc: 'มีสภาพคล่องพร้อม DCA ต่อเนื่อง' };
        if (totalCash > 30000) return { text: '⚡ สภาพคล่องนิ่ง', cls: 'badge-warning', desc: 'พอหมุนเวียน แต่อย่าช้อนหนักเกินตัว' };
        return { text: '⚠️ ควรเติมเสบียงด่วน', cls: 'badge-danger', desc: 'เสบียงใกล้หมดกระปุกแล้ว!' };
      }
      const ratio = p.goal > 0 ? totalCash / p.goal : 0;
      if (ratio >= 0.15) return { text: '🍀 หล่อเลี้ยงตัวเองได้', cls: 'badge-success', desc: 'กระแสเงินสดหมุนเวียนเกรดพรีเมียม' };
      if (ratio >= 0.05) return { text: '⚡ สภาพคล่องนิ่ง', cls: 'badge-warning', desc: 'พอเอาตัวรอดได้ชั่วขณะ นิ่งสงบดี' };
      return { text: '⚠️ ควรเติมเสบียงด่วน', cls: 'badge-danger', desc: 'ยอดเงินฉุกเฉินและรอช้อนแห้งแล้ง' };
    };

    const cashflowHTML = `
      <div class="cashflow-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:20px;">
        ${this.portfolios.map(p => {
          const status = getLiquidityStatus(p);
          return `
            <div class="cashflow-card border-pixel" style="background:#1f273e; padding:16px; position:relative; box-shadow: 4px 4px 0px #000;">
              <span class="badge ${status.cls}" style="position:absolute; top:12px; right:12px; font-size:0.75rem; padding:2px 6px;">${status.text}</span>
              <div>
                <h4 style="font-weight:bold; font-size:1.05rem; margin-bottom:4px;">${p.name}</h4>
                <span class="port-card-cat" style="background-color: var(--color-primary); font-size:0.75rem; padding:2px 6px;">${p.category}</span>
              </div>
              <div class="border-pixel-inset" style="padding:12px; margin-top:12px; background:#111625; border:2px solid #000; display:flex; flex-direction:column; gap:6px; font-size:0.85rem;">
                <div style="display:flex; justify-content:space-between;"><span class="label">เงินสำรอง Buffer:</span><span class="value" style="color:var(--color-secondary);">${this.formatMoney(p.cashBuffer, p.category)}</span></div>
                <div style="display:flex; justify-content:space-between;"><span class="label">เงินรอเข้าซื้อ Dry:</span><span class="value" style="color:var(--color-warning);">${this.formatMoney(p.dryPowder, p.category)}</span></div>
                <div style="display:flex; justify-content:space-between; border-top:1px solid #444; padding-top:4px; margin-top:4px;"><span class="label">สภาพคล่องรวม:</span><span class="value" style="color:#fff; font-weight:bold;">${this.formatMoney(p.cashBuffer + p.dryPowder, p.category)}</span></div>
              </div>
              <div style="font-size:0.75rem; color:var(--color-text-muted); text-align:center; font-weight:bold; margin-top:8px;">📢 ${status.desc}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
    container.innerHTML = cashflowHTML;
  }

  // --- ⚖️ RENDER 7: COMPARISON TABLE (ดึงข้อมูลมวลรวมและส่วนต่างเป้าหมายกลับคืนตลับแสดงผลปกติ) ---
  renderComparison(container) {
    const data = this.portfolios.map(p => {
      const isUSD = ['Forex', 'Option'].includes(p.category);
      const rate = isUSD ? this.exchangeRate : 1;
      const totalVal = p.current + p.cashBuffer;
      let diffVal = p.goalType === 'numeric' ? Math.max(p.goal - totalVal, 0) : 0;
      let goalPct = p.goal > 0 ? (totalVal / p.goal) * 100 : 0;

      return {
        name: p.name,
        category: p.category,
        goalText: p.goalType === 'numeric' ? this.formatMoney(p.goal, p.category) : p.goalSchedule,
        currentTHB: totalVal * rate,
        diffTHB: diffVal * rate,
        goalPct: p.goalType === 'numeric' ? goalPct : (p.dcaDoneThisMonth ? 100 : 0),
        cashFlowTHB: (p.cashBuffer + p.dryPowder) * rate
      };
    });

    container.innerHTML = `
      <div class="border-pixel" style="padding:16px; background:#1f273e; box-shadow: 4px 4px 0px #000; overflow-x:auto;">
        <table class="retro-table" style="width:100%; border-collapse:collapse; text-align:left;">
          <thead>
            <tr style="background:#111625;">
              <th style="padding:10px; border:2px solid #000;">ชื่อพอร์ต</th>
              <th style="padding:10px; border:2px solid #000;">ประเภท</th>
              <th style="padding:10px; border:2px solid #000;">เป้าหมายมวลรวม</th>
              <th style="padding:10px; border:2px solid #000;">ยอดปัจจุบัน (THB)</th>
              <th style="padding:10px; border:2px solid #000;">ส่วนต่างที่ขาด (THB)</th>
              <th style="padding:10px; border:2px solid #000; color:var(--color-accent);">% สำเร็จ</th>
              <th style="padding:10px; border:2px solid #000;">กระแสเงินสด (THB)</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(d => `
              <tr>
                <td style="padding:10px; border:2px solid #000;"><b>${d.name}</b></td>
                <td style="padding:10px; border:2px solid #000;"><span class="port-card-cat" style="background:var(--color-primary); font-size:0.7rem; padding:2px 6px;">${d.category}</span></td>
                <td style="padding:10px; border:2px solid #000;">${d.goalText}</td>
                <td style="padding:10px; border:2px solid #000; font-family:monospace;">฿${d.currentTHB.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                <td style="padding:10px; border:2px solid #000; font-family:monospace; color:#ef4444;">${d.diffTHB > 0 ? '฿'+d.diffTHB.toLocaleString(undefined, {maximumFractionDigits:0}) : '✔️ ถึงเป้าหมาย'}</td>
                <td style="padding:10px; border:2px solid #000; font-family:var(--font-press-start); font-size:0.65rem; color:var(--color-success);">${d.goalPct.toFixed(1)}%</td>
                <td style="padding:10px; border:2px solid #000; font-family:monospace; color:var(--color-warning);">฿${d.cashFlowTHB.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // --- ⚙️ RENDER 8: SETTINGS ---
  renderSettings(container) {
    container.innerHTML = `
      <div class="border-pixel" style="padding:20px; display:flex; flex-direction:column; gap:16px; background:#1f273e; box-shadow: 4px 4px 0px #000;">
        <h3>⚙️ ตลับเซฟข้อมูลระบบนิเวศ (Data Sync Management)</h3>
        <p>สถานะเซิร์ฟเวอร์ Cloud: <b>${isFirebaseActive ? '🟢 ออนไลน์ (Realtime Connected)' : '🔴 ออฟไลน์ (Local-Only)'}</b></p>
        <div style="border-top: 2px dashed #444; margin: 8px 0;"></div>
        
        <h4>📥 โหลดฐานข้อมูลเก่า</h4>
        <p style="font-size:0.85rem; color:var(--color-text-muted);">เปิดไฟล์สำรองข้อมูล .json คัดลอกข้อความด้านในมาวางตรงนี้ได้เลย</p>
        <textarea id="import-json-area" class="input-retro" rows="10" style="width:100%; background:#0c1020; color:#10b981; font-family:monospace; padding:12px; border:2px solid #000;" placeholder="วางข้อความข้อมูลดิบ JSON ที่นี่..."></textarea>
        <button class="btn btn-success btn-retro" id="btn-execute-import" style="width:220px; margin-top:8px;">📥 โหลดข้อมูลเก่า</button>
      </div>
    `;

    document.getElementById('btn-execute-import').addEventListener('click', () => {
      const jsonStr = document.getElementById('import-json-area').value.trim();
      if (!jsonStr) { alert('❌ ไม่พบข้อมูลในช่องกรอก'); return; }
      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed.portfolios) {
          this.portfolios = parsed.portfolios;
          this.quarterlyRecords = parsed.quarterlyRecords || [];
          this.monthlyRecords = parsed.monthlyRecords || [];
          this.dividendRecords = parsed.dividendRecords || [];
          this.exchangeRate = Number(parsed.exchangeRate) || 36.5;
          this.saveState(); this.refreshUI();
          alert('🎯 นำเข้าเสร็จสิ้นเรียบร้อยแล้ว ทุกพอร์ตและลูกเล่นกลับคืนมาร้อยเปอร์เซ็นต์!');
        } else { alert('❌ โครงสร้าง JSON ไม่ถูกต้อง'); }
      } catch (e) { alert('❌ ข้อมูลดิบเสียหาย: ' + e.message); }
    });
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
        port.dryPowder = dryPowder; port.notes = notes;
      }
    } else {
      const newPort = {
        id: 'p-' + Date.now(), name, category, startDate, goalType,
        goal: goalType === 'numeric' ? goalVal : 0,
        goalSchedule: goalType === 'schedule' ? goalScheduleVal : '',
        current: 0, cashBuffer: 0, dryPowder, assets: [], notes, dcaDoneThisMonth: false
      };
      this.portfolios.push(newPort);
      this.selectedPortId = newPort.id;
    }
    this.saveState(); this.closeModals(); this.refreshUI();
  }

  handleExecuteTransfer() {
    const srcId = document.getElementById('tf-source').value;
    const destId = document.getElementById('tf-target').value;
    const amount = Number(document.getElementById('tf-amount').value);
    const rate = Number(document.getElementById('tf-rate').value) || this.exchangeRate;

    if (isNaN(amount) || amount <= 0) { alert('❌ ระบุจำนวนเงินที่ถูกต้อง'); return; }
    const srcPort = this.portfolios.find(p => p.id === srcId);
    if (!srcPort || srcPort.dryPowder < amount) { alert('❌ กระสุน Dry Powder ของต้นทางมีไม่เพียงพอ'); return; }

    srcPort.dryPowder -= amount;
    if (destId !== 'system') {
      const destPort = this.portfolios.find(p => p.id === destId);
      if (destPort) {
        const isSourceUSD = ['Forex', 'Option'].includes(srcPort.category);
        const isTargetUSD = ['Forex', 'Option'].includes(destPort.category);
        let convertedAmount = amount;
        if (isSourceUSD && !isTargetUSD) convertedAmount = amount * rate;
        else if (!isSourceUSD && isTargetUSD) convertedAmount = amount / rate;
        destPort.dryPowder += convertedAmount;
      }
    }
    this.saveState(); this.closeModals(); this.refreshUI();
    alert('⚡ โยกย้ายและแปลงทุนกระสุนรอช้อนปลายทางเสร็จสิ้น!');
  }

  openPortfolioModal() { document.getElementById('portfolio-modal').classList.remove('hidden'); }
  openTransferModal() {
    const sourceSelect = document.getElementById('tf-source');
    const targetSelect = document.getElementById('tf-target');
    sourceSelect.innerHTML = this.portfolios.map(p => `<option value="${p.id}">${p.name} (Dry: ${p.dryPowder})</option>`).join('');
    targetSelect.innerHTML = `<option value="system">ถอนออกนอกระบบ</option>` + this.portfolios.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    document.getElementById('tf-rate').value = this.exchangeRate;
    document.getElementById('transfer-modal').classList.remove('hidden');
  }
  closeModals() { document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden')); }
}

window.app = new PixelStewardApp();