import React, {Component} from 'react';
import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconLibraryBooks from 'material-ui/svg-icons/av/library-books';
import IconLocalShipping from 'material-ui/svg-icons/maps/local-shipping';
import IconPages from 'material-ui/svg-icons/social/pages';
import ActionHome from 'material-ui/svg-icons/action/home';
import Relay from 'react-relay';
import {IndexLink, Link} from 'react-router';

const homeIcon = <ActionHome />;
const ordersIcon = <IconLibraryBooks />;
const logisticsIcon = <IconLocalShipping />;
const parcelsIcon = <IconPages />;

export default class FooterNavigation extends Component {
  state = {
    selectedIndex: 0,
  };

  select = (index) => {
    this.setState({selectedIndex: index});
    let urls = (index === 1) ? '#/allOrders' : (index === 2) ? '#/parcels' : (index === 3) ? '#/logistics' : '#/';
    window.location = urls;
    if (this.props.click) {
      this.props.click.displayDatePicker = false;
      this.props.click.value = 7
    }
  }

  render() {
    return (
      <Paper zDepth={3}>
        <BottomNavigation selectedIndex={this.state.selectedIndex}>
            <BottomNavigationItem
              label="Home"
              icon={homeIcon}
              onTouchTap={() => this.select(0)}
            />
            <BottomNavigationItem
              label="Orders"
              icon={ordersIcon}
              onTouchTap={() => this.select(1)}
            />
            <BottomNavigationItem
              label="Parcels"
              icon={parcelsIcon}
              onTouchTap={() => this.select(2)}
            />
            <BottomNavigationItem
              label="Logistics"
              icon={logisticsIcon}
              onTouchTap={() => this.select(3)}
            />
        </BottomNavigation>
      </Paper>

    );
  }
}
