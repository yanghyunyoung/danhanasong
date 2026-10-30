// 모든 페이지 공용: 틱톡 픽셀, 사업자 정보 바닥글, 가격 표기
(function () {
  const C = window.DHS_CONFIG || {};

  window.won = (n) => "₩" + Number(n).toLocaleString("ko-KR");

  // 광고 유입 기록: 틱톡 인앱 브라우저는 referrer 가 비어 있는 일이 많아
  // 처음 들어온 주소의 광고 값(utm·ttclid 등)을 30일 동안 보관했다가 주문에 붙인다
  const AD_KEY = "dhs_ad_v1";
  const AD_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_adgroup", "utm_content", "campaign", "adgroup", "creative", "ttclid"];
  try {
    const qs = new URLSearchParams(location.search);
    const got = {};
    AD_PARAMS.forEach((k) => { if (qs.get(k)) got[k] = qs.get(k).slice(0, 500); });
    if (Object.keys(got).length) {
      got.landing = location.pathname.split("/").pop() || "index.html";
      got.at = Date.now();
      localStorage.setItem(AD_KEY, JSON.stringify(got));
    }
  } catch (e) {}
  window.dhsAd = function () {
    try {
      const a = JSON.parse(localStorage.getItem(AD_KEY) || "null");
      if (a && Date.now() - a.at < 30 * 864e5) return a;
    } catch (e) {}
    return {};
  };

  // 틱톡 픽셀 (ID가 있을 때만 켠다)
  window.dhsTrack = function () {};
  if (C.tiktokPixelId) {
    !function (w, d, t) {
      w.TiktokAnalyticsObject = t; var ttq = w[t] = w[t] || [];
      ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"];
      ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); }; };
      for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.load = function (e) {
        var n = "https://analytics.tiktok.com/i18n/pixel/events.js";
        ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = n; ttq._t = ttq._t || {}; ttq._t[e] = +new Date();
        var s = d.createElement("script"); s.type = "text/javascript"; s.async = true; s.src = n + "?sdkid=" + e + "&lib=" + t;
        var a = d.getElementsByTagName("script")[0]; a.parentNode.insertBefore(s, a);
      };
      ttq.load(C.tiktokPixelId); ttq.page();
    }(window, document, "ttq");
    window.dhsTrack = function (event, props) { try { window.ttq.track(event, props || {}); } catch (e) {} };
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-brand]").forEach((el) => (el.textContent = C.brand));
    document.querySelectorAll("[data-price]").forEach((el) => (el.textContent = won(C.price)));
    document.querySelectorAll("[data-hours]").forEach((el) => (el.textContent = C.deliveryHours));

    const foot = document.querySelector("[data-foot]");
    if (foot) {
      const b = C.business || {};
      const parts = [
        b.name && "상호 " + b.name,
        b.owner && "대표 " + b.owner,
        b.regNo && "사업자등록번호 " + b.regNo,
        b.mailOrderNo && "통신판매업 " + b.mailOrderNo,
        b.address && b.address,
        C.contactEmail && "문의 " + C.contactEmail,
      ].filter(Boolean);
      foot.innerHTML =
        '<div><a href="terms.html">이용약관</a><a href="privacy.html"><b>개인정보처리방침</b></a></div>' +
        (parts.length ? "<div style='margin-top:10px'>" + parts.join(" · ") + "</div>" : "") +
        "<div style='margin-top:10px'>© " + new Date().getFullYear() + " " + C.brand + "</div>";
    }
  });
})();
