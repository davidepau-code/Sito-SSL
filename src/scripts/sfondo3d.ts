// Sfondo 3D (ESPERIMENTO): oggetti della sicurezza (casco, cartellina, estintore) disegnati in codice, senza file esterni.
// Si muovono e ruotano con lo scorrimento della pagina, dietro ai contenuti. Per toglierlo: rimuovere <Sfondo3D /> da Base.astro.
import {
  BufferGeometry, CircleGeometry, Float32BufferAttribute, CanvasTexture, WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, Vector2, Vector3, Color, ACESFilmicToneMapping, SRGBColorSpace, PMREMGenerator, DirectionalLight,
  MeshPhysicalMaterial, MeshStandardMaterial, LatheGeometry, CylinderGeometry, TorusGeometry, BoxGeometry, TubeGeometry, CatmullRomCurve3, DoubleSide, SphereGeometry, Box3,
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

let _texMarchio: CanvasTexture | null = null;
function texturaMarchio() {
  if (_texMarchio) return _texMarchio;
  const c = document.createElement('canvas'); c.width = c.height = 512;
  const x = c.getContext('2d')!;
  x.fillStyle = '#ffffff'; x.beginPath(); x.arc(256, 256, 252, 0, Math.PI * 2); x.fill();
  const tex = new CanvasTexture(c); tex.colorSpace = SRGBColorSpace; tex.anisotropy = 4; _texMarchio = tex;
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


/* ================= Altri oggetti (uno per area dei corsi) ================= */
type Mat = MeshStandardMaterial | MeshPhysicalMaterial;
const mat = (c: number, r = 0.5, m = 0) => new MeshStandardMaterial({ color: c, roughness: r, metalness: m });
const metallo = (c = 0xc3c8cd) => new MeshStandardMaterial({ color: c, roughness: 0.3, metalness: 0.85 });
const scatola = (w: number, h: number, d: number, m: Mat, x = 0, y = 0, z = 0, r = 0.02) => {
  const me = new Mesh(new RoundedBoxGeometry(w, h, d, 3, Math.max(0.002, Math.min(r, w / 2 - 0.002, h / 2 - 0.002, d / 2 - 0.002))), m);
  me.position.set(x, y, z); return me;
};
const cilindro = (rt: number, rb: number, h: number, m: Mat, x = 0, y = 0, z = 0, asse: 'x' | 'y' | 'z' = 'y', seg = 36) => {
  const me = new Mesh(new CylinderGeometry(rt, rb, h, seg), m);
  if (asse === 'x') me.rotation.z = Math.PI / 2;
  if (asse === 'z') me.rotation.x = Math.PI / 2;
  me.position.set(x, y, z); return me;
};
const bolloPiano = (r: number, x: number, y: number, z: number, ry = 0) => {
  const me = new Mesh(new CircleGeometry(r, 40), new MeshStandardMaterial({ map: texturaMarchio(), roughness: 0.5, transparent: true }));
  me.position.set(x, y, z); me.rotation.y = ry; return me;
};
/** Centra l'oggetto e lo porta a una dimensione massima di riferimento. */
function normalizza(g: Group, massimo: number) {
  const b = new Box3().setFromObject(g); const c = b.getCenter(new Vector3()); const d = b.getSize(new Vector3());
  g.position.sub(c);
  const w = new Group(); w.add(g); w.scale.setScalar(massimo / Math.max(d.x, d.y, d.z));
  return w;
}

/* ---------- Cassetta di primo soccorso ---------- */
function cassetta() {
  const g = new Group();
  const verde = new MeshPhysicalMaterial({ color: 0x2e9e5b, roughness: 0.4, clearcoat: 0.6, clearcoatRoughness: 0.2 });
  const verdeScuro = mat(0x1f7a44, 0.5);
  g.add(scatola(1.5, 1.0, 0.5, verde, 0, 0, 0, 0.1));
  g.add(scatola(1.52, 0.03, 0.52, verdeScuro, 0, 0.1, 0, 0.005));
  const manig = new Mesh(new TorusGeometry(0.27, 0.045, 14, 36, Math.PI), verdeScuro); manig.position.y = 0.5; g.add(manig);
  const bianco = mat(0xffffff, 0.45);
  g.add(scatola(0.52, 0.17, 0.035, bianco, 0, -0.17, 0.26, 0.02));
  g.add(scatola(0.17, 0.52, 0.035, bianco, 0, -0.17, 0.26, 0.02));
  [-0.52, 0.52].forEach((x) => g.add(scatola(0.15, 0.17, 0.07, metallo(), x, 0.1, 0.26, 0.02)));
  g.add(bolloPiano(0.12, 0.55, -0.34, 0.262));
  return normalizza(g, 1.9);
}

/* ---------- Carrello elevatore ---------- */
function carrello() {
  const g = new Group();
  const arc = arancio(), nero = mat(0x1d2023, 0.7), grigio = metallo(0x8c939a);
  g.add(scatola(0.95, 0.42, 1.45, arc, 0, 0.36, -0.05, 0.1));                 // telaio
  g.add(scatola(0.95, 0.62, 0.55, arc, 0, 0.5, -0.78, 0.14));                 // contrappeso
  g.add(scatola(0.8, 0.07, 0.9, nero, 0, 0.62, -0.25, 0.02));                 // pedana
  g.add(scatola(0.46, 0.13, 0.4, nero, 0, 0.72, -0.5, 0.04));                 // sedile
  g.add(scatola(0.46, 0.5, 0.09, nero, 0, 0.98, -0.7, 0.04));
  // gabbia di protezione
  [[-0.41, -0.7], [0.41, -0.7], [-0.41, 0.28], [0.41, 0.28]].forEach(([x, z]) => g.add(scatola(0.055, 1.0, 0.055, grigio, x, 1.1, z, 0.01)));
  g.add(scatola(0.95, 0.055, 1.05, arc, 0, 1.62, -0.21, 0.02));
  const piantone = cilindro(0.02, 0.02, 0.3, nero, 0, 0.8, 0.09, 'y'); piantone.rotation.x = 0.7; g.add(piantone);
  const volante = cilindro(0.12, 0.12, 0.03, nero, 0, 0.92, 0.14, 'y'); volante.rotation.x = 0.7; g.add(volante);
  // montante e forche
  [-0.3, 0.3].forEach((x) => g.add(scatola(0.09, 1.75, 0.11, grigio, x, 0.95, 0.88, 0.015)));
  [0.25, 1.45].forEach((y) => g.add(scatola(0.69, 0.07, 0.1, grigio, 0, y, 0.88, 0.015)));
  g.add(scatola(0.78, 0.28, 0.07, nero, 0, 0.42, 0.96, 0.02));
  [-0.22, 0.22].forEach((x) => {
    g.add(scatola(0.12, 0.5, 0.05, grigio, x, 0.33, 1.0, 0.01));
    g.add(scatola(0.12, 0.05, 1.05, grigio, x, 0.1, 1.5, 0.01));
  });
  // ruote
  ([[-0.52, 0.42, 0.3], [0.52, 0.42, 0.3], [-0.52, -0.82, 0.26], [0.52, -0.82, 0.26]] as number[][]).forEach(([x, z, r]) => {
    g.add(cilindro(r, r, 0.26, nero, x, r, z, 'x', 32));
    g.add(cilindro(r * 0.55, r * 0.55, 0.28, grigio, x, r, z, 'x', 24));
  });
  g.add(bolloPiano(0.18, 0.478, 0.4, -0.15, Math.PI / 2));
  g.add(bolloPiano(0.18, -0.478, 0.4, -0.15, -Math.PI / 2));
  return normalizza(g, 2.2);
}

/* ---------- Moschettone e corda (lavori in quota) ---------- */
function quota_() {
  const g = new Group();
  const corda = mat(0xee6a0c, 0.75), bianca = mat(0xf3efe6, 0.7);
  const pts: Vector3[] = [];
  for (let i = 0; i <= 160; i++) { const a = (i / 160) * Math.PI * 7; const r = 0.42 + 0.13 * (a / (Math.PI * 2)); pts.push(new Vector3(r * Math.cos(a), r * Math.sin(a), 0.002 * a)); }
  g.add(new Mesh(new TubeGeometry(new CatmullRomCurve3(pts), 480, 0.062, 10, false), corda));
  const treccia = pts.map((q) => q.clone().add(new Vector3(0, 0, 0.05)));
  g.add(new Mesh(new TubeGeometry(new CatmullRomCurve3(treccia), 480, 0.012, 6, false), bianca));
  // moschettone
  const ca = new Group();
  const forma = ([[-0.27, -0.62], [-0.28, -0.1], [-0.25, 0.36], [-0.08, 0.64], [0.16, 0.64], [0.33, 0.4], [0.35, -0.05], [0.3, -0.4], [0.15, -0.62], [-0.05, -0.68]] as number[][]).map(([x, y]) => new Vector3(x, y, 0));
  ca.add(new Mesh(new TubeGeometry(new CatmullRomCurve3(forma, true), 160, 0.065, 14, true), metallo(0xd2d6da)));
  const giallo = mat(0xe7b200, 0.35, 0.4);
  const porta = ([[0.16, 0.64], [0.33, 0.4], [0.35, -0.05], [0.3, -0.4]] as number[][]).map(([x, y]) => new Vector3(x, y, 0.004));
  ca.add(new Mesh(new TubeGeometry(new CatmullRomCurve3(porta), 60, 0.07, 14, false), giallo));
  ca.add(cilindro(0.085, 0.085, 0.2, giallo, 0.345, -0.22, 0, 'y'));
  ca.position.set(0.55, 0.55, 0.22); ca.rotation.z = -0.35; g.add(ca);
  return normalizza(g, 2.0);
}

/* ---------- Cappello da cuoco ---------- */
function cappello() {
  const g = new Group();
  const bianco = new MeshStandardMaterial({ color: 0xfaf8f4, roughness: 0.75, side: DoubleSide });
  const pieghe = (geo: BufferGeometry, n: number, a: number) => {
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i); const t = Math.atan2(z, x); const k = 1 + a * Math.sin(n * t); p.setX(i, x * k); p.setZ(i, z * k); }
    geo.computeVertexNormals(); return geo;
  };
  // profilo del cappello: fascia dritta, poi la parte alta che si allarga e si chiude con un cappuccio piatto
  const profilo = new CatmullRomCurve3(([[0.5, -0.36], [0.5, 0.05], [0.53, 0.3], [0.63, 0.52], [0.7, 0.78], [0.66, 1.02], [0.5, 1.13], [0.26, 1.16], [0.0, 1.17]] as number[][]).map(([x, y]) => new Vector3(x, y, 0)));
  const pr = profilo.getPoints(70).map((q) => new Vector2(Math.max(q.x, 0), q.y));
  const cappelloGeo = pieghe(new LatheGeometry(pr, 120), 26, 0.028);
  const corpoCap = new Mesh(cappelloGeo, bianco); g.add(corpoCap);
  const fascia = new Mesh(new TorusGeometry(0.505, 0.035, 14, 80), new MeshStandardMaterial({ color: 0xee6a0c, roughness: 0.4 }));
  fascia.rotation.x = Math.PI / 2; fascia.position.y = -0.33; g.add(fascia);
  g.add(bolloPiano(0.19, 0, -0.1, 0.505));
  return normalizza(g, 1.9);
}

/* ---------- Escavatore ---------- */
function escavatore() {
  const g = new Group();
  const arc = arancio(), nero = mat(0x1d2023, 0.8), grigio = metallo(0x8c939a);
  const vetro = new MeshPhysicalMaterial({ color: 0x35424d, roughness: 0.1, metalness: 0.3, transparent: true, opacity: 0.8 });
  // cingoli
  [-0.62, 0.62].forEach((x) => {
    g.add(scatola(0.36, 0.34, 1.9, nero, x, 0.2, 0, 0.16));
    [-0.7, 0, 0.7].forEach((z) => g.add(cilindro(0.1, 0.1, 0.38, grigio, x, 0.2, z, 'x', 20)));
  });
  g.add(scatola(1.1, 0.22, 1.5, mat(0x2b3035, 0.6), 0, 0.38, 0, 0.04));
  // torretta
  const torre = new Group(); torre.position.y = 0.52; g.add(torre);
  torre.add(scatola(1.35, 0.4, 1.7, arc, 0, 0.18, -0.12, 0.1));
  torre.add(scatola(1.3, 0.5, 0.55, arc, 0, 0.3, -0.78, 0.14));                  // contrappeso
  torre.add(scatola(0.66, 0.85, 0.7, arc, -0.28, 0.82, 0.12, 0.08));             // cabina
  torre.add(scatola(0.6, 0.58, 0.02, vetro, -0.28, 0.9, 0.485, 0.01));           // vetro anteriore
  torre.add(scatola(0.02, 0.58, 0.55, vetro, -0.62, 0.9, 0.12, 0.01));           // vetro laterale
  torre.add(scatola(0.7, 0.05, 0.75, mat(0x2b3035, 0.5), -0.28, 1.27, 0.12, 0.02));
  torre.add(bolloPiano(0.2, 0.678, 0.18, -0.3, Math.PI / 2));
  // braccio: sale in avanti dal lato destro della cabina
  const braccio = new Group(); braccio.position.set(0.3, 0.4, 0.75); torre.add(braccio);
  const pezzo = (lun: number, sp: number, ang: number, x: number, y: number) => {
    const p = new Group(); p.position.set(x, y, 0); p.rotation.x = ang;
    p.add(scatola(sp, lun, sp * 1.1, arc, 0, lun / 2, 0, 0.05)); return p;
  };
  const boom = pezzo(1.5, 0.22, 0.85, 0, 0); braccio.add(boom);
  const asta = pezzo(1.05, 0.17, 1.45, 0, 1.5); boom.add(asta);
  const benna = new Group(); benna.position.set(0, 1.05, 0); asta.add(benna);
  const cuc = new Mesh(new CylinderGeometry(0.3, 0.3, 0.55, 28, 1, true, 0, Math.PI * 1.1), mat(0x4a5057, 0.5, 0.5));
  cuc.material.side = DoubleSide;
  cuc.rotation.set(0, 0.3, Math.PI / 2); cuc.position.set(0, 0.12, 0.1); benna.add(cuc);
  benna.add(cilindro(0.06, 0.06, 0.58, grigio, 0, 0, 0, 'x', 16));
  // martinetti idraulici
  const mart = (x: number, y: number, z: number, l: number, rx: number) => { const c = cilindro(0.045, 0.045, l, grigio, x, y, z, 'y', 14); c.rotation.x = rx; return c; };
  braccio.add(mart(0, 0.55, -0.1, 0.9, 0.55));
  boom.add(mart(0, 1.0, 0.2, 0.9, -0.6));
  return normalizza(g, 2.5);
}

/* ---------- Bombola F-Gas ---------- */
function bombola() {
  const g = new Group();
  const corpo = new MeshPhysicalMaterial({ color: 0x3f9ec4, roughness: 0.3, metalness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.2, side: DoubleSide });
  const prof = ([[0, -0.8], [0.3, -0.8], [0.4, -0.72], [0.42, -0.5], [0.42, 0.46], [0.4, 0.62], [0.3, 0.76], [0.15, 0.82], [0.1, 0.84], [0.1, 0.9], [0, 0.9]] as number[][]).map(([x, y]) => new Vector2(x, y));
  g.add(new Mesh(new LatheGeometry(prof, 64), corpo));
  g.add(cilindro(0.4, 0.4, 0.07, mat(0x1d2023, 0.7), 0, -0.75, 0, 'y'));
  g.add(cilindro(0.09, 0.09, 0.16, mat(0xc9a24b, 0.35, 0.8), 0, 0.97, 0, 'y'));
  g.add(cilindro(0.04, 0.04, 0.3, metallo(), 0.12, 1.1, 0, 'x', 14));
  g.add(cilindro(0.16, 0.16, 0.05, mat(0x1d2023, 0.6), 0, 1.07, 0, 'y'));
  const bandaMat = mat(0xf3efe6, 0.6); bandaMat.side = DoubleSide;
  const banda = new Mesh(new CylinderGeometry(0.424, 0.424, 0.46, 48, 1, true), bandaMat); banda.position.y = -0.02; g.add(banda);
  const anello = new Mesh(new CylinderGeometry(0.43, 0.43, 0.07, 48, 1, true), mat(0xee6a0c, 0.5)); anello.position.y = 0.3; g.add(anello);
  const teta = 0.19 / 0.43;
  const m = new Mesh(new CylinderGeometry(0.43, 0.43, 0.38, 40, 1, true, -teta, teta * 2), new MeshStandardMaterial({ map: texturaMarchio(), roughness: 0.5, transparent: true, side: DoubleSide }));
  m.position.y = -0.02; g.add(m);
  return normalizza(g, 2.2);
}

const COSTRUTTORI: Record<string, () => Group> = { casco, cartellina, estintore, cassetta, carrello, quota: quota_, cappello, escavatore, bombola };

/* Quali oggetti su quale pagina. `sel` = elemento della pagina accanto al quale compare, `frac` = punto dell'elemento (0 alto, 1 basso). */
type Cfg = { n: string; sel?: string; frac?: number };
function oggettiPerPagina(p: string): Cfg[] {
  const tutti = (...n: string[]) => n.map((x) => ({ n: x }));
  if (p === '/') return tutti('casco', 'cartellina', 'carrello', 'estintore', 'quota', 'cappello', 'escavatore', 'cassetta');
  if (p.startsWith('/formazione/catalogo')) return [
    { n: 'casco', sel: '#sicurezza', frac: 0.15 }, { n: 'cassetta', sel: '#sicurezza', frac: 0.7 },
    { n: 'carrello', sel: '#attrezzature', frac: 0.15 }, { n: 'escavatore', sel: '#attrezzature', frac: 0.7 },
    { n: 'quota', sel: '#rischi', frac: 0.4 }, { n: 'cappello', sel: '#alimentare', frac: 0.4 },
  ];
  if (p.startsWith('/formazione')) return tutti('casco', 'cassetta', 'carrello', 'quota', 'cappello');
  if (p.startsWith('/consulenza/haccp')) return tutti('cappello');
  if (p.startsWith('/consulenza')) return tutti('cartellina', 'casco');
  if (p.startsWith('/chi-siamo')) return tutti('casco');
  if (p.startsWith('/f-gas')) return tutti('bombola');
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
  const prova: Group[] = [];
  let w = 0, h = 0, piccolo = false;
  const ridimensiona = () => {
    w = innerWidth; h = innerHeight; piccolo = w < 900;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setSize(w, h, false);
    cam.aspect = w / h; cam.updateProjectionMatrix();
  };
  addEventListener('resize', ridimensiona); ridimensiona();

  function configura() {
    const cfg = oggettiPerPagina(location.pathname);
    const nomi = cfg.map((c) => c.n);
    voci.forEach((v, k) => { if (!nomi.includes(k)) v.peso = -1; }); // verrà ridotto e tolto
    cfg.forEach((c, i) => {
      let v = voci.get(c.n);
      if (!v) {
        const g = COSTRUTTORI[c.n](); g.scale.multiplyScalar(0.001); scena.add(g);
        v = { g, peso: 0, lato: 1, indice: i, tipo: c.n }; voci.set(c.n, v);
      }
      v.peso = 1; v.indice = i; v.lato = (i % 2 === 0) ? 1 : -1;
      v.g.userData.sel = c.sel; v.g.userData.frac = c.frac ?? 0.5;
    });
    voci.forEach((v) => { if (v.peso === 1) v.g.userData.n = nomi.length; });
  }
  if (location.search.includes('prova3d')) {
    const q = new URLSearchParams(location.search);
    const richiesti = (q.get('prova3d') ?? '1').split(',').filter((n) => COSTRUTTORI[n]);
    const nomi = richiesti.length ? richiesti : Object.keys(COSTRUTTORI);
    const colonne = nomi.length <= 3 ? nomi.length : 4, scala = nomi.length <= 3 ? 1.5 : 0.8;
    nomi.forEach((n, i) => {
      const g = COSTRUTTORI[n](); const col = i % colonne, riga = Math.floor(i / colonne);
      const passo = nomi.length <= 3 ? 3.6 : 2.5;
      g.position.set((col - (colonne - 1) / 2) * passo, (0.5 - riga) * 2.9, 0); g.scale.multiplyScalar(scala); scena.add(g);
      g.userData.fisso = q.get('angolo');
      prova.push(g);
    });
    canvas.dataset.prova = '1';
  } else {
    configura();
    document.addEventListener('astro:page-load', configura);
  }

  const altezzaVista = 2 * cam.position.z * Math.tan((cam.fov * Math.PI) / 360);
  let scorr = scrollY, tScorr = scrollY, ultimo = 0, docH = document.documentElement.scrollHeight, tDoc = 0;
  const scalaBase = new Map<Group, number>();

  function frame(ora: number) {
    requestAnimationFrame(frame);
    if (document.hidden) return;
    if (prova.length) { prova.forEach((g, i) => { const f = g.userData.fisso; g.rotation.x = 0.15; g.rotation.y = f !== null && f !== undefined ? parseFloat(f) : -0.6 + Math.sin(ora / 2500 + i) * 0.9; }); renderer.render(scena, cam); return; }
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
      let ancora = h * partenza + v.indice * ((docH - h * partenza - h * 0.4) * 0.9 / quanti);
      const sel = g.userData.sel as string | undefined;
      if (sel) {
        const el = document.querySelector<HTMLElement>(sel);
        if (el && el.offsetParent !== null) { const r = el.getBoundingClientRect(); ancora = r.top + scrollY + r.height * (g.userData.frac as number); }
        else g.userData.k = Math.min(g.userData.k ?? 0, 0.02); // elemento nascosto (es. filtro del catalogo): l'oggetto scompare
      }
      const vy = sel ? (ancora - scorr) / h : 0.5 + ((ancora - scorr) * 0.7) / h; // con elemento di riferimento: allineato alla pagina
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
