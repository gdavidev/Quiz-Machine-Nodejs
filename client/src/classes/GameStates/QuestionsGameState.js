import ContainerVisibilityTransition from "@classes/ContainerVisibilityTransition";
import {shuffle} from "@libs/ArrayUtilities";
import ProgressLine from "@classes/ProgressLine";
import ProgressCircle from "@classes/ProgressCircle";
import checkIcon from '@icons/check.svg'
import crossIcon from '@icons/cross.svg'

export default class QuestionsGameState {
  constructor(requestGameState, configuration, state, questionsDb) {
    this.questionAmountElement = document.getElementById('question-amount');
    this.currentQuestionElement = document.getElementById('current-question');
    this.topQuestionAmountElement = document.getElementById('question-top-display-amount');
    this.topCurrentQuestionElement = document.getElementById('question-top-display-current');
    this.questionsContentContainerElement = document.getElementById('questions-view-container');
    this.questionTextElement = document.getElementById('question-text');
    this.resultTextCorrectElement = document.getElementById('result-text-correct');
    this.resultTextWrongElement = document.getElementById('result-text-wrong');
    this.resultTextTimeoutElement = document.getElementById('result-text-timeout');
    this.cutiositiesTextElement = document.getElementById('curiosities-text');
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
    
    this.resultTextCorrectElement.style.display = 'none';
    this.resultTextWrongElement.style.display = 'none';
    this.resultTextTimeoutElement.style.display = 'none';
    
    this.progressQuestions = new ProgressLine('question-progress-bar', this.configuration.get('numOfQuestions'));
    this.progressCircle = new ProgressCircle('time-progress', this.configuration.get('timePerQuestionMs'))
    this.progressCircle.onFinish = () => this.#choseAlternative(null);
    
    this.curiositiesIntervalRef = null;
  }
  
  initialize() {
    this.questionAmountElement.textContent = String(this.configuration.get('numOfQuestions'));
    this.topQuestionAmountElement.textContent = String(this.configuration.get('numOfQuestions'));
    this.currentQuestionElement.textContent = '0';
    this.topCurrentQuestionElement.textContent = '0';
    this.#initializeCuriositiesDisplay();
    
    ContainerVisibilityTransition.instantHide(this.questionsContentContainerElement);
  }
  
  destroy() {
    this.progressQuestions && this.progressQuestions.destroy();
    this.progressCircle && this.progressCircle.destroy();
    
    clearInterval(this.curiositiesIntervalRef);
  }
  
  enter(from) {
    ContainerVisibilityTransition.show(this.questionsContentContainerElement);
    
    this.#clearGame();
    this.#clearResults();
    this.#setCurrentQuestion(0);
    this.#countDown(() => {
      this.alternativeslocked = false;
      
      this.#shuffleQuestions();
      this.#loadQuestion(this.questions[0]);
      
      this.progressCircle.start();
    })
  }
  
  exit(to) {
    ContainerVisibilityTransition.hide(this.questionsContentContainerElement);
  }
  
  #nextQuestion() {
    if ((this.state.currentQuestion + 1) >= this.questions.length)
      return ContainerVisibilityTransition.hide(this.questionsContentContainerElement, () => {
        this.requestGameState('show-results');
      });
    
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
      const selectedAlternative = this.#getAlternativeElement(alternative)
      const selectedAlternativeIcon = selectedAlternative.getElementsByClassName('alternative-btn-check-icon')[0]
      
      if (isCorrect) {
        selectedAlternative.classList.add('correct');
        selectedAlternativeIcon.src = checkIcon
        
        this.#showResultText('correct')
        this.state.correctAnswers++;
      } else {
        const rightAlternative = this.#getAlternativeElement(this.questions[this.state.currentQuestion].answer)
        const rightAlternativeIcon = rightAlternative.getElementsByClassName('alternative-btn-check-icon')[0]
        rightAlternative.classList.add('correct');
        rightAlternativeIcon.src = checkIcon
        
        selectedAlternative.classList.add('wrong');
        selectedAlternativeIcon.src = crossIcon
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
        this.resultTextCorrectElement.style.display = 'flex';
        break;
      case 'wrong':
        this.resultTextWrongElement.style.display = 'flex';
        break;
      case 'timeout':
        this.resultTextTimeoutElement.style.display = 'flex';
        break;
    }
  }
  
  #getAlternativeElement(alternative) {
    for (let i = 0; i < this.alternativesButtonsArr.length; i++) {
      const alternativeText = this.alternativesButtonsArr[i].getElementsByClassName('alternative-btn-text')[0].textContent;
      if (alternativeText === alternative) {
        return this.alternativesButtonsArr[i];
      }
    }
  }
  
  #clearResults() {
    this.resultTextCorrectElement.style.display = 'none'
    this.resultTextWrongElement.style.display = 'none'
    this.resultTextTimeoutElement.style.display = 'none'

    for (const altBtn of this.alternativesButtonsArr) {
      altBtn.classList.remove('correct');
      altBtn.classList.remove('wrong');
    }
    for (const iconEl of document.getElementsByClassName('alternative-btn-check-icon')) {
      iconEl.src = ''
    }
  }
  
  #countDown(onFinish) {
    let count = 3;
    this.questionTextElement.textContent = String(count);
    
    const countdownRef = setInterval(() => {
      count--;
      if (count <= 0) {
        this.questionTextElement.textContent = "Vai!"
        clearInterval(countdownRef);
        setTimeout(() => {
          onFinish();
        }, 1000);
        return;
      }
      this.questionTextElement.textContent = String(count);
    }, 1000);
  }
  
  #clearGame() {
    this.questionTextElement.textContent = '';
    for (let i = 0; i < this.alternativesButtonsArr.length; i++) {
      const alternativeText = this.alternativesButtonsArr[i].getElementsByClassName('alternative-btn-text')[0]
      alternativeText.textContent = ''
    }
  }
  
  #initializeCuriositiesDisplay() {
    let currentCuriosity = 0
    const curiosities = [
      "A umidade nas paredes pode vir tanto do solo quanto da chuva.",
      "Peças grandes como 180x180 cm exigem uma argamassa com alta aderência e flexibilidade.",
      "Lajes expostas precisam de impermeabilização resistente ao sol, à chuva e tráfego ocasional — produtos com proteção UV fazem toda a diferença!",
      "Rejunte para piscinas precisa ser impermeável, resistente ao cloro e aos raios solares para evitar infiltrações.",
      "Você sabia? O vapor quente dos banhos pode causar dilatações nos revestimentos.",
      "A varanda gourmet se popularizou no Brasil a partir dos anos 2000, principalmente em projetos residenciais urbanos.",
      "Quanto maior a peça, mais importante o nivelamento perfeito da base.",
      "Infiltrações são uma das principais causas de danos estruturais em edificações.",
      "Juntas acima de 5 mm são comuns em áreas externas ou revestimentos rústicos, enquanto juntas de 1 a 2 mm são mais utilizadas em porcelanatos e ambientes internos",
      "A sobreposição é uma prática comum em obras públicas e comerciais para manter ambientes em funcionamento durante a reforma.",
    ];
    this.cutiositiesTextElement.textContent = curiosities[currentCuriosity];
    
    setInterval(() => {
      currentCuriosity++;
      if (currentCuriosity > curiosities.length - 1)
        currentCuriosity = 0;
      
      this.cutiositiesTextElement.textContent = curiosities[currentCuriosity];
    }, 5000);
  }
  
  #shuffleQuestions() {
    this.questions = shuffle(this.questionsDb);
    this.questions = this.questions.slice(0, this.configuration.get('numOfQuestions'));
  }
  
  #setCurrentQuestion(questionNum) {
    this.state.currentQuestion = questionNum;
    this.progressQuestions.setProgress(questionNum + 1);
    this.currentQuestionElement.textContent = String(questionNum + 1);
    this.topCurrentQuestionElement.textContent = String(questionNum + 1);
  }
}