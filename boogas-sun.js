// Studio-grade Boogas World header animation with the actual rigged Nomad puppet.
// - Clean editorial header: no cartoon grass hill or campfire cluttering the header.
//   Nomad stands cleanly on the header baseline with the Sun / Crescent Moon hovering right in front of his fist.
// - Studio-grade Sun & Sculpted Crescent Moon artwork matching Nomad's cel-shaded illustration style.
// - Signature "Hit & 360° Orbit Rotation" animation (every single time):
//   * Nomad winds up and punches/uppercuts the Sun (or Moon) with his lead right fist.
//   * Impact triggers a crisp comic hit spark and launches the orb around a full 360° elliptical orbit:
//     whipping forward and down through warm dusk, transforming into the Crescent Moon (or Sun) at the
//     bottom of the orbit, and curving right back up into reach in front of Nomad.

export function mountBoogasSun({ appearance, get, put }) {
  const control = document.querySelector('[data-sun-control]');
  const header = document.querySelector('.header');
  if (!control || !header) return { sync() {} };

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const systemDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const hexToRgb = hex => {
    const h = hex.replace('#', '');
    const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };

  const rgbToHex = ([r, g, b]) =>
    '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');

  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const smoothstep = (edge0, edge1, x) => {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  };

  // Fast launch off the punch impact, smooth deceleration into the home perch at the end of the 360° orbit
  const easeOutCubic = t => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
  const easeOrbit = t => {
    const x = clamp(t, 0, 1);
    return 0.35 * x + 0.65 * (1 - Math.pow(1 - x, 2.6));
  };

  const lerpHex = (c1, c2, t) => {
    const a = hexToRgb(c1), b = hexToRgb(c2);
    return rgbToHex([lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]);
  };

  const sampleStops = (stops, t) => {
    const clamped = clamp(t, 0, 1);
    for (let i = 0; i < stops.length - 1; i++) {
      const [t0, c0] = stops[i];
      const [t1, c1] = stops[i + 1];
      if (clamped >= t0 && clamped <= t1) {
        const localT = t1 === t0 ? 0 : (clamped - t0) / (t1 - t0);
        return lerpHex(c0, c1, localT);
      }
    }
    return stops[stops.length - 1][1];
  };

  // Page palette stops passing from creamy stone (Day) -> warm dusk -> charcoal (Night)
  const pagePaletteStops = {
    '--paper':       [[0, '#eee6d6'], [0.42, '#dfc09a'], [0.68, '#3b2e28'], [1, '#20221f']],
    '--white':       [[0, '#f5efe3'], [0.42, '#ead1b0'], [0.68, '#463730'], [1, '#262825']],
    '--panel':       [[0, '#e5e4d4'], [0.42, '#d5b28a'], [0.68, '#43342d'], [1, '#262825']],
    '--sage':        [[0, '#dfe5ce'], [0.42, '#ccb089'], [0.68, '#4a3930'], [1, '#292c27']],
    '--ink':         [[0, '#20221f'], [0.45, '#251e19'], [0.62, '#f2e5d2'], [1, '#eee6d6']],
    '--muted':       [[0, '#5c6254'], [0.45, '#5d4c3e'], [0.62, '#cbb8a4'], [1, '#c1c4ba']],
    '--line':        [[0, '#c3c6b4'], [0.42, '#b99975'], [0.68, '#634f44'], [1, '#484c43']],
    '--green':       [[0, '#405a32'], [0.42, '#754c24'], [0.68, '#da9f56'], [1, '#9fc17c']],
    '--accent':      [[0, '#405a32'], [0.42, '#754c24'], [0.68, '#da9f56'], [1, '#9fc17c']],
    '--action':      [[0, '#9fc17c'], [0.42, '#e2a64c'], [0.68, '#da9f56'], [1, '#9fc17c']],
    '--button-text': [[0, '#20221f'], [0.5,  '#201c18'], [1,    '#20221f']]
  };

  // Generate a continuous, unified 12-point solar corona polygon (no detached clip-art triangles)
  const sunCoronaPoints = (() => {
    const pts = [];
    const total = 24;
    for (let i = 0; i < total; i++) {
      const angle = (i * Math.PI * 2) / total - Math.PI / 2;
      const r = i % 2 === 0 ? 9.6 : 7.2;
      pts.push(`${(Math.cos(angle) * r).toFixed(2)},${(Math.sin(angle) * r).toFixed(2)}`);
    }
    return pts.join(' ');
  })();

  // Rigged Nomad puppet coordinate conversion (matches Nomad_Interactive_Puppet_Tester.html 1150pt -> 750px space)
  const PUPPET_SCALE = 750 / 1150;
  const svgPivot = (px1150, py1150, deg = 0, dx1150 = 0, dy1150 = 0) => {
    const px = px1150 * PUPPET_SCALE;
    const py = py1150 * PUPPET_SCALE;
    const dx = dx1150 * PUPPET_SCALE;
    const dy = dy1150 * PUPPET_SCALE;
    return `translate(${(px + dx).toFixed(2)} ${(py + dy).toFixed(2)}) rotate(${deg.toFixed(2)}) translate(${(-px).toFixed(2)} ${(-py).toFixed(2)})`;
  };

  const VISEME_BOXES = {
    Closed:    { href: 'assets/nomad-puppet/viseme_Closed_crop.webp',    x: 387, y: 255, w: 75, h: 24 },
    Ee:        { href: 'assets/nomad-puppet/viseme_Ee_crop.webp',        x: 397, y: 263, w: 62, h: 31 },
    D:         { href: 'assets/nomad-puppet/viseme_D_crop.webp',         x: 398, y: 263, w: 62, h: 31 },
    Ff:        { href: 'assets/nomad-puppet/viseme_Ff_crop.webp',        x: 410, y: 264, w: 43, h: 33 },
    Ah:        { href: 'assets/nomad-puppet/viseme_Ah_crop.webp',        x: 391, y: 261, w: 71, h: 37 },
    Surprised: { href: 'assets/nomad-puppet/viseme_Surprised_crop.webp', x: 419, y: 266, w: 27, h: 27 }
  };

  // 1. Clean editorial "Day / Night" switch inside .header-tools
  control.innerHTML = `
    <span class="boogas-sun-dot" aria-hidden="true"></span>
    <span class="boogas-sun-label" aria-hidden="true">
      <span class="boogas-label-day">Day</span>
      <span class="boogas-label-slash">/</span>
      <span class="boogas-label-night">Night</span>
    </span>
  `;

  // 2. Mount the studio-grade Boogas stage inside .header
  let sceneWrap = header.querySelector('.boogas-header-scene');
  if (!sceneWrap) {
    sceneWrap = document.createElement('div');
    sceneWrap.className = 'boogas-header-scene';
    sceneWrap.setAttribute('aria-hidden', 'true');
    header.prepend(sceneWrap);
  }

  sceneWrap.innerHTML = `
    <svg class="boogas-world-svg" viewBox="0 0 1440 88" preserveAspectRatio="none">
      <defs>
        <radialGradient id="bwDuskGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffae52" stop-opacity="0.52"/>
          <stop offset="58%" stop-color="#e06d44" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#e06d44" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="bwNightStageGlow" cx="50%" cy="52%" r="50%">
          <stop offset="0%" stop-color="#8eb072" stop-opacity="0.22"/>
          <stop offset="60%" stop-color="#4e6342" stop-opacity="0.08"/>
          <stop offset="100%" stop-color="#20221f" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="bwSunHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffd86b" stop-opacity="0.55"/>
          <stop offset="60%" stop-color="#ffb838" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#ffb838" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="bwSunCoreGrad" x1="20%" y1="15%" x2="85%" y2="88%">
          <stop offset="0%" stop-color="#fff099"/>
          <stop offset="55%" stop-color="#ffd252"/>
          <stop offset="100%" stop-color="#f29b27"/>
        </linearGradient>
        <radialGradient id="bwMoonHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#f5efe3" stop-opacity="0.38"/>
          <stop offset="60%" stop-color="#9fc17c" stop-opacity="0.12"/>
          <stop offset="100%" stop-color="#f5efe3" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="bwMoonGrad" x1="18%" y1="12%" x2="82%" y2="88%">
          <stop offset="0%" stop-color="#fffdf7"/>
          <stop offset="60%" stop-color="#efe7d6"/>
          <stop offset="100%" stop-color="#d4cab4"/>
        </linearGradient>
      </defs>

      <!-- Warm dusk aura & subtle night rim backlight -->
      <ellipse class="bw-dusk-glow" cx="800" cy="48" rx="220" ry="52" fill="url(#bwDuskGlow)" opacity="0"/>
      <ellipse class="bw-night-glow" cx="800" cy="46" rx="190" ry="48" fill="url(#bwNightStageGlow)" opacity="0"/>

      <!-- Subtle celestial orbit motion trail (only visible while the orb is flying in orbit!) -->
      <ellipse class="bw-orbit-track" cx="820" cy="46" rx="34" ry="20" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 5" opacity="0"/>

      <!-- Night stars around the Crescent Moon -->
      <g class="bw-stars" opacity="0"></g>

      <!-- Interactive hit zone -->
      <rect class="bw-stage-hit" x="520" y="0" width="520" height="88" fill="transparent"/>

      <!-- Actual Rigged Nomad Puppet standing cleanly on the header baseline -->
      <g class="bw-nomad" transform="translate(760, 86) scale(0.116) translate(-355, -691)">
        <title>Nomad — Click to make Nomad punch the Sun into orbit!</title>
        <!-- Crisp ground shadow on the header baseline -->
        <ellipse cx="360" cy="688" rx="122" ry="22" fill="#141a11" opacity="0.28"/>

        <!-- Lower body: Skirt, Legs & Fur-trimmed Boots -->
        <g class="np-legs">
          <image href="assets/nomad-puppet/lower_body_crop.webp" x="234" y="414" width="243" height="279"/>
        </g>

        <!-- Articulated Upper Body (waist pivot 540, 740 in 1150pt space) -->
        <g class="np-torso">
          <!-- Lead / Right Arm (shoulder pivot 628.7, 506.0; elbow pivot 628.7, 624.1) -->
          <g class="np-rarm">
            <image href="assets/nomad-puppet/urarm_crop.webp" x="352" y="265" width="123" height="185"/>
            <g class="np-relbow">
              <image href="assets/nomad-puppet/rforearm_crop.webp" x="367" y="372" width="153" height="189"/>
            </g>
          </g>

          <!-- Torso: Yellow Tunic with Fur Collar & Stitched Grey Patches -->
          <image href="assets/nomad-puppet/body_crop.webp" x="238" y="241" width="252" height="289"/>

          <!-- Near / Left Arm (shoulder pivot 441.6, 506.0; elbow pivot 391.0, 621.0) -->
          <g class="np-larm">
            <image href="assets/nomad-puppet/ularm_crop.webp" x="200" y="267" width="155" height="181"/>
            <g class="np-lelbow">
              <image href="assets/nomad-puppet/lforearm_crop.webp" x="198" y="372" width="124" height="205"/>
            </g>
          </g>

          <!-- Head, Facial Rig, Visemes, Hair, Sunglasses & Feather Earring (neck pivot 575, 460) -->
          <g class="np-head">
            <image href="assets/nomad-puppet/head_base_crop.webp" x="336" y="168" width="137" height="185"/>
            <image class="np-eyes-open" href="assets/nomad-puppet/eyes_open_crop.webp" x="393" y="211" width="58" height="35"/>
            <g class="np-pupils">
              <image href="assets/nomad-puppet/pupils_crop.webp" x="403" y="222" width="41" height="21"/>
            </g>
            <image class="np-eyes-closed" href="assets/nomad-puppet/eyes_closed_crop.webp" x="393" y="211" width="58" height="35" opacity="0"/>
            <image class="np-mouth" href="assets/nomad-puppet/viseme_Closed_crop.webp" x="387" y="255" width="75" height="24"/>
            <g class="np-brows">
              <image href="assets/nomad-puppet/brows_crop.webp" x="379" y="198" width="80" height="28"/>
            </g>
            <g class="np-shades-face">
              <image href="assets/nomad-puppet/sunglasses_crop.webp" x="378" y="211" width="81" height="36"/>
            </g>
            <image href="assets/nomad-puppet/hair_front_crop.webp" x="306" y="128" width="171" height="254"/>
            <g class="np-shades-hair" opacity="0">
              <image href="assets/nomad-puppet/sunglasses_crop.webp" x="378" y="211" width="81" height="36"/>
            </g>
            <g class="np-earring">
              <image href="assets/nomad-puppet/earring_crop.webp" x="342" y="194" width="46" height="141"/>
            </g>
          </g>
        </g>
      </g>

      <!-- Studio-Grade Celestial Orb (Sun & Sculpted Crescent Moon) -->
      <g class="bw-orb" transform="translate(800, 28) scale(1.85)">
        <circle cx="0" cy="0" r="15" fill="transparent"/>
        <g class="bw-orb-spin">
          <!-- Studio-Grade Cel-Shaded Sun -->
          <g class="bw-sun">
            <circle cx="0" cy="0" r="14.5" fill="url(#bwSunHalo)"/>
            <!-- Continuous 12-point solar corona badge -->
            <polygon class="bw-sun-rays" points="${sunCoronaPoints}" fill="#f5a22d" stroke="#20221f" stroke-width="1.05" stroke-linejoin="round"/>
            <!-- Solar sphere with cel-shaded shadow & specular gloss -->
            <circle class="bw-sun-core" cx="0" cy="0" r="6.3" fill="url(#bwSunCoreGrad)" stroke="#20221f" stroke-width="1.15"/>
            <path d="M -3.9 3.7 A 5.5 5.5 0 0 0 4.7 -2.3 A 5.9 5.3 0 0 1 -3.9 3.7 Z" fill="#e08419" opacity="0.55"/>
            <ellipse cx="-2.1" cy="-2.2" rx="2.0" ry="1.2" transform="rotate(-28 -2.1 -2.2)" fill="#fffbe0" opacity="0.92"/>
          </g>

          <!-- Studio-Grade Sculpted Crescent Moon -->
          <g class="bw-moon" opacity="0">
            <circle cx="0" cy="0" r="13.5" fill="url(#bwMoonHalo)"/>
            <!-- Subtle dark side of the lunar sphere -->
            <circle cx="0.4" cy="0" r="5.9" fill="#2c322b" stroke="#20221f" stroke-width="0.9" opacity="0.55"/>
            <!-- Sculpted, cel-shaded ivory Crescent Moon -->
            <g transform="rotate(-18)">
              <path d="M 2.7 -5.65 A 6.25 6.25 0 1 0 2.7 5.65 A 4.95 5.3 0 0 1 2.7 -5.65 Z" fill="url(#bwMoonGrad)" stroke="#20221f" stroke-width="1.15" stroke-linejoin="round"/>
              <!-- Inner cel-shaded terminator contour -->
              <path d="M 1.1 -4.9 A 5.2 5.2 0 1 0 1.1 4.9 A 4.5 4.9 0 0 1 1.1 -4.9 Z" fill="#d5cbb6" opacity="0.55"/>
              <!-- Crisp lunar rim highlight -->
              <ellipse cx="-3.6" cy="-2.1" rx="1.5" ry="0.85" transform="rotate(-52 -3.6 -2.1)" fill="#ffffff" opacity="0.9"/>
            </g>
            <!-- Companion star sparkle -->
            <path d="M 4.4 -3.2 L 4.9 -1.8 L 6.3 -1.3 L 4.9 -0.8 L 4.4 0.6 L 3.9 -0.8 L 2.5 -1.3 L 3.9 -1.8 Z" fill="#ffd86b" stroke="#20221f" stroke-width="0.45"/>
          </g>
        </g>
      </g>

      <!-- Hand-inked Comic Hit Impact Burst (flashes when Nomad's fist strikes the Sun/Moon) -->
      <g class="bw-hit-burst" opacity="0" transform="translate(800, 28) scale(1)">
        <circle class="bw-hit-ring" cx="0" cy="0" r="12" fill="none" stroke="#ffd86b" stroke-width="2.2"/>
        <path d="M 0 -15 L 3.2 -4.8 L 13.5 -8.5 L 6.0 -0.5 L 14.5 6.8 L 3.5 4.5 L 0 15.5 L -3.5 4.5 L -14.5 6.8 L -6.0 -0.5 L -13.5 -8.5 L -3.2 -4.8 Z" fill="#fff6c2" stroke="#20221f" stroke-width="1.2" stroke-linejoin="round"/>
      </g>
    </svg>
  `;

  const svg = sceneWrap.querySelector('.boogas-world-svg');
  const els = {
    duskGlow: svg.querySelector('.bw-dusk-glow'),
    nightGlow: svg.querySelector('.bw-night-glow'),
    orbitTrack: svg.querySelector('.bw-orbit-track'),
    stars: svg.querySelector('.bw-stars'),
    stageHit: svg.querySelector('.bw-stage-hit'),
    orb: svg.querySelector('.bw-orb'),
    orbSpin: svg.querySelector('.bw-orb-spin'),
    sun: svg.querySelector('.bw-sun'),
    sunCore: svg.querySelector('.bw-sun-core'),
    moon: svg.querySelector('.bw-moon'),
    hitBurst: svg.querySelector('.bw-hit-burst'),
    nomad: svg.querySelector('.bw-nomad'),
    npLegs: svg.querySelector('.np-legs'),
    npTorso: svg.querySelector('.np-torso'),
    npRarm: svg.querySelector('.np-rarm'),
    npRelbow: svg.querySelector('.np-relbow'),
    npLarm: svg.querySelector('.np-larm'),
    npLelbow: svg.querySelector('.np-lelbow'),
    npHead: svg.querySelector('.np-head'),
    npEyesOpen: svg.querySelector('.np-eyes-open'),
    npEyesClosed: svg.querySelector('.np-eyes-closed'),
    npPupils: svg.querySelector('.np-pupils'),
    npMouth: svg.querySelector('.np-mouth'),
    npBrows: svg.querySelector('.np-brows'),
    npShadesFace: svg.querySelector('.np-shades-face'),
    npShadesHair: svg.querySelector('.np-shades-hair'),
    npEarring: svg.querySelector('.np-earring')
  };

  const sceneLayout = {
    W: 1440,
    H: 88,
    stageLeft: 520,
    stageRight: 1120,
    nomadScale: 0.116,
    orbScale: 1.85,
    nomadX: 760,
    nomadY: 86,
    defaultOrbX: 794,
    dayOrbY: 27,
    nightOrbY: 27,
    orbitRx: 38,
    orbitRy: 22
  };

  function measureHeaderLayout() {
    const hRect = header.getBoundingClientRect();
    const W = Math.max(320, Math.round(hRect.width || window.innerWidth || 1440));
    const H = Math.max(60, Math.round(hRect.height || 88));

    const brandEl = header.querySelector('.brand');
    const navEl = header.querySelector('.main-nav');
    const toolsEl = header.querySelector('.header-tools');

    let leftAnchor = 190;
    if (navEl && getComputedStyle(navEl).display !== 'none') {
      const nr = navEl.getBoundingClientRect();
      if (nr.width > 0) leftAnchor = nr.right - hRect.left + 28;
    } else if (brandEl) {
      const br = brandEl.getBoundingClientRect();
      if (br.width > 0) leftAnchor = br.right - hRect.left + 16;
    }

    let rightAnchor = W - 210;
    if (toolsEl) {
      const tr = toolsEl.getBoundingClientRect();
      if (tr.width > 0) rightAnchor = tr.left - hRect.left - 22;
    }

    const stageLeft = clamp(leftAnchor, 130, W - 180);
    const stageRight = Math.max(stageLeft + 100, clamp(rightAnchor, stageLeft + 100, W - 40));
    const stageW = stageRight - stageLeft;
    const center = stageLeft + stageW * 0.48;

    const compact = W < 600;
    const medium = W >= 600 && W < 900;
    const nomadScale = compact ? 0.084 : medium ? 0.100 : 0.116;
    const orbScale = compact ? 1.32 : medium ? 1.58 : 1.85;

    // Nomad stands near the center; the Sun/Moon hovers right in front of his lead fist at shoulder/fist height
    const nomadX = center - (compact ? 16 : 26);
    const nomadY = H - 1.5;
    const defaultOrbX = nomadX + 325 * nomadScale;
    const dayOrbY = Math.max(30, H * 0.37);
    const nightOrbY = dayOrbY;

    const orbitRx = compact ? 24 : medium ? 32 : 38;
    const orbitRy = compact ? 14 : medium ? 17 : 20;

    Object.assign(sceneLayout, {
      W,
      H,
      stageLeft,
      stageRight,
      nomadScale,
      orbScale,
      nomadX,
      nomadY,
      defaultOrbX,
      dayOrbY,
      nightOrbY,
      orbitRx,
      orbitRy
    });

    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

    els.stageHit.setAttribute('x', String(Math.round(stageLeft)));
    els.stageHit.setAttribute('width', String(Math.round(stageW)));
    els.stageHit.setAttribute('height', String(H));

    els.duskGlow.setAttribute('cx', String(Math.round(defaultOrbX + orbitRx * 0.25)));
    els.duskGlow.setAttribute('cy', String(Math.round(H * 0.54)));
    els.duskGlow.setAttribute('rx', String(Math.round(orbitRx * 4.5)));
    els.duskGlow.setAttribute('ry', String(Math.round(H * 0.65)));

    els.nightGlow.setAttribute('cx', String(Math.round(nomadX + 16)));
    els.nightGlow.setAttribute('cy', String(Math.round(H * 0.50)));
    els.nightGlow.setAttribute('rx', String(Math.round(orbitRx * 3.8)));
    els.nightGlow.setAttribute('ry', String(Math.round(H * 0.62)));

    // Position the subtle elliptical orbit guide so its top (12 o'clock) passes right through (defaultOrbX, dayOrbY)
    els.orbitTrack.setAttribute('cx', (defaultOrbX + orbitRx * 0.32).toFixed(1));
    els.orbitTrack.setAttribute('cy', (dayOrbY + orbitRy).toFixed(1));
    els.orbitTrack.setAttribute('rx', (orbitRx * 1.05).toFixed(1));
    els.orbitTrack.setAttribute('ry', orbitRy.toFixed(1));

    // Crisp minimalist star field in Night mode
    const starDefs = [
      { x: nomadX - 46, y: H * 0.22, type: 'sparkle', cls: 'bw-star-twinkle-1', color: '#ffd86b', s: 0.9 },
      { x: defaultOrbX + orbitRx * 1.4, y: H * 0.20, type: 'dot', cls: 'bw-star-twinkle-2', color: '#f5efe3', r: 1.3 },
      { x: defaultOrbX + orbitRx * 2.1, y: H * 0.34, type: 'sparkle', cls: 'bw-star-twinkle-2', color: '#f5efe3', s: 0.85 },
      { x: defaultOrbX + orbitRx * 0.6, y: H * 0.14, type: 'dot', cls: 'bw-star-twinkle-1', color: '#9fc17c', r: 1.2 }
    ];
    els.stars.innerHTML = starDefs.map(st => {
      if (st.type === 'sparkle') {
        const sc = st.s * (compact ? 0.8 : 1.0);
        return `<path class="${st.cls}" transform="translate(${st.x.toFixed(1)}, ${st.y.toFixed(1)}) scale(${sc.toFixed(2)})" d="M 0 -3.8 L 0.9 -0.9 L 3.8 0 L 0.9 0.9 L 0 3.8 L -0.9 0.9 L -3.8 0 L -0.9 -0.9 Z" fill="${st.color}" stroke="#20221f" stroke-width="0.4"/>`;
      }
      return `<circle class="${st.cls}" cx="${st.x.toFixed(1)}" cy="${st.y.toFixed(1)}" r="${st.r}" fill="${st.color}"/>`;
    }).join('');
  }

  let progress = document.documentElement.dataset.mode === 'dark' ? 1 : 0;
  let animFrame = null;
  let idleFrame = null;
  let isDragging = false;

  const puppetState = {
    viseme: 'Closed',
    blink: false,
    earDeg: 0,
    earVel: 0,
    prevHeadDeg: 0,
    lastRenderOpts: {}
  };

  function setMouthViseme(name) {
    const v = VISEME_BOXES[name] ? name : 'Closed';
    if (puppetState.viseme === v) return;
    puppetState.viseme = v;
    const box = VISEME_BOXES[v];
    els.npMouth.setAttribute('href', box.href);
    els.npMouth.setAttribute('x', String(box.x));
    els.npMouth.setAttribute('y', String(box.y));
    els.npMouth.setAttribute('width', String(box.w));
    els.npMouth.setAttribute('height', String(box.h));
  }

  function applyPageDusk(t) {
    const root = document.documentElement;
    if (t <= 0.01 || t >= 0.99 || reducedMotionQuery.matches) {
      delete root.dataset.duskActive;
      for (const prop of Object.keys(pagePaletteStops)) {
        root.style.removeProperty(prop);
      }
      return;
    }
    root.dataset.duskActive = 'true';
    for (const [prop, stops] of Object.entries(pagePaletteStops)) {
      root.style.setProperty(prop, sampleStops(stops, t));
    }
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.content = sampleStops(pagePaletteStops['--paper'], t);
    }
  }

  function updateAria(mode, hitting = false) {
    const isNight = mode === 'dark';
    control.setAttribute('aria-checked', String(isNight));
    control.setAttribute(
      'aria-label',
      hitting
        ? 'Nomad hits the sun into orbit!'
        : `Time of day in Boogas World: ${isNight ? 'Night' : 'Day'}. Click Nomad or the ${isNight ? 'moon' : 'sun'} to punch it into orbit.`
    );
  }

  // Compute the exact (x, y) point along the 360° elliptical orbit for angle phi in [0, 2*PI]
  // - phi = 0: home perch (defaultOrbX, dayOrbY) right in front of Nomad's fist
  // - phi = PI/2: flying forward-right along the upper-right arc
  // - phi = PI: bottom of the orbit (where Sun <-> Crescent Moon morphs)
  // - phi = 3*PI/2: rising back up along the left side of the orbit
  // - phi = 2*PI: back at (defaultOrbX, dayOrbY)
  function getOrbitPoint(phi) {
    const { defaultOrbX, dayOrbY, orbitRx, orbitRy } = sceneLayout;
    const forwardShift = orbitRx * 0.32 * (1 - Math.cos(phi));
    const x = defaultOrbX + orbitRx * Math.sin(phi) + forwardShift;
    const y = dayOrbY + orbitRy * (1 - Math.cos(phi));
    return [x, y];
  }

  // Render the Boogas header stage & articulated Nomad puppet
  // Pose parameters:
  // - windupWeight (0..1): Nomad coiling back & cocking his right fist before the strike
  // - punchWeight (0..1): Nomad snapping his right fist forward-up into the Sun/Moon
  // - orbSpinDeg: rotation of the orb as it whips around the 360° orbit
  // - hitBurst (0..1): comic impact flash at the point of fist contact
  function renderWorld(t, options = {}) {
    const clampedT = clamp(t, 0, 1);
    const {
      orbX = sceneLayout.defaultOrbX,
      orbY = sceneLayout.dayOrbY,
      orbSpinDeg = 0,
      orbScaleMult = 1,
      orbitTrailOpacity = 0,
      windupWeight = 0,
      punchWeight = 0,
      hitBurst = 0,
      nomadX = sceneLayout.nomadX,
      nomadY = sceneLayout.nomadY,
      idleTime = performance.now() / 1000
    } = options;

    puppetState.lastRenderOpts = {
      t: clampedT,
      orbX,
      orbY,
      orbSpinDeg,
      orbScaleMult,
      orbitTrailOpacity,
      windupWeight,
      punchWeight,
      hitBurst,
      nomadX,
      nomadY
    };

    const duskIntensity = Math.sin(clampedT * Math.PI);
    els.duskGlow.setAttribute('opacity', duskIntensity.toFixed(3));
    els.orbitTrack.setAttribute('opacity', orbitTrailOpacity.toFixed(3));

    const starOpacity = clamp((clampedT - 0.45) / 0.42, 0, 1);
    els.stars.setAttribute('opacity', starOpacity.toFixed(3));
    els.nightGlow.setAttribute('opacity', starOpacity.toFixed(3));

    // Sun <-> Sculpted Crescent Moon crossfade around t = 0.5 (bottom of the orbit)
    const moonBlend = clamp((clampedT - 0.38) / 0.24, 0, 1);
    els.sun.setAttribute('opacity', (1 - moonBlend).toFixed(3));
    els.moon.setAttribute('opacity', moonBlend.toFixed(3));

    const finalOrbScale = sceneLayout.orbScale * orbScaleMult;
    els.orb.setAttribute(
      'transform',
      `translate(${orbX.toFixed(2)}, ${orbY.toFixed(2)}) scale(${finalOrbScale.toFixed(3)})`
    );
    els.orbSpin.setAttribute('transform', `rotate(${orbSpinDeg.toFixed(1)})`);

    // Comic impact flash right on Nomad's knuckles at the point of contact
    if (hitBurst > 0.01) {
      const burstScale = lerp(0.55, 1.30, 1 - hitBurst);
      els.hitBurst.setAttribute('opacity', hitBurst.toFixed(3));
      els.hitBurst.setAttribute(
        'transform',
        `translate(${(sceneLayout.defaultOrbX - 9).toFixed(1)}, ${(sceneLayout.dayOrbY + 3).toFixed(1)}) scale(${burstScale.toFixed(2)})`
      );
    } else {
      els.hitBurst.setAttribute('opacity', '0');
    }

    // --- Articulated Nomad Puppet Pose Interpolation ---
    const wWindup = clamp(windupWeight, 0, 1);
    const wPunch = clamp(punchWeight, 0, 1);
    const wAction = clamp(wWindup + wPunch, 0, 1);
    const wNight = (1 - wAction) * clamp((clampedT - 0.45) / 0.45, 0, 1);
    const wDay = Math.max(0, 1 - wAction - wNight);

    const motionOk = !reducedMotionQuery.matches;
    const breath = motionOk ? Math.sin(idleTime * 2.1) : 0;
    const armSway = motionOk ? Math.sin(idleTime * 1.6) : 0;

    // Legs & Torso: coil back on wind-up (-7 deg), drive forward-up on the uppercut punch (+9 deg)
    const legsDy = wWindup * 7 + wPunch * (-3) + wNight * 2;
    const torsoDeg =
      wDay * 0 +
      wNight * 2.0 +
      wWindup * (-7.5) +
      wPunch * 9.5 +
      (motionOk ? 0.4 * Math.sin(idleTime * 1.4) : 0);
    const torsoDx = 0;
    const torsoDy =
      wDay * 0 +
      wNight * 3 +
      wWindup * 10 +
      wPunch * (-5) -
      1.8 * breath;

    // Lead / Right Arm (np-rarm): cocks back on windup (+24 deg), snaps forward-up into the Sun/Moon on punch (-82 deg)
    const rarmDeg =
      wDay * (-4) +
      wNight * (-10 + armSway * 1.4) +
      wWindup * 24 +
      wPunch * (-82);
    const rarmDx = 0;
    const rarmDy = wPunch * (-8) + wWindup * 4;
    const relbowDeg =
      wDay * (-5) +
      wNight * (-12 - armSway * 1.6) +
      wWindup * (-24) +
      wPunch * 4 +
      0.8 * armSway;

    // Near / Left Arm (np-larm): natural counter-balance guard (swings back +22 deg on punch so torso & face stay 100% clear!)
    const larmDeg =
      wDay * 2 +
      wNight * (-5 - armSway * 1.2) +
      wWindup * (-16) +
      wPunch * 22;
    const larmDx = 0;
    const larmDy = 0;
    const lelbowDeg =
      wDay * (-4) +
      wNight * (-8 + armSway * 1.4) +
      wWindup * (-16) +
      wPunch * (-10) +
      0.8 * armSway;

    // Head & Eyes track the orbiting Sun/Moon around the 360° loop
    const dxOrb = orbX - nomadX;
    const dyOrb = orbY - (sceneLayout.dayOrbY + 12);
    const trackDeg = clamp(dyOrb * 0.22, -7, 9);
    const headDeg =
      (1 - wAction) * trackDeg +
      wWindup * (-5) +
      wPunch * (-8) +
      (motionOk ? 0.5 * Math.sin(idleTime * 1.6) : 0);
    const headDy = wWindup * 4 + wPunch * (-3) - 0.8 * breath;

    const pupilDx = clamp((dxOrb - 25) * 0.14, -4, 8);
    const pupilDy = clamp(dyOrb * 0.22, -6, 7);
    const browDy = wWindup * (-4) + wPunch * (-12) + wNight * (-2);
    const browDeg = wWindup * 4 + wPunch * (-4);

    // Sunglasses: worn over eyes in Day; off in Night mode (clean silhouette, no dark blob on hair)
    const faceShadesOpacity = clamp(1 - clampedT * 1.8, 0, 1);
    const hairShadesOpacity = 0;
    const shadesHairTransform = svgPivot(640, 350, 0, 0, 0);

    if (wPunch > 0.35) {
      setMouthViseme('Ah');
    } else if (wWindup > 0.3) {
      setMouthViseme('D');
    } else if (clampedT > 0.15 && clampedT < 0.85) {
      setMouthViseme('Ee');
    } else if (wNight > 0.45) {
      setMouthViseme('Ee');
    } else {
      setMouthViseme('Closed');
    }

    // Spring-damper earring physics
    if (motionOk) {
      const headVel = clamp((headDeg - puppetState.prevHeadDeg) * 45, -180, 180);
      puppetState.prevHeadDeg = headDeg;
      const earAcc = -95 * puppetState.earDeg - 9 * puppetState.earVel - 1.15 * headVel;
      puppetState.earVel += earAcc / 60;
      puppetState.earDeg = clamp(puppetState.earDeg + puppetState.earVel / 60, -22, 22);
    } else {
      puppetState.earDeg = 0;
    }

    control.dataset.nomadHolding = wPunch > 0.3 ? 'true' : 'false';
    els.nomad.setAttribute(
      'transform',
      `translate(${nomadX.toFixed(2)}, ${nomadY.toFixed(2)}) scale(${sceneLayout.nomadScale.toFixed(4)}) translate(-355, -691)`
    );

    els.npLegs.setAttribute('transform', svgPivot(540, 900, 0, 0, legsDy));
    els.npTorso.setAttribute('transform', svgPivot(540, 740, torsoDeg, torsoDx, torsoDy));
    els.npRarm.setAttribute('transform', svgPivot(628.7, 506.0, rarmDeg, rarmDx, rarmDy));
    els.npRelbow.setAttribute('transform', svgPivot(628.7, 624.1, relbowDeg, 0, 0));
    els.npLarm.setAttribute('transform', svgPivot(441.6, 506.0, larmDeg, larmDx, larmDy));
    els.npLelbow.setAttribute('transform', svgPivot(391.0, 621.0, lelbowDeg, 0, 0));
    els.npHead.setAttribute('transform', svgPivot(575, 460, headDeg, 0, headDy));
    els.npPupils.setAttribute('transform', svgPivot(650, 355, 0, pupilDx, pupilDy));
    els.npBrows.setAttribute('transform', svgPivot(645, 324, browDeg, 0, browDy));
    els.npShadesFace.setAttribute('opacity', faceShadesOpacity.toFixed(3));
    els.npShadesHair.setAttribute('transform', shadesHairTransform);
    els.npShadesHair.setAttribute('opacity', hairShadesOpacity.toFixed(3));
    els.npEarring.setAttribute('transform', svgPivot(548, 315, puppetState.earDeg + wPunch * 10 - wWindup * 6, 0, 0));

    const isBlinking = puppetState.blink && wAction < 0.25;
    els.npEyesOpen.setAttribute('opacity', isBlinking ? '0' : '1');
    els.npPupils.setAttribute('opacity', isBlinking ? '0' : '1');
    els.npEyesClosed.setAttribute('opacity', isBlinking ? '1' : '0');
  }

  // Periodic natural eye blink
  setInterval(() => {
    if (reducedMotionQuery.matches || document.hidden) return;
    puppetState.blink = true;
    if (!animFrame && !isDragging) {
      renderWorld(progress, { ...puppetState.lastRenderOpts, idleTime: performance.now() / 1000 });
    }
    setTimeout(() => {
      puppetState.blink = false;
      if (!animFrame && !isDragging) {
        renderWorld(progress, { ...puppetState.lastRenderOpts, idleTime: performance.now() / 1000 });
      }
    }, 145);
  }, 3200);

  // Subtle ~24fps idle breathing loop
  let lastIdleTick = 0;
  function idleLoop(now) {
    if (reducedMotionQuery.matches || document.hidden) {
      idleFrame = null;
      return;
    }
    if (!animFrame && !isDragging && now - lastIdleTick > 42) {
      lastIdleTick = now;
      renderWorld(progress, {
        ...puppetState.lastRenderOpts,
        idleTime: now / 1000
      });
    }
    idleFrame = requestAnimationFrame(idleLoop);
  }

  function startIdleLoop() {
    if (!idleFrame && !reducedMotionQuery.matches && !document.hidden) {
      idleFrame = requestAnimationFrame(idleLoop);
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) startIdleLoop();
  });

  function commitMode(targetMode, remember = true) {
    const next = targetMode === 'dark' ? 'dark' : 'light';
    progress = next === 'dark' ? 1 : 0;
    applyPageDusk(progress);
    if (remember) {
      put('time-choice', next);
      try { localStorage.setItem('boogas-mobile-time-chosen', '1'); } catch {}
    }
    appearance.apply({ nextMode: next, remember });
    renderWorld(progress, {
      orbX: sceneLayout.defaultOrbX,
      orbY: sceneLayout.dayOrbY,
      orbSpinDeg: 0,
      orbScaleMult: 1,
      windupWeight: 0,
      punchWeight: 0,
      hitBurst: 0,
      nomadX: sceneLayout.nomadX,
      nomadY: sceneLayout.nomadY
    });
    updateAria(next, false);
    startIdleLoop();
  }

  function cancelAnim() {
    if (animFrame) {
      cancelAnimationFrame(animFrame);
      animFrame = null;
    }
  }

  // Deterministic "Hit & 360° Orbit Rotation" animation (every single time!)
  function animateSwitch(targetMode) {
    cancelAnim();
    measureHeaderLayout();
    const toNight = targetMode === 'dark';
    const startT = toNight ? 0 : 1;
    const endT = toNight ? 1 : 0;

    if (reducedMotionQuery.matches) {
      commitMode(targetMode, true);
      return;
    }

    const duration = 900;
    const startTime = performance.now();
    let modeApplied = false;
    updateAria(targetMode, true);

    function tick(now) {
      const elapsed = now - startTime;
      const u = clamp(elapsed / duration, 0, 1);

      if (u < 0.18) {
        // Phase 1: Nomad winds up & cocks his right fist back; orb compresses slightly in anticipation
        const k = smoothstep(0, 1, u / 0.18);
        progress = startT;
        renderWorld(progress, {
          orbX: sceneLayout.defaultOrbX,
          orbY: sceneLayout.dayOrbY,
          orbSpinDeg: 0,
          orbScaleMult: lerp(1, 0.94, k),
          windupWeight: k,
          punchWeight: 0,
          hitBurst: 0,
          nomadX: sceneLayout.nomadX,
          nomadY: sceneLayout.nomadY,
          idleTime: now / 1000
        });
      } else {
        // Phase 2 & 3: WHAM! Nomad punches the orb, launching it around a full 360° elliptical orbit!
        const orbitRaw = clamp((u - 0.18) / 0.82, 0, 1);
        const orbitProgress = easeOrbit(orbitRaw);
        const phi = orbitProgress * Math.PI * 2;
        const [orbX, orbY] = getOrbitPoint(phi);

        // Punch snaps forward from u=0.18..0.28, holds briefly, then relaxes smoothly as the orb returns
        let punchWeight = 0;
        let windupWeight = 0;
        if (orbitRaw < 0.12) {
          const pk = easeOutCubic(orbitRaw / 0.12);
          windupWeight = 1 - pk;
          punchWeight = pk;
        } else {
          punchWeight = Math.max(0, 1 - smoothstep(0.12, 0.62, orbitRaw));
        }

        // Comic hit burst flashes right at the moment of fist contact
        const hitBurst = orbitRaw < 0.20 ? Math.sin((orbitRaw / 0.20) * Math.PI) : 0;

        // As the orb passes the bottom of the orbit (orbitProgress ~ 0.5), it swaps between Sun and Crescent Moon
        progress = lerp(startT, endT, smoothstep(0.15, 0.82, orbitProgress));
        if (!modeApplied && orbitProgress >= 0.46) {
          modeApplied = true;
          document.documentElement.dataset.mode = targetMode;
        }
        applyPageDusk(progress);

        // Dynamic scale pulse along the orbit + 360° spin during the flight
        const orbScaleMult = 1 + 0.14 * Math.sin(orbitProgress * Math.PI);
        const orbSpinDeg = (1 - Math.cos(orbitProgress * Math.PI)) * 180;
        const orbitTrailOpacity = Math.sin(orbitRaw * Math.PI) * 0.28;

        renderWorld(progress, {
          orbX,
          orbY,
          orbSpinDeg,
          orbScaleMult,
          orbitTrailOpacity,
          windupWeight,
          punchWeight,
          hitBurst,
          nomadX: sceneLayout.nomadX,
          nomadY: sceneLayout.nomadY,
          idleTime: now / 1000
        });
      }

      if (u < 1) {
        animFrame = requestAnimationFrame(tick);
      } else {
        animFrame = null;
        commitMode(targetMode, true);
      }
    }

    animFrame = requestAnimationFrame(tick);
  }

  // Click / tap anywhere on Nomad, the Sun/Moon, or the stage to trigger the Punch & Orbit animation
  for (const hitEl of [els.stageHit, els.orb, els.nomad]) {
    hitEl.addEventListener('click', () => {
      const currentMode = document.documentElement.dataset.mode === 'dark' ? 'dark' : 'light';
      animateSwitch(currentMode === 'dark' ? 'light' : 'dark');
    });
  }

  control.addEventListener('click', () => {
    const currentMode = document.documentElement.dataset.mode === 'dark' ? 'dark' : 'light';
    animateSwitch(currentMode === 'dark' ? 'light' : 'dark');
  });

  control.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      if (document.documentElement.dataset.mode !== 'dark') animateSwitch('dark');
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      if (document.documentElement.dataset.mode === 'dark') animateSwitch('light');
    }
  });

  const handleResize = () => {
    measureHeaderLayout();
    if (!animFrame && !isDragging) {
      renderWorld(progress, {
        orbX: sceneLayout.defaultOrbX,
        orbY: sceneLayout.dayOrbY,
        nomadX: sceneLayout.nomadX,
        nomadY: sceneLayout.nomadY
      });
    }
  };

  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(handleResize);
    ro.observe(header);
  } else {
    window.addEventListener('resize', handleResize);
  }

  systemDarkQuery.addEventListener('change', e => {
    let hasExplicitChoice = false;
    try {
      hasExplicitChoice = Boolean(localStorage.getItem('boogas-mobile-time-choice')) ||
        localStorage.getItem('boogas-mobile-time-chosen') === '1';
    } catch {}
    if (!hasExplicitChoice) {
      commitMode(e.matches ? 'dark' : 'light', false);
    }
  });

  measureHeaderLayout();
  const initialMode = document.documentElement.dataset.mode === 'dark' ? 'dark' : 'light';
  progress = initialMode === 'dark' ? 1 : 0;
  renderWorld(progress, {
    orbX: sceneLayout.defaultOrbX,
    orbY: sceneLayout.dayOrbY,
    nomadX: sceneLayout.nomadX,
    nomadY: sceneLayout.nomadY
  });
  updateAria(initialMode, false);
  startIdleLoop();

  return {
    sync(nextMode) {
      if (isDragging || animFrame) return;
      measureHeaderLayout();
      const m = nextMode === 'dark' ? 'dark' : 'light';
      progress = m === 'dark' ? 1 : 0;
      applyPageDusk(progress);
      renderWorld(progress, {
        orbX: sceneLayout.defaultOrbX,
        orbY: sceneLayout.dayOrbY,
        nomadX: sceneLayout.nomadX,
        nomadY: sceneLayout.nomadY
      });
      updateAria(m, false);
    }
  };
}
