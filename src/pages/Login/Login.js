import styles from "./Login.module.css"

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { FaUser } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaExclamationCircle } from "react-icons/fa";
import ErrorPopUp from "../../components/UI/ErrorPopUp/ErrorPopUp";



function Login() {

    const navigate = useNavigate()

    const [erro, setErro] = useState("")

    const [auth, setAuth] = useState("register")
    const [password, setPassword] = useState(false)

    const [registerFormData, setRegisterFormData] = useState({
        name: "",
        password: "",
        phoneNumber: "",
        role: "CLIENT",
    })

    const [loginFormData, setLoginFormData] = useState({
        phoneNumber: "",
        password: ""
    })

    const createAccount = async () => {
        await fetch("http://localhost:8080/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(registerFormData)
        })
        setAuth("login")
    }

    const login = async (e) => {
        e.preventDefault()

        const response = await fetch("http://localhost:8080/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phoneNumber: loginFormData.phoneNumber, password: loginFormData.password })
        })

        if (response.ok) {
            const data = await response.json()
            localStorage.setItem("user", JSON.stringify(data))
            navigate("/")
        } else {
            setErro(["Usuário não encontrado", "Número de telefone ou senha incorretos"])
        }
    }

    const registerHandleChange = (e) => {
        setRegisterFormData({ ...registerFormData, [e.target.name]: e.target.value })
    }

    const loginHangleChange = (e) => {
        setErro("")
        setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value })
    }

    return (
        <main className={styles.loginMain}>
            <ErrorPopUp erro={erro} onClose={() => setErro("")} />
            <div className={`${styles.loginContainer} ${auth === "login" ? styles.active : ""}`}>
                <h2>Seja bem-vindo(a) de volta</h2>
                {auth === "login" ?
                    <form className={styles.inputContainer} onSubmit={(e) => {
                        login(e)
                    }}>
                        <div className={styles.input}>
                            <FaPhoneAlt />
                            <input onChange={loginHangleChange} name="phoneNumber" type="text" placeholder="Número de telefone" />
                        </div>

                        <div className={styles.input}>
                            <FaLock />
                            <input onChange={loginHangleChange} name="password" type={password === false ? "password" : "text"} placeholder="Senha" />
                            <FaEyeSlash onClick={() => setPassword(!password)} />
                        </div>
                        <button type="submit">Entrar</button>


                    </form>
                    :
                    <button onClick={() => setAuth("login")}>Entrar</button>
                }
            </div>

            <div className={`${styles.registerContainer} ${auth === "register" ? styles.active : ""}`}>
                <h2>Criar conta</h2>
                {auth === "register" ?
                    <form className={styles.inputContainer} onSubmit={(e) => {
                        e.preventDefault()
                        createAccount()
                    }}>
                        <div className={styles.input}>
                            <FaUser />
                            <input onChange={registerHandleChange} name="name" type="text" placeholder="Nome" />
                        </div>
                        <div className={styles.input}>
                            <FaPhoneAlt />
                            <input onChange={registerHandleChange} name="phoneNumber" type="tel" placeholder="Número de telefone" />
                        </div>
                        <div className={styles.input}>
                            <FaLock />
                            <input onChange={registerHandleChange} name="password" type={password === false ? "password" : "text"} placeholder="Senha" />
                            <FaEyeSlash onClick={() => setPassword(!password)} />
                        </div>
                        <button type="submit">Criar conta</button>
                    </form>
                    :
                    <button onClick={() => setAuth("register")}>Criar conta</button>
                }


            </div>
        </main>
    )
}

export default Login