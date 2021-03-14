import React, { Component } from "react";
import { Navbar, Container, Spinner } from "react-bootstrap";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import isEmpty from "is-empty";

import NavigationItems from "../../components/Navigation/NavigationItems/NavigationItems";
import Login from "../Login/Login";
import DashBoard from "../Dashboard/Dashboard";
import Expenses from "../Expenses/Expenses";
import Report from "../Report/Report";
import NotFound from "../../components/NotFound/NotFound";
import Aux from "../../hoc/Auxiliary/Auxiliary";

import classes from "./Layout.module.css";

class Layout extends Component {
  state = {
    loggedInUser: null,
    isAuthenticated: false,
    signupLoading: false,
    loginLoading: false,
    signupError: null,
    loginError: null,
    loading: true,
  };

  componentDidMount() {
    const token =
      axios.defaults.headers.common["Authorization"] ||
      localStorage.getItem("jwtToken");
    axios
      .get("/api/users/verify", {
        headers: {
          jwtToken: token,
        },
      })
      .then(({ data }) => {
        if (data.userAuthenticated) {
          this.setState({
            isAuthenticated: true,
            loading: false,
            loggedInUser: data.user,
          });
        } else {
          this.setState({ loading: false });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  loginSubmitHandler = (email, password) => {
    this.setState({ loginLoading: true });
    const data = {
      email: email,
      password: password,
    };
    axios
      .post("/api/users/login", data)
      .then((response) => {
        if (
          response.data.message ||
          response.data.email ||
          response.data.password
        ) {
          this.setState({
            loginError: "Password/Email is not right",
            loginLoading: false,
          });
          setTimeout(() => {
            this.setState({ loginError: null });
          }, 5000);
        } else {
          const { token } = response.data;
          localStorage.setItem("jwtToken", token);
          this.setAuthToken(token);
          const decoded = jwt_decode(token);
          this.setState({
            loginLoading: false,
            isAuthenticated: !isEmpty(decoded),
            loggedInUser: {
              email: decoded.email,
              id: decoded.id,
            },
          });
          this.props.history.replace("/dashboard");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  signupSubmitHandler = (email, password) => {
    this.setState({ signupLoading: true });
    const data = {
      email: email,
      password: password,
    };
    axios
      .post("/api/users/signup", data)
      .then(({data}) => {
        this.setState({ signupLoading: false });
        if (!data.success) {
          const {message} = data;
          if(message.email){
            this.setState({signupError: message.email})
            setTimeout(() => {
              this.setState({signupError: null})
            }, 5000);
          }else{
            this.setState({signupError: message.password})
            setTimeout(() => {
              this.setState({signupError: null})
            }, 5000);
          }
        } else {
          this.props.history.replace("/login");
        }
      })
      .catch((err) => console.log(err));
  };

  logoutClickedHandler = () => {
    const { history } = this.props;
    this.setState({ isAuthenticated: false, loggedInUser: null });
    this.setAuthToken(false);
    localStorage.removeItem("jwtToken");
    history.replace("/login");
  };
  render() {
    let routes = "";
    if (this.state.loading) {
      routes = null;
    } else if (this.state.isAuthenticated) {
      routes = (
        <Switch>
          <Route
            path="/dashboard"
            exact
            render={() => <DashBoard user={this.state.loggedInUser} />}
          />
          <Route
            path="/expenses"
            exact
            render={() => <Expenses user={this.state.loggedInUser} />}
          />
          <Route
            path="/report"
            exact
            render={() => <Report user={this.state.loggedInUser} />}
          />
          <Route path="/404" exact component={NotFound} />
          <Redirect from="/" exact to="/dashboard" />
          <Redirect to="/404" />
        </Switch>
      );
    } else {
      routes = (
        <Switch>
          <Route
            path="/login"
            exact
            render={() => (
              <Login
                label="Login"
                clickHandler={this.loginSubmitHandler}
                loading={this.state.loginLoading}
                error={this.state.loginError}
              />
            )}
          />
          <Route
            path="/signup"
            exact
            render={() => (
              <Login
                label="Signup"
                clickHandler={this.signupSubmitHandler}
                loading={this.state.signupLoading}
                error={this.state.signupError}
              />
            )}
          />
          <Route path="/404" exact component={NotFound} />
          <Redirect from="/" exact to="/login" />
          <Redirect to="/404" />
        </Switch>
      );
    }

    return (
      <Aux>
        <Navbar bg="dark" variant="dark" expand="md">
          <Container className="p-2">
            <Navbar.Brand>
              <h2 className="m-0">Expense Tracker</h2>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <NavigationItems
              logoutClicked={this.logoutClickedHandler}
              isAuthenticated={this.state.isAuthenticated}
            />
          </Container>
        </Navbar>
        <Container className="mt-4 mx-auto">{routes}</Container>
      </Aux>
    );
  }
}

export default withRouter(Layout);
