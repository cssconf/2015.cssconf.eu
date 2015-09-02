export default function() {
  let banner = document.getElementById('soldOutBanner'),
      closeBtn = document.getElementById('closeSoldOutBanner');

  if (localStorage && localStorage.getItem('sold-out-banner-hidden')) {
    banner.style.display = 'none';
    return;
  }

  document.body.classList.add('banner-shown');
  banner.style.display = 'block';

  closeBtn.addEventListener('click', function () {
    banner.style.display = 'none';
    document.body.classList.remove('banner-shown');

    if (localStorage) {
      localStorage.setItem('sold-out-banner-hidden', true);
    }
  }, false);
}