from fastapi import FastAPI
from backend.app.routes import chatbot

app = FastAPI(title="Ophthalmology Triage Chatbot")

# Include chatbot route
app.include_router(chatbot.router)

@app.get("/")
def home():
    return {"message": "Ophthalmology Triage Chatbot Backend is running"}
