from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from backend.app.database import Base

class ClinicalCase(Base):
    __tablename__ = "clinical_cases"

    id = Column(Integer, primary_key=True, index=True)
    ed_history = Column(Text, nullable=False)
    oph_soc_history = Column(Text, nullable=False)
    predicted_diagnosis = Column(Text, nullable=True)
    final_diagnosis = Column(Text, nullable=True)  # Doctor's validation
    location_of_disease = Column(String, nullable=True)
    severity = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now())
