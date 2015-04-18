export default class ToggleState {

  static STATES = {
    OPEN: 'open',
    CLOSED: 'closed'
  };

  static ATTR_NAME = 'data-state';

  constructor(handlerSelector, targetSelector, initialState = false) {
    this.isOpen = initialState;
    this.handlerEl = document.querySelector(handlerSelector);

    if (this.handlerEl) {
      this.handlerEl.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
      }, false);
      this.targetEl = document.querySelector(targetSelector);
    }
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.targetEl.setAttribute(ToggleState.ATTR_NAME, ToggleState.STATES.OPEN);
  }

  close() {
    this.isOpen = false;
    this.targetEl.setAttribute(ToggleState.ATTR_NAME, ToggleState.STATES.CLOSED);
  }
}
