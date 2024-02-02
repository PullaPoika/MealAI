from flask import Flask, redirect, render_template, request, session
from cs50 import SQL
from flask_session import Session
from openai import OpenAI
import os
import random

app = Flask(__name__)
client = OpenAI(
    api_key="Enter own KEY",
)

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///data.db")


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/plan", methods=["GET", "POST"])
def plan():
    if request.method == "POST":
        plan = make_plan(request).choices[0].message.content
        # plan={"days": [{"meal 1": "Whole grain toast with peanut butter and banana","meal 2": "Grilled chicken breast with quinoa and steamed broccoli","meal 3": "Turkey and avocado wrap with whole wheat tortilla","meal 4": "Greek yogurt with mixed berries and a handful of almonds","meal 5": "Salmon fillet with sweet potato and green beans","meal 6": "Cottage cheese with pineapple chunks and a drizzle of honey"}, {"meal 1": "Scrambled eggs with spinach, cheese, and whole grain toast","meal 2": "Tuna salad with mixed greens, cherry tomatoes, and olive oil dressing","meal 3": "Beef stir-fry with brown rice and mixed vegetables","meal 4": "Protein shake with banana and peanut butter","meal 5": "Pork tenderloin with roasted carrots and parsnips","meal 6": "Casein protein powder with skim milk"}]}

        return render_template("plan.html", plan=plan)

    else:
        return render_template("baseForm.html")


@app.route("/review", methods=["GET", "POST"])
def review():
    if request.method == "POST":
        db.execute(
            "INSERT INTO reviews (content, stars, writer) VALUES (?, ?, ?)",
            request.form.get("content"),
            request.form.get("rate"),
            request.form.get("name"),
        )
        return render_template("index.html")

    else:
        return render_template("review.html")


def make_plan(request):
    prompt = "make a meal plan for the following customer."
    fields = [
        "age",
        "gender",
        "height",
        "weight",
        "activity-level",
        "days",
        "meals-per-day",
        "likes",
        "dislikes",
        "includeSnack",
        "cousinePrefrence",
        "budjet",
        "maxTimePerMeal",
    ]
    for field in fields:
        prompt += field
        prompt += ": "
        if request.form.get(field):
            prompt += request.form.get(field)
    prompt += "Desired format: {'days': [{'Meal 1': 'Oatmeal', 'Snack 1': 'Cashew nuts and a protein shake'...}, {'Meal 1': 'Bagels' 'Meal 2': 'potatoes'...}]}, There is no need to return the customer info or the ingridients used for each recepie and snacks do not count as meals"
    print(prompt)
    response = client.chat.completions.create(
        model="gpt-4-1106-preview",
        response_format={"type": "json_object"},
        max_tokens=500,
        messages=[
            {
                "role": "system",
                "content": "You are a helpful personal dietian that gives out meal plans in JSON format.",
            },
            {"role": "user", "content": prompt},
        ],
    )
    return response


@app.route("/gen_ingredients")
def gen_ingredients():
    meals = request.args.get("meals")
    prompt = "Generate a shopping list for the following item(s): "
    prompt += meals
    prompt += "Desired format: {'ingredients': ['milk', 'cereal', 'egg', 'egg']}"
    response = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        response_format={"type": "json_object"},
        max_tokens=500,
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assisstant that when given a meal generates a shopping list for all ingrediants needed in JSON format. Do NOT INCLUDE basic ingrediants like salt, pepper, olive oil, etc",
            },
            {"role": "user", "content": prompt},
        ],
    )
    return response.choices[0].message.content


@app.route("/get_review")
def get_review():
    return db.execute("SELECT * FROM REVIEWS LIMIT 50")
