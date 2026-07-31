(function () {
  var STORAGE_KEY = 'draglab_promo_count';
  var path = window.location.pathname;

  // Skip on the two featured pages
  if (path.indexOf('become-a-distributor') !== -1 || path.indexOf('request-a-quote') !== -1) return;

  // Delays for each show: 10s, 1min, 5min, 10min, 10min
  var DELAYS = [10000, 60000, 300000, 600000, 600000];
  var MAX_SHOWS = DELAYS.length;

  var count = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);

  // Already shown the maximum number of times
  if (count >= MAX_SHOWS) return;

  function closePopup(popup) {
    popup.style.display = 'none';
  }

  function showPopup() {
    var popup = document.getElementById('promo-popup');
    if (!popup) return;

    // Increment count before showing
    count += 1;
    localStorage.setItem(STORAGE_KEY, String(count));

    popup.style.display = 'flex';

    var closeBtn = popup.querySelector('.promo-popup__close');
    var overlay  = popup.querySelector('.promo-popup__overlay');

    if (closeBtn) closeBtn.addEventListener('click', function () { closePopup(popup); });
    if (overlay)  overlay.addEventListener('click',  function () { closePopup(popup); });

    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape') {
        closePopup(popup);
        document.removeEventListener('keydown', onKey);
      }
    });

    // Schedule the next show if there are still shows remaining
    if (count < MAX_SHOWS) {
      setTimeout(showPopup, DELAYS[count]); // DELAYS[count] is already the next index
    }
  }

  // Schedule the first (or resumed) show
  setTimeout(showPopup, DELAYS[count]);
})();
