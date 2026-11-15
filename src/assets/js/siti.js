// Apre e chiude il pannello «I siti di Volta la carta»: clic, Esc, clic fuori.
(function () {
  var box = document.querySelector(".siti");
  if (!box) return;
  var bottone = box.querySelector(".siti__apri");
  var pannello = box.querySelector(".siti__pannello");
  function apri(si) {
    bottone.setAttribute("aria-expanded", si ? "true" : "false");
    pannello.hidden = !si;
    document.documentElement.classList.toggle("siti-aperti", si);
    if (si) { var primo = pannello.querySelector("a"); if (primo) primo.focus(); }
  }
  bottone.addEventListener("click", function () { apri(pannello.hidden); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !pannello.hidden) { apri(false); bottone.focus(); }
  });
  document.addEventListener("click", function (e) {
    if (!pannello.hidden && !box.contains(e.target)) apri(false);
  });
  pannello.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (a && a.hash && a.pathname === location.pathname) apri(false);
  });
})();
