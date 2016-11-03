import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

export default class SearchBox extends React.Component {
  doSearch(e){
    var keyword = this.refs.searchInput.input.value;
    e.key === 'Enter' ? window.location = '#/orders/'+keyword : null
  }
  render(){
    return (
        <TextField
          ref = "searchInput"
          hintText="SKU313022"
          floatingLabelText="Input Order Number"
          type="orderSearch"
          onKeyPress={this.doSearch.bind(this)}
          className="search"
        />
    )
  }
}
