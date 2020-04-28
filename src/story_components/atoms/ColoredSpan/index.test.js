import React from "react";
import { render } from "@testing-library/react";
import ColoredSpan from "./";

it("renders without crashing", () => {
  render(<ColoredSpan />);
});

it("matches snapshot with props and children", () => {
  const { asFragment } = render(
    <ColoredSpan bold color="blue">
      i'm blue, da bo dee da bo dah'
    </ColoredSpan>
  );
  expect(asFragment()).toMatchSnapshot();
});
