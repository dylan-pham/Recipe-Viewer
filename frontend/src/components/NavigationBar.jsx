import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

function NavigationBar(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Container>
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
              <Button onClick={props.onAddButtonClicked}>Add</Button>
            </Nav.Item>
            <Nav.Item>
              <Button onClick={props.onFiltersButtonClicked}>Filter</Button>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>
    </Container>
  );
}

export default NavigationBar;
