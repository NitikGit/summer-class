import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AttemptQuizForm from "../../components/QuestionSet/AttemptQuizForm";

export interface IAttempQuestionForm {
  _id: string;
  title: string;
  questions: IQuestion[];
  createdBy: string;
  __v: number;
}

export interface IQuestion {
  questionText: string;
  choices: IChoice[];
  _id: string;
  selectedChoiceId?: string;
}

export interface IChoice {
  label: string;
  text: string;
  _id: string;
  selected?: boolean; // must exist
}

function AttemptQuizPage() {
  const { id } = useParams();
  const [questionSet, setQuestionSet] = useState<IAttempQuestionForm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken || !id) {
      setIsLoading(false);
      return;
    }

    const fetchQuestionSet = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/questions/set/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        // Ensure every choice has selected: false
        const safeData: IAttempQuestionForm = {
          ...response.data,
          questions: response.data.questions.map((q: IQuestion) => ({
            ...q,
            selectedChoiceId: "",
            choices: q.choices.map((c: IChoice) => ({
              ...c,
              selected: false,
            })),
          })),
        };

        setQuestionSet(safeData);
      } catch (error) {
        console.error("Failed to fetch question set:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestionSet();
  }, [id]);

  if (isLoading) return (
    <div className="container">
      <div className="card" style={{ textAlign: "center" }}>
        <p className="muted">Loading quiz...</p>
      </div>
    </div>
  );
  if (!questionSet) return (
    <div className="container">
      <div className="card" style={{ textAlign: "center" }}>
        <p>Question set not found.</p>
      </div>
    </div>
  );

  return (
    <div className="container">
      <AttemptQuizForm questionSet={questionSet} />
    </div>
  );
}

export default AttemptQuizPage;
