import {
  queryByText,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { AsyncExample } from ".";

describe("AsyncExample component", () => {
  it("renders correctly (findByText button)", async () => {
    render(<AsyncExample />);

    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(await screen.findByText("Button")).toBeInTheDocument();
  });

  it("renders correctly V2 (await show button)", async () => {
    render(<AsyncExample />);

    await waitFor(() => {
      return expect(screen.getByText("Button")).toBeInTheDocument();
    });
  });

  it("renders correctly V3 (check if button is not displayed)", async () => {
    render(<AsyncExample />);

    await waitFor(() => {
      return expect(screen.queryByText("Button")).not.toBeInTheDocument();
    });
  });

  // it("renders correctly V3 (check if button is no more displayed)", async () => {
  //   render(<AsyncExample />);

  //   await waitForElementToBeRemoved(screen.queryByText("Button"));
  // });
});
