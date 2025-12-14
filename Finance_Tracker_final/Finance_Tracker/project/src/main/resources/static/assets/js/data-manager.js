// data-manager.js — centralized expense data management

class ExpenseManager {
    constructor() {
        this.expenses = [];
        this.listeners = [];
    }

async loadExpenses() {
  const token = localStorage.getItem("ft_token");
  if (!token) return [];

  const res = await fetch(`${API_BASE_URL}/api/expenses`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("Failed to load expenses");

  const data = await res.json();
  this.expenses = data;
  this.notifyListeners();
  return data;
}


    async addExpense(expense) {
        const token = localStorage.getItem("ft_token");
        if (!token) throw new Error("No authentication token");

        const res = await fetch(`${window.API_BASE_URL}/api/expenses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify(expense)
        });

        if (!res.ok) throw new Error("Failed to add expense");

        const newExpense = await res.json();
        this.expenses.push(newExpense);
        this.notifyListeners();
        return newExpense;
    }

    async deleteExpense(expenseId) {
        const token = localStorage.getItem("ft_token");
        if (!token) throw new Error("No authentication token");

        const res = await fetch(
            `${window.API_BASE_URL}/api/expenses/${expenseId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        );

        if (!res.ok) throw new Error("Failed to delete expense");

        this.expenses = this.expenses.filter(e => e.id !== expenseId);
        this.notifyListeners();
        return true;
    }

    addListener(cb) {
        this.listeners.push(cb);
    }

    notifyListeners() {
        this.listeners.forEach(cb => cb(this.expenses));
    }

    getExpenses() {
        return this.expenses;
    }
}

window.expenseManager = new ExpenseManager();
