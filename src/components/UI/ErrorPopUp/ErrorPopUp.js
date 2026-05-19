import { motion } from "framer-motion"

import styles from "./ErrorPopUp.module.css"

import { FaCircleExclamation } from "react-icons/fa6";


function ErrorPopUp({ erro, onClose }) {

    return (

        <div>
            {erro !== "" ? (
                <motion.div
                    className={styles.errorOverlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className={styles.errorPopup}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div>
                            <FaCircleExclamation />
                            <h2>{erro[0]}</h2>

                        </div>
                        <p>{erro[1]}</p>
                        <motion.button onClick={onClose}
                            whileHover={{ scale: 1.1, transition: { duration: 0.2, delay: 0 } }}
                        >
                            Fechar
                        </motion.button>
                    </motion.div>
                </motion.div>
            ) : null}
        </div>


    )
}

export default ErrorPopUp