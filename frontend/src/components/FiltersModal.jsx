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
  const [filters, setFilters] = useState(null);
  const [selectedFilters] = useState({});
  const [maxTotalTimeValue, setMaxTotalTimeValue] = useState([24, 60]);
  const [maxPrepTimeValue, setMaxPrepTimeValue] = useState([24, 60]);
  const [maxCookTimeValue, setMaxCookTimeValue] = useState([24, 60]);

  function FilterSelector(props) {
    return (
      <Form id={props.formId}>
        {Object.entries(filters[props.filterType]).map(([key, value]) => {
          return (
            <Form.Check
              type={"checkbox"}
              name={key}
              id={key}
              label={key + " (" + value + ")"}
              defaultChecked={selectedFilters[key]}
            />
          );
        })}
      </Form>
    );
  }

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
            if (!(y in selectedFilters)) {
              selectedFilters[y] = false;
            }
          });
        });
        props.doneRefreshing();
      });
  }, [props.refresh]);

  function getSelectedFiltersOfType(formId) {
    let values = [];
    Array.from(document.getElementById(formId).elements).forEach((element) => {
      if (element.checked) {
        values.push(element.getAttribute("name"));
      }
    });

    return values;
  }

  function processSelectedFiltersOfType(type, formId, selectedFiltersAcc) {
    let filtersSelected = getSelectedFiltersOfType(formId);
    if (filtersSelected.length !== 0) {
      selectedFiltersAcc[type] = filtersSelected;

      filtersSelected.forEach((x) => {
        selectedFilters[x] = true;
      });
    }
  }

  function getSelectedFilters() {
    let tempSelectedFilters = {};

    processSelectedFiltersOfType(
      "categories",
      "categoriesSelector",
      tempSelectedFilters
    );
    processSelectedFiltersOfType(
      "author",
      "authorsSelector",
      tempSelectedFilters
    );
    processSelectedFiltersOfType(
      "cuisine",
      "cuisinesSelector",
      tempSelectedFilters
    );
    processSelectedFiltersOfType(
      "ingredients",
      "ingredientsSelector",
      tempSelectedFilters
    );

    let maxTotalTime = maxTotalTimeValue[0] * 60 + maxTotalTimeValue[1];
    if (!isNaN(maxTotalTime)) {
      tempSelectedFilters["total_time"] = maxTotalTime;
    }

    let maxPrepTime = maxPrepTimeValue[0] * 60 + maxPrepTimeValue[1];
    if (!isNaN(maxPrepTime)) {
      tempSelectedFilters["prep_time"] = maxPrepTime;
    }

    let maxCookTime = maxCookTimeValue[0] * 60 + maxCookTimeValue[1];
    if (!isNaN(maxCookTime)) {
      tempSelectedFilters["cook_time"] = maxCookTime;
    }

    return tempSelectedFilters;
  }

  const resetFilters = () => {
    setMaxTotalTimeValue([24, 60]);
    setMaxPrepTimeValue([24, 60]);
    setMaxCookTimeValue([24, 60]);

    Object.keys(selectedFilters).forEach((filter) => {
      selectedFilters[filter] = false;
      var filterCheckbox = document.getElementById(filter);
      filterCheckbox.checked = false;
    });
  };

  if (filters === null) {
    return <div></div>;
  } else {
    return (
      <>
        <Modal
          show={props.visible}
          onHide={() => props.onClose(getSelectedFilters())}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Filters</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tabs defaultActiveKey="author" id="uncontrolled-tab-example">
              <Tab eventKey="author" title="Author">
                <FilterSelector formId="authorsSelector" filterType="author" />
              </Tab>
              <Tab eventKey="cuisine" title="Cuisine">
                <FilterSelector
                  formId="cuisinesSelector"
                  filterType="cuisine"
                />
              </Tab>
              <Tab eventKey="ingredients" title="Ingredients">
                <FilterSelector
                  formId="ingredientsSelector"
                  filterType="ingredients"
                />
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
              <Tab eventKey="category" title="Categories">
                <FilterSelector
                  formId="categoriesSelector"
                  filterType="categories"
                />
              </Tab>
            </Tabs>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={resetFilters}>Reset Filters</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
