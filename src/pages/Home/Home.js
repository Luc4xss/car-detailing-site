import { useState } from "react";
import { motion } from "framer-motion";
import { useQueryClient } from '@tanstack/react-query';

// Componentes
import NavBar from "../../components/UI/NavBar/NavBar";
import Card from "../../components/UI/Card/Card";
import ErrorPopUp from "../../components/UI/ErrorPopUp/ErrorPopUp";
import Loading from "../../components/UI/Loading/Loading";

// Utils
import { formHandler } from "../../utils/formHandler";

// Hooks
import { useClientData } from "../../hooks/useClientData";

// Estilos e Ícones
import styles from "./Home.module.css";
import SuccessPopUp from "../../components/UI/SuccessPopUp/SuccessPopUp";
import Demo from "../../components/UI/BeforeAfter/BeforeAfter";
import HighlightCard from "../../components/UI/HighlightCard/HighlightCard";
import { FaRegAddressBook } from "react-icons/fa6";


function Home() {

    // --- USUÁRIO ---
    const user = JSON.parse(localStorage.getItem("user"));

    const queryClient = useQueryClient();

    // --- ESTADOS ---
    const [erro, setErro] = useState("");
    const [success, setSuccess] = useState("");

    // --- FORMATAÇÃO DOS DADOS ---
    const [budgetFormData, setBudgetFormData] = useState({});

    // --- LOAD DOS DADOS ---
    const { washPackages, vehicles, budgets, blockedDays, availableDays, createBudget, isLoading } = useClientData(budgetFormData, setErro, setSuccess);

    return (
        <main className={styles.homeContainer} >
            <NavBar count={(budgets.filter(bud => bud.status === "REQUESTED").length)} />

            {isLoading && (<Loading />)}
            {erro && (<ErrorPopUp erro={erro} onClose={() => setErro("")} />)}
            {success && (<SuccessPopUp text={success} />)}

            {/* SEÇÃO HOME */}
            <section id="home" className={styles.home}>
                <motion.h2
                    className={styles.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                >
                    SEU CARRO MERECE O MELHOR <span className={"highlightedGreenTitle"}>BRILHO</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                >
                    Lavagem profissional com produtos premium. Agende agora e surpreenda-se com o resultado.
                </motion.p>

                <motion.button
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 1 }}
                >
                    Agendar agora
                </motion.button>
            </section>

            {/* SEÇÃO PRODUTOS */}
            <section id="products" className={styles.products}>
                <div className={styles.productsTitle}>
                    <motion.h2
                        className={styles.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                    >
                        Escolha o pacote ideal para <span className={"highlightedGreenTitle"}>você</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.8 }}
                    >
                        Do básico ao completo, temos o cuidado certo para o seu veículo.
                    </motion.p>
                </div>
                <Card items={washPackages} />
            </section>

            {/* SEÇÃO SERVIÇOS */}
            <section id="services" className={styles.services}>
                <motion.h2
                    className={styles.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                >
                    SERVIÇOS <span className={"bgTitle"}>REALIZADOS.</span>
                </motion.h2>
                <motion.p
                    className={styles.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.8 }}
                >
                    Confira os <b>resultados</b> dos nossos clientes.
                </motion.p>
                <Demo />
                <div className={styles.highlightCardsContainer}>
                    <HighlightCard text1={"Padrão de qualidade"} text2={"Utilizamos os melhores produtos e técnicas do mercado"} value={100} />
                    <HighlightCard text1={"Confiança"} text2={"Atendemos mais de 100 clientes"} value={100} />
                    <HighlightCard text1={"Padrão de qualidade"} text2={"Mais de 100 clientes satisfeitos"} value={100} />
                </div>

            </section>

            {/* SEÇÃO ORÇAMENTO */}
            <section id="budget" className={styles.budget}>
                <div className={styles.textsContainer}>
                    <motion.h2
                        className={styles.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                    >
                        Solicite um<br /> <span className={"highlightedGreenTitle"}>orçamento.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.8 }}
                    >
                        Preencha as informações ao lado e solicite um <span className="highlightedGreenTitle"><b>orçamento personalizado</b></span> para o seu veículo.</motion.p>
                </div>

                <motion.form
                    onSubmit={(e) => { e.preventDefault(); createBudget(); }}
                    initial={{ opacity: 0, x: 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 1.6 }}
                >
                    <div className={styles.headerBox}>
                        <FaRegAddressBook />
                        <div className={styles.headerTextsContainer}>
                            <h2>Preencha os dados</h2>
                            <p>Quanto mais detalhes, mais preciso será o orçamento</p>
                        </div>

                    </div>

                    <div className={styles.inputBox}>
                        <label htmlFor="vehicle">Modelo do veículo: </label>
                        <select required name="vehicle" onChange={(e) => setBudgetFormData(prev => formHandler(e, prev))} defaultValue="Modelo">
                            <option disabled value="Modelo">Modelo do veículo</option>
                            {vehicles?.map((vehicle) => (
                                <option key={vehicle.id} value={vehicle.id}>
                                    {vehicle.model} - {vehicle.color}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.inputBox}>
                        <label htmlFor="evaluationDate">Data desejada: </label>
                        <input required name="evaluationDate" onChange={(e) => setBudgetFormData(prev => formHandler(e, prev))} type="date" />
                    </div>
                    <div className={styles.inputBox}>
                        <label htmlFor="washPackage">Pacote desejado: </label>
                        <select required name="washPackage" onChange={(e) => setBudgetFormData(prev => formHandler(e, prev))} defaultValue="Lavagem">
                            <option disabled value="Lavagem">Selecione o serviço</option>
                            {washPackages.map((item) => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.inputBox}>
                        <label htmlFor="washPackage">Observações(opcional): </label>
                        <textarea placeholder="Observações...">

                        </textarea>
                    </div>

                    <button title="Faça login em uma conta" type="submit">Solicitar</button>
                </motion.form>
            </section>

            <footer className={styles.footer}>
                <p>© 2026 Box do Brilho. Todos os direitos reservados.</p>
            </footer>
        </main >
    );
}

export default Home;