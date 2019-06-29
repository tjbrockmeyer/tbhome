
import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import {Link} from "react-router-dom";
import Paper from "@material-ui/core/Paper";


export default
@withStyles(theme => ({

}))
class Home extends React.Component {


  render() {
    return <div>
      <h1>Home</h1>
      <lt>
        <li>
          <Link to='/calendar'>Calendar</Link>
        </li>
        <li>
          <Link to='/groceries'>Groceries</Link>
        </li>
        <li>
          <Link to='/chores'>Chores</Link>
        </li>
      </lt>

    </div>
  }
}
