const Group = require('../models/groupModel');
const Student = require('../models/studentModel');
const Exam = require('../models/examModel');

const createGroup = async (req, res) => {
  try {
    let { groupName, groupId, description, students = [], exams = [] } = req.body;

    if (!groupName || !groupId) {
      return res.status(400).json({ error: 'กรุณาระบุชื่อกลุ่มและรหัสกลุ่ม' });
    }

    const existing = await Group.findOne({ groupId });
    if (existing) {
      return res.status(400).json({ error: 'มีรหัสกลุ่มนี้อยู่ในระบบแล้ว' });
    }

    /*  const studentDocs = await Student.find({ studentId: { $in: students } });
     const studentObjectIds = studentDocs.map(s => s._id);
 
     const examDocs = await Exam.find({ examId: { $in: exams } });
     const examObjectIds = examDocs.map(e => e._id); */

    // students ที่ส่งมาจาก frontend เป็น _id อยู่แล้ว
    if (!Array.isArray(students)) students = [];
    const studentObjectIds = students.filter((id) => id);

    // exams ก็เช่นเดียวกัน (ส่ง _id มาจาก frontend)
    if (!Array.isArray(exams)) exams = [];
    const examObjectIds = exams.filter((id) => id);

    const group = new Group({
      groupName,
      groupId,
      description: description || "",
      students: studentObjectIds,
      exams: examObjectIds
    });

    await group.save();

    res.status(201).json({ message: 'สร้างกลุ่มสำเร็จ', group });
  } catch (error) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาด: ' + error.message });
  }
};

const getGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate('students', 'studentId studentName department').populate('exams', 'examId title');;
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาด: ' + error.message });
  }
};

const getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findOne({ groupId: groupId.toUpperCase() }).populate('students', 'studentId studentName department').populate('exams', 'examId title');

    if (!group) return res.status(404).json({ error: 'ไม่พบกลุ่มที่ระบุ' });

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาด: ' + error.message });
  }
};

const updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { students = [], exams = [], groupName } = req.body;

    // ตรวจสอบ input
    if (!Array.isArray(students) && !Array.isArray(exams)) {
      return res.status(400).json({
        error: 'รูปแบบข้อมูลไม่ถูกต้อง',
      });
    }
    const group = await Group.findOne({ groupId: groupId.toUpperCase() });
    if (!group) {
      return res.status(404).json({ error: 'ไม่พบกลุ่มในระบบ' });
    }

    if (groupName && groupName.trim() !== "") {
      group.groupName = groupName.trim();
    }

    // อัปเดตนักศึกษา
    let updatedStudents = 0;
    let studentArray = Array.isArray(students) ? students.filter(s => s && s.trim && s.trim() !== "") : [];
    if (studentArray.length > 0) {
      const studentDocs = await Student.find({ _id: { $in: studentArray } });

      if (studentDocs.length === 0) {
        return res.status(404).json({ error: 'ไม่พบนักศึกษาในระบบ' });
      }
      const studentObjectIds = studentDocs.map((s) => s._id);

      // ลบ group เดิมออกจากนักศึกษาทุกคนก่อน
      await Student.updateMany(
        { group: group._id },
        { $unset: { group: "" } }
      );

      // ตั้ง group ใหม่ให้กับนักศึกษาที่เลือก
      await Student.updateMany(
        { _id: { $in: studentObjectIds } },
        { $set: { group: group._id } }
      );

      // อัปเดตใน group
      group.students = studentObjectIds;
      updatedStudents = studentObjectIds.length;

    } else {
      // ถ้าส่ง students = [] ล้างนักศึกษาทั้งหมดในกลุ่ม
      group.students = [];
      await Student.updateMany(
        { group: group._id },
        { $unset: { group: "" } }
      );
    }

    // อัปเดตข้อสอบ
    let updatedExams = 0;
    let examArray = (Array.isArray(exams) ? exams : [exams]).filter(e => e && e.toString().trim() !== "");
    if (examArray.length > 0) {
      const examDocs = await Exam.find({ _id: { $in: examArray } });

      if (examDocs.length === 0) {
        return res.status(404).json({ error: 'ไม่พบข้อสอบในระบบ' });
      }

      const examObjectIds = examDocs.map((e) => e._id);
      group.exams = examObjectIds;
      updatedExams = examObjectIds.length;
    } else {
      group.exams = [];
    }

    // บันทึก
    await group.save();

    // ดึงข้อมูลที่อัปเดตแล้ว
    const updatedGroup = await Group.findById(group._id)
      .populate('students', 'studentId studentName department')
      .populate('exams', 'examId title');

    res.status(200).json({
      message: `อัปเดตกำหนดสมาชิกและข้อสอบในกลุ่ม ${group.groupName} สำเร็จ`,
      updatedStudents,
      updatedExams,
      group: updatedGroup,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาด: ' + error.message });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!groupId) {
      return res.status(400).json({ error: 'กรุณาระบุรหัสกลุ่มที่จะลบ' });
    }

    // ค้นหากลุ่ม
    const group = await Group.findOne({ groupId: groupId.toUpperCase() });
    if (!group) {
      return res.status(404).json({ error: 'ไม่พบกลุ่มในระบบ' });
    }

    // ล้าง group ของนักศึกษาที่อยู่ในกลุ่มนี้
    await Student.updateMany(
      { group: group._id },
      { $unset: { group: "" } }
    );

    await Group.deleteOne({ _id: group._id });

    res.status(200).json({
      message: `ลบกลุ่ม ${group.groupName} (${group.groupId}) สำเร็จ`,
    });

  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการลบกลุ่ม:", error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาด: ' + error.message });
  }
};

module.exports = {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  deleteGroup
};
