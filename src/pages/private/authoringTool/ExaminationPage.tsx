import React, { useState, useEffect, useContext } from "react";
import DetailComponent from "./DetailComponent";
import { httpService } from "../../httpService";
import { Button, CardActionArea, Stack, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import parser from "html-react-parser";
import { optionsTags } from "./optionsTag";
import { AlertContext } from "../../context/AlertContext";
import { setQuestionNumber } from "../../redux/questionNumber";
import { setQuestions } from "../../redux/questionsSlice";
import { answerQuestion } from "../../redux/answeredQuestions";

export default function ExaminationPage() {
  const dispatch = useDispatch();

  const questionNumber = useSelector((state) => state.questionNumberSlice);
  const answeredQuestions = useSelector((state) => state.answerSlice);
  const questions = useSelector((state) => state.questionsSlice);
  //const { questionNumber, answeredQuestions } = useSelector((state) => state);

  const { setAlertData } = useContext(AlertContext);

  const getData = async () => {
    const { data, error } = await httpService("authoring/result");
    if (data) {
      dispatch(setQuestions(data));
    }
    if (error) {
      setAlertData({ severity: "error", message: error, open: true });
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const changeQuestion = (number) => {
    // dispatch({ type: "CHANGEQUESTION", payload: number });
  };

  const isChecked = (questionId, answer) => {
    const isMarked = answeredQuestions.find(
      (c) => c.questionId === questionId && c.answer === answer
    );
    if (isMarked) return true;
    return false;
  };

  const hasAnswered = (questionId, index) => {
    const result = answeredQuestions.find((c) => c.questionId === questionId);

    if (result || index === questionNumber) return true;
    return false;
  };
  return (
    <div>
      {questions.length > 0 && (
        <div className="row m-0 examPage">
          <div className="col-lg-10  p-5 d-flex flex-column">
            <div>
              <div className="mb-2">
                <Typography variant="h5" fontWeight={700} color="GrayText">
                  Question {questionNumber + 1}
                </Typography>
              </div>
              <div>
                {/* question */}
                <div className="mb-3" style={{ fontSize: 18 }}>
                  {parser(questions[questionNumber].question)}
                </div>
                <div className="col-lg-6">
                  {questions[questionNumber].options.map((c, i) => (
                    <CardActionArea
                      sx={{
                        backgroundColor: isChecked(
                          questions[questionNumber].questionId,
                          c
                        )
                          ? "#69bf7060"
                          : "#fff",
                      }}
                      onClick={() => {
                        dispatch(
                          answerQuestion({
                            questionId: questions[questionNumber].questionId,
                            answer: c,
                            score:
                              c === questions[questionNumber].correctAnswer
                                ? 1
                                : 0,
                          })
                        );
                      }}
                      className="border option rounded-3 p-2 mb-2 "
                    >
                      <Stack
                        direction={"row"}
                        className="d-flex align-items-top"
                        spacing={2}
                      >
                        <div className="">
                          <Typography>
                            {optionsTags.find((d) => d.index === i).tag}
                            {")"}
                          </Typography>
                        </div>
                        <div>{parser(c)}</div>
                      </Stack>
                    </CardActionArea>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-auto">
              {questions.map((c, i) => (
                <Button
                  size="small"
                  color={questionNumber === i ? "warning" : "primary"}
                  variant={
                    hasAnswered(c.questionId, i) ? "contained" : "outlined"
                  }
                  className="me-1 mb-1"
                  onClick={() => dispatch(setQuestionNumber(i))}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          </div>
          <div className="col-lg-2 bg-light">
            <DetailComponent />
          </div>
        </div>
      )}
    </div>
  );
}
