import NewHeader from './Header';
import NavbarInstance from './Navigationbar';
import React from 'react';
import Paper from 'material-ui/Paper';
import FooterNavigation from './Footer';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

export default class OrderReportApp extends React.Component {

  render() {
    return (
      <div className = 'container'>
        <NewHeader />
        <Paper zDepth={3} >
          {this.props.children}
        </Paper>
      </div>
    );
  }
}
