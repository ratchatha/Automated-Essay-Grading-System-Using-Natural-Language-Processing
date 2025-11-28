from fastapi import APIRouter, HTTPException
from database.db import db
from database.schema import StudentAnswer
from utils.scorer import compute_score ,compute_score_llm

router = APIRouter()

@router.post("/evaluate")
async def evaluate(student_data: StudentAnswer):
    exam = await db.exams.find_one({"examId": student_data.examId})
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    
    question_texts = {}
    model_answers = {}
    question_scores = {}

    for q in exam.get("questions", ""):
        qid = q.get("questionId")
        if qid:
            question_texts[qid] = q.get("questionText", "")
            model_answers[qid] = q.get("modelAnswers", "")
            question_scores[qid] = q.get("answersScore", 1)

    total_score = 0
    results = []

    for ans in student_data.answers:
        question_id = ans.questionId
        student_answer = ans.studentAnswer

        question_text = question_texts.get(question_id)
        teacher_answers = model_answers.get(question_id)
        full_score = question_scores.get(question_id)

        if not teacher_answers or not question_text:
            continue

        raw_score  = compute_score_llm(question_text, teacher_answers, student_answer)
        
        if raw_score is None or full_score is None:
             scaled_score = 0.0  
        else:
            try:
                scaled_score = round(float(raw_score) * float(full_score), 1)
            except (ValueError, TypeError):
                scaled_score = 0.0

        total_score += scaled_score
        
        # บันทึกผล
        results.append({
            "questionId": question_id,
            "studentAnswer": student_answer,
            "full_score": full_score,
            "score": scaled_score
        })

        await db.studentAnswers.update_one(
            {
                "studentId": student_data.studentId,
                "examId": student_data.examId,
                "answers.questionId": question_id
            },
            {
                "$set": {"answers.$.score": scaled_score}
            },
            sort={"_id": -1}
        )

    await db.studentAnswers.update_one(
    {
        "studentId": student_data.studentId,
        "examId": student_data.examId
    },
    {
        "$set": {"totalScore": round(total_score, 2)}
    },
    sort={"_id": -1}
    )
    return {
        "message": "Scoring completed",
        "total_exam": len(results),
        "studentId": student_data.studentId,
        "studentName": student_data.studentName,
        "examId": student_data.examId,
        "total_score": round(total_score, 2),
        "results": results
    }