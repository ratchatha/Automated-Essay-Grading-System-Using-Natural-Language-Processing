import { FiPhone } from "react-icons/fi";

function Footer() {
  return (
    <footer className="bg-gray-100 py-6 border-t border-gray-200 ">
      <div className="max-w-7xl mx-8">
        <section className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-lg font-semibold text-[#292524]">
            <FiPhone className="text-xl" />
            พบปัญหา
          </div>
          <p className="text-sm text-[#78716C] pl-7">
            ติดต่อผู้ดูแลได้ที่{" "}
            <strong className="text-[#00A859]">thongchuen_r@su.ac.th</strong> หรือโทร{" "}
            <strong className="text-[#00A859]">02-123-4567</strong>
          </p>
        </section>
      </div>
    </footer>
  );
}

export default Footer;
