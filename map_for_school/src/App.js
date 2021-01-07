import React, { useEffect, useState } from 'react';
import './App.css';
import PulseLoader from "react-spinners/PulseLoader";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { loggedUser } from './actions/UserActions'

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import NavMenu from './components/layout/NavMenu'
import Main from './components/pages/Main'
import Login from './components/pages/auth/Login'
import Register from './components/pages/auth/Register'
import Point from './components/layout/MapForPoint'
import ListPoints from './components/pages/SeeAllPoints'


function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch()

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }
      const tokenRes = await axios.post("/users/tokenIsValid", null, {
        headers: { "x-auth-token": token },
      })
      if (tokenRes.data) {
        const userRespond = await axios.get("/users/getme", {
          headers: { "x-auth-token": token },
        });
        dispatch(
          loggedUser({
            token,
            user: userRespond.data,
          })
        )
      }

      setTimeout(() => {
        setIsLoaded(true);
      }, 1000)
    }
    checkLoggedIn()
  }, [])

  useEffect(() => {
    console.log(window.location.href)
  }, [window.location.href])

  if (!isLoaded) {
    return (
      <div className="container">
        <div className="preloader-inner">
          <div className="preloader">
            <PulseLoader size={60} color={"#fff"} loading={!isLoaded} />
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <Router>
        <div className="App">
          <NavMenu />
          <div className="auth-wrapper">
            <Switch>
              <Route exact path="/">
                <Main />
              </Route>
              <Route path="/sign-in">
                <Login />
              </Route>
              <Route path="/sign-up">
                <Register />
              </Route>
              <Route path="/makepoint">
                <Point />
              </Route>
              <Route path="/seepoints">
                <ListPoints />
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}

export default App;
