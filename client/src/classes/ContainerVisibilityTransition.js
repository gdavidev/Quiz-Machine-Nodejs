const fadeDurationMs = Number.parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('--fade-duration-ms'));
const slideDurationMs = Number.parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('--slide-duration-ms'));

export default class ContainerVisibilityTransition {
  static hide(element, onAnimationFinished) {
    const durationMs = ContainerVisibilityTransition.#getTransitionDuration(element)
    
    element.classList.remove('shown');
    setTimeout(() => {
      element.style.display = 'none';
      onAnimationFinished && onAnimationFinished();
    }, durationMs * 1.1)
  }
  
  static show(element) {
    element.style.display = 'flex';
    element.classList.add('shown');
  }
  
  static #getTransitionDuration(element) {
    return element.classList.contains('fade-container') ? fadeDurationMs : slideDurationMs
  }
}