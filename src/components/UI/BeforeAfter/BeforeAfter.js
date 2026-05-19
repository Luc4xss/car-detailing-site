import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import { EffectCoverflow, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

import styles from "./BeforeAfter.module.css";


const LENS_SIZE = 140;

function BeforeAfterLens({ beforeSrc, afterSrc, alt = "Before/After" }) {
    const containerRef = useRef(null);
    const [pos, setPos] = useState(null);

    const handleMouseMove = (e) => {
        const rect = containerRef.current.getBoundingClientRect();
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseLeave = () => setPos(null);

    return (
        <div
            className={styles.imageContainer}
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <img src={beforeSrc} alt={alt} draggable={false} />

            {pos && (
                <div style={{
                    position: "absolute", top: 0, left: 0,
                    width: "100%", height: "100%",
                    clipPath: `circle(${LENS_SIZE / 2}px at ${pos.x}px ${pos.y}px)`,
                    pointerEvents: "none",
                }}>
                    <img src={afterSrc} alt={alt} draggable={false} />
                </div>
            )}

            {pos && (
                <div style={{
                    position: "absolute",
                    top: pos.y - LENS_SIZE / 2,
                    left: pos.x - LENS_SIZE / 2,
                    width: LENS_SIZE, height: LENS_SIZE,
                    borderRadius: "50%",
                    border: "2px solid var(--primary-green)",
                    boxShadow: "0rem 0rem 1rem rgba(0,0,0,0.5), 0 .4rem 2rem rgba(0,0,0,0.3)",
                    pointerEvents: "none",
                }} />
            )}

            <span className={styles.timeIndicator}>
                {pos ? "DEPOIS" : "ANTES"}
            </span>

            {!pos && (
                <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(0,0,0,0.25)",
                    color: "#fff", fontSize: 13, fontWeight: 500,
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    pointerEvents: "none"
                }}>
                    Passe o cursor para revelar
                </div>
            )}
        </div>
    );
}

export default function BeforeAfter() {

    const lenses = [
        { beforeSrc: "/assets/results/SeatBefore1.png", afterSrc: "/assets/results/SeatAfter1.png" },
        { beforeSrc: "/assets/results/InteriorBefore1.png", afterSrc: "/assets/results/InteriorAfter1.png" },
        { beforeSrc: "/assets/results/SeatBefore1.png", afterSrc: "/assets/results/SeatAfter1.png" },
        { beforeSrc: "/assets/results/SeatBefore1.png", afterSrc: "/assets/results/SeatAfter1.png" },
        { beforeSrc: "/assets/results/SeatBefore1.png", afterSrc: "/assets/results/SeatAfter1.png" },
    ];

    return (
        <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            initialSlide={Math.floor(lenses.length / 2)}
            breakpoints={{
                0: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
            }}
            coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
            }}
            pagination={true}
            modules={[EffectCoverflow, Pagination]}
            className={"mySwiper " + styles.swiper}

        >
            {lenses.map((lens, index) => (
                <SwiperSlide key={index}>
                    <BeforeAfterLens
                        beforeSrc={lens.beforeSrc}
                        afterSrc={lens.afterSrc}
                    />
                </SwiperSlide>
            ))}

        </Swiper>
    );
}