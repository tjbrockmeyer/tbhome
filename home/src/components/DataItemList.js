
import React from 'react'
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "../pages/Home";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import {getList} from '../util/apiClient';


export default
@withStyles(theme => ({
  root: {

  }
}))
class DataItemList extends React.Component {
  constructor(props) {
    super(props);
    this.isMounted = true;
    this.state = {
      items: null,
    }
  }

  componentDidMount() {
    getList(this.props.title).then(response => {
      if(this.isMounted) {
        this.setState({items: response});
      }
    })

  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  render() {
    const {title, classes} = this.props;
    const {items} = this.state;
    return <Paper className={classes.root}>
      <Typography variant='h2'>{title}</Typography>
      <lt>
        {
          items === null ? <Typography><CircularProgress size={20}/>Loading...</Typography>
            : items.map((i, index) => <li key={index}>
              <Typography variant='h5'>{i.title}</Typography>
              <Typography variant='p'>{i.description}</Typography>
            </li>)
        }
      </lt>
    </Paper>
  }
}