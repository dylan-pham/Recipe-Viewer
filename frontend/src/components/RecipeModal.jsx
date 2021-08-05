import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import RecipeDetailsCard from "./RecipeDetailsCard";
import RecipeEditCard from "./RecipeEditCard";

function RecipeModal(props) {
  const [show, setShow] = useState(props.visible);
  const [editMode, setEditMode] = useState(false);
  const [tempRecipeData, setTempRecipeData] = useState(props.recipeData);

  useEffect(() => {
    setShow(props.visible);
  }, [props.visible]);

  return (
    <div class="card border-0">
      <Modal
        show={show}
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
              updateRecipeData={(k, v) => {
                tempRecipeData[k] = v;
              }}
            />
          ) : (
            <RecipeDetailsCard recipeData={props.recipeData} />
          )}
        </Modal.Body>
        <Modal.Footer>
          {editMode ? (
            <Button
              variant="danger"
              onClick={() => (
                props.delete(tempRecipeData["id"]),
                props.onClose(),
                setEditMode(false)
              )}
            >
              Delete Recipe
            </Button>
          ) : (
            <div> </div>
          )}
          <Button
            onClick={() =>
              editMode
                ? (props.update(tempRecipeData),
                  props.onClose(),
                  setEditMode(false))
                : setEditMode(true)
            }
          >
            {editMode ? "Apply Changes" : "Edit"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default RecipeModal;
