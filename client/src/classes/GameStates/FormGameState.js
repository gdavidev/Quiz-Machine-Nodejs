import PlayersAPI from "@classes/DataFetching/PlayersAPI";
import ContainerVisibilityTransition from "@classes/ContainerVisibilityTransition";
import PlayerInfo from "@models/PlayerInfo";

export default class FormGameState {
  constructor(requestGameState, configuration, state) {
    this.formContainer = document.getElementById('form-view-container');
    this.alphanumericKeyboard = document.getElementsByClassName('alphanumeric-keyboard')[0];
    this.numericKeyboard = document.getElementsByClassName('numeric-keyboard')[0];
    this.emailInput = document.getElementById('email-input');
    this.phoneInput = document.getElementById('phone-input');
    this.nameInput = document.getElementById('name-input');
    this.termsCheckbox = document.getElementById('terms-check-box');
    this.emailOffersCheckbox = document.getElementById('offers-check-box');
    this.submitButton = document.getElementById('submit-btn');
    
    this.state = state;
    this.requestGameState = requestGameState;
    
    this.emailInput.onfocus = () => this.#showAlphanumericKeyboard()
    this.phoneInput.onfocus = () => this.#showNumericKeyboard()
    
    const emailKeyboardEnterBtn = window.emailKeyboard.getButtonElement('{enter}')
    emailKeyboardEnterBtn.onclick = () => this.#showNumericKeyboard();
  }
  
  initialize() {
    this.#clearForm();
    ContainerVisibilityTransition.instantHide(this.formContainer);
  }
  
  enter(from) {
    this.submitButton.onclick = () => {
      this.#savePlayerInfo();
      ContainerVisibilityTransition.hide(this.formContainer, () => {
        this.requestGameState('questions');
      });
    }
    
    this.#clearForm()
    this.#showAlphanumericKeyboard();
    ContainerVisibilityTransition.show(this.formContainer);
  }
  
  exit(to) {
    this.submitButton.onclick = undefined;
    ContainerVisibilityTransition.hide(this.formContainer);
  }

  #savePlayerInfo() {
    const name = String(this.nameInput.value);
    const email = String(this.emailInput.value);
    const phone = String(this.phoneInput.value);
    const acceptedTerms = this.termsCheckbox.checked ? 1 : 0;
    const acceptedEmailOffers = this.emailOffersCheckbox.checked ? 1 : 0;
    
    this.state.currentPlayerName = name;
    
    PlayersAPI.save(new PlayerInfo(name, email, phone, acceptedTerms, acceptedEmailOffers));
  }

  #clearForm() {
    this.nameInput.value = ''
    this.emailInput.value = ''
    this.phoneInput.value = ''
    this.termsCheckbox.checked = false;
    this.emailOffersCheckbox.checked = false;
  }
  
  #showNumericKeyboard() {
    this.phoneInput.focus();
    this.alphanumericKeyboard.style.display = 'none'
    this.numericKeyboard.style.display = 'block'
  }
  
  #showAlphanumericKeyboard() {
    this.emailInput.focus();
    this.alphanumericKeyboard.style.display = 'block'
    this.numericKeyboard.style.display = 'none'
  }
}