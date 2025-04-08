import Question from "@models/Question.js";

export default class QuestionsAPI {
  static async get() {
    return await fetch("http://191.252.102.230:3000/api/questions", {
      method: "GET",
    })
        .then(res => res.json())
        .then(json => json.result.map(question => new Question(
            question.id,
            question.text,
            question.alternative1,
            question.alternative2,
            question.alternative3,
            question.answer,
        )))
        .catch(err => console.error(err));
  }
  
  static save(question) {
    fetch("http://191.252.102.230:3000/api/questions/store", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(question),
    })
        .catch(err => console.error(err));
  }
  
  static async delete() {
    return fetch("http://191.252.102.230:3000/api/questions/delete", {
      method: "DELETE",
    })
        .catch(err => console.error(err));
  }
}