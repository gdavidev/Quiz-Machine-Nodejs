import MainMenuGameState from '@classes/GameStates/MainMenuGameState.js';
import QuestionsGameState from '@classes/GameStates/QuestionsGameState.js';
import ShowResultsGameState from "@classes/GameStates/ShowResultsGameState.js";
import Keyboard from '@classes/Keyboard.js';
import 'simple-keyboard/build/css/index.css';
import './css/style.css';
import './css/forms.css';
import './css/fonts.css';
import './css/quiz.css';
import './css/player-form.css';
import './css/admin.css';
import './css/main-menu.css';
import './css/final-results.css';
import FormGameState from "@classes/GameStates/FormGameState";
import AdminMenuGameState from "@classes/GameStates/AdminMenuGameState";
import QuestionsAPI from "@classes/DataFetching/QuestionsAPI";
import ConfigurationsAPI from "@classes/DataFetching/ConfigurationsAPI";

let questions = []
let configuration = new Map()

class PageContext {
  constructor() {
    this.requestGameState = this.requestGameState.bind(this);
    this.updateQuestions = this.updateQuestions.bind(this);
    this.updateConfiguration = this.updateConfiguration.bind(this);
    
    this.state = {
      currentQuestion: 0,
      correctAnswers: 0,
      currentPlayerName: '',
    };
    
    Promise.all([
      this.updateQuestions(),
      this.updateConfiguration(),
    ]).then(() => {
      this.#initializeStates()
      this.currentState = 'main-menu';
      this.states['main-menu'].enter('');
    });
  }

  #initializeStates() {
    this.states && Object.values(this.states).forEach(value => {
      value.destroy && value.destroy();
    })
    
    this.states = {
      'main-menu': new MainMenuGameState(this.requestGameState, this.state),
      'questions': new QuestionsGameState(this.requestGameState, configuration, this.state, questions),
      'show-results': new ShowResultsGameState(this.requestGameState, configuration, this.state),
      'form': new FormGameState(this.requestGameState, configuration, this.state),
      'admin': new AdminMenuGameState(this.requestGameState, async () => {
        Promise.all([
          this.updateQuestions(),
          this.updateConfiguration(),
        ]).then(() => {
          this.#initializeStates();
        })
      }),
    };
    
    Object.values(this.states).forEach(value => {
      value.initialize && value.initialize();
    })
  }
  
  requestGameState(gameState) {
    console.log(this.currentState + ' -> ' + gameState);
    
    this.states[this.currentState].exit(gameState);
    this.states[gameState].enter(this.currentState);
    this.currentState = gameState;
  }

  async updateQuestions() {
    questions = await QuestionsAPI.get();
  }

  async updateConfiguration() {
    const rawConfigs = await ConfigurationsAPI.get()
    rawConfigs.forEach((config) => {
      configuration.set(
          config.propertyName,
          !isNaN(parseFloat(config.value)) ? Number(config.value) : config.value);
    })

    configuration.set("numOfQuestions",
        configuration.get("numOfQuestions") > questions.length ?
            questions.length :
            configuration.get("numOfQuestions")
    )
  }
}

// Initialize page trigger
document.addEventListener('DOMContentLoaded', async () => {
  if (!window.pageContent) {
    window.pageContent = new PageContext();
  }
});

if (!window.emailKeyboard) { // Global guard
  window.emailKeyboard = Keyboard.alphanumeric(
      'alphanumeric-keyboard',
      input => { document.getElementById('email-input').value = input });
}
if (!window.numericKeyboard) { // Global guard
  window.numericKeyboard = Keyboard.numeric(
      'numeric-keyboard',
      input => { document.getElementById('phone-input').value = input });
}