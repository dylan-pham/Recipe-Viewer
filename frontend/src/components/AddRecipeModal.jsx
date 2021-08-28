import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Slider from "@material-ui/core/Slider";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

export default function AddRecipeModal(props) {
  const [show, setShow] = useState(props.visible);
  const [prepTime, setPrepTime] = useState([0, 0]);
  const [cookTime, setCookTime] = useState([0, 0]);

  useEffect(() => {
    setShow(props.visible);
  }, [props.visible]);

  function processFormData() {
    const fields = ["name", "author", "cuisine", "img", "link"];

    const listFields = ["categories", "ingredients", "optional_ingredients"];

    let recipeData = {};

    fields.forEach((field) => {
      const value = document
        .getElementById(field)
        .value.replaceAll("'", "APOSTROPHE");
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

    recipeData["prep_time"] = prepTime[0] * 60 + prepTime[1];
    recipeData["cook_time"] = cookTime[0] * 60 + cookTime[1];

    return recipeData;
  }

  return (
    <>
      <Modal show={show} onHide={() => props.onClose()}>
        <Modal.Header closeButton>
          <Modal.Title>Add Recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Form.Control id="name" type="text" placeholder="Name" />
            <Form.Control id="author" type="text" placeholder="Author" />
            <Form.Control id="cuisine" type="text" placeholder="Cuisine" />
            <br />
            <Row>
              <label class="form-label">Prep Time</label>
            </Row>
            <Row>
              <Col>
                <Slider
                  value={prepTime[0]}
                  aria-labelledby="discrete-slider"
                  step={1}
                  min={0}
                  max={24}
                  marks={[{ value: 12, label: "hours" }]}
                  valueLabelDisplay="auto"
                  onChange={(event, newValue) =>
                    setPrepTime([newValue, prepTime[1]])
                  }
                />
              </Col>
              <Col>
                <Slider
                  value={prepTime[1]}
                  aria-labelledby="discrete-slider"
                  step={1}
                  min={0}
                  max={60}
                  marks={[{ value: 30, label: "minutes" }]}
                  valueLabelDisplay="auto"
                  onChange={(event, newValue) =>
                    setPrepTime([prepTime[0], newValue])
                  }
                />
              </Col>
            </Row>
            <Row>
              <label class="form-label">Cook Time</label>
            </Row>
            <Row>
              <Col>
                <Slider
                  value={cookTime[0]}
                  aria-labelledby="discrete-slider"
                  step={1}
                  min={0}
                  max={24}
                  valueLabelDisplay="auto"
                  onChange={(event, newValue) =>
                    setCookTime([newValue, cookTime[1]])
                  }
                />
              </Col>
              <Col>
                <Slider
                  value={cookTime[1]}
                  aria-labelledby="discrete-slider"
                  step={1}
                  min={0}
                  max={59}
                  valueLabelDisplay="auto"
                  onChange={(event, newValue) =>
                    setCookTime([cookTime[0], newValue])
                  }
                />
              </Col>
            </Row>
          </Container>
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => props.onClose()}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              props.add(processFormData());
              setPrepTime([0, 0]);
              setCookTime([0, 0]);
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
