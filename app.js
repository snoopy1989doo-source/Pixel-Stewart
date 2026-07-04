/* ==========================================
   PIXEL STEWARD CORE ENGINE - APP.JS (V.1.7.5 STRICT PERFORMANCE)
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
        const port = this.portfolios.find(p => p.id === portId);
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
    console.log("📡 Pixel Steward Realtime Cloud Pipeline: WORKING");

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

    firebase.database().ref('retro_trading_journal_data').on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        this.retroJournalRawData = data;
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
      if (p.category === 'Forex') {
        if (this.retroJournalRawData) {
          const trades = Array.isArray(this.retroJournalRawData.trades) ? this.retroJournalRawData.trades : Object.values(this.retroJournalRawData.trades || {});
          const cfs = Array.isArray(this.retroJournalRawData.cfs) ? this.retroJournalRawData.cfs : Object.values(this.retroJournalRawData.cfs || {});
          const targetName = p.name || 'Demo';

          const accTrades = trades.filter(t => t && (t.account || 'Demo') === targetName);
          const accCFs = cfs.filter(c => c && (c.account || 'Demo') === targetName);

          const totalDep = accCFs.filter(c => c.type === 'Deposit').reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
          const totalWit = accCFs.filter(c => c.type === 'Withdraw').reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
          const cumProfit = accTrades.reduce((sum, t) => sum + (Number(t.pnl) || 0), 0);
          const baseBalance = targetName === 'Demo' ? (Number(this.retroJournalRawData.balance) || 0) : 0;
          
          p.current = baseBalance + totalDep - totalWit + cumProfit;
          p.cashBuffer = 0;
        }
      } else {
        const totalAssets = Array.isArray(p.assets) ? p.assets.reduce((sum, asset) => sum + (Number(asset.value) || 0), 0) : 0;
        const bufferAsset = Array.isArray(p.assets) ? p.assets.find(a => a && a.name && (a.name.toLowerCase().includes('buffer') || a.name.includes('สำรอง'))) : null;
        p.cashBuffer = bufferAsset ? (Number(bufferAsset.value) || 0) : 0;
        p.current = Math.max(totalAssets - p.cashBuffer, 0);
      }
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
    if (pct >= 80) return `🏆 เลเวลสูงสุดขอบทองทองแล้ว!`;
    const targetPct = pct < 40 ? 40 : 80;
    const needed = ((targetPct / 100) * p.goal) - (p.current + p.cashBuffer);
    return `🔮 เลเวลอัปขั้นถัดไป: ขาดอีกประมาณ ${p.category === 'Forex'||p.category === 'Option' ? '$' : '฿'}${needed.toLocaleString(undefined,{maximumFractionDigits:0})}`;
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
      case 'forex': this.renderForexCloud(tabContent); break;
      case 'option': this.renderOptionManual(tabContent); break;
      case 'cashflow': this.renderCashFlow(tabContent); break;
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
        const rate = p && ['Forex', 'Option'].includes(p.category) ? this.exchangeRate : 1;
        q1 += (r.q1||0)*rate; q2 += (r.q2||0)*rate; q3 += (r.q3||0)*rate; q4 += (r.q4||0)*rate;
      });
    }
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
            ${this.portfolios.length===0?'<p class="text-muted" style="text-align:center;font-size:0.8rem;padding-top:20px;">คลังว่างเปล่า โปรดเพิ่มพอร์ตใหม่</p>':topGoals.map(g => `<div style="background:#111625; padding:8px; border:2px solid #000;"><div style="display:flex; justify-content:space-between; font-size:0.8rem;"><span>${g.name}</span><b style="color:var(--color-success);">${g.pct.toFixed(1)}%</b></div><div class="progress-container" style="margin-top:4px; height:6px;"><div class="progress-bar-fill" style="width:${Math.min(100,g.pct)}%; background:var(--color-accent); height:100%;"></div></div></div>`).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderPortfolios(container) {
    if (!Array.isArray(this.portfolios) || this.portfolios.length === 0) {
      container.innerHTML = '<div class="border-pixel" style="padding:40px; text-align:center; background:#1f273e;">🎮 ยินดีต้อนรับสู่ระบบ Pixel Steward รุ่นแกะกล่องใหม่เอี่ยม<br><br><small class="text-muted">โปรดกดปุ่ม "➕ เพิ่มพอร์ตใหม่" ด้านบนเพื่อเริ่มจัดตั้งพอร์ตลงทุนของคุณด้วยตนเองครับ</small></div>';
      return;
    }
    let active = this.portfolios.find(p => p && p.id === this.selectedPortId) || this.portfolios[0];
    this.selectedPortId = active.id;
    const lvl = this.getPortfolioLevel(active);
    const isUSD = ['Forex', 'Option'].includes(active.category);
    const weight = this.getCalculations().netWorthTHB > 0 ? (((active.current+active.cashBuffer)*(isUSD?this.exchangeRate:1))/this.getCalculations().netWorthTHB)*100 : 0;

    container.innerHTML = `
      <div style="display:grid; grid-template-columns: 0.7fr 1.3fr; gap:20px;">
        <div class="border-pixel" style="padding:15px; background:#111625;">
          <h4 style="font-family:'Press Start 2P'; font-size:0.6rem; color:#3b82f6; margin-bottom:10px; border-bottom:2px solid #000; padding-bottom:6px;">🎮 CARTRIDGE RACK</h4>
          <div class="cartridge-list-rack">
            ${this.portfolios.map(p => {
              if(!p) return '';
              return `
              <div class="pixel-cartridge-card ${p.id === this.selectedPortId?'active':''}" onclick="app.switchPortfolio('${p.id}')">
                <button class="btn-delete-port-inline" data-id="${p.id}">✖</button>
                <div class="cartridge-title">📁 ${p.name}</div>
                <div class="cartridge-meta"><span>${p.category}</span><b>${this.getPortfolioLevel(p).icon}</b></div>
                <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-top:4px; font-weight:bold; color:#10b981;">
                  <span>${this.formatMoney(p.current+p.cashBuffer, p.category)}</span>
                  ${p.dryPowder<=0?'<span class="ammo-warning-tag">⚠️ NO AMMO</span>':''}
                </div>
              </div>`;
            }).join('')}
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
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #000; padding-bottom:4px;"><span style="font-size:0.8rem; font-weight:bold;">💎 สินทรัพย์ย่อย</span><button class="btn btn-primary btn-retro btn-small" id="btn-add-asset" style="padding:2px 6px;"><span>➕ เพิ่ม</span></button></div>
              <div style="display:flex; flex-direction:column; gap:6px; margin-top:8px; max-height:180px; overflow-y:auto;">
                ${active.category==='Forex'?'<p style="color:#eab308; font-size:0.75rem; text-align:center; padding:10px;">⚡ ข้อมูลดึงพอร์ตเชื่อมคลาวด์ Retro Trading อัตโนมัติ</p>':(!active.assets || active.assets.length===0)?'<p class="text-muted" style="font-size:0.8rem; text-align:center;">คลังว่างเปล่า</p>':active.assets.map((a,i)=>`<div style="display:flex; justify-content:space-between; background:#111625; padding:6px; border:2px solid #000; font-size:0.8rem;"><span>🔸 ${a.name}</span><div><b style="margin-right:8px;">${this.formatMoney(a.value, active.category)}</b><button class="btn btn-danger btn-small" onclick="app.deleteAsset('${active.id}',${i})" style="padding:0 4px;">✖</button></div></div>`).join('')}
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
                <input type="number" id="update-dry" class="input-retro" value="${active.dryPowder||0}" required style="width:100%;">
                <input type="submit" class="btn btn-success btn-retro" style="width:100%; padding:4px; font-weight:bold;" value="💾 บันทึกเงินช้อน">
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('update-balance-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const p = this.portfolios.find(x => x && x.id === active.id);
      if (p) { p.dryPowder = Number(document.getElementById('update-dry').value); this.saveState(); this.refreshUI(); alert('🎯 อัปเดตเงินช้อนสำเร็จ!'); }
    });
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

  // 💵 FOREX DYNAMIC ANALYTICS CORE (V.1.7.5 STRICT PERFORMANCE)
  renderForexCloud(container) {
    if (!this.retroJournalRawData) {
      container.innerHTML = '<div class="border-pixel" style="padding:20px; background:#1f273e; text-align:center;">📡 กำลังเชื่อมต่อและสแกนหาสัญญาณเรียลไทม์จาก Retro Trading Journal...</div>';
      return;
    }

    const trades = Array.isArray(this.retroJournalRawData.trades) ? this.retroJournalRawData.trades : Object.values(this.retroJournalRawData.trades || {});
    
    const uniqueMonths = [...new Set(trades.map(t => t && t.date ? t.date.substring(0, 7) : ''))].filter(Boolean).sort().reverse();
    const uniqueAssets = [...new Set(trades.map(t => t && t.symbol ? t.symbol : ''))].filter(Boolean).sort();

    const filteredTrades = trades.filter(t => {
      if (!t) return false;
      const monthMatch = this.forexMonthFilter === 'all' || (t.date && t.date.startsWith(this.forexMonthFilter));
      const assetMatch = this.forexAssetFilter === 'all' || t.symbol === this.forexAssetFilter;
      return monthMatch && assetMatch;
    });

    // 🧠 ADVANCED METRIC LOGIC (เงินคิดครบทุกไม้เด็ดขาด | Win Count กรองไม้ BE เศษทศนิยมออก)
    let netPnL = 0;
    let winCount = 0;
    let grossProfit = 0;
    let grossLoss = 0;

    filteredTrades.forEach(t => {
      const pnl = Number(t.pnl) || 0;
      netPnL += pnl; // เงินวิ่งรวมเข้า Net พอร์ตจริงทุกไม้แน่นอน 
      
      if (pnl > 0.90) { 
        // 🎯 คัดเฉพาะไม้กำไรเนื้อๆ เกิน $0.90 ขึ้นไปเท่านั้นเพื่อวัดอัตราชนะที่แม่นยำ
        winCount++;
        grossProfit += pnl;
      } else if (pnl < 0) {
        grossLoss += Math.abs(pnl);
      } else {
        // ⏳ ไม้ BE (บวกเศษ 0 ถึง 0.90 ดอลลาร์) เงินคำนวณเข้าตลับปกติ แต่ไม่เพิ่ม Win Rate ให้หลอกตา
        grossProfit += pnl;
      }
    });

    const totalTradesCount = filteredTrades.length;
    const winRate = totalTradesCount > 0 ? (winCount / totalTradesCount) * 100 : 0;
    const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : (grossProfit > 0 ? '∞' : '1.00');

    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:20px;">
        
        <!-- กล่องวิเคราะห์สถิติชั้นสูง -->
        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:15px;">
          <div class="border-pixel" style="background:#111625; padding:12px; text-align:center;">
            <div style="font-size:0.65rem; color:#64748b; font-family:'Press Start 2P'; margin-bottom:6px;">NET P&L</div>
            <div class="pixel-money" style="font-size:1.25rem!important; font-weight:bold; color:${netPnL >= 0 ? '#10b981' : '#ef4444'};">
              ${netPnL >= 0 ? '+' : ''}$${netPnL.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
          </div>
          <div class="border-pixel" style="background:#111625; padding:12px; text-align:center;">
            <div style="font-size:0.65rem; color:#64748b; font-family:'Press Start 2P'; margin-bottom:6px;">WIN RATE</div>
            <div class="pixel-money" style="font-size:1.25rem!important; font-weight:bold; color:#eab308;">
              ${winRate.toFixed(1)}%
            </div>
          </div>
          <div class="border-pixel" style="background:#111625; padding:12px; text-align:center;">
            <div style="font-size:0.65rem; color:#64748b; font-family:'Press Start 2P'; margin-bottom:6px;">PROFIT FACTOR</div>
            <div class="pixel-money" style="font-size:1.25rem!important; font-weight:bold; color:#3b82f6;">
              ${profitFactor}
            </div>
          </div>
          <div class="border-pixel" style="background:#111625; padding:12px; text-align:center;">
            <div style="font-size:0.65rem; color:#64748b; font-family:'Press Start 2P'; margin-bottom:6px;">TOTAL TRADES</div>
            <div class="pixel-money" style="font-size:1.25rem!important; font-weight:bold; color:#fff;">
              ${totalTradesCount} ไม้
            </div>
          </div>
        </div>

        <!-- แผงคัดกรองช่วงเวลาข้อมูล -->
        <div class="border-pixel" style="background:#1f273e; padding:12px; display:flex; gap:20px; align-items:center;">
          <div style="display:flex; align-items:center; gap:8px;">
            <label style="font-size:0.75rem; font-weight:bold; color:#94a3b8;">📅 เลือกงวดเดือน:</label>
            <select id="fx-filter-month" class="input-retro" style="padding:4px 8px; font-size:0.75rem; background:#0c1020; color:#fff; border:2px solid #000;">
              <option value="all" ${this.forexMonthFilter === 'all' ? 'selected' : ''}>🗓️ ทั้งหมดทุกงวด</option>
              ${uniqueMonths.map(m => `<option value="${m}" ${this.forexMonthFilter === m ? 'selected' : ''}>📅 ${m}</option>`).join('')}
            </select>
          </div>

          <div style="display:flex; align-items:center; gap:8px;">
            <label style="font-size:0.75rem; font-weight:bold; color:#94a3b8;">🪙 สินทรัพย์:</label>
            <select id="fx-filter-asset" class="input-retro" style="padding:4px 8px; font-size:0.75rem; background:#0c1020; color:#fff; border:2px solid #000;">
              <option value="all" ${this.forexAssetFilter === 'all' ? 'selected' : ''}>🪙 สินทรัพย์ทั้งหมด</option>
              ${uniqueAssets.map(a => `<option value="${a}" ${this.forexAssetFilter === a ? 'selected' : ''}>🔸 ${a}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- ตารางแสดงผลประวัติการเทรดระเบียบสูง -->
        <div class="border-pixel" style="padding:15px; background:#1f273e;">
          <h4 style="font-family:'Press Start 2P'; font-size:0.6rem; color:#64748b; margin-bottom:12px;">📜 LOG HISTORY</h4>
          <div style="background:#111625; padding:8px; border:2px solid #000; max-height:360px; overflow-y:auto;">
            <table class="retro-table" style="width:100%; font-size:0.8rem; border-collapse:collapse; text-align:left;">
              <thead>
                <tr style="background:#0c1020; color:#94a3b8; border-bottom:2px solid #000;">
                  <th style="padding:8px; text-align:center;">วันเทรด</th>
                  <th style="padding:8px; text-align:center;">สินทรัพย์</th>
                  <th style="padding:8px; text-align:center;">คำสั่ง</th>
                  <th style="padding:8px; text-align:right; padding-right:15px;">กำไร/ขาดทุน (USD)</th>
                  <th style="padding:8px; text-align:center;">คลังพอร์ต</th>
                </tr>
              </thead>
              <tbody>
                ${filteredTrades.length === 0 
                  ? '<tr><td colspan="5" style="text-align:center; padding:30px; color:#64748b;">📭 ไม่พบประวัติการเทรดตามเงื่อนไขตัวกรอง</td></tr>'
                  : filteredTrades.map(t => {
                      if(!t) return '';
                      const amt = Number(t.pnl) || 0;
                      return `
                      <tr style="border-bottom:1px solid #222; background:#111625;">
                        <td style="padding:8px; text-align:center; color:#94a3b8; font-family:monospace;">${t.date || ''}</td>
                        <td style="padding:8px; text-align:center; font-weight:bold; color:#3b82f6;">${t.symbol || ''}</td>
                        <td style="padding:8px; text-align:center;"><span style="background:${t.dir==='Buy'?'#064e3b':'#7f1d1d'}; color:${t.dir==='Buy'?'#10b981':'#f87171'}; padding:2px 6px; border:1px solid #000; font-size:0.7rem; font-weight:bold;">${(t.dir || 'BUY').toUpperCase()}</span></td>
                        <td style="padding:8px; text-align:right; padding-right:15px; font-weight:bold; font-family:monospace; color:${amt >= 0 ? '#10b981' : '#ef4444'};">
                          ${amt >= 0 ? '+' : ''}$${amt.toLocaleString(undefined,{minimumFractionDigits:2, maximumFractionDigits:2})}
                        </td>
                        <td style="padding:8px; text-align:center; color:#eab308; font-size:0.75rem;">${t.account||'Demo'}</td>
                      </tr>`;
                    }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>`;

    setTimeout(() => {
      const monthSelect = document.getElementById('fx-filter-month');
      const assetSelect = document.getElementById('fx-filter-asset');
      if (monthSelect) {
        monthSelect.addEventListener('change', (e) => {
          this.forexMonthFilter = e.target.value;
          this.refreshUI();
        });
      }
      if (assetSelect) {
        assetSelect.addEventListener('change', (e) => {
          this.forexAssetFilter = e.target.value;
          this.refreshUI();
        });
      }
    }, 0);
  }

  renderQuarterly(container) {
    const stockPorts = Array.isArray(this.portfolios) ? this.portfolios.filter(p => p && !['Forex', 'Option'].includes(p.category)) : [];
    const year = new Date().getFullYear();
    if(stockPorts.length===0){ container.innerHTML='<div class="border-pixel" style="padding:20px; background:#1f273e;">ไม่มีรายการหุ้นรายไตรมาส (โปรดตั้งค่าเปิดตลับพอร์ตหลักก่อนครับ)</div>'; return; }
    
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:16px;">
        ${stockPorts.map(p => {
          if(!p) return '';
          const r = this.quarterlyRecords.find(x => x && x.portfolioId === p.id && x.year === year) || { q1:0, f1:0, q2:0, f2:0, q3:0, f3:0, q4:0, f4:0, notes:'' };
          const calcTWR = (cur, flow, prev) => {
            if (!prev || prev <= 0) return { text: 'N/A', cls: 'text-muted' };
            const pct = ((cur - flow - prev) / prev) * 100;
            return { text: (pct >= 0 ? '+' : '') + pct.toFixed(2) + '%', cls: pct >= 0 ? 'text-success' : 'text-danger' };
          };
          const g2 = calcTWR(r.q2, r.f2, r.q1); const g3 = calcTWR(r.q3, r.f3, r.q2); const g4 = calcTWR(r.q4, r.f4, r.q3);
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
            </div>`;
        }).join('')}
      </div>`;
  }

  openQuarterlyModal(portfolioId, year) {
    const port = this.portfolios.find(p => p && p.id === portfolioId); if (!port) return;
    document.getElementById('q-port-id').value = portfolioId; document.getElementById('q-year').value = year;
    document.getElementById('q-port-label').innerText = `พอร์ต: ${port.name} (${year})`;
    const rec = this.quarterlyRecords.find(r => r && r.portfolioId === portfolioId && r.year === year) || { q1:'', f1:0, q2:'', f2:0, q3:'', f3:0, q4:'', f4:0, notes:'' };
    document.getElementById('q-val-q1').value = rec.q1; document.getElementById('q-flow-q1').value = rec.f1;
    document.getElementById('q-val-q2').value = rec.q2; document.getElementById('q-flow-q2').value = rec.f2;
    document.getElementById('q-val-q3').value = rec.q3; document.getElementById('q-flow-q3').value = rec.f3;
    document.getElementById('q-val-q4').value = rec.q4; document.getElementById('q-flow-q4').value = rec.f4;
    document.getElementById('q-notes').value = rec.notes || '';
    document.getElementById('quarterly-modal').classList.remove('hidden');
  }

  renderOptionManual(container) {
    const optionPorts = Array.isArray(this.portfolios) ? this.portfolios.filter(p => p && p.category === 'Option') : [];
    const records = Array.isArray(this.monthlyRecords) ? this.monthlyRecords.filter(r => r && optionPorts.map(p => p.id).includes(r.portfolioId)) : [];
    container.innerHTML = `
      <div class="border-pixel" style="padding:15px; background:#1f273e;">
        <h4 style="font-family:'Press Start 2P'; font-size:0.65rem; color:var(--color-accent); margin-bottom:10px;">💎 บันทึกงวดสัญญา Option (แมนนวลร้อยเปอร์เซ็นต์)</h4>
        <div style="display:grid; grid-template-columns:1fr 2fr; gap:15px;">
          <div class="border-pixel-inset" style="padding:12px; background:#111625;">
            <label style="font-size:0.8rem;">เลือกพอร์ต:</label>
            <select id="opt-port-select" class="input-retro" style="width:100%; margin-bottom:8px;">${optionPorts.length===0?'<option>ไม่มีตลับพอร์ตออปชัน</option>':optionPorts.map(p=>`<option value="${p.id}">${p.name}</option>`).join('')}</select>
            <label style="font-size:0.8rem;">เดือนงวด:</label>
            <select id="opt-month-select" class="input-retro" style="width:100%; margin-bottom:8px;">${[...Array(12).keys()].map(i=>`<option value="${i+1}">เดือน ${i+1}</option>`).join('')}</select>
            <label style="font-size:0.8rem;">P/L สุทธิ (USD):</label>
            <input type="number" id="opt-pl-input" class="input-retro" style="width:100%; margin-bottom:12px;" placeholder="เช่น 150 หรือ -80">
            <button class="btn btn-success btn-retro" id="btn-save-opt-manual" style="width:100%;"><span>💾 บันทึกงวดสัญญา</span></button>
          </div>
          <div class="border-pixel-inset" style="padding:12px; background:#111625;">
            <h5>📜 ประวัติสัญญารายเดือนย่อย</h5>
            <div style="max-height:220px; overflow-y:auto; font-size:0.85rem; margin-top:8px;">
              ${records.length===0?'<p class="text-muted">ไม่มีประวัติคงเหลือตลับเซฟสะอาดพร้อมใช้งาน</p>':records.map(r=>`<div style="display:flex; justify-content:space-between; border-bottom:1px solid #333; padding:6px 0;"><span><b>${this.portfolios.find(x=>x && x.id===r.portfolioId)?.name || ''}</b> (เดือน ${r.month})</span><b class="${(r.profitLossUSD||0)>=0?'text-success':'text-danger'}">${(r.profitLossUSD||0)>=0?'+':''}$${r.profitLossUSD || 0}</b></div>`).join('')}
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
      <div class="border-pixel" style="padding:15px; background:#1f273e;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;"><h4>💰 วิเคราะห์ข้อมูลปันผล & Yield on Cost (YOC)</h4><button class="btn btn-success btn-retro btn-small" onclick="document.getElementById('dividend-modal').classList.remove('hidden')">➕ บันทึกปันผล</button></div>
        <table class="retro-table" style="width:100%; border-collapse:collapse; font-size:0.85rem;">
          <thead><tr style="background:#111625;"><th style="padding:8px; border:2px solid #000;">ชื่อพอร์ต</th><th style="padding:8px; border:2px solid #000;">ต้นทุนสินทรัพย์ย่อย</th><th style="padding:8px; border:2px solid #000;">รวมรับปันผล</th><th style="padding:8px; border:2px solid #000; color:var(--color-accent);">YOC Score</th></tr></thead>
          <tbody>
            ${(!Array.isArray(this.portfolios) || this.portfolios.length===0)?'<tr><td colspan="4" style="text-align:center;padding:15px;" class="text-muted">ไม่มีพอร์ตลงทุนในคลังคลาวด์</td></tr>':this.portfolios.map(p => {
              if(!p) return '';
              const divs = Array.isArray(this.dividendRecords) ? this.dividendRecords.filter(x=>x && x.portfolioId===p.id).reduce((s,x)=>s+Number(x.amount||0),0) : 0;
              const yoc = p.current>0?((divs/p.current)*100).toFixed(2)+'%':'0.00%';
              return `<tr><td style="padding:8px; border:2px solid #000;"><b>${p.name}</b></td><td style="padding:8px; border:2px solid #000;">${this.formatMoney(p.current||0,p.category)}</td><td style="padding:8px; border:2px solid #000; color:var(--color-success);">${this.formatMoney(divs,p.category)}</td><td style="padding:8px; border:2px solid #000; font-weight:bold; color:var(--color-accent);">${yoc}</td></tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>`;
    const select = document.getElementById('div-port-id'); if(select && Array.isArray(this.portfolios)) select.innerHTML = this.portfolios.map(p=>p?`<option value="${p.id}">${p.name}</option>`:'').join('');
  }

  renderCashFlow(container) {
    if(!Array.isArray(this.portfolios) || this.portfolios.length===0){ container.innerHTML='<div class="border-pixel" style="padding:20px; background:#1f273e;">ไม่มีสภาพคล่องคงเหลือ (ตลับเซฟว่างเปล่า)</div>'; return; }
    container.innerHTML = `
      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap:16px;">
        ${this.portfolios.map(p => {
          if(!p) return '';
          const liquidity = (p.cashBuffer||0) + (p.dryPowder||0);
          const statusText = liquidity > 50000 ? '🍀 สภาพคล่องพรีเมียม' : liquidity > 10000 ? '⚡ ระดับปกติ' : '⚠️ วิกฤตเสบียงต่ำ';
          const badgeClass = liquidity > 50000 ? 'badge-success' : liquidity > 10000 ? 'badge-warning' : 'badge-danger';
          return `
            <div class="border-pixel" style="background:#1f273e; padding:15px; position:relative;">
              <span class="badge ${badgeClass}" style="position:absolute; top:10px; right:10px; font-size:0.7rem;">${statusText}</span>
              <h4>${p.name}</h4><span class="port-card-cat" style="font-size:0.7rem;">${p.category}</span>
              <div class="border-pixel-inset" style="padding:10px; background:#111625; font-size:0.85rem; margin-top:10px; display:flex; flex-direction:column; gap:4px;">
                <div style="display:flex; justify-content:space-between;"><span>สำรอง Buffer:</span><span style="color:var(--color-secondary); font-weight:bold;">${this.formatMoney(p.cashBuffer||0,p.category)}</span></div>
                <div style="display:flex; justify-content:space-between;"><span>กองเงินช้อน Dry:</span><span style="color:var(--color-warning); font-weight:bold;">${this.formatMoney(p.dryPowder||0, p.category)}</span></div>
                <div style="border-top:1px solid #444; margin-top:4px; padding-top:4px; display:flex; justify-content:space-between;"><span>สภาพคล่องรวม:</span><b>${this.formatMoney(liquidity, p.category)}</b></div>
              </div>
            </div>`;
        }).join('')}
      </div>`;
  }

  renderComparison(container) {
    if(!Array.isArray(this.portfolios) || this.portfolios.length===0){ container.innerHTML='<div class="border-pixel" style="padding:20px; background:#1f273e;">ไม่มีตารางเปรียบเทียบ (ตลับเซฟว่างเปล่า)</div>'; return; }
    container.innerHTML = `
      <div class="border-pixel" style="padding:15px; background:#1f273e; overflow-x:auto;">
        <table class="retro-table" style="width:100%; border-collapse:collapse; font-size:0.8rem; text-align:left;">
          <thead><tr style="background:#111625;"><th style="padding:8px; border:2px solid #000;">ชื่อพอร์ต</th><th style="padding:8px; border:2px solid #000;">เป้าหมายรวม</th><th style="padding:8px; border:2px solid #000;">พอร์ตรวมจริง (THB)</th><th style="padding:8px; border:2px solid #000;">ส่วนต่างที่ขาด (THB)</th><th style="padding:8px; border:2px solid #000; color:var(--color-success);">เควสสเกล</th></tr></thead>
          <tbody>
            ${this.portfolios.map(p => {
              if(!p) return '';
              const r = ['Forex', 'Option'].includes(p.category)?this.exchangeRate:1;
              const curTHB = ((p.current||0)+(p.cashBuffer||0))*r; const goalTHB = p.goalType==='numeric'?((p.goal||0)*r):0; const diff = p.goalType==='numeric'?Math.max(goalTHB-curTHB,0):0; const pct = p.goalType==='numeric'?(p.goal>0?(curTHB/goalTHB)*100:0):(p.dcaDoneThisMonth?100:0);
              return `<tr><td style="padding:8px; border:2px solid #000;"><b>${p.name}</b></td><td style="padding:8px; border:2px solid #000;">${p.goalType==='numeric'?this.formatMoney(p.goal||0,p.category):p.goalSchedule}</td><td style="padding:8px; border:2px solid #000;">฿${curTHB.toLocaleString(undefined,{maximumFractionDigits:0})}</td><td style="padding:8px; border:2px solid #000; color:#ef4444;">${diff>0?'฿'+diff.toLocaleString(undefined,{maximumFractionDigits:0}):'✔️ เควสเคลียร์'}</td><td style="padding:8px; border:2px solid #000; font-family:'Press Start 2P'; font-size:0.55rem; color:var(--color-success);">${pct.toFixed(1)}%</td></tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>`;
  }

  renderSettings(container) {
    container.innerHTML = `
      <div class="border-pixel" style="padding:20px; background:#1f273e; display:flex; flex-direction:column; gap:12px;">
        <h3>⚙️ จัดการคลาวด์เซฟสถิติระบบนิเวศ (V.1.7.5)</h3>
        <p>การเชื่อมต่อ Realtime Firebase: <b>${isFirebaseActive?'🟢 CONNECTED':'🔴 LOCAL ONLY'}</b></p>
        <textarea id="import-json-area" class="input-retro" rows="8" style="width:100%; font-family:monospace; background:#0c1020; color:#10b981; padding:10px; border:2px solid #000;" placeholder="วางข้อความวัตถุดิบ JSON สำรองข้อมูลที่นี่..."></textarea>
        <button class="btn btn-success btn-retro" id="btn-execute-import" style="width:180px;"><span>📥 โหลดฐานข้อมูล</span></button>
      </div>`;
    document.getElementById('btn-execute-import').addEventListener('click', () => {
      const s = document.getElementById('import-json-area').value.trim(); if(!s) return;
      try {
        const p = JSON.parse(s);
        if(p.portfolios) { 
          this.portfolios = Array.isArray(p.portfolios) ? p.portfolios : Object.values(p.portfolios);
          this.quarterlyRecords = Array.isArray(p.quarterlyRecords) ? p.quarterlyRecords : Object.values(p.quarterlyRecords || {});
          this.monthlyRecords = Array.isArray(p.monthlyRecords) ? p.monthlyRecords : Object.values(p.monthlyRecords || {});
          this.dividendRecords = Array.isArray(p.dividendRecords) ? p.dividendRecords : Object.values(p.dividendRecords || {});
          this.exchangeRate = Number(p.exchangeRate)||36.5; 
          this.selectedPortId = this.portfolios.length > 0 ? this.portfolios[0].id : '';
          this.saveState(); this.refreshUI(); alert('🎯 นำเข้าเสร็จสิ้น ข้อมูลคาร์ทริจซิงก์เรียบร้อย!'); 
        }
      } catch(e) { alert('ข้อมูลเสียหาย: '+e.message); }
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
    const srcId = document.getElementById('tf-source').value; const destId = document.getElementById('tf-target').value; const amt = Number(document.getElementById('tf-amount').value); const r = Number(document.getElementById('tf-rate').value)||this.exchangeRate; const src = this.portfolios.find(x=>x && x.id===srcId);
    if(!src || src.dryPowder < amt) { alert('❌ กระสุนไม่เพียงพอ'); return; }
    src.dryPowder -= amt;
    if(destId!=='system') {
      const dest = this.portfolios.find(x=>x && x.id===destId);
      if(dest) {
        const sUSD = ['Forex', 'Option'].includes(src.category); const tUSD = ['Forex', 'Option'].includes(dest.category);
        let conv = amt; if(sUSD && !tUSD) conv = amt * r; else if(!sUSD && tUSD) conv = amt / r;
        dest.dryPowder += conv;
      }
    }
    this.saveState(); this.closeModals(); this.refreshUI(); alert('⚡ โยกย้ายจัดสรรเรียบร้อย!');
  }

  openPortfolioModal() { document.getElementById('portfolio-modal').classList.remove('hidden'); }
  openTransferModal() {
    if(!Array.isArray(this.portfolios) || this.portfolios.length===0){ alert('❌ โปรดสร้างตลับพอร์ตเพื่อทำรายการโยกย้ายเสบียง'); return; }
    document.getElementById('tf-source').innerHTML = this.portfolios.map(p=>p?`<option value="${p.id}">${p.name} (Dry: ${p.dryPowder})</option>`:'').join('');
    document.getElementById('tf-target').innerHTML = '<option value="system">ถอนเงินออกนอกคลัง</option>'+this.portfolios.map(p=>p?`<option value="${p.id}">${p.name}</option>`:'').join('');
    document.getElementById('tf-rate').value = this.exchangeRate;
    document.getElementById('transfer-modal').classList.remove('hidden');
  }
  closeModals() { document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden')); }
}

window.app = new PixelStewardApp();