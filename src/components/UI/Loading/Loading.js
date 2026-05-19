import styles from "./Loading.module.css"

import { motion } from "framer-motion"

function Loading() {
    return (
        <div className={styles.loadingOverlay}>
            <motion.div className={styles.loadingIcon}
                animate={{ rotate: 360 }}
                transition={{
                    duration: .6,
                    repeat: Infinity,
                    ease: "linear"
                }}
            ></motion.div>
        </div>
    )
}

export default Loading