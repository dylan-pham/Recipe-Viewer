import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import FormControl from "react-bootstrap/FormControl";
import React from "react";

export default function RecipeEditCard(props) {
  const onFieldChangeHandler = (field_name) => {
    props.updateRecipeData(
      field_name,
      document.getElementById(field_name).value
    );
  };

  const onListFieldChangeHandler = (field_name) => {
    props.updateRecipeData(
      field_name,
      convertToList(document.getElementById(field_name).value)
    );
  };

  return (
    <Card style={{ width: "100%" }}>
      Image Link
      <FormControl
        defaultValue={props.recipeData["img"]}
        id="img"
        onChange={() => onFieldChangeHandler("img")}
      />
      <Card.Body>
        <ListGroup variant="flush">
          <ListGroup.Item>
            Recipe Name
            <FormControl
              id="name"
              defaultValue={props.recipeData["name"]}
              onChange={() => onFieldChangeHandler("name")}
            />
            Author
            <FormControl
              id="author"
              defaultValue={props.recipeData["author"]}
              onChange={() => onFieldChangeHandler("author")}
            />
            Cuisine
            <FormControl
              defaultValue={props.recipeData["cuisine"]}
              id="cuisine"
              onChange={() => onFieldChangeHandler("cuisine")}
            />
          </ListGroup.Item>
          <ListGroup.Item>
            <ul>
              <li>
                Prep Time
                <FormControl
                  id="prep_time"
                  defaultValue={props.recipeData["prep_time"]}
                  onChange={() => onFieldChangeHandler("prep_time")}
                />
              </li>
              <li>
                Cook Time
                <FormControl
                  id="cook_time"
                  defaultValue={props.recipeData["cook_time"]}
                  onChange={() => onFieldChangeHandler("cook_time")}
                />
              </li>
            </ul>
          </ListGroup.Item>
          <ListGroup.Item>
            <Card.Text>
              Ingredients
              <FormControl
                id="ingredients"
                as="textarea"
                defaultValue={formatList(props.recipeData["ingredients"])}
                onChange={() => onListFieldChangeHandler("ingredients")}
              />
              Optional Ingredients
              <FormControl
                id="optional_ingredients"
                as="textarea"
                defaultValue={formatList(
                  props.recipeData["optional_ingredients"]
                )}
                onChange={() =>
                  onListFieldChangeHandler("optional_ingredients")
                }
              />
            </Card.Text>
          </ListGroup.Item>
          <ListGroup.Item>
            Recipe Link
            <FormControl
              id="link"
              as="textarea"
              defaultValue={props.recipeData["link"]}
              onChange={() => onFieldChangeHandler("link")}
            />
            Categories
            <FormControl
              id="categories"
              as="textarea"
              defaultValue={formatList(props.recipeData["categories"])}
              onChange={() => onListFieldChangeHandler("categories")}
            />
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

function formatList(list) {
  let formattedList = "";

  list.forEach((item) => {
    formattedList += item + ", ";
  });

  return formattedList;
}

function convertToList(listAsStr) {
  return listAsStr.split(", ");
}
