/* =========================================
   SCROLL TO TOP ON RELOAD
========================================= */
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
if (location.hash) history.replaceState(null, "", location.pathname + location.search);
window.scrollTo(0, 0);

"use strict";

/* =========================================
   CONFIG
========================================= */

const CONFIG = {
  telegram: "https://t.me/SvetlankaKS",
  telegramText: "@SvetlankaKS",
  phoneDisplay: "+7 (926) 940-55-98",
  phoneTel: "+79269405598",
  email: "svetlana.kazakova@height-agency.ru",
  site: "https://height-agency.ru/"
};

function setLink(id, href) {
  const el = document.getElementById(id);
  if (el) el.setAttribute("href", href);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

/* =========================================
   CONTACTS INIT
========================================= */

(function initContacts() {

  setLink("tgHeader", CONFIG.telegram);
  setLink("tgHero", CONFIG.telegram);
  setLink("tgCta", CONFIG.telegram);
  setLink("tgCase", CONFIG.telegram);
  setLink("tgMobile", CONFIG.telegram);
  setLink("tgLink", CONFIG.telegram);
  setText("tgText", CONFIG.telegramText);

  setLink("phoneLink", "tel:" + CONFIG.phoneTel);
  setText("phoneText", CONFIG.phoneDisplay);

  setLink("emailLink", "mailto:" + CONFIG.email);
  setText("emailText", CONFIG.email);

  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

})();

/* =========================================
   COPY TO CLIPBOARD + TOAST
========================================= */

(function copyContacts(){

  const phone = document.getElementById("phoneLink");
  const email = document.getElementById("emailLink");

  if(!phone && !email) return;

  const toast = document.createElement("div");
  toast.className = "copy-toast";
  toast.textContent = "Скопировано";
  document.body.appendChild(toast);

  let toastTimer;

  function showToast(){
    toast.classList.add("copy-toast--show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=>{
      toast.classList.remove("copy-toast--show");
    },1200);
  }

  async function copy(text){
    try{
      await navigator.clipboard.writeText(text);
      showToast();
    }catch(e){
      console.warn("Clipboard error", e);
    }
  }

  // Клик НЕ блокируем — нативный tel:/mailto: пусть срабатывает (браузер откроет почту,
  // предложит позвонить через Skype/etc). Параллельно копируем в буфер с тостом —
  // если у юзера нет handler-а, хотя бы есть адрес/номер в буфере.
  phone?.addEventListener("click",()=>{
    copy(CONFIG.phoneDisplay);
  });

  email?.addEventListener("click",()=>{
    copy(CONFIG.email);
  });

})();

/* =========================================
   MOBILE MENU
========================================= */

(function mobileMenu(){

  const burger = document.querySelector(".burger");
  const mobile = document.getElementById("mobileNav");

  if (!burger || !mobile) return;

  const open = () => {
    mobile.hidden = false;
    mobile.classList.add("open");
    burger.classList.add("open");
    burger.setAttribute("aria-expanded","true");
  };

  const close = () => {
    mobile.hidden = true;
    mobile.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded","false");
  };

  burger.addEventListener("click",()=>{
    const expanded = burger.getAttribute("aria-expanded")==="true";
    expanded ? close() : open();
  });

  mobile.addEventListener("click",(e)=>{
    const a = e.target.closest("a");
    if(a) close();
  });

  window.addEventListener("keydown",(e)=>{
    if(e.key==="Escape") close();
  });

})();

/* =========================================
   CASE PHOTO SLIDERS — round-robin
   One global timer, each tick advances the next slider
========================================= */
(function() {
  var sliders = [];

  document.querySelectorAll("[data-case-slider]").forEach(function(wrap) {
    var imgs = Array.from(wrap.querySelectorAll(".case-slider__img"));
    if (imgs.length < 2) return;
    var dotsWrap = wrap.querySelector(".case-slider__dots");
    var cur = 0;

    imgs.forEach(function(_, i) {
      var d = document.createElement("span");
      d.className = "case-slider__dot" + (i === 0 ? " active" : "");
      d.addEventListener("click", function(e) { e.stopPropagation(); go(i); });
      dotsWrap && dotsWrap.appendChild(d);
    });

    var dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll(".case-slider__dot")) : [];

    function go(i) {
      imgs[cur].classList.remove("active");
      dots[cur] && dots[cur].classList.remove("active");
      cur = (i + imgs.length) % imgs.length;
      imgs[cur].classList.add("active");
      dots[cur] && dots[cur].classList.add("active");
    }

    wrap.addEventListener("click", function() { go(cur + 1); });

    sliders.push({ wrap: wrap, go: go, cur: function() { return cur; } });
  });

  if (!sliders.length) return;

  /* Round-robin: every 2s advance the next slider */
  var robin = 0;
  var timer = null;

  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting && !timer) {
        timer = setInterval(function() {
          var s = sliders[robin];
          s.go(s.cur() + 1);
          robin = (robin + 1) % sliders.length;
        }, 2000);
      } else if (!e.isIntersecting && timer) {
        clearInterval(timer);
        timer = null;
      }
    });
  }, { threshold: 0.15 });

  /* Observe the cases grid container */
  var grid = sliders[0].wrap.closest(".grid");
  if (grid) obs.observe(grid);
})();

/* =========================================
   1. SCROLL REVEAL
========================================= */
(function scrollReveal() {
  var els = document.querySelectorAll(".reveal, .reveal-stagger");
  if (!els.length) return;

  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.03 });

  els.forEach(function(el) { obs.observe(el); });
})();

/* =========================================
   2. HERO PARALLAX ON MOUSE MOVE
========================================= */
(function heroParallax() {
  var hero = document.getElementById("heroVisual");
  if (!hero) return;
  var img = hero.querySelector(".visual-card__img");
  var glow = hero.querySelector(".visual-card__glow");
  if (!img) return;

  var raf = null;
  document.addEventListener("mousemove", function(e) {
    if (raf) return;
    raf = requestAnimationFrame(function() {
      var cx = window.innerWidth / 2;
      var cy = window.innerHeight / 2;
      var dx = (e.clientX - cx) / cx;
      var dy = (e.clientY - cy) / cy;
      img.style.transform = "translateY(" + (-14 * Math.sin(Date.now()/3000)) + "px) translate(" + (dx * 12) + "px," + (dy * 8) + "px)";
      if (glow) glow.style.transform = "translate(" + (dx * -18) + "px," + (dy * -12) + "px)";
      raf = null;
    });
  });
})();

/* =========================================
   3. COUNTER ANIMATION
========================================= */
(function counterAnim() {
  var targets = document.querySelectorAll(".hero-stat__num, .geo-stat__num, .tasks-result__num");
  if (!targets.length) return;

  function parseNum(text) {
    var cleaned = text.replace(/\s/g, "").replace(/,/g, ".");
    var match = cleaned.match(/([+\-−]?)(\d+(?:\.\d+)?)/);
    if (!match) return null;
    return {
      prefix: text.match(/^[^0-9]*/)[0],
      num: parseFloat(match[2]),
      suffix: text.match(/[^0-9.,]*$/)[0],
      sign: match[1]
    };
  }

  function animateNum(el, data) {
    var duration = 1200;
    var start = performance.now();
    var from = 0;
    var to = data.num;

    function tick(now) {
      var t = Math.min((now - start) / duration, 1);
      t = 1 - Math.pow(1 - t, 3); // ease-out cubic
      var current = Math.round(from + (to - from) * t);
      var formatted = current.toLocaleString("ru-RU");
      el.textContent = data.prefix + formatted + data.suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      var data = parseNum(el.textContent);
      if (data && data.num > 1) animateNum(el, data);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  targets.forEach(function(el) { obs.observe(el); });
})();

/* =========================================
   4. STICKY HEADER SCROLL EFFECT
========================================= */
(function headerScroll() {
  var header = document.querySelector(".header");
  if (!header) return;

  var scrolled = false;
  window.addEventListener("scroll", function() {
    var y = window.scrollY > 60;
    if (y !== scrolled) {
      scrolled = y;
      header.classList.toggle("header--scrolled", y);
    }
  }, { passive: true });
})();

/* =========================================
   5. ACTIVE NAV LINK HIGHLIGHTING
========================================= */
(function activeNav() {
  var links = document.querySelectorAll(".nav__link");
  if (!links.length) return;

  var sections = [];
  links.forEach(function(link) {
    var href = link.getAttribute("href");
    if (href && href.startsWith("#")) {
      var sec = document.getElementById(href.slice(1));
      if (sec) sections.push({ el: sec, link: link });
    }
  });

  var current = null;

  function update() {
    var scrollY = window.scrollY + 120;
    var active = null;

    /* If near page bottom, highlight the last section visible in viewport */
    var nearBottom = (window.scrollY + window.innerHeight) >= (document.body.scrollHeight - 60);
    if (nearBottom && sections.length) {
      for (var j = sections.length - 1; j >= 0; j--) {
        var rect = sections[j].el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          active = sections[j];
          break;
        }
      }
    } else {
      for (var i = sections.length - 1; i >= 0; i--) {
        if (sections[i].el.offsetTop <= scrollY) {
          active = sections[i];
          break;
        }
      }
    }

    if (active && active.link !== current) {
      if (current) current.classList.remove("nav__link--active");
      active.link.classList.add("nav__link--active");
      current = active.link;
    } else if (!active && current) {
      current.classList.remove("nav__link--active");
      current = null;
    }
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
})();
