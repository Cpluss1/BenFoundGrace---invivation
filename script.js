(function(){
  "use strict";

  /* ---------- NAV ---------- */
  var nav = document.getElementById('mainNav');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', function(){
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, {passive:true});

  navToggle.addEventListener('click', function(){
    var open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
  });
  navLinks.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- PETALS ---------- */
  var petalHost = document.getElementById('petals');
  var petalColors = ['#E4C98B','#C9A15D','#D9B896'];
  for(var i=0;i<14;i++){
    var p = document.createElement('div');
    p.className = 'petal';
    var size = 6 + Math.random()*8;
    p.style.width = size+'px';
    p.style.height = size+'px';
    p.style.left = (Math.random()*100)+'%';
    p.style.background = petalColors[i % petalColors.length];
    p.style.animationDuration = (9 + Math.random()*8)+'s';
    p.style.animationDelay = (Math.random()*10)+'s';
    petalHost.appendChild(p);
  }

  /* ---------- REVEAL ON SCROLL ---------- */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, {threshold:0.15});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  /* ---------- COUNTDOWN ---------- */
  var WEDDING_DATE = new Date('2026-12-05T12:00:00');
  function tick(){
    var now = new Date();
    var diff = WEDDING_DATE - now;
    if(diff < 0) diff = 0;
    var d = Math.floor(diff/86400000);
    var h = Math.floor((diff%86400000)/3600000);
    var m = Math.floor((diff%3600000)/60000);
    var s = Math.floor((diff%60000)/1000);
    document.getElementById('cd-days').textContent = String(d).padStart(2,'0');
    document.getElementById('cd-hours').textContent = String(h).padStart(2,'0');
    document.getElementById('cd-mins').textContent = String(m).padStart(2,'0');
    document.getElementById('cd-secs').textContent = String(s).padStart(2,'0');
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- GALLERY DATA + RENDER ---------- */
  var galleryData = [
    {src:'pic1.jpeg', h:260},
    {src:'pic2.jpeg', h:220},
    {src:'pic3.jpeg', h:300},
    {src:'pic4.jpeg', h:240},
    {src:'pic5.jpeg', h:260}
  ];
  var masonry = document.getElementById('masonry');
  galleryData.forEach(function(item, idx){
    var d = document.createElement('div');
    d.className = 'plate';
    d.style.height = item.h + 'px';
    d.setAttribute('data-idx', idx);
    d.setAttribute('tabindex', '0');
    d.setAttribute('role', 'button');
    d.setAttribute('aria-label', 'View photo ' + (idx + 1));
    d.innerHTML = '<img src="' + item.src + '" alt="Wedding photo ' + (idx + 1) + '" loading="lazy">';
    masonry.appendChild(d);
  });

  /* ---------- LIGHTBOX ---------- */
  var lightbox = document.getElementById('lightbox');
  var lbPlate = document.getElementById('lbPlate');
  var lbLabel = document.getElementById('lbLabel');
  var lbCaption = document.getElementById('lbCaption');
  var currentIdx = 0;

  function openLightbox(idx){
    currentIdx = idx;
    var item = galleryData[idx];
    lbPlate.className = 'plate';
    lbPlate.innerHTML = '<img src="' + item.src + '" alt="Wedding photo ' + (idx + 1) + '" />';
    lbLabel.textContent = '';
    lbCaption.textContent = '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(){
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  masonry.addEventListener('click', function(e){
    var plate = e.target.closest('.plate');
    if(plate) openLightbox(parseInt(plate.getAttribute('data-idx'),10));
  });
  masonry.addEventListener('keydown', function(e){
    if(e.key === 'Enter' || e.key === ' '){
      var plate = e.target.closest('.plate');
      if(plate){ e.preventDefault(); openLightbox(parseInt(plate.getAttribute('data-idx'),10)); }
    }
  });
  document.getElementById('lbClose').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function(e){ if(e.target === lightbox) closeLightbox(); });
  document.getElementById('lbPrev').addEventListener('click', function(){
    openLightbox((currentIdx - 1 + galleryData.length) % galleryData.length);
  });
  document.getElementById('lbNext').addEventListener('click', function(){
    openLightbox((currentIdx + 1) % galleryData.length);
  });
  document.addEventListener('keydown', function(e){
    if(!lightbox.classList.contains('open')) return;
    if(e.key === 'Escape') closeLightbox();
    if(e.key === 'ArrowLeft') openLightbox((currentIdx - 1 + galleryData.length) % galleryData.length);
    if(e.key === 'ArrowRight') openLightbox((currentIdx + 1) % galleryData.length);
  });

  /* ---------- GUEST BOOK ---------- */
  var gbForm = document.getElementById('gbForm');
  var gbCards = document.getElementById('gbCards');
  gbForm.addEventListener('submit', function(e){
    e.preventDefault();
    var name = document.getElementById('gb-name').value.trim();
    var msg = document.getElementById('gb-msg').value.trim();
    if(!name || !msg) return;
    var card = document.createElement('div');
    card.className = 'gb-card reveal is-visible';
    card.innerHTML = '<p class="msg">"' + msg.replace(/</g,'&lt;') + '"</p><p class="from">— ' + name.replace(/</g,'&lt;') + '</p>';
    gbCards.prepend(card);
    gbForm.reset();
    showToast('Thank you — your message has been posted.');
  });

  /* ---------- TOAST HELPER ---------- */
  var toastMsg = document.getElementById('toastMsg');
  var toastTimer;
  function showToast(text){
    toastMsg.textContent = text;
    toastMsg.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toastMsg.classList.remove('show'); }, 3200);
  }

  /* ---------- ADD TO CALENDAR ---------- */
  document.getElementById('addCalendarBtn').addEventListener('click', function(){
    var start = '20261205T120000';
    var end   = '20261205T230000';
    var details = encodeURIComponent('The families of Navy Captain James Otache (Rtd.) and Mr. Musa Baba invite you to the solemnization of Holy Matrimony of Grace Ojima Otache and Benjamin Musa Baba.');
    var location = encodeURIComponent('RCCG Faith Chapel, 69 Road, Adkan Estate, Gwarinpa, Abuja');
    var url = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' +
      encodeURIComponent('Grace Ojima Otache & Benjamin Musa Baba — Wedding Ceremony') +
      '&dates=' + start + '/' + end + '&details=' + details + '&location=' + location;
    window.open(url, '_blank', 'noopener');
  });

  /* ---------- GET DIRECTIONS ---------- */
  document.getElementById('directionsBtn').addEventListener('click', function(e){
    e.preventDefault();
    window.open('https://www.google.com/maps/search/?api=1&query=RCCG+Faith+Chapel+69+Road+Adkan+Estate+Gwarinpa+Abuja', '_blank', 'noopener');
  });

  /* ---------- SHARE ---------- */
  var pageUrl = window.location.href;
  document.getElementById('whatsappShare').addEventListener('click', function(){
    var text = encodeURIComponent("You're invited! #BENFOUNDGRACE2026 are getting married on 30th September 2026. View the invitation: " + pageUrl);
    window.open('https://wa.me/?text=' + text, '_blank', 'noopener');
  });
  document.getElementById('copyLink').addEventListener('click', function(){
    navigator.clipboard.writeText(pageUrl).then(function(){
      showToast('Invitation link copied.');
    }).catch(function(){
      showToast('Could not copy link — please copy the URL manually.');
    });
  });
  document.getElementById('genericShare').addEventListener('click', function(){
    if(navigator.share){
      navigator.share({
        title: '#BENFOUNDGRACE2026 — Wedding Invitation',
        text: "You're invited to celebrate #BENFOUNDGRACE2026's wedding, 30th September 2026.",
        url: pageUrl
      }).catch(function(){});
    } else {
      navigator.clipboard.writeText(pageUrl).then(function(){ showToast('Invitation link copied.'); });
    }
  });

  /* ---------- BACKGROUND MUSIC TOGGLE ---------- */
  var audio = document.getElementById('bgAudio');
  var soundToggle = document.getElementById('soundToggle');
  var playing = false;
  soundToggle.addEventListener('click', function(){
    if(!audio.src && !audio.querySelector('source')){
      showToast('Add a music file to enable background audio.');
      return;
    }
    if(playing){
      audio.pause();
      soundToggle.classList.add('muted');
      soundToggle.setAttribute('aria-label','Play background music');
    } else {
      audio.play().catch(function(){});
      soundToggle.classList.remove('muted');
      soundToggle.setAttribute('aria-label','Mute background music');
    }
    playing = !playing;
  });

})();
