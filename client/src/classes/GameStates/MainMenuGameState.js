import ContainerVisibilityTransition from "@classes/ContainerVisibilityTransition";

export default class MainMenuGameState {
  constructor(requestGameState, state) {
    this.startGameButton = document.getElementById('start-game-btn');
    this.exitGameButton = document.getElementById('exit-game-btn');
    this.mainMenuContainer = document.getElementById('main-menu-container');
    
    this.state = state;
    this.requestGameState = requestGameState;
  }
  
  initialize() {
    this.state.currentQuestion = 0;
    this.state.correctAnswers = 0;
    this.exitGameButton.onclick = () => window.close();
    this.startGameButton.onclick = () => {
      ContainerVisibilityTransition.hide(this.mainMenuContainer, () => {
        this.requestGameState('form');
      });
    }
  }
  
  enter(from) {
    ContainerVisibilityTransition.show(this.mainMenuContainer);
    
    this.state.currentQuestion = 0;
    this.state.correctAnswers = 0;
    document.activeElement.blur(); // Remove focus from current focused element
    document.onkeydown = (e) => {
      if (e.key === 'Enter')
        this.requestGameState('admin');
    };
  }
  
  exit(to) {
    ContainerVisibilityTransition.hide(this.mainMenuContainer);
    
    document.onkeydown = undefined
  }
}