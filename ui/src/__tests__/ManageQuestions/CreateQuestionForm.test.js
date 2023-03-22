import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddQuestion from "./components/pages/Questions/QuestionsForm";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import axios from "axios";

jest.mock("axios", () => ({
  post: jest.fn(),
}));

describe("Testing AddQuestion component", () => {
  test("displays validation error when reward name is not entered", async () => {
    render(
      <MemoryRouter>
        <AddQuestion />
      </MemoryRouter>
    );

    // find the question input field and set it to empty
    const questionInput = screen.getByLabelText("how can we be of help?");
    fireEvent.change(questionInput, { target: { value: "" } });

    // find the submit button and click it
    const AddQuestionButton = screen.getByText("SEND");
    fireEvent.click(AddQuestionButton);

    // wait for validation to complete and display error message
    await waitFor(() => {
      const errorMessage = screen.getByText("You must enter a question");
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test("creates a new question when form is submitted with valid data", async () => {
    const mockPost = jest.fn();
    mockPost.mockResolvedValueOnce({ data: { success: true } });
    axios.post.mockImplementation(mockPost);

    render(
      <MemoryRouter>
        <AddQuestion />
      </MemoryRouter>
    );

    // find the quest input field and set it to a valid value
    const questionInput = screen.getByLabelText("how can we be of help?");
    fireEvent.change(questionInput, { target: { value: "New Question" } });

    // find the submit button and click it
    const AddQuestionButton = screen.getByText("SEND");
    fireEvent.click(AddQuestionButton);

    // Wait for axios.post and navigation to complete
    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith(
        "http://localhost:8000/management/questions/create",
        { question: "New Question" }
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Ask a question")).toBeInTheDocument();
    });
  });
});
