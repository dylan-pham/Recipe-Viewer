import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import FormControl from "react-bootstrap/FormControl";
import React, { useState, useEffect } from "react";

export default function RecipeEditCard(props) {
  return (
    <Card style={{ width: "100%" }}>
      Image Link
      <FormControl
        defaultValue={props.recipeData["img"]}
        id="imgLink"
        onChange={() =>
          props.updateRecipeData(
            "img",
            document.getElementById("imgLink").value
          )
        }
      />
      <Card.Body>
        <ListGroup variant="flush">
          <ListGroup.Item>
            Recipe Name
            <FormControl
              id="name"
              defaultValue={props.recipeData["name"]}
              onChange={() =>
                props.updateRecipeData(
                  "name",
                  document.getElementById("name").value
                )
              }
            />
            Author
            <FormControl
              id="author"
              defaultValue={props.recipeData["author"]}
              onChange={() =>
                props.updateRecipeData(
                  "author",
                  document.getElementById("author").value
                )
              }
            />
            Cuisine
            <FormControl
              defaultValue={props.recipeData["cuisine"]}
              id="cuisine"
              onChange={() =>
                props.updateRecipeData(
                  "cuisine",
                  document.getElementById("cuisine").value
                )
              }
            />
          </ListGroup.Item>
          <ListGroup.Item>
            <ul>
              <li>
                Prep Time
                <FormControl
                  id="prep"
                  defaultValue={props.recipeData["prep_time"]}
                  onChange={() =>
                    props.updateRecipeData(
                      "prep_time",
                      document.getElementById("prep").value
                    )
                  }
                />
              </li>
              <li>
                Wait Time
                <FormControl
                  id="wait"
                  defaultValue={props.recipeData["wait_time"]}
                  onChange={() =>
                    props.updateRecipeData(
                      "wait_time",
                      document.getElementById("wait").value
                    )
                  }
                />
              </li>
              <li>
                Cook Time
                <FormControl
                  id="cook"
                  defaulValue={props.recipeData["cook_time"]}
                  onChange={() =>
                    props.updateRecipeData(
                      "cook_time",
                      document.getElementById("cook").value
                    )
                  }
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
                onChange={() =>
                  props.updateRecipeData(
                    "ingredients",
                    convertToList(document.getElementById("ingredients").value)
                  )
                }
              />
              Optional Ingredients
              <FormControl
                id="optIngredients"
                as="textarea"
                defaultValue={formatList(
                  props.recipeData["optional_ingredients"]
                )}
                onChange={() =>
                  props.updateRecipeData(
                    "optional_ingredients",
                    convertToList(
                      document.getElementById("optIngredients").value
                    )
                  )
                }
              />
            </Card.Text>
          </ListGroup.Item>
          <ListGroup.Item>
            Recipe Link
            <FormControl
              id="recipeLink"
              as="textarea"
              defaultValue={props.recipeData["link"]}
              onChange={() =>
                props.updateRecipeData(
                  "link",
                  document.getElementById("recipeLink").value
                )
              }
            />
            Categories
            <FormControl
              id="cats"
              as="textarea"
              defaultValue={formatList(props.recipeData["categories"])}
              onChange={() =>
                props.updateRecipeData(
                  "categories",
                  convertToList(document.getElementById("cats").value)
                )
              }
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
