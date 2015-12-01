import {FastClick} from 'fastclick'
import ToggleState from './ToggleState'
import picturefill from 'picturefill'
//import initSoldOutBanner from './soldout-banner.js';
// import slider from './slider/slider.js'

//initSoldOutBanner();
picturefill();
FastClick.attach(document.body);

// slider();
let navToggle = new ToggleState('.nav-toggle', '.nav-main ul');
