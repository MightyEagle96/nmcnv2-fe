import React from "react";
import { Avatar, Button, Typography } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function DetailComponent() {
  const questions = useSelector((state) => state.questionsSlice);
  const answeredQuestions = useSelector((state) => state.answerSlice);
  const navigate = useNavigate();

  const totalIncorrect = () => {
    let total = 0;
    answeredQuestions.forEach((element) => {
      if (element.score === 0) {
        total += 1;
      }
    });

    return total;
  };

  const totalCorrect = () => {
    let total = 0;
    answeredQuestions.forEach((element) => {
      if (element.score === 1) {
        total += 1;
      }
    });

    return total;
  };
  return (
    <div className="p-3">
      <div className="mt-3 mb-3 ">
        <Avatar sx={{ height: 100, width: 100 }} />
      </div>
      <div className="mb-3">
        <Typography variant="caption" gutterBottom>
          Candidate Name
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          John Doe
        </Typography>
      </div>
      <div className="mb-3">
        <Typography variant="caption" gutterBottom>
          Reg Number
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          ABC0123456789
        </Typography>
      </div>
      <div className="mb-3">
        <Typography variant="caption" gutterBottom>
          Total Answered
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          {answeredQuestions.length} of {questions.length}
        </Typography>
      </div>
      <div className="mb-3">
        <Typography variant="caption" gutterBottom>
          Total Correct
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          {totalCorrect()}
        </Typography>
      </div>
      <div className="mb-3">
        <Typography variant="caption" gutterBottom>
          Total Incorrect
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          {totalIncorrect()}
        </Typography>
      </div>
      <div className="mb-3">
        <Button
          color="error"
          variant="contained"
          fullWidth
          endIcon={<Logout />}
          onClick={() => navigate("/authoring/result")}
        >
          Exit simulator
        </Button>
      </div>
    </div>
  );
}
