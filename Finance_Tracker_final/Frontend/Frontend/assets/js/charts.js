// charts.js — updated to use data manager
let categoryChart = null;
let monthlyChart = null;

function getTheme() {
    const isDark = document.body.classList.contains("darkmode");
    const styles = getComputedStyle(document.body);
    return {
        isDark,
        text: styles.getPropertyValue('--text').trim() || (isDark ? '#e6edf7' : '#111827'),
        muted: styles.getPropertyValue('--text-muted').trim() || (isDark ? '#9fb0c7' : '#6b7280'),
        border: styles.getPropertyValue('--border').trim() || (isDark ? '#25324a' : '#e5e7eb'),
        accent: styles.getPropertyValue('--accent').trim() || '#2563eb',
        accentLight: styles.getPropertyValue('--accent-light').trim() || '#60a5fa',
    };
}

function initializeCharts() {
    expenseManager.addListener(drawCharts);
}

function drawCharts(expenses) {
    if (!expenses || expenses.length === 0) {
        clearCharts();
        return;
    }

    drawCategoryChart(expenses);
    drawMonthlyChart(expenses);
}

function drawCategoryChart(expenses) {
    const ctx = document.getElementById("chart-category");
    if (!ctx) return;

    // Destroy existing chart
    if (categoryChart) {
        categoryChart.destroy();
    }

    const categoryTotals = {};
    expenses.forEach((expense) => {
        const cat = expense.category || "Uncategorized";
        categoryTotals[cat] = (categoryTotals[cat] || 0) + expense.amount;
    });

    const categories = Object.keys(categoryTotals);
    const categoryAmounts = Object.values(categoryTotals);

    const t = getTheme();
    categoryChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: categories,
            datasets: [
                {
                    label: "Amount (₹)",
                    data: categoryAmounts,
                    backgroundColor: t.isDark
                        ? ['#60a5fa','#34d399','#fbbf24','#f87171','#a78bfa','#22d3ee','#a3e635','#fb923c','#f472b6','#94a3b8']
                        : ['#2563eb','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#84cc16','#f97316','#ec4899','#64748b'],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        color: t.text,
                    }
                },
                title: {
                    display: true,
                    text: "Spending by Category",
                    font: { size: 16 },
                    color: t.text,
                },
            },
        },
    });
}

function drawMonthlyChart(expenses) {
    const ctx = document.getElementById("chart-month");
    if (!ctx) return;

    // Destroy existing chart
    if (monthlyChart) {
        monthlyChart.destroy();
    }

    const monthTotals = {};
    expenses.forEach((expense) => {
        const date = new Date(expense.date);
        const key = date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short' });
        monthTotals[key] = (monthTotals[key] || 0) + expense.amount;
    });

    const months = Object.keys(monthTotals).sort((a, b) => {
        return new Date('01 ' + a) - new Date('01 ' + b);
    });
    const monthlyAmounts = months.map((month) => monthTotals[month]);

    const t = getTheme();
    monthlyChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: months,
            datasets: [
                {
                    label: "Amount (₹)",
                    data: monthlyAmounts,
                    backgroundColor: t.isDark ? '#60a5fa' : '#2563eb',
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Amount (₹)",
                        color: t.muted,
                    },
                    ticks: { color: t.muted },
                    grid: { color: t.isDark ? 'rgba(148,163,184,0.15)' : 'rgba(0,0,0,0.06)' },
                },
                x: {
                    title: {
                        display: true,
                        text: "Month",
                        color: t.muted,
                    },
                    ticks: { color: t.muted },
                    grid: { color: t.isDark ? 'rgba(148,163,184,0.12)' : 'rgba(0,0,0,0.04)' },
                }
            },
            plugins: {
                legend: { display: false, labels: { color: t.text } },
                title: {
                    display: true,
                    text: "Monthly Spending Trend",
                    font: { size: 16 },
                    color: t.text,
                },
            },
        },
    });
}

function clearCharts() {
    if (categoryChart) {
        categoryChart.destroy();
        categoryChart = null;
    }
    if (monthlyChart) {
        monthlyChart.destroy();
        monthlyChart = null;
    }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    initializeCharts();
    // Re-render charts on theme change
    const observer = new MutationObserver(() => {
        // if either chart exists, re-draw to apply theme
        if (categoryChart || monthlyChart) {
            const allExpenses = window.expenseManager ? window.expenseManager.getExpenses() : null;
            if (allExpenses && allExpenses.length) {
                drawCharts(allExpenses);
            } else {
                clearCharts();
            }
        }
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
});