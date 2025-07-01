import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ExamConfirmForm from "./ExamConfirmform";

const EXAM_DURATION = 120 * 60 * 1000; // 30 minutes in ms

function ExamForm() {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [timeUp, setTimeUp] = useState(false);
    const navigate = useNavigate();

    // ตรวจสอบ localStorage ว่าเคยยืนยันสอบแล้วหรือยัง
    useEffect(() => {
        const confirmed = localStorage.getItem("examConfirmed");
        const startTime = localStorage.getItem("examStartTime");

        if (confirmed === "true" && startTime) {
            const elapsed = Date.now() - parseInt(startTime);
            const remaining = Math.max(EXAM_DURATION - elapsed, 0);
            setTimeLeft(Math.floor(remaining / 1000));
            setIsConfirmed(true);
            if (remaining <= 0) setTimeUp(true);
        }
    }, []);

    // นับถอยหลัง
    useEffect(() => {
        if (!isConfirmed || timeUp) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setTimeUp(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isConfirmed, timeUp]);


    // get api 
    useEffect(() => {
        const fetchExam = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("/api/auth/exams/EXAM001", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // รวมคำถามทั้งหมดจากทุกบท
                const allQuestions = res.data.chapters.flatMap(chapter => chapter.questions);

                setQuestions(allQuestions);
            } catch (err) {
                console.error("Failed to fetch exam:", err);
            }
        };

        if (isConfirmed) fetchExam();
    }, [isConfirmed]);



    useEffect(() => {
        const savedAnswers = localStorage.getItem("examAnswers");
        if (savedAnswers) {
            setAnswers(JSON.parse(savedAnswers));
        }
    }, []);

    /*     const handleChange = (questionId, value) => {
            setAnswers(prev => ({ ...prev, [questionId]: value }));
        }; */

    // answer แต่ละข้อ
    const handleChange = (questionId, value) => {
        const newAnswers = {
            ...answers,
            [questionId]: value,
        };
        setAnswers(newAnswers);
        localStorage.setItem("examAnswers", JSON.stringify(newAnswers));
    };

    // เช็คค่าว่าง
    const isAllAnswered = () => {
        return questions.every(q => {
            const ans = answers[q.questionId];
            return ans && ans.trim() !== "";
        });
    };

    //summit form
    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get("/api/auth/getInfo", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const student = res.data;

            const payload = {
                student: student._id,
                studentId: student.studentId,
                studentName: student.studentName,
                examId: "EXAM001",
                answers: Object.entries(answers).map(([questionId, studentAnswer]) => ({
                    questionId,
                    studentAnswer
                }))
            };

            await axios.post("api/auth/answers", payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            alert("ส่งคำตอบเรียบร้อย");

            localStorage.setItem("examSubmitted", "true");
            localStorage.removeItem("examConfirmed");
            localStorage.removeItem("examStartTime");
            localStorage.removeItem("examAnswers");

            navigate("/home");

        } catch (error) {
            console.error("Error submitting answers:", error);
            alert("เกิดข้อผิดพลาดในการส่งคำตอบ");
        }
    };


    const handleConfirm = () => {
        localStorage.setItem("examConfirmed", "true");
        localStorage.setItem("examStartTime", Date.now().toString());
        setIsConfirmed(true);
        setTimeLeft(EXAM_DURATION / 1000);
    };

    const formatTime = (sec) => {
        const h = String(Math.floor(sec / 3600)).padStart(2, "0");
        const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
        const s = String(sec % 60).padStart(2, "0");
        return `${h}:${m}:${s}`;
    };

    const goNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const goBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    // ตรวจสอบการกดยืนยันและแสดงหน้าทำข้อสอบ
    if (!isConfirmed) {
        return <ExamConfirmForm onConfirm={handleConfirm} />;
    }

    if (timeUp) {
        return (
            <div className="px-5 py-30 flex-grow">
                <div className="w-full max-w-xl mx-auto bg-white shadow-md rounded-lg p-10 text-center space-y-6">
                    <h1 className="text-2xl font-bold text-red-600">
                        หมดเวลาในการทำข้อสอบแล้ว
                    </h1>
                    <button
                        onClick={handleSubmit}
                        className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-800"
                    >
                        ส่งคำตอบ
                    </button>
                </div>
            </div>


        );
    }

    const q = questions[currentQuestion] || {};

    return (
        <div className="w-[90%] mx-auto px-6 py-6 space-y-6 flex-grow">

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-[#292524]">ข้อสอบ</h1>
                <div className="w-4 h-4"></div>
                <div className="w-8 h-4"></div>
                <span className="text-red-500 font-semibold text-lg">
                    เวลาที่เหลือ: {formatTime(timeLeft)}
                </span>
                <div className="w-11 h-4"></div>
            </div>

{/*             <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-[#292524]">ข้อสอบ</h1>
                <span className="text-red-500 font-semibold text-lg">
                    เวลาที่เหลือ: {formatTime(timeLeft)}
                </span>
            </div> */}

            <div className="flex gap-6 items-start">
                {/* กล่องคำถาม */}
                <div className="flex-grow max-w-[calc(100%-250px)] bg-white shadow p-6 rounded-lg flex flex-col justify-between min-h-[360px] space-y-6">
                    <div className="max-h-[150px] overflow-auto">
                        <p className="font-semibold break-words">
                            {currentQuestion + 1}. {q.questionText}
                        </p>
                    </div>

                    <textarea
                        className="w-full h-[210px] border border-gray-400 rounded p-2 resize-none overflow-auto"
                        placeholder="พิมพ์คำตอบของคุณที่นี่..."
                        value={answers[q.questionId] || ""}
                        onChange={(e) => handleChange(q.questionId, e.target.value)}
                    />

                    <div className="flex justify-between">
                        <button onClick={goBack}
                            disabled={currentQuestion === 0}
                            className={`px-4 py-2 rounded ${currentQuestion === 0
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-[#3563E9] text-white hover:bg-[#2648b7]"
                                }`}
                        >
                            ข้อก่อนหน้า
                        </button>

                        {currentQuestion < questions.length - 1 ? (
                            <button onClick={goNext} className="bg-[#3563E9] text-white px-4 py-2 rounded hover:bg-[#2648b7]">
                                ข้อถัดไป
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    if (!isAllAnswered()) {
                                        alert("กรุณากรอกคำตอบให้ครบทุกข้อก่อนส่งข้อสอบ");
                                        return;
                                    }
                                    const confirmSubmit = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการส่งข้อสอบ?");
                                    if (confirmSubmit) {
                                        handleSubmit();
                                    }
                                }}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                ส่งคำตอบ
                            </button>
                        )}
                    </div>

                </div>

                {/* Navigation หน้า */}
                <div className="w-[260px] flex-shrink-0 bg-white shadow p-6 rounded-lg space-y-4">
                    <p className="font-semibold">หน้า</p>
                    <div className="grid grid-cols-5 gap-2">
                        {questions.map((_, index) => {
                            const isActive = currentQuestion === index;
                            const isAnswered = answers[questions[index].questionId]?.trim();
                            return (
                                <button
                                    key={index}
                                    onClick={() => setCurrentQuestion(index)}
                                    className={`w-9 h-9 rounded-full text-sm font-semibold
                                        ${isActive ? "bg-[#3563E9] text-white" : isAnswered ? "bg-green-200 text-[#292524]" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`
                                    }
                                >
                                    {index + 1}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

        </div>
    );

}

export default ExamForm;
