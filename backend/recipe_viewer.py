from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import re

cred = credentials.Certificate("recipes-312722-5dd21da0fa79.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)
cors = CORS(app)
collection_ref = db.collection("recipes")


# retrieves all recipe ids that match supplied filters
#
# sample request:
# {
#   "categories": [...],            (optional)
#   "author": [...],                (optional)
#   "cuisine": [...],               (optional)
#   "total_time": <in minutes>,     (optional)
#   "active_time": <in minutes>,    (optional)
#   "ingredients": [...]            (optional)
# }
#
# sample response:
# {
#   "res": [<recipe id>...]
# }
@app.route("/", methods=["POST"])
def index():
    req = request.get_json()
    recipe_ids = set()

    for doc in collection_ref.stream():
        recipe_ids.add(doc.id)

    for key in req:
        if key == "categories":
            recipe_ids = recipe_ids.intersection(
                get_recipes_in_categories(collection_ref, req["categories"]))
        elif key == "author":
            recipe_ids = recipe_ids.intersection(get_recipes_by_authors(collection_ref, req["author"]))
        elif key == "cuisine":
            recipe_ids = recipe_ids.intersection(
                get_recipes_in_cuisines(collection_ref, req["cuisine"]))
        elif key in ["total_time", "prep_time", "cook_time"]:
            recipe_ids = recipe_ids.intersection(
                get_recipes_less_than_time(collection_ref, req[key], key))
        elif key == "ingredients":
            recipe_ids = recipe_ids.intersection(
                get_recipes_containing_ingredients(collection_ref, req["ingredients"]))

    return jsonify({"res": list(recipe_ids)})


# retrieves recipe details given id
#
# sample request:
# {
#   "id": <recipe id>   (required)
# }
#
# sample response:
# {
#   "id": <>,
#   "name": <>,
#   "author": <>,
#   "cuisine": <>,
#   "ingredients": [...],
#   "optional_ingredients": [...],
#   "prep_time": <>,
#   "wait_time": <>,
#   "cook_time": <>,
#   "total_time": <>,
#   "active_time": <>,
#   "categories": [],
#   "link": <>,
#   "img": <>
# }
@ app.route("/getRecipe", methods=["POST"])
def get_recipe():
    req = request.get_json()

    temp = collection_ref.document(req["id"]).get().to_dict()
    temp["id"] = req["id"]

    return jsonify({"res": temp})


@ app.route("/getFilters", methods=["GET"])
def get_filters():
    res = {}
    res["author"] = db.collection("recipe_details_counter").document("author").get().to_dict()
    res["categories"] = db.collection("recipe_details_counter").document("categories").get().to_dict()
    res["cuisine"] = db.collection("recipe_details_counter").document("cuisine").get().to_dict()
    res["ingredients"] = db.collection("recipe_details_counter").document("ingredients").get().to_dict()

    return jsonify({"res": res})


# adds recipes to database given recipe details
#
# sample request:
# {
#   "name": <>,                         (optional)
#   "author": <>,                       (optional)
#   "cuisine": <>,                      (optional)
#   "ingredients": [...],               (optional)
#   "optional_ingredients": [...],      (optional)
#   "prep_time": <>,                    (optional)
#   "wait_time": <>,                    (optional)
#   "cook_time": <>,                    (optional)
#   "total_time": <>,                   (optional)
#   "active_time": <>,                  (optional)
#   "categories": [],                   (optional)
#   "link": <>,                         (optional)
#   "img": <>                           (optional)
# }
# sample response:
# {
#   "res": "recipe added"
# }
@ app.route("/add", methods=["POST"])
def add_recipe():
    req = request.get_json()
    collection_ref.add(Recipe.from_dict(req).to_dict())

    return jsonify({"res": "recipe added"})


# updates recipe in database given new recipe details and id
# sample request:
# {
#   "id": <>                            (required)
#   "name": <>,                         (optional)
#   "author": <>,                       (optional)
#   "cuisine": <>,                      (optional)
#   "ingredients": [...],               (optional)
#   "optional_ingredients": [...],      (optional)
#   "prep_time": <>,                    (optional)
#   "wait_time": <>,                    (optional)
#   "cook_time": <>,                    (optional)
#   "total_time": <>,                   (optional)
#   "active_time": <>,                  (optional)
#   "categories": [],                   (optional)
#   "link": <>,                         (optional)
#   "img": <>                           (optional)
# }
# sample response:
# {
#   "res": "recipe updated"
# }
@ app.route("/update", methods=["POST"])
def update_recipe():
    req = request.get_json()
    doc_id = req["id"]
    doc_ref = collection_ref.document(doc_id)
    doc_ref.update(Recipe.from_dict(req).to_dict())

    return jsonify({"res": f"recipe updated"})


# deletes recipe from database given id
#
# sample request:
# {
#   "id": <>    (required)
# }
#
# sample response:
# {
#   "res": "recipe deleted"
# }
@ app.route("/delete", methods=["DELETE"])
def delete_recipe():
    req = request.get_json()
    doc_id = req["id"]
    collection_ref.document(doc_id).delete()

    return jsonify({"res": "recipe deleted"})


def get_recipes_less_than_time(collection_ref, time, field_name):
    return map(lambda doc: doc.id, collection_ref.where(field_name, "<=", int(time)).stream())


def get_recipes_in_categories(collection_ref, categories):
    union = set()
    for category in categories:
        union.update(map(lambda doc: doc.id, collection_ref.where(
            "categories", "array_contains", category).stream()))

    return union


def get_recipes_containing_ingredients(collection_ref, ingredients):
    union = set()
    for ingredient in ingredients:
        union.update(map(lambda doc: doc.id, collection_ref.where(
            "ingredients", "array_contains", ingredient).stream()))
        union.update(map(lambda doc: doc.id, collection_ref.where(
            "optional_ingredients", "array_contains", ingredient).stream()))

    return union


def get_recipes_by_authors(collection_ref, authors):
    union = set()
    for author in authors:
        union.update(map(lambda doc: doc.id, collection_ref.where(
            "author", "==", author).stream()))

    return union


def get_recipes_in_cuisines(collection_ref, cuisines):
    union = set()
    for cuisine in cuisines:
        union.update(map(lambda doc: doc.id, collection_ref.where(
            "cuisine", "==", cuisine).stream()))

    return union


def round_to_nearest_fifth(value):
    if value % 5 < 3:
        return value - value % 5
    else:
        return value + 5 - value % 5


class Recipe:
    def __init__(self, name="unknown", author="unknown", cuisine="unknown",
                 ingredients=[], optional_ingredients=[], prep_time=0,
                 cook_time=0, categories=[],
                 link="", img="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"):
        self.name = name
        self.author = author
        self.cuisine = cuisine
        self.ingredients = ingredients
        self.optional_ingredients = optional_ingredients
        self.prep_time = prep_time
        self.cook_time = cook_time
        self.total_time = prep_time + cook_time
        self.categories = categories
        self.link = link
        self.img = img

    # converts this Recipe to a dictionary
    def to_dict(self):
        return vars(self)

    # converts given dictionary to Recipe
    @ staticmethod
    def from_dict(source_dict):
        recipe = Recipe()

        for key in source_dict:
            if key in ["name", "author", "cuisine", "ingredients",
                       "optional_ingredients", "prep_time",
                       "cook_time", "categories",
                       "link", "img"]:
                setattr(recipe, key, source_dict[key])

        recipe.total_time = int(recipe.prep_time) + int(recipe.cook_time)

        return recipe


# def update_recipe_detail_counts():
#     return
#     target_collection = db.collection("recipe_details_counter")
#     target_collection.document("author").update(
#         {re.sub('[^0-9a-zA-Z]+', '_', doc.get("author")): firestore.Increment(1)})

#     target_collection.document("cuisine").update(
#         {re.sub('[^0-9a-zA-Z]+', '_', doc.get("cuisine")): firestore.Increment(1)})

#     for cat in doc.get("categories"):
#         target_collection.document("categories").update({re.sub('[^0-9a-zA-Z]+', '_', cat): firestore.Increment(1)})

#     for ing in doc.get("ingredients"):
#         target_collection.document("ingredients").update(
#             {re.sub('[^0-9a-zA-Z]+', '_', ing): firestore.Increment(1)})


def generate_recipe_detail_counts():
    target_collection = db.collection("recipe_details_counter")
    for doc in collection_ref.stream():
        target_collection.document("author").update(
            {re.sub('[^0-9a-zA-Z]+', '_', doc.get("author")): firestore.Increment(1)})

        target_collection.document("cuisine").update(
            {re.sub('[^0-9a-zA-Z]+', '_', doc.get("cuisine")): firestore.Increment(1)})

        for cat in doc.get("categories"):
            target_collection.document("categories").update({re.sub('[^0-9a-zA-Z]+', '_', cat): firestore.Increment(1)})

        for ing in doc.get("ingredients"):
            target_collection.document("ingredients").update(
                {re.sub('[^0-9a-zA-Z]+', '_', ing): firestore.Increment(1)})

        doc.reference.update(
            {"total_time": int(doc.get("cook_time")) + int(doc.get("prep_time"))})


def reset_recipe_detail_counts():
    for doc in db.collection("recipe_details_counter").stream():
        doc.reference.set({})


def regenerate():
    reset_recipe_detail_counts()
    generate_recipe_detail_counts()
