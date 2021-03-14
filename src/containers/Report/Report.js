import React, { Component } from "react";
import { Spinner } from "react-bootstrap";
import axios from "axios";

import Chart from "../../components/Chart/Chart";
import Aux from "../../hoc/Auxiliary/Auxiliary";

import classes from "./Report.module.css";

class Report extends Component {
  state = {
    label1: ["1st Week", "2nd Week", "3rd Week", "4th Week"],
    label2: ["Food", "Fuel", "Home", "Shopping", "Other"],
    data1: [0, 0, 0, 0],
    data2: [0, 0, 0, 0, 0],
    loading: false,
  };

  componentDidMount() {
    this.setState({ loading: true });
    axios
      .get("/api/expense/report", {
        headers: {
          userid: this.props.user.id,
        },
      })
      .then(({ data }) => {
        const { perWeekCost, perCategoryCost } = data;
        this.setState({
          data1: perWeekCost,
          data2: perCategoryCost,
          loading: false,
        });
      })
      .catch((err) => console.log(err));
  }
  render() {
    let spinner = (
      <Aux>
        <div className={classes.ChartContainer}>
          <Chart
            bgColor="rgba(241, 90, 176, 0.6)"
            title="Expenses of current month based on week"
            label={this.state.label1}
            data={this.state.data1}
            borderColor="rgba(203, 11, 188, 0.8)"
          />
        </div>
        <div className={classes.ChartContainer}>
          <Chart
            bgColor="rgba(121, 242, 141, 0.6)"
            title="Expenses of current month based on category"
            label={this.state.label2}
            data={this.state.data2}
            borderColor="rgba(11, 145, 42, 0.8)"
          />
        </div>
      </Aux>
    );

    if (this.state.loading) {
      spinner = <Spinner animation="grow" variant="info" />;
    }
    return (
      <Aux>
        <h1 className="mb-2 text-center">Report</h1>
        <div className="d-flex flex-wrap justify-content-center">{spinner}</div>
      </Aux>
    );
  }
}

export default Report;
