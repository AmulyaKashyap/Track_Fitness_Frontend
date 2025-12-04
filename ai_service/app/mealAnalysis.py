import json
import os

from dotenv import load_dotenv
from langchain.schema import BaseMessage
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq

load_dotenv()


class Chain:
    def __init__(self):

        self.llm = ChatGroq(
            temperature=0,
            groq_api_key=os.getenv("GROQ_API_KEY"),
            model_name="llama-3.3-70b-versatile"
        )

        self.prompt = PromptTemplate.from_template(
            """
            ### MEAL NAME:
            {meal_name}

            ### INSTRUCTION:
            Find nutritional breakdown of provided meal name.

            Return **only valid JSON** in the following format:
            {{
                "dish_name": "Chicken Salad",
                "ingredients": ["chicken", "lettuce", "tomato", "olive oil"],
                "macros": {{
                    "calories": 350,
                    "protein": 30,
                    "carbs": 10,
                    "fat": 15
                }},
                "analysis_text": "It is a healthy and protein-rich meal, I have considered 1bowl(200g) of salad as nothing mentioned."
            }}

            Rules:
            - Do NOT add any extra explanation or preamble.
            - Respond with JSON only.
            """
        )

    def _safe_json_parse(self, response_text: str) -> dict:
        try:
            return json.loads(response_text)
        except json.JSONDecodeError:
            # Attempt to clean unwanted text and extract valid JSON only
            cleaned = response_text.strip()
            start = cleaned.find("{")
            end = cleaned.rfind("}") + 1
            if start != -1 and end != -1:
                try:
                    return json.loads(cleaned[start:end])
                except json.JSONDecodeError:
                    return {
                        "error": "Model returned invalid JSON, please try again.",
                        "raw_response": response_text
                    }
            return {
                "error": "Unable to extract JSON from response.",
                "raw_response": response_text
            }

    def analyze_meal(self, meal_name: str) -> dict:
        chain = self.prompt | self.llm

        res: BaseMessage = chain.invoke({"meal_name": meal_name})

        response_text = res.content if hasattr(res, "content") else str(res)

        return self._safe_json_parse(response_text)


# For direct testing (when running analyze.py directly)
if __name__ == "__main__":
    chain = Chain()
    print(json.dumps(chain.analyze_meal("Paneer Butter Masala"), indent=4))
