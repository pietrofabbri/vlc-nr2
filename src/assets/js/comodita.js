// Piccole comodità: torna su, barra «Richieda il libro» sul telefono, contatore delle copie,
// scelte di «Pubblichi con noi» che precompilano il modulo, nome e indirizzo ricordati sul dispositivo.
(function () {
  // Torna su: compare dopo un paio di schermate
  var su = document.querySelector(".torna-su");
  if (su) {
    var aggiornaSu = function () { su.hidden = window.scrollY < window.innerHeight * 1.5; };
    window.addEventListener("scroll", aggiornaSu, { passive: true });
    aggiornaSu();
  }

  // Barra in basso nella scheda del libro: sparisce quando il modulo è a schermo
  var barra = document.querySelector(".barra-richiesta");
  var modulo = document.getElementById("richiesta");
  if (barra && modulo && "IntersectionObserver" in window) {
    var visibile = false, oltre = false;
    new IntersectionObserver(function (v) {
      visibile = v[0].isIntersecting;
      oltre = v[0].boundingClientRect.top < 0;
      barra.hidden = visibile || oltre;
      if (su) su.classList.toggle("torna-su--alto", !barra.hidden);
    }).observe(modulo);
  }

  // Contatore delle copie
  document.querySelectorAll("[data-passo]").forEach(function (b) {
    b.addEventListener("click", function () {
      var input = b.parentNode.querySelector("input");
      var n = (parseInt(input.value, 10) || 1) + Number(b.dataset.passo);
      input.value = Math.max(Number(input.min) || 1, Math.min(Number(input.max) || 999, n));
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  });

  // «Inizi da qui» in Pubblichi con noi: sceglie il tipo nel modulo
  document.querySelectorAll(".offerta[data-tipo]").forEach(function (a) {
    a.addEventListener("click", function () {
      var tipo = document.querySelector('#proposta select[name="tipo"]');
      if (tipo) tipo.value = a.dataset.tipo;
      setTimeout(function () { var n = document.querySelector('#proposta input[name="nome"]'); if (n) n.focus({ preventScroll: true }); }, 400);
    });
  });

  // Nome e indirizzo ricordati solo su questo dispositivo, per non riscriverli a ogni richiesta
  var CHIAVI = ["nome", "indirizzo", "ente"];
  function leggi(k) { try { return localStorage.getItem("vlc-" + k) || ""; } catch (e) { return ""; } }
  function scrivi(k, v) { try { localStorage.setItem("vlc-" + k, v); } catch (e) {} }
  document.querySelectorAll("form[data-richiesta]").forEach(function (f) {
    CHIAVI.forEach(function (k) {
      var c = f.querySelector('[name="' + k + '"]');
      if (!c) return;
      if (!c.value) c.value = leggi(k);
      c.addEventListener("change", function () { scrivi(k, c.value.trim()); });
    });
  });
})();
