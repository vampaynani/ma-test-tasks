import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as DataActions from '../actions/DataActions';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';
import TextField from 'material-ui/lib/text-field';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Dialog from 'material-ui/lib/dialog';
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import Snackbar from 'material-ui/lib/snackbar';

class Main extends Component {
  componentDidMount(){
    const {data, dispatch} = this.props;
    const actions = bindActionCreators(DataActions, dispatch);
    if(data.lastUpdated){
      let last = new Date(data.lastUpdated),
          now = new Date();
      if(last.getTime() + 1000 * 60 * 60 > now.getTime()) actions.hideForm();
    }
  }
  update(field, e){
    const {dispatch} = this.props;
    const actions = bindActionCreators(DataActions, dispatch);
    const value = e.currentTarget.value;
    actions.update(field, value);
    this._validate(field, value);
  }
  updateSelect(field, e, index, value){
    const {dispatch} = this.props;
    const actions = bindActionCreators(DataActions, dispatch);
    actions.update(field, value);
    this._validate(field, value);
  }
  handleClose(){}
  sendDonate(){
    const {data, dispatch} = this.props;
    const actions = bindActionCreators(DataActions, dispatch);
    if(!data.hasAlert){
      actions.checkout(data); 
    }
  }
  _validate(field, value){
    const {dispatch} = this.props;
    const actions = bindActionCreators(DataActions, dispatch);
    switch(field){
      case 'amount':
        if(!value || value == '') actions.showError('amount', 'The amount is required');
        if(value > 100) actions.showError('amount', 'The maximum amount is $100');
        break;
      case 'cardNumber':
        if(!value || value == '') actions.showError('amount', 'The card number is required');
        if(value.length !== 16) actions.showError('cardNumber', 'The card number must have 16 digits');
        break;
      case 'cardHolder':
        if(!value || value == '') actions.showError('cardHolder', 'The card holder is required');
        break;
      case 'cardExpiryMonth':
        if(!value.match(/^(0[1-9])|(1[012])$/)) actions.showError('cardExpiryMonth', 'The value must be between 01 and 12');
        break;
      case 'cardExpiryYear':
        const now = new Date();
        if(!value.match(/^[-+]?(?:\d*[.])?\d+$/)) actions.showError('cardExpiryYear', 'The value must be numeric');
        if(value < now.getFullYear()) actions.showError('cardExpiryYear', 'The value must be greater than the current year');
        break;
      case 'CVV':
        if(!value || value == '') actions.showError('CVV', 'The CVV is required');
        if(!value.match(/^[-+]?(?:\d*[.])?\d+$/)) actions.showError('CVV', 'The value must be numeric');
        break;
    }
  }
  render() {
    const actions = [
      <FlatButton label="Ok" primary={true} onTouchTap={this.handleClose} />
    ]
    const {data, dispatch} = this.props;
    return (
      <div>
      <Card>
        <CardHeader title="Donate" subtitle="Basic Payment" avatar="http://lorempixel.com/100/100/business/" />
        <CardTitle title="Contribute with a good cause" subtitle="Donate up to USD$100 by hour" />
        <CardText>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
          Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
          Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
          <form>
            <TextField floatingLabelText="Amount" value={data.amount} onChange={this.update.bind(this, 'amount')} errorText={data.amountError} /><br />
            <SelectField value={data.currency} onChange={this.updateSelect.bind(this, 'currency')}>
              <MenuItem value={1} primaryText="USD"/>
              <MenuItem value={2} primaryText="EUR"/>
            </SelectField><br />
            <TextField floatingLabelText="Card Number" value={data.cardNumber} onChange={this.update.bind(this, 'cardNumber')} errorText={data.cardNumberError} /><br />
            <TextField floatingLabelText="Card Holder" value={data.cardHolder} onChange={this.update.bind(this, 'cardHolder')} errorText={data.cardHolderError} /><br />
            <TextField floatingLabelText="Expiry Month" value={data.cardExpiryMonth} onChange={this.update.bind(this, 'cardExpiryMonth')} errorText={data.cardExpiryMonthError} /><br />
            <TextField floatingLabelText="Expiry Year" value={data.cardExpiryYear} onChange={this.update.bind(this, 'cardExpiryYear')} errorText={data.cardExpiryYearError} /><br />
            <TextField floatingLabelText="CVV" value={data.CVV} type="password" onChange={this.update.bind(this, 'CVV')} errorText={data.CVVError} /><br />
          </form>
        </CardText>
        <CardActions>
          <RaisedButton primary={true} label="Donate Now" onTouchTap={this.sendDonate.bind(this)} />
        </CardActions>
        <Snackbar open={data.hasAlert} message={data.alert} autoHideDuration={4000} onRequestClose={this.handleClose} />
      </Card>
      <Dialog title="Donation" actions={null} modal={true} open={data.isFetching} onRequestClose={this.handleClose}>
        Wait a moment, we are processing your donation.
      </Dialog>
      <Dialog title="Donation" actions={null} modal={true} open={data.alreadyDonate} onRequestClose={this.handleClose}>
        Thank you for your donation, you can come back later if you want to ;)
      </Dialog>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps){
  return { data: state.Data }
}

export default connect(mapStateToProps)(Main)