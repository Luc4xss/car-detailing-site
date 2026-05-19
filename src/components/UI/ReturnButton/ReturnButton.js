import styles from "./ReturnButton.module.css"

// ÍCONES

import { FaHouse } from "react-icons/fa6";


function ReturnButton() {
    return (
        <div className={styles.returnButton}>
            <a href="/"><FaHouse /></a>
        </div>
    )
}

export default ReturnButton;