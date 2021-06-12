import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "react-bootstrap/Card";
import RecipeModal from "./RecipeModal";

function RecipeCard(props) {
  const [recipeData, setRecipeData] = useState(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  useEffect(() => {
    setRecipeData(initRecipeDetails(props.id));
  }, [props.id]);

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
      <>
        <Card
          style={{ width: "25rem", height: "25" }}
          onClick={() => setShowRecipeModal(true)}
        >
          <Card.Header>
            <Card.Body>
              <Card.Img variant="top" src={recipeData["img"]} />
              <Card.Title>{recipeData["name"]}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {"by " + recipeData["author"] + " | " + recipeData["cuisine"]}
              </Card.Subtitle>
            </Card.Body>
          </Card.Header>
        </Card>
        <RecipeModal
          visible={showRecipeModal}
          onClose={() => setShowRecipeModal(false)}
          recipeData={recipeData}
        />
      </>
    );
  }
}

export default RecipeCard;
