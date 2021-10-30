import { Switch, Route } from "react-router-dom";

import Login from "./Login";
import Logoff from "./Logoff";
import Content from "./Content";
import Top from "./Top";

function App() {
  return (
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/logoff">
        <Logoff />
      </Route>
      <Route path="/content">
        <Content />
      </Route>
      <Route path="/">
        <Top />
      </Route>
    </Switch>
  );
}

export default App;
