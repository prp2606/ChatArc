import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Signin from "./user/signin";
import Signup from "./user/signup";
import PrivateRoutes from "./user/privateRoute";
import Contacts from "./contact/contacts";
import Conversations from "./conversation/conversations";
import CreateContact from "./contact/createContact";
import UpdateMe from "./user/updateProfile";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact render={() => <Redirect to="/signup" />} />
        <Route path="/signup" exact component={Signup} />
        <Route path="/signin" exact component={Signin} />
        <PrivateRoutes path="/contacts" exact component={Contacts} />
        <PrivateRoutes
          path="/conversation/:actualUser"
          exact
          component={Conversations}
        />
        <PrivateRoutes path="/createContact" exact component={CreateContact} />
        <PrivateRoutes path="/updateProfile/" exact component={UpdateMe} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
