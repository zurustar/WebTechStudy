
import './App.css';

import { Switch, Route } from 'react-router-dom';

import Top from './Top';

function App() {
  return (
    <Switch>
      <Route path="/"><Top /></Route>
    </Switch>
  );
}

export default App;
