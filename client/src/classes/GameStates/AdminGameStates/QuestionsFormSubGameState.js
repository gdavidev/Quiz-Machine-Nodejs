import Question from "@models/Question";
import FormBuilder from "@classes/FormBuilder";
import QuestionsAPI from "@classes/DataFetching/QuestionsAPI";

export default class QuestionDisplaySubGameState {
    constructor() {
        this.adminQuestionsContainer = document.getElementById('admin-questions-container');
        this.adminQuestionsInputContainer = document.getElementById('admin-questions-input-container');
        this.adminAddQuestionBtn = document.getElementById('admin-add-question-btn');
        this.adminSaveQuestionsBtn = document.getElementById('admin-save-questions-btn');

        this.adminAddQuestionBtn.style.display = 'none';
        this.adminSaveQuestionsBtn.style.display = 'none';
        this.adminAddQuestionBtn.onclick = () => this.#addNewQuestion();
        this.adminSaveQuestionsBtn.onclick = () => this.#saveQuestions();
        
        this.currentQuestionAmount = 0;
    }

    enter(from, data) {
        this.adminQuestionsContainer.style.display = 'block';
        this.adminAddQuestionBtn.style.display = 'block';
        this.adminSaveQuestionsBtn.style.display = 'block';
        this.#loadQuestions();
    }

    exit(to) {
        this.adminQuestionsContainer.style.display = 'none';
        this.adminAddQuestionBtn.style.display = 'none';
        this.adminSaveQuestionsBtn.style.display = 'none';
    }

    #loadQuestions() {
        this.#clearQuestions();

        QuestionsAPI.get()
            .then((res) => {
                res.forEach(question => {
                    this.currentQuestionAmount++;
                    this.adminQuestionsInputContainer.appendChild(this.#createQuestionFormNugget(question));
                })
            })
    }

    #addNewQuestion() {
        this.adminQuestionsInputContainer.appendChild(this.#createQuestionFormNugget());
        this.currentQuestionAmount++;
    }

    #saveQuestions() {
        const questions = this.#retrieveAllQuestions();

        QuestionsAPI.delete()
            .then(() => {
                questions.forEach(question => {
                    QuestionsAPI.save(question)
                })
            });
    }

    #clearQuestions() {
        while (this.adminQuestionsInputContainer.firstChild) {
            this.adminQuestionsInputContainer.removeChild(this.adminQuestionsInputContainer.firstChild)
        }
    }

    #retrieveAllQuestions() {
        const formNuggets =
            this.adminQuestionsContainer.getElementsByClassName('form-nugget');
        const questions = [];

        Array.from(formNuggets).forEach((nugget) => {
            const selectedAlternative = nugget.querySelector('input[type=radio]:checked')
            console.log(selectedAlternative)
            
            questions[questions.length] = new Question(
                0,
                nugget.querySelector('[name=Texto]').value,
                nugget.querySelector('[name=Alternativa-1]').value,
                nugget.querySelector('[name=Alternativa-2]').value,
                nugget.querySelector('[name=Alternativa-3]').value,
                nugget.querySelector(`[name=${selectedAlternative.value}]`).value
            );
        });

        return questions;
    }

    #createQuestionFormNugget(question) {
        const qst = question ?? new Question();
        
        const container =
            FormBuilder.div('form-nugget', [
                FormBuilder.formItem('Texto', qst.text ?? ''),
                FormBuilder.div('form-row', [
                    FormBuilder.radio(
                        'alts-' + this.currentQuestionAmount + 1,
                        'Alternativa-1',
                        qst.id ? qst.alternative1 === qst.answer : true),
                    FormBuilder.formItem('Alternativa 1', qst.alternative1 ?? ''),
                ]),
                FormBuilder.div('form-row', [
                    FormBuilder.radio(
                        'alts-' + this.currentQuestionAmount + 1,
                        'Alternativa-2',
                        qst.id ? qst.alternative2 === qst.answer : false),
                    FormBuilder.formItem('Alternativa 2', qst.alternative2 ?? ''),
                ]),
                FormBuilder.div('form-row', [
                    FormBuilder.radio(
                        'alts-' + this.currentQuestionAmount + 1,
                        'Alternativa-3',
                        qst.id ? qst.alternative3 === qst.answer : false),
                    FormBuilder.formItem('Alternativa 3', qst.alternative3 ?? ''),
                ]),
                FormBuilder.button(
                    'Apagar',
                    'btn',
                    () => {
                        this.adminQuestionsInputContainer.removeChild(container);
                        this.currentQuestionAmount--;
                    })
            ]);

        return container;
    }
}