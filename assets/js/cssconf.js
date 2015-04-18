import {FastClick} from 'fastclick'
import ToggleState from './ToggleState'
import slider from './slider/slider.js'

document.addEventListener('DOMContentLoaded', () => {
  FastClick.attach(document.body);
  slider();
  let navToggle = new ToggleState('.nav-toggle', '.nav-main ul');
}, false);
