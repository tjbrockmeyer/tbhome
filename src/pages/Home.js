
import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import {Link} from "react-router-dom";


export default
@withStyles(theme => ({

}))
class Home extends React.Component {


  render() {
    return <div>
      <h1>Home</h1>
      <Link to='/calendar'>Calendar</Link>
      <Link to='/groceries'>Groceries</Link>
      <Link to='/chores'>Chores</Link>
    </div>
  }
}
