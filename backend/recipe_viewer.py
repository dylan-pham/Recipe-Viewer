from flask import Flask, request, jsonify
from flask.json import detect_encoding
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

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
    def get_recipe_matching_filter(values, key, comparator):
        union = set()

        for value in values:
            union.update(map(lambda doc: doc.id, collection_ref.where(
                key, comparator, value).stream()))

        return union

    req = request.get_json()

    # initally, set of recipe ids contains all recipe ids
    recipe_ids = set()
    for doc in collection_ref.stream():
        recipe_ids.add(doc.id)

    comparator = {"categories": "array_contains", "author": "==", "cuisine": "==", "ingredients": "array_contains"}

    # filtering out recipes that don't match given filters
    for key in req:
        if key in ["categories", "author", "cuisine"]:
            recipe_ids.intersection_update(get_recipe_matching_filter(req[key], key, comparator[key]))
        elif key in ["total_time", "prep_time", "cook_time"]:
            recipe_ids.intersection_update(get_recipe_matching_filter([int(req[key])], key, "<="))
        elif key == "ingredients":
            recipe_ids.intersection_update(get_recipe_matching_filter(
                req["ingredients"], "ingredients", "array_contains").update(get_recipe_matching_filter(
                    req["ingredients"], "optional_ingredients", "array_contains")))

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
    try:
        req = request.get_json()
        recipe_id = req["id"]
        recipe_details = collection_ref.document(recipe_id).get().to_dict()
        recipe_details["id"] = recipe_id

        return jsonify({"res": recipe_details})
    except:
        return jsonify({"res": "invalid id/no id provided"})


# sample response:
# {
#   "author": {<author name> : <recipe count>, ...},
#   "cuisine": {...},
#   "categories": {...},
#   "ingredients": {...}
# }
@ app.route("/getFilters", methods=["GET"])
def get_recipe_detail_counts():
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

    update_recipe_details_counter(new_recipe_data, None, "add")
    update_recipe_details_counter(None, old_recipe_data, "delete")

    return jsonify({"res": "recipe updated"})


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
    try:
        req = request.get_json()
        recipe_id = req["id"]
        recipe_data = collection_ref.document(recipe_id).get().to_dict()
        collection_ref.document(recipe_id).delete()

        update_recipe_details_counter(None, recipe_data, "delete")

        return jsonify({"res": "recipe deleted"})
    except:
        return jsonify({"res": "invalid id/no id provided"})


def update_recipe_details_counter(new_recipe_data, old_recipe_data, method):
    def has_one_recipe(doc_name):
        return recipe_details_collection.document(doc_name).get().get(db.field_path(old_recipe_data[doc_name])) == 1

    def inc_count(doc_name, key, count_change):
        recipe_details_collection.document(doc_name).update(
            {db.field_path(key): firestore.Increment(count_change)})

    def del_entry(doc_name, key):
        recipe_details_collection.document(doc_name).update({
            db.field_path(key): firestore.DELETE_FIELD})

    def add_recipe():
        inc_count("author", new_recipe_data["author"], 1)
        inc_count("cuisine", new_recipe_data["cuisine"], 1)

        for cat in new_recipe_data["categories"]:
            inc_count("categories", cat, 1)

        for ing in new_recipe_data["ingredients"]:
            inc_count("ingredients", ing, 1)

    def del_recipe():
        if has_one_recipe("author"):
            del_entry("author", old_recipe_data["author"])
        else:
            inc_count("author", old_recipe_data["author"], -1)

        if has_one_recipe("cuisine"):
            del_entry("cuisine", old_recipe_data["cuisine"])
        else:
            inc_count("cuisine", old_recipe_data["cuisine"], -1)

        for cat in old_recipe_data["categories"]:
            if has_one_recipe("categories"):
                del_entry("categories", cat)
            else:
                inc_count("categories", cat, -1)

        for ing in old_recipe_data["ingredients"]:
            if has_one_recipe("ingredients"):
                del_entry("ingredients", ing)
            else:
                inc_count("ingredients", ing, -1)

    recipe_details_collection = db.collection("recipe_details_counter")

    if method == "add":
        add_recipe()
    else:
        del_recipe()
