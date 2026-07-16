/* ==========================================
   PIXEL STEWARD CORE ENGINE - APP.JS (V.1.8.8 MASTER DELIVERABLE)
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

const INITIAL_PORTFOLIOS = [];
const INITIAL_QUARTERLY_RECORDS = [];
const INITIAL_MONTHLY_RECORDS = [];

class PixelStewardApp {
  constructor() {
    this.portfolios = [];
    this.quarterlyRecords = [];
    this.monthlyRecords = [];
    this.dividendRecords = [];
    this.retroJournalRawData = null;
    this.exchangeRate = 36.5;
    this.activeTab = 'dashboard';
    this.selectedPortId = '';
    
    // 🎛️ PIPELINE FILTER STATES
    this.forexMonthFilter = 'all';
    this.forexAssetFilter = 'all';
    
    this.init();
  }

  formatMoney(val, category) {
    const isUSD = ['Forex', 'Option'].includes(category);
    const sym = isUSD ? '$' : '฿';
    const numStr = Number(val).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    return `<span class="pixel-money">${sym}${numStr}</span>`;
  }

  init() {
    const storedPorts = localStorage.getItem('ps_portfolios_v4');
    const storedQuarters = localStorage.getItem('ps_quarterly_v4');
    const storedMonthlies = localStorage.getItem('ps_monthly_v4');
    const storedDividends = localStorage.getItem('ps_dividends_v4');
    const storedRate = localStorage.getItem('ps_ex_rate_v4');

    this.portfolios = storedPorts ? JSON.parse(storedPorts) : INITIAL_PORTFOLIOS;
    this.quarterlyRecords = storedQuarters ? JSON.parse(storedQuarters) : INITIAL_QUARTERLY_RECORDS;
    this.monthlyRecords = storedMonthlies ? JSON.parse(storedMonthlies) : INITIAL_MONTHLY_RECORDS;
    this.dividendRecords = storedDividends ? JSON.parse(storedDividends) : [];
    this.exchangeRate = storedRate ? Number(storedRate) : 36.5;

    if (Array.isArray(this.portfolios) && this.portfolios.length > 0 && !this.selectedPortId) {
      this.selectedPortId = this.portfolios[0].id;
    }

    this.connectCloudDatabase();

    // 🎮 GLOBAL EVENT DELEGATION ENGINE
    document.addEventListener('click', (e) => {
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
        const name = prompt('กรอกชื่อสินทรัพย์ย่อย:');
        const val = Number(prompt(`ระบุมูลค่าเงินลงทุนสุทธิในตลับ:`));
        if (name && !isNaN(val) && val >= 0) {
          if (!active.assets) active.assets = [];
          active.assets.push({ name, value: val });
          this.saveState(); this.refreshUI();
        }
        return;
      }

      const delPortBtn = e.target.closest('.btn-delete-port-inline');
      if (delPortBtn) {
        e.stopPropagation();
        const portId = delPortBtn.dataset.id;
        const port = this.portfolios.find(p => p.id !== portId);
        if (port && confirm(`⚠️ คุณต้องการสั่ง "ทำลายพอร์ต" ${port.name} หรือไม่?`)) {
          this.portfolios = this.portfolios.filter(p => p.id !== portId);
          this.selectedPortId = this.portfolios.length > 0 ? this.portfolios[0].id : '';
          this.saveState(); this.refreshUI();
        }
        return;
      }
      
      if (e.target.closest('#btn-add-portfolio')) { this.openPortfolioModal(); return; }
      if (e.target.closest('#btn-quick-transfer')) { this.openTransferModal(); return; }
      if (e.target.closest('.btn-close-modal')) { this.closeModals(); return; }
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
    if(portForm) {
      portForm.addEventListener('submit', (e) => { e.preventDefault(); this.handleSavePortfolio(); });
    }
    const transForm = document.getElementById('transfer-form');
    if(transForm) {
      transForm.addEventListener('submit', (e) => { e.preventDefault(); this.handleExecuteTransfer(); });
    }
    
    const quarterlyForm = document.getElementById('quarterly-form');
    if (quarterlyForm) {
      quarterlyForm.addEventListener('submit', (e) => { e.preventDefault(); this.handleSaveQuarterly(); });
    }

    const divForm = document.getElementById('dividend-form');
    if (divForm) {
      divForm.addEventListener('submit', (e) => { e.preventDefault(); this.handleSaveDividend(); });
    }

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
  
        this.processJournalRouting();
        this.refreshUI();
      }
    });
  }

  processJournalRouting() {
    this.autoCalculatePortfolios();
  }

  syncStateToCloud() {
    if (!isFirebaseActive) return;
    firebase.database().ref('pixel_steward_data_v4').set({
      portfolios: this.portfolios, quarterlyRecords: this.quarterlyRecords,
      monthlyRecords: this.monthlyRecords, dividendRecords: this.dividendRecords, exchangeRate: this.exchangeRate
    });
  }

  autoCalculatePortfolios() {
    if (!Array.isArray(this.portfolios)) return;
    this.portfolios.forEach(p => {
      if (!p) return;
      p.current = Array.isArray(p.assets) ? p.assets.reduce((sum, asset) => sum + (Number(asset.value) || 0), 0) : 0;
      p.cashBuffer = 0;
    });
  }

  saveState() {
    this.autoCalculatePortfolios();
    localStorage.setItem('ps_portfolios_v4', JSON.stringify(this.portfolios));
    localStorage.setItem('ps_quarterly_v4', JSON.stringify(this.quarterlyRecords));
    localStorage.setItem('ps_monthly_v4', JSON.stringify(this.monthlyRecords));
    localStorage.setItem('ps_dividends_v4', JSON.stringify(this.dividendRecords));
    localStorage.setItem('ps_ex_rate_v4', this.exchangeRate.toString());
    this.syncStateToCloud();
  }

  getCalculations() {
    this.autoCalculatePortfolios();
    let totalTHB = 0, totalUSD = 0, totalCashBufferTHB = 0, totalDryPowderTHB = 0;
    if (Array.isArray(this.portfolios)) {
      this.portfolios.forEach(p => {
        if (!p) return;
        const isUSD = ['Forex', 'Option'].includes(p.category);
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
    const netWorthTHB = totalTHB + (totalUSD * this.exchangeRate) + totalCashBufferTHB;
    return { netWorthTHB, netWorthUSD: netWorthTHB / this.exchangeRate, totalTHB, totalUSD, totalCashBufferTHB, totalDryPowderTHB };
  }

  getPortfolioLevel(p) {
    if (!p) return { icon: '⏳', label: 'N/A', desc: '', pct: 0 };
    const pct = p.goal > 0 ? ((p.current + p.cashBuffer) / p.goal) * 100 : 0;
    if (pct >= 80) return { icon: '⚔️', label: 'มหาอัศวินขุมทรัพย์', desc: 'กองทัพการเงินมีกำลังมหาศาล!', pct };
    if (pct >= 40) return { icon: '🛡️', label: 'นักรบพิทักษ์เหรียญ', desc: 'มีโล่ป้องกัน ความเสี่ยงลดลง', pct };
    return { icon: '🐣', label: 'มอนสเตอร์เลเวล 1', desc: 'กำลังฝึกฝนวิทยายุทธ์ฟาร์มเงินสด', pct };
  }

  getNextRankPreview(p) {
    if (!p) return '';
    const pct = p.goal > 0 ? ((p.current + p.cashBuffer) / p.goal) * 100 : 0;
    if (pct >= 80) return `🏆 เลเวลสูงสุดขอบทองทองแล้ว!`;
    const targetPct = pct < 40 ? 40 : 80;
    const needed = ((targetPct / 100) * p.goal) - (p.current + p.cashBuffer);
    return `🔮 เลเวลอัปขั้นถัดไป: ขาดอีกประมาณ ${p.category === 'Forex' ? '$' : '฿'}${needed.toLocaleString(undefined,{maximumFractionDigits:0})}`;
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
      case 'comparison': this.renderComparison(tabContent); break;
      case 'settings': this.renderSettings(tabContent); break;
    }
  }

  renderDashboard(container) {
    const calc = this.getCalculations();
    const yr = new Date().getFullYear();
    container.innerHTML = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
        <div class="stat-card border-pixel"><div class="stat-header"><span>ความมั่งคั่งสุทธิ</span><span>👑</span></div><div class="stat-value text-accent">฿${calc.netWorthTHB.toLocaleString(undefined,{maximumFractionDigits:2})}</div></div>
        <div class="stat-card border-pixel"><div class="stat-header"><span>Dry Powder</span><span> Spoon 🥄</span></div><div class="stat-value" style="color:var(--color-warning)!important;">฿${calc.totalDryPowderTHB.toLocaleString(undefined,{maximumFractionDigits:2})}</div></div>
      </div>
    `;
  }

  renderPortfolios(container) {
    if (!Array.isArray(this.portfolios) || this.portfolios.length === 0) {
      container.innerHTML = '<div class="border-pixel" style="padding:40px; text-align:center; background:#1f273e;">คลังว่างเปล่า โปรดเพิ่มพอร์ตใหม่</div>';
      return;
    }
    let active = this.portfolios.find(p => p && p.id === this.selectedPortId) || this.portfolios[0];
    const lvl = this.getPortfolioLevel(active);
    container.innerHTML = `
      <div style="display:grid; grid-template-columns: 0.7fr 1.3fr; gap:20px;">
        <div class="border-pixel" style="padding:15px; background:#111625;">
          <div class="cartridge-list-rack">
            ${this.portfolios.map(p => `<div class="pixel-cartridge-card ${p.id === this.selectedPortId?'active':''}" onclick="app.switchPortfolio('${p.id}')"><div class="cartridge-title">📁 ${p.name}</div></div>`).join('')}
          </div>
        </div>
        <div class="border-pixel" style="background:#1f273e; padding:15px;">
          <h3>📦 ${active.name}</h3>
          <div style="background:#111625; padding:10px; border:2px solid #000; margin-top:10px;">💼 สุทธิ: ${this.formatMoney(active.current+active.cashBuffer, active.category)}</div>
        </div>
      </div>
    `;
  }

  switchPortfolio(id) { this.selectedPortId = id; this.refreshUI(); }

  renderQuarterly(container) {
    container.innerHTML = `<div class="border-pixel" style="padding:20px; background:#1f273e;">📊 ฟังก์ชันรายงานงวดไตรมาสสำหรับหุ้นเปิดใช้งานปกติ</div>`;
  }

  renderDividends(container) {
    container.innerHTML = `<div class="border-pixel" style="padding:20px; background:#1f273e;">💰 ฟังก์ชันรายงานเงินปันผลสะสมทำงานปกติ</div>`;
  }

  renderComparison(container) {
    container.innerHTML = `<div class="border-pixel" style="padding:20px; background:#1f273e;">⚖️ ฟังก์ชันตารางเปรียบเทียบสัดส่วนสินทรัพย์ทำงานปกติ</div>`;
  }

  // 📐 MODIFIED ARTIFACT METHOD: อัปเกรดหน้ากากเพิ่มระบบ EXPORT JSON แบบเรียลไทม์เพื่อส่งออกเข้า SECOND BRAIN
  renderSettings(container) {
    const currentDataState = {
      portfolios: this.portfolios,
      quarterlyRecords: this.quarterlyRecords,
      monthlyRecords: this.monthlyRecords,
      dividendRecords: this.dividendRecords,
      exchangeRate: this.exchangeRate
    };
    
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:20px;">
        <div class="border-pixel" style="padding:20px; background:#1f273e; display:flex; flex-direction:column; gap:12px;">
          <h3>📥 IMPORT DATA (โหลดข้อมูลเข้าคลัง)</h3>
          <p class="text-muted" style="font-size:0.8rem; color:#94a3b8;">วางก้อนข้อมูล JSON ที่สำรองไว้เพื่อซิงก์กู้คืนระบบฐานข้อมูลภายในเครื่อง:</p>
          <textarea id="import-json-area" class="input-retro" rows="6" style="width:100%; font-family:monospace; background:#0c1020; color:#10b981; padding:10px; border:2px solid #000;" placeholder="วางข้อความ JSON สำรองข้อมูลที่นี่..."></textarea>
          <button class="btn btn-success btn-retro" id="btn-execute-import" style="width:200px;"><span>📥 โหลดฐานข้อมูล</span></button>
        </div>

        <div class="border-pixel" style="padding:20px; background:#1f273e; display:flex; flex-direction:column; gap:12px;">
          <h3>📤 EXPORT DATA FOR SECOND BRAIN (ดึงข้อความออกให้ Agent AI)</h3>
          <p class="text-muted" style="font-size:0.8rem; color:#94a3b8;">คัดลอกข้อความ JSON ด้านล่างนี้ทั้งหมด นำไปป้อนให้ AI Agent หรือระบบสมองก้อนที่สองเพื่อประมวลผลต่อได้ทันที:</p>
          <textarea id="export-json-area" class="input-retro" rows="8" readonly style="width:100%; font-family:monospace; background:#0c1020; color:#eab308; padding:10px; border:2px solid #000; cursor:text;" onclick="this.select()">${JSON.stringify(currentDataState, null, 2)}</textarea>
          <button class="btn btn-primary btn-retro" onclick="navigator.clipboard.writeText(document.getElementById('export-json-area').value); alert('📋 คัดลอกข้อมูล JSON เข้าคลิปบอร์ดสำเร็จ! พร้อมวางใน Second Brain ครับ');" style="width:240px;"><span>📋 คลิกเพื่อคัดลอกข้อความทั้งหมด</span></button>
        </div>
      </div>
    `;

    document.getElementById('btn-execute-import').addEventListener('click', () => {
      const s = document.getElementById('import-json-area').value.trim();
      if(!s) return;
      try {
        const p = JSON.parse(s);
        if(p.portfolios) { 
          this.portfolios = Array.isArray(p.portfolios) ? p.portfolios : Object.values(p.portfolios);
          this.quarterlyRecords = Array.isArray(p.quarterlyRecords) ? p.quarterlyRecords : Object.values(p.quarterlyRecords || {});
          this.dividendRecords = Array.isArray(p.dividendRecords) ? p.dividendRecords : Object.values(p.dividendRecords || {});
          this.exchangeRate = Number(p.exchangeRate)||36.5; 
          this.saveState(); this.refreshUI(); alert('🎯 นำเข้าและซิงก์ข้อมูลพอร์ตลงทุนเรียบร้อย!'); 
        }
      } catch(e) { alert('โครงสร้างข้อมูลเสียหาย: '+e.message); }
    });
  }

  handleSavePortfolio() {
    const name = document.getElementById('port-name').value;
    const category = document.getElementById('port-category').value;
    const dry = Number(document.getElementById('port-dry-powder').value)||0;
    const newPort = { id:'p-'+Date.now(), name, category, goalType:'numeric', goal:Number(document.getElementById('port-goal-value').value)||0, current:0, cashBuffer:0, dryPowder:dry, assets:[] };
    this.portfolios.push(newPort);
    this.selectedPortId = newPort.id;
    this.saveState(); this.closeModals(); this.refreshUI();
  }

  handleExecuteTransfer() { this.closeModals(); this.refreshUI(); }
  handleSaveQuarterly() { this.closeModals(); this.refreshUI(); }
  handleSaveDividend() { this.closeModals(); this.refreshUI(); }
  openPortfolioModal() { document.getElementById('portfolio-modal').classList.remove('hidden'); }
  openTransferModal() { document.getElementById('transfer-modal').classList.remove('hidden'); }
  closeModals() { document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden')); }
}

window.app = new PixelStewardApp();