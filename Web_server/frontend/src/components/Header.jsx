import { MdEditNote } from "react-icons/md";
import { AiOutlineBarChart } from "react-icons/ai";
import { FiBookOpen } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
    const navigate = useNavigate();
    const { auth } = useAuth();

    const handleLogin = (path) => {
        if (!auth) {
            alert("กรุณาเข้าสู่ระบบก่อน");
            navigate("/login");
        } else {
            navigate(path);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-12 flex-grow">
            <section className="text-center">
                <h1 className="text-4xl font-bold mb-2 text-[#292524]">
                    ระบบการสอบผ่านระบบออนไลน์
                </h1>
                <p className="text-lg text-[#78716C]">
                    รายวิชา 517321 - Principles of Programming Languages
                </p>
                <p className="text-sm mt-1 text-[#78716C]">
                    กรุณาเข้าสู่ระบบเพื่อเริ่มทำข้อสอบและตรวจสอบผลคะแนนของคุณ
                </p>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                    <div className="flex items-center gap-2 mb-2 text-xl font-semibold text-[#292524]">
                        <MdEditNote className="text-2xl" />
                        เริ่มทำข้อสอบ
                    </div>
                    <p className="mb-4 text-[#78716C]">เข้าสู่หน้าทำข้อสอบ</p>
                    <button
                        onClick={() => handleLogin("/exams")}
                        className="bg-[#00A859] text-white px-4 py-2 rounded hover:bg-[#008a49] transition"
                    >
                        ไปยังหน้าข้อสอบ
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                    <div className="flex items-center gap-2 mb-2 text-xl font-semibold text-[#292524]">
                        <AiOutlineBarChart className="text-2xl" />
                        ผลการสอบ
                    </div>
                    <p className="mb-4 text-[#78716C]">ตรวจสอบผลคะแนนจากการสอบที่ผ่านมา</p>
                    <button
                        onClick={() => handleLogin("/results")}
                        className="bg-[#F57C00] text-white px-4 py-2 rounded hover:bg-[#e66a00] transition"
                    >
                        ดูผลการสอบ
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                    <div className="flex items-center gap-2 mb-2 text-xl font-semibold text-[#292524]">
                        <FiBookOpen className="text-2xl" />
                        คู่มือการใช้งาน
                    </div>
                    <p className="mb-4 text-[#78716C]">ศึกษาขั้นตอนการใช้งานระบบ</p>
                    <button
                        onClick={() => navigate("/guide")}
                        className="bg-[#636B77] text-white px-4 py-2 rounded hover:bg-[#4e5560] transition"
                    >
                        อ่านคู่มือ
                    </button>
                </div>

            </section>
        </div>
    );
}

export default Header;
