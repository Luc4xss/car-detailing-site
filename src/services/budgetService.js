import { apiRequest } from "./apiRequest"

export const budgetService = {
    getBudgets: () => apiRequest("/budgets"),
    getBudgetsByUserId: (userId) => apiRequest(`/budgets/user/${userId}`),
    createBudget: (body) => apiRequest("/budgets", { method: "POST", body: JSON.stringify(body) }),
    updateBudget: (id, body) => apiRequest(`/budgets/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
}  