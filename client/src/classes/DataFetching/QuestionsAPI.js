import Question from "@models/Question.js";

export default class QuestionsAPI {
  static async get() {
    return await fetch("http://localhost:3000/api/questions", {
      method: "GET",
    })
        .then(res => res.json())
        .then(json => json.result.map(question => new Question(
            question.id,
            question.text,
            question.alternative1,
            question.alternative2,
            question.alternative3,
            question.alternative4,
            question.answer,
        )))
        .catch(err => console.log(err));
  }
  
  static save(question) {
    fetch("http://localhost:3000/api/questions/store", {
      method: "POST",
      body: JSON.stringify(question),
    })
        .catch(err => console.log(err));
  }
  
  static async delete() {
    return fetch("http://localhost:3000/api/questions/delete", {
      method: "DELETE",
    })
        .catch(err => console.log(err));
  }
}