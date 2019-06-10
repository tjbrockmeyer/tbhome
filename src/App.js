import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import Groceries from './pages/Groceries';
import Chores from './pages/Chores';
import Error404 from './pages/Error404';
import ErrorBoundary from "./pages/ErrorBoundary";

function App() {
  return <ErrorBoundary>
    <Router>
      <Route exact path='/' component={Home}/>
      <Route path='/calendar' component={Calendar}/>
      <Route path='/groceries' component={Groceries}/>
      <Route path='/chores' component={Chores}/>
      <Route component={Error404}/>
    </Router>
  </ErrorBoundary>
}

export default App;
