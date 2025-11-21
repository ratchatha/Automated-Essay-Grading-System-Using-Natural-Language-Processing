from pydantic import BaseModel, Field
from typing import List, Optional, Any

class Answer(BaseModel):
    questionId: str
    studentAnswer: str
    score: Optional[float] = None
    _id: Optional[Any] = None

class StudentAnswer(BaseModel):
    student: Optional[str] = None
    studentId: str
    studentName: Optional[str] = None
    examId: str
    answers: List[Answer]
