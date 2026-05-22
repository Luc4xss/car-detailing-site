import styles from "./Calendar.module.css";
import { useEffect, useMemo, useState } from "react";

import { dateService } from "../../../services/dateService";
import { useCalendarData } from "../../../hooks/useCalendarData";

function Calendar({ setActiveCalendar }) {
    const [allDates, setAllDates] = useState([]);
    const [month, setMonth] = useState(4);

    const { blockedDates, availableDates, refetchBlockedDates } = useCalendarData();    // MAPS E SETS
    // -----------------------------

    const availableDatesSet = useMemo(() => {
        return new Set(availableDates.map(d => d.date));
    }, [availableDates]);

    const blockedDatesMap = useMemo(() => {
        return new Map(
            blockedDates.map(d => [d.date, d])
        );
    }, [blockedDates]);



    function getPrevMonthPadding(year, month) {
        const firstDay = new Date(year, month, 1).getDay();
        const prevMonthLastDay = new Date(year, month, 0);

        const padding = [];

        for (let i = firstDay - 1; i >= 0; i--) {
            const d = new Date(prevMonthLastDay);

            d.setDate(prevMonthLastDay.getDate() - i);

            padding.push(d);
        }

        return padding;
    }

    function getNextMonthPadding(year, month) {
        const lastDay = new Date(year, month + 1, 0).getDay();

        const padding = [];

        for (let i = lastDay + 1; i <= 6; i++) {
            const d = new Date(year, month + 1, 0);

            d.setDate(d.getDate() + (i - lastDay));

            padding.push(d);
        }

        return padding;
    }

    function getMonthDays(year, month) {
        const days = [];

        const date = new Date(year, month, 1);

        while (date.getMonth() === month) {
            days.push(new Date(date));

            date.setDate(date.getDate() + 1);
        }

        return days;
    }

    function getFullCalendar() {
        const prev = getPrevMonthPadding(2026, month);

        const curr = getMonthDays(2026, month);

        const next = getNextMonthPadding(2026, month);

        return [...prev, ...curr, ...next];
    }

    function getMonth() {
        const months = [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro",
        ];

        return months[month];
    }

    useEffect(() => {
        setAllDates(getFullCalendar());
    }, [month]);

    async function handleDateClick(e, date) {
        e.stopPropagation();

        const iso = date.toISOString().split("T")[0];

        const isAvailable = availableDatesSet.has(iso);

        const blockedData = blockedDatesMap.get(iso);

        try {
            if (isAvailable) {
                await dateService.createBlockedDate({
                    date: iso,
                    reason: "BUSY",
                });
            } else if (blockedData) {
                await dateService.deleteBlockedDate(blockedData.id);
            }

            await refetchBlockedDates();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div
            className={styles.calendarOverlay}
            onClick={() => setActiveCalendar(false)}
        >
            <h2>
                {getMonth().toUpperCase()}
            </h2>

            <div
                className={styles.calendarContainer}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.calendarHeader}>
                    <p>DOM</p>
                    <p>SEG</p>
                    <p>TER</p>
                    <p>QUA</p>
                    <p>QUI</p>
                    <p>SEX</p>
                    <p>SAB</p>
                </div>

                <div className={styles.datesGrid}>
                    {allDates.map((date, index) => {
                        const iso = date.toISOString().split("T")[0];

                        const isCurrentMonth =
                            date.getMonth() === month;

                        const isWeekend =
                            date.getDay() === 0 ||
                            date.getDay() === 6;

                        const isBlocked =
                            blockedDatesMap.has(iso);

                        return (
                            <div
                                key={index}
                                onClick={(e) =>
                                    handleDateClick(e, date)
                                }
                                className={`
                                    ${styles.dateBox}

                                    ${!isCurrentMonth
                                        ? styles.previous
                                        : ""
                                    }

                                    ${isWeekend
                                        ? styles.weekend
                                        : ""
                                    }

                                    ${isBlocked
                                        ? styles.blocked
                                        : ""
                                    }
                                `}
                            >
                                {date.getDate()}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Calendar;