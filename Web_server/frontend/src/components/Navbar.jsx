import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/img/Faculty_of_Science,_Silpakorn_University_Logo.png";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { auth, logout } = useAuth();
    const handleLogout = () => {
        logout();
        navigate("/home");
    };

    const handleLogin = () => {
        navigate("/login");
    };

    return (
        <nav className="bg-white shadow-sm h-[92px] px-4 md:px-8 flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center space-x-4">
                <img
                    src={Logo}
                    alt="Logo"
                    className="h-[80px] w-auto object-contain -my-2"
                />
                <div className="leading-tight hidden sm:block">
                    <h2 className="text-lg font-semibold text-[#292524]">Examination</h2>
                    <p className="text-sm text-[#78716C]">
                        517321 - Principles of Programming Languages
                    </p>
                </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
                <ul className="flex space-x-6 text-sm font-medium ">
                    <li>
                        <Link to="/home" className="text-[#292524] hover:text-[#00A859] transition">
                            หน้าหลัก
                        </Link>
                    </li>

                    <li>
                        <Link
                            to={auth ? "/exams" : "#"}
                            onClick={(e) => {
                                if (!auth) {
                                    e.preventDefault();
                                    alert("กรุณาเข้าสู่ระบบก่อน");
                                }
                            }}
                            className="text-[#292524] hover:text-[#00A859] transition"
                        >
                            ข้อสอบ
                        </Link>
                    </li>

                    <li>
                        <Link
                            to={auth ? "/results" : "#"}
                            onClick={(e) => {
                                if (!auth) {
                                    e.preventDefault();
                                    alert("กรุณาเข้าสู่ระบบก่อน");
                                }
                            }}
                            className="text-[#292524] hover:text-[#00A859] transition"
                        >
                            ผลการสอบ
                        </Link>
                    </li>

                    {/* เงื่อนไขสำหรับ Admin เท่านั้น */}
                    {auth && auth.role === "admin" && (
                        <li>
                            <Link to="/dashboard" className="text-[#292524] hover:text-[#00A859] transition">
                                ระบบผู้ดูแล
                            </Link>
                        </li>
                    )}

                </ul>

                {/* Button Login / Logout */}
                <div className="flex items-center space-x-3">
                    {!auth ? (
                        <button
                            onClick={handleLogin}
                            className="bg-[#292524] text-white px-4 py-1.5 rounded-md border border-[#292524] font-semibold hover:bg-[#44403c]"
                        >
                            Login
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                const confirmed = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ");
                                if (confirmed) {
                                    handleLogout();
                                }
                            }}
                            className="bg-[#BE1515] text-white px-4 py-1.5 rounded-md border border-[#A7180E] font-semibold hover:bg-[#850D0D]"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden">
                <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
                    <svg className="w-6 h-6" fill="none" stroke="#292524" viewBox="0 0 24 24">
                        {isOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="absolute top-[92px] left-0 w-full bg-white border-t border-gray-200 px-4 py-4 flex flex-col space-y-4 md:hidden z-50">
                    <Link to="/" className="text-[#78716C] hover:text-[#292524]">Home</Link>
                    <Link to="/Exams" className="text-[#78716C] hover:text-[#292524]">Exams</Link>
                    <Link to="/Results" className="text-[#78716C] hover:text-[#292524]">Results</Link>
                    <hr />
                    {!auth ? (
                        <button
                            onClick={handleLogin}
                            className="bg-[#292524] text-white px-4 py-1.5 rounded-md border border-[#292524] font-semibold hover:bg-[#44403c] w-full"
                        >
                            Login
                        </button>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="bg-[#BE1515] text-white px-4 py-1.5 rounded-md border border-red-600 font-semibold hover:bg-[#850D0D] w-full"
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
