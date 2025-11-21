import { useState } from "react";
import { FiSearch, FiSliders } from "react-icons/fi";

const SearchBar = ({ placeholder = "ค้นหาชื่อนักศึกษา...", onSearch, onSortChange }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("default");

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (onSearch) onSearch(value);
    };

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortOrder(value);
        if (onSortChange) onSortChange(value);
    };

    return (
        <div className="flex items-center gap-3 w-full max-w-3xl">
            <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleChange}
                    className="pl-10 pr-3 py-2 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 shadow-sm transition duration-200 placeholder-gray-400"
                />
            </div>

            <div className="relative">
                <FiSliders className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                    value={sortOrder}
                    onChange={handleSortChange}
                    className="appearance-none pl-9 pr-8 py-2 bg-white rounded-xl border border-gray-300 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm cursor-pointer transition duration-200"
                >
                    <option value="default">เรียงตามค่าเริ่มต้น</option>
                    <option value="name-asc">ชื่อ: ก → ฮ</option>
                    <option value="name-desc">ชื่อ: ฮ → ก</option>
                    <option value="id-asc">รหัสนักศึกษา: น้อย → มาก</option>
                    <option value="id-desc">รหัสนักศึกษา: มาก → น้อย</option>
                </select>

                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    ▼
                </span>
            </div>
        </div>
    );
};

export default SearchBar;
