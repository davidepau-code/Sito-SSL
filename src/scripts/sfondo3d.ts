// Sfondo 3D (ESPERIMENTO): oggetti della sicurezza (casco, cartellina, estintore) disegnati in codice, senza file esterni.
// Si muovono e ruotano con lo scorrimento della pagina, dietro ai contenuti. Per toglierlo: rimuovere <Sfondo3D /> da Base.astro.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, Vector2, Vector3, Color, ACESFilmicToneMapping, SRGBColorSpace, PMREMGenerator, DirectionalLight,
  MeshPhysicalMaterial, MeshStandardMaterial, LatheGeometry, CylinderGeometry, TorusGeometry, BoxGeometry, TubeGeometry, CatmullRomCurve3, DoubleSide,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const canvas = document.getElementById('sfondo3d') as HTMLCanvasElement | null;
const ridotto = matchMedia('(prefers-reduced-motion: reduce)').matches;

const arancio = () => new MeshPhysicalMaterial({ color: 0xe9650a, roughness: 0.4, metalness: 0.0, clearcoat: 0.8, clearcoatRoughness: 0.2, side: DoubleSide });
const plastica = (c: number, r = 0.5) => new MeshStandardMaterial({ color: c, roughness: r, metalness: 0.05 });

/* ---------- Casco ---------- */
function casco() {
  const g = new Group();
  const m = arancio();
  const prof: Vector2[] = [];
  for (let i = 0; i <= 28; i++) { const t = (i / 28) * (Math.PI / 2); prof.push(new Vector2(Math.sin(t), Math.cos(t) * 0.92)); }
  prof.push(new Vector2(1.04, -0.03), new Vector2(1.15, -0.07), new Vector2(1.17, -0.12), new Vector2(1.08, -0.13), new Vector2(0.97, -0.1));
  g.add(new Mesh(new LatheGeometry(prof, 72), m));
  // visiera
  const vis = new Mesh(new CylinderGeometry(1.1, 1.36, 0.16, 56, 1, true, -Math.PI * 0.4, Math.PI * 0.8), m);
  vis.position.y = -0.06; g.add(vis);
  // nervature
  [-0.42, 0, 0.42].forEach((a, i) => {
    const r = new Mesh(new TorusGeometry(1.0, i === 1 ? 0.055 : 0.04, 14, 56, Math.PI), arancio());
    r.scale.y = 0.93; r.rotation.y = Math.PI / 2 + a; g.add(r);
  });
  // fascia sul bordo
  const fascia = new Mesh(new CylinderGeometry(1.045, 1.075, 0.07, 64, 1, true), plastica(0x24282c, 0.6));
  fascia.position.y = -0.09; g.add(fascia);
  g.scale.setScalar(1.15); g.position.y = -0.06;
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
      const fattore = (piccolo ? 0.62 : 1) * Math.max(k, 0.001);
      g.scale.setScalar(sb * fattore);

      // posizione verticale: segue la pagina più lentamente (profondità)
      const quanti = (g.userData.n as number) || n;
      const ancora = h * 0.42 + v.indice * ((docH - h) * 0.9 / quanti);
      const vy = 0.5 + ((ancora - scorr) * 0.7) / h;
      g.position.y = (0.5 - vy) * altezzaVista;
      g.visible = vy > -0.35 && vy < 1.35;
      const x = (piccolo ? 0.42 : 0.74) * (larghVista / 2);
      g.position.x = v.lato * x;
      // rotazione con lo scorrimento (+ un lieve movimento da fermo)
      const giro = scorr * 0.0042 + v.indice * 1.7;
      if (v.tipo === 'casco') { g.rotation.y = giro; g.rotation.x = 0.28 + Math.sin(giro * 0.5) * 0.1; }
      else { g.rotation.y = Math.sin(giro * 0.55) * 0.95 + (v.lato > 0 ? -0.35 : 0.35); g.rotation.x = 0.1 + Math.cos(giro * 0.4) * 0.12; }
      g.rotation.z = (v.lato > 0 ? -1 : 1) * 0.12 + Math.sin(t * 0.7 + v.indice) * 0.03;
      g.position.y += Math.sin(t * 0.9 + v.indice * 2) * 0.06;
    });
    renderer.render(scena, cam);
  }
  requestAnimationFrame(frame);
  canvas.dataset.pronto = '1';
}

avvia();
