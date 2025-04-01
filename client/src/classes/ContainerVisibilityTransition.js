const fadeDurationMs = Number.parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('--fade-duration-ms'));
const slideDurationMs = Number.parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('--slide-duration-ms'));

export default class ContainerVisibilityTransition {
  static hide(element, onAnimationFinished) {
    if (!element.classList.contains('shown'))
      return;
    
    const durationMs = ContainerVisibilityTransition.#getTransitionDuration(element)
    
    element.classList.remove('shown');
    setTimeout(() => {
      element.style.display = 'none';
      onAnimationFinished && onAnimationFinished();
    }, durationMs * 1.1)
  }
  
  static show(element, targetStyleDisplay) {
    if (element.classList.contains('shown'))
      return;
    
    element.style.display = targetStyleDisplay ?? 'flex';
    element.classList.add('shown');
  }
  
  static instantHide(element) {
    element.style.display = 'none';
    element.classList.remove('shown');
  }
  
  static #getTransitionDuration(element) {
    return element.classList.contains('fade-container') ? fadeDurationMs : slideDurationMs
  }
}