import React, { useState, useRef } from "react";
import { usePapaParse } from "react-papaparse";
import axios from "axios";

function CsvUploader({ onUploadSuccess }) {
  const { readString } = usePapaParse();
  const [csvData, setCsvData] = useState([]);
  const fileInputRef = useRef(null);


  const generatePassword = (length = 6) =>
    Array.from({ length }, () => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        .charAt(Math.floor(Math.random() * 62))).join("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ({ target }) => {
      readString(target.result, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          let data = result.data;
          const updated = data.map((row) => {
            if (!row.password || row.password.trim() === "") {
              row.password = generatePassword();
            }
            return row;
          });

          setCsvData(updated);
        },
      });
    };
    reader.readAsText(file);
  };

  const handleSendToServer = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/students/create", csvData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("อัปโหลดข้อมูลเรียบร้อย");
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      console.error(error.response?.data || error);
      alert("เกิดข้อผิดพลาดในการอัปโหลด");
    }
  };

  const handleCancel = () => {
    setCsvData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div>
      {/* อัปโหลดไฟล์ */}
      <div>
        <label className="block mb-1 font-medium">
          เลือกไฟล์ CSV เพื่ออัปโหลด
        </label>
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500 rounded file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
        />
      </div>


      {csvData.length > 0 && (
        <>
          {/* ตาราง */}
          <div className="overflow-x-auto rounded-lg border border-gray-300 mt-2 max-h-64 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  {Object.keys(csvData[0]).map((key) => (
                    <th
                      key={key}
                      className="px-4 py-2 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {csvData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {Object.values(row).map((value, i) => (
                      <td key={i} className="px-4 py-2 text-sm text-gray-600">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          {/* ปุ่ม*/}
          <div className="flex justify-between mt-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 text-gray-800 border border-gray-300 rounded hover:bg-gray-200 transition-colors"
            >
              ยกเลิก
            </button>

            <button
              onClick={handleSendToServer}
              className="px-3 py-1.5 bg-[#1976D2] hover:bg-[#0C3B69] text-white rounded transition-colors"
            >
              บันทึก
            </button>
          </div>

        </>
      )}
    </div>
  );

}

export default CsvUploader;
