import axios from "axios";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";

export interface QuestionSetForm {
  title: string;
  questions: {
    questionText: string;
    // UI-only: index of the correct choice for this question
    correctIndex?: number;
    choices: { text: string; label: string; correctAnswer: boolean }[];
  }[];
}

function CreateQuestionSetForm() {
  const defaultValues: QuestionSetForm = {
    title: "",
    questions: [
      {
        questionText: "",
        choices: [],
      },
    ],
  };

  const methods = useForm({ defaultValues });
  const { watch, register, handleSubmit } = methods;
  console.log("form values => ", watch());

  const onSubmitHandler = (data: QuestionSetForm) => {
    const accessToken = localStorage.getItem("accessToken");
    // Transform to enforce exactly one correctAnswer per question based on correctIndex
    const payload: QuestionSetForm = {
      title: data.title,
      questions: data.questions.map((q) => {
        const selected =
          q.correctIndex !== undefined && q.correctIndex !== null && q.correctIndex !== ("" as any)
            ? Number(q.correctIndex as unknown as string)
            : -1;
        return {
          questionText: q.questionText,
          choices: (q.choices || []).map((c, idx) => ({
            ...c,
            correctAnswer: idx === selected,
          })),
        };
      }),
    };
    axios
      .post("http://localhost:4000/api/admin/questionset/create", payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        alert("Question Set Created Successfully");
      })
      .catch((err) => {});
  };
  return (
    <div className="stack" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div className="card">
        <h1 style={{ margin: "0 0 1rem 0", fontSize: "1.75rem", fontWeight: "700" }}>Create Question Set</h1>
        <p className="muted" style={{ margin: 0 }}>Design engaging quizzes with clear, focused questions.</p>
      </div>
      
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitHandler)} className="stack">
          <div className="card">
            <label style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.5rem" }}>Quiz Title</label>
            <input {...register("title")} placeholder="Enter a descriptive title for your quiz" required />
          </div>
          
          <CreateQuestions />
          
          <div className="card" style={{ textAlign: "center" }}>
            <button type="submit" className="btn btn-primary btn-lg">
              Create Question Set
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

function CreateQuestions() {
  const { register, control } = useFormContext<QuestionSetForm>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const AddQuestionHandler = () => {
    append({
      choices: [],
      questionText: "",
    });
  };

  return (
    <div className="stack">
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>Questions</h2>
          <button type="button" onClick={AddQuestionHandler} className="btn btn-outline btn-sm">
            + Add Question
          </button>
        </div>
        
        {fields?.map((field, index) => {
          const RemoveQuestionHandler = () => {
            remove(index);
          };
          return (
            <div key={index} className="card" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "600" }}>Question {index + 1}</h3>
                <button type="button" onClick={RemoveQuestionHandler} className="btn btn-danger btn-sm">
                  Remove
                </button>
              </div>
              
              <div style={{ marginBottom: "1rem" }}>
                <label>Question Text</label>
                <input
                  {...register(`questions.${index}.questionText`)}
                  placeholder="Enter your question"
                  required
                />
              </div>

              <CreateChoices questionIndex={index} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CreateChoices({ questionIndex }: { questionIndex: number }) {
  const { register, control } = useFormContext<QuestionSetForm>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.choices`,
  });

  const AddChoicesHandler = () => {
    append({
      label: fields?.length.toString(),
      text: "",
      correctAnswer: false,
    });
  };
  
  return (
    <div className="stack">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <label style={{ fontWeight: "600" }}>Answer Choices</label>
        <button type="button" onClick={AddChoicesHandler} className="btn btn-outline btn-sm">
          + Add Choice
        </button>
      </div>
      
      {fields?.map((field, index) => {
        const RemoveChoiceHandler = () => {
          remove(index);
        };
        return (
          <div key={index} style={{ display: "grid", gap: "0.75rem", alignItems: "center", gridTemplateColumns: "auto 1fr auto" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: "120px" }}>
              <input
                type="radio"
                value={index}
                {...register(`questions.${questionIndex}.correctIndex`)}
                required
              />
              <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>Correct</span>
            </label>
            <input
              {...register(`questions.${questionIndex}.choices.${index}.text`)}
              placeholder={`Choice ${index + 1}`}
              required
            />
            <button type="button" onClick={RemoveChoiceHandler} className="btn btn-danger btn-sm">
              Remove
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default CreateQuestionSetForm;