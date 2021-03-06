import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import NarrowContainer from ".";

it("renders successfully", () => {
  shallow(<NarrowContainer />);
});

it("matches snapshot", () => {
  const wrapper = shallow(
    <NarrowContainer width="75%" fullWidthAt="small">
      <div>hello</div>
      <div>goodbye</div>
    </NarrowContainer>
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});
