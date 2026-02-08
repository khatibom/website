/**
 * GTM Dashboard Main Application
 * Handles rendering and interactions for the GTM Monthly Business Report
 */

class GTMDashboard {
  constructor() {
    this.currentTerritory = 'total-gtm';
    this.currentYear = 2025;
    this.currentMonth = 12;
    this.data = null;
    this.init();
  }

  init() {
    // Load data
    this.loadData();

    // Setup event listeners
    this.setupEventListeners();

    // Initial render
    this.render();
  }

  loadData() {
    // Load mock data (will be replaced with Databricks API call)
    this.data = getAllMockData();
  }

  setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-button').forEach(button => {
      button.addEventListener('click', (e) => {
        this.switchTab(e.target.dataset.tab);
      });
    });

    // Filter changes
    document.getElementById('territory-filter').addEventListener('change', (e) => {
      this.currentTerritory = e.target.value;
      this.render();
    });

    document.getElementById('year-filter').addEventListener('change', (e) => {
      this.currentYear = parseInt(e.target.value);
      this.render();
    });

    document.getElementById('month-filter').addEventListener('change', (e) => {
      this.currentMonth = parseInt(e.target.value);
      this.render();
    });
  }

  switchTab(tabName) {
    // Update active tab button
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Show corresponding content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.style.display = 'none';
    });
    document.getElementById(`${tabName}-tab`).style.display = 'block';
  }

  render() {
    // Update territory badge
    const badge = document.getElementById('current-territory-badge');
    badge.textContent = this.getTerritoryDisplayName(this.currentTerritory);

    // Render all sections
    this.renderExecutiveSummary();
    this.renderMarketingPipeline();
    this.renderCommercial();
    this.renderPaymentsCS();
  }

  getTerritoryDisplayName(territory) {
    const names = {
      'total-gtm': 'Total GTM',
      'north-america': 'North America',
      'emea': 'EMEA',
      'apac': 'APAC',
      'latam': 'LATAM'
    };
    return names[territory] || territory;
  }

  renderExecutiveSummary() {
    const container = document.getElementById('executive-summary-cards');
    container.innerHTML = '';

    // Q4 Pipeline Headlines
    const q4PipelineCard = this.createSummaryCard(
      'Q4 Pipeline Headlines',
      '€2.9M',
      'PMRR pipeline generated',
      [
        { label: 'of plan', value: '105%', status: 'good' },
        { label: 'of SMB plan', value: '116%', status: 'good' },
        { label: 'of MM plan', value: '93%', status: 'warning' }
      ]
    );
    container.appendChild(q4PipelineCard);

    // 2025 Pipeline Headlines
    const fy2025PipelineCard = this.createSummaryCard(
      '2025 Pipeline Headlines (incl. Preferred)',
      '€10.5M',
      'PMRR pipeline generated',
      [
        { label: 'of plan', value: '97%', status: 'warning' },
        { label: 'of SMB plan', value: '98%', status: 'warning' },
        { label: 'of MM plan', value: '83%', status: 'poor' }
      ]
    );
    container.appendChild(fy2025PipelineCard);

    // PMS Signed Headlines
    const pmsSignedCard = this.createSummaryCard(
      'PMS Signed Headlines',
      '€708k',
      'PMRR signed (Q4)',
      [
        { label: 'of Q4 plan', value: '72%', status: 'poor' },
        { label: 'of 2025 plan', value: '80%', status: 'warning' }
      ]
    );
    container.appendChild(pmsSignedCard);

    // RMS Signed Headlines
    const rmsSignedCard = this.createSummaryCard(
      'RMS Signed Headlines',
      '262%',
      'of Q4 plan',
      [
        { label: 'of 2025 plan', value: '211%', status: 'good' }
      ]
    );
    container.appendChild(rmsSignedCard);

    // 2025 Activated Headlines
    const activatedCard = this.createSummaryCard(
      '2025 Activated Headlines – PMS, POS',
      '€1,633k',
      'PMRR activated',
      [
        { label: 'of plan', value: '68%', status: 'poor' },
        { label: 'of SMB plan', value: '84%', status: 'warning' },
        { label: 'of MM plan', value: '58%', status: 'poor' }
      ]
    );
    container.appendChild(activatedCard);

    // Other Signed Headlines
    const otherSignedCard = this.createSummaryCard(
      'Other Signed Headlines',
      '78%',
      'of Q4 plan',
      [
        { label: 'of 2025 plan', value: '96%', status: 'warning' }
      ]
    );
    container.appendChild(otherSignedCard);
  }

  createSummaryCard(title, mainValue, subtitle, metrics) {
    const card = document.createElement('div');
    card.className = 'summary-card';

    const titleEl = document.createElement('h3');
    titleEl.className = 'summary-card-title';
    titleEl.textContent = title;
    card.appendChild(titleEl);

    const valueEl = document.createElement('div');
    valueEl.className = 'summary-card-value';
    valueEl.textContent = mainValue;
    card.appendChild(valueEl);

    const subtitleEl = document.createElement('div');
    subtitleEl.className = 'summary-card-subtitle';
    subtitleEl.textContent = subtitle;
    card.appendChild(subtitleEl);

    if (metrics && metrics.length > 0) {
      const metricsContainer = document.createElement('div');
      metricsContainer.className = 'summary-card-metrics';

      metrics.forEach(metric => {
        const metricDiv = document.createElement('div');
        metricDiv.className = 'summary-metric';

        const label = document.createElement('div');
        label.className = 'summary-metric-label';
        label.textContent = metric.label;

        const value = document.createElement('div');
        value.className = 'summary-metric-value';

        const badge = document.createElement('span');
        badge.className = `percent-badge status-${metric.status}`;
        badge.textContent = metric.value;

        value.appendChild(badge);

        metricDiv.appendChild(label);
        metricDiv.appendChild(value);
        metricsContainer.appendChild(metricDiv);
      });

      card.appendChild(metricsContainer);
    }

    return card;
  }

  renderMarketingPipeline() {
    const tbody = document.getElementById('marketing-pipeline-table-body');
    tbody.innerHTML = '';

    const data = this.data.totalGTM.marketingPipeline;

    // Handraiser MQLs
    tbody.appendChild(this.createMetricRow(
      'Handraiser MQLs',
      data.handraiserMQLs,
      'number',
      false
    ));

    // SaaS PMRR Pipeline
    tbody.appendChild(this.createMetricRow(
      'SaaS PMRR Pipeline (000s)',
      data.saasPmrrPipeline,
      'currency',
      false
    ));

    // Pipeline Deals
    tbody.appendChild(this.createMetricRow(
      'Pipeline Deals',
      data.pipelineDeals,
      'number',
      false
    ));

    // Pipeline Average Deal Size
    tbody.appendChild(this.createMetricRow(
      'Pipeline Average Deal Size',
      data.pipelineAvgDealSize,
      'currency',
      false
    ));

    // Render segment breakdown
    this.renderSegmentBreakdown();

    // Render insights
    this.renderMarketingInsights();
  }

  renderCommercial() {
    const tbody = document.getElementById('commercial-table-body');
    tbody.innerHTML = '';

    const data = this.data.totalGTM.commercial;

    // SaaS PMRR Signed
    tbody.appendChild(this.createMetricRow(
      'SaaS PMRR Signed (000s)',
      data.saasPmrrSigned,
      'currency',
      false
    ));

    // Win Rate
    tbody.appendChild(this.createMetricRow(
      'Win Rate',
      data.winRate,
      'percentage',
      false
    ));

    // Average Deal Size
    tbody.appendChild(this.createMetricRow(
      'Average Deal Size',
      data.avgDealSize,
      'currency',
      false
    ));

    // Average Sales Cycle Days
    tbody.appendChild(this.createMetricRow(
      'Average Sales Cycle Days',
      data.avgSalesCycleDays,
      'days',
      true // inverse - lower is better
    ));

    // % of SMB Reps Hitting Target
    tbody.appendChild(this.createQuarterlyOnlyRow(
      '% of SMB Reps Hit Target',
      data.smbRepsHittingTarget,
      'percentage'
    ));

    // % of MM Reps Hitting Target
    tbody.appendChild(this.createQuarterlyOnlyRow(
      '% of MM Reps Hit Target',
      data.mmRepsHittingTarget,
      'percentage'
    ));

    // Render insights
    this.renderCommercialInsights();
  }

  renderPaymentsCS() {
    const tbody = document.getElementById('payments-cs-table-body');
    tbody.innerHTML = '';

    const data = this.data.totalGTM.paymentsCS;

    // PMS & POS Activated
    tbody.appendChild(this.createMetricRow(
      'PMS & POS Activated (000s)',
      data.pmsActivated,
      'currency',
      false
    ));

    // Mews PMS Revenue
    tbody.appendChild(this.createQuarterlyOnlyRow(
      'Mews PMS Revenue',
      data.mewsPmsRevenue,
      'currency'
    ));

    // Total Payments Volume
    tbody.appendChild(this.createMetricRow(
      'Total Payments Volume (000s)',
      data.totalPaymentsVolume,
      'currency',
      false
    ));

    // Mews Payments Volume
    tbody.appendChild(this.createMetricRow(
      'Mews Payments Volume (000s)',
      data.mewsPaymentsVolume,
      'currency',
      false
    ));

    // Share of Wallet
    tbody.appendChild(this.createMetricRow(
      'Share of Wallet',
      data.shareOfWallet,
      'percentage',
      false
    ));

    // Churn
    tbody.appendChild(this.createMetricRow(
      '%Churn',
      data.churn,
      'percentage',
      true // inverse - lower is better
    ));

    // Render insights
    this.renderPaymentsInsights();
  }

  createMetricRow(metricName, metricData, unit, inverse = false) {
    const row = document.createElement('tr');
    row.className = 'metric-row';

    // Metric name
    const nameCell = document.createElement('td');
    nameCell.className = 'metric-name';
    nameCell.textContent = metricName;
    row.appendChild(nameCell);

    // Monthly actuals (Oct, Nov, Dec)
    const monthsInQuarter = GTMCalculations.getQuarterMonths(4); // Q4 months
    monthsInQuarter.forEach(month => {
      const monthKey = `${this.currentYear}-${String(month).padStart(2, '0')}`;
      const value = metricData.monthly?.[monthKey];
      const cell = this.createValueCell(value?.actual, unit);
      row.appendChild(cell);
    });

    // Monthly % to target
    monthsInQuarter.forEach(month => {
      const monthKey = `${this.currentYear}-${String(month).padStart(2, '0')}`;
      const value = metricData.monthly?.[monthKey];
      const cell = this.createPercentCell(value?.percentToTarget, inverse);
      row.appendChild(cell);
    });

    // Quarterly actuals (Q1-Q4)
    for (let q = 1; q <= 4; q++) {
      const quarterKey = `${this.currentYear}-Q${q}`;
      const value = metricData.quarterly?.[quarterKey];
      const cell = this.createValueCell(value?.actual, unit);
      row.appendChild(cell);
    }

    // Quarterly % to target (Q1-Q4)
    for (let q = 1; q <= 4; q++) {
      const quarterKey = `${this.currentYear}-Q${q}`;
      const value = metricData.quarterly?.[quarterKey];
      const cell = this.createPercentCell(value?.percentToTarget, inverse);
      row.appendChild(cell);
    }

    // YTD Actual
    const ytdCell = this.createValueCell(metricData.ytd?.actual, unit);
    row.appendChild(ytdCell);

    // FY Plan
    const fyCell = this.createValueCell(metricData.fy?.target, unit);
    row.appendChild(fyCell);

    // % FY Plan
    const fyPercentCell = this.createPercentCell(metricData.fy?.percentToTarget, inverse);
    row.appendChild(fyPercentCell);

    return row;
  }

  createQuarterlyOnlyRow(metricName, metricData, unit) {
    const row = document.createElement('tr');
    row.className = 'metric-row';

    // Metric name
    const nameCell = document.createElement('td');
    nameCell.className = 'metric-name';
    nameCell.textContent = metricName;
    row.appendChild(nameCell);

    // Empty cells for monthly data (6 columns)
    for (let i = 0; i < 6; i++) {
      const cell = document.createElement('td');
      cell.textContent = '-';
      cell.className = 'text-center text-muted';
      row.appendChild(cell);
    }

    // Quarterly actuals (Q1-Q4)
    for (let q = 1; q <= 4; q++) {
      const quarterKey = `${this.currentYear}-Q${q}`;
      const value = metricData.quarterly?.[quarterKey];
      const cell = this.createValueCell(value?.actual, unit);
      row.appendChild(cell);
    }

    // Empty cells for quarterly % to target (4 columns)
    for (let i = 0; i < 4; i++) {
      const cell = document.createElement('td');
      cell.textContent = '-';
      cell.className = 'text-center text-muted';
      row.appendChild(cell);
    }

    // YTD, FY Plan, % FY Plan (empty or use available data)
    const ytdCell = this.createValueCell(metricData.ytd?.actual, unit);
    row.appendChild(ytdCell);

    const fyCell = this.createValueCell(metricData.fy?.target, unit);
    row.appendChild(fyCell);

    const fyPercentCell = document.createElement('td');
    fyPercentCell.textContent = '-';
    fyPercentCell.className = 'text-center text-muted';
    row.appendChild(fyPercentCell);

    return row;
  }

  createValueCell(value, unit) {
    const cell = document.createElement('td');
    cell.className = 'metric-value';

    if (value !== null && value !== undefined) {
      cell.textContent = GTMCalculations.formatValue(value, unit, true);
    } else {
      cell.textContent = '-';
      cell.classList.add('text-muted');
    }

    return cell;
  }

  createPercentCell(percent, inverse = false) {
    const cell = document.createElement('td');
    cell.className = 'metric-value';

    if (percent !== null && percent !== undefined) {
      const badge = document.createElement('span');
      badge.className = `percent-badge ${GTMCalculations.getStatusClass(percent, inverse)}`;
      badge.textContent = GTMCalculations.formatPercentage(percent);
      cell.appendChild(badge);
    } else {
      cell.textContent = '-';
      cell.classList.add('text-muted');
    }

    return cell;
  }

  renderSegmentBreakdown() {
    const tbody = document.getElementById('segment-breakdown-table-body');
    tbody.innerHTML = '';

    const segments = this.data.segments;

    Object.keys(segments).forEach(segmentName => {
      const segmentData = segments[segmentName];

      // Pipeline row
      const pipelineRow = document.createElement('tr');
      pipelineRow.className = 'metric-row';

      const pipelineNameCell = document.createElement('td');
      pipelineNameCell.className = 'metric-name';
      pipelineNameCell.textContent = `${segmentName} - Pipeline`;
      pipelineRow.appendChild(pipelineNameCell);

      // Q1-Q4
      for (let q = 1; q <= 4; q++) {
        const quarterKey = `${this.currentYear}-Q${q}`;
        const value = segmentData.saasPmrrPipeline.quarterly?.[quarterKey];
        pipelineRow.appendChild(this.createValueCell(value?.actual, 'currency'));
      }

      // YTD
      pipelineRow.appendChild(this.createValueCell(segmentData.saasPmrrPipeline.ytd?.actual, 'currency'));

      // FY Plan
      pipelineRow.appendChild(this.createValueCell(segmentData.saasPmrrPipeline.fy?.target, 'currency'));

      // % FY Plan
      pipelineRow.appendChild(this.createPercentCell(segmentData.saasPmrrPipeline.fy?.percentToTarget));

      tbody.appendChild(pipelineRow);

      // Signed row
      const signedRow = document.createElement('tr');
      signedRow.className = 'metric-row';

      const signedNameCell = document.createElement('td');
      signedNameCell.className = 'metric-name';
      signedNameCell.textContent = `${segmentName} - Signed`;
      signedRow.appendChild(signedNameCell);

      // Q1-Q4
      for (let q = 1; q <= 4; q++) {
        const quarterKey = `${this.currentYear}-Q${q}`;
        const value = segmentData.saasPmrrSigned.quarterly?.[quarterKey];
        signedRow.appendChild(this.createValueCell(value?.actual, 'currency'));
      }

      // YTD
      signedRow.appendChild(this.createValueCell(segmentData.saasPmrrSigned.ytd?.actual, 'currency'));

      // FY Plan
      signedRow.appendChild(this.createValueCell(segmentData.saasPmrrSigned.fy?.target, 'currency'));

      // % FY Plan
      signedRow.appendChild(this.createPercentCell(segmentData.saasPmrrSigned.fy?.percentToTarget));

      tbody.appendChild(signedRow);
    });
  }

  renderMarketingInsights() {
    const container = document.getElementById('marketing-insights');
    container.innerHTML = '';

    const insights = [
      'MQLs hit 134% of target but MKT pipeline only at 105% - opportunity to further optimize spend for pipeline vs. MQL volume',
      'Total pipeline at 105% - first quarter above 100% (excl. Preferred) and largest total amount for SMB and MM for all of 2025',
      'BD Outbound at 132% in first quarter with BDR/SDR split, MKT, partners and M&A also above target',
      'Overall pipeline number at 97% driven by a beat in number of deals but a miss, especially in MM, on ACV'
    ];

    insights.forEach((text, index) => {
      const card = document.createElement('div');
      card.className = 'insight-card';

      const number = document.createElement('div');
      number.className = 'insight-card-number';
      number.textContent = index + 1;
      card.appendChild(number);

      const textEl = document.createElement('div');
      textEl.className = 'insight-card-text';
      textEl.textContent = text;
      card.appendChild(textEl);

      container.appendChild(card);
    });
  }

  renderCommercialInsights() {
    const container = document.getElementById('commercial-insights');
    container.innerHTML = '';

    const insights = [
      'MM at 121%, beating target every quarter in 2025 with SMB rounding out at 78%; half of the total miss from enterprise / strategic',
      'Finished the year at with a total cross-GTM win rate of 34%, up from 32% in 2024. MKT win rate up to 28% from 24% but remains low',
      'BD Outbound at 132% in first quarter with BDR/SDR split, MKT, partners and M&A also above target',
      'Overall pipeline number at 97% driven by a beat in number of deals but a miss, especially in MM, on ACV'
    ];

    insights.forEach((text, index) => {
      const card = document.createElement('div');
      card.className = 'insight-card';

      const number = document.createElement('div');
      number.className = 'insight-card-number';
      number.textContent = index + 1;
      card.appendChild(number);

      const textEl = document.createElement('div');
      textEl.className = 'insight-card-text';
      textEl.textContent = text;
      card.appendChild(textEl);

      container.appendChild(card);
    });
  }

  renderPaymentsInsights() {
    const container = document.getElementById('payments-insights');
    container.innerHTML = '';

    const insights = [
      'PMS activated at 68% of plan for 2025, with Q4 at 57% - onboarding challenges continue to impact activation rates',
      'Payments volume at 89% of plan, with strong share of wallet at 88.7% showing deep customer penetration',
      'Churn improved to 8.2% annually, down from 9.5% target - customer success initiatives showing positive impact',
      'Mews Payments growing steadily with SOW improvements across all quarters'
    ];

    insights.forEach((text, index) => {
      const card = document.createElement('div');
      card.className = 'insight-card';

      const number = document.createElement('div');
      number.className = 'insight-card-number';
      number.textContent = index + 1;
      card.appendChild(number);

      const textEl = document.createElement('div');
      textEl.className = 'insight-card-text';
      textEl.textContent = text;
      card.appendChild(textEl);

      container.appendChild(card);
    });
  }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new GTMDashboard();
});
