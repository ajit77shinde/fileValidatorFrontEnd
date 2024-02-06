import './App.css'
// import Homepage from "./components/homepage/homepage"
import Dashboard from "./components/Dashboard/Dashboard"
import Login from "./components/login/login"
import Register from "./components/register/register"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useState } from 'react';

function App() {
  const [ user, setLoginUser] = useState({})
  return (
    <div className="App">
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
