/* ==========================================
   PIXEL STEWARD CORE ENGINE - APP.JS
   ========================================== */

// --- INITIAL STATE / MOCK DATA ---
const INITIAL_PORTFOLIOS = [
  { id: '1', name: 'RedWing (กยศ.)', category: 'Cash Buffer & หุ้นย่อย', goalType: 'numeric', goal: 60000, current: 45000, cashBuffer: 15000, dryPowder: 5000, assets: [{ name: 'หุ้นย่อย A', value: 25000 }], startDate: '2025-01-01', notes: 'เน้นสำรองจ่ายและรักษาสภาพคล่อง' },
  { id: '2', name: 'Zero 1 (เงินฉุกเฉิน)', category: 'Emergency', goalType: 'numeric', goal: 95000, current: 90000, cashBuffer: 90000, dryPowder: 0, assets: [], startDate: '2025-01-01', notes: 'เงินสำรองห้ามแตะต้องเว้นแต่จำเป็น' },
  { id: '3', name: 'Zero 2 (รถ)', category: 'Asset', goalType: 'numeric', goal: 1200000, current: 350000, cashBuffer: 50000, dryPowder: 300000, assets: [], startDate: '2025-01-01', notes: 'สะสมดาวน์รถยนต์คันใหม่' },
  { id: '4', name: 'Zero 3 (เกษียณ)', category: 'Retirement', goalType: 'numeric', goal: 4000000, current: 850000, cashBuffer: 100000, dryPowder: 750000, assets: [{ name: 'กองทุนดัชนี', value: 750000 }], startDate: '2025-01-01', notes: 'พอร์ตหลักระยะยาว พลิกฟื้นอิสรภาพ' },
  { id: '5', name: 'Zero 4 (แต่งงาน)', category: 'Life Goal', goalType: 'numeric', goal: 600000, current: 150000, cashBuffer: 30000, dryPowder: 120000, assets: [], startDate: '2025-05-01', notes: 'ทุนแต่งงานในอนาคต' },
  { id: '6', name: 'Zero 5 (บ้าน)', category: 'Asset', goalType: 'numeric', goal: 1500000, current: 200000, cashBuffer: 20000, dryPowder: 180000, assets: [], startDate: '2025-06-01', notes: 'เป้าหมายระยะกลางสำหรับที่อยู่อาศัย' },
  { id: '7', name: 'Dividend Yield (หุ้นโลก)', category: 'Global Stock', goalType: 'numeric', goal: 300000, current: 120000, cashBuffer: 20000, dryPowder: 100000, assets: [{ name: 'ETF โลก', value: 100000 }], startDate: '2025-02-01', notes: 'ปันผลสม่ำเสมอ ลดความเสี่ยงค่าเงิน' },
  { id: '8', name: 'THAI Dividend (หุ้นไทย)', category: 'Thai Stock', goalType: 'numeric', goal: 100000, current: 65000, cashBuffer: 10000, dryPowder: 55000, assets: [{ name: 'หุ้นปันผลไทย', value: 55000 }], startDate: '2025-01-15', notes: 'เน้นกระแสเงินสดจากปันผลในประเทศ' },
  { id: '9', name: 'NEXT GEN (หุ้นเติบโต)', category: 'Growth Stock', goalType: 'schedule', goalSchedule: 'DCA ทุกวันที่ 25', current: 4500000, cashBuffer: 500000, dryPowder: 4000000, assets: [{ name: 'Tech Growth', value: 4000000 }], startDate: '2025-03-01', notes: 'พอร์ตซิ่ง ดุดัน ไม่เกรงใจใคร โตระยะยาว', dcaDoneThisMonth: true },
  { id: '10', name: 'FOREX LIFE', category: 'Forex', goalType: 'numeric', goal: 50000, current: 12500, cashBuffer: 2500, dryPowder: 10000, assets: [], startDate: '2025-01-01', notes: 'เทรดกระแสเงินสดรายเดือน ดอลลาร์สหรัฐ' },
  { id: '11', name: 'FOREX RISK', category: 'Forex', goalType: 'numeric', goal: 20000, current: 5200, cashBuffer: 1200, dryPowder: 4000, assets: [], startDate: '2025-01-01', notes: 'พอร์ตเสี่ยงสูง ปั้นพอร์ตคูณเท่า' },
  { id: '12', name: 'OPTION (เก็งกำไรค่าเงิน)', category: 'Option', goalType: 'numeric', goal: 30000, current: 8900, cashBuffer: 1900, dryPowder: 7000, assets: [], startDate: '2025-02-01', notes: 'ใช้กลยุทธ์ออปชั่นในการ Hedging และทำกำไร' }
];

const INITIAL_QUARTERLY_RECORDS = [
  // Year 2025 Records
  { id: 'q-1', portfolioId: '4', year: 2025, q1: 600000, q2: 680000, q3: 750000, q4: 820000, notes: 'ภาพรวมพอร์ตเกษียณเติบโตขึ้นตามเป้าหมาย' },
  { id: 'q-2', portfolioId: '7', year: 2025, q1: 90000, q2: 100000, q3: 110000, q4: 118000, notes: 'ปันผลสะสมต่อเนื่อง ได้รับอานิสงส์จากหุ้นกลุ่มการเงินโลก' },
  { id: 'q-3', portfolioId: '8', year: 2025, q1: 50000, q2: 55000, q3: 58000, q4: 62000, notes: 'สภาวะตลาดไทยค่อนข้างผันผวนแต่ปันผลยังคงสม่ำเสมอ' },
  { id: 'q-4', portfolioId: '9', year: 2025, q1: 3000000, q2: 3500000, q3: 4000000, q4: 4300000, notes: 'DCA หุ้นเทคฯ อย่างเข้มงวดทุกวันที่ 25' }
];

const INITIAL_MONTHLY_RECORDS = [
  // Forex/Option profit & loss in USD
  // 2025 Monthly P/L
  { id: 'm-1', portfolioId: '10', year: 2025, month: 10, profitLossUSD: 450, notes: 'เทรดคู่ EURUSD รันเทรนดสวยงาม' },
  { id: 'm-2', portfolioId: '10', year: 2025, month: 11, profitLossUSD: 520, notes: 'ตลาดเคลื่อนไหวตามกรอบ Sideway' },
  { id: 'm-3', portfolioId: '10', year: 2025, month: 12, profitLossUSD: -120, notes: 'มีโดน Stop Loss ปลายปีเนื่องจากปริมาณการซื้อขายเบาบาง' },
  
  { id: 'm-4', portfolioId: '11', year: 2025, month: 10, profitLossUSD: 180, notes: 'เทรดทองคำ (XAUUSD) เสี่ยงสูง' },
  { id: 'm-5', portfolioId: '11', year: 2025, month: 11, profitLossUSD: -90, notes: 'ล้างพอร์ทย่อยบางส่วนแต่กู้คืนมาได้' },
  { id: 'm-6', portfolioId: '11', year: 2025, month: 12, profitLossUSD: 310, notes: 'ได้ไม้สไนเปอร์ช่วง FOMC' },
  
  { id: 'm-7', portfolioId: '12', year: 2025, month: 10, profitLossUSD: 280, notes: 'Hedging ค่าเงินด้วย Option' },
  { id: 'm-8', portfolioId: '12', year: 2025, month: 11, profitLossUSD: 340, notes: 'กลยุทธ์ Iron Condor ได้พรีเมียมเต็ม' },
  { id: 'm-9', portfolioId: '12', year: 2025, month: 12, profitLossUSD: -80, notes: 'โดนสควีซช่วงสิ้นปี' }
];

// --- CORE APP CLASS / CONTROLLER ---
class PixelStewardApp {
  constructor() {
    this.portfolios = [];
    this.quarterlyRecords = [];
    this.monthlyRecords = [];
    this.exchangeRate = 36.5;
    this.activeTab = 'dashboard';
    this.selectedPortId = '1';
    
    // Sorting state for Comparison Table
    this.sortKey = 'goalPct';
    this.sortAsc = false;
    
    this.init();
  }

  init() {
    // Load from localstorage or use defaults
    const storedPorts = localStorage.getItem('ps_portfolios_v2');
    const storedQuarters = localStorage.getItem('ps_quarterly_v2');
    const storedMonthlies = localStorage.getItem('ps_monthly_v2');
    const storedRate = localStorage.getItem('ps_ex_rate_v2');

    this.portfolios = storedPorts ? JSON.parse(storedPorts) : INITIAL_PORTFOLIOS;
    this.quarterlyRecords = storedQuarters ? JSON.parse(storedQuarters) : INITIAL_QUARTERLY_RECORDS;
    this.monthlyRecords = storedMonthlies ? JSON.parse(storedMonthlies) : INITIAL_MONTHLY_RECORDS;
    this.exchangeRate = storedRate ? Number(storedRate) : 36.5;

    // Set UI Exchange Rate Input
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

    // Attach Header Actions
    document.getElementById('btn-add-portfolio').addEventListener('click', () => this.openPortfolioModal());
    document.getElementById('btn-quick-transfer').addEventListener('click', () => this.openTransferModal());

    // Attach Sidebar Tabs Click Handlers
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

    // Attach Modal Close Handlers
    document.querySelectorAll('.btn-close-modal').forEach(btn => {
      btn.addEventListener('click', () => this.closeModals());
    });

    // Portfolio Form Submission
    document.getElementById('portfolio-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSavePortfolio();
    });

    // Transfer Form Submission
    document.getElementById('transfer-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleExecuteTransfer();
    });

    // Handle portfolio goal type selection toggle in modal
    const goalTypeSelect = document.getElementById('port-goal-type');
    const valInput = document.getElementById('port-goal-value');
    const valInputContainer = document.getElementById('port-goal-value-container');
    const schInput = document.getElementById('port-goal-schedule');
    const label = document.getElementById('port-goal-label');

    goalTypeSelect.addEventListener('change', () => {
      if (goalTypeSelect.value === 'numeric') {
        label.innerText = 'เป้าหมาย (จำนวนเงิน):';
        valInput.classList.remove('hidden');
        valInput.required = true;
        schInput.classList.add('hidden');
        schInput.required = false;
      } else {
        label.innerText = 'เป้าหมาย (ตารางเวลา):';
        valInput.classList.add('hidden');
        valInput.required = false;
        schInput.classList.remove('hidden');
        schInput.required = true;
      }
    });

    // Render initially
    this.refreshUI();
  }

  saveState() {
    localStorage.setItem('ps_portfolios_v2', JSON.stringify(this.portfolios));
    localStorage.setItem('ps_quarterly_v2', JSON.stringify(this.quarterlyRecords));
    localStorage.setItem('ps_monthly_v2', JSON.stringify(this.monthlyRecords));
    localStorage.setItem('ps_ex_rate_v2', this.exchangeRate.toString());
  }

  refreshUI() {
    const tabContent = document.getElementById('tab-content');
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
    
    // Clear content
    tabContent.innerHTML = '';
    
    // Routing renderer
    switch (this.activeTab) {
      case 'dashboard':
        pageTitle.innerText = 'แดชบอร์ดภาพรวม';
        pageSubtitle.innerText = 'สรุปขุมทรัพย์และความมั่งคั่งของพอร์ตทั้งหมดใน 5 วินาที';
        this.renderDashboard(tabContent);
        break;
      case 'portfolios':
        pageTitle.innerText = 'พอร์ตการลงทุน';
        pageSubtitle.innerText = 'ดูรายละเอียด จัดสรรเงินลงทุนรายสินทรัพย์ และวางแผนสภาพคล่อง';
        this.renderPortfolios(tabContent);
        break;
      case 'quarterly':
        pageTitle.innerText = 'สรุปหุ้นรายไตรมาส';
        pageSubtitle.innerText = 'ติดตามผลการดำเนินงานกองทุนและหุ้นรายไตรมาส แยกตามปีปฏิทิน';
        this.renderQuarterly(tabContent);
        break;
      case 'forex':
        pageTitle.innerText = 'บันทึก Forex รายเดือน';
        pageSubtitle.innerText = 'จดบันทึกกระแสเงินสดรายเดือนจากการเทรดคู่สกุลเงินสไตล์เรโทร (USD)';
        this.renderForexOption(tabContent, 'Forex');
        break;
      case 'option':
        pageTitle.innerText = 'บันทึก Option รายเดือน';
        pageSubtitle.innerText = 'บันทึกผลกำไรขาดทุนรายเดือนสำหรับการ Hedging ค่าเงินและเก็งกำไร (USD)';
        this.renderForexOption(tabContent, 'Option');
        break;
      case 'cashflow':
        pageTitle.innerText = 'ตัวช่วยติดตามสภาพคล่อง';
        pageSubtitle.innerText = 'เปรียบเทียบเสบียงสำรอง Cash Buffer และเงินสดรอจังหวะช้อน Dry Powder';
        this.renderCashFlow(tabContent);
        break;
      case 'comparison':
        pageTitle.innerText = 'ตารางเปรียบเทียบเติบโต';
        pageSubtitle.innerText = 'ข้อมูลมวลรวมและส่วนต่างเป้าหมาย นำมาประเมินเปรียบเทียบในตารางเดียว';
        this.renderComparison(tabContent);
        break;
      case 'settings':
        pageTitle.innerText = 'ตั้งค่า & สำรองข้อมูล';
        pageSubtitle.innerText = 'จัดการสำรองข้อมูลพอร์ตด้วยระบบ Import/Export หรือล้างตลับเซฟเริ่มใหม่';
        this.renderSettings(tabContent);
        break;
    }
  }

  // --- GENERAL TOAST NOTIFICATION ---
  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast border-pixel`;
    
    let icon = '🔔';
    if (type === 'success') icon = '🎯';
    if (type === 'error') icon = '💥';
    if (type === 'level') icon = '👑';
    
    toast.innerHTML = `<span style="font-size:1.5rem">${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideIn 0.2s reverse forwards';
      setTimeout(() => toast.remove(), 200);
    }, 3000);
  }

  closeModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
  }

  // --- FINANCIAL CALCULATION ENGINE ---
  getCalculations() {
    let totalTHB = 0;
    let totalUSD = 0;
    let totalCashBufferTHB = 0;
    let totalDryPowderTHB = 0;
    
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

    const netWorthTHB = totalTHB + (totalUSD * this.exchangeRate);
    const netWorthUSD = netWorthTHB / this.exchangeRate;
    const totalLiquidityTHB = totalCashBufferTHB + totalDryPowderTHB;

    return {
      netWorthTHB,
      netWorthUSD,
      totalTHB,
      totalUSD,
      totalCashBufferTHB,
      totalDryPowderTHB,
      totalLiquidityTHB
    };
  }

  // Helper: Get Portfolio Level based on goals
  getPortfolioLevel(p) {
    if (p.goalType === 'schedule') {
      return {
        icon: p.dcaDoneThisMonth ? '🔥' : '⏳',
        label: p.dcaDoneThisMonth ? 'DCA เดือนนี้เรียบร้อย' : 'รอบรรลุการ DCA',
        desc: 'สะสมแต้มพลังบวกรายสัปดาห์/เดือน',
        pct: p.dcaDoneThisMonth ? 100 : 0
      };
    }
    
    const pct = p.goal > 0 ? (p.current / p.goal) * 100 : 0;
    
    // Categorize by name keywords or categories
    const nameLower = p.name.toLowerCase();
    
    if (nameLower.includes('บ้าน') || nameLower.includes('house') || nameLower.includes('zero 5')) {
      if (pct >= 80) return { icon: '🏰', label: 'วิหารทองคำ', desc: 'ปลดล็อกสกินขอบทองขั้นสุดยอด!', pct };
      if (pct >= 40) return { icon: '🏡', label: 'บ้านเดี่ยวโมเดิร์น', desc: 'ฐานรากมั่นคง คอนกรีตเสริมเหล็ก', pct };
      return { icon: '⛺', label: 'กระต๊อบแคมป์ปิ้ง', desc: 'เพิ่งปักหลักเข็มเสร็จเลเวล 1', pct };
    }
    
    if (nameLower.includes('รถ') || nameLower.includes('car') || nameLower.includes('zero 2')) {
      if (pct >= 80) return { icon: '🏎️', label: 'Hypercar เทอร์โบไนตรัส', desc: 'ซิ่งแซงหน้าความจน!', pct };
      if (pct >= 40) return { icon: '🚗', label: 'Sedan ไฟฟ้ารักษ์โลก', desc: 'เดินทางอุ่นใจสไตล์ครอบครัว', pct };
      return { icon: '🚲', label: 'จักรยานสามล้อเก๋าๆ', desc: 'เริ่มปั่นชิวสะสมไมล์', pct };
    }
    
    if (nameLower.includes('แต่งงาน') || nameLower.includes('wedding') || nameLower.includes('zero 4')) {
      if (pct >= 80) return { icon: '👑', label: 'ราชาภิเษกหวานชื่น', desc: 'งานแต่งในฝันดั่งนิยายกรีก', pct };
      if (pct >= 40) return { icon: '💍', label: 'แหวนเพชรเม็ดงามสลักลาย', desc: 'เควสหัวใจเริ่มสว่างสดใส', pct };
      return { icon: '🌸', label: 'ช่อดอกไม้วาเลนไทน์', desc: 'จุดเริ่มต้นความสัมพันธ์ที่งดงาม', pct };
    }
    
    if (nameLower.includes('เกษียณ') || nameLower.includes('retirement') || nameLower.includes('zero 3')) {
      if (pct >= 80) return { icon: '🏛️', label: 'วิหารทวยเทพโอลิมปัส', desc: 'เสถียรสถาพร นั่งชิวสวรรค์ชั้นฟ้า', pct };
      if (pct >= 40) return { icon: '🔱', label: 'ป้อมปราการคุ้มกันตัวเลข', desc: 'สร้างกองทุนรับเงินปันผลรายสัปดาห์', pct };
      return { icon: '🪵', label: 'เก้าอี้โยกหน้าเตาผิง', desc: 'สะสมฟืนรอความอบอุ่นยามชรา', pct };
    }

    // Default portfolio levels
    if (pct >= 80) return { icon: '⚔️', label: 'มหาอัศวินขุมทรัพย์', desc: 'กองทัพการเงินมีกำลังมหาศาล!', pct };
    if (pct >= 40) return { icon: '🛡️', label: 'นักรบพิทักษ์เหรียญ', desc: 'มีโล่ป้องกัน ความเสี่ยงล้นลดลง', pct };
    return { icon: '🐣', label: 'มอนสเตอร์เลเวล 1', desc: 'กำลังฝึกฝนวิทยายุทธ์ฟาร์มเงินสด', pct };
  }

  // Helper: Format Numbers
  formatMoney(val, category) {
    const isUSD = ['Forex', 'Option'].includes(category);
    const prefix = isUSD ? '$' : '฿';
    return prefix + Number(val).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  // --- RENDER 1: DASHBOARD OVERVIEW ---
  renderDashboard(container) {
    const calc = this.getCalculations();
    
    // Find interesting portfolios
    const portsWithNumericGoals = this.portfolios.filter(p => p.goalType === 'numeric' && p.goal > 0);
    const portsWithSchedules = this.portfolios.filter(p => p.goalType === 'schedule');
    
    // Sort closest to goal
    const sortedByGoal = [...portsWithNumericGoals].sort((a, b) => (b.current / b.goal) - (a.current / a.goal));
    const closestToGoal = sortedByGoal[0];
    
    // Top Liquid Cash Flow port (highest cashBuffer + dryPowder)
    const sortedByCash = [...this.portfolios].sort((a, b) => (b.cashBuffer + b.dryPowder) - (a.cashBuffer + a.dryPowder));
    const highestCashPort = sortedByCash[0];

    // Calc monthly Forex/Option profits for this month (current year & month based on real time)
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // 1-indexed
    
    const forexOptionIds = this.portfolios.filter(p => ['Forex', 'Option'].includes(p.category)).map(p => p.id);
    const monthPL = this.monthlyRecords
      .filter(r => r.year === currentYear && r.month === currentMonth && forexOptionIds.includes(r.portfolioId))
      .reduce((a, c) => a + c.profitLossUSD, 0);

    const dashboardHTML = `
      <!-- Stat Cards -->
      <div class="dashboard-grid">
        <div class="stat-card border-pixel" style="--card-accent-color: var(--color-accent)">
          <div class="stat-header">
            <span class="stat-title">คลังมหาสมบัติสุทธิ</span>
            <span class="stat-icon">👑</span>
          </div>
          <div class="stat-value text-accent">฿${calc.netWorthTHB.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div class="stat-desc">ประมาณ $${calc.netWorthUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD (อัตรา ฿${this.exchangeRate})</div>
        </div>

        <div class="stat-card border-pixel" style="--card-accent-color: var(--color-success)">
          <div class="stat-header">
            <span class="stat-title">สภาพคล่องรอช้อน (Dry/Buffer)</span>
            <span class="stat-icon">💧</span>
          </div>
          <div class="stat-value text-success">฿${calc.totalLiquidityTHB.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div class="stat-desc">Buffer: ฿${calc.totalCashBufferTHB.toLocaleString(undefined, { maximumFractionDigits: 0 })} | Dry: ฿${calc.totalDryPowderTHB.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        </div>

        <div class="stat-card border-pixel" style="--card-accent-color: var(--color-info)">
          <div class="stat-header">
            <span class="stat-title">กำไรเก็งกำไรเดือนนี้</span>
            <span class="stat-icon">💱</span>
          </div>
          <div class="stat-value ${monthPL >= 0 ? 'text-success' : 'text-danger'}">
            ${monthPL >= 0 ? '+' : ''}$${monthPL.toLocaleString()}
          </div>
          <div class="stat-desc">ยอด Forex & Option ของเดือน ${currentMonth}/${currentYear} (USD)</div>
        </div>
      </div>

      <!-- Highlights Section -->
      <div class="dashboard-grid" style="grid-template-columns: 1fr 1fr">
        <!-- Highlights Box -->
        <div class="border-pixel" style="padding:20px;">
          <h4 style="font-family:var(--font-press-start); font-size:0.85rem; color:var(--color-accent); margin-bottom:16px;">🏆 มหาสงครามแย่งชิงความสำเร็จ</h4>
          <div style="display:flex; flex-direction:column; gap:16px;">
            ${closestToGoal ? `
              <div class="border-pixel-inset" style="padding:12px; display:flex; align-items:center; gap:12px;">
                <span style="font-size:2rem">🚩</span>
                <div>
                  <div style="font-size:0.75rem; font-family:var(--font-press-start); color:var(--color-primary-light);">ใกล้เป้าหมายมากที่สุด</div>
                  <div style="font-weight:bold">${closestToGoal.name}</div>
                  <div style="font-size:0.85rem">${(closestToGoal.current/closestToGoal.goal*100).toFixed(1)}% ถึงเป้าหมาย (${this.formatMoney(closestToGoal.current, closestToGoal.category)} / ${this.formatMoney(closestToGoal.goal, closestToGoal.category)})</div>
                </div>
              </div>
            ` : ''}

            ${highestCashPort ? `
              <div class="border-pixel-inset" style="padding:12px; display:flex; align-items:center; gap:12px;">
                <span style="font-size:2rem">💰</span>
                <div>
                  <div style="font-size:0.75rem; font-family:var(--font-press-start); color:var(--color-success);">สภาพคล่องสูงสุด (Cash Flow)</div>
                  <div style="font-weight:bold">${highestCashPort.name}</div>
                  <div style="font-size:0.85rem">สภาพคล่องสะสม: ${this.formatMoney(highestCashPort.cashBuffer + highestCashPort.dryPowder, highestCashPort.category)}</div>
                </div>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- System Summary Stats -->
        <div class="border-pixel" style="padding:20px; display:flex; flex-direction:column; justify-content:space-between;">
          <h4 style="font-family:var(--font-press-start); font-size:0.85rem; color:var(--color-accent); margin-bottom:12px;">📊 สรุปพอร์ตรวมระบบ</h4>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <div class="port-row"><span class="label">พอร์ตสกุลเงินบาท (THB):</span><span class="value" style="color:var(--color-info)">฿${calc.totalTHB.toLocaleString()}</span></div>
            <div class="port-row"><span class="label">พอร์ตเก็งกำไร USD (Forex/Option):</span><span class="value" style="color:var(--color-success)">$${calc.totalUSD.toLocaleString()} USD</span></div>
            <div class="port-row"><span class="label">มูลค่าแปลงพอร์ต USD เป็น THB:</span><span class="value">฿${(calc.totalUSD * this.exchangeRate).toLocaleString()}</span></div>
            <div class="port-row"><span class="label">สัดส่วนเงินสด/พอร์ตรวม:</span><span class="value">${((calc.totalLiquidityTHB / calc.netWorthTHB)*100).toFixed(1)}%</span></div>
          </div>
          <div style="margin-top:16px;">
            <button class="btn btn-primary btn-retro btn-small" id="btn-dashboard-to-ports" style="width:100%">🔍 ตรวจสอบพอร์ตทั้งหมดอย่างละเอียด</button>
          </div>
        </div>
      </div>

      <!-- Quick Portfolio Progress Grid -->
      <div class="section-header">
        <h3>🥇 ระดับพอร์ตลงทุนปัจจุบัน</h3>
      </div>
      <div class="portfolio-grid">
        ${this.portfolios.map(p => {
          const lvl = this.getPortfolioLevel(p);
          const color = p.category === 'Forex' ? 'var(--cat-forex)' : p.category === 'Option' ? 'var(--cat-option)' : 'var(--color-primary-light)';
          
          return `
            <div class="port-card border-pixel" data-id="${p.id}">
              <div class="port-card-header">
                <div>
                  <div class="port-card-title">${p.name}</div>
                  <span class="port-card-cat" style="background-color: var(--cat-${p.category.toLowerCase().replace(/[^a-z0-9]/g, '')}, var(--color-primary))">${p.category}</span>
                </div>
                <div style="font-size:1.8rem; filter: drop-shadow(1px 1px 0px #000);">${lvl.icon}</div>
              </div>
              
              <div class="port-card-body">
                <div class="port-row">
                  <span class="label">เงินสะสม:</span>
                  <span class="value">${this.formatMoney(p.current, p.category)}</span>
                </div>
                <div class="port-row">
                  <span class="label">เป้าหมาย:</span>
                  <span class="value">${p.goalType === 'numeric' ? this.formatMoney(p.goal, p.category) : p.goalSchedule}</span>
                </div>
                
                <!-- Custom progress bar -->
                <div class="progress-container">
                  <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${Math.min(100, lvl.pct)}%; --fill-color: ${color}"></div>
                    <div class="progress-text-overlay">${lvl.pct.toFixed(0)}%</div>
                  </div>
                </div>
                
                <div style="font-size:0.75rem; color:var(--color-text-muted); margin-top:4px; text-align:center; font-weight:bold;">
                  ${lvl.label}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    container.innerHTML = dashboardHTML;

    // Attach click events to portfolio cards to open detail
    container.querySelectorAll('.port-card').forEach(card => {
      card.addEventListener('click', () => {
        this.selectedPortId = card.dataset.id;
        this.activeTab = 'portfolios';
        
        // Update active tab on sidebar
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

    const portfoliosHTML = `
      <div class="portfolio-detail-container">
        <!-- Main Details Card -->
        <div class="detail-main-card border-pixel">
          <div class="detail-header-row">
            <div>
              <span class="port-card-cat" style="background-color: var(--cat-${activePort.category.toLowerCase().replace(/[^a-z0-9]/g, '')}, var(--color-primary))">${activePort.category}</span>
              <h3 style="margin-top:6px;">${activePort.name}</h3>
            </div>
            
            <div class="detail-actions">
              <button class="btn btn-secondary btn-retro btn-small" id="btn-edit-port-detail">✏️ แก้ไขข้อมูลพอร์ต</button>
              <button class="btn btn-danger btn-retro btn-small" id="btn-delete-port-detail">💥 ลบพอร์ต</button>
            </div>
          </div>

          <!-- Quick Stats Grid inside Detail -->
          <div class="details-grid-stats">
            <div class="detail-stat-box">
              <span class="label">เป้าหมายพอร์ต:</span>
              <span class="value text-accent">${activePort.goalType === 'numeric' ? this.formatMoney(activePort.goal, activePort.category) : activePort.goalSchedule}</span>
            </div>
            <div class="detail-stat-box">
              <span class="label">ยอดลงทุนปัจจุบัน:</span>
              <span class="value text-success">${this.formatMoney(activePort.current, activePort.category)}</span>
            </div>
            <div class="detail-stat-box">
              <span class="label">สภาพคล่องรอช้อน (Dry Powder):</span>
              <span class="value" style="color:var(--color-primary-light);">${this.formatMoney(activePort.dryPowder, activePort.category)}</span>
            </div>
          </div>

          <!-- Goal Progress -->
          <div>
            <div class="progress-label-row">
              <span style="font-weight:bold;">สเกลความก้าวหน้าเควส:</span>
              <span style="font-family:var(--font-press-start); font-size:0.75rem;">${lvl.pct.toFixed(1)}%</span>
            </div>
            <div class="progress-bar-bg" style="height:24px;">
              <div class="progress-bar-fill" style="width: ${Math.min(100, lvl.pct)}%; --fill-color: var(--color-success)"></div>
              <div class="progress-text-overlay" style="font-size:0.85rem">${lvl.pct.toFixed(0)}% ถึงเป้าหมาย</div>
            </div>
          </div>

          <!-- Portfolio Checklist for Schedule Goals -->
          ${activePort.goalType === 'schedule' ? `
            <div class="border-pixel-inset" style="padding:12px; display:flex; align-items:center; justify-content:between; background-color:#1a2238;">
              <div style="display:flex; align-items:center; gap:8px;">
                <input type="checkbox" id="chk-dca-status" style="width:20px; height:20px; cursor:pointer;" ${activePort.dcaDoneThisMonth ? 'checked' : ''}>
                <label for="chk-dca-status" style="font-weight:bold; cursor:pointer;">ทำ DCA ประจำเดือนนี้แล้ว (${activePort.goalSchedule})</label>
              </div>
              <span class="badge ${activePort.dcaDoneThisMonth ? 'badge-success' : 'badge-warning'}">
                ${activePort.dcaDoneThisMonth ? '⚡ เสร็จสิ้น' : '⏳ รอทำรายการ'}
              </span>
            </div>
          ` : ''}

          <!-- Minor Assets Table -->
          <div class="assets-section">
            <div style="display:flex; justify-content:between; align-items:center; border-bottom: 2px solid #000; padding-bottom:6px;">
              <h4 style="font-family:var(--font-press-start); font-size:0.75rem;">💼 สินทรัพย์ย่อย / หุ้นในพอร์ต</h4>
              <button class="btn btn-primary btn-retro btn-small" id="btn-add-asset">➕ เพิ่มสินทรัพย์ย่อย</button>
            </div>
            
            <div class="assets-list">
              ${activePort.assets.length === 0 ? `
                <p class="text-muted" style="text-align:center; padding:12px;">ไม่มีสินทรัพย์ย่อยยึดพอร์ตไว้ กรุณากดเพิ่มด้านบนเพื่อติดตามรายสินทรัพย์</p>
              ` : activePort.assets.map((a, index) => `
                <div class="asset-item">
                  <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:1.2rem;">💎</span>
                    <div>
                      <div style="font-weight:bold">${a.name}</div>
                      <div style="font-size:0.8rem; color:var(--color-text-muted);">มูลค่า: ${this.formatMoney(a.value, activePort.category)}</div>
                    </div>
                  </div>
                  <div class="asset-actions">
                    <button class="btn btn-secondary btn-retro btn-small" onclick="app.editAsset('${activePort.id}', ${index})">✏️</button>
                    <button class="btn btn-danger btn-retro btn-small" onclick="app.deleteAsset('${activePort.id}', ${index})">✖</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Notes Area -->
          <div class="notes-section">
            <h4 style="font-family:var(--font-press-start); font-size:0.75rem; border-bottom: 2px solid #000; padding-bottom:6px;">📝 บันทึกความจำเสบียง</h4>
            <textarea id="active-port-notes" class="notes-area" rows="4" placeholder="บันทึกข้อความจำประจำพอร์ต...">${activePort.notes || ''}</textarea>
            <button class="btn btn-success btn-retro btn-small" id="btn-save-notes" style="align-self:flex-end;">💾 บันทึกโน้ต</button>
          </div>
        </div>

        <!-- Side Widget Column -->
        <div class="detail-side-column">
          <!-- Level Widget -->
          <div class="widget-card border-pixel">
            <h4>🏅 ระดับของพอร์ต</h4>
            <div class="level-widget">
              <div class="level-icon">${lvl.icon}</div>
              <div class="level-title">${lvl.label}</div>
              <div class="level-desc">${lvl.desc}</div>
            </div>
          </div>

          <!-- Select Port Widget -->
          <div class="widget-card border-pixel">
            <h4>📁 เลือกเปลี่ยนพอร์ต</h4>
            <div class="input-retro-group">
              <select id="select-active-port" class="input-retro" style="width:100%;">
                ${this.portfolios.map(p => `<option value="${p.id}" ${p.id === activePort.id ? 'selected' : ''}>${p.name}</option>`).join('')}
              </select>
            </div>
          </div>

          <!-- Balance Update Widget -->
          <div class="widget-card border-pixel">
            <h4>💰 อัปเดตยอดคงคลัง</h4>
            <form id="update-balance-form">
              <div class="input-retro-group">
                <label>เงินในพอร์ตรวมจริง (${isUSD ? 'USD' : 'THB'}):</label>
                <input type="number" id="update-current" class="input-retro" value="${activePort.current}" required>
              </div>
              <div class="input-retro-group">
                <label>ในนั้นเป็นสำรอง Buffer:</label>
                <input type="number" id="update-buffer" class="input-retro" value="${activePort.cashBuffer}" required>
              </div>
              <div class="input-retro-group">
                <label>ในนั้นเป็นเงินช้อน Dry:</label>
                <input type="number" id="update-dry" class="input-retro" value="${activePort.dryPowder}" required>
              </div>
              <button type="submit" class="btn btn-success btn-retro" style="width:100%; margin-top:8px;">💾 บันทึกยอดกระปุกเซฟ</button>
            </form>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = portfoliosHTML;

    // Attach Active Select Change
    document.getElementById('select-active-port').addEventListener('change', (e) => {
      this.selectedPortId = e.target.value;
      this.refreshUI();
    });

    // Save Notes Action
    document.getElementById('btn-save-notes').addEventListener('click', () => {
      const notesVal = document.getElementById('active-port-notes').value;
      const port = this.portfolios.find(p => p.id === activePort.id);
      if (port) {
        port.notes = notesVal;
        this.saveState();
        this.showToast('📝 อัปเดตบันทึกเสร็จสิ้น!');
      }
    });

    // Toggle DCA status checklist
    const dcaStatusCheckbox = document.getElementById('chk-dca-status');
    if (dcaStatusCheckbox) {
      dcaStatusCheckbox.addEventListener('change', (e) => {
        const port = this.portfolios.find(p => p.id === activePort.id);
        if (port) {
          port.dcaDoneThisMonth = e.target.checked;
          this.saveState();
          this.refreshUI();
          this.showToast(port.dcaDoneThisMonth ? '⚡ ทำ DCA ประจำเดือนนี้เสร็จแล้ว!' : '⏳ ยกเลิกสถานะ DCA เดือนนี้');
        }
      });
    }

    // Update Balance Submit
    document.getElementById('update-balance-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const curr = Number(document.getElementById('update-current').value);
      const buff = Number(document.getElementById('update-buffer').value);
      const dry = Number(document.getElementById('update-dry').value);
      
      const port = this.portfolios.find(p => p.id === activePort.id);
      if (port) {
        port.current = curr;
        port.cashBuffer = buff;
        port.dryPowder = dry;
        
        // Auto-calculate sum of assets if sum exceeds or they just want to record it
        this.saveState();
        this.refreshUI();
        this.showToast('🎯 อัปเดตเงินในตลับเซฟเรียบร้อย!');
      }
    });

    // Edit Port Detail Modal
    document.getElementById('btn-edit-port-detail').addEventListener('click', () => {
      this.openPortfolioModal(activePort);
    });

    // Delete Port
    document.getElementById('btn-delete-port-detail').addEventListener('click', () => {
      if (confirm(`💥 คุณต้องการลบพอร์ต ${activePort.name} หรือไม่? ข้อมูลสินทรัพย์และประวัติในพอร์ตนี้จะหายไปถาวร`)) {
        this.portfolios = this.portfolios.filter(p => p.id !== activePort.id);
        this.saveState();
        
        // Find next port
        if (this.portfolios.length > 0) {
          this.selectedPortId = this.portfolios[0].id;
        }
        
        this.refreshUI();
        this.showToast('💥 ลบพอร์ตสำเร็จ!', 'error');
      }
    });

    // Add Asset Button Modal (uses Javascript prompt for simplicity and quick data entry)
    document.getElementById('btn-add-asset').addEventListener('click', () => {
      const assetName = prompt('➕ กรอกชื่อสินทรัพย์ย่อย/หุ้น:');
      if (assetName) {
        const assetValue = Number(prompt(`กรอกมูลค่าสินทรัพย์ (${isUSD ? 'USD' : 'THB'}):`));
        if (!isNaN(assetValue) && assetValue >= 0) {
          const port = this.portfolios.find(p => p.id === activePort.id);
          if (port) {
            port.assets.push({ name: assetName, value: assetValue });
            this.saveState();
            this.refreshUI();
            this.showToast(`➕ เพิ่มสินทรัพย์ ${assetName} สำเร็จ!`);
          }
        } else {
          alert('❌ จำนวนเงินไม่ถูกต้อง');
        }
      }
    });
  }

  // --- ACTIONS FOR ASSETS ---
  editAsset(portId, index) {
    const port = this.portfolios.find(p => p.id === portId);
    if (port && port.assets[index]) {
      const asset = port.assets[index];
      const isUSD = ['Forex', 'Option'].includes(port.category);
      const newName = prompt('แก้ไขชื่อสินทรัพย์ย่อย:', asset.name);
      if (newName) {
        const newVal = Number(prompt(`แก้ไขมูลค่าสินทรัพย์ (${isUSD ? 'USD' : 'THB'}):`, asset.value));
        if (!isNaN(newVal) && newVal >= 0) {
          asset.name = newName;
          asset.value = newVal;
          this.saveState();
          this.refreshUI();
          this.showToast('✏️ แก้ไขสินทรัพย์ย่อยเรียบร้อย!');
        } else if (newVal !== 0) {
          alert('❌ จำนวนเงินไม่ถูกต้อง');
        }
      }
    }
  }

  deleteAsset(portId, index) {
    const port = this.portfolios.find(p => p.id === portId);
    if (port && port.assets[index]) {
      if (confirm(`คุณต้องการลบสินทรัพย์ ${port.assets[index].name} หรือไม่?`)) {
        port.assets.splice(index, 1);
        this.saveState();
        this.refreshUI();
        this.showToast('✖ ลบสินทรัพย์ย่อยออกแล้ว', 'error');
      }
    }
  }

  // --- RENDER 3: QUARTERLY STOCK SUMMARY ---
  renderQuarterly(container) {
    // Filter stock portfolios
    const stockPorts = this.portfolios.filter(p => ['Global Stock', 'Thai Stock', 'Growth Stock', 'Cash Buffer & หุ้นย่อย', 'Retirement'].includes(p.category));
    
    if (stockPorts.length === 0) {
      container.innerHTML = '<div class="border-pixel" style="padding:20px;">กรุณาสร้างพอร์ตหุ้นปันผลหรือเติบโตเพื่อติดตามข้อมูลรายไตรมาส 📈</div>';
      return;
    }

    // Build years available (unique list of years + default current)
    const years = [...new Set(this.quarterlyRecords.map(r => r.year))];
    if (!years.includes(new Date().getFullYear())) {
      years.push(new Date().getFullYear());
    }
    years.sort((a, b) => b - a);

    // Selected year (default to newest)
    if (!this.selectedQuarterlyYear) {
      this.selectedQuarterlyYear = years[0];
    }

    const yearRecords = this.quarterlyRecords.filter(r => r.year === this.selectedQuarterlyYear);

    const quarterlyHTML = `
      <div class="border-pixel" style="padding:20px; margin-bottom:20px;">
        <div style="display:flex; justify-content:between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <label for="select-q-year" style="font-weight:bold;">เลือกปีปฏิทิน:</label>
            <select id="select-q-year" class="input-retro" style="padding: 4px 12px;">
              ${years.map(y => `<option value="${y}" ${y === this.selectedQuarterlyYear ? 'selected' : ''}>ปี ${y}</option>`).join('')}
            </select>
          </div>
          
          <button class="btn btn-primary btn-retro btn-small" id="btn-add-q-record">➕ บันทึกข้อมูลไตรมาสใหม่</button>
        </div>
      </div>

      <!-- Comparison Grid of Stock Portfolios for Selected Year -->
      <div class="portfolio-grid">
        ${stockPorts.map(p => {
          const rec = yearRecords.find(r => r.portfolioId === p.id) || { q1: 0, q2: 0, q3: 0, q4: 0, notes: 'ไม่มีประวัติการบันทึกในปีนี้' };
          
          // Calculate growth rates
          const calcGrowth = (from, to) => {
            if (from <= 0) return 'N/A';
            const rate = ((to - from) / from) * 100;
            return (rate >= 0 ? '+' : '') + rate.toFixed(1) + '%';
          };
          
          const g1 = calcGrowth(rec.q1, rec.q2);
          const g2 = calcGrowth(rec.q2, rec.q3);
          const g3 = calcGrowth(rec.q3, rec.q4);

          return `
            <div class="border-pixel" style="padding:16px; display:flex; flex-direction:column; gap:12px;">
              <div style="display:flex; justify-content:between; align-items:center; border-bottom:2px solid #000; padding-bottom:6px;">
                <h4 style="font-weight:bold;">${p.name}</h4>
                <div class="asset-actions">
                  <button class="btn btn-secondary btn-retro btn-small" onclick="app.openQuarterlyModal('${p.id}', ${this.selectedQuarterlyYear})">✏️ บันทึก</button>
                </div>
              </div>
              
              <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px; text-align:center;">
                <div class="border-pixel-inset" style="padding:6px 2px;">
                  <div style="font-size:0.65rem; font-family:var(--font-press-start); color:var(--color-text-muted);">Q1</div>
                  <div style="font-weight:bold; font-size:0.8rem;">฿${rec.q1 ? rec.q1.toLocaleString() : '-'}</div>
                </div>
                <div class="border-pixel-inset" style="padding:6px 2px;">
                  <div style="font-size:0.65rem; font-family:var(--font-press-start); color:var(--color-text-muted);">Q2</div>
                  <div style="font-weight:bold; font-size:0.8rem;">฿${rec.q2 ? rec.q2.toLocaleString() : '-'}</div>
                  <div style="font-size:0.65rem; font-weight:bold;" class="${g1.startsWith('+') ? 'text-success' : g1 === 'N/A' ? 'text-muted' : 'text-danger'}">${g1}</div>
                </div>
                <div class="border-pixel-inset" style="padding:6px 2px;">
                  <div style="font-size:0.65rem; font-family:var(--font-press-start); color:var(--color-text-muted);">Q3</div>
                  <div style="font-weight:bold; font-size:0.8rem;">฿${rec.q3 ? rec.q3.toLocaleString() : '-'}</div>
                  <div style="font-size:0.65rem; font-weight:bold;" class="${g2.startsWith('+') ? 'text-success' : g2 === 'N/A' ? 'text-muted' : 'text-danger'}">${g2}</div>
                </div>
                <div class="border-pixel-inset" style="padding:6px 2px;">
                  <div style="font-size:0.65rem; font-family:var(--font-press-start); color:var(--color-text-muted);">Q4</div>
                  <div style="font-weight:bold; font-size:0.8rem;">฿${rec.q4 ? rec.q4.toLocaleString() : '-'}</div>
                  <div style="font-size:0.65rem; font-weight:bold;" class="${g3.startsWith('+') ? 'text-success' : g3 === 'N/A' ? 'text-muted' : 'text-danger'}">${g3}</div>
                </div>
              </div>

              <!-- Notes -->
              <div style="font-size:0.8rem; background-color:#0c0f1a; padding:8px; border:2px solid #000; border-radius:4px; height:60px; overflow-y:auto;">
                <span class="text-muted" style="font-weight:bold;">บันทึกไตรมาส:</span>
                <span>${rec.notes || 'ไม่มีโน้ตไตรมาส'}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    container.innerHTML = quarterlyHTML;

    // Attach Year Select Action
    document.getElementById('select-q-year').addEventListener('change', (e) => {
      this.selectedQuarterlyYear = Number(e.target.value);
      this.refreshUI();
    });

    // Add Record Button
    document.getElementById('btn-add-q-record').addEventListener('click', () => {
      this.openQuarterlyModal();
    });
  }

  // --- ACTIONS FOR QUARTERLY ---
  openQuarterlyModal(portfolioId = '', year = new Date().getFullYear()) {
    // Dynamic JS Prompt Modal
    const targetPortId = portfolioId || prompt('ระบุ ID พอร์ตหุ้น (กรอกเลข 1-12 ตามรายการในหน้าพอร์ต):');
    if (!targetPortId) return;

    const port = this.portfolios.find(p => p.id === targetPortId);
    if (!port) {
      alert('❌ ไม่พบพอร์ตที่มี ID ดังกล่าว');
      return;
    }

    const recYear = Number(prompt('ปีที่ต้องการบันทึก (ค.ศ.):', year)) || year;
    
    // Find existing
    let rec = this.quarterlyRecords.find(r => r.portfolioId === targetPortId && r.year === recYear);
    if (!rec) {
      rec = { id: 'q-' + Date.now(), portfolioId: targetPortId, year: recYear, q1: 0, q2: 0, q3: 0, q4: 0, notes: '' };
      this.quarterlyRecords.push(rec);
    }

    const q1Val = prompt('ยอดพอร์ตสิ้นสุดไตรมาส 1 (THB):', rec.q1.toString());
    const q2Val = prompt('ยอดพอร์ตสิ้นสุดไตรมาส 2 (THB):', rec.q2.toString());
    const q3Val = prompt('ยอดพอร์ตสิ้นสุดไตรมาส 3 (THB):', rec.q3.toString());
    const q4Val = prompt('ยอดพอร์ตสิ้นสุดไตรมาส 4 (THB):', rec.q4.toString());
    const notesVal = prompt('หมายเหตุประจำปีนี้:', rec.notes);

    if (q1Val !== null) rec.q1 = Number(q1Val) || 0;
    if (q2Val !== null) rec.q2 = Number(q2Val) || 0;
    if (q3Val !== null) rec.q3 = Number(q3Val) || 0;
    if (q4Val !== null) rec.q4 = Number(q4Val) || 0;
    if (notesVal !== null) rec.notes = notesVal;

    this.saveState();
    this.refreshUI();
    this.showToast('📈 บันทึกรายงานไตรมาสเรียบร้อย!');
  }

  // --- RENDER 4 & 5: FOREX / OPTION MONTHLY SUMMARY ---
  renderForexOption(container, categoryName) {
    const ports = this.portfolios.filter(p => p.category === categoryName);
    if (ports.length === 0) {
      container.innerHTML = `<div class="border-pixel" style="padding:20px;">กรุณาสร้างพอร์ตหมวดหมู่ ${categoryName} ในคลังพอร์ตก่อนจดบันทึกรายเดือน 💸</div>`;
      return;
    }

    // Default target port for records selection
    if (!this.selectedSpecPortId || !ports.map(p=>p.id).includes(this.selectedSpecPortId)) {
      this.selectedSpecPortId = ports[0].id;
    }

    const selectedPort = this.portfolios.find(p => p.id === this.selectedSpecPortId);

    // Build years available (unique list of years + default current)
    const years = [...new Set(this.monthlyRecords.map(r => r.year))];
    if (!years.includes(new Date().getFullYear())) {
      years.push(new Date().getFullYear());
    }
    years.sort((a, b) => b - a);

    // Selected year (default to newest)
    if (!this.selectedMonthlyYear) {
      this.selectedMonthlyYear = years[0];
    }

    // Calculate YTD (accumulated results)
    const portRecords = this.monthlyRecords.filter(r => r.portfolioId === this.selectedSpecPortId && r.year === this.selectedMonthlyYear);
    
    // Sort records month ascending
    portRecords.sort((a, b) => a.month - b.month);

    const totalProfitLoss = portRecords.reduce((a, c) => a + c.profitLossUSD, 0);

    // Last 3 months profit calculations
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth() + 1; // 1-indexed
    
    const getLastMonthsProfit = (num) => {
      let sum = 0;
      for (let i = 0; i < num; i++) {
        let m = curMonth - i;
        let y = curYear;
        if (m <= 0) {
          m += 12;
          y -= 1;
        }
        const match = this.monthlyRecords.find(r => r.portfolioId === this.selectedSpecPortId && r.year === y && r.month === m);
        if (match) sum += match.profitLossUSD;
      }
      return sum;
    };

    const threeMonthsPL = getLastMonthsProfit(3);
    const currentMonthPL = getLastMonthsProfit(1);

    const forexHTML = `
      <!-- Monthly stats header -->
      <div class="forex-header-summary">
        <div class="border-pixel" style="padding:16px; text-align:center;">
          <div style="font-size:0.75rem; font-family:var(--font-press-start); color:var(--color-text-muted);">กำไรเดือนปัจจุบัน</div>
          <div style="font-size:1.6rem; font-weight:900;" class="${currentMonthPL >= 0 ? 'text-success' : 'text-danger'}">
            ${currentMonthPL >= 0 ? '+' : ''}$${currentMonthPL.toLocaleString()} USD
          </div>
          <div style="font-size:0.8rem; color:var(--color-text-muted);">ประมาณ ฿${(currentMonthPL * this.exchangeRate).toLocaleString(undefined, { maximumFractionDigits: 0 })} THB</div>
        </div>

        <div class="border-pixel" style="padding:16px; text-align:center;">
          <div style="font-size:0.75rem; font-family:var(--font-press-start); color:var(--color-text-muted);">กำไร 3 เดือนล่าสุด</div>
          <div style="font-size:1.6rem; font-weight:900;" class="${threeMonthsPL >= 0 ? 'text-success' : 'text-danger'}">
            ${threeMonthsPL >= 0 ? '+' : ''}$${threeMonthsPL.toLocaleString()} USD
          </div>
          <div style="font-size:0.8rem; color:var(--color-text-muted);">ประมาณ ฿${(threeMonthsPL * this.exchangeRate).toLocaleString(undefined, { maximumFractionDigits: 0 })} THB</div>
        </div>

        <div class="border-pixel" style="padding:16px; text-align:center;">
          <div style="font-size:0.75rem; font-family:var(--font-press-start); color:var(--color-text-muted);">สะสม YTD (${this.selectedMonthlyYear})</div>
          <div style="font-size:1.6rem; font-weight:900;" class="${totalProfitLoss >= 0 ? 'text-success' : 'text-danger'}">
            ${totalProfitLoss >= 0 ? '+' : ''}$${totalProfitLoss.toLocaleString()} USD
          </div>
          <div style="font-size:0.8rem; color:var(--color-text-muted);">ประมาณ ฿${(totalProfitLoss * this.exchangeRate).toLocaleString(undefined, { maximumFractionDigits: 0 })} THB</div>
        </div>
      </div>

      <div class="forex-main-layout">
        <!-- Sidebar Select Port & Month input form -->
        <div class="detail-side-column">
          <div class="widget-card border-pixel">
            <h4>📁 เลือกพอร์ตติดตาม</h4>
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
            <h4>➕ บันทึกกำไร/ขาดทุนรายเดือน</h4>
            <form id="monthly-entry-form">
              <div class="input-retro-group">
                <label for="ent-month">เดือน:</label>
                <select id="ent-month" class="input-retro" required>
                  <option value="1">มกราคม (Jan)</option>
                  <option value="2">กุมภาพันธ์ (Feb)</option>
                  <option value="3">มีนาคม (Mar)</option>
                  <option value="4">เมษายน (Apr)</option>
                  <option value="5">พฤษภาคม (May)</option>
                  <option value="6">มิถุนายน (Jun)</option>
                  <option value="7">กรกฎาคม (Jul)</option>
                  <option value="8">สิงหาคม (Aug)</option>
                  <option value="9">กันยายน (Sep)</option>
                  <option value="10">ตุลาคม (Oct)</option>
                  <option value="11">พฤศจิกายน (Nov)</option>
                  <option value="12">ธันวาคม (Dec)</option>
                </select>
              </div>

              <div class="input-retro-group">
                <label for="ent-pl">กำไร/ขาดทุนสุทธิ (USD):</label>
                <input type="number" id="ent-pl" class="input-retro" placeholder="ใส่เครื่องหมายลบหากขาดทุน" required>
              </div>

              <div class="input-retro-group">
                <label for="ent-notes">บันทึกช่วยจำการเทรด:</label>
                <textarea id="ent-notes" class="input-retro" rows="3" placeholder="เช่น รันเทรนด์ EURUSD, ปิดกลยุทธ์ Iron Condor..."></textarea>
              </div>

              <button type="submit" class="btn btn-primary btn-retro" style="width:100%; margin-top:8px;">🎯 บันทึกผลเดือนนี้</button>
            </form>
          </div>
        </div>

        <!-- Entries Display List -->
        <div class="border-pixel entries-grid-box">
          <h4 style="font-family:var(--font-press-start); font-size:0.75rem; border-bottom: 2px solid #000; padding-bottom:8px; margin-bottom:12px;">📈 ประวัติการบันทึกรายเดือนในปี ${this.selectedMonthlyYear}</h4>
          
          <div class="entries-list">
            ${portRecords.length === 0 ? `
              <p class="text-muted" style="text-align:center; padding:24px;">ยังไม่มีการบันทึกข้อมูลของปีนี้ กรอกฟอร์มด้านซ้ายเพื่อสร้างสถิติแรกของคุณ 🚀</p>
            ` : portRecords.map(r => {
              const thVal = r.profitLossUSD * this.exchangeRate;
              const monthsTH = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
              return `
                <div class="entry-item">
                  <div>
                    <span class="entry-month-lbl text-accent">${monthsTH[r.month - 1]} ${r.year}</span>
                    <div style="font-size:0.75rem; color:var(--color-text-muted); margin-top:4px;">${r.notes || 'ไม่มีโน้ตประกอบ'}</div>
                  </div>
                  <div style="display:flex; align-items:center; gap:16px;">
                    <div style="text-align:right;">
                      <div class="value ${r.profitLossUSD >= 0 ? 'text-success' : 'text-danger'}" style="font-weight:bold;">
                        ${r.profitLossUSD >= 0 ? '+' : ''}$${r.profitLossUSD.toLocaleString()}
                      </div>
                      <div style="font-size:0.7rem; color:var(--color-text-muted);">~ ฿${thVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                    </div>
                    
                    <div class="entry-actions">
                      <button class="btn btn-secondary btn-retro btn-small" onclick="app.deleteMonthlyRecord('${r.id}')">✖</button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    container.innerHTML = forexHTML;

    // Attach Selection Listeners
    document.getElementById('select-monthly-port').addEventListener('change', (e) => {
      this.selectedSpecPortId = e.target.value;
      this.refreshUI();
    });

    document.getElementById('select-monthly-year').addEventListener('change', (e) => {
      this.selectedMonthlyYear = Number(e.target.value);
      this.refreshUI();
    });

    // Form Submit
    document.getElementById('monthly-entry-form').addEventListener('submit', (e) => {
      e.preventDefault();
      
      const monthVal = Number(document.getElementById('ent-month').value);
      const plVal = Number(document.getElementById('ent-pl').value);
      const notesVal = document.getElementById('ent-notes').value;

      // Find if exists
      let match = this.monthlyRecords.find(r => r.portfolioId === this.selectedSpecPortId && r.year === this.selectedMonthlyYear && r.month === monthVal);
      if (match) {
        match.profitLossUSD = plVal;
        match.notes = notesVal;
        this.showToast('✏️ อัปเดตข้อมูลเดือนเดิมเรียบร้อย!');
      } else {
        const newRecord = {
          id: 'm-' + Date.now(),
          portfolioId: this.selectedSpecPortId,
          year: this.selectedMonthlyYear,
          month: monthVal,
          profitLossUSD: plVal,
          notes: notesVal
        };
        this.monthlyRecords.push(newRecord);
        this.showToast('🎯 บันทึกประวัติเดือนใหม่สำเร็จ!');
      }

      this.saveState();
      this.refreshUI();
    });
  }

  deleteMonthlyRecord(id) {
    if (confirm('คุณต้องการลบรายการจดบันทึกของเดือนนี้หรือไม่?')) {
      this.monthlyRecords = this.monthlyRecords.filter(r => r.id !== id);
      this.saveState();
      this.refreshUI();
      this.showToast('✖ ลบประวัติเดือนเสร็จสิ้น', 'error');
    }
  }

  // --- RENDER 6: CASH FLOW TRACKER ---
  renderCashFlow(container) {
    // Portfolios Liquid Cash Flows Analysis
    const getLiquidityStatus = (p) => {
      const totalCash = p.cashBuffer + p.dryPowder;
      
      if (p.goalType === 'schedule') {
        // Schedule portfolios are categorized as self-sustaining if cash reserve exceeds goal buffer or standard levels
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
      <div class="cashflow-grid">
        ${this.portfolios.map(p => {
          const isUSD = ['Forex', 'Option'].includes(p.category);
          const status = getLiquidityStatus(p);
          
          return `
            <div class="cashflow-card border-pixel">
              <span class="badge ${status.cls} cashflow-status-badge">${status.text}</span>
              
              <div>
                <h4 style="font-weight:bold; font-size:1.05rem; max-width:60%;">${p.name}</h4>
                <span class="port-card-cat" style="background-color: var(--cat-${p.category.toLowerCase().replace(/[^a-z0-9]/g, '')}, var(--color-primary)); margin-top:4px;">${p.category}</span>
              </div>

              <div class="border-pixel-inset" style="padding:12px; margin-top:4px; display:flex; flex-direction:column; gap:6px;">
                <div class="port-row">
                  <span class="label">เงินสำรอง Buffer:</span>
                  <span class="value" style="color:var(--color-secondary);">${this.formatMoney(p.cashBuffer, p.category)}</span>
                </div>
                <div class="port-row">
                  <span class="label">เงินรอเข้าซื้อ Dry:</span>
                  <span class="value" style="color:var(--color-accent);">${this.formatMoney(p.dryPowder, p.category)}</span>
                </div>
                <div class="port-row" style="border-top:1.5px solid #000; padding-top:4px; margin-top:4px;">
                  <span class="label">สภาพคล่องรวม:</span>
                  <span class="value" style="color:#fff;">${this.formatMoney(p.cashBuffer + p.dryPowder, p.category)}</span>
                </div>
              </div>

              <div style="font-size:0.75rem; color:var(--color-text-muted); text-align:center; font-weight:bold; margin-top:4px;">
                📢 ${status.desc}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    container.innerHTML = cashflowHTML;
  }

  // --- RENDER 7: GROWTH COMPARISON TABLE ---
  renderComparison(container) {
    // Get full computed data of each portfolio
    const data = this.portfolios.map(p => {
      const isUSD = ['Forex', 'Option'].includes(p.category);
      const rate = isUSD ? this.exchangeRate : 1;
      
      const lvl = this.getPortfolioLevel(p);
      const totalCash = p.cashBuffer + p.dryPowder;
      
      let diffVal = 0;
      let goalPct = 0;
      
      if (p.goalType === 'numeric') {
        diffVal = p.goal - p.current;
        goalPct = p.goal > 0 ? (p.current / p.goal) * 100 : 0;
      } else {
        goalPct = p.dcaDoneThisMonth ? 100 : 0;
      }

      return {
        id: p.id,
        name: p.name,
        category: p.category,
        goalText: p.goalType === 'numeric' ? this.formatMoney(p.goal, p.category) : p.goalSchedule,
        goalRaw: p.goalType === 'numeric' ? p.goal : 0,
        goalType: p.goalType,
        current: p.current,
        currentTHB: p.current * rate,
        diffTHB: diffVal * rate,
        goalPct: goalPct,
        cashFlow: totalCash,
        cashFlowTHB: totalCash * rate,
        level: lvl.label,
        trend: p.current >= (p.goalType === 'numeric' ? p.goal * 0.5 : 1) ? '📈 โตดี' : '⛺ ปานกลาง',
        isUSD
      };
    });

    // Handle sort
    data.sort((a, b) => {
      let valA = a[this.sortKey];
      let valB = b[this.sortKey];

      if (typeof valA === 'string') {
        return this.sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return this.sortAsc ? valA - valB : valB - valA;
    });

    const getIndicator = (key) => {
      if (this.sortKey === key) {
        return this.sortAsc ? ' 🔺' : ' 🔻';
      }
      return '';
    };

    const tableHTML = `
      <div class="table-responsive">
        <table class="retro-table">
          <thead>
            <tr>
              <th onclick="app.handleSort('name')">ชื่อพอร์ต${getIndicator('name')}</th>
              <th onclick="app.handleSort('category')">ประเภท${getIndicator('category')}</th>
              <th onclick="app.handleSort('goalRaw')">เป้าหมาย${getIndicator('goalRaw')}</th>
              <th onclick="app.handleSort('currentTHB')">ยอดปัจจุบัน (THB)${getIndicator('currentTHB')}</th>
              <th onclick="app.handleSort('diffTHB')">ส่วนต่างที่ขาด (THB)${getIndicator('diffTHB')}</th>
              <th onclick="app.handleSort('goalPct')">% สำเร็จ${getIndicator('goalPct')}</th>
              <th onclick="app.handleSort('cashFlowTHB')">กระแสเงินสด (THB)${getIndicator('cashFlowTHB')}</th>
              <th>สถานะแนวโน้ม</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(d => {
              const diffText = d.goalType === 'numeric' 
                ? (d.diffTHB <= 0 ? '✔️ ถึงเป้าหมาย' : '฿' + d.diffTHB.toLocaleString(undefined, { maximumFractionDigits: 0 }))
                : '✔️ ต่อเนื่อง';
              
              const pctCls = d.goalPct >= 80 ? 'text-success' : d.goalPct >= 40 ? 'text-accent' : 'text-danger';

              return `
                <tr>
                  <td style="font-weight:bold;">${d.name}</td>
                  <td>
                    <span class="port-card-cat" style="background-color: var(--cat-${d.category.toLowerCase().replace(/[^a-z0-9]/g, '')}, var(--color-primary))">${d.category}</span>
                  </td>
                  <td>${d.goalText}</td>
                  <td style="font-family:var(--font-press-start); font-size:0.75rem;">
                    ฿${d.currentTHB.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    ${d.isUSD ? `<br><span class="text-muted" style="font-size:0.65rem;">$${d.current.toLocaleString()} USD</span>` : ''}
                  </td>
                  <td>${diffText}</td>
                  <td class="${pctCls}" style="font-family:var(--font-press-start); font-size:0.75rem; font-weight:bold;">
                    ${d.goalPct.toFixed(1)}%
                  </td>
                  <td>฿${d.cashFlowTHB.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  <td><span class="badge ${d.goalPct >= 80 ? 'badge-success' : d.goalPct >= 40 ? 'badge-info' : 'badge-warning'}">${d.level}</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    container.innerHTML = tableHTML;
  }

  handleSort(key) {
    if (this.sortKey === key) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortKey = key;
      this.sortAsc = true;
    }
    this.refreshUI();
  }

  // --- RENDER 8: SETTINGS / BACKUPS ---
  renderSettings(container) {
    const settingsHTML = `
      <div class="portfolio-detail-container" style="grid-template-columns: 1fr 1fr;">
        <!-- Backup Section -->
        <div class="border-pixel" style="padding:24px;">
          <h3 style="font-family:var(--font-press-start); font-size:0.85rem; color:var(--color-accent); border-bottom:3px solid #000; padding-bottom:8px; margin-bottom:16px;">💾 การสำรองข้อมูล (JSON Backup)</h3>
          <p class="text-muted" style="font-size:0.9rem; margin-bottom:16px;">เนื่องจากแอปพลิเคชันจัดเก็บข้อมูลแบบ Local ในเบราว์เซอร์ของคุณ คุณควรส่งออกไฟล์สำรองอย่างน้อยเดือนละครั้งเพื่อความปลอดภัยของข้อมูล</p>
          
          <div style="display:flex; flex-direction:column; gap:12px;">
            <button class="btn btn-success btn-retro" id="btn-export-backup" style="width:100%;">💾 ส่งออกข้อมูลสำรอง (EXPORT JSON)</button>
            
            <div class="border-pixel-inset" style="padding:16px; margin-top:8px;">
              <h4 style="font-size:0.85rem; margin-bottom:8px;">📥 นำเข้าไฟล์สำรองข้อมูล (IMPORT)</h4>
              <input type="file" id="import-file-selector" accept=".json" style="width:100%; font-family:var(--font-kanit); color:#94a3b8; margin-bottom:12px; cursor:pointer;">
              <button class="btn btn-primary btn-retro btn-small" id="btn-import-backup" style="width:100%;">📥 ดำเนินการนำเข้าข้อมูล</button>
            </div>
          </div>
        </div>

        <!-- Danger Zone Section -->
        <div class="border-pixel" style="padding:24px; border-color:var(--color-danger)">
          <h3 style="font-family:var(--font-press-start); font-size:0.85rem; color:var(--color-danger); border-bottom:3px solid #000; padding-bottom:8px; margin-bottom:16px;">💥 เขตอันตราย (DANGER ZONE)</h3>
          <p class="text-muted" style="font-size:0.9rem; margin-bottom:16px;">การกู้คืนระบบกลับไปสู่ค่าเริ่มต้นเดิมจะทำการล้างฐานข้อมูลในเบราว์เซอร์ทั้งหมด และทำการเริ่มนับยอดเงินรวมใหม่ทั้งหมด</p>
          
          <button class="btn btn-danger btn-retro" id="btn-reset-system" style="width:100%; margin-top:16px;">💥 รีเซ็ตพอร์ตกลับไปค่าเริ่มต้น</button>
        </div>
      </div>
    `;

    container.innerHTML = settingsHTML;

    // Export Action
    document.getElementById('btn-export-backup').addEventListener('click', () => {
      const backupData = {
        portfolios: this.portfolios,
        quarterlyRecords: this.quarterlyRecords,
        monthlyRecords: this.monthlyRecords,
        exchangeRate: this.exchangeRate,
        exportedAt: new Date().toISOString()
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `pixel_steward_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      this.showToast('💾 ส่งออกไฟล์สำรองสำเร็จ!');
    });

    // Import Action
    document.getElementById('btn-import-backup').addEventListener('click', () => {
      const fileInput = document.getElementById('import-file-selector');
      if (!fileInput.files[0]) {
        alert('❌ กรุณาเลือกไฟล์ JSON ข้อมูลสำรองก่อนกดนำเข้า');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (parsed.portfolios && parsed.quarterlyRecords && parsed.monthlyRecords) {
            this.portfolios = parsed.portfolios;
            this.quarterlyRecords = parsed.quarterlyRecords;
            this.monthlyRecords = parsed.monthlyRecords;
            this.exchangeRate = parsed.exchangeRate || 36.5;
            
            this.saveState();
            this.refreshUI();
            this.showToast('📥 นำเข้าและอัปเดตระบบเสร็จสิ้น!');
          } else {
            alert('❌ โครงสร้างข้อมูลไม่ถูกต้องหรือไฟล์ชำรุด');
          }
        } catch (err) {
          alert('❌ การแปลงไฟล์เกิดข้อผิดพลาด: ' + err.message);
        }
      };
      reader.readAsText(fileInput.files[0]);
    });

    // Reset Action
    document.getElementById('btn-reset-system').addEventListener('click', () => {
      if (confirm('⚠️ คุณยืนยันจะเคลียร์ข้อมูลกลับไปที่ค่าเริ่มต้นของระบบใช่ไหม? ข้อมูลที่บันทึกไว้ในเบราว์เซอร์จะหายไปทั้งหมด!')) {
        localStorage.removeItem('ps_portfolios_v2');
        localStorage.removeItem('ps_quarterly_v2');
        localStorage.removeItem('ps_monthly_v2');
        localStorage.removeItem('ps_ex_rate_v2');
        window.location.reload();
      }
    });
  }

  // --- GENERAL POPUP MODAL: ADD / EDIT PORTFOLIO ---
  openPortfolioModal(portfolio = null) {
    const modal = document.getElementById('portfolio-modal');
    const title = document.getElementById('portfolio-modal-title');
    
    // Fill fields if editing
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
        valInput.classList.add('hidden');
        valInput.required = false;
        schInput.classList.remove('hidden');
        schInput.value = portfolio.goalSchedule || '';
        schInput.required = true;
      } else {
        label.innerText = 'เป้าหมาย (จำนวนเงิน):';
        valInput.classList.remove('hidden');
        valInput.value = portfolio.goal || 0;
        valInput.required = true;
        schInput.classList.add('hidden');
        schInput.required = false;
      }
      
      document.getElementById('port-current').value = portfolio.current;
      document.getElementById('port-cash-buffer').value = portfolio.cashBuffer;
      document.getElementById('port-dry-powder').value = portfolio.dryPowder;
      document.getElementById('port-notes').value = portfolio.notes || '';
    } else {
      title.innerText = '📦 เพิ่มพอร์ตการลงทุนใหม่';
      document.getElementById('edit-port-id').value = '';
      document.getElementById('portfolio-form').reset();
      
      // Default goal visibility resets
      const label = document.getElementById('port-goal-label');
      label.innerText = 'เป้าหมาย (จำนวนเงิน):';
      document.getElementById('port-goal-value').classList.remove('hidden');
      document.getElementById('port-goal-value').required = true;
      document.getElementById('port-goal-schedule').classList.add('hidden');
      document.getElementById('port-goal-schedule').required = false;

      // Set default date to today
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

    const current = Number(document.getElementById('port-current').value) || 0;
    const cashBuffer = Number(document.getElementById('port-cash-buffer').value) || 0;
    const dryPowder = Number(document.getElementById('port-dry-powder').value) || 0;
    const notes = document.getElementById('port-notes').value;

    if (editId) {
      // Editing
      const port = this.portfolios.find(p => p.id === editId);
      if (port) {
        port.name = name;
        port.category = category;
        port.startDate = startDate;
        port.goalType = goalType;
        if (goalType === 'numeric') {
          port.goal = goalVal;
        } else {
          port.goalSchedule = goalScheduleVal;
        }
        port.current = current;
        port.cashBuffer = cashBuffer;
        port.dryPowder = dryPowder;
        port.notes = notes;
        this.showToast('✏️ แก้ไขข้อมูลพอร์ตลงทุนเรียบร้อย!');
      }
    } else {
      // Create new
      const newPort = {
        id: 'p-' + Date.now(),
        name,
        category,
        startDate,
        goalType,
        goal: goalType === 'numeric' ? goalVal : 0,
        goalSchedule: goalType === 'schedule' ? goalScheduleVal : '',
        current,
        cashBuffer,
        dryPowder,
        assets: [],
        notes,
        dcaDoneThisMonth: false
      };
      this.portfolios.push(newPort);
      this.selectedPortId = newPort.id;
      this.showToast('📦 เพิ่มพอร์ตลงทุนใหม่เรียบร้อย!');
    }

    this.saveState();
    this.closeModals();
    this.refreshUI();
  }

  // --- GENERAL POPUP MODAL: QUICK FUNDS TRANSFER ---
  openTransferModal() {
    const modal = document.getElementById('transfer-modal');
    const sourceSelect = document.getElementById('tf-source');
    const targetSelect = document.getElementById('tf-target');

    // Populate sources (having Dry Powder > 0)
    sourceSelect.innerHTML = this.portfolios.map(p => `<option value="${p.id}">${p.name} (Dry: ${this.formatMoney(p.dryPowder, p.category)})</option>`).join('');
    
    // Populate targets (all portfolios except the currently selected source in JS, handled dynamically)
    const updateTargetOptions = () => {
      const srcId = sourceSelect.value;
      const srcPort = this.portfolios.find(p => p.id === srcId);
      
      let targetsHTML = `<option value="system">ถอนออกนอกระบบ (ใช้จ่าย/เก็บเงินแยก)</option>`;
      this.portfolios.forEach(p => {
        if (p.id !== srcId) {
          targetsHTML += `<option value="${p.id}">${p.name}</option>`;
        }
      });
      targetSelect.innerHTML = targetsHTML;

      // Adjust transfer allocation select display
      const allocationGroup = document.querySelector('.id-allocation-group');
      if (targetSelect.value === 'system') {
        allocationGroup.classList.add('hidden');
      } else {
        allocationGroup.classList.remove('hidden');
      }
    };

    sourceSelect.addEventListener('change', updateTargetOptions);
    targetSelect.addEventListener('change', () => {
      const allocationGroup = document.querySelector('.id-allocation-group');
      if (targetSelect.value === 'system') {
        allocationGroup.classList.add('hidden');
      } else {
        allocationGroup.classList.remove('hidden');
      }
    });

    updateTargetOptions();

    // Default rate
    document.getElementById('tf-rate').value = this.exchangeRate;

    modal.classList.remove('hidden');
  }

  handleExecuteTransfer() {
    const srcId = document.getElementById('tf-source').value;
    const destId = document.getElementById('tf-target').value;
    const amount = Number(document.getElementById('tf-amount').value);
    const rate = Number(document.getElementById('tf-rate').value) || this.exchangeRate;
    const targetAlloc = document.getElementById('tf-allocation').value;

    if (isNaN(amount) || amount <= 0) {
      alert('❌ กรุณาระบุจำนวนเงินที่ต้องการโอนที่มากกว่า 0');
      return;
    }

    const srcPort = this.portfolios.find(p => p.id === srcId);
    if (!srcPort || srcPort.dryPowder < amount) {
      alert('❌ เสบียงในกอง Dry Powder ของพอร์ตต้นทางมีไม่เพียงพอสำหรับการโยกย้าย');
      return;
    }

    const isSourceUSD = ['Forex', 'Option'].includes(srcPort.category);

    // deduct from source
    srcPort.dryPowder -= amount;
    srcPort.current -= amount;
    
    const timeStr = new Date().toLocaleDateString('th-TH');
    const unitSymbol = isSourceUSD ? '$' : '฿';
    
    srcPort.notes = `[โอนเสบียงออก] หักเงินจำนวน ${unitSymbol}${amount.toLocaleString()} เมื่อ ${timeStr} -> ${destId === 'system' ? 'ถอนใช้ส่วนตัวนอกระบบ' : 'โอนเข้าพอร์ตอื่น'}\n` + (srcPort.notes || '');

    if (destId === 'system') {
      this.showToast(`⚡ ถอนเงินจำนวน ${unitSymbol}${amount.toLocaleString()} สู่ภายนอกระบบสำเร็จ!`);
    } else {
      const destPort = this.portfolios.find(p => p.id === destId);
      if (destPort) {
        const isTargetUSD = ['Forex', 'Option'].includes(destPort.category);
        
        let convertedAmount = amount;
        
        // Conversions
        if (isSourceUSD && !isTargetUSD) {
          // USD to THB
          convertedAmount = amount * rate;
        } else if (!isSourceUSD && isTargetUSD) {
          // THB to USD
          convertedAmount = amount / rate;
        }

        // Add to target
        if (targetAlloc === 'cashBuffer') {
          destPort.cashBuffer += convertedAmount;
        } else {
          destPort.dryPowder += convertedAmount;
        }
        destPort.current += convertedAmount;

        const destUnit = isTargetUSD ? '$' : '฿';
        destPort.notes = `[รับโอนเสบียง] ได้รับยอดฝากฝั่งขาเข้าจำนวน ${destUnit}${convertedAmount.toLocaleString()} จากพอร์ต ${srcPort.name} เมื่อ ${timeStr}\n` + (destPort.notes || '');

        this.showToast(`⚡ โยกย้ายและแปลงเงินเป็น ${destUnit}${convertedAmount.toLocaleString()} ปลายทางเรียบร้อย!`);
      }
    }

    this.saveState();
    this.closeModals();
    this.refreshUI();
  }
}

// Instantiate App
window.app = new PixelStewardApp();
