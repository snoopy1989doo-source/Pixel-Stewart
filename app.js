/* ==========================================
   PIXEL STEWARD CORE ENGINE - APP.JS (V.1.3.1)
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

    if (isFirebaseActive) { this.connectCloudDatabase(); }

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
    if (isFirebaseActive) {
      firebase.database().ref('pixel_steward_data').set({
        portfolios: this.portfolios, quarterlyRecords: this.quarterlyRecords,
        monthlyRecords: this.monthlyRecords, dividendRecords: this.dividendRecords, exchangeRate: this.exchangeRate
      });
    }
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
        totalUSD += totalValue; totalInvestedTHB += p.current * this.exchangeRate; totalDryPowderTHB += p.dryPowder * this.exchangeRate;
      } else {
        totalTHB += totalValue; totalInvestedTHB += p.current; totalDryPowderTHB += p.dryPowder;
      }
    });
    return {
      netWorthTHB: totalTHB + (totalUSD * this.exchangeRate), netWorthUSD: (totalTHB + (totalUSD * this.exchangeRate)) / this.exchangeRate,
      totalTHB, totalUSD, totalInvestedTHB, totalDryPowderTHB, totalLiquidityTHB: totalDryPowderTHB
    };
  }

  formatMoney(val, category) {
    return (['Forex', 'Option'].includes(category) ? '$' : '฿') + Number(val).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  getPortfolioLevel(p) { return { icon: '💼', label: 'นักลงทุนทั่วไป', desc: 'รักษาสมดุลพอร์ตเสบียง', pct: 50 }; }

  renderDashboard(container) {
    const calc = this.getCalculations();
    container.innerHTML = `
      <div class="dashboard-grid">
        <div class="stat-card border-pixel" style="--card-accent-color: var(--color-accent)">
          <div class="stat-header"><span class="stat-title">คลังมหาสมบัติสุทธิ</span></div>
          <div class="stat-value text-accent">฿${calc.netWorthTHB.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        </div>
      </div>
      <div class="portfolio-grid">
        ${this.portfolios.map(p => `
          <div class="port-card border-pixel" data-id="${p.id}">
            <div class="port-card-header"><div><b>${p.name}</b></div></div>
            <div class="port-card-body">ยอดรวม: ${this.formatMoney(this.getPortfolioTotalValue(p), p.category)}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderPortfolios(container) {
    const activePort = this.portfolios.find(p => p.id === this.selectedPortId) || this.portfolios[0];
    if (!activePort) return;
    container.innerHTML = `
      <div class="border-pixel" style="padding:20px;">
        <h3>${activePort.name}</h3>
        <p>หมวดหมู่: ${activePort.category}</p>
        <div class="assets-list">
          ${activePort.assets.map(a => `<div class="asset-item">💎 ${a.name}: ${this.formatMoney(a.value, activePort.category)}</div>`).join('')}
        </div>
      </div>
    `;
  }

  renderQuarterly(container) {
    container.innerHTML = `<div class="border-pixel" style="padding:20px;">📊 ฟังก์ชันสรุปผลการดำเนินงานหุ้นรายไตรมาส (TWR YTD) กำลังสแตนด์บายรับข้อมูล</div>`;
  }

  renderDividends(container) {
    container.innerHTML = `
      <div class="border-pixel" style="padding:16px;">
        <h4>📊 อัตราปันผลจากต้นทุนจริง (Yield on Cost)</h4>
        <table class="retro-table" style="width:100%">
          <thead><tr><th>ชื่อพอร์ต</th><th>ต้นทุนพอร์ต</th><th>ปันผลสะสม</th><th>YOC (%)</th></tr></thead>
          <tbody>
            ${this.portfolios.map(p => {
              const divs = this.dividendRecords ? this.dividendRecords.filter(r => r.portfolioId === p.id).reduce((s, r) => s + Number(r.amount), 0) : 0;
              return `<tr><td><b>${p.name}</b></td><td>${this.formatMoney(p.current, p.category)}</td><td class="text-success">${this.formatMoney(divs, p.category)}</td><td class="text-accent">${p.current > 0 ? ((divs/p.current)*100).toFixed(2)+'%' : '0.00%'}</td></tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // --- RESTORED HIGH-PERFORMANCE SETTINGS ENGINE ---
  renderSettings(container) {
    container.innerHTML = `
      <div class="border-pixel" style="padding:20px; display:flex; flex-direction:column; gap:16px;">
        <h3>⚙️ ระบบควบคุมและสำรองข้อมูล (Data Management)</h3>
        <p class="text-muted">สถานะระบบ Cloud: <b>${isFirebaseActive ? '🟢 ออนไลน์ (Realtime Active)' : '🔴 ออฟไลน์ (Local-Only)'}</b></p>
        
        <div style="border-top: 2px dashed #444; margin: 10px 0;"></div>
        
        <h4>📥 นำเข้าข้อมูลย้ายจากมือถือ (Import Backup JSON)</h4>
        <p style="font-size:0.85rem; color:var(--color-text-muted);">เปิดไฟล์คัดลอกข้อความด้านในไฟล์พอร์ต Q2 ข้อมูลดิบจากมือถือมาวางลงในกล่องด้านล่างนี้</p>
        <textarea id="import-json-area" class="input-retro" rows="8" style="width:100%; background:#0c1020; color:#fff; font-family:monospace; padding:10px;" placeholder="วางเนื้อหาข้อมูลจากไฟล์ .json ที่นี่..."></textarea>
        <button class="btn btn-success btn-retro btn-small" id="btn-execute-import" style="width:250px; margin-top:8px;">📥 ยืนยันโหลดฐานข้อมูล Q2</button>
      </div>
    `;

    document.getElementById('btn-execute-import').addEventListener('click', () => {
      const jsonStr = document.getElementById('import-json-area').value.trim();
      if (!jsonStr) { alert('❌ ไม่มีข้อมูลในช่องกรอกครับ'); return; }
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
          alert('🎯 [SUCCESS] ดึงยอดสินทรัพย์และข้อมูลไตรมาส Q2 จากมือถือเข้าคอมพิวเตอร์เรียบร้อยแล้ว!');
        } else {
          alert('❌ รูปแบบไฟล์ JSON ไม่ตรงกับพิมพ์เขียวระบบ');
        }
      } catch (e) {
        alert('❌ ไฟล์เสียหายหรือก๊อปปี้ข้อความมาไม่ครบโครงสร้าง: ' + e.message);
      }
    });
  }

  renderForexOption(c, cat) { c.innerHTML = '<div class="border-pixel" style="padding:20px">แดชบอร์ดรายเดือน</div>'; }
  renderCashFlow(c) { c.innerHTML = '<div class="border-pixel" style="padding:20px">คลังเสบียงสำรอง</div>'; }
  renderComparison(c) { c.innerHTML = '<div class="border-pixel" style="padding:20px">ตารางเปรียบเทียบภารกิจหลัก</div>'; }
  closeModals() { document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden')); }
}

window.app = new PixelStewardApp();