(function () {
  var root = document.documentElement;


  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Typewriter line in the hero
  var typed = document.getElementById("typed");
  if (typed && !reduce) {
    var phrases = ["clear business requirements.", "evidence-based business cases.", "practical digital health solutions.", "process maps teams can act on."];
    var pi = 0, ci = 0, erasing = false;
    typed.textContent = "";
    (function tick() {
      var text = phrases[pi];
      if (!erasing) {
        ci++;
        typed.textContent = text.slice(0, ci);
        if (ci === text.length) { erasing = true; return setTimeout(tick, 1900); }
        setTimeout(tick, 55);
      } else {
        ci--;
        typed.textContent = text.slice(0, ci);
        if (ci === 0) { erasing = false; pi = (pi + 1) % phrases.length; return setTimeout(tick, 380); }
        setTimeout(tick, 28);
      }
    })();
  }

  // Reveal sections as they scroll into view
  var items = document.querySelectorAll(".section-title, .section-intro, .case, .timeline li, .skill-card, .cred, .narrow p, .cv-inner, .contact-grid > *");
  document.querySelectorAll(".flow").forEach(function (ol) {
    ol.querySelectorAll("li").forEach(function (li, n) { li.style.setProperty("--i", n); });
  });
  if ("IntersectionObserver" in window && !reduce) {
    var rv = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); rv.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { el.classList.add("reveal"); rv.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("reveal", "in"); });
  }

  // Day and night theme
  var themeBtn = document.getElementById("theme");
  function syncTheme() {
    var dark = root.getAttribute("data-theme") === "dark";
    themeBtn.setAttribute("aria-pressed", dark ? "true" : "false");
    themeBtn.setAttribute("aria-label", dark ? "Switch to day theme" : "Switch to night theme");
  }
  themeBtn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    syncTheme();
  });
  syncTheme();

  // Mobile menu
  var menuBtn = document.getElementById("menu");
  var nav = document.getElementById("nav");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
  nav.addEventListener("click", function (e) { if (e.target.tagName === "A") setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  // Highlight the current section in the navigation
  var links = nav.querySelectorAll("a");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id);
          });
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    links.forEach(function (a) {
      var s = document.querySelector(a.getAttribute("href"));
      if (s) io.observe(s);
    });
  }

  // Contact form (Formspree). Falls back to a normal form post if JavaScript fails.
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  form.addEventListener("submit", function (e) {
    if (!window.fetch) return;
    e.preventDefault();
    status.className = "status";
    status.textContent = "Sending...";
    fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
      .then(function (r) {
        if (r.ok) {
          form.reset();
          status.className = "status ok";
          status.textContent = "Thank you. Your message has been sent.";
        } else {
          throw new Error("failed");
        }
      })
      .catch(function () {
        status.className = "status err";
        status.textContent = "The message did not send. Please email topejoko@gmail.com instead.";
      });
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
