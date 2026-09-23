/* Google Analytics — Get 10 Hours Back */
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag("js", new Date());
gtag("config", "G-GSYMVKM8E5");

window.G10_gaEvent = function (name, params) {
  try {
    gtag("event", name, params || {});
  } catch (e) {}
};
