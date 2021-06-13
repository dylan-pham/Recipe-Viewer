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

  function getCategoriesToFilter() {
    let categoriesToFilter = [];
    Array.from(document.getElementById("categoriesSelector").elements).forEach(
      (element) => {
        if (element.checked) {
          categoriesToFilter.push(element.getAttribute("name"));
        }
      }
    );

    return categoriesToFilter;
  }

  function getAuthorsToFilter() {
    let authorsToFilter = [];
    Array.from(document.getElementById("authorsSelector").elements).forEach(
      (element) => {
        if (element.checked) {
          authorsToFilter.push(element.getAttribute("name"));
        }
      }
    );

    return authorsToFilter;
  }

  function getCuisinesToFilter() {
    let cuisinesToFilter = [];
    Array.from(document.getElementById("cuisinesSelector").elements).forEach(
      (element) => {
        if (element.checked) {
          cuisinesToFilter.push(element.getAttribute("name"));
        }
      }
    );

    return cuisinesToFilter;
  }

  function getIngredientsToFilter() {
    let ingredientsToFilter = [];
    Array.from(document.getElementById("ingredientsSelector").elements).forEach(
      (element) => {
        if (element.checked) {
          ingredientsToFilter.push(element.getAttribute("name"));
        }
      }
    );

    return ingredientsToFilter;
  }

  function getMaximumTotalTimeFilter() {
    return document.getElementById("maxTotalTime").value;
  }

  function getFilters() {
    let filters = {};

    let categoriesToFilter = getCategoriesToFilter();
    let authorsToFilter = getAuthorsToFilter();
    let cuisinesToFilter = getCuisinesToFilter();
    let ingredientsToFilter = getIngredientsToFilter();

    if (categoriesToFilter.length !== 0) {
      filters["categories"] = categoriesToFilter;
    }
    if (authorsToFilter.length !== 0) {
      filters["author"] = authorsToFilter;
    }
    if (cuisinesToFilter.length !== 0) {
      filters["cuisine"] = cuisinesToFilter;
    }
    if (ingredientsToFilter.length !== 0) {
      filters["ingredients"] = ingredientsToFilter;
    }
    // if (
    //   getMaximumTotalTimeFilter() !== null &&
    //   Number.isInteger(getMaximumTotalTimeFilter())
    // ) {
    //   alert("Test");
    // }

    return filters;
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
              <Form id="authorsSelector">
                <Form.Check type={"checkbox"} name="Khoi" label="Khoi" />
                <Form.Check
                  type={"checkbox"}
                  name="Hungry Huy"
                  label="Hungry Huy"
                />
                <Form.Check
                  type={"checkbox"}
                  name="Gordon Ramsay"
                  label="Gordon Ramsay"
                />
                <Form.Check
                  type={"checkbox"}
                  name="Jamie Oliver"
                  label="Jamie Oliver"
                />
              </Form>
            </Tab>
            <Tab eventKey="cuisine" title="Cuisine">
              <Form id="cuisinesSelector">
                <Form.Check
                  type={"checkbox"}
                  name="Vietnamese"
                  label="Vietnamese"
                />
                <Form.Check type={"checkbox"} name="Italian" label="Italian" />
                <Form.Check
                  type={"checkbox"}
                  name="American"
                  label="American"
                />
                <Form.Check
                  type={"checkbox"}
                  name="Japanese"
                  label="Japanese"
                />
              </Form>
            </Tab>
            <Tab eventKey="ingredients" title="Ingredients">
              <Form id="ingredientsSelector">
                <Form.Check type={"checkbox"} name="tomato" label="tomato" />
                <Form.Check type={"checkbox"} name="lettuce" label="lettuce" />
                <Form.Check
                  type={"checkbox"}
                  name="bread flour"
                  label="bread flour"
                />
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
              <Form id="categoriesSelector">
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
          <Button variant="secondary" onClick={() => props.onClose({})}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              props.onClose(getFilters());
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
