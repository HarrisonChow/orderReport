import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import {IndexLink, Link} from 'react-router';


export default class Bar extends React.Component {

  componentDidMount() {
    let links

    if (this.props.dateRange) {
      links = '#/allOrders/'+this.props.dateRange+'/'+this.props.status
    } else {
      links = ''
    }

    var bars = d3.selectAll("."+this.props.type +"");
    var barsLink = bars.append("a")
    .attr("xlink:href", function(d) {return links })

    var bar = barsLink.append("rect")
              .attr("class", "bar")
              .attr("x", this.props.x)
              .attr("y", this.props.y)
              .attr("height", this.props.width)
              .attr("width", 0)
              .attr("fill", this.props.col);

    bar.transition()
    .duration(1500)
    .attr("width", this.props.height);

    if (this.props.amount !=0) {
      bars.append("text")
      .attr("x", this.props.x+this.props.height-20)
      .attr("y", this.props.y+35)
      .attr("fontSize", 12)
      .attr("fill", "white")
      .text(this.props.amount);
    }



    // var legend = bars.append("g")
    //             .attr("x", 550  - 65)
    //             .attr("y", 25)
    //             .attr("height", 100)
    //             .attr("width",100);
    // legend.each(function(d,i){
    //             append("rect")
    //             .attr("x", 550  - 65*i)
    //             .attr("y", 0)
    //             .attr("width", 10)
    //             .attr("height",10)
    //             .attr("fill", this.props.col)
    //           });

  }
  componentWillReceiveProps() {
    d3.selectAll('.bar').remove();
  }

  componentDidUpdate() {
    let links
    if (this.props.dateRange) {
      links = '#/allOrders/'+this.props.dateRange+'/'+this.props.status
    } else {
      links = ''
    }

    var bars = d3.selectAll("g");
    var barsLink = bars.append("a")
    .attr("xlink:href", function(d) {return links })

    var bar = barsLink.append("rect")
              .attr("class", "bar")
              .attr("x", this.props.x)
              .attr("y", this.props.y)
              .attr("height", this.props.width)
              .attr("width", 0)
              .attr("fill", this.props.col);

    bar.transition()
    .duration(1500)
    .attr("width", this.props.height);


    if (this.props.amount !=0) {
      bars.append("text")
      .attr("x", this.props.x+this.props.height-20)
      .attr("y", this.props.y+35)
      .attr("fontSize", 12)
      .attr("fill", "white")
      .text(this.props.amount);
    }

  }

  render() {
    return(
      <div></div>
    )
  }
}
