/* Cannes Nightlife — small progressive enhancements.
   The site works without this file: all content is in the HTML.
   This only adds: solid header on scroll, open/closed badges (Paris time),
   "today" highlighting, gallery lightbox, mobile booking bar. */
(function () {
  "use strict";

  var lang = (document.documentElement.lang || "fr").slice(0, 2);
  var T = {
    fr: {
      openUntil: "Ouvert · jusqu’à ",
      opensAt: "Fermé · ouvre à ",
      opensDay: function (d, t) { return "Fermé · ouvre " + d + " à " + t; },
      tomorrow: "demain",
      days: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
    },
    en: {
      openUntil: "Open · until ",
      opensAt: "Closed · opens at ",
      opensDay: function (d, t) { return "Closed · opens " + d + " at " + t; },
      tomorrow: "tomorrow",
      days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    }
  }[lang === "en" ? "en" : "fr"];

  /* ---------- Current time in Europe/Paris, whatever the visitor's timezone ---------- */
  function parisNow() {
    var parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Paris",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    }).formatToParts(new Date());
    var map = {};
    parts.forEach(function (p) { map[p.type] = p.value; });
    var day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(map.weekday);
    return { day: day, minutes: parseInt(map.hour, 10) * 60 + parseInt(map.minute, 10) };
  }
  function toMin(hhmm) {
    var p = hhmm.split(":");
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }
  function fmt(min) {
    min = min % 1440;
    var h = Math.floor(min / 60), m = min % 60;
    return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
  }

  var now = parisNow();
  /* Before 5am counts as the previous evening for "tonight" highlighting */
  var nightDay = now.minutes < 300 ? (now.day + 6) % 7 : now.day;

  /* ---------- Open / closed badges ---------- */
  function intervals(hours, day) {
    return (hours[String(day)] || []).map(function (r) {
      var o = toMin(r[0]), c = toMin(r[1]);
      if (c <= o) c += 1440; // closes after midnight
      return [o, c];
    });
  }
  function status(hours) {
    var d = now.day, m = now.minutes, i, list;
    list = intervals(hours, d);
    for (i = 0; i < list.length; i++) {
      if (m >= list[i][0] && m < list[i][1]) return { open: true, text: T.openUntil + fmt(list[i][1]) };
    }
    list = intervals(hours, (d + 6) % 7); // yesterday's late opening
    for (i = 0; i < list.length; i++) {
      if (list[i][1] > 1440 && m < list[i][1] - 1440) return { open: true, text: T.openUntil + fmt(list[i][1]) };
    }
    list = intervals(hours, d);
    for (i = 0; i < list.length; i++) {
      if (list[i][0] > m) return { open: false, text: T.opensAt + fmt(list[i][0]) };
    }
    for (var k = 1; k <= 7; k++) {
      list = intervals(hours, (d + k) % 7);
      if (list.length) {
        var label = k === 1 ? T.tomorrow : T.days[(d + k) % 7];
        return { open: false, text: T.opensDay(label, fmt(list[0][0])) };
      }
    }
    return null;
  }
  document.querySelectorAll("[data-hours]").forEach(function (el) {
    try {
      var s = status(JSON.parse(el.getAttribute("data-hours")));
      if (!s) return;
      el.textContent = s.text;
      el.classList.toggle("is-closed", !s.open);
      el.hidden = false;
    } catch (e) { /* leave hidden */ }
  });

  /* ---------- "Today" highlighting ---------- */
  document.querySelectorAll("[data-day]").forEach(function (el) {
    var scopeIsNight = el.closest("[data-night]") !== null;
    var today = scopeIsNight ? nightDay : now.day;
    if (parseInt(el.getAttribute("data-day"), 10) === today) el.classList.add("is-today");
  });
  var schedule = document.querySelector(".schedule");
  var todayCol = schedule && schedule.querySelector(".is-today");
  if (schedule && todayCol && schedule.scrollWidth > schedule.clientWidth) {
    schedule.scrollLeft = todayCol.offsetLeft - schedule.offsetLeft;
  }

  /* ---------- Header: solid on scroll, solid when mobile menu open ---------- */
  var header = document.querySelector(".site-header");
  var booking = document.querySelector(".mobile-booking");
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-solid", y > 40);
    if (booking) booking.classList.toggle("is-visible", y > window.innerHeight * 0.8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var collapse = document.getElementById("mainNav");
  if (collapse && header) {
    collapse.addEventListener("show.bs.collapse", function () { header.classList.add("is-open"); });
    collapse.addEventListener("hidden.bs.collapse", function () { header.classList.remove("is-open"); });
    collapse.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function () {
        if (window.bootstrap && collapse.classList.contains("show")) {
          window.bootstrap.Collapse.getOrCreateInstance(collapse).hide();
        }
      });
    });
  }

  /* ---------- Gallery lightbox (Bootstrap modal) ---------- */
  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
    var big = lightbox.querySelector("img");
    lightbox.addEventListener("show.bs.modal", function (ev) {
      var btn = ev.relatedTarget;
      var img = btn && btn.querySelector("img");
      if (!img) return;
      big.src = btn.getAttribute("data-full") || img.currentSrc || img.src;
      big.alt = img.alt;
    });
  }
})();
