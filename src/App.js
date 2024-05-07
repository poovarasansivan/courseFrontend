import React, { lazy } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import AccessibleNavigationAnnouncer from "./components/AccessibleNavigationAnnouncer";

const Layout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/Login"));

function App() {
  return (
    <>
      <Router>
        <AccessibleNavigationAnnouncer />
        <Switch>
        <Route path="/app" component={Layout} />
          <Route path="/" component={Login} />
          {/* <Redirect exact from="/" to="/login" /> */}
        </Switch>
      </Router>
    </>
  );
}

export default App;
