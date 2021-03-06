import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Animate from "react-move/Animate";
import { easeQuadOut } from "d3-ease";
import styled from "styled-components";
import { Button, PieChart } from "story_components";
import COLORS from "utils/styles";

const StyledMessageWrapper = styled.p`
  text-align: center;
  font-style: italic;
  margin: 16px auto;
`;

const SpinnerArrow = ({ turns, width, height }) => {
  const lineEnd = height * 0.15;
  const arrowPos = height * 0.02;
  return (
    <g
      stroke={COLORS.DARK_GRAY}
      strokeWidth="6"
      fill={COLORS.DARK_GRAY}
      transform={`rotate(${turns * 360} ${width / 2} ${height / 2})`}
    >
      <circle cx={width / 2} cy={height / 2} r={5} />
      <line x1={width / 2} x2={width / 2} y1={height / 2} y2={lineEnd} />
      <polygon
        points={`
        ${width / 2},${lineEnd - 15} 
        ${width / 2 + arrowPos},${lineEnd} 
        ${width / 2 - arrowPos},${lineEnd}
      `}
      />
    </g>
  );
};

class Spinner extends PureComponent {
  state = {
    turns: 0,
    disabled: false
  };

  updateTurns = () => {
    this.setState(prevState => {
      const direction = Math.random() < 0.5 ? -1 : 1;
      return {
        turns: prevState.turns + direction * (1 + Math.random() * 4),
        disabled: true
      };
    });
  };

  handleEnd = () => {
    const { turns, disabled } = this.state;
    if (disabled) {
      const { handleSpinEnd, colors } = this.props;
      let trueMod = (turns % 1 + 1) % 1;
      let idx = Math.floor(trueMod * colors.length);
      handleSpinEnd(idx);
      this.setState({ disabled: false });
    }
  };

  render() {
    const { width, height, message } = this.props;
    const { turns, disabled } = this.state;
    return (
      <div>
        <PieChart
          colorScale={i => this.props.colors[i]}
          values={this.props.colors.map(c => 1)}
          showLabels={false}
          stroke={COLORS.BLACK}
          width={width}
          height={height}
          padding={10}
        >
          <Animate
            start={{ turns }}
            update={{
              turns: [turns],
              timing: {
                duration: 1000 + 2000 * Math.random(),
                ease: easeQuadOut
              },
              events: {
                end: this.handleEnd
              }
            }}
          >
            {({ turns }) => (
              <SpinnerArrow width={width} height={height} turns={turns} />
            )}
          </Animate>
        </PieChart>
        {message ? (
          <StyledMessageWrapper>{message}</StyledMessageWrapper>
        ) : (
          <Button
            large
            color={COLORS.DARK_GRAY}
            onClick={this.updateTurns}
            disabled={disabled}
          >
            Spin!
          </Button>
        )}
      </div>
    );
  }
}

Spinner.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  handleSpinEnd: PropTypes.func,
  height: PropTypes.number.isRequired,
  message: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired
};

Spinner.defaultProps = {
  height: 300,
  message: "",
  width: 300
};

export default Spinner;
