import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders city data from the dataset", () => {
  render(<App />);
  expect(screen.getByText("Lincoln")).toBeInTheDocument();
  expect(screen.getByText("Nebraska")).toBeInTheDocument();
  expect(screen.getAllByText("Average Rent")).toHaveLength(2);
  expect(screen.getByText("1,150 USD/month")).toBeInTheDocument();
  expect(screen.getAllByText("Average Home Price")).toHaveLength(2);
});
