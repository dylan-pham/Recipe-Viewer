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
def retrieve_recipes():
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

    req = request.get_json()

    # initally, set of recipe ids contains all recipe ids
    recipe_ids = set()
    for doc in collection_ref.stream():
        recipe_ids.add(doc.id)

    # filtering out recipes that don't match given filters
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
    recipe_id = req["id"]

    recipe_details = collection_ref.document(recipe_id).get().to_dict()
    recipe_details["id"] = recipe_id

    return jsonify({"res": recipe_details})


# sample response:
# {
#   "author": {<author name> : <recipe count>, ...},
#   "cuisine": {...},
#   "categories": {...},
#   "ingredients": {...}
# }
@ app.route("/getFilters", methods=["GET"])
def get_filters():
    filters_n_counts = {}
    filters_n_counts["author"] = db.collection("recipe_details_counter").document("author").get().to_dict()
    filters_n_counts["categories"] = db.collection("recipe_details_counter").document("categories").get().to_dict()
    filters_n_counts["cuisine"] = db.collection("recipe_details_counter").document("cuisine").get().to_dict()
    filters_n_counts["ingredients"] = db.collection("recipe_details_counter").document("ingredients").get().to_dict()

    return jsonify({"res": filters_n_counts})


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
    recipe_data = Recipe.from_dict(req).to_dict()
    collection_ref.add(recipe_data)

    update_recipe_details_counter(recipe_data, None, "add")

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
    recipe_id = req["id"]
    old_recipe_data = collection_ref.document(recipe_id).get().to_dict()
    new_recipe_data = Recipe.from_dict(req).to_dict()
    collection_ref.document(recipe_id).update(new_recipe_data)

    update_recipe_details_counter(new_recipe_data, old_recipe_data, "update")

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
    recipe_data = collection_ref.document(doc_id).get().to_dict()
    collection_ref.document(doc_id).delete()

    update_recipe_details_counter(None, recipe_data, "delete")

    return jsonify({"res": "recipe deleted"})


def update_recipe_details_counter(new_recipe_data, old_recipe_data, method):
    target_collection = db.collection("recipe_details_counter")
    if method == "add":
        target_collection.document("author").update(
            {re.sub('[^0-9a-zA-Z]+', '_', new_recipe_data["author"]): firestore.Increment(1)})

        target_collection.document("cuisine").update(
            {re.sub('[^0-9a-zA-Z]+', '_', new_recipe_data["cuisine"]): firestore.Increment(1)})

        for cat in new_recipe_data["categories"]:
            target_collection.document("categories").update({re.sub('[^0-9a-zA-Z]+', '_', cat): firestore.Increment(1)})

        for ing in new_recipe_data["ingredients"]:
            target_collection.document("ingredients").update(
                {re.sub('[^0-9a-zA-Z]+', '_', ing): firestore.Increment(1)})
    elif method == "update":
        if new_recipe_data["author"] != old_recipe_data["author"]:
            if target_collection.document("author").get().get(
                    re.sub('[^0-9a-zA-Z]+', '_', old_recipe_data["author"])) == 1:
                target_collection.document("author").update({
                    re.sub('[^0-9a-zA-Z]+', '_', old_recipe_data["author"]): firestore.DELETE_FIELD
                })
            else:
                target_collection.document("author").update(
                    {re.sub('[^0-9a-zA-Z]+', '_', old_recipe_data["author"]): firestore.Increment(-1)})
            target_collection.document("author").update(
                {re.sub('[^0-9a-zA-Z]+', '_', new_recipe_data["author"]): firestore.Increment(1)})

        if new_recipe_data["cuisine"] != old_recipe_data["cuisine"]:
            if target_collection.document("cuisine").get().get(
                    re.sub('[^0-9a-zA-Z]+', '_', old_recipe_data["cuisine"])) == 1:
                target_collection.document("cuisine").update({
                    re.sub('[^0-9a-zA-Z]+', '_', old_recipe_data["cuisine"]): firestore.DELETE_FIELD
                })
            else:
                target_collection.document("cuisine").update(
                    {re.sub('[^0-9a-zA-Z]+', '_', old_recipe_data["cuisine"]): firestore.Increment(-1)})
            target_collection.document("cuisine").update(
                {re.sub('[^0-9a-zA-Z]+', '_', new_recipe_data["cuisine"]): firestore.Increment(1)})

        categories_added = list(set(new_recipe_data["categories"]) - set(old_recipe_data["categories"]))
        categories_removed = list(set(old_recipe_data["categories"]) - set(new_recipe_data["categories"]))

        for cat in categories_added:
            target_collection.document("categories").update({re.sub('[^0-9a-zA-Z]+', '_', cat): firestore.Increment(1)})

        for cat in categories_removed:
            if target_collection.document("categories").get().get(re.sub('[^0-9a-zA-Z]+', '_', cat)) == 1:
                target_collection.document("categories").update({
                    re.sub('[^0-9a-zA-Z]+', '_', cat): firestore.FieldValue.delete()
                })
            else:
                target_collection.document("categories").update(
                    {re.sub('[^0-9a-zA-Z]+', '_', cat): firestore.Increment(-1)})

        ingredient_added = list(set(new_recipe_data["ingredients"]) - set(old_recipe_data["ingredients"]))
        ingredients_removed = list(set(old_recipe_data["ingredients"]) - set(new_recipe_data["ingredients"]))

        for ing in ingredient_added:
            target_collection.document("ingredients").update(
                {re.sub('[^0-9a-zA-Z]+', '_', ing): firestore.Increment(1)})

        for ing in ingredients_removed:
            if target_collection.document("ingredients").get().get(re.sub('[^0-9a-zA-Z]+', '_', ing)) == 1:
                target_collection.document("ingredients").update({
                    re.sub('[^0-9a-zA-Z]+', '_', ing): firestore.FieldValue.delete()})
            else:
                target_collection.document("ingredients").update(
                    {re.sub('[^0-9a-zA-Z]+', '_', ing): firestore.Increment(-1)})
    elif method == "delete":
        if target_collection.document("author").get().get(
                re.sub('[^0-9a-zA-Z]+', '_', old_recipe_data["author"])) == 1:
            target_collection.document("author").update({
                re.sub('[^0-9a-zA-Z]+', '_', old_recipe_data["author"]): firestore.DELETE_FIELD
            })
        else:
            target_collection.document("author").update(
                {re.sub('[^0-9a-zA-Z]+', '_', old_recipe_data["author"]): firestore.Increment(-1)})

        if target_collection.document("cuisine").get().get(
                re.sub('[^0-9a-zA-Z]+', '_', old_recipe_data["cuisine"])) == 1:
            target_collection.document("cuisine").update({
                re.sub('[^0-9a-zA-Z]+', '_', old_recipe_data["cuisine"]): firestore.DELETE_FIELD
            })
        else:
            target_collection.document("cuisine").update(
                {re.sub('[^0-9a-zA-Z]+', '_', old_recipe_data["cuisine"]): firestore.Increment(-1)})

        for cat in old_recipe_data["categories"]:
            if target_collection.document("categories").get().get(re.sub('[^0-9a-zA-Z]+', '_', cat)) == 1:
                target_collection.document("categories").update({
                    re.sub('[^0-9a-zA-Z]+', '_', cat): firestore.DELETE_FIELD
                })
            else:
                target_collection.document("categories").update(
                    {re.sub('[^0-9a-zA-Z]+', '_', cat): firestore.Increment(-1)})

        for ing in old_recipe_data["ingredients"]:
            if target_collection.document("ingredients").get().get(re.sub('[^0-9a-zA-Z]+', '_', ing)) == 1:
                target_collection.document("ingredients").update({
                    re.sub('[^0-9a-zA-Z]+', '_', ing): firestore.DELETE_FIELD})
            else:
                target_collection.document("ingredients").update(
                    {re.sub('[^0-9a-zA-Z]+', '_', ing): firestore.Increment(-1)})
