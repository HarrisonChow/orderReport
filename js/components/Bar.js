import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import {IndexLink, Link} from 'react-router';

export default class Bar extends React.Component {

  drawBar(){
    let deliverydays = (this.props.status === "Less than 2 days") ? 2 : (this.props.status === "3 to 5 days") ? 3 : 5;
    let links = (this.props.dateRange && this.props.dateRange!== 'customize') ? '#/allOrders/'+this.props.dateRange+'/'+this.props.status : (this.props.dateRange === 'customize') ? '#/OrdersByRange/'+this.props.status+'/'+this.props.fromDate+'/'+this.props.toDate : '#/parcels/'+ deliverydays +'/' +this.props.type;

    var bars = d3.selectAll("."+this.props.type +"");
    var barsLink = bars.append("a")
        .attr("xlink:href", function(d) {return links })

    var div = d3.select("body")
              .append("div")
              .attr("class", "tooltips")
              .style("opacity", 0);

    var bar = barsLink.append("rect")
              .attr("class", "bar")
              .attr("value", "Click to see more details about this " + this.props.amount + " orders")
              .attr("x", this.props.x)
              .attr("y", this.props.y)
              .attr("height", this.props.width)
              .attr("width", 0)
              .attr("fill", this.props.col)
              .attr("fill-opacity", .6)
              .attr("stroke-opacity", .3)
              .attr("stroke", "grey")
              .on("mouseover", function(d) {
                  var message = d3.select(this).attr("value");
                  div.transition()
                      .duration(200)
                      .style("opacity", 1);
                  div	.html(message)
                      .style("left", (d3.event.pageX) + "px")
                      .style("top", (d3.event.pageY) + "px");
                  })
              .on("mouseout", function(d) {
                  div.transition()
                      .duration(500)
                      .style("opacity", 0);
              })
              .on("click", function(d) {
                  div.transition()
                      .duration(500)
                      .style("opacity", 0);
              });

    bar.transition()
      .duration(1200)
      .attr("width", this.props.height);

    if (this.props.amount != 0) {
      bars.append("text")
          .attr("x", this.props.x+this.props.height/2-5)
          .attr("y", this.props.y+25)
          .attr("font-size", 14)
          .attr("fill", "white")
          .style("font-weight", 900)
          .text(this.props.amount);
    }
  }

  componentDidMount() {
    this.drawBar();
  }

  componentWillReceiveProps() {
    d3.selectAll('.bar').remove();
  }

  componentDidUpdate() {
    this.drawBar();
  }

  render() {
    return(
      <div></div>
    )
  }
}
