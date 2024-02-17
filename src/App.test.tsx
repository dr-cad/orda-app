import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders elements", () => {
  render(<App />);
  const elem1 = screen.getByText(/next/i);
  const elem2 = screen.getByText(/reset/i);
  expect(elem1).toBeInTheDocument();
  expect(elem2).toBeInTheDocument();
});
