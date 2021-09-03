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
  const [filtersModalVisible, setfiltersModalVisible] = useState(false);
  const [filters, setFilters] = useState({});
  const [refreshFilters, setRefreshFilters] = useState(false);

  function updateRecipes() {
    console.log(filters);
    fetch("http://127.0.0.1:5000/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filters),
    })
      .then((response) => response.json())
      .then((data) => {
        setRecipeIds(data["res"]);
      });
  }

  function deleteRecipe(id) {
    fetch("http://127.0.0.1:5000/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    }).then(() => {
      updateRecipes();
      setRefreshFilters(true);
    });
  }

  function addRecipe(recipeData) {
    fetch("http://127.0.0.1:5000/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recipeData),
    }).then(() => {
      updateRecipes();
      setRefreshFilters(true);
    });
  }

  function updateRecipe(recipeData) {
    fetch("http://127.0.0.1:5000/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recipeData),
    }).then(() => {
      updateRecipes();
      setRefreshFilters(true);
    });
  }

  useEffect(() => {
    updateRecipes();
  }, [filters]);

  return (
    <div className="App">
      <header className="App-header">
        <NavigationBar
          onAddButtonClicked={() => {
            setAddRecipeModalVisible(true);
          }}
          onFiltersButtonClicked={() => {
            setfiltersModalVisible(true);
          }}
        />
        <Row className="justify-content-center">
          {recipeIds.map((id) => (
            <RecipeOverviewCard
              id={id}
              delete={(id) => deleteRecipe(id)}
              update={(recipeData) => updateRecipe(recipeData)}
            />
          ))}
        </Row>
        <AddRecipeModal
          visible={addRecipeModalVisible}
          onClose={() => setAddRecipeModalVisible(false)}
          addRecipe={(recipeData) => addRecipe(recipeData)}
        />
        <FiltersModal
          visible={filtersModalVisible}
          onClose={(filters) => {
            setfiltersModalVisible(false);
            setFilters(filters);
          }}
          refresh={refreshFilters}
          doneRefreshing={() => setRefreshFilters(false)}
        />
      </header>
    </div>
  );
}
