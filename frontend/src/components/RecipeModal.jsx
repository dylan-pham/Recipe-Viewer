import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

function RecipeModal(props) {
  const [show, setShow] = useState(props.visible);
  const [recipeData] = useState(props.recipeData);

  useEffect(() => {
    setShow(props.visible);
  }, [props.visible]);

  return (
    <div class="card border-0">
      <Modal show={show} onHide={() => props.onClose()}>
        <Modal.Header closeButton>
          <Modal.Title>Recipe Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card style={{ width: "100%" }}>
            <Card.Img variant="top" src={recipeData["img"]} />
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Card.Title>{recipeData["name"]}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {"by " +
                      recipeData["author"] +
                      " | " +
                      recipeData["cuisine"]}
                  </Card.Subtitle>
                </ListGroup.Item>
                <ListGroup.Item>
                  {recipeData["total_time"] + " total time"}
                  <ul>
                    <li>{recipeData["prep_time"] + " prep time"}</li>
                    <li>{recipeData["wait_time"] + " wait time"}</li>
                    <li>{recipeData["cook_time"] + " cook time"}</li>
                  </ul>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Card.Text>
                    Ingredients
                    <ul>
                      {recipeData["ingredients"].map((ingredient) => {
                        return <li>{ingredient}</li>;
                      })}
                      {recipeData["optional_ingredients"].map((ingredient) => {
                        return <li>{ingredient}</li>;
                      })}
                      {Object.entries(recipeData["subrecipes_ids"]).map(
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
                  <Button href={recipeData["link"]} variant="primary">
                    Recipe Link
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => alert()}>
            Edit
          </Button>
          <Button variant="secondary" onClick={() => props.onClose()}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default RecipeModal;
