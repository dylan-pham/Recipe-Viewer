import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "react-bootstrap/Card";

function RecipeCard(props) {
  const [id] = useState(props.id);
  const [recipeData, setRecipeData] = useState(null);

  useEffect(() => {
    setRecipeData(initRecipeDetails(id));
  }, []);

  function initRecipeDetails(recipeId) {
    fetch("http://127.0.0.1:5000/getRecipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: recipeId }),
    })
      .then((response) => response.json())
      .then((data) => {
        setRecipeData(data["res"]);
      });
  }

  if (recipeData == null) {
    return <div></div>;
  } else {
    return (
      <Card>
        <Card.Header>
          <Card.Body>
            <Card.Img
              variant="top"
              src={recipeData["img"]}
              style={{ width: "18rem" }}
            />
            <Card.Title>{recipeData["name"]}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {"by " + recipeData["author"] + " | " + recipeData["cuisine"]}
            </Card.Subtitle>
            <Card.Link href={recipeData["link"]}>Recipe Link</Card.Link>
          </Card.Body>
        </Card.Header>
      </Card>
    );
  }
}

export default RecipeCard;
