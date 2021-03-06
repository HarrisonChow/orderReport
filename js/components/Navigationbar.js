import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ActionHome from 'material-ui/svg-icons/action/home';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ActionSearch from 'material-ui/svg-icons/action/search';

const searchIcon = <ActionSearch />;

export default class NavbarInstance extends React.Component {
  changeState = () => {
    window.location = '#/';
    if (this.props.click) {
      this.props.click.displayDatePicker = false;
      this.props.click.value = 7
    }
  }
  render() {

    return (
      <div>
        <AppBar
          title=""
          iconElementLeft={<IconButton onClick= {this.changeState.bind(this)}><ActionHome /></IconButton>}
          iconElementRight={
            <div className="box">
              <div className="searchBar">
                <input type="search" id="search" placeholder="Search..." />
                <button className="icon">{searchIcon}</button>
              </div>
            </div>


            /*
              <IconMenu
                iconButtonElement={
                  <IconButton><MoreVertIcon /></IconButton>
                }
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              >
                <MenuItem primaryText="All Orders" href="#/allOrders"/>
                <MenuItem primaryText="All Parcels" href="#/parcels"/>
                <MenuItem primaryText="Logistics Stastic" href="#/logistics"/>
              </IconMenu>
              */

          }
        />
      </div>
    );
  }
}
