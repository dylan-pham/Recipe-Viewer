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
    recipe_ids = []

    if len(req) == 0:  # no filters to apply
        for doc in collection_ref.stream():
            recipe_ids.append(doc.id)
    else:
        for key in req:
            if key == 'categories':
                recipe_ids = apply_category_filters(collection_ref, req['categories'])
            # if key in ['total_time', 'prep_time', 'wait_time', 'cook_time']:
            #     query_ref = apply_time_filters(query_ref, key, req[key])
            # elif key == 'ingredients' or key == 'optional_ingredients':
            #     query_ref = apply_ingredient_filters(query_ref, req[key])
                # elif key in ['author', 'cuisine']:
            #     query_ref = query_ref.where(key, '==', req[key])

    return jsonify({"res": recipe_ids})


# applies food cateogry filter
def apply_category_filters(collection_ref, categories):
    union = set()
    for category in categories:
        union.update(map(lambda doc: doc.id, collection_ref.where(
            "categories", "array_contains", category).stream()))

    return list(union)


# applies filter to check if a given ingredient belongs in any ingredients
# lists
def apply_ingredient_filters(query_ref, ingredients):
    for ingredient in ingredients:
        query_ref = query_ref.where('ingredients', 'array_contains',
                                    ingredient)
        query_ref = query_ref.where('optional_ingredients', 'array_contains',
                                    ingredient)

    return query_ref


# applies filters to find entries below a certain threshold
def apply_time_filters(query_ref, key, value):
    for i in range(round_to_nearest_fifth(value), 0, -5):
        query_ref = query_ref.where(key, '==', i)

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

        return recipe
