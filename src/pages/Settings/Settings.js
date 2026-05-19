import styles from "./Settings.module.css"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";


// Utils
import { formHandler } from "../../utils/formHandler";
import { listHandler } from "../../utils/listHandler";

import { useSettingsData } from "../../hooks/useSettingsData";

// ÍCONES
import { FaUser } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { FaCar } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa6";
import SettingsPanel from "../../components/UI/SettingsPanel/SettingsPanel";
import ReturnButton from "../../components/UI/ReturnButton/ReturnButton";


function Settings() {
    const user = JSON.parse(localStorage.getItem("user"))

    // LOADING
    const [loading, setLoading] = useState(false)

    // --- ESTADOS ---
    const [erro, setErro] = useState("");
    const [success, setSuccess] = useState("");

    const [vehicleFormData, setVehicleFormData] = useState({
        ownerId: { "id": user.id },
        model: "",
        plate: "",
        color: "",
        year: 0
    })

    const vehicleHandleChange = (e) => {
        setVehicleFormData({ ...vehicleFormData, [e.target.name]: e.target.value })
    }

    const { vehicles, addVehicle, removeVehicle } = useSettingsData(setErro, setSuccess, vehicleFormData)

    return (
        <main className={styles.settingsMain}>
            <motion.h2 className={styles.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: false, amount: 0.5 }}
            >
                PERSONALIZE SUA <span className={styles.highlightedText}>EXPERIÊNCIA</span>
            </motion.h2>
            <ReturnButton />
            <SettingsPanel
                settingsConfig={{
                    pages: [
                        {
                            name: "Veículos",
                            desc: (
                                <>
                                    Configure os dias em que Box do Brilho estará aberto ou fechado. Utilize o formulário para
                                    suspender o atendimento em <span className={"highlightedGreenTitle"}>feriados, folgas pontuais</span> ou imprevistos.
                                </>
                            ),
                            icon: FaCar,
                            onSubmit: (e) => {
                                e.preventDefault();
                                addVehicle(vehicleFormData, { onSuccess: () => setSuccess("Veículo adicionado") });
                            },
                            fields: [
                                { fieldType: "input", type: "text", name: "model", label: "Modelo do veículo", placeholder: "Toyota Corolla", onChange: (e) => setVehicleFormData(prev => formHandler(e, prev)) },
                                { fieldType: "input", type: "text", name: "color", label: "Cor do veículo", placeholder: "Branco", onChange: (e) => setVehicleFormData(prev => formHandler(e, prev)) },
                                { fieldType: "input", type: "text", name: "plate", label: "Placa do veículo", placeholder: "ABC1D23", onChange: (e) => setVehicleFormData(prev => formHandler(e, prev)) },
                                { fieldType: "button", text: "Adicionar" },
                            ],
                            lists: [
                                { title: "Seus veículos", list: vehicles || [], fields: [{ fieldType: "text", text: "Remover", onClick: (id) => removeVehicle(id) }] },
                            ]
                        },
                        {
                            name: "Perfil",
                            desc: (
                                <>
                                    Configure os dias em que Box do Brilho estará aberto ou fechado. Utilize o formulário para
                                    suspender o atendimento em <span className={"highlightedGreenTitle"}>feriados, folgas pontuais</span> ou imprevistos.
                                </>
                            ),
                            icon: FaGear,
                            onSubmit: (e) => {
                                e.preventDefault();
                                addVehicle(vehicleFormData, { onSuccess: () => setSuccess("Data bloqueada!") });
                            },
                            fields: [
                                { fieldType: "input", type: "text", name: "model", label: "Modelo do veículo", placeholder: "Toyota Corolla", onChange: (e) => setVehicleFormData(prev => formHandler(e, prev)) },
                                { fieldType: "input", type: "text", name: "color", label: "Cor do veículo", placeholder: "Branco", onChange: (e) => setVehicleFormData(prev => formHandler(e, prev)) },
                                { fieldType: "input", type: "text", name: "plate", label: "Placa do veículo", placeholder: "ABC1D23", onChange: (e) => setVehicleFormData(prev => formHandler(e, prev)) },
                                { fieldType: "select", name: "reason", label: "Motivo", options: [{ name: "Ocupado", value: "BUSY" }, { name: "Feriado", value: "HOLIDAY" }, { name: "Fora de serviço", value: "OUT" }], onChange: (e) => setVehicleFormData(prev => formHandler(e, prev)) },
                                { fieldType: "button", text: "Bloquear" },
                            ],
                            lists: [
                                { title: "Seus veículos", list: vehicles || [], fields: [] },
                            ]
                        }
                    ]
                }}

            />

        </ main>
    )
}

export default Settings