"use strict";

/* =========================================
   CONFIG
========================================= */

const CONFIG = {
  telegram: "https://t.me/heightagency",
  telegramText: "@heightagency",
  phoneDisplay: "+7 (000) 000-00-00",
  phoneTel: "+70000000000",
  email: "hello@height-agency.ru",
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
  setLink("tgMobile", CONFIG.telegram);
  setLink("tgLink", "#"); // теперь не открывает ссылку
  setText("tgText", CONFIG.telegramText);

  setLink("phoneLink", "#");
  setText("phoneText", CONFIG.phoneDisplay);

  setLink("emailLink", "#");
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
  const tg    = document.getElementById("tgLink");

  if(!phone && !email && !tg) return;

  /* ---------- TOAST UI ---------- */

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

  /* ---------- EVENTS ---------- */

  phone?.addEventListener("click",(e)=>{
    e.preventDefault();
    copy(CONFIG.phoneDisplay);
  });

  email?.addEventListener("click",(e)=>{
    e.preventDefault();
    copy(CONFIG.email);
  });

  tg?.addEventListener("click",(e)=>{
    e.preventDefault();
    copy(CONFIG.telegramText);
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
    burger.setAttribute("aria-expanded","true");
  };

  const close = () => {
    mobile.hidden = true;
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
