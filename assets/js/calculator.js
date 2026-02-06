// Mews Deals Profit Calculator Logic

document.getElementById('calculator-form').addEventListener('submit', function(e) {
    e.preventDefault();
    calculateMetrics();
});

function calculateMetrics() {
    // Get form inputs
    const dealSize = parseInt(document.getElementById('dealSize').value);
    const monthlyPaymentsVolume = parseFloat(document.getElementById('monthlyPaymentsVolume').value);
    const region = document.getElementById('region').value;
    const segment = document.getElementById('segment').value;
    const lowTierRate = parseFloat(document.getElementById('lowTierRate').value) / 100; // Convert to decimal

    // Get backend configuration data
    const signedToGoLiveMonths = CONFIG.signedToGoLive[region][segment];
    const paymentsRamp = CONFIG.paymentsRamp[region][segment];
    const cacPerHotel = CONFIG.cac[region][segment];
    const churnRate = CONFIG.churnRate[region][segment];
    const lifetime = CONFIG.getLifetime(region, segment);

    // Calculate Year 1 and Year 2 profits
    const { year1, year2, breakdown } = calculateYearlyProfits(
        monthlyPaymentsVolume,
        lowTierRate,
        signedToGoLiveMonths,
        paymentsRamp,
        dealSize
    );

    // Calculate LTV metrics
    const monthlyProfitPerHotelAtFullRamp = (monthlyPaymentsVolume * lowTierRate) / dealSize;
    const annualProfitPerHotelAtFullRamp = monthlyProfitPerHotelAtFullRamp * 12;
    const ltv = annualProfitPerHotelAtFullRamp * lifetime;
    const ltvCacRatio = ltv / cacPerHotel;
    const cacPayback = calculateCACPayback(cacPerHotel, monthlyProfitPerHotelAtFullRamp, signedToGoLiveMonths, paymentsRamp);

    // Display results
    displayResults({
        year1ProfitPerHotel: year1.perHotel,
        year1TotalProfit: year1.total,
        year2ProfitPerHotel: year2.perHotel,
        year2TotalProfit: year2.total,
        ltv: ltv,
        cac: cacPerHotel,
        ltvCacRatio: ltvCacRatio,
        cacPayback: cacPayback,
        breakdown: breakdown
    });
}

function calculateYearlyProfits(monthlyVolume, rate, goLiveMonth, ramp, dealSize) {
    const breakdown = [];
    let year1MonthlyProfits = [];
    let year2MonthlyProfits = [];

    // Year 1 calculation (12 months)
    for (let month = 1; month <= 12; month++) {
        let profit = 0;
        let rampPercent = 0;
        let status = '';

        if (month < goLiveMonth) {
            // Before go-live
            status = 'Pre Go-Live';
            profit = 0;
            rampPercent = 0;
        } else {
            // After go-live, apply ramp
            const monthsAfterGoLive = month - goLiveMonth;
            if (monthsAfterGoLive < ramp.length) {
                rampPercent = ramp[monthsAfterGoLive];
            } else {
                rampPercent = 1.0; // Full ramp achieved
            }
            status = `Ramping (${(rampPercent * 100).toFixed(0)}%)`;
            profit = monthlyVolume * rate * rampPercent;
        }

        year1MonthlyProfits.push(profit);
        breakdown.push({
            year: 1,
            month: month,
            status: status,
            rampPercent: rampPercent,
            profit: profit
        });
    }

    // Year 2 calculation (12 months)
    // Start where we left off in Year 1
    const lastMonth = 12;
    const monthsAfterGoLiveAtEndOfYear1 = lastMonth - goLiveMonth;
    let year2RampPercent = 1.0;

    if (monthsAfterGoLiveAtEndOfYear1 < ramp.length) {
        year2RampPercent = ramp[monthsAfterGoLiveAtEndOfYear1];
    }

    for (let month = 1; month <= 12; month++) {
        let profit = 0;
        let rampPercent = 0;
        let status = '';

        const totalMonthsAfterGoLive = (12 - goLiveMonth) + month;

        if (totalMonthsAfterGoLive < 0) {
            // Still not live in Year 2 (for very long go-live periods)
            status = 'Pre Go-Live';
            profit = 0;
            rampPercent = 0;
        } else if (totalMonthsAfterGoLive < ramp.length) {
            // Still ramping in Year 2
            rampPercent = ramp[totalMonthsAfterGoLive];
            status = `Ramping (${(rampPercent * 100).toFixed(0)}%)`;
            profit = monthlyVolume * rate * rampPercent;
        } else {
            // Full ramp achieved
            rampPercent = 1.0;
            status = 'Full Ramp';
            profit = monthlyVolume * rate;
        }

        year2MonthlyProfits.push(profit);
        breakdown.push({
            year: 2,
            month: month,
            status: status,
            rampPercent: rampPercent,
            profit: profit
        });
    }

    const year1Total = year1MonthlyProfits.reduce((sum, p) => sum + p, 0);
    const year2Total = year2MonthlyProfits.reduce((sum, p) => sum + p, 0);

    return {
        year1: {
            total: year1Total,
            perHotel: year1Total / dealSize
        },
        year2: {
            total: year2Total,
            perHotel: year2Total / dealSize
        },
        breakdown: breakdown
    };
}

function calculateCACPayback(cac, monthlyProfitPerHotel, goLiveMonth, ramp) {
    let cumulativeProfit = 0;
    let month = 0;

    // Start from go-live
    month = goLiveMonth;

    // Track cumulative profit until we recover CAC
    for (let i = 0; i < ramp.length; i++) {
        const profit = monthlyProfitPerHotel * ramp[i];
        cumulativeProfit += profit;
        month++;

        if (cumulativeProfit >= cac) {
            // Interpolate to get more precise payback period
            const previousCumulative = cumulativeProfit - profit;
            const remainingCAC = cac - previousCumulative;
            const fractionalMonth = remainingCAC / profit;
            return month - 1 + fractionalMonth;
        }
    }

    // Continue with full ramp if not recovered during ramp period
    const monthlyProfitAtFull = monthlyProfitPerHotel;
    while (cumulativeProfit < cac && month < 120) { // Max 10 years
        cumulativeProfit += monthlyProfitAtFull;
        month++;

        if (cumulativeProfit >= cac) {
            const previousCumulative = cumulativeProfit - monthlyProfitAtFull;
            const remainingCAC = cac - previousCumulative;
            const fractionalMonth = remainingCAC / monthlyProfitAtFull;
            return month - 1 + fractionalMonth;
        }
    }

    return month; // Return total months if still not recovered
}

function displayResults(results) {
    // Show results section
    document.getElementById('results').style.display = 'block';

    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    // Display Year 1
    document.getElementById('year1Profit').textContent = formatCurrency(results.year1ProfitPerHotel);
    document.getElementById('year1TotalProfit').textContent = formatCurrency(results.year1TotalProfit);

    // Display Year 2
    document.getElementById('year2Profit').textContent = formatCurrency(results.year2ProfitPerHotel);
    document.getElementById('year2TotalProfit').textContent = formatCurrency(results.year2TotalProfit);

    // Display LTV metrics
    document.getElementById('ltv').textContent = formatCurrency(results.ltv);
    document.getElementById('cac').textContent = formatCurrency(results.cac);
    document.getElementById('ltvCacRatio').textContent = results.ltvCacRatio.toFixed(2) + 'x';
    document.getElementById('cacPayback').textContent = results.cacPayback.toFixed(1);

    // Display detailed breakdown
    displayBreakdown(results.breakdown);

    // Scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function displayBreakdown(breakdown) {
    const container = document.getElementById('breakdown-content');

    // Create year 1 table
    let html = '<h4>Year 1 Monthly Breakdown</h4>';
    html += '<table class="breakdown-table">';
    html += '<thead><tr><th>Month</th><th>Status</th><th>Ramp %</th><th>Monthly Profit</th></tr></thead>';
    html += '<tbody>';

    const year1Data = breakdown.filter(item => item.year === 1);
    year1Data.forEach(item => {
        html += `<tr>
            <td>Month ${item.month}</td>
            <td>${item.status}</td>
            <td>${(item.rampPercent * 100).toFixed(0)}%</td>
            <td>${formatCurrency(item.profit)}</td>
        </tr>`;
    });

    html += '</tbody></table>';

    // Create year 2 table
    html += '<h4>Year 2 Monthly Breakdown</h4>';
    html += '<table class="breakdown-table">';
    html += '<thead><tr><th>Month</th><th>Status</th><th>Ramp %</th><th>Monthly Profit</th></tr></thead>';
    html += '<tbody>';

    const year2Data = breakdown.filter(item => item.year === 2);
    year2Data.forEach(item => {
        html += `<tr>
            <td>Month ${item.month}</td>
            <td>${item.status}</td>
            <td>${(item.rampPercent * 100).toFixed(0)}%</td>
            <td>${formatCurrency(item.profit)}</td>
        </tr>`;
    });

    html += '</tbody></table>';

    container.innerHTML = html;
}

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}
