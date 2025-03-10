import openai
import json
import re
from backend.app.config import OPENAI_API_KEY  # ✅ Import API key from config.py

def get_diagnosis(ed_history, oph_soc_history):
    """
    Calls OpenAI API to get the top 3 diagnoses along with the location of disease and severity.
    """
    prompt = f"""
    Given the following emergency department history: {ed_history}
    and ophthalmology history: {oph_soc_history},
    determine the top 3 possible diagnoses with detailed reasoning.

    Additionally, extract:
    - Location of disease (eye, retina, optic nerve, etc.)
    - Severity level (Mild, Moderate, Severe, Emergency)

    Respond in JSON format like this **without markdown code blocks**:
    {{
        "top_3_diagnoses": [
            {{"diagnosis": "Diagnosis 1", "reasoning": "Reasoning for diagnosis 1"}},
            {{"diagnosis": "Diagnosis 2", "reasoning": "Reasoning for diagnosis 2"}},
            {{"diagnosis": "Diagnosis 3", "reasoning": "Reasoning for diagnosis 3"}}
        ],
        "location_of_disease": "Location",
        "severity": "Severity level"
    }}
    """

    try:
        client = openai.OpenAI(api_key=OPENAI_API_KEY)
        response = client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[{"role": "system", "content": prompt}],
            temperature=0.5,
        )

        # ✅ Extract response text
        response_text = response.choices[0].message.content

        # ✅ Remove Markdown code blocks (e.g., ```json ... ```)
        cleaned_response = re.sub(r"```json\n(.*?)\n```", r"\1", response_text, flags=re.DOTALL).strip()

        # ✅ Parse JSON output
        try:
            parsed_response = json.loads(cleaned_response)
            return parsed_response
        except json.JSONDecodeError:
            return {"error": "Invalid JSON format received from ChatGPT", "raw_response": cleaned_response}

    except Exception as e:
        return {"error": f"Failed to get response from OpenAI: {str(e)}"}
