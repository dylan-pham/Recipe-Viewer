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

function FilterSelector(props) {
  const [selectedFilters, setSelectedFilters] = useState(props.selectedFilters);

  useEffect(() => {
    setSelectedFilters(props.selectedFilters);
  }, [props.selectedFilters]);

  return (
    <Form id={props.formId}>
      {Object.entries(props.filterCounts[props.filterType]).map(
        ([key, value]) => {
          return (
            <Form.Check
              type={"checkbox"}
              name={key}
              id={key}
              label={key + " (" + value + ")"}
              checked={selectedFilters[key]}
              onClick={() => props.onClick(key)}
            />
          );
        }
      )}
    </Form>
  );
}

export default function FilterModal(props) {
  const [filterCounts, setFilterCounts] = useState(null);
  const [selectedAuthors, setSelectedAuthors] = useState({});
  const [selectedCuisines, setSelectedCuisines] = useState({});
  const [selectedIngredients, setSelectedIngredients] = useState({});
  const [selectedCategories, setSelectedCategories] = useState({});
  const [maxTotalTimeValue, setMaxTotalTimeValue] = useState([24, 60]);
  const [maxPrepTimeValue, setMaxPrepTimeValue] = useState([24, 60]);
  const [maxCookTimeValue, setMaxCookTimeValue] = useState([24, 60]);

  function addNewFilters(data, filterType, existingFilters, addFunc) {
    Object.keys(data["res"][filterType]).forEach((x) => {
      if (!(x in existingFilters)) {
        addFunc({ ...existingFilters, [x]: false });
      }
    });
  }

  useEffect(() => {
    fetch("http://127.0.0.1:5000/getFilters", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setFilterCounts(data["res"]);
        addNewFilters(data, "author", selectedAuthors, setSelectedAuthors);
        addNewFilters(data, "cuisine", selectedCuisines, setSelectedCuisines);
        addNewFilters(
          data,
          "ingredients",
          selectedIngredients,
          setSelectedIngredients
        );
        addNewFilters(
          data,
          "categories",
          selectedCategories,
          setSelectedCategories
        );
        props.doneRefreshing();
      });
  }, [props.refresh]);

  function applySelectedFilters(obj, tempSelectedFilters, filterType) {
    let accList = [];
    Object.keys(obj).forEach((x) => {
      if (obj[x] == true) {
        accList.push(x);
      }
    });

    if (accList.length !== 0) {
      tempSelectedFilters[filterType] = accList;
    }
  }

  function getSelectedFilters() {
    let tempSelectedFilters = {};

    applySelectedFilters(selectedAuthors, tempSelectedFilters, "author");
    applySelectedFilters(selectedCuisines, tempSelectedFilters, "cuisine");
    applySelectedFilters(
      selectedIngredients,
      tempSelectedFilters,
      "ingredients"
    );
    applySelectedFilters(selectedCategories, tempSelectedFilters, "categories");

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

  const clearFilters = () => {
    setMaxTotalTimeValue([24, 60]);
    setMaxPrepTimeValue([24, 60]);
    setMaxCookTimeValue([24, 60]);

    Object.keys(selectedAuthors).forEach((key) =>
      setSelectedAuthors({ ...selectedAuthors, [key]: false })
    );
    Object.keys(selectedCuisines).forEach((key) =>
      setSelectedCuisines({ ...selectedCuisines, [key]: false })
    );
    Object.keys(selectedIngredients).forEach((key) =>
      setSelectedIngredients({ ...selectedIngredients, [key]: false })
    );
    Object.keys(selectedCategories).forEach((key) =>
      setSelectedCategories({ ...selectedCategories, [key]: false })
    );
  };

  if (filterCounts === null) {
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
                <FilterSelector
                  filterCounts={filterCounts}
                  selectedFilters={selectedAuthors}
                  formId="authorsSelector"
                  filterType="author"
                  onClick={(key) => {
                    setSelectedAuthors({
                      ...selectedAuthors,
                      [key]: !selectedAuthors[key],
                    });
                  }}
                />
              </Tab>
              <Tab eventKey="cuisine" title="Cuisine">
                <FilterSelector
                  filterCounts={filterCounts}
                  selectedFilters={selectedCuisines}
                  formId="cuisinesSelector"
                  filterType="cuisine"
                  onClick={(key) => {
                    setSelectedCuisines({
                      ...selectedCuisines,
                      [key]: !selectedCuisines[key],
                    });
                  }}
                />
              </Tab>
              <Tab eventKey="ingredients" title="Ingredients">
                <FilterSelector
                  filterCounts={filterCounts}
                  selectedFilters={selectedIngredients}
                  formId="ingredientsSelector"
                  filterType="ingredients"
                  onClick={(key) => {
                    setSelectedIngredients({
                      ...selectedIngredients,
                      [key]: !selectedIngredients[key],
                    });
                  }}
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
                  filterCounts={filterCounts}
                  selectedFilters={selectedCategories}
                  formId="categoriesSelector"
                  filterType="categories"
                  onClick={(key) => {
                    setSelectedCategories({
                      ...selectedCategories,
                      [key]: !selectedCategories[key],
                    });
                  }}
                />
              </Tab>
            </Tabs>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={clearFilters}>Reset Filters</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
