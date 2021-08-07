import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

export default function AddRecipeModal(props) {
  const [show, setShow] = useState(props.visible);

  useEffect(() => {
    setShow(props.visible);
  }, [props.visible]);

  return (
    <>
      <Modal show={show} onHide={() => props.onClose()}>
        <Modal.Header closeButton>
          <Modal.Title>Add Recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Control id="name" type="text" placeholder="Name" />
            <Form.Control id="author" type="text" placeholder="Author" />
            <Form.Control id="cuisine" type="text" placeholder="Cuisine" />
            <br />
            <Form.Control id="prep_time" type="text" placeholder="Prep Time" />
            <Form.Control id="cook_time" type="text" placeholder="Cook Time" />
            <br />
            <Form.Control
              type="text"
              id="ingredients"
              placeholder="Ingredients (<ingredient>, ...)"
            />
            <Form.Control
              type="text"
              id="optional_ingredients"
              placeholder="Optional Ingredients"
            />
            <br />
            <Form.Control id="img" type="text" placeholder="Image Link" />
            <Form.Control id="link" type="text" placeholder="Recipe Link" />
            <br />
            <Form.Control
              id="categories"
              type="text"
              placeholder="Categories (<category>, ...)"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => props.onClose()}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              props.add(processFormData());
              props.onClose();
            }}
          >
            Add recipe
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function processFormData() {
  const fields = [
    "name",
    "author",
    "cuisine",
    "prep_time",
    "cook_time",
    "img",
    "link",
  ];

  const listFields = ["categories", "ingredients", "optional_ingredients"];

  let recipeData = {};

  fields.forEach((field) => {
    const value = document.getElementById(field).value;
    if (value.length !== 0) {
      recipeData[field] = value;
    }
  });

  listFields.forEach((field) => {
    const value = document.getElementById(field).value;
    if (value.length !== 0) {
      recipeData[field] = value.split(", ");
    }
  });

  return recipeData;
}
