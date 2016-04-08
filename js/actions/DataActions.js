import http                   from 'qwest';
import * as ActionTypes       from '../constants/ActionTypes';
import * as ApiUrls           from '../constants/ApiUrls';

export function checkout(data){
  let _currency, model;
  switch(data.currency){
    case 1:
      _currency = 'USD';
      break;
    case 2:
      _currency = 'EUR';
      break;
  }
  model = {
    'authentication.userId' : '8a8294174b7ecb28014b9699220015cc',
    'authentication.password' : 'sy6KJsT8',
    'authentication.entityId' : '8a8294174b7ecb28014b9699220015ca',
    amount : data.amount,
    currency : _currency,
    paymentType : 'PA',
    'card.number': data.cardNumber,
    'card.holder': data.cardHolder,
    'card.expiryMonth': data.cardExpiryMonth,
    'card.expiryYear': data.cardExpiryYear,
    'card.cvv': data.CVV,
    createRegistration: true
  };
  return dispatch => {
    dispatch({type: ActionTypes.REQUEST_ATTEMPT});
    http.post('https://test.oppwa.com/v1/payments', model, {cache: true})
    .then((xhr, response) => {
      if(response.result && response.result.code == "000.100.110"){
        localStorage.setItem('amount', data.amount);
        localStorage.setItem('currency', _currency);
        localStorage.setItem('buildNumber', response.buildNumber);
        localStorage.setItem('id', response.id);
        localStorage.setItem('ndc', response.ndc);
        localStorage.setItem('timestamp', response.timestamp);
        dispatch({type: ActionTypes.CHECKOUT_SUCCEED, response});
      }else{
        let error = response.result.description;
        dispatch({type: ActionTypes.REQUEST_FAILED, error});
      }
    })
    .catch((xhr, response, err) => { 
      let error = 'Falló la conexión con el servidor';
      dispatch({type: ActionTypes.REQUEST_FAILED, error});
      throw new Error('Request failed' + err); 
    });
    return null;
  }
}

export function hideForm(){
  return {type: ActionTypes.HIDE_FORM};
}

export function showError(field, error){
  return {type: ActionTypes.ERROR_FIELD, field, error};
}

export function update(field, value){
  return {type: ActionTypes.UPDATE_FIELD, field, value};
}