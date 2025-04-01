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
    
    this.autoQuitTimeoutRef = null;
    this.requestGameState = requestGameState;
    this.configuration = configuration;
    this.state = state;

    this.tryAgainButtonElement.onclick = () => {
      ContainerVisibilityTransition.hide(this.finalResultsContainerElement, () => {
        requestGameState('main-menu');
      });
    }
    ContainerVisibilityTransition.instantHide(this.finalResultsContainerElement);
  }
  
  enter(from) {
    ContainerVisibilityTransition.show(this.finalResultsContainerElement);
    const scoreRatio = this.state.correctAnswers / this.configuration.get("numOfQuestions");
    const playerName = this.state.currentPlayerName.trim() === '' ? 'Jogador' : this.state.currentPlayerName.trim();
    
    this.resultCardTopCorrectQuestionElement.textContent = String(this.state.correctAnswers);
    this.resultCardTopTotalQuestionElement.textContent = String(this.configuration.get('numOfQuestions'));
    this.resultCorrectQuestionElement.textContent = String(this.state.correctAnswers);
    this.resultTotalQuestionElement.textContent = String(this.configuration.get('numOfQuestions'));
    this.playerNameDisplayElement.textContent = playerName.indexOf(' ') > -1 ? playerName.slice(playerName.indexOf(' ')) : playerName;
    
    if (scoreRatio === 1) {
      this.resultEmojiImage.src = flabbergastedFace
    } else if (scoreRatio >= 0.5) {
      this.resultEmojiImage.src = happyFace
    } else {
      this.resultEmojiImage.src = stressedFace
    }

    this.autoQuitTimeoutRef = setTimeout(() => {
      ContainerVisibilityTransition.show(this.finalResultsContainerElement, () => {
        this.requestGameState('main-menu');
      });
    }, this.configuration.get('goToMenuOnInactivityInResultScreenInSec') * 1000)
  }
  
  exit(to) {
    ContainerVisibilityTransition.hide(this.finalResultsContainerElement);
    
    clearTimeout(this.autoQuitTimeoutRef);
    this.autoQuitTimeoutRef = null;
  }
}