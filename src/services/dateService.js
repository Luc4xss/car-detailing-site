import { apiRequest } from './apiRequest';

export const dateService = {
    getAvailableDates: () => apiRequest('/budgets/available/dates'),
    getBlockedDates: () => apiRequest('/blocked/dates'),
    createBlockedDate: (body) => apiRequest('/blocked/dates', { method: "POST", body: JSON.stringify(body) }),
    deleteBlockedDate: (id) => apiRequest(`/blocked/dates/${id}`, { method: "DELETE" })
}