import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { darken } from "polished";
import { fadeColors } from "utils/styles";
import media from "utils/media";
import { NarrowContainer } from "story_components";

const StyledFruitContainer = styled.div`
  border: 4px solid ${props => darken(0.2, props.color)};
  background-color: ${props =>
    props.darken ? darken(0.2, props.color) : props.color};
  margin: 2%;
  flex: 1;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 4rem;
  text-shadow: 2px 2px 6px black;
  min-height: 5rem;

  ${media.small`
    font-size: 3rem;
  `};

  ${props =>
    props.clickable &&
    css`
      animation: ${fadeColors(props.color, darken(0.2, props.color))} 1s
        infinite alternate;

      &:hover {
        cursor: pointer;
      }
    `};
`;

class FruitContainer extends PureComponent {
  handleClick = () => {
    const { clickable, updateCounts } = this.props;
    if (clickable) updateCounts();
  };

  render() {
    const { color, count, clickable } = this.props;
    return (
      <StyledFruitContainer
        color={color}
        clickable={clickable}
        darken={count === 0}
        onClick={this.handleClick}
      >
        {count || ""}
      </StyledFruitContainer>
    );
  }
}

FruitContainer.propTypes = {
  color: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  clickable: PropTypes.bool.isRequired,
  updateCounts: PropTypes.func.isRequired
};

FruitContainer.defaultProps = {
  clickable: false
};

export default FruitContainer;