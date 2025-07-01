import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ExamConfirmForm({ onConfirm }) {
    const [data, setdata] = useState(null);
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(false);

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
                setdata(res.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Something went wrong.');
            }
        };

        fetchData();
    }, []);

    const handleConfirm = () => {
        setDisabled(true); // Prevent multiple clicks
        alert("ยืนยันเข้าสอบเรียบร้อย");
        onConfirm();
    };

    /*     if (error) {
            return (
                <div className="text-center text-red-600 font-semibold mt-10 flex-grow">
                    {error}
                </div>
            );
        }
    
        if (!data) {
            return (
                <div className="text-center text-gray-500 mt-10 flex-grow">
                    loading student information...
                </div>
            );
        } */

    return (
        <div className="w-[60%] max-w-[1400px] mx-auto px-6 py-10 space-y-6 flex-grow">
            <h1 className="text-3xl font-bold text-center text-[#292524]">
                ข้อสอบปลายภาค ภาคการศึกษาต้น ปีการศึกษา 2568
            </h1>

            {/* Student Info */}
            <div className="bg-white p-8 rounded-lg shadow-md text-lg space-y-1">
                <p><strong className='text-[#292524]'>รหัสนักศึกษา:</strong> {data?.studentId || 'N/A'}</p>
                <p><strong className='text-[#292524]'>ชื่อ:</strong> {data?.studentName || 'N/A'}</p>
                <p><strong className='text-[#292524]'>หมวดวิชา:</strong> 517 321 หลักการภาษาโปรแกรม</p>
                <p><strong className='text-[#292524]'>วันสอบ:</strong> วันอังคารที่ 1 พฤศจิกายน 2565 เวลา 13.30 - 16.30 น.</p>
                <p><strong className='text-[#292524]'>ห้อง:</strong> 4203 อาคาร 3.4</p>
            </div>

            {/* Exam Instructions */}
            <div className="bg-white p-6 rounded-lg shadow-md space-y-3">
                <h2 className="text-xl font-semibold text-[#292524]">คำชี้แจง:</h2>
                <ul className="list-decimal ml-6 space-y-1 text-[#44403c]">
                    <li>ข้อสอบมีทั้งหมด 14 ข้อ 75 + 4 คะแนน (35%)</li>
                    <li>ให้ทำข้อสอบให้ครบทุกข้อ</li>
                    <li>กรอบสี่เหลี่ยม [ ] หมายถึงคะแนน</li>
                </ul>
            </div>

            {/* Confirm Button */}
            <div className="text-center">
                <button
                    onClick={handleConfirm}
                    className="bg-[#3563E9] text-white px-6 py-2 rounded hover:bg-[#2648b7] text-lg font-semibold"
                >
                    ยืนยันการเข้าสอบ
                </button>
            </div>
        </div>
    );
}

export default ExamConfirmForm;
