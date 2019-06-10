
import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";


export default
@withStyles(theme => ({

}))
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null
    }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({error, errorInfo});
  }

  render() {
    const {error, errorInfo} = this.state;
    if(error !== null) {
      return <React.Fragment>
        <h1>500</h1>
        <p>{error}</p>
        <p>{errorInfo}</p>
      </React.Fragment>
    } else {
      return this.props.children;
    }
  }
}
