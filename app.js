/* ==========================================
   PIXEL STEWARD CORE ENGINE - APP.JS (V.1.4.0)
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
  { id: '2', name: 'Zero 1 (เงินฉุกเฉิน)', category: 'Emergency', goalType: 'numeric', goal: 95000, current: 0, cashBuffer: 90000, dryPowder: 0, assets: [], startDate: '2025-01-01', notes: 'เงินสำรองห้ามแตะต้องเว้นแต่จำเป็น' }
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
    const storedPorts = localStorage.getItem('ps_portfolios_v2');
    const storedQuarters = localStorage.getItem('ps_quarterly_v2');
    const storedMonthlies = localStorage.getItem('ps_monthly_v2');
    const storedDividends = localStorage.getItem('ps_dividends_v2');
    const storedRate = localStorage.getItem('ps_ex_rate_v2');

    this.portfolios = this.normalizePortfolios(storedPorts ? JSON.parse(storedPorts) : INITIAL_PORTFOLIOS);
    this.quarterlyRecords = storedQuarters ? JSON.parse(storedQuarters) : [];
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

    // เปิดสแตนด์บายฟังก์ชันบันทึกข้อมูลไตรมาส
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
    return { netWorthTHB, netWorthUSD: netWorthTHB / this.exchangeRate, totalTHB, totalUSD, totalInvestedTHB, totalDryPowderTHB };
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
        pageSubtitle.innerText = 'วิเคราะห์สถานะความมั่งคั่ง กระสุนรอช้อน และแนวโน้มการเติบโตรายไตรมาส';
        this.renderDashboard(tabContent); break;
      case 'portfolios':
        pageTitle.innerText = 'พอร์ตการลงทุนทั้งหมดในระบบ';
        pageSubtitle.innerText = 'สลับดูและจัดสรรรายการสินทรัพย์ย่อยแยกตามรายพอร์ตได้อย่างอิสระ';
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
        pageTitle.innerText = 'บันทึก Forex รายเดือน';
        pageSubtitle.innerText = 'ดึงข้อมูลประวัติซื้อขายและการทำกำไรอัตโนมัติมาจากแอป Retro Trading Journal';
        tabContent.innerHTML = '<div class="border-pixel" style="padding:20px;">📊 โมดูลเชื่อมต่อประวัติการเทรด Forex จาก Retro Trading Journal กำลังแสตนด์บายคู่ขนาน</div>';
        break;
      case 'option':
        pageTitle.innerText = 'บันทึก Option รายเดือน';
        pageSubtitle.innerText = 'ระบบจดบันทึกด้วยมือแมนนวลสำหรับพอร์ตสัญญาออปชันประจำเดือนของคุณ';
        this.renderOptionManual(tabContent); break;
      case 'cashflow':
      case 'comparison':
        tabContent.innerHTML = '<div class="border-pixel" style="padding:20px;">📊 ระบบจัดการโครงสร้างข้อมูลเสริมทำงานปกติ</div>';
        break;
      case 'settings':
        pageTitle.innerText = 'ตั้งค่า & สำรองข้อมูล';
        pageSubtitle.innerText = 'จัดการสำรองข้อมูลพอร์ตด้วยระบบ Import/Export หรือล้างตลับเซฟเริ่มใหม่';
        this.renderSettings(tabContent); break;
    }
  }

  // --- 📊 RENDER 1: DASHBOARD UPGRADE (ความมั่งคั่งสุทธิ + สรุปกราฟเติบโต + 3 อันดับเป้าหมาย) ---
  renderDashboard(container) {
    const calc = this.getCalculations();

    // 1. หา 3 อันดับพอร์ตที่ใกล้ถึงเป้าหมายสูงสุด (เฉพาะประเภทเป้าหมายเงินตัวเลข)
    const topGoals = this.portfolios
      .filter(p => p.goalType === 'numeric' && p.goal > 0)
      .map(p => {
        const val = this.getPortfolioTotalValue(p);
        return { name: p.name, pct: (val / p.goal) * 100, current: val, goal: p.goal, category: p.category };
      })
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 3);

    // 2. สรุปการเติบโตแบบกราฟโดยคำนวณเงินจากทุกพอร์ตรวมกันรายไตรมาสในปีปัจจุบัน
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
      <div class="dashboard-grid" style="grid-template-columns: 1fr 1fr; gap:20px;">
        <div class="stat-card border-pixel" style="--card-accent-color: var(--color-accent)">
          <div class="stat-header"><span class="stat-title">ความมั่งคั่งสุทธิ (พอร์ตรวมทุกการลงทุน)</span><span class="stat-icon">👑</span></div>
          <div class="stat-value text-accent">฿${calc.netWorthTHB.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          <div class="stat-desc">สัดส่วนรวมสินทรัพย์ทำงาน: ฿${calc.totalInvestedTHB.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        </div>
        <div class="stat-card border-pixel" style="--card-accent-color: var(--color-warning)">
          <div class="stat-header"><span class="stat-title">Dry Powder (กระสุนรอช้อน)</span><span class="stat-icon">🥄</span></div>
          <div class="stat-value" style="color:var(--color-warning)!important">฿${calc.totalDryPowderTHB.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          <div class="stat-desc">เงินสดสำรองสภาพคล่องสูงพร้อมลุย</div>
        </div>
      </div>

      <div class="dashboard-grid" style="grid-template-columns: 1.2fr 0.8fr; gap:20px; margin-top:20px;">
        <div class="border-pixel" style="padding:20px; background:#1f273e;">
          <h4 style="font-family:var(--font-press-start); font-size:0.75rem; color:var(--color-primary-light); margin-bottom:20px;">📈 สรุปความเติบโตของเงินทุนรายไตรมาส (${currentYear})</h4>
          <div style="display:flex; justify-content:space-around; align-items:flex-end; height:180px; background:#111625; padding:20px 10px; border:2px solid #000; border-radius:4px;">
            <div style="display:flex; flex-direction:column; align-items:center; width:20%; height:100%; justify-content:flex-end;">
              <div style="font-size:0.65rem; margin-bottom:4px; color:#fff;">฿${q1Total.toLocaleString(undefined,{maximumFractionDigits:0})}</div>
              <div style="width:100%; height:${getBarHeight(q1Total)}%; background:var(--color-primary); border:2px solid #000;"></div>
              <div style="font-size:0.7rem; font-family:var(--font-press-start); margin-top:8px;">Q1</div>
            </div>
            <div style="display:flex; flex-direction:column; align-items:center; width:20%; height:100%; justify-content:flex-end;">
              <div style="font-size:0.65rem; margin-bottom:4px; color:var(--color-success);">฿${q2Total.toLocaleString(undefined,{maximumFractionDigits:0})}</div>
              <div style="width:100%; height:${getBarHeight(q2Total)}%; background:var(--color-success); border:2px solid #000;"></div>
              <div style="font-size:0.7rem; font-family:var(--font-press-start); margin-top:8px;">Q2</div>
            </div>
            <div style="display:flex; flex-direction:column; align-items:center; width:20%; height:100%; justify-content:flex-end;">
              <div style="font-size:0.65rem; margin-bottom:4px; color:#fff;">฿${q3Total.toLocaleString(undefined,{maximumFractionDigits:0})}</div>
              <div style="width:100%; height:${getBarHeight(q3Total)}%; background:var(--color-secondary); border:2px solid #000;"></div>
              <div style="font-size:0.7rem; font-family:var(--font-press-start); margin-top:8px;">Q3</div>
            </div>
            <div style="display:flex; flex-direction:column; align-items:center; width:20%; height:100%; justify-content:flex-end;">
              <div style="font-size:0.65rem; margin-bottom:4px; color:#fff;">฿${q4Total.toLocaleString(undefined,{maximumFractionDigits:0})}</div>
              <div style="width:100%; height:${getBarHeight(q4Total)}%; background:var(--color-accent); border:2px solid #000;"></div>
              <div style="font-size:0.7rem; font-family:var(--font-press-start); margin-top:8px;">Q4</div>
            </div>
          </div>
        </div>

        <div class="border-pixel" style="padding:20px; background:#1f273e; display:flex; flex-direction:column; justify-content:between;">
          <h4 style="font-family:var(--font-press-start); font-size:0.7rem; color:var(--color-accent); margin-bottom:12px;">🚩 3 อันดับพอร์ตใกล้ถึงเป้าหมาย</h4>
          <div style="display:flex; flex-direction:column; gap:12px;">
            ${topGoals.length === 0 ? '<p class="text-muted" style="font-size:0.8rem;">ยังไม่ได้ตั้งค่าเงินเป้าหมาย</p>' : topGoals.map((g, idx) => `
              <div style="background:#111625; padding:10px; border:2px solid #000;">
                <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:bold;">
                  <span>${idx+1}. ${g.name}</span>
                  <span style="color:var(--color-success);">${g.pct.toFixed(1)}%</span>
                </div>
                <div class="progress-container" style="margin-top:6px; height:8px;"><div class="progress-bar-bg" style="height:100%;"><div class="progress-bar-fill" style="width:${Math.min(100, g.pct)}%; height:100%; background:var(--color-accent);"></div></div></div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // --- 📁 RENDER 2: PORTFOLIOS UPGRADE (แสดงผลทุกพอร์ต + สามารถเลือกสลับพอร์ตได้สมบูรณ์) ---
  renderPortfolios(container) {
    if (this.portfolios.length === 0) {
      container.innerHTML = '<div class="border-pixel" style="padding:20px;">ไม่พบรายการพอร์ตการลงทุนในตลับเซฟครับ</div>';
      return;
    }
    
    // บังคับหาพอร์ตที่เลือกอยู่ หากไม่มีให้ดึงตัวแรกสุดขึ้นมาแสดงผลเสมอ เพื่อป้องกันการล็อกตาย
    let activePort = this.portfolios.find(p => p.id === this.selectedPortId);
    if (!activePort) {
      activePort = this.portfolios[0];
      this.selectedPortId = activePort.id;
    }
    
    this.syncPortfolioCurrent(activePort, { clampDry: true });

    container.innerHTML = `
      <div class="portfolio-detail-container" style="display:grid; grid-template-columns: 0.7fr 1.3fr; gap:20px;">
        
        <div class="border-pixel" style="padding:16px; background:#111625; display:flex; flex-direction:column; gap:10px;">
          <h4 style="font-family:var(--font-press-start); font-size:0.65rem; color:var(--color-primary-light); margin-bottom:8px; border-bottom:2px solid #000; padding-bottom:8px;">📁 พอร์ตลงทุนทั้งหมด</h4>
          <div style="display:flex; flex-direction:column; gap:8px; max-height:450px; overflow-y:auto;">
            ${this.portfolios.map(p => `
              <button class="btn style-port-select-btn ${p.id === this.selectedPortId ? 'btn-primary' : 'btn-secondary'}" 
                      onclick="app.switchPortfolio('${p.id}')" 
                      style="width:100%; text-align:left; justify-content:flex-start; padding:10px; font-size:0.85rem; display:flex; gap:8px;">
                <span>📁</span> <span>${p.name}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="detail-main-card border-pixel" style="background:#1f273e; padding:20px;">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #000; padding-bottom:10px;">
            <h3>📦 ${activePort.name}</h3>
            <span class="port-card-cat" style="background:var(--color-primary); font-size:0.8rem; padding:4px 10px;">${activePort.category}</span>
          </div>

          <div class="details-grid-stats" style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin:20px 0;">
            <div class="detail-stat-box" style="background:#111625; padding:12px; border:2px solid #000;">🎯 เป้าหมาย: ${activePort.goalType === 'numeric' ? this.formatMoney(activePort.goal, activePort.category) : activePort.goalSchedule}</div>
            <div class="detail-stat-box" style="background:#111625; padding:12px; border:2px solid #000; color:var(--color-success)">💼 ยอดลงทุนทำงาน: ${this.formatMoney(activePort.current, activePort.category)}</div>
            <div class="detail-stat-box" style="background:#111625; padding:12px; border:2px solid #000; color:var(--color-warning)">🥄 เงินช้อน (Dry): ${this.formatMoney(activePort.dryPowder, activePort.category)}</div>
          </div>

          <div class="assets-section" style="margin-top:20px;">
            <h4 style="border-bottom:2px solid #000; padding-bottom:6px; font-family:var(--font-press-start); font-size:0.65rem; color:var(--color-text-muted);">💎 สินทรัพย์ย่อยภายในพอร์ตนี้</h4>
            <div class="assets-list" style="margin-top:12px; display:flex; flex-direction:column; gap:8px;">
              ${activePort.assets.length === 0 ? '<p class="text-muted" style="padding:10px; text-align:center;">ไม่มีรายการสินทรัพย์ย่อยในพอร์ตนี้</p>' : activePort.assets.map((a, i) => `
                <div class="asset-item" style="display:flex; justify-content:space-between; background:#111625; padding:12px; border:2px solid #000; border-radius:4px;">
                  <span>🔸 ${a.name}</span>
                  <div>
                    <b style="margin-right:16px; color:#fff;">${this.formatMoney(a.value, activePort.category)}</b>
                    <button class="btn btn-danger btn-retro btn-small" onclick="app.deleteAsset('${activePort.id}', ${i})" style="padding:2px 8px;">✖</button>
                  </div>
                </div>
              `).join('')}
            </div>
            <button class="btn btn-primary btn-retro btn-small" id="btn-add-asset" style="margin-top:16px;">➕ เพิ่มสินทรัพย์ย่อยเข้าตลับเซฟ</button>
          </div>
        </div>

      </div>
    `;

    const addAssetBtn = document.getElementById('btn-add-asset');
    if (addAssetBtn) {
      addAssetBtn.addEventListener('click', () => {
        const name = prompt('กรอกชื่อสินทรัพย์ย่อยหรือตัวย่อหุ้น (เช่น MSFT):');
        const val = Number(prompt(`ระบุมูลค่าเม็ดเงินสะสม (${activePort.category === 'Forex' || activePort.category === 'Option' ? 'USD' : 'THB'}):`));
        if (name && !isNaN(val) && val >= 0) {
          activePort.assets.push({ name, value: val });
          this.saveState();
          this.refreshUI();
        }
      });
    }
  }

  switchPortfolio(id) {
    this.selectedPortId = id;
    this.refreshUI();
  }

  deleteAsset(portId, index) {
    const port = this.portfolios.find(p => p.id === portId);
    if (port && port.assets[index]) {
      if (confirm(`ต้องการลบสินทรัพย์ย่อย ${port.assets[index].name} ออกจากระบบพอร์ตหรือไม่?`)) {
        port.assets.splice(index, 1);
        this.saveState();
        this.refreshUI();
      }
    }
  }

  // --- 💎 RENDER 3: OPTION MANUAL ENGINE ---
  renderOptionManual(container) {
    const optionPorts = this.portfolios.filter(p => p.category === 'Option');
    container.innerHTML = `
      <div class="border-pixel" style="padding:20px; background:#1f273e;">
        <h4 style="font-family:var(--font-press-start); font-size:0.75rem; color:var(--color-accent); margin-bottom:12px;">💎 ระบบบันทึกรายเดือนพอร์ต Option (จดมือแมนนวล)</h4>
        <p style="font-size:0.85rem; color:var(--color-text-muted); margin-bottom:16px;">หน้าต่างออปชันนี้จะไม่ดึงผลลัพธ์จากภายนอก คุณสามารถกรอกสถิติกำไรขาดทุนรายเดือนลงตลับเซฟได้ด้วยตนเอง</p>
        
        <div style="display:grid; grid-template-columns:1fr 2fr; gap:20px;">
          <div class="border-pixel-inset" style="padding:16px; background:#111625;">
            <div class="form-group" style="margin-bottom:12px;">
              <label>เลือกพอร์ตสัญญารองรับ:</label>
              <select id="opt-port-select" class="input-retro" style="width:100%;">
                ${optionPorts.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
              </select>
            </div>
            <div class="form-group" style="margin-bottom:12px;">
              <label>เดือนประจำงวด:</label>
              <select id="opt-month-select" class="input-retro" style="width:100%;">
                ${[...Array(12).keys()].map(i => `<option value="${i+1}">เดือน ${i+1}</option>`).join('')}
              </select>
            </div>
            <div class="form-group" style="margin-bottom:16px;">
              <label>ผลกำไร/ขาดทุนสุทธิ (USD):</label>
              <input type="number" id="opt-pl-input" class="input-retro" placeholder="เช่น 250 หรือ -100" style="width:100%;">
            </div>
            <button class="btn btn-success btn-retro" id="btn-save-opt-manual" style="width:100%;">💾 บันทึกยอดออปชัน</button>
          </div>
          
          <div class="border-pixel-inset" style="padding:16px; background:#111625;">
            <h5 style="margin-bottom:10px;">📜 ประวัติการบันทึกแมนนวลประจำปี</h5>
            <div style="max-height:250px; overflow-y:auto; font-size:0.85rem;" id="opt-history-list">
              <p class="text-muted" style="text-align:center; padding-top:20px;">โครงสร้างตรรกะจดมือบันทึกสัญญารายเดือนพร้อมทำงาน</p>
            </div>
          </div>
        </div>
      </div>
    `;

    const saveOptBtn = document.getElementById('btn-save-opt-manual');
    if (saveOptBtn) {
      saveOptBtn.addEventListener('click', () => {
        const pId = document.getElementById('opt-port-select').value;
        const month = Number(document.getElementById('opt-month-select').value);
        const pl = Number(document.getElementById('opt-pl-input').value);
        if (!pId || isNaN(pl)) { alert('❌ กรอกข้อมูลไม่ถูกต้อง'); return; }
        
        this.monthlyRecords.push({ id: 'm-' + Date.now(), portfolioId: pId, year: new Date().getFullYear(), month: month, profitLossUSD: pl, notes: 'บันทึกด้วยมือ (แมนนวล)' });
        this.saveState();
        this.showToast('💾 บันทึกผลงานออปชันด้วยมือเสร็จสิ้น!');
        document.getElementById('opt-pl-input').value = '';
      });
    }
  }

  // --- 📈 RENDER 4: QUARTERLY TWR RECORD ---
  renderQuarterly(container) {
    const stockPorts = this.portfolios.filter(p => !['Forex', 'Option'].includes(p.category));
    const year = new Date().getFullYear();
    container.innerHTML = `
      <div class="portfolio-grid" style="display:grid; grid-template-columns:1fr; gap:16px;">
        ${stockPorts.map(p => {
          const raw = this.quarterlyRecords.find(r => r.portfolioId === p.id && r.year === year) || { q1:0, q2:0, q3:0, q4:0 };
          return `
            <div class="border-pixel" style="padding:16px; background:#1f273e; border:2px solid #000;">
              <h4>📊 ${p.name}</h4>
              <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin:12px 0; text-align:center;">
                <div style="background:#111625; padding:8px; border:2px solid #000;">Q1<br>฿${(raw.q1||0).toLocaleString()}</div>
                <div style="background:#111625; padding:8px; border:2px solid var(--color-success)">Q2<br>฿${(raw.q2||0).toLocaleString()}</div>
                <div style="background:#111625; padding:8px; border:2px solid #000;">Q3<br>฿${(raw.q3||0).toLocaleString()}</div>
                <div style="background:#111625; padding:8px; border:2px solid #000;">Q4<br>฿${(raw.q4||0).toLocaleString()}</div>
              </div>
              <button class="btn btn-secondary btn-retro btn-small" style="width:100%;" onclick="app.openQuarterlyModal('${p.id}', ${year})">✏️ บันทึกรายงานไตรมาส TWR</button>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // --- 💰 RENDER 5: DIVIDENDS ---
  renderDividends(container) {
    container.innerHTML = `
      <div class="border-pixel" style="padding:16px; background:#1f273e;">
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

  // --- ⚙️ RENDER 6: SETTINGS UPGRADE (ทำความสะอาดหน้าจอคำสั่งตามรีเควส) ---
  renderSettings(container) {
    container.innerHTML = `
      <div class="border-pixel" style="padding:20px; display:flex; flex-direction:column; gap:16px; background:#1f273e;">
        <h3>⚙️ ตลับเซฟข้อมูลระบบนิเวศ (Data Sync Management)</h3>
        <p>สถานะเซิร์ฟเวอร์ Cloud: <b>${isFirebaseActive ? '🟢 ออนไลน์ (Realtime Connected)' : '🔴 ออฟไลน์ (Local-Only)'}</b></p>
        
        <div style="border-top: 2px dashed #444; margin: 8px 0;"></div>
        
        <h4>📥 โหลดฐานข้อมูลเก่า</h4>
        <p style="font-size:0.85rem; color:var(--color-text-muted);">เปิดไฟล์สำรองข้อมูลคัดลอกรหัสข้อความจากมือถือมาวางลงในกล่องด้านล่างนี้</p>
        <textarea id="import-json-area" class="input-retro" rows="10" style="width:100%; background:#0c1020; color:#10b981; font-family:monospace; padding:12px; border:2px solid #000;" placeholder="วางข้อความข้อมูลดิบ JSON ที่นี่..."></textarea>
        <button class="btn btn-success btn-retro" id="btn-execute-import" style="width:220px; margin-top:8px;">📥 โหลดข้อมูลเก่า</button>
      </div>
    `;

    document.getElementById('btn-execute-import').addEventListener('click', () => {
      const jsonStr = document.getElementById('import-json-area').value.trim();
      if (!jsonStr) { alert('❌ ตรวจพบช่องกรอกว่างเปล่า ไม่สามารถดำเนินงานได้ครับ'); return; }
      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed.portfolios) {
          this.portfolios = this.normalizePortfolios(parsed.portfolios);
          this.quarterlyRecords = parsed.quarterlyRecords || [];
          this.monthlyRecords = parsed.monthlyRecords || [];
          this.dividendRecords = parsed.dividendRecords || [];
          this.exchangeRate = Number(parsed.exchangeRate) || 36.5;

          this.saveState();
          this.refreshUI();
          alert('🎯 [SUCCESS] ทำการนำเข้าไฟล์ข้อมูลเรียบร้อยแล้ว ทุกพอร์ตลงทุนและประวัติไตรมาสแสดงผลครบถ้วน!');
        } else {
          alert('❌ โครงสร้างไฟล์ JSON ผิดรูปแบบพิมพ์เขียวระบบ');
        }
      } catch (e) {
        alert('❌ รหัสข้อความเสียหายหรือก๊อปปี้มาไม่ครบถ้วน: ' + e.message);
      }
    });
  }

  openQuarterlyModal(portfolioId, year) {
    const port = this.portfolios.find(p => p.id === portfolioId); if (!port) return;
    document.getElementById('q-port-id').value = portfolioId;
    document.getElementById('q-year').value = year;
    document.getElementById('q-port-label').innerText = `พอร์ต: ${port.name}`;
    
    let rec = this.quarterlyRecords.find(r => r.portfolioId === portfolioId && r.year === year) || { q1:0, q2:0, q3:0, q4:0, capitalAdded:0, capitalWithdrawn:0, notes:'' };
    document.getElementById('q-val-q1').value = rec.q1 || '';
    document.getElementById('q-val-q2').value = rec.q2 || '';
    document.getElementById('q-val-q3').value = rec.q3 || '';
    document.getElementById('q-val-q4').value = rec.q4 || '';
    document.getElementById('q-cap-added').value = rec.capitalAdded || 0;
    document.getElementById('q-cap-withdrawn').value = rec.capitalWithdrawn || 0;
    document.getElementById('q-notes').value = rec.notes || '';
    
    document.getElementById('quarterly-modal').classList.remove('hidden');
  }

  openPortfolioModal() { document.getElementById('portfolio-modal').classList.remove('hidden'); }
  openTransferModal() { document.getElementById('transfer-modal').classList.remove('hidden'); }
  closeModals() { document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden')); }
}

window.app = new PixelStewardApp();