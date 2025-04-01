import ContainerVisibilityTransition from "@classes/ContainerVisibilityTransition";
import {shuffle} from "@libs/ArrayUtilities";
import ProgressLine from "@classes/ProgressLine";
import ProgressCircle from "@classes/ProgressCircle";

export default class QuestionsGameState {
  constructor(requestGameState, configuration, state, questionsDb) {
    this.questionAmountElement = document.getElementById('question-amount');
    this.currentQuestionElement = document.getElementById('current-question');
    this.questionsContentContainerElement = document.getElementById('questions-view-container');
    this.questionTextElement = document.getElementById('question-text');
    this.currentQuestionElement = document.getElementById('current-question');
    this.resultTextCorrectElement = document.getElementById('result-text-correct');
    this.resultTextWrongElement = document.getElementById('result-text-wrong');
    this.resultTextTimeoutElement = document.getElementById('result-text-timeout');
    this.alternativesButtonsArr = [
        document.getElementById('alternative-1'),
        document.getElementById('alternative-2'),
        document.getElementById('alternative-3'),
    ];
    
    this.state = state;
    this.questionsDb = questionsDb;
    this.questions = [];
    this.configuration = configuration;
    this.alternativeslocked = false;
    this.requestGameState = requestGameState;
    
    this.resultTextCorrectElement.style.display = 'none'
    this.resultTextWrongElement.style.display = 'none'
    this.resultTextTimeoutElement.style.display = 'none'
    
    this.progressQuestions = new ProgressLine('question-progress-bar', this.configuration.get('numOfQuestions'));
    this.progressCircle = new ProgressCircle('time-progress', this.configuration.get('timePerQuestionMs'))
    this.progressCircle.onFinish = () => this.#choseAlternative(null);
    
    this.configuration = configuration;
  }
  
  initialize() {
    this.questionAmountElement.textContent = String(this.configuration.get('numOfQuestions'));
    this.currentQuestionElement.textContent = '0';
    
    ContainerVisibilityTransition.hide(this.questionsContentContainerElement);
  }
  
  destroy() {
    this.progressQuestions && this.progressQuestions.destroy();
    this.progressCircle && this.progressCircle.destroy();
  }
  
  enter(from) {
    ContainerVisibilityTransition.show(this.questionsContentContainerElement);
    this.alternativeslocked = false;
    
    this.#shuffleQuestions();
    this.#setCurrentQuestion(0)
    this.#loadQuestion(this.questions[0]);
    
    this.progressCircle.start();
  }
  
  exit(to) {
    ContainerVisibilityTransition.hide(this.questionsContentContainerElement);
  }
  
  #nextQuestion() {
    if ((this.state.currentQuestion + 1) >= this.questions.length)
      return this.requestGameState('show-results');
    
    this.#setCurrentQuestion(this.state.currentQuestion + 1);
    this.#loadQuestion(this.questions[this.state.currentQuestion]);
    this.progressCircle.start();
  }
  
  #loadQuestion(question) {
    this.#loadAlternatives([
        question.alternative1,
        question.alternative2,
        question.alternative3,
    ]);
    this.questionTextElement.textContent = question.text;
  }
  
  #loadAlternatives(alternatives) {
    const randomizedAlternatives = shuffle(alternatives);
    
    for (let i = 0; i < this.alternativesButtonsArr.length; i++) {
      this.alternativesButtonsArr[i].getElementsByClassName('alternative-btn-text')[0].textContent = randomizedAlternatives[i]
      this.alternativesButtonsArr[i].onclick = () => {
        console.log(this)
        if (!this.alternativeslocked)
          this.#choseAlternative(randomizedAlternatives[i]);
      }
    }
  }
  
  #choseAlternative(alternative) {
    this.alternativeslocked = true;
    this.progressCircle.reset();
    
    if (alternative) {
      const isCorrect = this.questions[this.state.currentQuestion].answer === alternative
      
      if (isCorrect) {
        this.#getAlternativeElement(alternative).classList.add('correct');
        this.#showResultText('correct')
      } else {
        this.#getAlternativeElement(this.questions[this.state.currentQuestion].answer).classList.add('correct');
        this.#getAlternativeElement(alternative).classList.add('wrong');
        this.#showResultText('wrong')
      }
    } else {
      this.#showResultText('timeout')
    }
    
    setTimeout(() => {
      this.alternativeslocked = false;
      this.#clearResults();
      this.#nextQuestion();
    }, this.configuration.get('timeOnResultsViewMs'));
  }
  
  #showResultText(type) {
    switch (type) {
      case 'correct':
        this.resultTextCorrectElement.style.display = 'block';
        break;
      case 'wrong':
        this.resultTextWrongElement.style.display = 'block';
        break;
      case 'timeout':
        this.resultTextTimeoutElement.style.display = 'block';
        break;
    }
  }
  
  #getAlternativeElement(alternative) {
    for (let i = 0; i < this.alternativesButtonsArr.length; i++) {
      const alternativeText = this.alternativesButtonsArr[i].getElementsByClassName('alternative-btn-text')[0].textContent;
      console.log(alternativeText, alternative)
      if (alternativeText === alternative) {
        return this.alternativesButtonsArr[i];
      }
    }
  }
  
  #clearResults() {
    this.resultTextCorrectElement.style.display = 'none'
    this.resultTextWrongElement.style.display = 'none'
    this.resultTextTimeoutElement.style.display = 'none'
    
    for (let i = 0; i < this.alternativesButtonsArr.length; i++) {
      this.alternativesButtonsArr[i].classList.remove('correct');
      this.alternativesButtonsArr[i].classList.remove('wrong');
    }
  }
  
  #shuffleQuestions() {
    this.questions = shuffle(this.questionsDb);
    this.questions = this.questions.slice(0, this.configuration.get('numOfQuestions'));
  }
  
  #setCurrentQuestion(questionNum) {
    this.state.currentQuestion = questionNum;
    this.progressQuestions.setProgress(questionNum + 1);
    this.currentQuestionElement.textContent = String(questionNum + 1);
  }
}