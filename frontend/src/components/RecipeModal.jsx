import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import RecipeDetailsCard from "./RecipeDetailsCard";

function RecipeModal(props) {
  const [show, setShow] = useState(props.visible);

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
          <RecipeDetailsCard recipeData={props.recipeData} />
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
