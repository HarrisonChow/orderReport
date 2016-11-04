import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

export default class SearchForm extends React.Component {
  doSearch(e){
    var keyword = this.refs.searchInput.input.value;
    e.key === 'Enter' ? window.location = '#/orders/'+keyword : null
  }
  submitForm(e) {
    e.preventDefault();
    var keyword = this.refs.searchInput.input.value;
    window.location = '#/orders/'+keyword;
  }
  render(){
    return (
      <form onSubmit={this.submitForm.bind(this)}>
        <TextField
          ref = "searchInput"
          hintText="SKU313022"
          floatingLabelText="Input Order Number"
          type="orderSearch"
          onKeyPress={this.doSearch.bind(this)}
          className="search"
        />
        <RaisedButton className = "mainBtn" label = "Search" secondary = {true} type="submit"/>
      </form>
    )
  }
}
