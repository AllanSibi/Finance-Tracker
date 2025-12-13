// data-manager.js — centralized expense data management
class ExpenseManager {
    constructor() {
        this.expenses = [];
        this.listeners = [];
    }

    async loadExpenses() {
        const token = localStorage.getItem("ft_token");
        if (!token) {
            throw new Error("No authentication token");
        }

        try {
            const res = await fetch("http://localhost:8080/api/expenses", {
                headers: { Authorization: "Bearer " + token },
            });

            if (res.ok) {
                this.expenses = await res.json();
                this.notifyListeners();
                return this.expenses;
            } else if (res.status === 401) {
                throw new Error("Session expired");
            } else {
                throw new Error("Failed to load expenses");
            }
        } catch (err) {
            console.error("Error loading expenses:", err);
            throw err;
        }
    }

    async addExpense(expense) {
        const token = localStorage.getItem("ft_token");
        if (!token) {
            throw new Error("No authentication token");
        }

        try {
            const res = await fetch("http://localhost:8080/api/expenses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify(expense),
            });

            if (res.ok) {
                const newExpense = await res.json();
                this.expenses.push(newExpense);
                this.notifyListeners();
                return newExpense;
            } else {
                throw new Error("Failed to add expense");
            }
        } catch (err) {
            console.error("Error adding expense:", err);
            throw err;
        }
    }

    async deleteExpense(expenseId) {
        const token = localStorage.getItem("ft_token");
        if (!token) {
            throw new Error("No authentication token");
        }

        try {
            const res = await fetch(`http://localhost:8080/api/expenses/${expenseId}`, {
                method: "DELETE",
                headers: { Authorization: "Bearer " + token },
            });

            if (res.ok) {
                this.expenses = this.expenses.filter(exp => exp.id !== expenseId);
                this.notifyListeners();
                return true;
            } else {
                throw new Error("Failed to delete expense");
            }
        } catch (err) {
            console.error("Error deleting expense:", err);
            throw err;
        }
    }

    addListener(callback) {
        this.listeners.push(callback);
    }

    removeListener(callback) {
        this.listeners = this.listeners.filter(listener => listener !== callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this.expenses));
    }

    getExpenses() {
        return this.expenses;
    }
}

// Global expense manager instance
window.expenseManager = new ExpenseManager();