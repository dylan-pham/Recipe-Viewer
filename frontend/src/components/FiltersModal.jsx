import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

function FilterModal(props) {
  const [show, setShow] = useState(props.visible);

  useEffect(() => {
    setShow(props.visible);
  }, [props.visible]);

  return (
    <>
      <Modal show={show} onHide={props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
            <Tab eventKey="home" title="Author"></Tab>
            <Tab eventKey="profile" title="Cuisine"></Tab>
            <Tab eventKey="contact" title="Ingredients"></Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={props.onClose}>
            Apply Filters
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default FilterModal;
