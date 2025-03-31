import ProgressBar from "progressbar.js";

export default class ProgressCircle {
  #intervalRef = null;
  onFinish = () => {}
  
  constructor(mountElementId, timeMs) {
    this.mountElement = document.getElementById(mountElementId);
    this.timeMs = timeMs;
    this.currentTime = this.timeMs;
    
    this.bar = new ProgressBar.Circle(this.mountElement, {
      color: window.getComputedStyle(document.documentElement).getPropertyValue('--color-main'),
      strokeWidth: 8,
      stoke: document.documentElement.style.getPropertyValue('--color-main'),
      trailWidth: 0,
      easing: 'easeInOut',
      duration: 1000,
      text: {
        autoStyleContainer: false
      },
      step: (state, circle) => {
        const value = (this.currentTime / 1000) + 1;
        circle.setText(value);
      },
    });
    this.bar.text.style.fontFamily = '"Inter", Helvetica, sans-serif';
    this.bar.text.style.position = 'initial';
    this.bar.text.style.left = 'initial';
    this.bar.text.style.top = 'initial';
    this.bar.text.style.transform = 'initial';
    this.bar.text.style.fontSize = '2rem';
    this.bar.svg.style.transform = 'scale(-1, 1)';
    this.bar.svg.style.height = '100px';
    this.bar.svg.setAttribute('stroke-linecap', 'round');
    
    this.reset()
  }
  
  start() {
    this.currentTime = this.timeMs;
    
    this.currentTime -= 1000;
    this.bar.animate(this.currentTime / this.timeMs);
    
    this.#intervalRef = setInterval(() => {
      this.currentTime -= 1000;
      this.bar.animate(this.currentTime / this.timeMs);
      
      if (this.currentTime <= 0) {
        clearInterval(this.#intervalRef);
        
        setTimeout(() => {
          this.bar.setText(0);
          this.onFinish && this.onFinish()
        }, 1000)
      }
    }, 1000)
  }
  
  pause() {
    clearInterval(this.#intervalRef)
  }
  
  reset() {
    clearInterval(this.#intervalRef)
    this.bar.setText(String((this.timeMs / 1000) + 1));
    this.bar.animate(1.0, {
      delay: 500,
      duration: 500,
    });
  }
}