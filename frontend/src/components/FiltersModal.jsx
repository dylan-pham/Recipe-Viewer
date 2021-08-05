import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Slider from "@material-ui/core/Slider";

export default function FilterModal(props) {
  const [show, setShow] = useState(props.visible);
  const [filters, setFilters] = useState(null);
  const [checkedFilters, setCheckedFilters] = useState([]);
  const [maxTotalTimeValue, setMaxTotalTimeValue] = useState(300);
  const [maxActiveTimeValue, setMaxActiveTimeValue] = useState(300);
  const [showAll, setShowAll] = useState(false);

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

  function getValuesToFilter(formId) {
    let values = [];
    Array.from(document.getElementById(formId).elements).forEach((element) => {
      if (element.checked) {
        values.push(element.getAttribute("name"));
      }
    });

    return values;
  }

  function valuetext(value) {
    return `${value}°C`;
  }

  function getFilters() {
    setCheckedFilters([]);

    let filters = {};

    let categoriesToFilter = getValuesToFilter("categoriesSelector");
    let authorsToFilter = getValuesToFilter("authorsSelector");
    let cuisinesToFilter = getValuesToFilter("cuisinesSelector");
    let ingredientsToFilter = getValuesToFilter("ingredientsSelector");
    let maxTotalTime = maxTotalTimeValue;
    let maxActiveTime = maxActiveTimeValue;

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
    if (!isNaN(maxTotalTime) && !document.getElementById("showAll").checked) {
      filters["total_time"] = maxTotalTime;
    }
    if (!isNaN(maxActiveTime) && !document.getElementById("showAll").checked) {
      filters["active_time"] = maxActiveTime;
    }

    let temp = [];
    categoriesToFilter.forEach((x) => {
      temp.push(x);
    });
    authorsToFilter.forEach((x) => {
      temp.push(x);
    });
    ingredientsToFilter.forEach((x) => {
      temp.push(x);
    });
    cuisinesToFilter.forEach((x) => {
      temp.push(x);
    });

    setCheckedFilters(temp);

    return filters;
  }

  if (filters === null) {
    return <div></div>;
  } else {
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
                  {Object.entries(filters["author"]).map(([key, value]) => {
                    return (
                      <Form.Check
                        type={"checkbox"}
                        name={key.replaceAll("_", " ")}
                        label={key.replaceAll("_", " ") + " (" + value + ")"}
                        defaultChecked={checkedFilters.includes(
                          key.replaceAll("_", " ")
                        )}
                      />
                    );
                  })}
                </Form>
              </Tab>
              <Tab eventKey="cuisine" title="Cuisine">
                <Form id="cuisinesSelector">
                  {Object.entries(filters["cuisine"]).map(([key, value]) => {
                    return (
                      <Form.Check
                        type={"checkbox"}
                        name={key.replaceAll("_", " ")}
                        label={key.replaceAll("_", " ") + " (" + value + ")"}
                        defaultChecked={checkedFilters.includes(
                          key.replaceAll("_", " ")
                        )}
                      />
                    );
                  })}
                </Form>
              </Tab>
              <Tab eventKey="ingredients" title="Ingredients">
                <Form id="ingredientsSelector">
                  {Object.entries(filters["ingredients"]).map(
                    ([key, value]) => {
                      return (
                        <Form.Check
                          type={"checkbox"}
                          name={key.replaceAll("_", " ")}
                          label={key.replaceAll("_", " ") + " (" + value + ")"}
                          defaultChecked={checkedFilters.includes(
                            key.replaceAll("_", " ")
                          )}
                        />
                      );
                    }
                  )}
                </Form>
              </Tab>
              <Tab eventKey="time" title="Time">
                <InputGroup>
                  <label class="form-label">Active Time</label>
                  <Slider
                    defaultValue={maxActiveTimeValue}
                    getAriaValueText={valuetext}
                    aria-labelledby="discrete-slider"
                    step={5}
                    marks
                    min={0}
                    max={300}
                    valueLabelDisplay="auto"
                    onChange={(event, newValue) =>
                      setMaxActiveTimeValue(newValue)
                    }
                  />
                  <label class="form-label">Total Time</label>
                  <Slider
                    defaultValue={maxTotalTimeValue}
                    getAriaValueText={valuetext}
                    aria-labelledby="discrete-slider"
                    step={5}
                    marks
                    min={0}
                    max={300}
                    valueLabelDisplay="auto"
                    onChange={(event, newValue) =>
                      setMaxTotalTimeValue(newValue)
                    }
                  />
                  <input
                    type="checkbox"
                    id="showAll"
                    checked={showAll}
                    onClick={() => setShowAll(!showAll)}
                  ></input>
                  <label for="showAll">Show All</label>
                </InputGroup>
              </Tab>
              <Tab eventKey="contact" title="Categories">
                <Form id="categoriesSelector">
                  {Object.entries(filters["categories"]).map(([key, value]) => {
                    return (
                      <Form.Check
                        type={"checkbox"}
                        name={key.replaceAll("_", " ")}
                        label={key.replaceAll("_", " ") + " (" + value + ")"}
                        defaultChecked={checkedFilters.includes(
                          key.replaceAll("_", " ")
                        )}
                      />
                    );
                  })}
                </Form>
              </Tab>
            </Tabs>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

// function getMaxTimeFilter(timeType) {
//   return document.getElementById("max" + timeType + "Time").value;
// }

// function getValuesToFilter(formId) {
//   let values = [];
//   Array.from(document.getElementById(formId).elements).forEach((element) => {
//     if (element.checked) {
//       values.push(element.getAttribute("name"));
//     }
//   });

//   let temp = checkedFilters;
//   temp.push(values);
//   localStorage.setItem("foo", temp);

//   return values;
// }

// function getFilters() {
//   setCheckedFilters([]);

//   let filters = {};

//   let categoriesToFilter = getValuesToFilter("categoriesSelector");
//   let authorsToFilter = getValuesToFilter("authorsSelector");
//   let cuisinesToFilter = getValuesToFilter("cuisinesSelector");
//   let ingredientsToFilter = getValuesToFilter("ingredientsSelector");
//   let maxTotalTime = getMaxTimeFilter("Total");
//   let maxActiveTime = getMaxTimeFilter("Active");

//   if (categoriesToFilter.length !== 0) {
//     filters["categories"] = categoriesToFilter;
//   }
//   if (authorsToFilter.length !== 0) {
//     filters["author"] = authorsToFilter;
//   }
//   if (cuisinesToFilter.length !== 0) {
//     filters["cuisine"] = cuisinesToFilter;
//   }
//   if (ingredientsToFilter.length !== 0) {
//     filters["ingredients"] = ingredientsToFilter;
//   }
//   if (!isNaN(maxTotalTime)) {
//     filters["total_time"] = maxTotalTime;
//   }
//   if (!isNaN(maxActiveTime)) {
//     filters["active_time"] = maxActiveTime;
//   }

//   return filters;
// }
