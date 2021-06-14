import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";

export default function RecipeDetailsCard(props) {
  return (
    <Card style={{ width: "100%" }}>
      <Card.Img variant="top" src={props.recipeData["img"]} />
      <Card.Body>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <Card.Title>{props.recipeData["name"]}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {"by " +
                props.recipeData["author"] +
                " | " +
                props.recipeData["cuisine"]}
            </Card.Subtitle>
          </ListGroup.Item>
          <ListGroup.Item>
            {props.recipeData["total_time"] +
              " total time • " +
              props.recipeData["active_time"] +
              " active time"}
            <ul>
              <li>
                {"Prep time: " + reformatTime(props.recipeData["prep_time"])}
              </li>
              <li>
                {"Wait time: " + reformatTime(props.recipeData["wait_time"])}
              </li>
              <li>
                {"Cook time: " + reformatTime(props.recipeData["cook_time"])}
              </li>
            </ul>
          </ListGroup.Item>
          <ListGroup.Item>
            <Card.Text>
              Ingredients
              <ul>
                {props.recipeData["ingredients"].map((ingredient) => {
                  return <li>{ingredient}</li>;
                })}
                {props.recipeData["optional_ingredients"].map((ingredient) => {
                  return <li>{ingredient + " (optional)"}</li>;
                })}
                {Object.entries(props.recipeData["subrecipes_ids"]).map(
                  (recipeName, recipeId) => {
                    return (
                      <li>
                        <a href={recipeId}>{recipeName}</a>
                      </li>
                    );
                  }
                )}
              </ul>
            </Card.Text>
          </ListGroup.Item>
          <ListGroup.Item>
            <Button href={props.recipeData["link"]} variant="primary">
              Recipe Link
            </Button>
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

function reformatTime(minutes) {
  if (minutes < 60) {
    return minutes + " min";
  } else if (minutes % 60 == 0) {
    return (minutes % 60) + " hr";
  } else {
    return Math.floor(minutes / 60) + " hr " + (minutes % 60) + " min";
  }
}
