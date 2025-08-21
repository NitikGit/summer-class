const AnswerModel = require("../model/AnswerModel");
const QuestionSet = require("../model/QuestionSetModel");

async function listQuestionSetController(req, res) {
  const questionSet = await QuestionSet.aggregate([
    {
      $project: {
        title: 1,
        questionCount: { $size: { $ifNull: ["$questions", []] } },
      },
    },
  ]);

  res.json({
    questionSet: questionSet,
  });
}

async function getQuestionSetController(req, res) {
  const { id } = req.params;
  const questionSet = await QuestionSet.findById(id).select(
    "-questions.choices.correctAnswer"
  );

  if (!questionSet) {
    return res.status(404).json({ message: "Question set not found" });
  }

  res.json(questionSet);
}

async function saveAttemptedQuestionController(req, res) {
  const { questionSet: questionSetId, responses } = req.body;
  const { id: userId } = req.user;

  const questionSet = await QuestionSet.findById(questionSetId).select(
    "questions._id questions.choices._id questions.choices.correctAnswer"
  );

  if (!questionSet)
    return res.status(404).json({ message: "QuestionSet not found" });

  // Normalize responses to always use selectedChoiceIds: string[]
  const normalizedResponses = (responses || []).map((r) => ({
    questionId: r.questionId,
    selectedChoiceIds:
      r.selectedChoicesIds ||
      r.selectedChoiceIds ||
      (r.selectedChoiceId ? [r.selectedChoiceId] : []),
  }));

  // Build response map for quick lookup and grade across all questions
  const responseMap = new Map(
    normalizedResponses.map((r) => [String(r.questionId), r.selectedChoiceIds || []])
  );

  const questions = Array.isArray(questionSet?.questions)
    ? questionSet.questions
    : Array.isArray(questionSet)
    ? questionSet
    : [];

  const result = questions.reduce(
    (acc, q) => {
      const correctIds = (q.choices || []).reduce((ids, c) => {
        if (c?.correctAnswer) ids.push(String(c._id));
        return ids;
      }, []);

      const selected = responseMap.get(String(q._id)) || [];

      // Single-answer grading by default
      const isCorrect =
        correctIds.length === 1
          ? selected.length === 1 && String(selected[0]) === String(correctIds[0])
          : selected.length === correctIds.length &&
            selected.every((sid) => correctIds.includes(String(sid))) &&
            correctIds.every((cid) => selected.map(String).includes(cid));

      acc.total += 1;
      if (isCorrect) acc.score += 1;
      acc.details.push({
        questionId: String(q._id),
        selectedChoiceIds: selected.map(String),
        correctChoiceIds: correctIds,
        isCorrect,
      });
      return acc;
    },
    { score: 0, total: 0, details: [] }
  );

  const saveAnswerQuestion = await new AnswerModel({
    questionSet: questionSetId,
    user: userId,
    responses: normalizedResponses,
    score: result.score,
    total: result.total,
  });

  await saveAnswerQuestion.save();
  return res.status(201).json({
    message: "Graded",
    data: {
      score: result.score,
      total: result.total,
      details: result.details,
      // id: saved?._id,
    },
  });
}

module.exports = {
  listQuestionSetController,
  getQuestionSetController,
  saveAttemptedQuestionController,
};