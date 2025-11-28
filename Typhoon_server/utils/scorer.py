""" from sentence_transformers import util """
from openai import OpenAI
from dotenv import load_dotenv
import os
load_dotenv()


client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"), base_url=os.getenv("OPENAI_BASE_URL"))
def compute_score_llm(question: str, teacher_answers: str, student_answer: str) -> float:
    prompt = (
        "คุณคือผู้ตรวจข้อสอบ วิชา Principles of Programming Languages\n"
        f"คำถาม: {question}\n"
        f"คำตอบอาจารย์:\n{teacher_answers}\n"
        f"คำตอบนักเรียน:\n{student_answer}\n\n"
        "หน้าที่ของคุณคือเปรียบเทียบคำตอบของนักเรียนกับคำตอบตัวอย่างของครู "
        "และให้คะแนนตามความถูกต้องของเนื้อหาและความใกล้เคียงของความหมาย "
        "ให้คะแนนในช่วง 0 ถึง 1 โดยที่: "
        "0 หมายถึงคำตอบไม่ถูกเลย, 0.3 หมายถึงถูกบางส่วน, "
        "0.5 หมายถึงถูกครึ่งหนึ่ง, 0.8 หมายถึงถูกเกือบทั้งหมด, "
        "และ 1 หมายถึงคำตอบถูกต้องสมบูรณ์ "
        "ให้ตอบกลับเป็นเพียงตัวเลขคะแนนเท่านั้นโดยไม่ต้องอธิบายเพิ่มเติม"
        "คะแนน:"
    )

    #typhoon-v2.5-30b-a3b-instruct
    #typhoon-v2.1-12b-instruct
    response = client.chat.completions.create(
        model="typhoon-v2.5-30b-a3b-instruct",          
        messages=[
            {"role": "system", "content": "คุณเป็นผู้ช่วยตรวจข้อสอบอัตนัยที่แม่นยำและเป็นกลาง"},
            {"role": "user", "content": prompt}
        ],  
        max_tokens=10,        
        temperature=0.0,    
        top_p=1.0
    )
    text = response.choices[0].message.content.strip()
    print("score:", text)
    return text

def compute_score(student_ans: str, teacher_answers, model):
    # หาก teacher_answers เป็น str ให้แปลงเป็น list
    if isinstance(teacher_answers, str):
        teacher_answers = [teacher_answers]

    student_ans = student_ans.strip()
    max_score = 0.0

    for ta in teacher_answers:
        ta = ta.strip()
        embeddings = model.encode([student_ans, ta], convert_to_tensor=True)
        sim = util.cos_sim(embeddings[0], embeddings[1]).item()
        #score = round(sim * 10, 2)
        score = round(sim * 10 ,2)
        print(ta)
        print("score:", score)
        max_score = max(max_score, score)

    return max_score