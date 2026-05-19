import { apiRequest } from "./apiRequest"

export const washService = {
    createWash: (id, data) => apiRequest(`/wash/${id}`, { method: "POST", body: JSON.stringify(data) }),
}  