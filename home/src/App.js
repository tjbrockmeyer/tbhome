import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import Groceries from './pages/Groceries';
import Chores from './pages/Chores';
import Error404 from './pages/Error404';
import ErrorBoundary from "./pages/ErrorBoundary";
import withStyles from "@material-ui/core/styles/withStyles";


function App(props) {
  const {classes} = props;
  return <Router basename='home'>
    <div className={classes.root}>
      <ErrorBoundary>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/calendar' component={Calendar}/>
          <Route path='/groceries' component={Groceries}/>
          <Route path='/chores' component={Chores}/>
          <Route component={Error404}/>
        </Switch>
      </ErrorBoundary>
    </div>
  </Router>
}

export default withStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center'
  }
}))(App)