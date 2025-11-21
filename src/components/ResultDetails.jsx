import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ResultDetails() {
  const [data, setData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [studentAnswers, setStudentAnswers] = useState([]);
  const examSubmitted = localStorage.getItem("examSubmitted") === "true";
  const [examId, setExamId] = useState(() => {
    return localStorage.getItem("selectedExamId") || "EXAM001";
  });

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('/api/auth/getInfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (err) {
      console.log(err.response?.data?.error || 'Something went wrong.');
    }
  };

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/auth/exams/${examId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(res.data || []);
    } catch (err) {
      console.error("Failed to fetch exam:", err);
    }
  };

  const fetchStudentAnswers = async (studentId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/auth/answers/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudentAnswers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch answers:", err);
    }
  };

  // useEffect ให้ fetchData ตอน mount
  useEffect(() => {
    fetchData();
    fetchQuestions();
  }, []);

  // useEffect รอให้ data โหลดเสร็จก่อนแล้วค่อย fetchStudentAnswers
  useEffect(() => {
    if (data?.studentId) {
      fetchStudentAnswers(data.studentId);
    }
  }, [data]); // จะรันใหม่ทุกครั้งที่ data เปลี่ยน

  /*  useEffect(() => {
     console.log(studentAnswers.answers?.length)
     console.log("studentAnswers questionId:", studentAnswers?.answers?.map(a => a.questionId));
     console.log("modelAnswers questionsId", questions.map(q => q.questionId));
   }, [studentAnswers]); */

  const maxScore = questions.totalAnswersScore;

  return (
    <div className="flex-grow pt-0 px-6 md:pt-4 md:px-10 w-full max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold text-[#292524] mb-3">ข้อมูล</h1>

      <div className="bg-white shadow-md rounded-lg p-8 mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-10 space-y-2 md:space-y-0">
          <div>
            <h2 className="text-sm text-[#78716C]">รหัสนักศึกษา</h2>
            <p className="text-lg font-medium text-[#292524]">
              {data?.studentId || ''}
            </p>
          </div>
          <div>
            <h2 className="text-sm text-[#78716C]">ชื่อ-นามสกุล</h2>
            <p className="text-lg font-medium text-[#292524]">
              {data?.studentName || ''}
            </p>
          </div>
          <div>
            <h2 className="text-sm text-[#78716C]">สาขา</h2>
            <p className="text-lg font-medium text-[#292524]">
              {data?.department || ''}
            </p>
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-[#292524] mb-4">ผลสอบ</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-[#292524] mb-2">คะแนนที่ได้จริง</h2>
        {examSubmitted ? (
          <p className="text-lg">
            <span className="font-bold"> {studentAnswers.totalScore} / {maxScore}</span>
          </p>
        ) : (
          <p className="text-[#78716C]">คุณยังไม่ได้ส่งข้อสอบ</p>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-10">
        <h2 className="text-xl font-semibold text-[#292524] mb-4">รายละเอียดคะแนน</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-base text-left">
            <thead className="bg-gray-200 text-gray-600 uppercase">
              <tr>
                <th className="px-4 py-2">คำถาม</th>
                <th className="px-4 py-2">คะแนนที่ได้</th>
                <th className="px-4 py-2">คะแนนเต็ม</th>
              </tr>
            </thead>

            <tbody className="text-[#292524]">
              {examSubmitted && studentAnswers.answers?.length > 0 && questions.questions?.length > 0 ? (
                (() => {
                  // สร้าง map questionId => answer
                  const answerMap = {};
                  studentAnswers.answers?.forEach((ans) => {
                    answerMap[ans.questionId] = ans;
                  });
                  return questions.questions?.map((q, index) => {
                    const answer = answerMap[q.questionId];

                    return (
                      <tr key={q.questionId || index} className="border-b border-gray-200">
                        <td className="px-4 py-2">{index + 1}. {q.questionText || ""}</td>
                        <td className="px-4 py-2 text-left">
                          {typeof answer?.score === "number" ? answer.score : "-"}
                        </td>
                        <td className="px-4 py-2 text-left">{q.answersScore}</td>
                      </tr>
                    );
                  });
                })()
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    ยังไม่มีข้อมูล เนื่องจากยังไม่ได้ส่งข้อสอบ
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

export default ResultDetails;
