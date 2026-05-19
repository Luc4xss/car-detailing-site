import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '../services/vehicleService';

export function useSettingsData(setErro, setSuccess, formData) {
    const queryClient = useQueryClient();

    const today = new Date().toISOString().split('T')[0];
    const user = JSON.parse(localStorage.getItem("user"));

    // --- QUERIES COM FORMATAÇÃO  ---
    const vehiclesQuery = useQuery({
        queryKey: ['vehicles', user?.id],
        queryFn: () => vehicleService.getVehiclesByUserId(user?.id),
        refetchInterval: 5000,
        enabled: !!user?.id,
        select: (data) => data.map(v => ({
            id: v.id,
            display: `${v.model}, ${v.year} - ${v.color}`
        }))
    });

    // --- MUTATIONS (apenas disparam os refreshes) ---
    const addVehicle = useMutation({
        mutationFn: (data) => vehicleService.addVehicle(data),
        onSuccess: () => queryClient.invalidateQueries(['vehicles'], user?.id)
    });

    const removeVehicle = useMutation({
        mutationFn: (id) => vehicleService.removeVehicle(id),
        onSuccess: () => queryClient.invalidateQueries(['vehicles'], user?.id)
    });

    return {
        vehicles: vehiclesQuery.data || [],

        isLoading: vehiclesQuery.isLoading,

        addVehicle: addVehicle.mutate,
        removeVehicle: removeVehicle.mutate
    };
}