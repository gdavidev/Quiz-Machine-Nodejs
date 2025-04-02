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
    
    this.emailInput.onfocus = () => this.#showAlphanumericKeyboard(this.emailInput);
    this.nameInput.onfocus = () => this.#showAlphanumericKeyboard(this.nameInput);
    this.phoneInput.onfocus = () => this.#showNumericKeyboard(this.phoneInput);
    
    this.submitButton.onclick = () => {
      this.#savePlayerInfo();
    }
    
    const alphanumericKeyboardEnterBtn = window.alphanumericKeyboard.getButtonElement('{enter}')
    alphanumericKeyboardEnterBtn.onclick = () => {
      if (window.alphanumericKeyboardInput === this.nameInput)
        this.emailInput.focus();
      else if (window.alphanumericKeyboardInput === this.emailInput)
        this.phoneInput.focus();
    }
  }
  
  initialize() {
    this.#clearForm();
    this.#hideKeyboards();
    ContainerVisibilityTransition.instantHide(this.formContainer);
  }
  
  enter(from) {
    this.#clearForm();
    ContainerVisibilityTransition.show(this.formContainer);
    
    setTimeout(() => {
      this.nameInput.focus();
    }, 200)
  }
  
  exit(to) {
    document.activeElement.blur();
    ContainerVisibilityTransition.hide(this.formContainer);
    this.#hideKeyboards();
  }

  #savePlayerInfo() {
    const name = String(this.nameInput.value).trim();
    const email = String(this.emailInput.value).trim();
    const phone = String(this.phoneInput.value).trim();
    const acceptedTerms = this.termsCheckbox.checked ? 1 : 0;
    const acceptedEmailOffers = this.emailOffersCheckbox.checked ? 1 : 0;
    
    let validationFailed = false;
    
    const schema = {
      nameInput: name !== '',
      emailInput: email !== '' && email.split('@').length === 2 && email.indexOf(' ') === -1,
      phoneInput: phone !== '' && RegExp(/^\d{8,11}$/).test(phone),
      termsCheckbox: acceptedTerms === 1,
    }
    Object.entries(schema).forEach(([key, value]) => {
      if (value === false) { // Validation failed
        validationFailed = true;
        this[key].style.border = 'red solid 1px';
      } else {
        this[key].style.border = '1px solid var(--color-border)';
      }
    });
    
    if (!validationFailed) {
      this.state.currentPlayerName = name;
      
      PlayersAPI.save(new PlayerInfo(name, email, phone, acceptedTerms, acceptedEmailOffers));
      
      ContainerVisibilityTransition.hide(this.formContainer, () => {
        this.requestGameState('questions');
      });
    }
  }
  
  #clearForm() {
    this.nameInput.value = ''
    this.emailInput.value = ''
    this.phoneInput.value = ''
    window.numericKeyboard.clearInput()
    window.alphanumericKeyboard.clearInput()
    this.termsCheckbox.checked = false;
    this.emailOffersCheckbox.checked = false;
    
    this.nameInput.style.border = '1px solid var(--color-border)';
    this.emailInput.style.border = '1px solid var(--color-border)';
    this.phoneInput.style.border = '1px solid var(--color-border)';
    this.termsCheckbox.style.border = '1px solid var(--color-border)';
  }
  
  #showNumericKeyboard(targetInput) {
    this.numericKeyboard.classList.add('shown')
    this.alphanumericKeyboard.classList.remove('shown')
    
    targetInput.focus();
    window.numericKeyboard.setInput(targetInput.value)
    window.numericKeyboardInput = targetInput
  }
  
  #showAlphanumericKeyboard(targetInput) {
    this.numericKeyboard.classList.remove('shown')
    this.alphanumericKeyboard.classList.add('shown')
    
    targetInput.focus();
    window.alphanumericKeyboard.setInput(targetInput.value)
    window.alphanumericKeyboardInput = targetInput
  }
  
  #hideKeyboards() {
    this.numericKeyboard.classList.remove('shown')
    this.alphanumericKeyboard.classList.remove('shown')
  }
}