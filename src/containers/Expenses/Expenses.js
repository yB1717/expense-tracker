import React, { Component } from "react";
import { Button, Form, Table, Spinner } from "react-bootstrap";
import axios from "axios";

import Popup from "../../components/Popup/Popup";
import Aux from "../../hoc/Auxiliary/Auxiliary";

class Expenses extends Component {
  state = {
    allExpenses: [],
    addExpenseVars: {
      name: "",
      amount: "",
      date: "",
      category: "",
    },
    editExpenseVars: {
      _id: "",
      name: "",
      amount: "",
      date: "",
      category: "",
    },
    modalShow: false,
    modalType: "",
    filterSelected: false,
    filteredExpenses: [],
    loading: false,
    noExpense: null,
  };

  componentDidMount() {
    this.setState({ loading: true });
    axios
      .get("/api/expense/getAll", {
        headers: {
          userId: this.props.user.id,
        },
      })
      .then(({ data }) => {
        const { allExpenses } = data;
        if (allExpenses.length === 0) {
          this.setState({
            noExpense: <h5 className="text-center">You have no expenses, go ahead and add some.</h5>,
          });
        }
        this.setState({ allExpenses: allExpenses, loading: false });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  setStateAccordingToTheInput = (e, type, field) => {
    if (type === "Add") {
      this.setState({
        addExpenseVars: {
          ...this.state.addExpenseVars,
          [field]: e.target.value,
        },
      });
    } else {
      this.setState({
        editExpenseVars: {
          ...this.state.editExpenseVars,
          [field]: e.target.value,
        },
      });
    }
  };

  onNameChangeHandler = (type, e) => {
    this.setStateAccordingToTheInput(e, type, "name");
  };
  onAmountChangeHandler = (type, e) => {
    this.setStateAccordingToTheInput(e, type, "amount");
  };
  onDateChangeHandler = (type, e) => {
    this.setStateAccordingToTheInput(e, type, "date");
  };
  onCategoryChangeHandler = (type, e) => {
    this.setStateAccordingToTheInput(e, type, "category");
  };

  addClickedHandler = () => {
    this.setState({ modalShow: true, modalType: "Add" });
  };

  editClickedHandler = (id) => {
    const clickedExpense = this.state.allExpenses.filter(
      (exp) => exp._id === id
    )[0];
    const updatedSelectedExpenseVars = {
      ...this.state.editExpenseVars,
      _id: id,
      name: clickedExpense.name,
      amount: clickedExpense.amount,
      date: clickedExpense.date,
      category: clickedExpense.category,
    };
    this.setState({
      modalShow: true,
      modalType: "Edit",
      editExpenseVars: updatedSelectedExpenseVars,
    });
  };

  deleteClickedHandler = (id) => {
    //also delete it from server.
    this.setState({ loading: true });
    axios
      .put("/api/expense/delete", {
        userId: this.props.user.id,
        expenseId: id,
      })
      .then(({ data }) => {
        const { allExpenses } = data;
        this.setState({ allExpenses: allExpenses, loading: false });
      })
      .catch((err) => console.log(err));
  };

  onModalCloseHandler = () => {
    this.setState({
      modalShow: false,
      addExpenseVars: {
        ...this.state.addExpenseVars,
        name: "",
        amount: "",
        date: "",
        category: "",
      },
    });
  };

  checkForUnfilledFields = (fields) => {
    let isValid = true;

    isValid = isValid && fields.name.length;
    isValid = isValid && fields.amount.toString().length;
    isValid = isValid && fields.date.length;
    isValid = isValid && fields.category.length;

    return isValid;
  };

  addingExpenseHandler = () => {
    if (!this.checkForUnfilledFields(this.state.addExpenseVars)) {
      return;
    }
    this.setState({ loading: true });
    //send the new added data to the server
    const data = {
      ...this.state.addExpenseVars,
      userId: this.props.user.id,
    };
    axios
      .post("/api/expense/add", data)
      .then(({ data }) => {
        //expense added
        const { allExpenses } = data;
        //set the expenses in the state
        this.setState({ loading: false, allExpenses: allExpenses });
      })
      .catch((err) => {
        console.log(err);
      });
    this.onModalCloseHandler();
  };

  editingExpenseHandler = (id) => {
    if (!this.checkForUnfilledFields(this.state.editExpenseVars)) {
      console.log("not-valid");
      return;
    }
    //edit on server
    this.setState({ loading: true });
    axios
      .put("/api/expense/edit", {
        expenseToBeUpdated: this.state.editExpenseVars,
        userId: this.props.user.id,
      })
      .then(({ data }) => {
        const { allExpenses } = data;
        this.setState({ loading: false, allExpenses: allExpenses });
      })
      .catch((err) => {
        console.log(err);
      });
    this.onModalCloseHandler();
  };

  filterChangedHandler = (e) => {
    const val = e.target.value;
    if (val === "None") {
      this.setState({ filterSelected: false, filteredExpenses: [] });
    } else {
      const filteredExpenses = this.state.allExpenses.filter(
        (e) => e.category === val
      );
      this.setState({
        filterSelected: true,
        filteredExpenses: filteredExpenses,
      });
    }
  };

  mapExpensesToJSX = (expenses) => {
    return expenses.map((expense) => (
      <tr key={expense._id}>
        <td>{expense._id}</td>
        <td>{expense.name}</td>
        <td>{expense.date}</td>
        <td>&#8377; {expense.amount}</td>
        <td>{expense.category}</td>
        <td>
          <Form inline>
            <Button
              className="mr-auto"
              variant="warning"
              onClick={() => this.editClickedHandler(expense._id)}
            >
              Edit
            </Button>
            <Button
              className="mr-auto"
              variant="danger"
              onClick={() => this.deleteClickedHandler(expense._id)}
            >
              Delete
            </Button>
          </Form>
        </td>
      </tr>
    ));
  };
  render() {
    let tableRows = this.mapExpensesToJSX(this.state.allExpenses);
    if (this.state.filterSelected) {
      tableRows = this.mapExpensesToJSX(this.state.filteredExpenses);
    }
    let spinner = null;
    if (this.state.loading) {
      spinner = <Spinner animation="grow" variant="warning" />;
    }
    return (
      <Aux>
        <h1 style={{ margin: "40px 0" }}>Personal Expenses</h1>
        <Form inline>
          <Button size="lg" onClick={this.addClickedHandler}>
            Add Expense
          </Button>
          <Form.Group className="ml-auto" controlId="categorySelect">
            <Form.Label column="lg">
              <strong>Filter</strong>
            </Form.Label>
            <Form.Control
              onChange={this.filterChangedHandler}
              size="lg"
              as="select"
            >
              <option>None</option>
              <option>Food</option>
              <option>Home</option>
              <option>Fuel</option>
              <option>Shopping</option>
              <option>Other</option>
            </Form.Control>
          </Form.Group>
        </Form>
        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {spinner}
          {this.state.noExpense}
        </div>
        <Table responsive="lg" className="mt-4" hover>
          <thead>
            <tr>
              <th>id</th>
              <th>Name</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Edit/Delete</th>
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </Table>
        <Popup
          show={this.state.modalShow}
          type={this.state.modalType}
          onHide={this.onModalCloseHandler}
          selectedEditTransaction={this.state.editExpenseVars}
          addedExpense={this.state.addExpenseVars}
          nameChange={this.onNameChangeHandler}
          dateChange={this.onDateChangeHandler}
          amountChange={this.onAmountChangeHandler}
          categoryChange={this.onCategoryChangeHandler}
          addExpense={this.addingExpenseHandler}
          editExpense={this.editingExpenseHandler}
        ></Popup>
      </Aux>
    );
  }
}

export default Expenses;
