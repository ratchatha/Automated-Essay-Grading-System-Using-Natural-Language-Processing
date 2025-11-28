import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ExamConfirmForm({ onConfirm }) {
    const [data, setData] = useState(null);
    const [config, setConfig] = useState(null);
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState(null);
    const [canTakeExam, setCanTakeExam] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found. Please login.');
                return;
            }
            try {
                // ข้อมูลนักศึกษา
                const resInfo = await axios.get('/api/auth/getInfo', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setData(resInfo.data);

                // ข้อมูลข้อสอบ
                const resSetting = await axios.get('/api/auth/settings', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setConfig(resSetting.data.data);

                // ข้อมูลกลุ่ม
                const resGroups = await axios.get('/api/auth/group', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setGroups(resGroups.data);

                // ตรวจสอบว่า student อยู่ในกลุ่มของ selectedExamId
                const selectedExamId = localStorage.getItem("selectedExamId");
                if (selectedExamId && resGroups.data.length > 0) {
                    const groupForExam = resGroups.data.find(g => g.exams.some(exam => exam.examId === selectedExamId));
                    if (groupForExam && groupForExam.students.some(stu => stu.studentId === resInfo.data.studentId)) {
                        setCanTakeExam(true);
                    }

                }

            } catch (err) {
                setError(err.response?.data?.error || 'Something went wrong.');
            }
        };

        fetchData();
    }, []);

    const handleConfirm = () => {
        alert("ยืนยันเข้าสอบเรียบร้อย");
        onConfirm();
    };

    const startTime = config?.examSchedule.startTime || '';
    const endTime = config?.examSchedule.endTime || '';
    const examDate = config?.examSchedule.examDate;
    const formattedDate = examDate ? new Date(examDate).toLocaleDateString('th-TH', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }) : '';

    return (
        <div className="w-[60%] max-w-[1400px] mx-auto px-6 py-10 space-y-6 flex-grow">
            <h1 className="text-3xl font-bold text-center text-[#292524]">
                ข้อสอบ{config?.examInfo.examType || ''} {`ภาคการศึกษา${config?.examInfo.semester?.replace('ภาค', '') || ''}`} ปีการศึกษา {config?.examInfo.academicYear || ''}
            </h1>

            {/* Student Info */}
            <div className="bg-white p-8 rounded-lg shadow-md text-lg space-y-1">
                <p><strong className='text-[#292524]'>รหัสนักศึกษา:</strong> {data?.studentId || ''}</p>
                <p><strong className='text-[#292524]'>ชื่อ:</strong> {data?.studentName || ''}</p>
                <p><strong className='text-[#292524]'>หมวดวิชา:</strong> {config?.examSchedule.subjectCategory || ''}</p>
                <p><strong className='text-[#292524]'>วันสอบ:</strong> {formattedDate || ''} เวลา {startTime || ''}-{endTime || ''} น.</p>
                <p><strong className='text-[#292524]'>ห้อง:</strong> {config?.examSchedule.room || ''}</p>
            </div>

            {/* Exam Instructions */}
            <div className="bg-white p-6 rounded-lg shadow-md space-y-3">
                <h2 className="text-xl font-semibold text-[#292524]">คำชี้แจง:</h2>
                <ul className="list-decimal ml-5 space-y-1 text-[#44403c] text-lg">
                    {config?.instructions?.length > 0? config.instructions.map((inst, index) => <li key={index}>{inst}</li>): null}
                </ul>
            </div>

            {/* Confirm Button */}
            <div className="text-center">
                <button
                    onClick={handleConfirm}
                    disabled={!canTakeExam}
                    className={`px-6 py-2 rounded text-lg font-semibold ${canTakeExam
                        ? "bg-[#3563E9] text-white hover:bg-[#2648b7] cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    {canTakeExam ? "ยืนยันการเข้าสอบ" : "ยืนยันการเข้าสอบ"}
                </button>
            </div>
        </div>
    );
}

export default ExamConfirmForm;
