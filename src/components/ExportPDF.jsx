import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FiDownload } from "react-icons/fi";
import "../font/THSarabunNew-normal.js"
import "../font/THSarabunNew Bold-normal.js"

const ExportPDF = ({ data, type = "list" }) => {

    const handleExportPDF = () => {
        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        doc.setFont("THSarabunNew");
        doc.setFontSize(24);
        doc.text("รายชื่อนักศึกษา", 14, 15);

        const tableColumn = ["ลำดับ", "รหัสนักศึกษา", "ชื่อ-นามสกุล", "สาขา", "รหัสผ่าน"];
        const tableRows = data.filter(item => item.studentId !== "admin").map((item, index) => [
                index + 1,
                item.studentId,
                item.studentName,
                item.department,
                item.password
            ]);

        autoTable(doc, {
            startY: 20,
            head: [tableColumn],
            body: tableRows,
            styles: {
                fontSize: 16,
                font: "THSarabunNew",
                fontStyle: "normal"
            },
            headStyles: {
                font: "THSarabunNew",
                fontStyle: "normal",
                fontSize: 18,
                fillColor: [64, 130, 109],
                textColor: 255
            }
        });

        doc.save("รายชื่อนักศึกษา.pdf");
    };

    const handleExportScorePDF = () => {
        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

        doc.setFont("THSarabunNew");
        doc.setFontSize(24);
        doc.text("ผลคะแนนสอบนักศึกษา", 14, 15);

        const tableColumn = ["ลำดับ", "รหัสนักศึกษา", "ชื่อ-นามสกุล", "สาขา", "คะแนน"];
        const tableRows = data.map((item, index) => [
            index + 1,
            item.studentId,
            item.studentName,
            item.department,
            item.totalScore
        ]);

        autoTable(doc, {
            startY: 20,
            head: [tableColumn],
            body: tableRows,
            styles: {
                fontSize: 16,
                font: "THSarabunNew",
                fontStyle: "normal"
            },
            headStyles: {
                font: "THSarabunNew",
                fontStyle: "normal",
                fontSize: 18,
                fillColor: [64, 130, 109],
                textColor: 255
            }
        });

        const scores = data.map(item => item.totalScore);
        const avg = (scores.reduce((sum, b) => sum + b, 0) / scores.length).toFixed(2);
        const max = Math.max(...scores);
        const min = Math.min(...scores);

        const finalY = doc.lastAutoTable.finalY || 40;
        doc.setFontSize(16);
        doc.text(`คะแนนเฉลี่ย: ${avg}`, 14, finalY + 10);
        doc.text(`คะแนนสูงสุด: ${max}`, 14, finalY + 20);
        doc.text(`คะแนนต่ำสุด: ${min}`, 14, finalY + 30);

        doc.save("ผลคะแนนนักศึกษา.pdf");
    };

    return (
        <button
            onClick={type === "list" ? handleExportPDF : handleExportScorePDF}
            className="flex items-center gap-1 px-4 py-2 bg-[#1976D2] hover:bg-[#0C3B69] text-white rounded transition text-sm"
        >
            <FiDownload />
            Export PDF
        </button>
    );
};

export default ExportPDF;
