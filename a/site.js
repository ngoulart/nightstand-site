// NightStand's public pages: what moves. It runs after the look script lifted
// from the dashboard (C, seeded, squiggle, the grain, #paper and #sticker), and
// adds the rest: torn edges, scalloped badges, the halo behind a title, the
// tape, words that light up, the story's phone, the film, the example night,
// the six tests playing themselves, and the study's live counts. Every loop
// stops off screen, and under prefers-reduced-motion each piece shows its
// final state instead.
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const API = document.body.dataset.api;

  // One scroll listener, one frame.
  const scrollers = [];
  let queued = false;
  const frame = () => { queued = false; scrollers.forEach((f) => f()); };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(frame); } };
  const onScroll = (f) => { scrollers.push(f); f(); };
  addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", queue);

  /** Calls `enter` when `el` comes on screen and `leave` when it goes. */
  const whileVisible = (el, enter, leave, margin = "0px") =>
    new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? enter() : leave && leave())), { rootMargin: margin }).observe(el);

  // ---------- the look: torn edges, badges, glyphs, stickers ----------
  function tear(el, depth, seed) {
    const cut = () => {
      const w = el.offsetWidth, h = el.offsetHeight, r = seeded(seed), pts = [[0, depth / 2]];
      let x = 0;
      while (x < w) { x = Math.min(w, x + 6 + r() * 9); pts.push([x, r() * depth]); }
      pts.push([w, h - depth / 2]);
      while (x > 0) { x = Math.max(0, x - 6 - r() * 9); pts.push([x, h - r() * depth]); }
      el.style.clipPath = `polygon(${pts.map(([a, b]) => `${a.toFixed(1)}px ${b.toFixed(1)}px`).join(",")})`;
    };
    new ResizeObserver(cut).observe(el);
  }
  $$(".torn").forEach((el, k) => { if (el.id !== "paper") tear(el, +el.dataset.depth || 7, 31 + k); });

  let scallop = "";
  for (let k = 0; k <= 96; k++) {
    const a = k / 96 * 2 * Math.PI, r = 46 * (1 + 0.09 * Math.sin(8 * a)) / 1.09;
    scallop += (k ? "L" : "M") + (50 + r * Math.cos(a)).toFixed(1) + " " + (50 + r * Math.sin(a)).toFixed(1);
  }
  const INK = C.page;
  const GLYPHS = {
    bolt: `<path d="M13 3L6 13.5h5L10 21l8-11h-5.5z" fill="${INK}" stroke="none"/>`,
    grid: `<path d="M5 5h3.4v3.4H5zM10.3 5h3.4v3.4h-3.4zM15.6 5H19v3.4h-3.4zM5 10.3h3.4v3.4H5zM10.3 10.3h3.4v3.4h-3.4zM15.6 10.3H19v3.4h-3.4zM5 15.6h3.4V19H5zM10.3 15.6h3.4V19h-3.4zM15.6 15.6H19V19h-3.4z" fill="${INK}" stroke="none"/>`,
    back: `<rect x="4" y="8" width="11" height="12" rx="2"/><path d="M9 4h9a2 2 0 0 1 2 2v10"/>`,
    go: `<circle cx="8" cy="12" r="4.4"/><rect x="15" y="8.4" width="6.6" height="7.2" rx="1"/>`,
    seq: `<circle cx="8" cy="8" r="2.7" fill="${INK}" stroke="none"/><circle cx="16" cy="8" r="2.7" fill="${INK}" stroke="none"/><circle cx="8" cy="16" r="2.7" fill="${INK}" stroke="none"/><circle cx="16" cy="16" r="2.7"/>`,
    colors: `<circle cx="9" cy="9.5" r="5"/><circle cx="15" cy="9.5" r="5"/><circle cx="12" cy="15" r="5"/>`,
    phone: `<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 18h2"/>`,
    eye: `<path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z"/><circle cx="12" cy="12" r="2.4"/><path d="M4.5 4.5l15 15"/>`,
    pin: `<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2"/>`,
    out: `<path d="M12 15V4M8 8l4-4 4 4M5 13v6h14v-6"/>`,
    arrow: `<path d="M4 12h15M13 6l6 6-6 6"/>`,
    moon: `<path d="M19 14.5A8 8 0 1 1 9.5 5a6.5 6.5 0 0 0 9.5 9.5z"/>`,
    sun: `<circle cx="12" cy="12" r="3.6"/><path d="M12 3v2.4M12 18.6V21M3 12h2.4M18.6 12H21M5.6 5.6l1.7 1.7M16.7 16.7l1.7 1.7M5.6 18.4l1.7-1.7M16.7 7.3l1.7-1.7"/>`,
    bell: `<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zM10 21h4"/>`,
    heart: `<path d="M12 20s-7-4.4-7-9.5A4 4 0 0 1 12 8a4 4 0 0 1 7 2.5C19 15.6 12 20 12 20z"/>`,
    wave: `<path d="M3 12h3l2-6 4 12 3-9 2 3h4"/>`,
    mail: `<rect x="3.5" y="6" width="17" height="12" rx="2"/><path d="M4.5 8l7.5 6 7.5-6"/>`,
    stop: `<path d="M6 6l12 12M18 6L6 18"/>`,
    trash: `<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/>`,
    check: `<path d="M5 12.5l4.5 4.5L19 7.5"/>`,
    chart: `<path d="M5 20V11M12 20V4M19 20v-7"/>`,
  };
  $$(".badge").forEach((b) => {
    if (!b.children.length && b.textContent.trim()) b.innerHTML = `<span>${b.textContent.trim()}</span>`;
    b.insertAdjacentHTML("afterbegin", `<svg class="scallop" viewBox="0 0 100 100" aria-hidden="true"><path d="${scallop}Z"/></svg>`);
    if (b.dataset.glyph) b.insertAdjacentHTML("beforeend", `<svg class="glyph" viewBox="0 0 24 24" aria-hidden="true">${GLYPHS[b.dataset.glyph]}</svg>`);
  });
  $$("[data-squiggle]").forEach((el) => { el.outerHTML = squiggle(C[el.dataset.squiggle]); });
  const moon = $("#sticker").innerHTML;
  $$("[data-sticker]").forEach((el) => { el.innerHTML = moon.replace('class="sticker"', `class="${el.dataset.sticker}"`); });

  // ---------- navigation ----------
  const menu = $(".menu"), links = $(".links");
  const shut = () => { links.classList.remove("open"); menu.setAttribute("aria-expanded", "false"); };
  menu.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.setAttribute("aria-expanded", String(links.classList.toggle("open")));
  });
  document.addEventListener("click", shut);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") shut(); });

  // ---------- reveal on scroll ----------
  const seen = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); seen.unobserve(e.target); }
  }), { rootMargin: "0px 0px -8% 0px" });
  $$("[data-reveal], .scribble").forEach((el) => seen.observe(el));

  // ---------- values that count up when they come on screen ----------
  $$("[data-count]").forEach((el) => {
    if (reduce) return;
    const parts = el.textContent.split(/(\d+)/);
    const draw = (p) => { el.textContent = parts.map((s, k) => (k % 2 ? String(Math.round(s * p)).padStart(s[0] === "0" ? s.length : 0, "0") : s)).join(""); };
    draw(0);
    const once = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting) return;
      once.disconnect();
      const t0 = performance.now();
      const tick = (now) => { const p = clamp((now - t0) / 1100, 0, 1); draw(1 - (1 - p) ** 3); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, { rootMargin: "0px 0px -10% 0px" });
    once.observe(el);
  });

  // ---------- the halo: rings of dots lit like a moon in its phases ----------
  $$(".halo").forEach((cv) => {
    const ctx = cv.getContext("2d"), rings = [], t0 = performance.now();
    let w = 0, h = 0, raf = 0;
    const size = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rings.length = 0;
      const reach = Math.min(Math.max(w, 620) * 0.56, h * 0.8);
      for (let k = 0; k < 10; k++) rings.push({ k, r: reach * (0.3 + 0.7 * k / 9), n: Math.round(16 + k * 5.5), dot: 2 + k * 0.72 });
      draw(performance.now());
    };
    const draw = (now) => {
      const t = (now - t0) / 1000, cx = w / 2, cy = h * 0.5, light = t * 0.28;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#c9d6e2";
      for (const g of rings) {
        const turn = (g.k % 2 ? 1 : -1) * t * 0.035 + g.k * 0.4;
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.15 - g.k * 0.6);
        const r = g.r * (1 + 0.025 * Math.sin(t * 0.9 - g.k * 0.5));
        for (let i = 0; i < g.n; i++) {
          const a = turn + i / g.n * 2 * Math.PI, lit = 0.5 + 0.5 * Math.cos(a - light);
          ctx.globalAlpha = (0.1 + 0.34 * pulse) * (0.25 + 0.75 * lit);
          ctx.beginPath();
          ctx.arc(cx + r * Math.cos(a), cy + r * Math.sin(a) * 0.94, g.dot * (0.8 + 0.35 * pulse), 0, 6.3);
          ctx.fill();
        }
      }
    };
    const loop = (now) => { draw(now); raf = requestAnimationFrame(loop); };
    new ResizeObserver(size).observe(cv);
    if (!reduce) whileVisible(cv, () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); }, () => cancelAnimationFrame(raf));
  });

  // ---------- the tape: enough copies to run without a seam ----------
  $$(".tape .run").forEach((run) => {
    const once = run.innerHTML;
    for (let k = 0; k < 10 && run.scrollWidth < innerWidth * 1.3; k++) run.insertAdjacentHTML("beforeend", once);
    run.insertAdjacentHTML("beforeend", run.innerHTML);
  });

  // ---------- the statement: each word lights up as it passes ----------
  $$("[data-words]").forEach((p) => {
    const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    let html = "";
    p.childNodes.forEach((n) => {
      const cls = n.nodeType === 1 ? "w y" : "w";
      n.textContent.split(/(\s+)/).forEach((tok) => { html += tok.trim() ? `<span class="${cls}">${esc(tok)}</span>` : tok; });
    });
    p.innerHTML = html;
    const words = $$(".w", p);
    let lit = -1;
    if (reduce) return;
    onScroll(() => {
      const box = p.getBoundingClientRect(), vh = innerHeight;
      const n = Math.round(clamp((vh * 0.88 - box.top) / (box.height + vh * 0.4), 0, 1) * words.length);
      if (n === lit) return;
      lit = n;
      words.forEach((w, k) => w.classList.toggle("on", k < n));
    });
  });

  // ---------- the story: the step at mid-screen sets the phone ----------
  const rig = $(".rig");
  if (rig) {
    const steps = $$(".story .step"), shots = $$(".phone img", rig);
    const set = (k) => {
      rig.dataset.step = k;
      steps.forEach((s, j) => s.classList.toggle("on", j === k));
      shots.forEach((im, j) => im.classList.toggle("on", j === k));
    };
    const mid = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) set(steps.indexOf(e.target)); }),
      { rootMargin: "-49% 0px -49% 0px" });
    steps.forEach((s) => mid.observe(s));
    set(0);
  }

  // ---------- the film: it plays silently in a loop while on screen, and ----------
  // ---------- from the start with sound when asked ----------
  const reel = $(".reel");
  if (reel) {
    const video = $("video", reel);
    const quiet = () => {
      video.muted = true; video.loop = true; video.controls = false;
      reel.classList.remove("playing");
      video.play().then(() => reel.classList.add("silent"), () => reel.classList.remove("silent"));
    };
    const aloud = () => {
      video.muted = false; video.loop = false; video.controls = true; video.currentTime = 0;
      reel.classList.remove("silent");
      reel.classList.add("playing");
      video.play();
    };
    $(".play", reel).addEventListener("click", aloud);
    $(".sound", reel).addEventListener("click", aloud);
    video.addEventListener("ended", () => {
      if (!reduce) return quiet();
      video.controls = false; reel.classList.remove("playing"); video.load();
    });
    if (!reduce) whileVisible(reel, () => { if (!reel.classList.contains("playing")) quiet(); },
      () => { if (!reel.classList.contains("playing")) video.pause(); });
  }

  // ---------- the example night: movement in, a night out ----------
  // Minutes run from 9:00 PM. The night is the one on the Today screen: still
  // from 11:00 PM to 5:41 AM, picked up at 2:00 AM (3 min) and 4:30 AM (4 min),
  // 6 h 34 min measured, against a guess of 7 h 15 min from 11:30 PM.
  const night = $("#night");
  if (night) {
    const SPAN = 660, START = 120, END = 521, BREAKS = [[300, 3], [450, 4]], GUESS = [150, 585], SWEEP = 11000;
    const rnd = seeded(23);
    let bars = "";
    for (let m = 0; m < SPAN; m += 5) {
      const awake = m < START || m >= END - 1, picked = BREAKS.some(([b]) => m === b);
      let v = awake ? 0.22 + rnd() * 0.78 : picked ? 0.5 + rnd() * 0.2 : 0.015 + rnd() * 0.03;
      if (m >= START - 15 && m < START) v *= 0.4;
      bars += `<rect x="${m + 0.8}" y="${(100 - v * 96).toFixed(1)}" width="3.4" height="${(v * 96).toFixed(1)}"/>`;
    }
    $(".mv", night).innerHTML = `<defs><clipPath id="swept"><rect id="nd-clip" x="0" y="0" width="0" height="100"/></clipPath></defs>` +
      `<g fill="${C.raised}">${bars}</g><g fill="${C.ink}" clip-path="url(#swept)">${bars}</g>`;
    $(".nt", night).innerHTML = `<rect id="nd-guess" x="${GUESS[0]}" y="4" width="0" height="7" fill="${C.yellow}"/>` +
      `<rect x="0" y="18" width="${SPAN}" height="36" fill="${C.raised}"/>` +
      `<rect id="nd-asleep" x="${START}" y="18" width="0" height="36" fill="${C.sky}"/>` +
      BREAKS.map(([b, d]) => `<rect class="nd-break" x="${b}" y="14" width="${d + 1}" height="44" fill="${C.pink}" opacity="0"/>`).join("");
    const clip = $("#nd-clip", night), asleep = $("#nd-asleep", night), guess = $("#nd-guess", night), breaks = $$(".nd-break", night);
    const head = $(".head", night), total = $("#nd-total"), clock = $("#nd-clock"), say = $("#nd-say");
    const LINES = [
      [0, "<b>9:00 PM.</b> The phone is in your hand, so it moves."],
      [START, "<b>11:00 PM.</b> The phone lies still. The night starts."],
      [BREAKS[0][0], "<b>2:00 AM.</b> Picked up for 3 minutes. That is an interruption, taken off the night."],
      [BREAKS[0][0] + 40, "Still again. The night goes on."],
      [BREAKS[1][0], "<b>4:30 AM.</b> Picked up for 4 minutes. A second interruption."],
      [BREAKS[1][0] + 40, "Still again."],
      [END, "<b>5:41 AM.</b> The phone moves again. The night ends."],
    ];
    const LAST = "<b>You guessed 7h 15m.</b> That is 41 min more than the 6h 34m measured.";
    const hhmm = (m) => {
      const t = (21 * 60 + Math.round(m)) % 1440, h = Math.floor(t / 60), mm = String(t % 60).padStart(2, "0");
      return `${h % 12 || 12}:${mm} ${h < 12 ? "AM" : "PM"}`;
    };
    let line = -1, raf = 0;
    const paint = (m, guessed) => {
      clip.setAttribute("width", m);
      asleep.setAttribute("width", clamp(m, START, END) - START);
      breaks.forEach((r, k) => r.setAttribute("opacity", m >= BREAKS[k][0] ? 1 : 0));
      guess.setAttribute("width", (GUESS[1] - GUESS[0]) * guessed);
      head.style.left = (m / SPAN * 100) + "%";
      head.style.opacity = m >= SPAN ? 0 : 1;
      const slept = clamp(m, START, END) - START - BREAKS.reduce((s, [b, d]) => s + clamp(m - b, 0, d), 0);
      total.textContent = `${Math.floor(slept / 60)}h ${String(Math.floor(slept % 60)).padStart(2, "0")}m`;
      clock.textContent = hhmm(Math.min(m, SPAN));
      const k = guessed > 0 ? LINES.length : LINES.reduce((at, [from], j) => (m >= from ? j : at), 0);
      if (k !== line) { line = k; say.innerHTML = k === LINES.length ? LAST : LINES[k][1]; }
    };
    const play = () => {
      cancelAnimationFrame(raf);
      const t0 = performance.now();
      const tick = (now) => {
        const t = now - t0;
        paint(clamp(t / SWEEP * SPAN, 0, SPAN), clamp((t - SWEEP - 500) / 900, 0, 1));
        if (t < SWEEP + 1500) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    $("#nd-replay").addEventListener("click", play);
    if (reduce) paint(SPAN, 1);
    else {
      paint(0, 0);
      let played = false;
      whileVisible(night, () => { if (!played) { played = true; play(); } }, null, "0px 0px -25% 0px");
    }
  }

  // ---------- the six tests, each playing itself ----------
  const DEMOS = {
    pvt(el) {
      el.innerHTML = `<span class="num wait">0000</span><span class="chip">283 ms</span>`;
      const num = $(".num", el), chip = $(".chip", el);
      return (t) => {
        const k = t % 40;
        if (k < 12) { num.textContent = "0000"; num.className = "num wait"; chip.classList.remove("on"); }
        else if (k < 15) { num.className = "num"; num.textContent = String((k - 11) * 94).padStart(4, "0"); }
        else { num.textContent = "0283"; chip.classList.add("on"); }
      };
    },
    dsst(el) {
      const marks = ["◆", "▲", "●"];
      el.innerHTML = `<div class="keys">${marks.map((m, k) => `<span><b>${m}</b>${k + 1}</span>`).join("")}</div><span class="glyph-big"></span>`;
      const keys = $$(".keys span", el), big = $(".glyph-big", el), order = [1, 0, 2, 1, 2, 0];
      return (t) => {
        const which = order[Math.floor(t / 9) % order.length], k = t % 9;
        big.textContent = marks[which];
        keys.forEach((key, j) => key.classList.toggle("on", j === which && k >= 4));
      };
    },
    nback(el) {
      el.innerHTML = `<span class="letter"></span><span class="chip">Match</span>`;
      const letter = $(".letter", el), chip = $(".chip", el), seq = "KTKRBRMHM";
      return (t) => {
        const at = Math.floor(t / 8) % seq.length, k = t % 8;
        letter.textContent = k < 6 ? seq[at] : "";
        chip.classList.toggle("on", at >= 2 && seq[at] === seq[at - 2] && k >= 2 && k < 6);
      };
    },
    gonogo(el) {
      el.innerHTML = `<span class="shape"></span><span class="chip"></span>`;
      const shape = $(".shape", el), chip = $(".chip", el), seq = [1, 1, 0, 1, 0, 1, 1];
      return (t) => {
        const go = seq[Math.floor(t / 9) % seq.length], k = t % 9;
        shape.style.visibility = k < 6 ? "visible" : "hidden";
        shape.className = "shape" + (go ? "" : " no") + (go && k >= 2 && k < 4 ? " tap" : "");
        chip.textContent = go ? "Tap" : "Do not tap";
        chip.classList.toggle("on", k >= 2 && k < 6);
      };
    },
    simon(el) {
      el.innerHTML = `<div class="pads"><i></i><i></i><i></i><i></i></div>`;
      const pads = $$(".pads i", el), seq = [0, 3, 1, 2], plan = [];
      for (let n = 1; n <= seq.length; n++) { for (let k = 0; k < n; k++) plan.push(seq[k], seq[k], -1); plan.push(-1, -1, -1); }
      return (t) => { const lit = plan[t % plan.length]; pads.forEach((p, k) => p.classList.toggle("on", k === lit)); };
    },
    stroop(el) {
      const inks = [["Pink", C.pink], ["Blue", C.sky], ["Green", C.mint], ["Yellow", C.yellow]];
      el.innerHTML = `<span class="word"></span><div class="swatches">${inks.map(([, c]) => `<i style="--c:${c}"></i>`).join("")}</div>`;
      const word = $(".word", el), dots = $$(".swatches i", el), seq = [[0, 2], [1, 3], [2, 0], [3, 1], [0, 1]];
      return (t) => {
        const [name, ink] = seq[Math.floor(t / 10) % seq.length], k = t % 10;
        word.textContent = inks[name][0];
        word.style.color = inks[ink][1];
        dots.forEach((d, j) => d.classList.toggle("on", j === ink && k >= 4));
      };
    },
  };
  $$(".stage[data-demo]").forEach((el, n) => {
    const step = DEMOS[el.dataset.demo](el);
    let t = reduce ? 16 : n * 3, timer = 0;
    step(t);
    if (!reduce) whileVisible(el, () => { clearInterval(timer); timer = setInterval(() => step(++t), 150); }, () => clearInterval(timer));
  });

  // ---------- the study: the switch, and the live counts ----------
  const mock = $(".mock");
  if (mock) {
    const field = $(".field", mock), code = "YOUR-CODE";
    let typing = 0, loop = 0;
    const cycle = () => {
      clearInterval(typing);
      mock.classList.remove("on");
      field.textContent = "";
      let k = 0;
      typing = setInterval(() => {
        field.textContent = code.slice(0, ++k);
        if (k === code.length) { clearInterval(typing); setTimeout(() => mock.classList.add("on"), 650); }
      }, 110);
    };
    if (reduce) { field.textContent = code; mock.classList.add("on"); }
    else whileVisible(mock, () => { cycle(); loop = setInterval(cycle, 8500); }, () => { clearInterval(loop); clearInterval(typing); });
  }

  const live = $("#live");
  if (live) {
    const paint = (el, value) => {
      const digits = String(value);
      if (el.children.length !== digits.length) {
        el.innerHTML = [...digits].map(() => `<span class="col">${[...Array(10).keys()].map((d) => `<span>${d}</span>`).join("")}</span>`).join("");
        el.offsetHeight; // so the first roll starts from zero
      }
      [...el.children].forEach((col, k) => { col.style.transform = `translateY(-${digits[k] * 10}%)`; });
      el.setAttribute("aria-label", digits);
    };
    const pull = async () => {
      try {
        const counts = await (await fetch(API + "/counts", { cache: "no-store" })).json();
        live.hidden = !(counts.ok && counts.live);
        if (!live.hidden) $$(".odo", live).forEach((el) => paint(el, counts[el.dataset.key]));
      } catch (e) {
        // No answer: the last numbers stay, or the block stays hidden.
      }
    };
    pull();
    setInterval(() => { if (!document.hidden) pull(); }, 30000);
  }
})();
