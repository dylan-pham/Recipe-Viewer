import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import RecipeDetailsCard from "./RecipeDetailsCard";
import RecipeEditCard from "./RecipeEditCard";

export default function RecipeModal(props) {
  const [editMode, setEditMode] = useState(false);
  const [tempRecipeData] = useState(props.recipeData);

  const updateRecipeDataHandler = (k, v) => {
    tempRecipeData[k] = v;
  };

  const onClickDeleteButtonHandler = () => {
    props.delete(tempRecipeData["id"]);
    props.onClose();
    setEditMode(false);
  };

  const onClickEditButtonHandler = () => {
    if (editMode) {
      props.update(tempRecipeData);
      props.onClose();
      setEditMode(false);
    } else {
      setEditMode(true);
    }
  };

  return (
    <div class="card border-0">
      <Modal
        show={props.visible}
        onHide={() => {
          props.onClose();
          setEditMode(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Recipe Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editMode ? (
            <RecipeEditCard
              recipeData={props.recipeData}
              updateRecipeData={updateRecipeDataHandler}
            />
          ) : (
            <RecipeDetailsCard recipeData={props.recipeData} />
          )}
        </Modal.Body>
        <Modal.Footer>
          {editMode ? (
            <Button variant="danger" onClick={onClickDeleteButtonHandler}>
              Delete Recipe
            </Button>
          ) : (
            <div> </div>
          )}
          <Button onClick={onClickEditButtonHandler}>
            {editMode ? "Apply Changes" : "Edit"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
