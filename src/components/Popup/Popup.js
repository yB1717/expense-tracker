import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const popup = (props) => {
  let name = "";
  let amount = "";
  let date = "";
  let category = "";
  if (props.type === "Edit") {
    name = props.selectedEditTransaction.name;
    amount = props.selectedEditTransaction.amount;
    date = props.selectedEditTransaction.date;
    category = props.selectedEditTransaction.category;
  } else {
    name = props.addedExpense.name;
    amount = props.addedExpense.amount;
    date = props.addedExpense.date;
    category = props.addedExpense.category;
  }
  return (
    <Modal show={props.show} backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.type} Expense
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              onChange={(e) => props.nameChange(props.type, e)}
              type="text"
              placeholder="Name"
              value={name}
            />
            <Form.Text className="text-muted">
              Must be at least 1 character
            </Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label>Amount</Form.Label>
            <Form.Control
              onChange={(e) => props.amountChange(props.type, e)}
              type="number"
              placeholder="Amount"
              value={amount}
            />
            <Form.Text className="text-muted">
              Must be at least 1 character
            </Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label>Date</Form.Label>
            <Form.Control
              onChange={(e) => props.dateChange(props.type, e)}
              type="date"
              placeholder="Date"
              value={date}
            />
            <Form.Text className="text-muted">
              Select at least one date
            </Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Control
              onChange={(e) => props.categoryChange(props.type, e)}
              as="select"
              defaultValue="choose category"
            >
              <option disabled value="choose category">
                Choose category
              </option>
              <option value="Food">Food</option>
              <option value="Home">Home</option>
              <option value="Fuel">Fuel</option>
              <option value="Shopping">Shopping</option>
              <option value="Other">Other</option>
            </Form.Control>
            <Form.Text className="text-muted">
              Select at least one category
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide} variant="danger">
          Close
        </Button>
        {props.type === "Add" ? (
          <Button onClick={props.addExpense} variant="success">
            {props.type}
          </Button>
        ) : null}
        {props.type === "Edit" ? (
          <Button
            onClick={() => props.editExpense(props.selectedEditTransaction._id)}
            variant="warning"
          >
            {props.type}
          </Button>
        ) : null}
      </Modal.Footer>
    </Modal>
  );
};

export default popup;
