import ContainerVisibilityTransition from "@classes/ContainerVisibilityTransition";
import flabbergastedFace from '@images/emojis/flabbergasted-face.png'
import happyFace from '@images/emojis/happy-face.png'
import stressedFace from '@images/emojis/stressed-face.png'

export default class ShowResultsGameState {
  constructor(requestGameState, configuration, state) {
    this.tryAgainButtonElement = document.getElementById('play-again-button');
    this.finalResultsContainerElement = document.getElementById('final-results-view-container');
    this.resultEmojiImage = document.getElementById('result-emoji-image');

    this.resultCardTopCorrectQuestionElement = document.getElementById('result-card-top-correct-question')
    this.resultCardTopTotalQuestionElement = document.getElementById('result-card-top-total-question')
    this.resultCorrectQuestionElement = document.getElementById('result-correct-question')
    this.resultTotalQuestionElement = document.getElementById('result-total-question')
    this.playerNameDisplayElement = document.getElementById('player-name-display')

    this.resultEmojiImage.src = flabbergastedFace
    this.resultCardTopCorrectQuestionElement.textContent = '8';
    this.resultCardTopTotalQuestionElement.textContent = '10';
    this.resultCorrectQuestionElement.textContent = '8';
    this.resultTotalQuestionElement.textContent = '10';
    this.playerNameDisplayElement.textContent = 'Gabriel';

    this.autoQuitTimeoutRef = null;
    this.requestGameState = requestGameState;
    this.configuration = configuration;
    this.state = state;

    this.tryAgainButtonElement.onclick = () => { requestGameState('main-menu') }
    ContainerVisibilityTransition.hide(this.finalResultsContainerElement);
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