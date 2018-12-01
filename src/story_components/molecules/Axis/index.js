import React, { Component } from "react";
import PropTypes from "prop-types";
import { axisBottom, axisLeft } from "d3-axis";
import { select, selectAll } from "d3-selection";
import { range } from "d3-array";
import { format } from "d3-format";
import styled, { css } from "styled-components";

const StyledAxis = styled.g`
  .tick text {
    font-size: 16px;
  }

  & .tick line {
    stroke: ${props => props.tickColor};
    stroke-dasharray: 10, 5;
  }
`;

class Axis extends Component {
  constructor(props) {
    super(props);
    this.drawAxis = this.drawAxis.bind(this);
  }

  componentDidMount() {
    this.drawAxis();
  }

  componentDidUpdate() {
    this.drawAxis();
  }

  drawAxis() {
    const {
      direction,
      scale,
      xShift,
      yShift,
      tickSize,
      tickShift,
      tickStep,
      tickFormat,
      rotateLabels
    } = this.props;
    const settings = {
      x: {
        axis: axisBottom
      },
      y: {
        axis: axisLeft
      }
    };
    const axis = settings[direction]
      .axis(scale)
      .tickFormat(tickFormat ? format(tickFormat) : "");
    if (tickSize) {
      axis.tickSize(tickSize).tickSizeOuter(0);
    }
    if (tickStep) {
      let domain = scale.domain();
      axis.tickValues(
        range(domain[0], domain[1] + tickStep, tickStep)
      );
    }
    select(this.axis)
      .attr("transform", `translate(${xShift},${yShift})`)
      .call(axis)
      .selectAll(".tick line")
      .attr("transform", `translate(0,${tickShift})`);

    if (tickFormat) {
      const labels = select(this.axis).selectAll(".tick text");
      if (direction === "x" && rotateLabels)
        labels
          .attr("transform", "rotate(90)")
          .style("text-anchor", "start")
          .attr("x", "9")
          .attr("y", 0)
          .attr("dx", 0)
          .attr("dy", "0.35em");
      else if ((direction === "x") & !rotateLabels)
        labels.style("text-anchor", "middle");
      else labels.style("text-anchor", "end");
    }
  }

  render() {
    const { tickColor } = this.props;
    return (
      <StyledAxis innerRef={axis => (this.axis = axis)} tickColor={tickColor} />
    );
  }
}

Axis.propTypes = {
  direction: PropTypes.string.isRequired,
  scale: PropTypes.func.isRequired,
  yShift: PropTypes.number.isRequired,
  xShift: PropTypes.number.isRequired,
  tickColor: PropTypes.string.isRequired,
  tickSize: PropTypes.number,
  tickShift: PropTypes.number.isRequired,
  tickStep: PropTypes.number,
  tickFormat: PropTypes.string.isRequired,
  rotateLabels: PropTypes.bool.isRequired
};

Axis.defaultProps = {
  xShift: 0,
  yShift: 0,
  tickColor: "#ccc",
  tickShift: 0,
  tickFormat: "",
  rotateLabels: true
};

export default Axis;
