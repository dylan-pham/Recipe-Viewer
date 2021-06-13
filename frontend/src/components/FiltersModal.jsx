import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import DurationPicker from "react-duration-picker";

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
    let maxTotalHours = parseInt(
      document.getElementById("maxTotalHours").value
    );
    let maxTotalMinutes = parseInt(
      document.getElementById("maxTotalMinutes").value
    );

    if (isNaN(maxTotalHours)) {
      return maxTotalMinutes;
    } else if (isNaN(maxTotalMinutes)) {
      return maxTotalHours * 60;
    } else {
      return maxTotalHours * 60 + maxTotalMinutes;
    }
  }

  function getMaxActiveTimeFilter() {
    let maxActiveHours = parseInt(
      document.getElementById("maxActiveHours").value
    );
    let maxActiveMinutes = parseInt(
      document.getElementById("maxActiveMinutes").value
    );

    if (isNaN(maxActiveHours)) {
      return maxActiveMinutes;
    } else if (isNaN(maxActiveMinutes)) {
      return maxActiveHours * 60;
    } else {
      return maxActiveHours * 60 + maxActiveMinutes;
    }
  }

  function getFilters() {
    let filters = {};

    let categoriesToFilter = getCategoriesToFilter();
    let authorsToFilter = getAuthorsToFilter();
    let cuisinesToFilter = getCuisinesToFilter();
    let ingredientsToFilter = getIngredientsToFilter();
    let maximumTotalTime = getMaximumTotalTimeFilter();
    let maxActiveTime = getMaxActiveTimeFilter();

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
    if (!isNaN(maximumTotalTime)) {
      filters["total_time"] = maximumTotalTime;
    }
    if (!isNaN(maxActiveTime)) {
      filters["active_time"] = maxActiveTime;
    }

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
                <InputGroup.Text>total time</InputGroup.Text>
                <input
                  id="maxTotalHours"
                  type="number"
                  min="0"
                  max="48"
                ></input>
                <InputGroup.Text>:</InputGroup.Text>
                <input
                  id="maxTotalMinutes"
                  type="number"
                  min="0"
                  max="60"
                ></input>
              </InputGroup>
              <InputGroup>
                <InputGroup.Text>active time</InputGroup.Text>
                <input
                  id="maxActiveHours"
                  type="number"
                  min="0"
                  max="24"
                ></input>
                <InputGroup.Text>:</InputGroup.Text>
                <input
                  id="maxActiveMinutes"
                  type="number"
                  min="0"
                  max="60"
                ></input>
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
