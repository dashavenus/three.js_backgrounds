import * as THREE from "three";
import Star from "./components/Star.js";
import Mist from "./components/Mist.js";

let scene, camera, renderer, clock;
const stars = [];
let mist;

init();
animate();

function init() {
  scene = new THREE.Scene();

  // более глубокий тёмно-голубой фон
  const deepBlueHex = 0x020718; // ещё темнее
  scene.background = new THREE.Color(deepBlueHex);

  // лёгкий экспоненциальный туман для глубины
  scene.fog = new THREE.FogExp2(deepBlueHex, 0.02);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 8;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(deepBlueHex);
  renderer.autoClear = true;
  document.body.appendChild(renderer.domElement);

  clock = new THREE.Clock();

  // mist (объёмная дымка)
  mist = new Mist(scene);

  // большое количество звёзд
  for (let i = 0; i < 300; i++) {
    const s = new Star(scene);
    // каждую звезду даём случайный renderOrder и немного различную прозрачность
    s.starMesh.renderOrder = 9000 + Math.floor(Math.random() * 1000);
    stars.push(s);
  }

  window.addEventListener("resize", onResize);
  onResize();
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  for (let s of stars) s.update(t);
  if (mist) mist.update(t);

  renderer.render(scene, camera);
}