// expenses-list.js — updated to use data manager

function initializeExpensesList() {
    expenseManager.addListener(displayExpenses);
    expenseManager.addListener(updateSummary);
}

function displayExpenses(expenses) {
    const container = document.getElementById("expenses-list");
    if (!container) return;

    if (!expenses || expenses.length === 0) {
        container.innerHTML = '<div class="no-expenses">No expenses found. Add your first expense!</div>';
        return;
    }

    // Sort by date (newest first)
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

    const expensesHTML = sortedExpenses.map(expense => `
        <div class="expense-item" data-id="${expense.id}">
            <div class="expense-info">
                <div class="expense-title">${escapeHtml(expense.title)}</div>
                <div class="expense-meta">
                    ${escapeHtml(expense.category)} • ${formatDate(expense.date)}
                    ${expense.description ? ` • ${escapeHtml(expense.description)}` : ''}
                </div>
            </div>
            <div class="expense-amount">₹${expense.amount.toLocaleString('en-IN')}</div>
            <div class="expense-actions">
                <button class="danger" onclick="deleteExpense(${expense.id})">Delete</button>
            </div>
        </div>
    `).join('');

    container.innerHTML = expensesHTML;
}

function updateSummary(expenses) {
    if (!expenses) return;

    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyTotal = expenses
        .filter(expense => expense.date.startsWith(currentMonth))
        .reduce((sum, expense) => sum + expense.amount, 0);

    const totalElement = document.getElementById("total-spent");
    const monthlyElement = document.getElementById("monthly-total");
    const countElement = document.getElementById("expenses-count");

    if (totalElement) totalElement.textContent = `₹${total.toLocaleString('en-IN')}`;
    if (monthlyElement) monthlyElement.textContent = `₹${monthlyTotal.toLocaleString('en-IN')}`;
    if (countElement) countElement.textContent = expenses.length;
}

async function deleteExpense(expenseId) {
    if (!confirm('Are you sure you want to delete this expense?')) {
        return;
    }

    try {
        await expenseManager.deleteExpense(expenseId);
        showToast("Expense deleted successfully!", "success");
    } catch (err) {
        showToast(err.message, "error");
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    initializeExpensesList();
});