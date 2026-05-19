import SettingsPanel from "../../components/UI/SettingsPanel/SettingsPanel";

import { FaCalendar } from "react-icons/fa6";

import { useState } from "react";

import { useClientData } from "../../hooks/useClientData";

import { listHandler } from "../../utils/listHandler";

import { formHandler } from "../../utils/formHandler";

import styles from "./Budgets.module.css";

function Budgets() {

    const [success, setSuccess] = useState("");
    const [erro, setErro] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));

    const [budgetUpdateData, setBudgetUpdateData] = useState({ status: "" });

    const { washPackages, vehicles, budgets, blockedDays, availableDays, updateBudget, createBudget, isLoading } = useClientData(budgetUpdateData, setErro, setSuccess);

    const [selectedBudgetId, setSelectedBudgetId] = useState(null);
    const selectedBudget = listHandler(selectedBudgetId, budgets) ?? budgets[0] ?? null;


    const STATUS_OPTIONS = {
        SCHEDULED: [
            { name: "Aprovar orçamento", value: "CONFIRMED" },
            { name: "Recusar orçamento", value: "REJECTED" },
            { name: "Cancelar Agendamento", value: "CANCELLED" },
        ],
        WAITING_APPROVAL: [
            { name: "Aprovar orçamento", value: "APPROVED" },
            { name: "Recusar orçamento", value: "REJECTED" },
            { name: "Cancelar Agendamento", value: "CANCELLED" },
        ],
        REQUESTED: [
            { name: "Cancelar Agendamento", value: "CANCELLED" },
        ],
        APPROVED: [],
        CONVERTED: [],
        CANCELLED: [],
    };

    return (
        <main className={styles.budgetsPanelContainer}>
            <SettingsPanel
                settingsConfig={{
                    pages: [
                        {
                            name: "Orçamentos",
                            desc: (<>Acompanhe e gerencie seus orçamentos solicitados.</>),
                            icon: FaCalendar,
                            onSubmit: (e) => {
                                e.preventDefault();
                                updateBudget({
                                    id: selectedBudgetId,
                                    data: {
                                        status: budgetUpdateData.status,
                                        price: selectedBudget?.price,
                                    }
                                });
                            },
                            fields: [
                                { fieldType: "select", name: "budgetId", label: "Orçamento", options: budgets.filter(bud => bud.status !== "REQUESTED"), onChange: (e) => setSelectedBudgetId(e.target.value) },
                                { fieldType: "text", text: `Status: ${selectedBudget?.status === "SCHEDULED" ? "Agendado" : selectedBudget?.status === "WAITING_APPROVAL" ? "Aguardando sua aprovação" : selectedBudget?.status === "APPROVED" ? "Aprovado por você" : ""}\nData: ${selectedBudget?.evaluationDate}\nHorário: ${selectedBudget?.evaluationTime ?? "Indefinido..."}\nPreço: ${"R$" + selectedBudget?.price || "Indefinido"}\nPacote de lavagem: ${selectedBudget?.washPackageName}` },
                                { fieldType: "select", name: "status", label: "Ação", options: STATUS_OPTIONS[selectedBudget?.status] ?? [], onChange: (e) => setBudgetUpdateData(prev => formHandler(e, prev)) },
                                { fieldType: "button", text: "Atualizar" },
                            ],
                            lists: [
                                { title: "Orçamentos solicitados", list: budgets.filter(b => b.status === "REQUESTED") || [], fields: [{ text: "Agendar", onClick: (id) => console.log(id) }] },
                                { title: "Orçamentos agendados", list: budgets.filter(b => b.status === "SCHEDULED") || [], fields: [] }
                            ]
                        },
                    ]
                }}
            />
        </main>
    );
}

export default Budgets;