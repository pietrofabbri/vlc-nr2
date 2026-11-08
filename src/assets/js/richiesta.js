// Moduli che preparano un'email: richiesta di un libro, proposta di pubblicazione.
// Niente carrello e niente server: il modulo compone oggetto e testo, poi la persona sceglie
// come spedirla (programma di posta, Gmail) oppure copia il testo. L'indirizzo non è scritto
// nell'HTML: si ricava al momento da data-v, come in contatti.js.
(function () {
  function decodifica(v) {
    var s = atob(v);
    var b = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) b[i] = s.charCodeAt(i);
    return new TextDecoder().decode(b).split("").reverse().join("");
  }

  function valore(campo) {
    if (campo.type === "radio") return campo.checked ? campo.value : null;
    if (campo.type === "checkbox") return campo.checked ? "sì" : null;
    return campo.value.trim();
  }

  function componi(form) {
    var righe = [];
    if (form.dataset.intro) righe.push(form.dataset.intro, "");
    form.querySelectorAll("[data-etichetta]").forEach(function (campo) {
      if (campo.closest("[hidden]")) return;
      var v = valore(campo);
      if (v) righe.push(campo.dataset.etichetta + ": " + v);
    });
    if (form.dataset.prezzo) {
      var copie = parseInt(form.querySelector("[name=copie]").value, 10) || 1;
      var tot = copie * Number(form.dataset.prezzo);
      righe.push("Prezzo dei libri: " + copie + " × " + euro(Number(form.dataset.prezzo)) + " = " + euro(tot) + " (spedizione esclusa)");
    }
    if (form.dataset.chiusura) righe.push("", form.dataset.chiusura);
    righe.push("", "Grazie");
    return righe.join("\n");
  }

  function euro(n) {
    return (Number.isInteger(n) ? String(n) : n.toFixed(2).replace(".", ",")) + " €";
  }

  function aggiornaVisibili(form) {
    form.querySelectorAll("[data-se]").forEach(function (blocco) {
      var parti = blocco.dataset.se.split("=");
      var scelto = form.querySelector('[name="' + parti[0] + '"]:checked');
      var vis = !!scelto && scelto.value === parti[1];
      blocco.hidden = !vis;
      blocco.querySelectorAll("input, textarea, select").forEach(function (c) { c.required = vis && c.dataset.obbligatorio === "si"; });
    });
    var stima = form.querySelector("[data-stima]");
    if (stima && form.dataset.prezzo) {
      var copie = parseInt(form.querySelector("[name=copie]").value, 10) || 1;
      stima.textContent = copie === 1 ? euro(Number(form.dataset.prezzo)) : copie + " copie: " + euro(copie * Number(form.dataset.prezzo));
    }
  }

  function prepara(form) {
    var email = decodifica(form.dataset.v);
    var oggetto = form.dataset.oggetto;
    var testo = componi(form);
    var esito = form.querySelector(".richiesta__pronta");
    esito.hidden = false;
    esito.querySelector("[data-anteprima]").textContent = testo;
    esito.querySelector("[data-indirizzo]").textContent = email;
    esito.querySelector("[data-posta]").href = "mailto:" + email + "?subject=" + encodeURIComponent(oggetto) + "&body=" + encodeURIComponent(testo);
    esito.querySelector("[data-gmail]").href = "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(email) +
      "&su=" + encodeURIComponent(oggetto) + "&body=" + encodeURIComponent(testo);
    esito.querySelector("[data-copia]").onclick = function () {
      var b = this;
      var tutto = "A: " + email + "\nOggetto: " + oggetto + "\n\n" + testo;
      (navigator.clipboard ? navigator.clipboard.writeText(tutto) : Promise.reject()).then(function () {
        b.textContent = "Copiato";
        setTimeout(function () { b.textContent = "Copi il testo"; }, 2000);
      }, function () {
        b.textContent = "Selezioni il testo qui sopra e lo copi";
      });
    };
    esito.scrollIntoView({ behavior: "smooth", block: "nearest" });
    esito.querySelector("[data-posta]").focus({ preventScroll: true });
  }

  document.querySelectorAll("form[data-richiesta]").forEach(function (form) {
    form.addEventListener("change", function () { aggiornaVisibili(form); });
    form.addEventListener("input", function () { aggiornaVisibili(form); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      prepara(form);
    });
    aggiornaVisibili(form);
  });

  // Pulsanti «Copia» semplici (per esempio la citazione del libro)
  document.querySelectorAll("[data-copia-da]").forEach(function (b) {
    b.addEventListener("click", function () {
      var t = document.getElementById(b.dataset.copiaDa).textContent.trim();
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () {
        var prima = b.textContent;
        b.textContent = "Copiata";
        setTimeout(function () { b.textContent = prima; }, 2000);
      }, function () {});
    });
  });
})();
