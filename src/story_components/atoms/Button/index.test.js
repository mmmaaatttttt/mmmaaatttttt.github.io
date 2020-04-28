import React from "react";
import { render } from "@testing-library/react";
import Button from "./";

it("renders without crashing", () => {
  render(<Button />);
});

it("matches snapshot with props", () => {
  const { asFragment } = render(
    <Button color="blue" large disabled>
      I'm a button
    </Button>
  );
  expect(asFragment()).toMatchSnapshot();
});
