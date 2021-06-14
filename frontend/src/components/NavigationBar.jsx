import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AddRecipeButton from "./AddRecipeButton";
import FilterRecipesButton from "./FilterRecipesButton";

export default function NavigationBar(props) {
  return (
    <Row>
      <Col></Col>
      <Col>
        <Nav className="justify-content-center" activeKey="/home">
          <Nav.Item>
            <Nav.Link href="/">Khoi's Recipes</Nav.Link>
          </Nav.Item>
        </Nav>
      </Col>
      <Col>
        <Nav className="justify-content-end" activeKey="/home">
          <Nav.Item>
            <AddRecipeButton onClick={props.onAddButtonClicked} />
          </Nav.Item>
          <Nav.Item>
            <FilterRecipesButton onClick={props.onFiltersButtonClicked} />
          </Nav.Item>
        </Nav>
      </Col>
    </Row>
  );
}
