import {FastClick} from 'fastclick'
import ToggleState from './ToggleState'
import picturefill from 'picturefill'
// import slider from './slider/slider.js'

picturefill();

document.addEventListener('DOMContentLoaded', () => {
  FastClick.attach(document.body);
  // slider();
  let navToggle = new ToggleState('.nav-toggle', '.nav-main ul');
}, false);
