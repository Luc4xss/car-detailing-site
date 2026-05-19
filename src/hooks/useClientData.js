import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

// SERVICES
import { washPackageService } from '../services/washPackageService';
import { vehicleService } from '../services/vehicleService';
import { budgetService } from '../services/budgetService';
import { dateService } from '../services/dateService';

export function useClientData(budgetFormData, setErro, setSuccess) {
    const queryClient = useQueryClient();

    const user = JSON.parse(localStorage.getItem("user"));

    const washPackagesQuery = useQuery({
        queryKey: ['washPackages'],
        queryFn: washPackageService.getWashPackageServices,
        refetchInterval: 5000,
    });

    const vehiclesQuery = useQuery({
        queryKey: ['vehicles', user?.id],
        queryFn: () => vehicleService.getVehiclesByUserId(user?.id),
        refetchInterval: 5000,
        enabled: !!user?.id,
    });

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
            display: `Orçamento n° ${bud.id}`,
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

    const updateBudgetMutation = useMutation({
        mutationFn: ({ id, data }) => budgetService.updateBudget(id, data),
        onSuccess: () => { queryClient.invalidateQueries(['budgets']); setSuccess("Orçamento aprovado com sucesso!") }
    })

    const { mutate: createBudget, isPending } = useMutation({
        mutationFn: (data) => budgetService.createBudget(data),
        onSuccess: () => {
            setSuccess("Orçamento solicitado!");
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
        },
        onError: () => {
            setErro(["Erro no servidor", "Não foi possível enviar o orçamento."]);
        },
    });

    const handleCreateBudget = () => {
        if (!user) {
            setErro(["Acesso negado", "Você deverá fazer login para solicitar um orçamento."]);
            return;
        }

        const isFieldsEmpty = !budgetFormData.vehicle?.id || !budgetFormData.washPackage?.id;
        if (isFieldsEmpty) {
            setErro(["Campos em branco", "Por favor, preencha todos os campos"]);
            return;
        }

        const isDateValid = availableDaysQuery?.data.map(avail => avail.date).includes(budgetFormData.evaluationDate);
        if (!isDateValid) {
            setErro(["Data indisponível", "Por favor, selecione uma data disponível. Atendemos de segunda a sexta-feira."]);
            return;
        }

        createBudget(budgetFormData);
    };

    return {
        washPackages: washPackagesQuery.data ?? [],
        vehicles: vehiclesQuery.data ?? [],
        budgets: budgetsQuery.data ?? [],
        blockedDays: blockedDaysQuery.data ?? [],
        availableDays: availableDaysQuery.data ?? [],
        updateBudget: updateBudgetMutation.mutate,
        createBudget: handleCreateBudget,

        isLoading: washPackagesQuery.isLoading || vehiclesQuery.isLoading || blockedDaysQuery.isLoading || availableDaysQuery.isLoading,
    };
}