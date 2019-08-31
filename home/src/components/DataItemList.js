
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
import fileDownload from 'js-file-download';
import PropTypes from 'prop-types';
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import DLIcon from '@material-ui/icons/CloudDownload'
import {deleteItem, addItem} from '../apiClient';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";


class DataItemList extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.mounted = true;
    this.deleteConfirmTimeout = null;
    this.dialog = {};
    this.state = {
      error: null,
      description: null,
      items: null,
      dialogIsOpen: false,
      deleteConfirm: null,
      newItemName: '',
      newItemDescription: '',
    }
  }

  componentDidMount() {
    getList(this.props.title, true).then(
      response => {
        if(this.mounted) {
          if(!response.body.length) {
            //list doesn't exist
            return
          }
          const {items, description} = response.body[0];
          this.setState({
            description,
            items,
          })
        }
      },
      error => {
        this.setState({error: `Could not access the server: ${error}`})
      })
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  closeDialog = () => {
    this.setState({dialogIsOpen: false})
  };

  createRow = () => {
    const {title} = this.props;
    const {newItemName, newItemDescription, items} = this.state;
    if(!newItemName) {
      return;
    }
    const item = {
      name: newItemName,
      description: newItemDescription,
    };
    const index = items.length;
    addItem(title, item.name, item.description)
      .catch(error => {
        console.error(`could not create item (${item.name}): ${error}`);
        if(items[index].name === newItemName && items[index].description === newItemDescription) {
          items.pop();
          this.forceUpdate();
        }
      });
    items.push(item);
    this.setState({
      newItemName: '',
      newItemDescription: '',
    })
  };

  deleteRow = (index) => {
    const item = this.state.items[index];
    return () => {
      const {deleteConfirm} = this.state;
      if(this.deleteConfirmTimeout) {
        clearTimeout(this.deleteConfirmTimeout);
        this.deleteConfirmTimeout = undefined;
      }
      if(deleteConfirm !== index) {
        this.deleteConfirmTimeout = setTimeout(() => this.setState({deleteConfirm: null}), 3000);
        this.setState({deleteConfirm: index});
        return;
      }
      deleteItem(this.props.title, item.name, item.description)
        .catch(error => {
          // Print the error and return the item to the list.
          console.error(`could not delete item (${item.name}): ${error}`);
          this.state.items.splice(index, 0, item);
          this.forceUpdate();
        });
      // Remove the item from the list.
      this.state.items.splice(index, 1);
      this.setState({deleteConfirm: null})
    }
  };

  deleteAll = () => {

  };

  renderRow = (row, index) => {
    const {deleteConfirm} = this.state;
    const {classes, theme} = this.props;

    return <TableRow key={index} className={classes.row} style={{backgroundColor: index === deleteConfirm ? 'pink' : theme.palette.background.default}}>
      <TableCell className={classes.cell} align='left'>
        <Button
          className={classes.deleteRowButton} size='small' onClick={this.deleteRow(index)}>
          <DeleteIcon className={classes.deleteRowIcon}/>
        </Button>
      </TableCell>
      <TableCell className={classes.cell} component="th" scope="row">{row.name}</TableCell>
      <TableCell className={classes.cell} align="right">{row.description}</TableCell>
    </TableRow>
  };

  render() {
    const {title, classes} = this.props;
    const {items, dialogIsOpen, error} = this.state;
    return <Paper className={classes.root}>
      <Dialog scroll='body' open={dialogIsOpen} onClose={() => this.closeDialog()}>
        <DialogTitle id="form-dialog-title">New Item</DialogTitle>
        <DialogContent onSubmit={() => this.createRow()}>
          <TextField
            required
            autoFocus
            margin="dense"
            label="Item Name"
            fullWidth
            value={this.state.newItemName}
            onChange={(e) => this.setState({newItemName: e.target.value})}
          />
          <TextField
            margin="dense"
            id="name"
            label="Item Description"
            fullWidth
            value={this.state.newItemDescription}
            onChange={(e) => this.setState({newItemDescription: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.closeDialog()} color="primary">
            Cancel
          </Button>
          <Button disabled={!this.state.newItemName} onClick={() => this.createRow()} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Typography className={classes.title} variant='h3'>{title}</Typography>
        {
          items !== null
            ?
            <div>
              <div className={classes.buttonRow}>
                <Button className={classes.createRowButton} size='small' onClick={
                  () => this.setState({dialogIsOpen: true})}>
                  <AddIcon/>
                  <Typography>New Item</Typography>
                </Button>
                <Button size='small' onClick={
                  () => this.deleteAll()}>
                  <DeleteIcon/>
                </Button>
                <Button size='small' onClick={
                  () => fileDownload(items.map(i => `${i.name} | ${i.description}`).join('\n'), `${title}.txt`)}>
                  <DLIcon/>
                </Button>
              </div>

              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Action</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell align="right">Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className={classes.content}>
                  {items.map(this.renderRow)}
                </TableBody>
              </Table>
            </div>
            :
            error === null ?
              <div>
                <Typography>Loading...</Typography>
                <CircularProgress variant='indeterminate' size={20}/>
              </div>
              :
              <div>
                <Typography>{error}</Typography>
              </div>
        }
    </Paper>
  }
}

export default withStyles(theme => ({
  root: {
    padding: 16,
    minWidth: 300,
    maxWidth: 300,
  },
  title: {
    marginBottom: 20,
  },
  createRowButton: {
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
    transition: 'backgroundColor 1s ease, color 1s ease'
  },
  errorBackground: {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.contrastText,
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
      opacity: 1,
      backgroundColor: theme.palette.error.dark,
      color: theme.palette.error.contrastText,
    },
  },
  deleteRowIcon: {
    fontSize: 18,
    paddingRight: 2
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  downloadButton: {
  }
}), {withTheme: true})(DataItemList)
