import React, { Component } from "react";
import { Form, Button, Spinner } from "react-bootstrap";

import Aux from "../../hoc/Auxiliary/Auxiliary";

class Login extends Component {
  state = {
    loginFormData: {
      emailEntered: "",
      passwordEntered: "",
    },
    signupFormData: {
      emailEntered: "",
      passwordEntered: "",
    },
  };

  emailChangedHandler = (e) => {
    if (this.props.label === "Login") {
      this.setState({
        loginFormData: {
          ...this.state.loginFormData,
          emailEntered: e.target.value,
        },
      });
    } else {
      this.setState({
        signupFormData: {
          ...this.state.signupFormData,
          emailEntered: e.target.value,
        },
      });
    }
  };

  passwordChangedHandler = (e) => {
    if (this.props.label === "Login") {
      this.setState({
        loginFormData: {
          ...this.state.loginFormData,
          passwordEntered: e.target.value,
        },
      });
    } else {
      this.setState({
        signupFormData: {
          ...this.state.signupFormData,
          passwordEntered: e.target.value,
        },
      });
    }
  };

  render() {
    let emailEntered = "";
    let passwordEntered = "";
    if (this.props.label === "Login") {
      emailEntered = this.state.loginFormData.emailEntered;
      passwordEntered = this.state.loginFormData.passwordEntered;
    } else {
      emailEntered = this.state.signupFormData.emailEntered;
      passwordEntered = this.state.signupFormData.passwordEntered;
    }
    let spinner = "";
    if (this.props.loading) {
      spinner = <Spinner animation="border" variant="dark" />;
    }
    let error = "";
    if (this.props.error) {
      error = (
        <h4
          className="mt-4 text-center"
          style={{
            color: "red",
          }}
        >
          {this.props.error}
        </h4>
      );
    }
    return (
      <Aux>
        <h1 className="mb-4 text-center">{this.props.label}</h1>
        <Form className="mx-5">
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              size="lg"
              placeholder="Enter email"
              value={emailEntered}
              onChange={this.emailChangedHandler}
            />
            <Form.Text className="text-muted">
              Must be of form: abc@abc.abc
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              size="lg"
              placeholder="Password"
              value={passwordEntered}
              onChange={this.passwordChangedHandler}
            />
            <Form.Text className="text-muted">
              Must be at least 6 characters
            </Form.Text>
          </Form.Group>
          <Button
            size="lg"
            variant="outline-success"
            onClick={() =>
              this.props.clickHandler(emailEntered, passwordEntered)
            }
            className="mr-3"
          >
            {this.props.label}
          </Button>
          {spinner}
          {error}
        </Form>
      </Aux>
    );
  }
}

export default Login;
