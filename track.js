(function () {
  "use strict";

  var NAMESPACE = "get10hoursback";
  var BASE = "https://abacus.jasoncameron.dev";
  var VALID = { leak: true, price: true, sunday: true, direct: true };

  function getSource() {
    var params = new URLSearchParams(window.location.search);
    var src = (params.get("src") || params.get("from") || "").toLowerCase().trim();
    if (VALID[src]) return src;
    return "direct";
  }

  function sessionKey(src) {
    return "g10_hit_" + src;
  }

  function bumpCounter(src) {
    return fetch(BASE + "/hit/" + NAMESPACE + "/" + src, { mode: "cors" })
      .then(function (r) { return r.json(); })
      .then(function (data) { return data && typeof data.value === "number" ? data.value : null; })
      .catch(function () { return null; });
  }

  function readCounter(src) {
    return fetch(BASE + "/get/" + NAMESPACE + "/" + src, { mode: "cors" })
      .then(function (r) {
        if (!r.ok) return 0;
        return r.json();
      })
      .then(function (data) { return data && typeof data.value === "number" ? data.value : 0; })
      .catch(function () { return 0; });
  }

  function markHit(src) {
    try {
      if (sessionStorage.getItem(sessionKey(src))) return Promise.resolve(null);
      sessionStorage.setItem(sessionKey(src), String(Date.now()));
    } catch (e) {}
    return bumpCounter(src);
  }

  var src = getSource();
  var LABELS = {
    leak: "10-hour tax story",
    price: "Early bird ₹249 story",
    sunday: "Sunday teaser story",
    direct: "Direct / other",
  };
  window.G10_TRACK_SRC = src;

  if (src !== "direct") {
    document.documentElement.setAttribute("data-src", src);
  }

  markHit(src).then(function (count) {
    window.G10_TRACK_COUNT = count;
    var el = document.getElementById("track-src-label");
    if (el && src !== "direct") {
      el.hidden = false;
      el.textContent = "Via: " + src;
    }
  });

  // Google Analytics — marketing template / campaign source
  if (typeof window.G10_gaEvent === "function") {
    window.G10_gaEvent("page_view_source", {
      source: src,
      source_label: LABELS[src] || src,
    });
    if (src !== "direct") {
      window.G10_gaEvent("story_visit", {
        story_id: src,
        story_name: LABELS[src] || src,
      });
    }
  }

  window.G10_fetchCounts = function () {
    return Promise.all(
      ["leak", "price", "sunday", "direct"].map(function (key) {
        return readCounter(key).then(function (count) {
          return { key: key, count: count };
        });
      })
    );
  };
})();
