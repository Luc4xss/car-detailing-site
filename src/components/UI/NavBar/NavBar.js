import styles from "./NavBar.module.css"

import { motion } from "framer-motion";
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";

import { FaRegUser } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa6";


import useAuth from "../../../hooks/useAuth";

function NavBar({ count }) {
    const navigate = useNavigate()

    const { user, isAuthenticated, logout } = useAuth()

    let navItems = []

    if (user.role === "ADMIN") {
        navItems = [
            { id: "#home", label: "Ínicio" },
            { id: "#products", label: "Lavagens" },
            { id: "#services", label: "Serviços" },
            { id: "#budget", label: "Orçamento" },
            { id: "/admin/panel", label: "Admin" },
        ]
    } else {
        navItems = [
            { id: "#home", label: "Ínicio" },
            { id: "#products", label: "Lavagens" },
            { id: "#services", label: "Serviços" },
            { id: "#budget", label: "Orçamento" },
        ]
    }

    const [activeSection, setActiveSection] = useState("#home")

    useEffect(() => {
        const sections = document.querySelectorAll("section")

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id)
                }
            })
        }, { threshold: 0.5 })

        sections.forEach(section => observer.observe(section))

        return () => observer.disconnect()
    }, [])

    return (
        <div className={styles.navBar}>
            <div className={styles.navBarFirstContainer}>
                <motion.img
                    whileHover={{ scale: 1.1, transition: { duration: .4, delay: 0 } }}
                    className={styles.icon}
                    src="assets/icon.png"
                />
                <ul>
                    {navItems.map((item) => (
                        <li key={item.id}>
                            {`#${activeSection}` === item.id && (
                                <motion.div
                                    className={styles.activeBackground}
                                    layoutId="activeBackground"
                                />
                            )}
                            <a href={`${item.id}`}>{item.label}</a>
                            {item.label === "Admin" && (<p className={styles.budgetCount}>{count}</p>)}

                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles.navBarSecondContainer}>
                <motion.div onClick={() => navigate("/settings")} className={styles.settingsBtn}
                    whileHover={{
                        scale: 1.1,
                        transition: { duration: 0.2, delay: 0 },
                    }}>
                    <FaGear />
                </motion.div>
                <motion.button onClick={() => user ? logout() : navigate("/auth")}
                    whileHover={{
                        scale: 1.1,
                        transition: { duration: 0.2, delay: 0 },
                    }}>
                    {user ? user.name : "Cadastre-se"}<FaRegUser />
                    <FaAngleDown />
                </motion.button>
            </div>


        </div>
    )
}

export default NavBar