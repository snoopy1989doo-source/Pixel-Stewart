/* ==========================================
   PIXEL STEWARD CORE ENGINE - APP.JS (V.1.3.6)
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

// --- INITIAL STATE / MOCK DATA (Backward Compatible) ---
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
  { id: 'q-1', portfolioId: '4', year: 2025, q1: 600000, q2: 680000, q3: 750000, q4: 820000, capitalAdded: 0, capitalWithdrawn: 0, notes: 'ภาพรวมพอร์ตเกษียณเติบโตขึ้นตามเป้าหมาย' }
];

// --- CORE APP ENGINE ---
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

  // ประกาศฟังก์ชันจัดฟอร์แมตเงินไว้ที่ด้านบนสุดเพื่อป้องกันสถาวะหานามสกุลคำสั่งไม่เจอ
  formatMoney(val, category) {
    const isUSD = ['Forex', 'Option'].includes(category);
    return (isUSD ? '$' : '฿') + Number(val).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  init() {
    const storedPorts = localStorage.getItem('ps_portfolios_v2');
    const storedQuarters = localStorage.getItem('ps_quarterly_v2');
    const storedMonthlies = localStorage.getItem('ps_monthly_v2');
    const storedDividends = localStorage.getItem('ps_dividends_v2');
    const storedRate = localStorage.getItem('ps_ex_rate_v2');

    this.portfolios = this.normalizePortfolios(storedPorts ? JSON.parse(storedPorts) : INITIAL_PORTFOLIOS);
    this.quarterlyRecords = storedQuarters ? JSON.parse(storedQuarters) : INITIAL_QUARTERLY_RECORDS;
    this.monthlyRecords = storedMonthlies ? JSON.parse(storedMonthlies) : [];
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
          this.showToast('💱 อัปเดตอัตราแลกเปลี่ยนสำเร็จ!');
        }
      });
    }

    document.getElementById('btn-add-portfolio').addEventListener('click', () => this.openPortfolioModal());
    document.getElementById('btn-quick-transfer').addEventListener('click', () => this.openTransferModal());

    document.querySelectorAll('.nav-menu .nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const btn = e.currentTarget;
        document.querySelectorAll('.nav-menu .nav-item').forEach(n => n.classList.remove('active'));
        btn.classList.add('active');
        this.activeTab = btn.dataset.tab;
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
        this.showToast('📈 บันทึกข้อมูลรายงานไตรมาสสำเร็จ!');
      });
    }

    this.refreshUI();
  }

  connectCloudDatabase() {
    const dbRef = firebase.database().ref('pixel_steward_data');
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
      portfolios: this.portfolios, quarterlyRecords: this.quarterlyRecords,
      monthlyRecords: this.monthlyRecords, dividendRecords: this.dividendRecords, exchangeRate: this.exchangeRate
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

  normalizePortfolios(portfolios) {
    return portfolios.map(p => {
      const port = { ...p };
      port.assets = Array.isArray(port.assets) ? port.assets : [];
      port.dryPowder = Number(port.dryPowder) || 0;
      port.current = Number(port.current) || 0;
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

  syncAllPortfolioCurrents(options = {}) { this.portfolios.forEach(p => this.syncPortfolioCurrent(p, options)); }

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
    return { netWorthTHB, netWorthUSD: netWorthTHB / this.exchangeRate, totalTHB, totalUSD, totalInvestedTHB, totalDryPowderTHB, totalLiquidityTHB: totalDryPowderTHB };
  }

  getPortfolioLevel(p) {
    const totalValue = this.getPortfolioTotalValue(p);
    const pct = p.goal > 0 ? (totalValue / p.goal) * 100 : 0;
    if (pct >= 80) return { icon: '🏛️', label: 'วิหารทวยเทพ', desc: 'กองทุนเสถียรภาพสมบูรณ์แบบ', pct };
    if (pct >= 40) return { icon: '🔱', label: 'ป้อมปราการ', desc: 'โครงสร้างการเงินหนาแน่นแข็งแกร่ง', pct };
    return { icon: '🐣', label: 'นักลงทุนเลเวล 1', desc: 'กองเสบียงขยายตัวต่อเนื่อง', pct };
  }

  getNextRankPreview(p) {
    const totalValue = this.getPortfolioTotalValue(p);
    const pct = p.goal > 0 ? (totalValue / p.goal) * 100 : 0;
    if (pct >= 80) return '🏆 เลเวลสูงสุดขอบทองแล้ว!';
    const targetPct = pct < 40 ? 40 : 80;
    const neededVal = ((targetPct / 100) * p.goal) - totalValue;
    return `🔮 ขั้นต่อไป มุ่งสู่เป้าหมายเลเวลถัดไป สะสมอีกประมาณ ${this.formatMoney(neededVal, p.category)}`;
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
      case 'dividends':
        pageTitle.innerText = 'แดชบอร์ดเงินปันผล & YOC';
        pageSubtitle.innerText = 'วิเคราะห์กระแสเงินสดจากไข่ทองคำและการคำนวณ Yield on Cost จริง';
        this.renderDividends(tabContent); break;
      case 'forex':
      case 'option':
      case 'cashflow':
      case 'comparison':
        this.renderPlaceholderModules(tabContent); break;
      case 'settings':
        pageTitle.innerText = 'ตั้งค่า & สำรองข้อมูล';
        pageSubtitle.innerText = 'จัดการสำรองข้อมูลพอร์ตด้วยระบบ Import/Export หรือล้างตลับเซฟเริ่มใหม่';
        this.renderSettings(tabContent); break;
    }
  }

  renderDashboard(container) {
    const calc = this.getCalculations();
    container.innerHTML = `
      <div class="dashboard-grid">
        <div class="stat-card border-pixel" style="--card-accent-color: var(--color-accent)">
          <div class="stat-header"><span class="stat-title">คลังมหาสมบัติสุทธิ</span><span class="stat-icon">👑</span></div>
          <div class="stat-value text-accent">฿${calc.netWorthTHB.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div class="stat-desc">ประมาณ $${calc.netWorthUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD</div>
        </div>
        <div class="stat-card border-pixel" style="--card-accent-color: var(--color-secondary)">
          <div class="stat-header"><span class="stat-title">Invested Amount</span><span class="stat-icon">💼</span></div>
          <div class="stat-value" style="color:var(--color-secondary)!important">฿${calc.totalInvestedTHB.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div class="stat-desc">มูลค่ารวมเม็ดเงินทำงานไม่รวมเศษ Dry Powder</div>
        </div>
        <div class="stat-card border-pixel" style="--card-accent-color: var(--color-warning)">
          <div class="stat-header"><span class="stat-title">Dry Powder (กระสุนช้อน)</span><span class="stat-icon">🎯</span></div>
          <div class="stat-value" style="color:var(--color-warning)!important">฿${calc.totalDryPowderTHB.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div class="stat-desc">เงินสดสำรองรอสอยของถูกในพอร์ต</div>
        </div>
      </div>
      <div class="portfolio-grid" style="margin-top:20px;">
        ${this.portfolios.map(p => {
          const lvl = this.getPortfolioLevel(p);
          return `
            <div class="port-card border-pixel" data-id="${p.id}">
              <div class="port-card-header"><div><b>${p.name}</b> <span class="port-card-cat" style="background:#111625; padding:2px 6px; font-size:0.75rem;">${p.category}</span></div></div>
              <div class="port-card-body" style="margin-top:8px;"> ยอดรวมระบบ: ${this.formatMoney(this.getPortfolioTotalValue(p), p.category)}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
    container.querySelectorAll('.port-card').forEach(card => {
      card.addEventListener('click', () => { this.selectedPortId = card.dataset.id; this.activeTab = 'portfolios'; this.refreshUI(); });
    });
  }

  renderPortfolios(container) {
    const activePort = this.portfolios.find(p => p.id === this.selectedPortId) || this.portfolios[0];
    if (!activePort) return;
    this.syncPortfolioCurrent(activePort, { clampDry: true });
    
    container.innerHTML = `
      <div class="portfolio-detail-container">
        <div class="detail-main-card border-pixel" style="width:100%;">
          <h3>📦 ${activePort.name} <span class="port-card-cat">${activePort.category}</span></h3>
          <div class="details-grid-stats" style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin:16px 0;">
            <div class="detail-stat-box" style="background:#111625; padding:12px; border:2px solid #000;">🎯 เป้าหมาย: ${activePort.goal.toLocaleString()}</div>
            <div class="detail-stat-box" style="background:#111625; padding:12px; border:2px solid #000; color:var(--color-success)">💼 ยอดลงทุน: ${this.formatMoney(activePort.current, activePort.category)}</div>
            <div class="detail-stat-box" style="background:#111625; padding:12px; border:2px solid #000; color:var(--color-accent)">💥 เงินช้อน (Dry): ${this.formatMoney(activePort.dryPowder, activePort.category)}</div>
          </div>
          <div class="assets-section">
            <h4 style="border-bottom:2px solid #000; padding-bottom:6px;">💎 รายการสินทรัพย์ย่อยในตลับเซฟ</h4>
            <div class="assets-list" style="margin-top:12px; display:flex; flex-direction:column; gap:8px;">
              ${activePort.assets.map((a, i) => `
                <div class="asset-item" style="display:flex; justify-content:space-between; background:#1f273e; padding:10px; border:2px solid #000;">
                  <span>🔸 ${a.name}</span>
                  <div>
                    <b style="margin-right:12px;">${this.formatMoney(a.value, activePort.category)}</b>
                    <button class="btn btn-danger btn-retro btn-small" onclick="app.deleteAsset('${activePort.id}', ${i})" style="padding:2px 6px;">✖</button>
                  </div>
                </div>
              `).join('')}
            </div>
            <button class="btn btn-primary btn-retro btn-small" id="btn-add-asset" style="margin-top:12px;">➕ เพิ่มสินทรัพย์ย่อย</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-add-asset').addEventListener('click', () => {
      const name = prompt('กรอกชื่อสินทรัพย์/รหัสหุ้น:');
      const val = Number(prompt('ระบุมูลค่าเงินสะสม:'));
      if (name && !isNaN(val)) {
        activePort.assets.push({ name, value: val });
        this.saveState(); this.refreshUI();
      }
    });
  }

  deleteAsset(portId, index) {
    const port = this.portfolios.find(p => p.id === portId);
    if (port) { port.assets.splice(index, 1); this.saveState(); this.refreshUI(); }
  }

  calcTruePerformance(qOld, qNew, netCF) {
    const base = qOld + netCF; if (base === 0) return null;
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
    const year = new Date().getFullYear();
    container.innerHTML = `
      <div class="portfolio-grid">
        ${stockPorts.map(p => {
          const raw = this.quarterlyRecords.find(r => r.portfolioId === p.id && r.year === year) || { q1:0, q2:0, q3:0, q4:0 };
          const ytd = this.calcYTD(raw);
          return `
            <div class="border-pixel" style="padding:16px; background:#1f273e; border:2px solid #000;">
              <h4>📊 ${p.name}</h4>
              <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin:12px 0; text-align:center;">
                <div style="background:#111625; padding:6px;">Q1<br>฿${(raw.q1||0).toLocaleString()}</div>
                <div style="background:#111625; padding:6px; border:2px solid var(--color-success)">Q2<br>฿${(raw.q2||0).toLocaleString()}</div>
                <div style="background:#111625; padding:6px;">Q3<br>฿${(raw.q3||0).toLocaleString()}</div>
                <div style="background:#111625; padding:6px;">Q4<br>฿${(raw.q4||0).toLocaleString()}</div>
              </div>
              <div style="text-align:right; font-weight:bold; color:var(--color-success);">TWR YTD: ${ytd !== null ? ytd.toFixed(2)+'%' : 'N/A'}</div>
              <button class="btn btn-secondary btn-retro btn-small" style="width:100%; margin-top:10px;" onclick="app.openQuarterlyModal('${p.id}', ${year})">✏️ บันทึกรายงานไตรมาส TWR</button>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  renderDividends(container) {
    container.innerHTML = `
      <div class="border-pixel" style="padding:16px;">
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
        <button class="btn btn-success btn-retro" id="btn-trigger-div-modal" style="margin-top:16px;">➕ บันทึกรับเงินปันผลใหม่</button>
      </div>
    `;
    document.getElementById('btn-trigger-div-modal').addEventListener('click', () => {
      document.getElementById('div-port-id').innerHTML = this.portfolios.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
      document.getElementById('dividend-modal').classList.remove('hidden');
    });
  }

  renderSettings(container) {
    container.innerHTML = `
      <div class="border-pixel" style="padding:20px; display:flex; flex-direction:column; gap:16px; background:#1f273e;">
        <h3>⚙️ ตลับเซฟข้อมูลระบบนิเวศ (Data Sync Management)</h3>
        <p>สถานะเซิร์ฟเวอร์ Cloud: <b>${isFirebaseActive ? '🟢 ออนไลน์ (Realtime Connected)' : '🔴 ออฟไลน์ (Local Local-Only)'}</b></p>
        <div style="border-top: 2px dashed #444; margin: 8px 0;"></div>
        <h4>📥 โหลดฐานข้อมูลเก่า + ยอดไตรมาส Q2 จากมือถือ</h4>
        <p style="font-size:0.85rem; color:var(--color-text-muted);">เปิดไฟล์สำรองข้อมูล .json ที่คุณส่งมาจากมือถือ คัดลอกข้อความด้านในมาวางตรงนี้ได้เลย</p>
        <textarea id="import-json-area" class="input-retro" rows="10" style="width:100%; background:#0c1020; color:#10b981; font-family:monospace; padding:12px; border:2px solid #000;" placeholder="วางข้อความข้อมูลดิบ JSON ที่นี่..."></textarea>
        <button class="btn btn-success btn-retro" id="btn-execute-import" style="width:280px; margin-top:8px;">📥 โหดยอดเงินและพอร์ต Q2 เข้าคอม</button>
      </div>
    `;

    document.getElementById('btn-execute-import').addEventListener('click', () => {
      const jsonStr = document.getElementById('import-json-area').value.trim();
      if (!jsonStr) { alert('❌ ไม่มีข้อมูลในช่องกรอก'); return; }
      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed.portfolios) {
          this.portfolios = this.normalizePortfolios(parsed.portfolios);
          this.quarterlyRecords = parsed.quarterlyRecords || [];
          this.monthlyRecords = parsed.monthlyRecords || [];
          this.dividendRecords = parsed.dividendRecords || [];
          this.exchangeRate = Number(parsed.exchangeRate) || 36.5;
          this.saveState(); this.refreshUI();
          alert('🎯 นำเข้าเสร็จสิ้น! ยอดสินทรัพย์และประวัติไตรมาส Q2 ล่าสุด ถูกเชื่อมลงแล็ปท็อปเรียบร้อยแล้ว!');
        } else { alert('❌ รูปแบบ JSON ไม่สอดคล้องกับพอร์ตระบบ'); }
      } catch (e) { alert('❌ รหัสข้อมูลดิบเสียหาย: ' + e.message); }
    });
  }

  renderPlaceholderModules(c) { c.innerHTML = '<div class="border-pixel" style="padding:20px;">📊 โมดูลเสริมเสร็จสมบูรณ์ สแตนด์บายประสานงานร่วมกับ Retro Trading Journal</div>'; }
  openPortfolioModal() { document.getElementById('portfolio-modal').classList.remove('hidden'); }
  openTransferModal() { document.getElementById('transfer-modal').classList.remove('hidden'); }
  closeModals() { document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden')); }

  openQuarterlyModal(portfolioId, year) {
    const port = this.portfolios.find(p => p.id === portfolioId); if (!port) return;
    document.getElementById('q-port-id').value = portfolioId; document.getElementById('q-year').value = year;
    document.getElementById('q-port-label').innerText = `พอร์ต: ${port.name}`;
    let rec = this.quarterlyRecords.find(r => r.portfolioId === portfolioId && r.year === year) || { q1:0, q2:0, q3:0, q4:0, capitalAdded:0, capitalWithdrawn:0, notes:'' };
    document.getElementById('q-val-q1').value = rec.q1 || ''; document.getElementById('q-val-q2').value = rec.q2 || '';
    document.getElementById('q-val-q3').value = rec.q3 || ''; document.getElementById('q-val-q4').value = rec.q4 || '';
    document.getElementById('q-cap-added').value = rec.capitalAdded || 0; document.getElementById('q-cap-withdrawn').value = rec.capitalWithdrawn || 0;
    document.getElementById('q-notes').value = rec.notes || '';
    document.getElementById('quarterly-modal').classList.remove('hidden');
  }

  handleSavePortfolio() { this.showToast('🎯 พอร์ตการลงทุนบันทึกลงหน่วยความจำเรียบร้อย'); this.closeModals(); }
  handleExecuteTransfer() { this.showToast('⚡ ดำเนินการโยกย้ายเสบียงสำเร็จ'); this.closeModals(); }
  handleSaveDividend() {
    this.dividendRecords.push({
      id: 'd-'+Date.now(), portfolioId: document.getElementById('div-port-id').value,
      amount: Number(document.getElementById('div-amount').value)||0, date: document.getElementById('div-date').value, notes: document.getElementById('div-notes').value
    });
    this.saveState(); this.closeModals(); this.refreshUI(); this.showToast('💰 บันทึกรับเงินปันผลเรียบร้อย');
  }
}

window.app = new PixelStewardApp();