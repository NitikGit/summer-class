import React, { useState } from "react";
import type { IAttempQuestionForm, IQuestion, IChoice } from "../../pages/QuestionSet/AttemptQuizPage";
import { FormProvider, useFieldArray, useForm, useFormContext } from "react-hook-form";
import axios from "axios";

export interface IAttemptQuizFinalData {
  questionSet: string;
  responses: (
    | { questionId: string; selectedChoiceId: string }
    | { questionId: string; selectedChoicesIds: string[] }
  )[];
}

function AttemptQuizForm({ questionSet }: { questionSet: IAttempQuestionForm }) {
  const [result, setResult] = useState<
    | null
    | {
        score: number;
        total: number;
        details?: { questionId: string; selectedChoiceIds: string[]; correctChoiceIds: string[]; isCorrect: boolean }[];
      }
  >(null);

  const methods = useForm<IAttempQuestionForm>({ defaultValues: questionSet });
  const { watch, handleSubmit } = methods;

  console.log("form values =>", watch());

  const onSubmitHandler = async (data: IAttempQuestionForm) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No access token found");

      const finalData: IAttemptQuizFinalData = {
        questionSet: questionSet._id,
        responses: data.questions.map((q) => ({
          questionId: q._id,
          selectedChoiceId: q.selectedChoiceId || "",
        })),
      } as any;

      console.log("finalData being sent:", finalData);

      const response = await axios.post(
        "http://localhost:4000/api/questions/answer/attempt",
        finalData,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setResult(response.data.data);
      alert("Answers submitted successfully!");
    } catch (error: any) {
      console.error("Submit error:", error);
      alert(error?.response?.data?.message || error.message || "Something went wrong");
    }
  };

  if (result) {
    return (
      <div className="stack" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.5rem", fontWeight: "700" }}>Quiz Results</h2>
          <div style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>
            Your Score: <span style={{ color: "var(--color-soft)" }}>{result.score}</span> out of <span style={{ color: "var(--color-soft)" }}>{result.total}</span>
          </div>
          <p className="muted" style={{ margin: 0 }}>
            {result.score === result.total ? "Perfect score! 🎉" : "Keep practicing to improve!"}
          </p>
        </div>
        
        {result.details && (
          <div className="stack">
            <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.25rem", fontWeight: "600" }}>Question Review</h3>
            {questionSet.questions.map((q, index) => {
              const d = result.details!.find((x) => x.questionId === q._id);
              if (!d) return null;
              return (
                <div key={q._id} className="card">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                    <span className={`pill ${d.isCorrect ? "btn-primary" : "btn-danger"}`}>
                      {d.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                    </span>
                    <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: "600" }}>Question {index + 1}</h4>
                  </div>
                  <p style={{ margin: "0 0 1rem 0", fontWeight: "500" }}>{q.questionText}</p>
                  <div style={{ display: "grid", gap: "0.5rem" }}>
                    {q.choices.map((ch) => {
                      const isSelected = d.selectedChoiceIds.includes(ch._id);
                      const isCorrect = d.correctChoiceIds.includes(ch._id);
                      return (
                        <div key={ch._id} style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: "0.75rem",
                          padding: "0.5rem",
                          borderRadius: "var(--radius-sm)",
                          background: isCorrect ? "rgba(233, 225, 143, 0.1)" : "transparent",
                          border: isSelected ? "1px solid var(--color-primary)" : "1px solid transparent"
                        }}>
                          <span className={`pill ${isCorrect ? "btn-primary" : isSelected ? "btn-outline" : "btn-ghost"}`}>
                            {isCorrect ? "Correct" : isSelected ? "Your Choice" : "Option"}
                          </span>
                          <span style={{ 
                            opacity: isSelected || isCorrect ? 1 : 0.7,
                            fontWeight: isSelected || isCorrect ? "500" : "normal"
                          }}>
                            {ch.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="stack" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div className="card">
        <h1 style={{ margin: "0 0 0.5rem 0", fontSize: "1.75rem", fontWeight: "700" }}>{questionSet.title}</h1>
        <p className="muted" style={{ margin: 0 }}>Answer all questions to complete the quiz.</p>
      </div>
      
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitHandler)} className="stack">
          <QuestionList />
          <div className="card" style={{ textAlign: "center" }}>
            <button type="submit" className="btn btn-primary btn-lg">
              Submit Quiz
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

function QuestionList() {
  const { control, register } = useFormContext<IAttempQuestionForm>();
  const { fields } = useFieldArray({ control, name: "questions" });

  return (
    <div className="stack">
      {fields.map((q, index) => (
        <div key={q._id} className="card">
          <div style={{ marginBottom: "1rem" }}>
            <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem", fontWeight: "600" }}>
              Question {index + 1}
            </h3>
            <p style={{ margin: 0, fontSize: "1rem" }}>{q.questionText}</p>
          </div>
          <input type="hidden" {...register(`questions.${index}._id`)} value={q._id} />
          <ChoiceList questionIndex={index} />
        </div>
      ))}
    </div>
  );
}

function ChoiceList({ questionIndex }: { questionIndex: number }) {
  const { control, register } = useFormContext<IAttempQuestionForm>();
  const { fields } = useFieldArray({ control, name: `questions.${questionIndex}.choices` });

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      {fields.map((ch) => (
        <label key={ch._id} style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "0.75rem",
          padding: "0.75rem",
          borderRadius: "var(--radius-sm)",
          border: "1px solid rgba(255,255,255,0.1)",
          cursor: "pointer",
          transition: "all 0.2s ease"
        }}>
          <input
            type="radio"
            value={ch._id}
            {...register(`questions.${questionIndex}.selectedChoiceId`)}
            style={{ margin: 0 }}
          />
          <span style={{ fontSize: "1rem" }}>{ch.text}</span>
        </label>
      ))}
    </div>
  );
}

export default AttemptQuizForm;