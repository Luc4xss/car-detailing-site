import { useQuery, useQueryClient } from "@tanstack/react-query";

import { dateService } from "../services/dateService";

export function useCalendarData() {
    const queryClient = useQueryClient();

    const blockedDaysQuery = useQuery({
        queryKey: ["blockedDays"],
        queryFn: dateService.getBlockedDates,
    });

    const availableDaysQuery = useQuery({
        queryKey: ["availableDays"],
        queryFn: dateService.getAvailableDates,

        select: (data) =>
            data.map((date) => ({
                date,
                display: date,
            })),
    });

    return {
        blockedDates: blockedDaysQuery.data || [],

        availableDates: availableDaysQuery.data || [],

        refetchBlockedDates: () =>
            queryClient.invalidateQueries({
                queryKey: ["blockedDays"],
            }),
    };
}