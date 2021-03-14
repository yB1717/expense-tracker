import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";

import Aux from "../../../hoc/Auxiliary/Auxiliary";

const navigationItems = (props) => {
  let navItems = "";
  if (props.isAuthenticated) {
    navItems = (
      <Aux>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="">
            <NavLink
              to={{
                pathname: "/dashboard",
              }}
              className="nav-link"
            >
              Dashboard
            </NavLink>
            <NavLink
              to={{
                pathname: "/expenses",
              }}
              className="nav-link"
            >
              Expenses
            </NavLink>
            <NavLink
              to={{
                pathname: "/report",
              }}
              className="nav-link"
            >
              Report
            </NavLink>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Button onClick={props.logoutClicked} variant="info">
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Aux>
    );
  } else {
    navItems = (
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav>
          <NavLink
            to={{
              pathname: "/login",
            }}
            className="nav-link"
          >
            Login
          </NavLink>
          <NavLink
            to={{
              pathname: "/signup",
            }}
            className="nav-link"
          >
            Signup
          </NavLink>
        </Nav>
      </Navbar.Collapse>
    );
  }
  return navItems;
};

export default navigationItems;
