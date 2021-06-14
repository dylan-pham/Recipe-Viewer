import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import RecipeOverviewCard from "./components/RecipeOverviewCard";
import NavigationBar from "./components/NavigationBar";
import Row from "react-bootstrap/Row";
import AddRecipeModal from "./components/AddRecipeModal";
import FiltersModal from "./components/FiltersModal";

export default function App() {
  const [recipeIds, setRecipeIds] = useState([]);
  const [addRecipeModalVisible, setAddRecipeModalVisible] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
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
  }, [addRecipeModalVisible, filters]);

  return (
    <div className="App">
      <header className="App-header">
        <NavigationBar
          onAddButtonClicked={() => {
            setAddRecipeModalVisible(true);
          }}
          onFiltersButtonClicked={() => {
            setShowFiltersModal(true);
          }}
        />
        <Row className="justify-content-center">
          {recipeIds.map((id) => (
            <RecipeOverviewCard id={id} />
          ))}
        </Row>
        <AddRecipeModal
          visible={addRecipeModalVisible}
          onClose={() => setAddRecipeModalVisible(false)}
        />
        <FiltersModal
          visible={showFiltersModal}
          onClose={(filters) => {
            setShowFiltersModal(false);
            setFilters(filters);
          }}
        />
      </header>
    </div>
  );
}
