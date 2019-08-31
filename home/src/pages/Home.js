
import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import {Link} from "react-router-dom";
import DataItemList from "../components/DataItemList";


class Home extends React.Component {


  render() {
    return <div>
      <h1>Home</h1>
      <div>
        {/*<Link to='/calendar'>Calendar</Link>*/}
        {/*<Link to='/groceries'>Groceries</Link>*/}
        {/*<Link to='/chores'>Chores</Link>*/}
      </div>

      <div>
        <DataItemList title='Grossery'/>
      </div>
    </div>
  }
}

export default withStyles(theme => ({

}))(Home)