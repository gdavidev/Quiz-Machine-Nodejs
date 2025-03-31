import ProgressBar from "progressbar.js";

export default class ProgressLine {
  constructor(mountElementId, maxCount) {
    this.mountElement = document.getElementById(mountElementId);
    this.maxCount = maxCount;
    this.currentValue = 1;
    
    this.bar = new ProgressBar.Line(this.mountElement, {
      strokeWidth: 4,
      easing: 'easeInOut',
      duration: 500,
      color: window.getComputedStyle(document.documentElement).getPropertyValue('--color-main'),
      trailColor: window.getComputedStyle(document.documentElement).getPropertyValue('--color-question-progress-background'),
      trailWidth: 4,
    });
    this.bar.svg.setAttribute('stroke-linecap', 'round');
    this.bar.svg.setAttribute('viewBox', '0 0 100 4');
    this.bar.svg.style.width = '100%'
    this.bar.svg.style.height = '100%'
    
    this.bar.animate(this.currentValue / this.maxCount);
  }
  
  setProgress(value) {
    this.currentValue = value;
    this.bar.animate(this.currentValue / this.maxCount);
  }
  
  increment() {
    if (this.currentValue >= this.maxCount)
      return;
    
    this.currentValue++;
    this.bar.animate(this.currentValue / this.maxCount);
  }
  
  reset() {
    this.bar.set(0)
  }
  
  destroy() {
    this.bar.destroy();
  }
}