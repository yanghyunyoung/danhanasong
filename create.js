// 단하나송 주문 질문 8단계
(function () {
  const C = window.DHS_CONFIG;
  const KEY = "dhs_create_v1";
  const $ = (id) => document.getElementById(id);

  // 입력값은 새로고침해도 남도록 sessionStorage 에 보관한다
  let S = {};
  try { S = JSON.parse(sessionStorage.getItem(KEY) || "{}"); } catch (e) {}
  const save = () => { try { sessionStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

  // 첫 화면에서 기념일·대상을 골라 들어온 경우 미리 채운다
  const qs = new URLSearchParams(location.search);
  if (qs.get("occasion") && !S.occasion) S.occasion = qs.get("occasion");
  if (qs.get("for") && !S.recipient) S.recipient = qs.get("for");
  if (S.step == null) S.step = 0;

  if (!C.orderEndpoint) $("demo").hidden = false;

  const RECIPIENTS = ["아내", "남편", "여자친구", "남자친구", "약혼자", "엄마", "아빠", "할머니", "할아버지", "딸", "아들", "손주", "형제", "자매", "남매", "친구", "선생님", "나 자신", "그 외"];
  const NICKNAMES = ["이름 그대로", "여보", "자기", "당신", "~아 / ~야", "~씨", "엄마", "아빠"];
  const OCCASIONS = ["그냥, 이유 없이", "사랑해서", "생일", "결혼기념일", "연애 기념일", "프러포즈", "결혼식", "환갑·칠순", "졸업", "고마워서", "미안해서", "응원", "그리워서", "보고 싶어서"];
  const GENRES = ["발라드", "어쿠스틱", "트로트", "R&B", "댄스", "인디", "록/밴드", "랩/힙합", "동요", "CCM"];
  const VOCALS = ["남성 보컬", "여성 보컬", "상관없음"];

  const STEPS = [
    {
      title: "누구를 위한 노래인가요?", hint: "이 중에서 하나 골라 주세요.",
      render: (el) => {
        chips(el, RECIPIENTS, "recipient", true);
        // 광고로 바로 이 화면에 들어오는 손님이 많아 첫 단계에서 약관 위치를 알린다
        const p = document.createElement("p");
        p.className = "small-note";
        p.style.marginTop = "28px";
        p.innerHTML = '계속 진행하시면 <a href="terms.html" target="_blank">이용약관</a> 및 <a href="privacy.html" target="_blank">개인정보처리방침</a>을 확인하신 것으로 봐요. 동의는 마지막 단계에서 받아요.';
        el.appendChild(p);
      },
      valid: () => !!S.recipient,
    },
    {
      title: "그분의 이름이 뭐예요?", hint: "노래 가사에 들어갈 이름이에요.",
      render: (el) => {
        input(el, "name", "이름을 적어 주세요", 20);
        note(el, "성함 그대로 적어 주세요. 노래에서 부르는 말은 아래에서 골라요.");
        sublabel(el, "노래에서 어떻게 부를까요?");
        chips(el, NICKNAMES, "nickname");
      },
      valid: () => (S.name || "").trim().length > 0 && !!S.nickname,
    },
    {
      title: "어떤 날을 위한 노래인가요?", hint: "이 중에서 하나 골라 주세요.",
      render: (el) => {
        chips(el, OCCASIONS.concat(["직접 적을게요"]), "occasion", false, (v) => {
          if (v !== "직접 적을게요") { S.occasionText = ""; save(); }
          redraw();
        });
        if (S.occasion === "직접 적을게요") { label(el, "어떤 날인가요?"); input(el, "occasionText", "예: 첫 출근 날", 30); }
      },
      valid: () => !!S.occasion && (S.occasion !== "직접 적을게요" || (S.occasionText || "").trim()),
    },
    {
      title: "어떤 장르가 좋으세요?", hint: "노래 분위기를 골라 주세요.",
      render: (el) => {
        chips(el, GENRES, "genre");
        sublabel(el, "목소리는요?");
        chips(el, VOCALS, "vocal");
      },
      valid: () => !!S.genre && !!S.vocal,
    },
    {
      title: "그분은 어떤 사람인가요?", hint: "성격이나 좋아하는 점을 알려 주세요.", hint2: "한두 문장이면 충분히 좋은 가사가 나와요.",
      render: (el) => { label(el, "그분의 좋은 점", true); textarea(el, "traits", "예: 늘 먼저 웃어 주는 사람. 내가 힘들 때 말없이 옆에 있어 줬어요.", 400); },
      valid: () => (S.traits || "").trim().length >= 5,
    },
    {
      title: "함께한 기억 중\n가장 먼저 떠오르는 건요?", hint: "기억나는 건 뭐든 적어 주세요.", hint2: "장소, 날짜, 그날의 장면이 들어가면 더 좋아요.",
      render: (el) => { label(el, "함께한 특별한 순간", true); textarea(el, "memories", "예: 처음 만난 날 비가 와서 우산 하나를 같이 썼어요.", 600); },
      valid: () => (S.memories || "").trim().length >= 5,
    },
    {
      title: "마지막으로\n전하고 싶은 말이 있나요?", hint: "짧아도 괜찮아요. 없으면 넘어가도 돼요.",
      render: (el) => { label(el, "전하는 말"); textarea(el, "message", "예: 앞으로도 지금처럼 같이 늙어 가자.", 300); },
      valid: () => true,
    },
    {
      title: "주문 내용을 확인해 주세요", hint: "", last: true,
      render: (el) => {
        const p = document.createElement("p");
        p.className = "hint";
        p.innerHTML = "<b></b>님을 위한 노래를 만들기 전에<br>빠진 내용이 없는지 확인해 주세요.";
        p.querySelector("b").textContent = S.name || "";
        el.appendChild(p);

        const sum = card(el, "🎵 주문 내용", "");
        const edit = document.createElement("button");
        edit.className = "edit"; edit.textContent = "✎ 고치기"; edit.onclick = () => go(0);
        sum.querySelector("h3").appendChild(edit);
        row(sum, "받는 분", `${S.name} (${S.recipient}, 노래에선 '${S.nickname}')`);
        row(sum, "어떤 날", occasionLabel());
        row(sum, "장르", `${S.genre} · ${S.vocal}`);
        longRow(sum, "그분의 좋은 점", S.traits);
        longRow(sum, "함께한 기억", S.memories);
        if ((S.message || "").trim()) longRow(sum, "전하는 말", S.message);

        const contact = card(el, "이메일 주소", "노래가 완성되면 여기로 보내 드려요.");
        input(contact, "email", "you@email.com", 80, "email").style.textAlign = "left";
        const pl = document.createElement("div");
        pl.className = "desc"; pl.style.margin = "14px 0 8px"; pl.textContent = "휴대폰 번호 (선택) — 문자로도 알려 드려요";
        contact.appendChild(pl);
        input(contact, "phone", "010-0000-0000", 13, "tel").style.textAlign = "left";

        const price = document.createElement("div");
        price.className = "price-box";
        price.innerHTML = "<span>노래 한 곡</span><b></b>";
        price.querySelector("b").textContent = won(C.price);
        el.appendChild(price);

        const ag = document.createElement("label");
        ag.className = "agree";
        ag.innerHTML = '<input type="checkbox" id="agree"><span><a href="terms.html" target="_blank">이용약관</a>과 <a href="privacy.html" target="_blank">개인정보 수집·이용</a>에 동의해요. (이메일·휴대폰 번호는 노래 전달에만 써요)</span>';
        el.appendChild(ag);
        const cb = ag.querySelector("input");
        cb.checked = !!S.agree;
        cb.onchange = () => { S.agree = cb.checked; save(); refreshNext(); };

        const err = document.createElement("div");
        err.className = "err"; err.id = "err";
        el.appendChild(err);
      },
      valid: () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((S.email || "").trim()) && !!S.agree,
    },
  ];

  // ---------- 화면 조각 ----------
  function chips(el, list, key, autoNext, onPick) {
    const box = document.createElement("div");
    box.className = "chips";
    list.forEach((v) => {
      const b = document.createElement("button");
      b.className = "chip" + (S[key] === v ? " on" : "");
      b.textContent = v;
      b.onclick = () => {
        S[key] = v; save();
        box.querySelectorAll(".chip").forEach((c) => c.classList.toggle("on", c === b));
        refreshNext();
        if (onPick) onPick(v);
        if (autoNext) setTimeout(() => go(S.step + 1), 220);
      };
      box.appendChild(b);
    });
    el.appendChild(box);
  }
  function input(el, key, ph, max, type) {
    const i = document.createElement("input");
    i.className = "input"; i.placeholder = ph; i.maxLength = max; i.type = type || "text";
    i.value = S[key] || "";
    if (type === "email") i.autocomplete = "email";
    if (type === "tel") { i.autocomplete = "tel"; i.inputMode = "tel"; }
    i.oninput = () => { S[key] = i.value; save(); refreshNext(); };
    el.appendChild(i);
    return i;
  }
  function textarea(el, key, ph, max) {
    const t = document.createElement("textarea");
    t.className = "textarea"; t.placeholder = ph; t.maxLength = max; t.value = S[key] || "";
    const c = document.createElement("div");
    c.className = "count";
    const upd = () => (c.textContent = `${t.value.length} / ${max}`);
    t.oninput = () => { S[key] = t.value; save(); upd(); refreshNext(); };
    upd();
    el.appendChild(t); el.appendChild(c);
  }
  function label(el, text, req) {
    const l = document.createElement("label");
    l.className = "lbl"; l.textContent = text;
    if (req) { const r = document.createElement("span"); r.className = "req"; r.textContent = " *"; l.appendChild(r); }
    el.appendChild(l);
  }
  function sublabel(el, text) { const d = document.createElement("div"); d.className = "sublabel"; d.textContent = text; el.appendChild(d); }
  function note(el, text) { const d = document.createElement("div"); d.className = "small-note"; d.textContent = text; el.appendChild(d); }
  function card(el, title, desc) {
    const c = document.createElement("div"); c.className = "card";
    const h = document.createElement("h3"); h.textContent = title; c.appendChild(h);
    if (desc) { const d = document.createElement("p"); d.className = "desc"; d.textContent = desc; c.appendChild(d); }
    el.appendChild(c); return c;
  }
  function row(el, k, v) {
    const r = document.createElement("div"); r.className = "summary-row";
    const a = document.createElement("span"); a.textContent = k;
    const b = document.createElement("b"); b.textContent = v;
    r.append(a, b); el.appendChild(r);
  }
  function longRow(el, k, v) {
    const r = document.createElement("div"); r.className = "summary-long";
    const a = document.createElement("span"); a.textContent = k;
    const p = document.createElement("p"); p.textContent = v;
    r.append(a, p); el.appendChild(r);
  }
  const occasionLabel = () => (S.occasion === "직접 적을게요" ? S.occasionText : S.occasion);

  // ---------- 진행 ----------
  function refreshNext() {
    const st = STEPS[S.step];
    $("next").disabled = !st.valid();
  }
  function redraw() {
    const st = STEPS[S.step], n = STEPS.length;
    const pct = Math.round(((S.step + 1) / n) * 100);
    $("stepText").textContent = st.last ? "마지막 단계" : `${n}단계 중 ${S.step + 1}단계`;
    $("pctText").textContent = `${pct}% 완료`;
    $("bar").style.width = pct + "%";

    const el = document.createElement("section");
    el.className = "q";
    const h = document.createElement("h2"); h.innerText = st.title; el.appendChild(h);
    if (st.hint) { const p = document.createElement("p"); p.className = "hint"; p.textContent = st.hint; el.appendChild(p); }
    if (st.hint2) { const p = document.createElement("p"); p.className = "hint2"; p.textContent = st.hint2; el.appendChild(p); }
    st.render(el);
    $("screen").replaceChildren(el);

    $("prev").style.visibility = S.step === 0 ? "hidden" : "visible";
    $("next").textContent = st.last ? "주문하기 →" : "다음 →";
    refreshNext();
  }
  function go(i) {
    if (i < 0) { location.href = "./"; return; }
    if (i >= STEPS.length) return;
    S.step = i; save();
    window.scrollTo(0, 0);
    redraw();
  }

  $("prev").onclick = () => go(S.step - 1);
  $("topBack").onclick = () => go(S.step - 1);
  $("next").onclick = () => {
    if (!STEPS[S.step].valid()) return;
    if (STEPS[S.step].last) submit();
    else go(S.step + 1);
  };

  // ---------- 주문 보내기 ----------
  function makeOrderId() {
    const d = new Date();
    const ymd = String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0");
    const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `DH${ymd}-${rnd}`;
  }

  async function submit() {
    const btn = $("next");
    btn.disabled = true; btn.textContent = "보내는 중…";
    const ad = dhsAd();
    const source = [ad.utm_source, ad.utm_campaign || ad.campaign, ad.utm_adgroup || ad.adgroup, ad.creative, ad.utm_content, ad.landing]
      .filter(Boolean).join(" | ") || document.referrer || "";
    const order = {
      orderId: makeOrderId(),
      createdAt: new Date().toISOString(),
      recipient: S.recipient, name: S.name.trim(), nickname: S.nickname,
      occasion: occasionLabel(), genre: S.genre, vocal: S.vocal,
      traits: S.traits.trim(), memories: S.memories.trim(), message: (S.message || "").trim(),
      email: S.email.trim(), phone: (S.phone || "").trim(),
      price: C.price, source, ttclid: ad.ttclid || "", ua: navigator.userAgent.slice(0, 200),
    };
    try {
      if (C.orderEndpoint) {
        // text/plain 으로 보내면 앱스 스크립트가 CORS 사전요청 없이 받는다
        await fetch(C.orderEndpoint, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action: "order", order }) });
      } else {
        const list = JSON.parse(localStorage.getItem("dhs_demo_orders") || "[]");
        list.push(order); localStorage.setItem("dhs_demo_orders", JSON.stringify(list));
      }
      dhsTrack("SubmitForm", { content_name: "song_order", value: C.price, currency: "KRW" });
      sessionStorage.setItem("dhs_last_order", JSON.stringify({ orderId: order.orderId, name: order.name, email: order.email }));
      sessionStorage.removeItem(KEY);
      location.href = "done.html";
    } catch (e) {
      $("err").textContent = "보내지 못했어요. 인터넷 연결을 확인하고 다시 눌러 주세요.";
      btn.disabled = false; btn.textContent = "주문하기 →";
    }
  }

  if (S.step >= STEPS.length) S.step = 0;
  // 첫 질문을 미리 골라 들어왔으면 다음 질문부터
  if (S.step === 0 && S.recipient && qs.get("for")) S.step = 1;
  redraw();
})();
