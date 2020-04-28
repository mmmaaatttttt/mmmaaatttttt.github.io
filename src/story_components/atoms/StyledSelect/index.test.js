import React from "react";
import { render } from "@testing-library/react";
import StyledSelect from "./";

it("renders without crashing", () => {
  render(<StyledSelect />);
});

it("matches snapshot", () => {
  const { asFragment } = render(<StyledSelect />);
  expect(asFragment()).toMatchSnapshot();
});
