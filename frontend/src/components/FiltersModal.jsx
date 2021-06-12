import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";

function FilterModal(props) {
  const [show, setShow] = useState(props.visible);

  useEffect(() => {
    setShow(props.visible);
  }, [props.visible]);

  function getCategories() {
    let categoriesToFilter = [];
    Array.from(document.getElementById("categoryFilters").elements).forEach(
      (element) => {
        if (element.checked) {
          categoriesToFilter.push(element.getAttribute("name"));
        }
      }
    );

    return categoriesToFilter;
  }

  return (
    <>
      <Modal show={show} onHide={props.onClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
            <Tab eventKey="home" title="Author">
              <Form>
                <Form.Check type={"checkbox"} label="Khoi" />
                <Form.Check type={"checkbox"} label="Hungry Huy" />
                <Form.Check type={"checkbox"} label="Gordon Ramsay" />
                <Form.Check type={"checkbox"} label="Jamie Oliver" />
              </Form>
            </Tab>
            <Tab eventKey="cuisine" title="Cuisine">
              <Form>
                <Form.Check type={"checkbox"} label="Vietnamese" />
                <Form.Check type={"checkbox"} label="Italian" />
                <Form.Check type={"checkbox"} label="American" />
                <Form.Check type={"checkbox"} label="Japanese" />
              </Form>
            </Tab>
            <Tab eventKey="ingredients" title="Ingredients">
              <Form>
                <Form.Check type={"checkbox"} label="tomato" />
                <Form.Check type={"checkbox"} label="lettuce" />
                <Form.Check type={"checkbox"} label="bread flour" />
              </Form>
            </Tab>
            <Tab eventKey="time" title="Time">
              <InputGroup>
                <FormControl placeholder="total" />
                <InputGroup.Text>hours</InputGroup.Text>
                <FormControl placeholder="time" />
                <InputGroup.Text>minutes</InputGroup.Text>
              </InputGroup>
              <InputGroup>
                <FormControl placeholder="active" />
                <InputGroup.Text>hours</InputGroup.Text>
                <FormControl placeholder="time" />
                <InputGroup.Text>minutes</InputGroup.Text>
              </InputGroup>
            </Tab>
            <Tab eventKey="contact" title="Categories">
              <Form id="categoryFilters">
                <Form.Check type={"checkbox"} name="soup" label="soup" />
                <Form.Check
                  type={"checkbox"}
                  name="rice dish"
                  label="rice dish"
                />
                <Form.Check type={"checkbox"} name="seafood" label="seafood" />
                <Form.Check type={"checkbox"} name="pork" label="pork" />
              </Form>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              props.onClose(getCategories());
            }}
          >
            Apply Filters
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default FilterModal;
