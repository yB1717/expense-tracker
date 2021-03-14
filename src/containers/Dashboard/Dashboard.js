import React, { Component } from "react";
import { Card, Spinner, Table } from "react-bootstrap";
import axios from "axios";

import Aux from "../../hoc/Auxiliary/Auxiliary";

import classes from "./Dashboard.module.css";

class DashBoard extends Component {
  state = {
    totalMoneySpent: 0,
    last5Transactions: [],
    loading: false,
  };

  componentDidMount() {
    this.setState({ loading: true });
    axios
      .get("/api/expense/dashboard", {
        headers: {
          userid: this.props.user.id,
        },
      })
      .then(({ data }) => {
        const { money, transactions } = data;
        this.setState({
          totalMoneySpent: money,
          last5Transactions: transactions,
          loading: false,
        });
      })
      .catch((err) => console.log(err));
  }
  render() {
    let transactionList = this.state.last5Transactions.map((t) => (
      <tr key={t._id}>
        <td>{t.name}</td>
        <td>{t.category}</td>
        <td>&#8377; {t.amount}</td>
        <td>{t.date}</td>
      </tr>
    ));

    let noTransactions = (
      <Card.Title className="text-center">
        No Expenses
      </Card.Title>
    );

    let spinner = (
      <Aux>
        <Card className={classes.Money} bg="light">
          <Card.Header className="text-center" as="h4">
            Total Money spent
          </Card.Header>
          <Card.Body>
            <Card.Title className="text-center" as="h1">
              &#8377; {this.state.totalMoneySpent}
            </Card.Title>
          </Card.Body>
        </Card>
        <Card bg="light" className={classes.Transactions}>
          <Card.Header as="h4" className="text-center">
            Last 5 transactions
          </Card.Header>
          {this.state.last5Transactions.length ? (
            <Table borderless hover striped>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>{transactionList}</tbody>
            </Table>
          ) : (
            noTransactions
          )}
        </Card>
      </Aux>
    );
    if (this.state.loading) {
      spinner = <Spinner animation="grow" variant="danger" />;
    }

    return (
      <Aux>
        <h1 style={{ margin: "40px 10px" }}>Dashboard</h1>
        <div className={classes.CardContainer}>{spinner}</div>
      </Aux>
    );
  }
}

export default DashBoard;
