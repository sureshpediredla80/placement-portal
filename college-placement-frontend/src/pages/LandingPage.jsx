import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const features = [
    { title: "📊 Track Progress", desc: "Monitor your placement journey" },
    { title: "🏢 Company Drives", desc: "Apply easily to companies" },
    { title: "📚 Learning Resources", desc: "Improve your technical skills" }
];

const LandingPage = () => {
    const navigate = useNavigate();
    const [index, setIndex] = useState(0);

    // auto slide every 2 sec
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % features.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            style={{
                height: "100vh",
                background: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "Arial",
            }}
        >

            {/* 🔥 MAIN SECTION */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "80px",
                    flexWrap: "wrap"
                }}
            >

                {/* 🔥 LEFT IMAGE (unchanged) */}
                <motion.img
                    src="https://illustrations.popsy.co/gray/student-graduation.svg"
                    alt="placement"
                    animate={{ y: [0, -20, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    style={{ width: "320px" }}
                />

                {/* 🔥 RIGHT SIDE SLIDER (IMPROVED) */}
                <div style={{ width: "300px", textAlign: "center" }}>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 80, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -80, scale: 0.9 }}
                            transition={{ duration: 0.5 }}
                            style={{
                                padding: "25px",
                                borderRadius: "16px",

                                background: "rgba(255,255,255,0.7)",
                                backdropFilter: "blur(10px)",

                                border: "1px solid rgba(108,99,255,0.3)",
                                boxShadow: "0 10px 30px rgba(108,99,255,0.2)",

                                textAlign: "center"
                            }}
                        >
                            <h3 style={{ marginBottom: "10px" }}>
                                {features[index].title}
                            </h3>

                            <p style={{ color: "#555" }}>
                                {features[index].desc}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* 🔵 DOTS */}
                    <div style={{ marginTop: "12px" }}>
                        {features.map((_, i) => (
                            <span
                                key={i}
                                style={{
                                    display: "inline-block",
                                    width: "8px",
                                    height: "8px",
                                    margin: "0 4px",
                                    borderRadius: "50%",
                                    background: i === index ? "#6C63FF" : "#ccc",
                                    transition: "0.3s"
                                }}
                            />
                        ))}
                    </div>

                </div>
            </div>

            {/* 🔥 BOTTOM 3D BUTTON */}
            <motion.button
                whileHover={{
                    scale: 1.1,
                    boxShadow: "0px 15px 30px rgba(108,99,255,0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                style={{
                    marginTop: "60px",
                    padding: "14px 40px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "white",
                    background: "linear-gradient(145deg, #6C63FF, #4e47cc)",
                    border: "none",
                    borderRadius: "30px",
                    cursor: "pointer",
                    boxShadow: "0px 8px 20px rgba(108,99,255,0.4)"
                }}
            >
                Get Started 🚀
            </motion.button>

        </div>
    );
};

export default LandingPage;