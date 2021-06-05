import React, { useState, useEffect, componentWillMount } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import RecipeCard from "./components/RecipeCard";
import NavigationBar from "./components/NavigationBar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AddRecipeModal from "./components/AddRecipeModal";
import FiltersModal from "./components/FiltersModal";

function App() {
  const [recipeIds, setRecipeIds] = useState([]);
  const [addRecipeModalVisible, setAddRecipeModalVisible] = useState(false);
  const [filtersModalVisible, setFiltersModalVisible] = useState(false);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetch("http://127.0.0.1:5000/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filters),
    })
      .then((response) => response.json())
      .then((data) => {
        setRecipeIds(data["res"]);
      });
  }, [filters]);

  function applyFilters(filters) {
    setFilters(filters);
  }

  return (
    <div className="App">
      <header className="App-header">
        <NavigationBar
          onAddButtonClicked={() => {
            setAddRecipeModalVisible(true);
          }}
          onFiltersButtonClicked={() => {
            setFiltersModalVisible(true);
          }}
        />
        <Container>
          <Row>
            {recipeIds.map((id) => {
              return (
                <Col>
                  <RecipeCard id={id} />
                </Col>
              );
            })}
          </Row>
        </Container>
        <AddRecipeModal
          visible={addRecipeModalVisible}
          onClose={() => setAddRecipeModalVisible(false)}
        />
        <FiltersModal
          visible={filtersModalVisible}
          onClose={() => setFiltersModalVisible(false)}
        />
      </header>
    </div>
  );
}

export default App;
