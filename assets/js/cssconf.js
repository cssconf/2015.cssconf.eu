import {FastClick} from 'fastclick'
import ToggleState from './ToggleState'
import picturefill from 'picturefill'
// import slider from './slider/slider.js'

picturefill();

FastClick.attach(document.body);
// slider();
let navToggle = new ToggleState('.nav-toggle', '.nav-main ul');

let soldOutBanner = document.getElementById('closeSoldOutBanner');

let closeSoldOutBanner = function () {
  document.getElementById('soldOutBanner').style.display = "none"
}

soldOutBanner.addEventListener('click', closeSoldOutBanner, false)