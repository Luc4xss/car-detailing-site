import styles from "./Card.module.css"

import { motion } from "framer-motion"

function Card({ items }) {
    return (
        <div className={styles.cardContainer}>

            {items.map((item, index) => (
                <motion.div key={item.id} className={styles.card}
                    initial={{ opacity: 0, x: -150, rotateX: 10, rotateY: 60, rotateZ: 10 }}
                    whileInView={{
                        opacity: 1, x: 0, rotateX: 0, rotateY: 0, rotateZ: 0,
                        transition: { duration: 0.3, delay: 1 + 0.4 * index }
                    }}
                    whileHover={{
                        rotateX: 2,
                        rotateY: 20,
                        rotateZ: 3,
                        transition: { duration: 0.4, delay: 0 }
                    }}


                >
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <h2>A partir de R${item.price.toFixed(2)}</h2>
                    <ul>
                        <li>Limpeza</li>
                        <li>Limpeza</li>
                        <li>Limpeza</li>
                    </ul>
                    <motion.button
                        whileHover={{
                            scale: 1.1,
                            backgroundColor: "var(--primary-green)",
                            color: "var(--white)",
                        }}>
                        Confira já
                    </motion.button>
                </motion.div>
            ))
            }


        </div >


    )
}

export default Card