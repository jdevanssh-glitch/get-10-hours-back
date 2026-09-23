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

  // Class preview player — one large stage + playlist
  var player = document.getElementById("class-player");
  if (player) {
    var items = Array.prototype.slice.call(
      player.querySelectorAll(".playlist-item")
    );
    var frame = document.getElementById("player-frame");
    var poster = document.getElementById("player-poster");
    var posterImg = document.getElementById("player-poster-img");
    var titleEl = document.getElementById("player-title");
    var posEl = document.getElementById("player-pos");
    var ytLink = document.getElementById("player-yt");
    var prevBtn = document.getElementById("player-prev");
    var nextBtn = document.getElementById("player-next");
    var index = 0;
    var playing = false;

    function clipAt(i) {
      var item = items[i];
      return {
        id: item.getAttribute("data-id"),
        title: item.getAttribute("data-title") || item.textContent.trim(),
      };
    }

    function stopEmbed() {
      var iframe = frame.querySelector("iframe");
      if (iframe) iframe.remove();
      poster.hidden = false;
      playing = false;
    }

    function showClip(i, autoplay) {
      if (i < 0) i = items.length - 1;
      if (i >= items.length) i = 0;
      index = i;
      var clip = clipAt(index);

      stopEmbed();
      posterImg.src = "https://i.ytimg.com/vi/" + clip.id + "/hqdefault.jpg";
      poster.setAttribute("aria-label", "Play: " + clip.title);
      titleEl.textContent = clip.title;
      posEl.textContent = String(index + 1);
      ytLink.href = "https://youtube.com/shorts/" + clip.id;
      player.setAttribute("data-index", String(index));

      items.forEach(function (item, n) {
        var on = n === index;
        item.classList.toggle("is-active", on);
        item.setAttribute("aria-selected", on ? "true" : "false");
      });

      if (autoplay) startPlay();
    }

    function startPlay() {
      var clip = clipAt(index);
      stopEmbed();
      poster.hidden = true;

      var iframe = document.createElement("iframe");
      iframe.src =
        "https://www.youtube-nocookie.com/embed/" +
        clip.id +
        "?autoplay=1&playsinline=1&rel=0&modestbranding=1";
      iframe.title = clip.title;
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      frame.appendChild(iframe);
      playing = true;
    }

    poster.addEventListener("click", function () {
      startPlay();
    });

    prevBtn.addEventListener("click", function () {
      showClip(index - 1, playing);
    });

    nextBtn.addEventListener("click", function () {
      showClip(index + 1, playing);
    });

    items.forEach(function (item, n) {
      item.addEventListener("click", function () {
        showClip(n, true);
      });
    });

    player.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        showClip(index - 1, playing);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        showClip(index + 1, playing);
      } else if (e.key === " " || e.key === "Enter") {
        if (document.activeElement === poster || document.activeElement === player) {
          e.preventDefault();
          if (!playing) startPlay();
        }
      }
    });

    showClip(0, false);
  }
})();
