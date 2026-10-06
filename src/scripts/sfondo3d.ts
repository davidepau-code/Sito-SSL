// Sfondo 3D (ESPERIMENTO): oggetti della sicurezza (casco, cartellina, estintore) disegnati in codice, senza file esterni.
// Si muovono e ruotano con lo scorrimento della pagina, dietro ai contenuti. Per toglierlo: rimuovere <Sfondo3D /> da Base.astro.
import {
  BufferGeometry, CircleGeometry, Float32BufferAttribute, CanvasTexture, WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, Vector2, Vector3, Color, ACESFilmicToneMapping, SRGBColorSpace, PMREMGenerator, DirectionalLight,
  MeshPhysicalMaterial, MeshStandardMaterial, LatheGeometry, CylinderGeometry, TorusGeometry, BoxGeometry, TubeGeometry, CatmullRomCurve3, DoubleSide,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const canvas = document.getElementById('sfondo3d') as HTMLCanvasElement | null;
const ridotto = matchMedia('(prefers-reduced-motion: reduce)').matches;

const arancio = () => new MeshPhysicalMaterial({ color: 0xee6a0c, roughness: 0.28, metalness: 0.0, clearcoat: 1, clearcoatRoughness: 0.12, side: DoubleSide });
const plastica = (c: number, r = 0.5) => new MeshStandardMaterial({ color: c, roughness: r, metalness: 0.05 });

/* ---------- Casco ---------- */
// Casco da cantiere classico: cupola liscia a uovo, ampia cresta centrale a nervature, bordo con visiera frontale,
// sei alette sul bordo e, davanti, il marchio SSL in un bollo rotondo.
const N = 2.1, H = 0.95;
const quota = (x: number, z: number) => { const r = Math.min(Math.hypot(x, z), 0.999); return H * Math.pow(1 - Math.pow(r, N), 1 / N); };
const SCALA_Z = 1.22;

function texturaMarchio() {
  const c = document.createElement('canvas'); c.width = c.height = 512;
  const x = c.getContext('2d')!;
  x.fillStyle = '#ffffff'; x.beginPath(); x.arc(256, 256, 252, 0, Math.PI * 2); x.fill();
  const tex = new CanvasTexture(c); tex.colorSpace = SRGBColorSpace; tex.anisotropy = 4;
  const img = new Image();
  img.onload = () => {
    x.save(); x.beginPath(); x.arc(256, 256, 246, 0, Math.PI * 2); x.clip();
    x.drawImage(img, 0, 0, 512, 512); x.restore();
    tex.needsUpdate = true;
  };
  img.src = '/ssl-mark.png';
  return tex;
}

/** Bollo appoggiato sulla cupola, sul davanti: segue la curvatura (griglia di punti sulla superficie). */
function bollo() {
  const NX = 20, NY = 28, larg = 0.62, alt = 0.62, z0 = 0.42;
  const tab: { z: number; s: number }[] = [{ z: z0, s: 0 }];
  let z = z0, acc = 0, py = quota(0, z0);
  while (acc < alt && z < 0.99) { z += 0.002; const y = quota(0, z); acc += Math.hypot(0.002 * SCALA_Z, y - py); py = y; tab.push({ z, s: acc }); }
  const pos: number[] = [], uv: number[] = [], idx: number[] = [];
  for (let j = 0; j <= NY; j++) {
    const s = (j / NY) * acc;
    const riga = tab.find((t) => t.s >= s) ?? tab[tab.length - 1];
    for (let i = 0; i <= NX; i++) {
      const x = (i / NX - 0.5) * larg;
      pos.push(x, quota(x, riga.z) + 0.012, riga.z);
      uv.push(i / NX, 1 - j / NY);
    }
  }
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
    const a = j * (NX + 1) + i, b = a + 1, c = a + NX + 1, d = c + 1;
    idx.push(a, c, b, b, c, d);
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new Float32BufferAttribute(uv, 2));
  geo.setIndex(idx); geo.computeVertexNormals();
  const mat = new MeshPhysicalMaterial({ map: texturaMarchio(), roughness: 0.4, clearcoat: 1, clearcoatRoughness: 0.15, transparent: true, side: DoubleSide, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 });
  return new Mesh(geo, mat);
}

const liscia = (t: number) => t * t * (3 - 2 * t);

/** Guscio in un'unica superficie: cupola, bordo e visiera sono continui (la visiera è un prolungamento della cupola).
 *  Sulla sommità, tre nervature rialzate con le scanalature in mezzo. */
function guscioCasco() {
  const NT = 160, NA = 44, NB = 16, RIGHE = NA + 1 + NB;
  const t0 = 0.03, t1 = Math.acos(Math.pow(0.105, N / 2));
  const rilievo = (x: number, z: number) => {
    const t = (z + 0.95) / 1.3; // 0 = dietro, 1 = poco prima del bollo
    if (t <= 0 || t >= 1) return 0;
    const lungo = liscia(Math.min(1, t * 4)) * liscia(Math.min(1, (1 - t) * 6)) * (1 - 0.3 * t);
    let nerv = 0;
    for (const xi of [-0.21, 0, 0.21]) nerv += Math.exp(-Math.pow((x - xi) / 0.06, 2));
    const base = liscia(Math.min(1, Math.max(0, (0.36 - Math.abs(x)) / 0.08))) * 0.025;
    return lungo * (0.06 * Math.min(nerv, 1) + base);
  };
  const bordo = (th: number) => {
    const davanti = Math.exp(-Math.pow(th / 0.62, 4));
    const dietro = Math.exp(-Math.pow((Math.abs(th) - Math.PI) / 0.9, 2));
    return { ext: 0.09 + 0.36 * davanti + 0.06 * dietro, cala: 0.15 * davanti + 0.07 * dietro };
  };
  const pos: number[] = [0, H, 0], idx: number[] = [];
  const punti: Vector3[] = [];
  for (let j = 0; j < NT; j++) {
    const th = -Math.PI + (j / NT) * Math.PI * 2, sn = Math.sin(th), cs = Math.cos(th);
    const { ext, cala } = bordo(th);
    let rFine = 1, yFine = 0.105;
    for (let i = 0; i <= NA; i++) {
      const t = t0 + (i / NA) * (t1 - t0);
      const r = Math.pow(Math.sin(t), 2 / N), y = H * Math.pow(Math.cos(t), 2 / N);
      pos.push(r * sn, y + rilievo(r * sn, r * cs), r * cs);
      rFine = r; yFine = y;
    }
    for (let k = 1; k <= NB; k++) {
      const u = k / NB;
      const r = rFine + (1 + ext - rFine) * u, y = yFine * (1 - u) * (1 - u) - cala * u * u;
      pos.push(r * sn, y, r * cs);
      if (k === NB) punti.push(new Vector3(r * sn, y, r * cs));
    }
  }
  const v = (j: number, i: number) => 1 + (j % NT) * RIGHE + i;
  for (let j = 0; j < NT; j++) {
    idx.push(0, v(j, 0), v(j + 1, 0));
    for (let i = 0; i < RIGHE - 1; i++) { const a = v(j, i), b = v(j + 1, i), c = v(j, i + 1), d = v(j + 1, i + 1); idx.push(a, c, b, b, c, d); }
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
  geo.setIndex(idx); geo.computeVertexNormals();
  const g = new Group();
  g.add(new Mesh(geo, arancio()));
  // spessore arrotondato sul bordo
  g.add(new Mesh(new TubeGeometry(new CatmullRomCurve3(punti, true), 220, 0.024, 10, true), arancio()));
  return g;
}

function casco() {
  const g = new Group();
  const guscio = new Group(); guscio.scale.z = SCALA_Z; g.add(guscio);
  guscio.add(guscioCasco());

  // alette rettangolari sul bordo
  [35, 90, 145, 215, 270, 325].forEach((gr) => {
    const a = (gr * Math.PI) / 180;
    const aletta = new Mesh(new RoundedBoxGeometry(0.24, 0.1, 0.09, 3, 0.02), arancio());
    aletta.position.set(Math.sin(a) * 1.07, 0.0, Math.cos(a) * 1.07); aletta.rotation.y = a; guscio.add(aletta);
  });
  // interno scuro visibile da sotto
  const interno = new Mesh(new CylinderGeometry(0.97, 0.97, 0.02, 48), plastica(0x15181a, 0.8)); interno.position.y = 0.02; guscio.add(interno);

  guscio.add(bollo());
  g.scale.setScalar(1.2); g.position.y = -0.22;
  return g;
}

/* ---------- Cartellina con documento ---------- */
function cartellina() {
  const g = new Group();
  const cart = new MeshPhysicalMaterial({ color: 0xe9650a, roughness: 0.5, clearcoat: 0.3 });
  const dietro = new Mesh(new RoundedBoxGeometry(1.7, 1.25, 0.07, 4, 0.04), cart); g.add(dietro);
  const linguetta = new Mesh(new RoundedBoxGeometry(0.62, 0.17, 0.07, 4, 0.04), cart); linguetta.position.set(-0.54, 0.69, 0); g.add(linguetta);
  // foglio
  const foglio = new Group(); foglio.position.set(0, 0.16, 0.06);
  foglio.add(new Mesh(new RoundedBoxGeometry(1.46, 1.1, 0.02, 3, 0.01), plastica(0xf7f4ef, 0.8)));
  const riga = (w: number, y: number, x = -0.1) => { const r = new Mesh(new BoxGeometry(w, 0.05, 0.004), plastica(0xb9b4ad, 0.9)); r.position.set(x, y, 0.012); foglio.add(r); };
  riga(0.9, 0.3); riga(1.15, 0.16); riga(1.05, 0.02); riga(0.7, -0.12);
  // spunta in cerchio
  const cerchio = new Mesh(new CylinderGeometry(0.17, 0.17, 0.008, 36), plastica(0x2f8f4e, 0.5)); cerchio.rotation.x = Math.PI / 2; cerchio.position.set(0.42, 0.34, 0.014); foglio.add(cerchio);
  const tratto = (w: number, x: number, y: number, rot: number) => { const t = new Mesh(new BoxGeometry(w, 0.045, 0.006), plastica(0xffffff, 0.4)); t.position.set(x, y, 0.022); t.rotation.z = rot; foglio.add(t); };
  tratto(0.12, 0.375, 0.315, -0.78); tratto(0.22, 0.465, 0.35, 0.78);
  g.add(foglio);
  // fronte della cartellina
  const fronte = new Mesh(new RoundedBoxGeometry(1.7, 0.86, 0.05, 4, 0.04), cart); fronte.position.set(0, -0.2, 0.12); g.add(fronte);
  // marchio SSL sul fronte della cartellina
  const marchio = new Mesh(new CircleGeometry(0.27, 48), new MeshStandardMaterial({ map: texturaMarchio(), roughness: 0.5, transparent: true }));
  marchio.position.set(0, -0.2, 0.147); g.add(marchio);
  g.scale.setScalar(1.0);
  return g;
}

/* ---------- Estintore ---------- */
function estintore() {
  const g = new Group();
  const rosso = new MeshPhysicalMaterial({ color: 0xd8392c, roughness: 0.3, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.15, side: DoubleSide });
  const nero = plastica(0x1d2023, 0.5);
  const prof = [[0, -0.72], [0.27, -0.72], [0.34, -0.62], [0.34, 0.42], [0.3, 0.6], [0.19, 0.7], [0.13, 0.74], [0.13, 0.82], [0, 0.82]].map(([x, y]) => new Vector2(x, y));
  g.add(new Mesh(new LatheGeometry(prof, 56), rosso));
  const etichetta = new Mesh(new CylinderGeometry(0.348, 0.348, 0.52, 40, 1, true, -Math.PI * 0.42, Math.PI * 0.84), plastica(0xf3efe6, 0.7));
  etichetta.material.side = DoubleSide; etichetta.position.y = -0.02; g.add(etichetta);
  const teta = 0.17 / 0.352;
  const marchio = new Mesh(new CylinderGeometry(0.352, 0.352, 0.34, 40, 1, true, -teta, teta * 2), new MeshStandardMaterial({ map: texturaMarchio(), roughness: 0.5, transparent: true, side: DoubleSide }));
  marchio.position.y = -0.02; g.add(marchio);
  const testa = new Mesh(new CylinderGeometry(0.15, 0.17, 0.2, 28), nero); testa.position.y = 0.94; g.add(testa);
  const leva = new Mesh(new RoundedBoxGeometry(0.56, 0.06, 0.12, 3, 0.02), nero); leva.position.set(0.1, 1.08, 0); leva.rotation.z = 0.08; g.add(leva);
  const fissa = new Mesh(new RoundedBoxGeometry(0.46, 0.06, 0.12, 3, 0.02), nero); fissa.position.set(-0.02, 1.0, 0); fissa.rotation.z = -0.05; g.add(fissa);
  const manometro = new Mesh(new CylinderGeometry(0.07, 0.07, 0.05, 24), plastica(0xd9d6d0, 0.3)); manometro.rotation.x = Math.PI / 2; manometro.position.set(-0.12, 0.93, 0.15); g.add(manometro);
  const curva = new CatmullRomCurve3([new Vector3(0.14, 0.9, 0.04), new Vector3(0.5, 0.86, 0.14), new Vector3(0.58, 0.45, 0.2), new Vector3(0.5, 0.05, 0.2)]);
  g.add(new Mesh(new TubeGeometry(curva, 40, 0.032, 10, false), nero));
  const ugello = new Mesh(new CylinderGeometry(0.05, 0.035, 0.16, 16), nero); ugello.position.set(0.5, -0.02, 0.2); g.add(ugello);
  g.scale.setScalar(0.95); g.position.y = -0.12;
  return g;
}

const COSTRUTTORI: Record<string, () => Group> = { casco, cartellina, estintore };

/* Quali oggetti su quale pagina */
function oggettiPerPagina(p: string): string[] {
  if (p === '/') return ['casco', 'cartellina', 'estintore'];
  if (p.startsWith('/formazione')) return ['casco', 'estintore'];
  if (p.startsWith('/consulenza')) return ['cartellina', 'casco'];
  if (p.startsWith('/chi-siamo')) return ['casco'];
  if (p.startsWith('/f-gas')) return ['estintore'];
  return [];
}

type Voce = { g: Group; peso: number; lato: number; indice: number; tipo: string };

function avvia() {
  if (!canvas) return;
  let renderer: WebGLRenderer;
  try { renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' }); } catch { return; }
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scena = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scena.environmentIntensity = 0.55;
  const luce = new DirectionalLight(0xfff1e0, 1.5); luce.position.set(-3, 5, 6); scena.add(luce);
  const cam = new PerspectiveCamera(30, 1, 0.1, 100); cam.position.z = 14;

  const voci = new Map<string, Voce>();
  let w = 0, h = 0, piccolo = false;
  const ridimensiona = () => {
    w = innerWidth; h = innerHeight; piccolo = w < 900;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setSize(w, h, false);
    cam.aspect = w / h; cam.updateProjectionMatrix();
  };
  addEventListener('resize', ridimensiona); ridimensiona();

  function configura() {
    const nomi = oggettiPerPagina(location.pathname);
    voci.forEach((v, k) => { if (!nomi.includes(k)) v.peso = -1; }); // verrà ridotto e tolto
    nomi.forEach((n, i) => {
      let v = voci.get(n);
      if (!v) {
        const g = COSTRUTTORI[n](); g.scale.multiplyScalar(0.001); scena.add(g);
        v = { g, peso: 0, lato: 1, indice: i, tipo: n }; voci.set(n, v);
      }
      v.peso = 1; v.indice = i; v.lato = (i % 2 === 0) ? 1 : -1;
    });
    voci.forEach((v) => { if (v.peso === 1) v.g.userData.n = nomi.length; });
  }
  configura();
  document.addEventListener('astro:page-load', configura);

  const altezzaVista = 2 * cam.position.z * Math.tan((cam.fov * Math.PI) / 360);
  let scorr = scrollY, tScorr = scrollY, ultimo = 0, docH = document.documentElement.scrollHeight, tDoc = 0;
  const scalaBase = new Map<Group, number>();

  function frame(ora: number) {
    requestAnimationFrame(frame);
    if (document.hidden) return;
    const dt = ora - ultimo;
    const inMovimento = Math.abs(tScorr - scorr) > 0.5;
    if (!inMovimento && dt < 33) return; // da fermi: ~30 immagini al secondo
    ultimo = ora;
    tScorr = scrollY;
    scorr += (tScorr - scorr) * 0.12;
    if (ora - tDoc > 600) { docH = document.documentElement.scrollHeight; tDoc = ora; }
    const t = ridotto ? 0 : ora / 1000;
    const larghVista = altezzaVista * cam.aspect;
    const n = Math.max(voci.size, 1);

    voci.forEach((v, nome) => {
      const g = v.g;
      if (!scalaBase.has(g)) scalaBase.set(g, g.scale.x / 0.001);
      const sb = scalaBase.get(g)!;
      // dissolvenza in entrata/uscita
      const target = v.peso === 1 ? 1 : 0;
      g.userData.k = (g.userData.k ?? 0) + (target - (g.userData.k ?? 0)) * 0.08;
      const k = g.userData.k as number;
      if (target === 0 && k < 0.01) { scena.remove(g); voci.delete(nome); return; }
      const fattore = (piccolo ? 0.8 : 1) * Math.max(k, 0.001);
      g.scale.setScalar(sb * fattore);

      // posizione verticale: segue la pagina più lentamente (profondità)
      const quanti = (g.userData.n as number) || n;
      const partenza = location.pathname === '/' ? 1.1 : 0.42; // in home il primo oggetto compare dopo la parte con la mappa
      const ancora = h * partenza + v.indice * ((docH - h * partenza - h * 0.4) * 0.9 / quanti);
      const vy = 0.5 + ((ancora - scorr) * 0.7) / h;
      g.position.y = (0.5 - vy) * altezzaVista;
      g.visible = vy > -0.35 && vy < 1.35;
      // Posizione orizzontale: a metà strada tra il centro dei contenuti e il margine esterno.
      const dalCentro = piccolo ? w * 0.43 : (w * 0.3 + Math.min((700 + w / 2) / 2, w / 2 - 45)) / 2; // via di mezzo tra posizione interna (30% della larghezza) e margine esterno
      const x = (dalCentro / (w / 2)) * (larghVista / 2);
      g.position.x = v.lato * x;
      // rotazione con lo scorrimento (+ un lieve movimento da fermo)
      const giro = scorr * 0.0042 + v.indice * 1.7;
      if (v.tipo === 'casco') { g.rotation.y = Math.sin(giro * 0.45) * 1.0 + (v.lato > 0 ? -0.55 : 0.55); g.rotation.x = 0.14 + Math.cos(giro * 0.35) * 0.06; }
      else { g.rotation.y = Math.sin(giro * 0.55) * 0.95 + (v.lato > 0 ? -0.35 : 0.35); g.rotation.x = 0.1 + Math.cos(giro * 0.4) * 0.12; }
      g.rotation.z = (v.lato > 0 ? -1 : 1) * 0.12 + Math.sin(t * 0.7 + v.indice) * 0.03;
      g.position.y += Math.sin(t * 0.9 + v.indice * 2) * 0.06;
      if (v.tipo === 'cartellina') g.position.y += 0.55; // un po' più in alto
    });
    renderer.render(scena, cam);
  }
  requestAnimationFrame(frame);
  canvas.dataset.pronto = '1';
}

avvia();
