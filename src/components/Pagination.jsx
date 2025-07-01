import React from "react";
import { FiChevronLeft, FiChevronRight, FiRefreshCcw } from "react-icons/fi";

function Pagination({
    currentPage,
    pageSize,
    totalStudents,
    onPageChange,
    onPageSizeChange,
    onRefresh,
}) {
    const totalPages = Math.ceil(totalStudents / pageSize);
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(start + pageSize - 1, totalStudents);

    return (
        <div className="flex items-center space-x-2 text-sm text-gray-700">
            {/* Dropdown for page size */}
            <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1"
            >
                {[10, 25, 50, 100].map((size) => (
                    <option key={size} value={size}>
                        {size}
                    </option>
                ))}
            </select>

            {/* Display range */}
            <span>
                {start} – {end} of {totalStudents}
            </span>

            {/* Refresh */}
            <button
                onClick={onRefresh}
                className="p-1 rounded hover:bg-gray-200 transition"
            >
                <FiRefreshCcw className="w-4 h-4" />
            </button>

            {/* Previous */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1 rounded hover:bg-gray-200 disabled:opacity-40"
            >
                <FiChevronLeft className="w-4 h-4" />
            </button>

            {/* Next */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1 rounded hover:bg-gray-200 disabled:opacity-40"
            >
                <FiChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}

export default Pagination;
