import * as ActionTypes from '../constants/ActionTypes';

let defaultState = {
  isFetching: false,
  amount: null,
  amountError: null,
  currency: 1,
  cardNumber: null,
  cardNumberError: null,
  cardHolder: null,
  cardHolderError: null,
  cardExpiryMonth: null,
  cardExpiryMonthError: null,
  cardExpiryYear: null,
  cardExpiryYearError: null,
  CVV: null,
  CVVError: null,
  alert: null,
  hasAlert: false,
  lastUpdated: localStorage.getItem('timestamp') || null,
  alreadyDonate: false
}

export default function(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.REQUEST_ATTEMPT:
      return {...state, isFetching: true, alert: null, hasAlert: false};
    case ActionTypes.REQUEST_FAILED:
      return {...state, isFetching: false, alert: action.error, hasAlert: true};
    case ActionTypes.UPDATE_FIELD:
      return {...state, [action.field]: action.value, [action.field+'Error']: null, alert: null, hasAlert: false}; 
    case ActionTypes.ERROR_FIELD:
      return {...state, [action.field+'Error']: action.error, alert: 'After donate, please fix error on '+action.field+' field', hasAlert: true};
    case ActionTypes.CHECKOUT_SUCCEED:
      return {...state, isFetching: false, alreadyDonate: true, lastUpdated: localStorage.getItem('timestamp')};
    case ActionTypes.HIDE_FORM:
      return {...state, alreadyDonate: true};
    default:
      return state;
  }
}