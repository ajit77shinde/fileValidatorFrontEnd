import React, { useState } from 'react';
import './App.css'; 
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard"
import Login from "./components/login/login"
import Register from "./components/register/register"

function App() {
  const [user, setLoginUser] = useState({});

  const fontLink = <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet"></link>;

  return (
    <div className="App">
      {fontLink}
      {
        !user._id &&
        <header className="app-header">
          <div className="headerTitle">
            Data Validator
          </div>
        </header>
      }
      <Router>
        <Switch>
          <Route exact path="/">
            {user && user._id ? (
              <Dashboard setLoginUser={setLoginUser} />
            ) : (
              <Login setLoginUser={setLoginUser} />
            )}
          </Route>
          <Route path="/login">
            <Login setLoginUser={setLoginUser} />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;


