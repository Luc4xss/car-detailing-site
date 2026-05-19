import styles from "./HighlightCard.module.css"

import { FaRegUser } from "react-icons/fa6";


function HighlightCard({ text1, text2, value }) {
    return (
        <div className={styles.highlightCard}>
            <div className={styles.iconContainer}>
                <FaRegUser />
            </div>
            <div className={styles.textsContainer}>
                <h2>{text1}</h2>
                <p>{text2}</p>
            </div>
        </div>
    )
}

export default HighlightCard;