import React, { useEffect, useState } from "react";
import QuestionItem from "./QuestionItem";

function QuestionList() {

  const [currentQuestions, setCurrentQuestions] = useState([])
  const [questionToPatchInfo, setQuestionToPatchInfo] = useState({questionID: null, patchedIndex: null})

  console.log("URL")
  console.log(`http://localhost:4000/questions/${questionToPatchInfo.questionID}`)
  console.log(questionToPatchInfo.patchedIndex)

  useEffect(() => fetch("http://localhost:4000/questions")
                  .then(resp => resp.json())
                  .then(data => {
                        setCurrentQuestions(data)
                    }), [])

  useEffect(() => fetch(`http://localhost:4000/questions/${questionToPatchInfo.questionID}`, {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      "correctIndex": questionToPatchInfo.patchedIndex
                    })
  })
                  , [questionToPatchInfo])
  
  function handleDelete(questionToDelete) {

    setCurrentQuestions(currentQuestions.filter((question) => question.id !== questionToDelete.id))

    fetch(`http://localhost:4000/questions/${questionToDelete.id}`, { method: "DELETE" })
  }

  function handleChangeAnswer(questionToPatch, event) {
    console.log("patching question:")
    console.log(questionToPatch)
    console.log("curretnQuestions:")
    console.log(currentQuestions)
    console.log("value to update with: ")
    console.log(event.target.value)

    setQuestionToPatchInfo({questionID: questionToPatch.id, patchedIndex: event.target.value})
    setCurrentQuestions(currentQuestions.map(question => {

      if(question.id === questionToPatch.id) {
        console.log(questionToPatch)
        console.log("=")
        console.log(question)
        console.log("correctIndex: " + question.correctIndex)

        return question = {
          id: question.id,
          prompt: question.prompt,
          answers: question.answers,
          correctIndex: event.target.id
        }

      } else { return question }

    }))
  }

  const questionElements = currentQuestions.map((question) => <QuestionItem key={question.id} question={question} onDelete={handleDelete} onChangeAnswer={handleChangeAnswer} />)

  return (
    <section>
      <h1>Quiz Questions</h1>
      <ul>{questionElements}</ul>
    </section>
  );
}

export default QuestionList;
