import { it } from "vitest";
import { render } from "@testing-library/react";
import App from "./app";

it("renders without error", () => {
  render(<App />);
});
