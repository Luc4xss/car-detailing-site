import styles from "./Calendar.module.css";
import { useEffect, useState } from "react";
import { dateService } from "../../../services/dateService";

function Calendar({ setActiveCalendar }) {
    const [allDates, setAllDates] = useState([]);

    const [month, setMonth] = useState(4);
    const [blockedDates, setBlockedDates] = useState([])

    function getPrevMonthPadding(year, month) {
        const firstDay = new Date(year, month, 1).getDay();
        const prevMonthLastDay = new Date(year, month, 0);

        const padding = []

        for (let i = firstDay - 1; i >= 0; i--) {
            const d = new Date(prevMonthLastDay);
            d.setDate(prevMonthLastDay.getDate() - i);
            padding.push(d);
        }

        return padding;
    }

    function getNextMonthPadding(year, month) {
        const lastDay = new Date(year, month + 1, 0).getDay();
        const padding = []

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

        const days = [...prev, ...curr, ...next];
        return days;
    }

    function getMonth() {
        switch (month) {
            case 0:
                return "Janeiro";
            case 1:
                return "Fevereiro";
            case 2:
                return "Março";
            case 3:
                return "Abril";
            case 4:
                return "Maio";
            case 5:
                return "Junho";
            case 6:
                return "Julho";
            case 7:
                return "Setembro";
            case 8:
                return "Fevereiro";
            case 9:
                return "Outubro";
            case 10:
                return "Novembro";
            case 11:
                return "Dezembro";
            default:
                return "Mês desconhecido"
        }
    }

    useEffect(() => {
        async function getDates() {
            const blockedDates = await dateService.getBlockedDates();
            getMonthBlockedDates(blockedDates);
            setAllDates(getFullCalendar());
        }
        getDates();
    }, [month]);

    function getMonthBlockedDates(dates) {
        console.log(dates)
        const monthBlockedDates = []
        dates.map(d => {
            let date = d.date.split("-")[1]
            if (date == month + 1) {
                monthBlockedDates.push(parseInt(d.date.split("-")[2]))
            }
        })
        console.log(monthBlockedDates)
        setBlockedDates(monthBlockedDates);
    }

    return (
        <div
            className={styles.calendarOverlay}
            onClick={() => setActiveCalendar(false)}
        >
            <h2>
                {getMonth().toUpperCase()}
            </h2>
            <div className={styles.calendarContainer}>
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
                    {allDates.map((date, index) => (
                        <div
                            className={date.getMonth() !== month ? `${styles.dateBox} ${styles.previous}` : date.getDay() === 0 || date.getDay() === 6 ? `${styles.dateBox} ${styles.weekend}` : blockedDates.includes(date.getDate()) ? `${styles.dateBox} ${styles.blocked}` : styles.dateBox} key={index}
                            onClick={() => console.log(date.toISOString().split("T")[0])}
                        >
                            {date.getDate()}
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
}

export default Calendar;