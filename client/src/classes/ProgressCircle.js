import ProgressBar from "progressbar.js";

export default class ProgressCircle {
  #intervalRef = null;
  #timeoutRef = null;
  onFinish = undefined;
  
  constructor(mountElementId, timeMs) {
    this.mountElement = document.getElementById(mountElementId);
    this.timeMs = timeMs;
    this.currentTime = this.timeMs;
    
    this.bar = new ProgressBar.Circle(this.mountElement, {
      color: window.getComputedStyle(document.documentElement).getPropertyValue('--color-main'),
      strokeWidth: 8,
      trailWidth: 0,
      easing: 'easeInOut',
      duration: 1000,
      text: {
        autoStyleContainer: false
      },
      step: (state, circle) => {
        const value = Math.round(circle.value() * this.timeMs / 1000);
        circle.setText(value);
      },
    });
    this.bar.text.style.fontFamily = '"Inter", Helvetica, sans-serif';
    this.bar.text.style.position = 'initial';
    this.bar.text.style.left = 'initial';
    this.bar.text.style.top = 'initial';
    this.bar.text.style.transform = 'initial';
    this.bar.text.style.fontSize = '1.5rem';
    this.bar.text.style.color = window.getComputedStyle(document.documentElement).getPropertyValue('--color-text-dark');
    this.bar.svg.style.transform = 'scale(-1, 1)';
    this.bar.svg.style.height = '70px';
    this.bar.svg.setAttribute('stroke-linecap', 'round');
    
    this.reset()
  }
  
  start() {
    this.currentTime = this.timeMs;
    
    this.currentTime -= 1000;
    this.bar.animate(this.currentTime / this.timeMs);
    
    this.#intervalRef = setInterval(() => {
      this.currentTime -= 1000;
      this.bar.animate(Math.max(this.currentTime / this.timeMs, 0));
      
      if (this.currentTime <= 0) {
        clearInterval(this.#intervalRef);
        
        if (typeof this.onFinish === 'function') {
          this.#timeoutRef = setTimeout(() => {
            this.onFinish();
          }, 1000)
        }
      }
    }, 1000)
  }
  
  pause() {
    clearInterval(this.#intervalRef)
    clearTimeout(this.#timeoutRef)
  }
  
  reset() {
    clearInterval(this.#intervalRef)
    clearTimeout(this.#timeoutRef)
    
    this.bar.animate(1.0, {
      delay: 500,
      duration: 500,
    });
  }
  
  destroy() {
    this.bar.destroy();
  }
}