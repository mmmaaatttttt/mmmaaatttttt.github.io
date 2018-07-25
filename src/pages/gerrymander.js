import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { nest } from "d3-collection";
import {
  Button,
  ColumnLayout,
  HeatChart,
  Icon,
  InteractiveGrid,
  NarrowContainer,
  USMap
} from "story_components";
import voteData from "data/gerrymander";
import COLORS from "utils/styles";

const StyledDistrictData = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  & > div {
    display: flex;
    align-items: center;
  }

  h4 {
    margin: 0 0.5rem 0 0;
  }
`;

class GerrymanderSample extends Component {
  state = {
    segments: Array.from({ length: this.props.rowCount * 2 - 1 }, (_, i) =>
      Array(this.props.colCount - 1 + (i % 2)).fill(false)
    ),
    districts: [[]],
    saveable: false
  };

  componentDidMount() {
    const segments = JSON.parse(localStorage.getItem("segments"));
    if (segments) {
      this.setState({ segments }, this.__countRegions);
    } else {
      this.__countRegions();
    }
  }

  addGeometryProperties = (us, allData) => {
    let data = allData[114];
    const stateData = nest()
      .key(d => d.state)
      .entries(data);
    stateData.forEach(stateObj => {
      stateObj.values.forEach(distObj => {
        const districtGeometry = us.objects.districts114.geometries.find(
          geom => {
            const { STATENAME, DISTRICT } = geom.properties;
            return STATENAME === stateObj.key && +DISTRICT === distObj.district;
          }
        );
        if (districtGeometry) districtGeometry.properties.values = distObj;
      });
    });
  };

  handleSave = () => {
    const { segments } = this.state;
    localStorage.setItem("segments", JSON.stringify(segments));
    this.setState({ saveable: false });
  };

  handleReset = () => {
    localStorage.removeItem("segments");
    this.setState(
      {
        segments: Array.from({ length: this.props.rowCount * 2 - 1 }, (_, i) =>
          Array(this.props.colCount - 1 + (i % 2)).fill(false)
        ),
        districts: [[]],
        saveable: false
      },
      this.__countRegions
    );
  };

  handleSegmentUpdate = (row, col, segStatus, e) => {
    if (segStatus !== null) {
      this.setState(prevState => {
        const segments = [...prevState.segments];
        segments[row] = [...prevState.segments[row]];
        segments[row][col] = segStatus;
        return { segments, saveable: true };
      }, this.__countRegions);
    }
  };

  __countRegions = () => {
    const { rowCount, colCount } = this.props;
    const { districts } = this.state;
    const visitedYet = Array.from({ length: rowCount }, () =>
      Array.from({ length: colCount }).fill(false)
    );
    const newDistricts = [];
    visitedYet.forEach((row, rowIdx) => {
      row.forEach((isVisited, colIdx) => {
        if (!isVisited) {
          newDistricts.push(
            this.__calculateArea(visitedYet, [[rowIdx, colIdx]])
          );
        }
      });
    });
    if (
      districts.length !== newDistricts.length ||
      districts.some(
        (district, i) => district.length !== newDistricts[i].length
      )
    ) {
      this.setState({ districts: newDistricts });
    }
  };

  __calculateArea = (visitedYet, whereToLook) => {
    const { segments } = this.state;
    let district = [];
    while (whereToLook.length > 0) {
      let [row, col] = whereToLook.shift();
      if (visitedYet[row][col] === false) {
        visitedYet[row][col] = true;
        district.push([row, col]);
        let shouldMoveUp =
          visitedYet[row - 1] !== undefined &&
          visitedYet[row - 1][col] === false &&
          segments[2 * row - 1][col] === false;
        let shouldMoveRight =
          visitedYet[row][col + 1] !== undefined &&
          visitedYet[row][col + 1] === false &&
          segments[2 * row][col] === false;
        let shouldMoveDown =
          visitedYet[row + 1] !== undefined &&
          visitedYet[row + 1][col] === false &&
          segments[2 * row + 1][col] === false;
        let shouldMoveLeft =
          visitedYet[row][col - 1] !== undefined &&
          visitedYet[row][col - 1] === false &&
          segments[2 * row][col - 1] === false;
        if (shouldMoveUp) whereToLook.push([row - 1, col]);
        if (shouldMoveRight) whereToLook.push([row, col + 1]);
        if (shouldMoveDown) whereToLook.push([row + 1, col]);
        if (shouldMoveLeft) whereToLook.push([row, col - 1]);
      }
    }
    return district;
  };

  render() {
    const { rowCount, colCount, colors } = this.props;
    const { districts, segments, saveable } = this.state;
    const heatData = Array.from({ length: colCount }, () =>
      Array.from({ length: rowCount }, (_, i) => i % 2)
    );
    return (
      <NarrowContainer width="80%">
        <h1>Gerrymandering Interactives</h1>
        <h4>1. Create your own Gerrymander!</h4>
        <p>
          Imagine a region with 54 citizens, evenly divided among two parties
          (the orange party and the purple party). You are part of a committee
          tasked with dividing this region into six districts of the same size:
          9 citizens each.
        </p>
        <p>
          Each district will have a representative in the government that is
          elected by members from that district.
        </p>
        <p>
          Can you create the districts so that one party will receive a majority
          of the representation, even though the districts are evenly split in
          terms of population?
        </p>
        <ColumnLayout break="small" sizes={[3, 2]}>
          <HeatChart
            data={heatData}
            axes={false}
            tooltip={false}
            colorRange={colors}
          >
            <InteractiveGrid
              strokeWidth={6}
              rowCount={rowCount}
              colCount={colCount}
              handleSegmentUpdate={this.handleSegmentUpdate}
              segments={segments}
            />
          </HeatChart>
          <StyledDistrictData>
            {districts.length > 6 ? (
              <h2>Too many districts!</h2>
            ) : (
              Array.from({ length: 6 }).map((_, idx) => {
                let size = (districts[idx] && districts[idx].length) || "--";
                let icon = (
                  <Icon name="times-circle" color={COLORS.RED} size={2} />
                );
                if (districts[idx] && districts[idx].length === colCount) {
                  icon = (
                    <Icon name="check-circle" color={COLORS.GREEN} size={2} />
                  );
                }
                let msgByColor = null;
                let color = COLORS.BLACK;
                if (districts[idx]) {
                  let orangeCount = districts[idx].filter(d => d[0] % 2 === 0)
                    .length;
                  let purpleCount = districts[idx].length - orangeCount;
                  msgByColor = `(${orangeCount} orange, ${purpleCount} purple)`;
                  if (orangeCount > purpleCount) color = COLORS.ORANGE;
                  if (purpleCount > orangeCount) color = COLORS.PURPLE;
                }
                return (
                  <div key={idx}>
                    <h4 style={{ color }}>
                      D{idx + 1}: {size} {msgByColor}
                    </h4>
                    {icon}
                  </div>
                );
              })
            )}
            <div>
              <Button
                onClick={this.handleSave}
                disabled={!saveable}
                color={COLORS.GREEN}
              >
                {saveable ? "Save" : "Saved"}
              </Button>
              <Button onClick={this.handleReset} color={COLORS.RED}>
                Reset
              </Button>
            </div>
          </StyledDistrictData>
        </ColumnLayout>
        <p>Here's some other stuff</p>
        <USMap
          topoUrl="/data/districts114.json"
          topoKey="districts114"
          data={voteData}
          addGeometryProperties={this.addGeometryProperties}
          keyAccessor={feature => feature.properties.ID}
        />
      </NarrowContainer>
    );
  }
}

GerrymanderSample.propTypes = {
  rowCount: PropTypes.number.isRequired,
  colCount: PropTypes.number.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired
};

GerrymanderSample.defaultProps = {
  rowCount: 6,
  colCount: 9,
  colors: [COLORS.ORANGE, COLORS.PURPLE]
};

export default GerrymanderSample;
