from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate('recipes-312722-5dd21da0fa79.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)
cors = CORS(app)
collection_ref = db.collection('recipes')


# retrieves all recipes that match given filters
@app.route('/', methods=['POST'])
def index():
    req = request.get_json()
    recipes = set()  # set of recipe ids

    for doc in collection_ref.stream():
        recipes.add(doc.id)

    else:
        filtered_recipes = recipes
        for key in req:
            if key == "categories":
                filtered_recipes = filtered_recipes.intersection(
                    get_recipes_in_categories(collection_ref, req["categories"]))
            elif key == "author":
                filtered_recipes = filtered_recipes.intersection(get_recipes_by_authors(collection_ref, req["author"]))
            elif key == "cuisine":
                filtered_recipes = filtered_recipes.intersection(
                    get_recipes_in_cuisines(collection_ref, req["cuisine"]))
            elif key in ['total_time', 'active_time']:
                filtered_recipes = filtered_recipes.intersection(
                    get_recipes_less_than_time(collection_ref, req[key], key))
            elif key == "ingredients":
                filtered_recipes = filtered_recipes.intersection(
                    get_recipes_containing_ingredients(collection_ref, req["ingredients"]))

        recipes = filtered_recipes

    return jsonify({"res": list(recipes)})


def get_recipes_less_than_time(collection_ref, time, field_name):
    return map(lambda doc: doc.id, collection_ref.where(field_name, "<=", time).stream())


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


# applies filters to find entries below a certain threshold
def apply_time_filters(query_ref, key, value):
    for i in range(round_to_nearest_fifth(value), 0, -5):
        query_ref = query_ref.where(key, '<=', i)

    return query_ref

# rounds given value to nearest fifth


def round_to_nearest_fifth(value):
    if value % 5 < 3:
        return value - value % 5
    else:
        return value + 5 - value % 5


@ app.route('/getRecipe', methods=['POST'])
def get_recipe():
    req = request.get_json()

    return jsonify({"res": collection_ref.document(req['id']).get().to_dict()})

# adds a recipe to database given various arguments


@ app.route('/add', methods=['POST'])
def add_recipe():
    req = request.get_json()
    collection_ref.add(Recipe.from_dict(req).to_dict())

    return jsonify({"res": "recipe added"})

# updates a recipe given a document id and fields to update


@ app.route('/update', methods=['PUT'])
def update_recipe():
    req = request.get_json()
    doc_id = req['id']
    doc_ref = collection_ref.document(doc_id)
    doc_ref.update(Recipe.from_dict(req).to_dict())

    return jsonify({"res": f"recipe {doc_id} updated"})

# deletes recipe from database given a document id
# {'id': ...}


@ app.route('/delete', methods=['DELETE'])
def delete_recipe():
    req = request.get_json()
    doc_id = req['id']
    collection_ref.document(doc_id).delete()

    return jsonify({"res": f"recipe {doc_id} deleted"})

# represents a recipe in the database


class Recipe:
    def __init__(self, name="unknown", author="unknown", cuisine="unknown",
                 ingredients=[], optional_ingredients=[], prep_time=0,
                 wait_time=0, cook_time=0, subrecipes_ids={}, categories=[],
                 link="", img="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"):
        self.name = name
        self.author = author
        self.cuisine = cuisine
        self.ingredients = ingredients
        self.optional_ingredients = optional_ingredients
        self.prep_time = prep_time
        self.wait_time = wait_time
        self.cook_time = cook_time
        self.total_time = prep_time + wait_time + cook_time
        self.active_time = prep_time + cook_time
        self.subrecipes_ids = subrecipes_ids
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
            if key in ['name', 'author', 'cuisine', 'ingredients',
                       'optional_ingredients', 'prep_time', 'wait_time',
                       'cook_time', 'subrecipes_ids', 'categories',
                       'link', 'img']:
                setattr(recipe, key, source_dict[key])

        recipe.total_time = int(recipe.prep_time) + int(recipe.wait_time) + int(recipe.cook_time)
        recipe.active_time = int(recipe.prep_time) + int(recipe.cook_time)

        return recipe
