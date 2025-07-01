import React from 'react';

function GuideDetails() {
    const steps = [
        'เข้าสู่ระบบด้วยชื่อผู้ใช้งานและรหัสผ่านที่ได้รับ',
        'เลือกเมนู "ทำข้อสอบ" และดำเนินการตอบคำถามให้ครบถ้วนตามที่กำหนด',
        'เมื่อทำข้อสอบเสร็จเรียบร้อยแล้ว กรุณากดปุ่ม "ส่งคำตอบ" เพื่อยืนยันการส่ง',
        'ผู้ใช้งานสามารถตรวจสอบผลคะแนนได้ที่หน้า "แสดงผลสอบ"',
    ];

    return (
        <div className="w-full max-w-2xl p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4 text-[#292524]">คู่มือการใช้งานระบบ</h1>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 text-lg">
                {steps.map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ol>
        </div>
    );
}

export default GuideDetails;
