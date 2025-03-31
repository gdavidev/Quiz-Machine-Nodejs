import ContainerVisibilityTransition from "@classes/ContainerVisibilityTransition";

export default class ShowResultsGameState {
  constructor(requestGameState, configuration, state) {
    this.tryAgainButtonElement = document.getElementById('play-again-button');
    this.finalResultsContainerElement = document.getElementById('final-results-view-container');

    this.autoQuitTimeoutRef = null;
    this.requestGameState = requestGameState;
    this.configuration = configuration;
    this.state = state;

    this.tryAgainButtonElement.onclick = () => { requestGameState('main-menu') }
    // ContainerVisibilityTransition.hide(this.finalResultsContainerElement); TODO uncomment this comment
  }
  
  enter(from) {
    ContainerVisibilityTransition.show(this.finalResultsContainerElement);
    const scoreRatio = this.state.correctAnswers / this.configuration.get("numOfQuestions");

    if (scoreRatio >= 0.7) {
      // this.finalResultTextElement.textContent = 'Parabens'
      // this.finalResultTextElement.style.color = 'green'
    } else if (scoreRatio >= 0.5) {
      // this.finalResultTextElement.textContent = 'Você foi bem'
      // this.finalResultTextElement.style.color = 'orange'
    } else {
      // this.finalResultTextElement.textContent = 'Mais sorte na próxima'
      // this.finalResultTextElement.style.color = 'red'
    }

    // this.autoQuitTimeoutRef = setTimeout(() => {  TODO uncomment this comment
    //   this.requestGameState('main-menu');
    // }, this.configuration.get('goToMenuOnInactivityInResultScreenInSec') * 1000)
  }
  
  exit(to) {
    ContainerVisibilityTransition.hide(this.finalResultsContainerElement);
    
    clearTimeout(this.autoQuitTimeoutRef);
    this.autoQuitTimeoutRef = null;
  }
}