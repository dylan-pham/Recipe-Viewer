import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Slider from "@material-ui/core/Slider";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

export default function FilterModal(props) {
  const [show, setShow] = useState(props.visible);
  const [filters, setFilters] = useState(null);
  const [checkedFilters] = useState({});
  const [maxTotalTimeValue, setMaxTotalTimeValue] = useState([24, 60]);
  const [maxPrepTimeValue, setMaxPrepTimeValue] = useState([24, 60]);
  const [maxCookTimeValue, setMaxCookTimeValue] = useState([24, 60]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/getFilters", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setFilters(data["res"]);
        Object.keys(data["res"]).forEach((x) => {
          Object.keys(data["res"][x]).forEach((y) => {
            if (!(y in checkedFilters)) {
              checkedFilters[y] = false;
            }
          });
        });
        props.doneRefreshing();
      });
  }, [props.refresh]);

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

  function getFilters() {
    Object.keys(checkedFilters).forEach((key) => {
      checkedFilters[key] = false;
    });

    let filters = {};

    let categoriesToFilter = getValuesToFilter("categoriesSelector");
    let authorsToFilter = getValuesToFilter("authorsSelector");
    let cuisinesToFilter = getValuesToFilter("cuisinesSelector");
    let ingredientsToFilter = getValuesToFilter("ingredientsSelector");
    let maxTotalTime = maxTotalTimeValue[0] * 60 + maxTotalTimeValue[1];
    let maxPrepTime = maxPrepTimeValue[0] * 60 + maxPrepTimeValue[1];
    let maxCookTime = maxCookTimeValue[0] * 60 + maxCookTimeValue[1];

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
    if (!isNaN(maxPrepTime)) {
      filters["prep_time"] = maxPrepTime;
    }
    if (!isNaN(maxCookTime)) {
      filters["cook_time"] = maxCookTime;
    }

    categoriesToFilter.forEach((x) => {
      checkedFilters[x] = true;
    });
    authorsToFilter.forEach((x) => {
      checkedFilters[x] = true;
    });
    ingredientsToFilter.forEach((x) => {
      checkedFilters[x] = true;
    });
    cuisinesToFilter.forEach((x) => {
      checkedFilters[x] = true;
    });

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
                        id={key.replaceAll("_", " ")}
                        label={key.replaceAll("_", " ") + " (" + value + ")"}
                        defaultChecked={
                          checkedFilters[key.replaceAll("_", " ")]
                        }
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
                        />
                      );
                    }
                  )}
                </Form>
              </Tab>
              <Tab eventKey="time" title="Time">
                <InputGroup>
                  <Container>
                    <Row>
                      <label class="form-label">Total Time</label>
                    </Row>
                    <Row>
                      <Col>
                        <Slider
                          id="test"
                          value={maxTotalTimeValue[0]}
                          aria-labelledby="discrete-slider"
                          step={1}
                          marks={[{ value: 12, label: "hours" }]}
                          min={0}
                          max={24}
                          valueLabelDisplay="auto"
                          onChange={(event, newValue) =>
                            setMaxTotalTimeValue([
                              newValue,
                              maxTotalTimeValue[1],
                            ])
                          }
                        />
                      </Col>
                      <Col>
                        <Slider
                          value={maxTotalTimeValue[1]}
                          aria-labelledby="discrete-slider"
                          step={1}
                          marks={[{ value: 30, label: "minutes" }]}
                          min={0}
                          max={60}
                          valueLabelDisplay="auto"
                          onChange={(event, newValue) =>
                            setMaxTotalTimeValue([
                              maxTotalTimeValue[0],
                              newValue,
                            ])
                          }
                        />
                      </Col>
                    </Row>
                    <Row>
                      <label class="form-label">Prep Time</label>
                    </Row>
                    <Row>
                      <Col>
                        <Slider
                          value={maxPrepTimeValue[0]}
                          aria-labelledby="discrete-slider"
                          step={1}
                          min={0}
                          max={24}
                          valueLabelDisplay="auto"
                          onChange={(event, newValue) =>
                            setMaxPrepTimeValue([newValue, maxPrepTimeValue[1]])
                          }
                        />
                      </Col>
                      <Col>
                        <Slider
                          value={maxPrepTimeValue[1]}
                          aria-labelledby="discrete-slider"
                          step={1}
                          min={0}
                          max={60}
                          valueLabelDisplay="auto"
                          onChange={(event, newValue) =>
                            setMaxPrepTimeValue([maxPrepTimeValue[0], newValue])
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
                          value={maxCookTimeValue[0]}
                          aria-labelledby="discrete-slider"
                          step={1}
                          min={0}
                          max={24}
                          valueLabelDisplay="auto"
                          onChange={(event, newValue) =>
                            setMaxCookTimeValue([newValue, maxCookTimeValue[1]])
                          }
                        />
                      </Col>
                      <Col>
                        <Slider
                          value={maxCookTimeValue[1]}
                          aria-labelledby="discrete-slider"
                          step={1}
                          min={0}
                          max={60}
                          valueLabelDisplay="auto"
                          onChange={(event, newValue) =>
                            setMaxCookTimeValue([maxCookTimeValue[0], newValue])
                          }
                        />
                      </Col>
                    </Row>
                  </Container>
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
                      />
                    );
                  })}
                </Form>
              </Tab>
            </Tabs>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                setMaxTotalTimeValue([24, 60]);
                setMaxPrepTimeValue([24, 60]);
                setMaxCookTimeValue([24, 60]);
                Object.keys(checkedFilters).forEach((filter) => {
                  var x = document.getElementById(filter.replaceAll("_", " "));
                  if (x !== null) {
                    // no idea when x could be null
                    x.checked = false;
                  }
                });
              }}
            >
              Reset Filters
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
