import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface IListQuestionSet {
  _id: string;
  title: string;
  questionCount: number;
}

function ListQuestionSet() {
  const [questionSets, setQuestionSet] = useState<IListQuestionSet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const Navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    async function fetchData() {
      axios
        .get("http://localhost:4000/api/questions/set/list", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setQuestionSet(response?.data?.questionSet);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
        });
    }

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "40vh" }}>
        <p className="muted">Loading question sets...</p>
      </div>
    );
  }
  
  if (questionSets.length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", maxWidth: "500px", margin: "0 auto" }}>
        <h2 style={{ margin: "0 0 1rem 0" }}>No Question Sets Available</h2>
        <p className="muted">Check back later for new quizzes to attempt.</p>
      </div>
    );
  }

  return (
    <div className="stack" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div className="card">
        <h1 style={{ margin: "0 0 0.5rem 0", fontSize: "1.75rem", fontWeight: "700" }}>Available Quizzes</h1>
        <p className="muted" style={{ margin: 0 }}>Choose a quiz to test your knowledge.</p>
      </div>

      <div className="stack">
        {questionSets.map((question) => {
          const TakeQuizHandler = () => {
            Navigate(`/questionset/${question._id}/attempt`);
          };
          return (
            <div key={question._id} className="card" style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              padding: "1.5rem"
            }}>
              <div>
                <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem", fontWeight: "600" }}>
                  {question.title}
                </h3>
                <p className="muted" style={{ margin: 0 }}>
                  {question.questionCount} question{question.questionCount !== 1 ? 's' : ''}
                </p>
              </div>
              <button onClick={TakeQuizHandler} className="btn btn-primary">
                Take Quiz
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ListQuestionSet;