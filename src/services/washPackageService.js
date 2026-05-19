import { apiRequest } from "./apiRequest";

export const washPackageService = {
    getWashPackageServices: () => apiRequest("/services"),
    createWashPackage: (data) => apiRequest("/services", { method: "POST", body: JSON.stringify(data) }),
    deleteWashPackage: (id) => apiRequest(`/services/${id}`, { method: "DELETE" })
}