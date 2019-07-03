
import React from 'react'
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {getList} from '../apiClient';
import PropTypes from 'prop-types'
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import {deleteItem, addItem} from '../apiClient';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";


class DataItemList extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.mounted = true;
    this.state = {
      description: null,
      items: null,
      dialogIsOpen: false,
      newItemName: '',
      newItemDescription: '',
    }
  }

  componentDidMount() {
    getList(this.props.title).then(response => {
      if(this.mounted) {
        this.setState({
          description: response.description,
          items: response.items,
        })
      }
    })
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  closeDialog = (isConfirm) => {
    if(isConfirm) {
      const item = {
        name: this.state.newItemName,
        description: this.state.newItemDescription,
      };
      addItem(this.props.title, item.name, item.description)
      .catch(error => {
        console.error(`could not create item (${item.name}): ${error}`);
        this.state.items.pop()
      });
      this.state.items.push(item);
      this.setState({items: this.state.items});
    }
    this.setState({
      dialogIsOpen: false,
      newItemName: '',
      newItemDescription: '',
    })
  };

  deleteRow = (index) => {
    const item = this.state.items[index];
    return () => {
      deleteItem(this.props.title, item.name, item.description)
        .catch(error => {
          // Print the error and return the item to the list.
          console.error(`could not delete item (${item.name}): ${error}`);
          this.state.items.splice(index, 0, item);
        });
      // Remove the item from the list.
      this.state.items.splice(index, 1);
      this.setState({items: this.state.items})
    }
  };

  render() {
    const {title, classes} = this.props;
    const {items, dialogIsOpen} = this.state;
    console.log(this.props);
    return <Paper className={classes.root}>
      <Dialog open={dialogIsOpen} onClose={() => this.closeDialog()} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">New Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Create a new item in the list with the following name and description.
          </DialogContentText>
          <TextField
            required
            autoFocus
            margin="dense"
            label="Item Name"
            fullWidth
            onBlur={(e) => this.setState({newItemName: e.target.value})}
          />
          <TextField
            margin="dense"
            id="name"
            label="Item Description"
            type="email"
            fullWidth
            onBlur={(e) => this.setState({newItemDescription: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.closeDialog()} color="primary">
            Cancel
          </Button>
          <Button disabled={!this.state.newItemName} onClick={() => this.closeDialog(true)} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant='h3'>{title}</Typography>
      <div className={''}>
        <Button className={classes.createRowButton} size='small' onClick={() => this.setState({dialogIsOpen: true})}>
          <AddIcon/>
          <Typography>New Item</Typography>
        </Button>
        {
          items !== null && <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Action</TableCell>
                <TableCell>Item</TableCell>
                <TableCell align="right">Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={classes.content}>
              {items.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className={classes.cell} align='left'>
                    <Button className={classes.deleteRowButton} size='small' onClick={this.deleteRow(index)}>
                      <DeleteIcon className={classes.deleteRowIcon}/>
                    </Button>
                  </TableCell>
                  <TableCell className={classes.cell} component="th" scope="row">{row.name}</TableCell>
                  <TableCell className={classes.cell} align="right">{row.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        }
        {
          items === null && <div>
            <Typography>Loading...</Typography>
            <CircularProgress variant='indeterminate' size={20}/>
          </div>
        }
      </div>
    </Paper>
  }
}

export default withStyles(theme => ({
  root: {
    padding: 16,
    minWidth: 300,
    maxWidth: 300,
  },
  createRowButton: {
    marginTop: 20,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  content: {
    maxHeight: 100,
    overflow: 'auto',
  },
  table: {
    width: '100%',
    marginTop: 8,
    padding: 8,
    borderTop: 'groove'
  },
  row: {
    marginTop: 20,
    border: 'solid',
    borderSize: 1,
    borderColor: 'black',
  },
  cell: {
    padding: 1,
  },
  deleteRowButton: {
    fontSize: 13,
    borderRadius: 10,
    padding: 2,
    margin: 3,
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&hover': {
      backgroundColor: theme.palette.error.dark,
      color: theme.palette.error.contrastText,
    }
  },
  deleteRowIcon: {
    fontSize: 18,
    paddingRight: 2
  }
}))(DataItemList)
