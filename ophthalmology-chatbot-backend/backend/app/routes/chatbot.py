from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import ClinicalCase
from backend.app.services.chatgpt_integration import get_diagnosis

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

# ✅ Define request model
class DiagnosisRequest(BaseModel):
    ed_history: str
    oph_soc_history: str

@router.post("/predict")
def predict_diagnosis(request: DiagnosisRequest, db: Session = Depends(get_db)):
    """
    Accepts a JSON request with 'ed_history' and 'oph_soc_history',
    sends it to ChatGPT for diagnosis, and saves the result in the database.
    """
    ed_history = request.ed_history
    oph_soc_history = request.oph_soc_history

    print("Calling ChatGPT...")  # ✅ Debugging log
    diagnosis_result = get_diagnosis(ed_history, oph_soc_history)

    # ✅ Debugging: Print the entire OpenAI response
    print("OpenAI Response:", diagnosis_result)

    # ✅ Check if 'top_3_diagnoses' exists before accessing it
    if "top_3_diagnoses" not in diagnosis_result:
        return {"error": "ChatGPT API response is missing 'top_3_diagnoses'", "response": diagnosis_result}

    # ✅ Save the response to the database
    new_case = ClinicalCase(
        ed_history=ed_history,
        oph_soc_history=oph_soc_history,
        predicted_diagnosis=str(diagnosis_result["top_3_diagnoses"]),
        location_of_disease=diagnosis_result.get("location_of_disease", "Unknown"),
        severity=diagnosis_result.get("severity", "Unknown"),
    )
    db.add(new_case)
    db.commit()

    return diagnosis_result
