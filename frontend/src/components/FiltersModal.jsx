import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

export default function FilterModal(props) {
  const [show, setShow] = useState(props.visible);
  const [filters, setFilters] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/getFilters", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setFilters(data["res"]);
      });
  }, []);

  useEffect(() => {
    setShow(props.visible);
  }, [props.visible]);

  return (
    <>
      <Modal show={show} onHide={() => props.onClose(getFilters())} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="author" id="uncontrolled-tab-example">
            <Tab eventKey="author" title="Author">
              <Form id="authorsSelector">
                {/* {Object.keys(
                  filters["author"]
                    ? "author" in filters && filters !== null
                    : {}
                ).map(function (key, index) {
                  console.log(key);
                })}
                ; */}
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
                <label
                  for="maxActiveTime"
                  class="form-label"
                  id="activeTimeLabel"
                >
                  Active Time
                </label>
                <input
                  type="range"
                  class="form-range"
                  min="0"
                  max="120"
                  step="5"
                  id="maxActiveTime"
                  defaultValue="120"
                ></input>
                <label for="maxTotalTime" class="form-label">
                  Total Time
                </label>
                <input
                  type="range"
                  class="form-range"
                  min="0"
                  max="120"
                  step="5"
                  id="maxTotalTime"
                  defaultValue="120"
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
      </Modal>
    </>
  );
}

function getMaxTimeFilter(timeType) {
  return document.getElementById("max" + timeType + "Time").value;
}

function getValuesToFilter(formId) {
  let values = [];
  Array.from(document.getElementById(formId).elements).forEach((element) => {
    if (element.checked) {
      values.push(element.getAttribute("name"));
    }
  });

  return values;
}

function getFilters() {
  let filters = {};

  let categoriesToFilter = getValuesToFilter("categoriesSelector");
  let authorsToFilter = getValuesToFilter("authorsSelector");
  let cuisinesToFilter = getValuesToFilter("cuisinesSelector");
  let ingredientsToFilter = getValuesToFilter("ingredientsSelector");
  let maxTotalTime = getMaxTimeFilter("Total");
  let maxActiveTime = getMaxTimeFilter("Active");

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
  if (!isNaN(maxTotalTime)) {
    filters["total_time"] = maxTotalTime;
  }
  if (!isNaN(maxActiveTime)) {
    filters["active_time"] = maxActiveTime;
  }

  return filters;
}
