from fastapi import FastAPI
from pydantic import BaseModel

from .mealAnalysis import Chain

app = FastAPI()
chain = Chain()


class DishInformation(BaseModel):
    dish_name: str


@app.get("/")
def test():
    return {"message": "Running fine"}


@app.post("/analyze_meal")
async def analyze_meal(req: DishInformation):
    data = chain.analyze_meal(req.dish_name)
    return data
