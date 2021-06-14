import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import FormControl from "react-bootstrap/FormControl";

export default function RecipeEditCard(props) {
  return (
    <Card style={{ width: "100%" }}>
      Image Link
      <FormControl value={props.recipeData["img"]} />
      <Card.Body>
        <ListGroup variant="flush">
          <ListGroup.Item>
            Recipe Name
            <FormControl value={props.recipeData["name"]} />
            Author
            <FormControl value={props.recipeData["author"]} />
            Cuisine
            <FormControl value={props.recipeData["cuisine"]} />
          </ListGroup.Item>
          <ListGroup.Item>
            <ul>
              <li>
                Prep Time
                <FormControl value={props.recipeData["prep_time"]} />
              </li>
              <li>
                Wait Time
                <FormControl value={props.recipeData["wait_time"]} />
              </li>
              <li>
                Cook Time
                <FormControl value={props.recipeData["cook_time"]} />
              </li>
            </ul>
          </ListGroup.Item>
          <ListGroup.Item>
            <Card.Text>
              Ingredients
              <FormControl
                as="textarea"
                value={formatList(props.recipeData["ingredients"])}
              />
              Optional Ingredients
              <FormControl
                as="textarea"
                value={formatList(props.recipeData["optional_ingredients"])}
              />
              Subrecipes
              <FormControl as="textarea" value={formatSubrecipes(props)} />
            </Card.Text>
          </ListGroup.Item>
          <ListGroup.Item>
            Recipe Link
            <FormControl as="textarea" value={props.recipeData["link"]} />
            Categories
            <FormControl
              as="textarea"
              value={formatList(props.recipeData["categories"])}
            />
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

function formatSubrecipes(props) {
  let formattedSubrecipes = "";

  Object.entries(props.recipeData["subrecipes_ids"]).forEach(
    (recipeName, recipeId) => {
      formatSubrecipes += recipeName + "-" + recipeId + ", ";
    }
  );

  return formattedSubrecipes;
}

function formatList(list) {
  let formattedList = "";

  list.forEach((item) => {
    formattedList += item + ", ";
  });

  return formattedList;
}
