import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ResultDetails() {
    const [data, setData] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState(null);
    const examSubmitted = localStorage.getItem("examSubmitted") === "true";

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('No token found. Please login.');
                return;
            }

            try {
                const res = await axios.get('/api/auth/getInfo', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setData(res.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Something went wrong.');
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("/api/auth/exams/EXAM001", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setQuestions(res.data.questions || []);
            } catch (err) {
                console.error("Failed to fetch exam:", err);
            }
        };

        fetchQuestions();
    }, []);

    /*     if (error) {
            return (
                <div className="text-center text-red-600 font-semibold mt-10 flex-grow">
                    {error}
                </div>
            );
        } */

    /*     if (!data) {
            return (
                <div className="text-center text-gray-500 mt-10 flex-grow">
                    loading student information...
                </div>
            );
        } */
    const passed = true;
    return (
        <div className="flex-grow pt-0 px-6 md:pt-4 md:px-10 w-full max-w-screen-xl mx-auto">
            <h1 className="text-3xl font-bold text-[#292524] mb-3">ข้อมูล</h1>

            <div className="bg-white shadow-md rounded-lg p-8 mb-4">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-10 space-y-2 md:space-y-0">
                    <div>
                        <h2 className="text-sm text-[#78716C]">รหัสนักศึกษา</h2>
                        <p className="text-lg font-medium text-[#292524]">
                            {data?.studentId || 'N/A'}
                        </p>
                    </div>
                    <div>
                        <h2 className="text-sm text-[#78716C]">ชื่อ-นามสกุล</h2>
                        <p className="text-lg font-medium text-[#292524]">
                            {data?.studentName || 'N/A'}
                        </p>
                    </div>
                    <div>
                        <h2 className="text-sm text-[#78716C]">สาขา</h2>
                        <p className="text-lg font-medium text-[#292524]">
                            {data?.department || 'N/A'}
                        </p>
                    </div>
                </div>
            </div>

        
            <h1 className="text-3xl font-bold text-[#292524] mb-4">ผลสอบ</h1>
            {/* Summary */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-[#292524] mb-2">Summary</h2>
                <p className="text-lg">
                    Total Score: <span className="font-bold">20</span>
                </p>
                <p className="text-lg">
                    Status:{" "}
                    <span className={`font-bold ${passed ? "text-green-600" : "text-red-600"}`}>
                        {passed ? "Passed" : "Failed"}
                    </span>
                </p>
            </div>

            {/* Scores Table */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-10">
                <h2 className="text-xl font-semibold text-[#292524] mb-4">Exam Scores</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto text-base text-left">
                        <thead className="bg-gray-200 text-gray-600 uppercase">
                            <tr>
                                <th className="px-4 py-2">Question</th>
                                <th className="px-4 py-2">Score</th>
                                <th className="px-4 py-2">Max Score</th>
                            </tr>
                        </thead>

                        <tbody className="text-[#292524]">
                            {examSubmitted ? (
                                questions.map((q, index) => (
                                    <tr key={q.questionId || index} className="border-b border-gray-200">
                                        <td className="px-4 py-2">{index + 1}. {q.questionText || ""}</td>
                                        <td className="px-4 py-2">-</td>
                                        <td className="px-4 py-2">-</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center text-[#78716C] px-4 py-4">
                                        ยังไม่มีข้อมูล เนื่องจากยังไม่ได้ส่งข้อสอบ
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        {/*                    <tbody className="text-[#292524]">
                            {examResults.map((res, index) => (
                                <tr key={index} className="border-b">
                                    <td className="px-4 py-2">Question {index + 1}</td>
                                    <td className="px-4 py-2">{res.score}</td>
                                    <td className="px-4 py-2">{res.max}</td>
                                    <td className="px-4 py-2">{res.remark || '-'}</td>
                                </tr>
                            ))}
                        </tbody> */}

                    </table>
                </div>
            </div>

        </div>
    );
}

export default ResultDetails