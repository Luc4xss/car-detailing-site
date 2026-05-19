import { apiRequest } from "./apiRequest"

export const vehicleService = {
    getVehiclesByUserId: (id) => apiRequest(`/vehicles/${id}`),
    addVehicle: (data) => apiRequest("/vehicles", { method: "POST", body: JSON.stringify(data) }),
    removeVehicle: (id) => apiRequest(`/vehicles/${id}`, { method: "DELETE" })
} 