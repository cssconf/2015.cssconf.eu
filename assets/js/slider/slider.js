import Vector from './vector.js'
import gameloop from './fixed-ts.js'
const origin = new Vector(0, 0, 0);

let SLIDE_WIDTH;
let SLIDER_WIDTH;
let SLIDER_INNER_WIDTH;
let INTEGRATION_STEPS;
let SLIDE_THRESHOLD;
let sliderEl = document.querySelector('.speakers__slider');
let slidesEl = sliderEl.querySelector('.speakers__slider-element');
let slides   = [].slice.call(slidesEl.querySelectorAll('.speakers__item'), 0);

function updateDimensions() {
  SLIDE_WIDTH        = 280;
  SLIDER_WIDTH       = sliderEl.offsetWidth;
  SLIDER_INNER_WIDTH = slides.length * SLIDE_WIDTH;
  INTEGRATION_STEPS  = 4;
  SLIDE_THRESHOLD    = SLIDER_WIDTH / 2;
}

const STATE = {
  PAUSED: 0,
  DRAGGING: 1,
  DECELERATE: 2,
  SNAPPING: 3
}

let world = {
  drag: 0.1,
  springThickness: 50,
  springDamper: 17,
  snapThreshold: 0.2
};

let input = {
  isDragging: false,
  isScrolling: false,
  moved: false,
  pos: origin,
  lastPos: origin
};

let slider = {
  slider: STATE.PAUSED,
  pos: origin,
  velocity: origin,
  targetX: false
};

let getResistance = () => {
  let resistance = 0;
  let pos = slider.pos.elements[0];
  if (pos < 0) {
    resistance = -pos / SLIDE_THRESHOLD;
  } else if (pos > (SLIDER_INNER_WIDTH - SLIDER_WIDTH)) {
    resistance = -(SLIDER_INNER_WIDTH - SLIDER_WIDTH - pos) / SLIDE_THRESHOLD;
  }
  return Math.min(Math.max(resistance, 0), 1);
};

let stickyFinger = (dt) => {
  if (input.pos !== input.lastPos) {
    let dPos = Vector.difference(input.lastPos, input.pos);
    dPos.multiply(1 - getResistance())
    slider.pos.add(dPos);
    slider.velocity = dPos.divide(dt);
    input.lastPos = input.pos;
  }
};

let decelerate = (dt) => {
  slider.velocity.multiply(1 - world.drag);

  let dPos = slider.velocity.clone().multiply(dt);
  dPos.multiply(1 - getResistance());
  slider.pos.add(dPos);

  if (slider.velocity.magnitude() < world.snapThreshold) {
    slider.targetX = SLIDE_WIDTH * Math.round(slider.pos.elements[0] / SLIDE_WIDTH);
    slider.targetX = Math.min(Math.max(slider.targetX, 0), Math.max(SLIDER_INNER_WIDTH - SLIDER_WIDTH, 0));
    slider.state = STATE.SNAPPING;
  }
};

let snapToGrid = (dt) => {

  let pos = slider.pos.elements[0];
  let velocity = slider.velocity.elements[0];
  let distance = slider.targetX - pos;

  // for higher precision use a stepwise integration
  for (let i = INTEGRATION_STEPS; i > 0; i--) {
    let force = world.springThickness * (slider.targetX - pos) - world.springDamper * velocity;
    force    /= INTEGRATION_STEPS;
    velocity += force / dt;
    pos      += velocity / dt;
  }

  slider.velocity.elements[0] = velocity;
  slider.pos.elements[0] = pos;

  if (slider.velocity.magnitude() <= 0.05 && Math.abs(distance) < 2) {
    slider.pos.elements[0] = slider.targetX;
    slider.velocity = origin;
    slider.state = STATE.PAUSED;
  }
};

let update = (dt) => {
  switch (slider.state) {
    case STATE.DRAGGING:
      stickyFinger(dt);
      break;
    case STATE.DECELERATE:
      decelerate(dt);
      break;
    case STATE.SNAPPING:
      snapToGrid(dt);
      break;
  }
};

let _lastX = null;
let render = (dt) => {
  let [x] = slider.pos.elements;
  if (_lastX !== x) {
    _lastX = x;
    slidesEl.style['-webkit-transform'] = slidesEl.style.transform = `translate3d(${-x}px,0,0)`;
  }
};

let onStart = (x, y) => {
  let pos = new Vector(x, y, 0);

  input.pos = pos;
  input.lastPos = pos.clone();
  input.startPos = pos.clone();

  slider.state = STATE.DRAGGING;

  input.moved = false;
  input.isDragging = true;
  input.isScrolling = false;
  input.scrollSpy = true;
};

let onEnd = () => {
  if (input.isDragging) {
    input.isDragging = false;

    if (input.moved) {
      slider.state = STATE.DECELERATE;
    } else {
      slider.state = STATE.PAUSED;
    }
  }
};

let onMove = (x, y, e) => {
  console.log(x, y);
  if (input.isDragging) {
    let pos = new Vector(x, y, 0);
    input.moved = true;

    if (input.scrollSpy) {
      let diff = Vector.difference(pos, input.startPos);
      if (diff.magnitude() > 5) {
        input.scrollSpy = false;
        let [x, y] = diff.elements.map((c) => Math.abs(c));
        if (x < y) {
          input.isScrolling = true;
          input.isDragging = false;
          onEnd();
        }
      }
    } else if (e) {
      e.preventDefault();
    }

    input.pos = pos;
  }
};

export default function() {

  updateDimensions();

  // resize logic
  window.addEventListener('resize', debounce(updateDimensions, 200));

  gameloop(update, render);

  sliderEl.addEventListener('touchstart', (e) => onStart(e.touches[0].clientX, e.touches[0].clientY) );
  document.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX, e.touches[0].clientY, e) );
  document.addEventListener('touchend', onEnd);

  sliderEl.addEventListener('mousedown', (e) => onStart(e.clientX, e.clientY) );
  document.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY) );
  document.addEventListener('mouseup', onEnd);

};

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this;
    var args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
