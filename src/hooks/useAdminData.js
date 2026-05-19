import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetService } from '../services/budgetService';
import { dateService } from '../services/dateService';
import { washPackageService } from '../services/washPackageService';
import { washService } from '../services/washService';

export function useAdminData(setErro, setSuccess, formData) {
    const queryClient = useQueryClient();

    const today = new Date().toISOString().split('T')[0];

    // --- QUERIES COM FORMATAÇÃO  ---
    const budgetsQuery = useQuery({
        queryKey: ['budgets'],
        queryFn: budgetService.getBudgets,
        refetchInterval: 5000,
        select: (data) => data.map(bud => ({
            id: bud.id,
            status: bud.status,
            washPackageName: bud.washPackage.name,
            washPackagePrice: bud.washPackage.price,
            price: bud.price,
            evaluationDate: bud.evaluationDate,
            evaluationTime: bud.evaluationTime,
            display: `Orçamento n° ${bud.id}\n${bud.vehicle.owner.name}\n${bud.evaluationDate}`,
        }))
    });

    const blockedDaysQuery = useQuery({
        queryKey: ['blockedDays'],
        queryFn: dateService.getBlockedDates,
        select: (data) => data.map(date => ({
            ...date,
            display: date.date,
        }))
    });

    const availableDaysQuery = useQuery({
        queryKey: ['availableDays'],
        queryFn: dateService.getAvailableDates,
        select: (data) => data.map(date => ({
            id: date,
            date: date,
            display: date,
        }))
    });

    const washPackagesQuery = useQuery({
        queryKey: ['washPackages'],
        queryFn: washPackageService.getWashPackageServices, // usei o nome correto do seu service
        select: (data) => data.map(pkg => ({
            id: pkg.id,
            name: pkg.name,
            display: `${pkg.name}\nR$${pkg.price}`,
        }))
    });

    // --- MUTATIONS (apenas disparam os refreshes) ---
    const updateBudgetMutation = useMutation({
        mutationFn: ({ id, data }) => budgetService.updateBudget(id, data),
        onSuccess: () => queryClient.invalidateQueries(['budgets'])
    });

    const createWashMutation = useMutation({
        mutationFn: ({ id, data }) => washService.createWash(id, data),
        onSuccess: () => queryClient.invalidateQueries(['budgets'])
    });

    const createBlockedDateMutation = useMutation({
        mutationFn: (data) => dateService.createBlockedDate(data),
        onSuccess: () => queryClient.invalidateQueries(['blockedDays', 'availableDays'])
    });

    const deleteBlockedDateMutation = useMutation({
        mutationFn: (id) => dateService.deleteBlockedDate(id),
        onSuccess: () => queryClient.invalidateQueries(['blockedDays', 'availableDays'])
    });

    const { mutate: createWashPackage, isPending } = useMutation({
        mutationFn: (data) => washPackageService.createWashPackage(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['washPackages']);
            setSuccess(`Pacote criado com sucesso!`);
        }
    });

    const handleCreateWashPackage = () => {
        const isFieldsEmpty = !formData?.description || !formData?.name || !formData?.price;
        if (isFieldsEmpty) {
            setErro(["Campos em branco", "Por favor, preencha todos os campos"]);
            return;
        }
        createWashPackage(formData);
    }

    const deleteWashPackageMutation = useMutation({
        mutationFn: (id) => washPackageService.deleteWashPackage(id),
        onSuccess: () => queryClient.invalidateQueries(['washPackages'])
    });

    return {
        budgets: budgetsQuery.data || [],
        blockedDays: blockedDaysQuery.data || [],
        availableDays: availableDaysQuery.data || [],
        washPackages: washPackagesQuery.data || [],

        isLoading: budgetsQuery.isLoading || blockedDaysQuery.isLoading || washPackagesQuery.isLoading || availableDaysQuery.isLoading,

        createBlockedDate: createBlockedDateMutation.mutate,
        deleteBlockedDate: deleteBlockedDateMutation.mutate,
        createWashPackage: handleCreateWashPackage,
        deleteWashPackage: deleteWashPackageMutation.mutate,
        updateBudget: updateBudgetMutation.mutate,
        createWash: createWashMutation.mutate,
    };
}