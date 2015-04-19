const TIME_STEP = 1000 / 60;

export default function(update, render) {

  let lastTime;
  let accumulator = 0.0;
  let loop = (currTime) => {
    let dt = currTime - (lastTime || (lastTime = currTime));
    lastTime = currTime;

    accumulator += dt;

    while (accumulator >= TIME_STEP) {
      update(TIME_STEP);
      accumulator -= TIME_STEP;
    }

    render(accumulator);

    window.requestAnimationFrame(loop);
  };

  window.requestAnimationFrame(loop);
}
