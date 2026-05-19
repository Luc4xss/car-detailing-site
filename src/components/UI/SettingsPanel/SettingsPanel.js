import styles from "./SettingsPanel.module.css";

import { FaAngleLeft } from "react-icons/fa6";
import { motion } from "framer-motion";

import { useState } from "react";

function SettingsPanel({ settingsConfig }) {

    const [activeIndex, setActiveIndex] = useState(0)
    const currentPage = settingsConfig.pages[activeIndex];
    const [open, setOpen] = useState(false);

    const renderFields = (fields) => {
        return fields.map((field) => {
            if (field.fieldType === "input" || field.fieldType === "select") {
                return (
                    <motion.div
                        key={field.name}
                        className={styles.inputBlock}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <label htmlFor={field.name}>{field.label}</label>
                        {field.fieldType === "input" ? (
                            <input
                                key={field.name}
                                id={field.name}
                                name={field.name}
                                type={field.type}
                                placeholder={field.placeholder}
                                min={field?.min}
                                onChange={field.onChange}
                            />
                        ) : (
                            <select key={field.name} id={field.name} name={field.name} onChange={field.onChange}>
                                {field.options.map((opt) => (
                                    <option key={opt.name} value={opt.value || opt.id}>{opt.name || opt.display}</option>
                                ))}
                            </select>
                        )}
                    </motion.div>
                );
            }

            if (field.fieldType === "button") {
                return (
                    <motion.button
                        key={field.text}
                        type="submit"
                        className={styles.submitBtn}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {field.text}
                    </motion.button>
                );
            }

            if (field.fieldType === "text") {
                return (
                    <motion.p
                        key={field.text}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {field.text}
                    </motion.p>
                );
            }

            return null;
        });
    };

    const renderLists = (lists) => {
        return lists.map((listConfig) => (
            <motion.div
                key={listConfig.title}
                className={styles.configList}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <h2>{listConfig.title}</h2>
                {listConfig.filters && (
                    <select onChange={listConfig.filters.onChange}>
                        {listConfig.filters.options.map((filter) => (
                            <option key={filter.value} value={filter.value}>{filter.display}</option>
                        ))}
                    </select>
                )}
                {listConfig.list.length > 0 && (
                    <ul>
                        {listConfig.list.map((item, index) => (
                            <motion.li
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                {item.display}
                                {listConfig.fields.map((field) => {
                                    if (field.fieldType === "text") {
                                        return (<button key={field.text} onClick={() => field.onClick(item.id)}>{field.text}</button>
                                        )
                                    } else if (field.fieldType === "input") {
                                        return (<input key={field.name} name={field.name} type={field.type} onChange={field.onChange} />)
                                    }
                                })}
                            </motion.li>
                        ))}
                    </ul>
                )}
            </motion.div>
        ));
    };

    if (!currentPage) return null;

    return (
        <div key={currentPage.name} className={styles.settingsPanel}>
            <div className={styles.settingsPanelContainer}>
                {settingsConfig.pages.length > 1 &&
                    <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} className={open ? `${styles.settingsPanelNavBar} ${styles.expanded}` : `${styles.settingsPanelNavBar}`}>
                        <FaAngleLeft className={styles.settingsPanelNavBarArrow} />
                        <ul>
                            {settingsConfig.pages.map((page, index) => {
                                const PageIcon = page.icon;
                                return (
                                    <li key={page.name} onClick={() => setActiveIndex(index)}>
                                        {PageIcon && <PageIcon size={20} />}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                }

                <div className={styles.configPage}>
                    <form onSubmit={currentPage.onSubmit} className={styles.configContainer}>
                        <motion.div
                            className={styles.configContainerHeader}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                        >
                            <h2>{currentPage.name}</h2>
                            <p className={styles.headerText}>{currentPage.desc}</p>
                        </motion.div>

                        {renderFields(currentPage.fields)}
                    </form>

                    {currentPage.lists && (
                        <div className={styles.configListContainer}>
                            {renderLists(currentPage.lists)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SettingsPanel;