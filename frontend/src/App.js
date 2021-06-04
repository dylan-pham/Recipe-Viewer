import React, { useState, useEffect, componentWillMount } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import RecipeCard from "./components/RecipeCard";
import NavigationBar from "./components/NavigationBar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function App() {
  const [recipeIds, setRecipeIds] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((data) => {
        setRecipeIds(data["res"]);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <NavigationBar />
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
      </header>
    </div>
  );
}

export default App;
