import styles from "./AdminPanel.module.css";
import { useEffect, useState } from "react";

// Hooks Customizados
import { useAdminData } from "../../hooks/useAdminData";

// Utils
import { formHandler } from "../../utils/formHandler";
import { listHandler } from "../../utils/listHandler";

// Componentes UI e Ícones
import { FaCalendar, FaUser, FaShop } from "react-icons/fa6";
import SettingsPanel from "../../components/UI/SettingsPanel/SettingsPanel";
import SuccessPopUp from "../../components/UI/SuccessPopUp/SuccessPopUp";
import ErrorPopUp from "../../components/UI/ErrorPopUp/ErrorPopUp";
import Loading from "../../components/UI/Loading/Loading";
import ReturnButton from "../../components/UI/ReturnButton/ReturnButton";
import Calendar from "../../components/UI/Calendar/Calendar";

function AdminPanel() {
    const today = new Date().toISOString().split('T')[0];

    const [success, setSuccess] = useState("");
    const [erro, setErro] = useState("");
    const [activeCalendar, setActiveCalendar] = useState(true);

    const [washPackageFormData, setWashPackageFormData] = useState({ name: "", description: "", price: 0 });
    const [dateFormData, setDateFormData] = useState({ date: "", reason: "BUSY" });
    const [budgetUpdateData, setBudgetUpdateData] = useState({ evaluationTime: "", status: "", price: 0 });
    const [washFormData, setWashFormData] = useState({ time: "", date: "" });


    const {
        budgets, blockedDays, availableDays, washPackages, isLoading,
        createBlockedDate, deleteBlockedDate,
        createWashPackage, deleteWashPackage,
        updateBudget, createWash
    } = useAdminData(setErro, setSuccess, washPackageFormData);

    const [budgetsStatusFilter, setBudgetStatusFilter] = useState("SCHEDULED")

    // ESTADOS APENAS PARA FORMULÁRIOS
    const [selectedBudgetId, setSelectedBudgetId] = useState(null);
    const selectedBudget = listHandler(selectedBudgetId, budgets) ?? budgets[0] ?? null;

    // MAPA DE STATUS PARA AS AÇÕES DE ORÇAMENTO
    const STATUS_ACTIONS = {
        REQUESTED: {
            actions: [
                { name: "Agendar", value: "SCHEDULED" },
            ],
            options: [{ fieldType: "input", type: "number", name: "price", label: "Preço final", placeholder: `R$ ${selectedBudget?.washPackagePrice || "100"}.00`, min: 1, onChange: (e) => { setBudgetUpdateData(prev => formHandler(e, prev)) } }]
        },
        SCHEDULED: {
            actions: [
                { name: "Solicitar aprovação", value: "WAITING_APPROVAL" },
                { name: "Cancelar orçamento", value: "BUSY" }
            ],
            options: [{ fieldType: "input", type: "number", name: "price", label: "Preço final", placeholder: `R$ ${selectedBudget?.washPackagePrice || "100"}.00`, min: 1, onChange: (e) => { setBudgetUpdateData(prev => formHandler(e, prev)) } }]
        },
        WAITING_APPROVAL: {
            actions: [
                { name: "Cancelar solicitação de aprovação", value: "SCHEDULED" }
            ],
            options: []
        },
        APPROVED: {
            actions: [
                { name: "Agendar serviço", value: "CONVERTING" }
            ],
            options: [{ fieldType: "input", type: "time", name: "time", label: "Horário", onChange: (e) => { setWashFormData(prev => formHandler(e, prev)) } },
            { fieldType: "input", type: "date", name: "date", label: "Data", onChange: (e) => { setWashFormData(prev => formHandler(e, prev)) } }]
        },
        CONVERTED: {
            actions: [

            ],
        }

        ,
        CONFIRMED: [],
    }

    // ATUALIZA O STATUS DO ORÇAMENTO
    useEffect(() => {
        setBudgetUpdateData(prev => ({ ...prev, status: STATUS_ACTIONS[selectedBudget?.status]?.actions[0]?.value ?? "" }))
        console.log(budgetUpdateData)
    }, [selectedBudgetId, budgets])

    return (
        <main className={styles.adminPanelContainer}>
            {success && <SuccessPopUp text={success} onClose={() => setSuccess("")} />}
            {erro && <ErrorPopUp erro={erro} onClose={() => setErro("")} />}
            {isLoading ? (<Loading />) : null}
            {activeCalendar && <Calendar setActiveCalendar={setActiveCalendar} />}

            <h2 className={styles.title}>Painel de <span className={"highlightedGreenTitle"}>controle</span></h2>

            <ReturnButton />
            <SettingsPanel
                settingsConfig={{
                    pages: [
                        {
                            name: "Agenda",
                            desc: (
                                <>
                                    Configure os dias em que Box do Brilho estará aberto ou fechado. Utilize o formulário para
                                    suspender o atendimento em <span className={"highlightedGreenTitle"}>feriados, folgas pontuais</span> ou imprevistos.
                                </>
                            ),
                            icon: FaCalendar,
                            onSubmit: (e) => {
                                e.preventDefault();
                                createBlockedDate(dateFormData, { onSuccess: () => setSuccess("Data bloqueada!") });
                            },
                            fields: [
                                { fieldType: "input", type: "date", name: "date", label: "Data", onChange: (e) => setDateFormData(prev => formHandler(e, prev)) },
                                { fieldType: "select", name: "reason", label: "Motivo", options: [{ name: "Ocupado", value: "BUSY" }, { name: "Feriado", value: "HOLIDAY" }, { name: "Fora de serviço", value: "OUT" }], onChange: (e) => setDateFormData(prev => formHandler(e, prev)) },
                                { fieldType: "button", text: "Bloquear" },
                            ],
                            lists: [
                                { title: "Datas disponíveis", list: availableDays || [], fields: [] },
                                { title: "Datas indisponíveis", list: blockedDays || [], fields: [{ fieldType: "text", text: "Desbloquear", onClick: (id) => deleteBlockedDate(id) }] }
                            ]
                        },
                        {
                            name: "Pacotes de lavagem",
                            desc: (
                                <>
                                    Gerencie os serviços oferecidos no seu cardápio. Personalize nomes, valores e detalhes
                                    para destacar os diferenciais de cada <span className={"highlightedGreenTitle"}>nível de limpeza</span> e cuidado.
                                </>
                            ),
                            icon: FaShop,
                            onSubmit: (e) => {
                                e.preventDefault();
                                createWashPackage();
                            },
                            fields: [
                                { fieldType: "input", type: "text", name: "name", label: "Nome", placeholder: "Nome do pacote", onChange: (e) => { setWashPackageFormData(prev => formHandler(e, prev)) } },
                                { fieldType: "input", type: "text", name: "description", label: "Descrição", placeholder: "Descrição do pacote", onChange: (e) => { setWashPackageFormData(prev => formHandler(e, prev)) } },
                                { fieldType: "input", type: "number", name: "price", label: "Preço", placeholder: "R$ 100.00", min: 1, onChange: (e) => { setWashPackageFormData(prev => formHandler(e, prev)) } },
                                { fieldType: "button", text: "Adicionar" },
                            ],
                            lists: [
                                { title: "Pacotes ativos", list: washPackages || [], fields: [{ fieldType: "text", text: "Remover", onClick: (id) => deleteWashPackage(id) }] }
                            ]
                        },
                        {
                            name: "Orçamentos",
                            desc: "Gerencie as solicitações e confirme agendamentos.",
                            icon: FaUser,
                            onSubmit: (e) => {
                                e.preventDefault();
                                console.log(washFormData);
                                if (budgetUpdateData.status === "CONVERTING") {
                                    createWash({ id: selectedBudget.id, data: washFormData })
                                } else {
                                    updateBudget({ id: selectedBudget.id, data: budgetUpdateData }, { onSuccess: () => setSuccess("Orçamento atualizado!") });
                                }
                            },
                            fields: [
                                { fieldType: "select", name: "budgetId", label: "Orçamento", options: budgets.filter(bud => bud.status !== "REQUESTED"), onChange: (e) => setSelectedBudgetId(e.target.value) },
                                { fieldType: "text", text: `Status: ${selectedBudget?.status === "SCHEDULED" ? "Agendado" : selectedBudget?.status === "WAITING_APPROVAL" ? "Aguardando aprovação do cliente" : selectedBudget?.status === "APPROVED" ? "Aprovado pelo cliente" : selectedBudget?.status === "CONVERTED" ? "Orçamento finalizado" : ""}\nData: ${selectedBudget?.evaluationDate}\nHorário: ${selectedBudget?.evaluationTime ?? "Indefinido..."}\nPreço: ${"R$" + selectedBudget?.price || "Indefinido"}\nPacote de lavagem: ${selectedBudget?.washPackageName}` },
                                { fieldType: "select", name: "status", label: "Ação", options: STATUS_ACTIONS[selectedBudget?.status]?.actions ?? [], onChange: (e) => setBudgetUpdateData(prev => formHandler(e, prev)) },
                                ...STATUS_ACTIONS[selectedBudget?.status]?.options ?? [],
                                selectedBudget?.evaluationDate <= today && { fieldType: "button", text: "Atualizar" }
                            ].filter(Boolean),
                            lists: [
                                { title: "Solicitações de orçamentos", list: budgets.filter(b => b.status === "REQUESTED") || [], fields: [{ fieldType: "input", type: "time", name: "evaluationTime", onChange: (e) => setBudgetUpdateData(prev => formHandler(e, prev)) }, { fieldType: "text", text: "Agendar", onClick: (id) => updateBudget({ id, data: { evaluationTime: budgetUpdateData.evaluationTime, status: "SCHEDULED" } }) }] },
                                { title: "Orçamentos", list: budgets.filter(b => b.status === budgetsStatusFilter) || [], fields: [], filters: { onChange: (e) => { setBudgetStatusFilter(e.target.value); console.log(e.target.value) }, options: [{ display: "Agendado", value: "SCHEDULED" }, { display: "Aguardando aprovação do cliente", value: "WAITING_APPROVAL" }, { display: "Aprovado pelo cliente", value: "APPROVED" }] } }
                            ]
                        },
                    ]
                }}
            />
        </main>
    );
}

export default AdminPanel;