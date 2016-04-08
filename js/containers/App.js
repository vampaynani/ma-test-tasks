import React                from 'react';
import {Provider}           from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import configureStore       from '../store/configureStore';
import Main                 from '../components/Main';
import styles               from '../../css/app.css';
import {renderDevTools}     from '../utils/devTools';

const store = configureStore();

export default React.createClass({
  componentWillMount(){
    injectTapEventPlugin();
  },
  render() {
    return (
      <div>

        {/* <Site /> is your app entry point */}
        <Provider store={store}>
          <Main />
        </Provider>

        {/* only renders when running in DEV mode */
          renderDevTools(store)
        }
      </div>
    );
  }
});
