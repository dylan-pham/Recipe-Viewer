import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import RecipeDetailsCard from "./RecipeDetailsCard";
import RecipeEditCard from "./RecipeEditCard";

function RecipeModal(props) {
  const [show, setShow] = useState(props.visible);
  const [editMode, setEditMode] = useState(false);

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
            <RecipeEditCard recipeData={props.recipeData} />
          ) : (
            <RecipeDetailsCard recipeData={props.recipeData} />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => (editMode ? alert() : setEditMode(true))}>
            {editMode ? "Apply Changes" : "Edit"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default RecipeModal;
