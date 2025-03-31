import PlayersAPI from "@classes/DataFetching/PlayersAPI";
import ContainerVisibilityTransition from "@classes/ContainerVisibilityTransition";

export default class FormGameState {
  constructor(requestGameState, configuration, state) {
    this.formContainer = document.getElementById('form-container');
    this.alphanumericKeyboard = document.getElementsByClassName('alphanumeric-keyboard')[0];
    this.numericKeyboard = document.getElementsByClassName('numeric-keyboard')[0];
    this.emailInput = document.getElementById('email-input');
    this.phoneInput = document.getElementById('phone-input');
    this.submitButton = document.getElementById('submit-btn');
    
    this.emailInput.onfocus = () => this.#showAlphanumericKeyboard()
    this.phoneInput.onfocus = () => this.#showNumericKeyboard()

    const emailKeyboardEnterBtn = window.emailKeyboard.getButtonElement('{enter}')
    emailKeyboardEnterBtn.onclick = () => this.#showNumericKeyboard();
    
    this.submitButton.onclick = () => {
      this.#savePlayerInfo();
      requestGameState('questions');
    }
  }
  
  initialize() {
    this.#clearForm();
    ContainerVisibilityTransition.hide(this.formContainer);
  }
  
  enter(from) {
    this.#clearForm()
    this.#showAlphanumericKeyboard();
    ContainerVisibilityTransition.show(this.formContainer);
  }
  
  exit(to) {
    this.submitButton.onclick = undefined;
    ContainerVisibilityTransition.hide(this.formContainer);
  }

  #savePlayerInfo() {
    const email = String(this.emailInput.value);
    const phone = String(this.phoneInput.value);

    PlayersAPI.save(email, phone);
  }

  #clearForm() {
    this.emailInput.value = ''
    this.phoneInput.value = ''
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