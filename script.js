(function () {
  "use strict";

  // Early bird ends Tue 30 Sep 2026, 10:00 pm IST (UTC+5:30)
  var EARLY_BIRD_END = new Date("2026-09-30T22:00:00+05:30");
  var CHECKOUT_CLOSE = new Date("2026-10-10T20:00:00+05:30");
  var PAY_URL = "https://pages.razorpay.com/pl_TeneHEkhGOqEzm/view";

  var now = new Date();
  var earlyBird = now < EARLY_BIRD_END;
  var checkoutOpen = now < CHECKOUT_CLOSE;
  var price = earlyBird ? "₹249" : "₹349";

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  setText("hero-price", price);
  setText("sticky-price", price);
  setText("price-display", price);

  var badge = document.getElementById("price-badge");
  var detail = document.getElementById("price-detail");
  var banner = document.getElementById("price-banner");
  var snapshot = document.getElementById("snapshot-price");
  var mobileCta = document.querySelector("#mobile-nav .btn-primary");

  if (!checkoutOpen) {
    if (badge) badge.textContent = "Checkout closed";
    setText("price-display", "Closed");
    setText("hero-price", "Closed");
    setText("sticky-price", "Closed");
    if (detail) detail.textContent = "Checkout closed Sat 10 Oct, 8:00 pm. Reply HOURS on WhatsApp with questions.";
    if (banner) {
      banner.textContent = "Checkout is closed. Message before the deadline for refunds/transfers only.";
      banner.classList.add("late");
    }
    if (snapshot) snapshot.textContent = "Checkout closed";
  } else if (earlyBird) {
    if (badge) badge.textContent = "Early bird";
    if (detail) detail.textContent = "First 15 seats, till Tue 30 Sep, 10:00 pm. Then ₹349.";
    if (banner) banner.textContent = "₹249 for the first 15 seats, till Tue 30 Sep, 10:00 pm.";
    if (snapshot) snapshot.textContent = "₹249 early bird · then ₹349";
    if (mobileCta) mobileCta.textContent = "Book seat — ₹249";
  } else {
    if (badge) badge.textContent = "Standard";
    if (detail) detail.textContent = "Early bird ended. Seat is ₹349. Checkout closes Sat 10 Oct, 8:00 pm.";
    if (banner) {
      banner.textContent = "Early bird closed. Seat is ₹349 until Sat 10 Oct, 8:00 pm.";
      banner.classList.add("late");
    }
    if (snapshot) snapshot.textContent = "₹349";
    if (mobileCta) mobileCta.textContent = "Book seat — ₹349";
  }

  // Mobile nav
  var toggle = document.querySelector(".menu-toggle");
  var mobileNav = document.getElementById("mobile-nav");

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      mobileNav.hidden = open;
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  // Sticky bar after scrolling past the hero CTA
  var sticky = document.getElementById("sticky-bar");
  var hero = document.querySelector(".hero");

  if (sticky && hero) {
    function updateSticky() {
      var heroBottom = hero.getBoundingClientRect().bottom;
      sticky.hidden = heroBottom > 120;
    }
    updateSticky();
    window.addEventListener("scroll", updateSticky, { passive: true });
    window.addEventListener("resize", updateSticky);
  }

  // Guard: if someone bookmarks and checkout is closed, still show pay link
  // but label is clear above. Pay URL stays the same (Razorpay page).
  void PAY_URL;

  // Marketing videos — slide & glide marquee
  var track = document.getElementById("marquee-track");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (track) {
    if (!reduceMotion) {
      track.innerHTML = track.innerHTML + track.innerHTML;
    }

    var videos = track.querySelectorAll("video[data-marketing]");

    function playMuted(video) {
      video.muted = true;
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
      }
    }

    videos.forEach(function (video) {
      playMuted(video);

      video.addEventListener("click", function () {
        var card = video.closest(".video-card");
        var wasUnmuted = !video.muted && !video.paused;

        videos.forEach(function (other) {
          other.controls = false;
          other.muted = true;
          var otherCard = other.closest(".video-card");
          if (otherCard) otherCard.classList.remove("is-active");
          if (other !== video) playMuted(other);
        });

        if (wasUnmuted) {
          playMuted(video);
          return;
        }

        video.muted = false;
        video.controls = true;
        if (card) card.classList.add("is-active");
        video.play().catch(function () {});
      });
    });
  }
})();
