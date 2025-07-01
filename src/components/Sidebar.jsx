export const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "students", label: "นักเรียน" },
    { id: "exams", label: "ข้อสอบ" },
    { id: "summary", label: "สรุปผล" },
  ];

  return (
    <div className="w-64 bg-white border-r p-4 shadow-md">
      <h2 className="text-xl font-bold mb-6 text-center text-blue-700">แผงควบคุม</h2>
      <ul className="space-y-3">
        {tabs.map((tab) => (
          <li
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`cursor-pointer p-3 rounded-lg hover:bg-blue-100 ${
              activeTab === tab.id ? "bg-blue-200 font-semibold" : ""
            }`}
          >
            {tab.label}
          </li>
        ))}
      </ul>
    </div>
  );
};
