import styles from "./SuccessPopUp.module.css"

import { FaCircleCheck } from "react-icons/fa6";


function SuccessPopUp({ text }) {
    return (
        <div className={styles.successPopUpOverlay}>
            <div className={styles.successPopUp}>
                <FaCircleCheck />
                <p>{text}</p>
            </div>
        </div>
    )
}

export default SuccessPopUp;