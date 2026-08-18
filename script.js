import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.178.0/build/three.module.js";

const canvas = document.getElementById("three-canvas");

const scene = new THREE.Scene();

scene.fog = new THREE.FogExp2(
  0x050505,
  0.035
);

const camera = new THREE.PerspectiveCamera(
  45,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  100
);

camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true
});

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
  canvas.clientWidth,
  canvas.clientHeight,
  false
);

const ambientLight = new THREE.AmbientLight(
  0xffffff,
  1.5
);

scene.add(ambientLight);

const purpleLight = new THREE.PointLight(
  0x8066ff,
  25,
  10
);

purpleLight.position.set(
  2,
  2,
  3
);

scene.add(purpleLight);

const blueLight = new THREE.PointLight(
  0x3355ff,
  15,
  10
);

blueLight.position.set(
  -3,
  -2,
  2
);

scene.add(blueLight);

const geometry =
  new THREE.IcosahedronGeometry(
    1.45,
    5
  );

const material =
  new THREE.MeshPhysicalMaterial({
    color: 0x19132e,
    roughness: 0.18,
    metalness: 0.8,
    transmission: 0.15,
    thickness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0.15
  });

const sphere =
  new THREE.Mesh(
    geometry,
    material
  );

scene.add(sphere);

const wireGeometry =
  new THREE.IcosahedronGeometry(
    1.52,
    3
  );

const wireMaterial =
  new THREE.MeshBasicMaterial({
    color: 0x8066ff,
    wireframe: true,
    transparent: true,
    opacity: 0.16
  });

const wireSphere =
  new THREE.Mesh(
    wireGeometry,
    wireMaterial
  );

scene.add(wireSphere);

function createRing(
  radius,
  tube,
  rotation
) {
  const geometry =
    new THREE.TorusGeometry(
      radius,
      tube,
      24,
      100
    );

  const material =
    new THREE.MeshBasicMaterial({
      color: 0x8066ff,
      transparent: true,
      opacity: 0.35
    });

  const ring =
    new THREE.Mesh(
      geometry,
      material
    );

  ring.rotation.set(
    rotation.x,
    rotation.y,
    rotation.z
  );

  scene.add(ring);

  return ring;
}

const ring1 = createRing(
  2,
  0.008,
  {
    x: 0.5,
    y: 0.3,
    z: 0
  }
);

const ring2 = createRing(
  2.25,
  0.006,
  {
    x: -0.8,
    y: 0.5,
    z: 0.3
  }
);

const particleCount = 1000;

const positions =
  new Float32Array(
    particleCount * 3
  );

for (
  let i = 0;
  i < particleCount * 3;
  i += 3
) {
  positions[i] =
    (Math.random() - 0.5) * 12;

  positions[i + 1] =
    (Math.random() - 0.5) * 12;

  positions[i + 2] =
    (Math.random() - 0.5) * 10;
}

const particleGeometry =
  new THREE.BufferGeometry();

particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(
    positions,
    3
  )
);

const particleMaterial =
  new THREE.PointsMaterial({
    color: 0x8f7cff,
    size: 0.015,
    transparent: true,
    opacity: 0.6
  });

const particles =
  new THREE.Points(
    particleGeometry,
    particleMaterial
  );

scene.add(particles);

const mouse = {
  x: 0,
  y: 0
};

const target = {
  x: 0,
  y: 0
};

window.addEventListener(
  "mousemove",
  (event) => {
    target.x =
      (event.clientX /
        window.innerWidth -
        0.5) *
      2;

    target.y =
      (event.clientY /
        window.innerHeight -
        0.5) *
      2;
  }
);

let scrollY = 0;

window.addEventListener(
  "scroll",
  () => {
    scrollY =
      window.scrollY;
  }
);

const clock =
  new THREE.Clock();

function animate() {
  requestAnimationFrame(
    animate
  );

  const elapsed =
    clock.getElapsedTime();

  mouse.x +=
    (target.x - mouse.x) *
    0.04;

  mouse.y +=
    (target.y - mouse.y) *
    0.04;

  sphere.rotation.x =
    elapsed * 0.18 +
    mouse.y * 0.3;

  sphere.rotation.y =
    elapsed * 0.25 +
    mouse.x * 0.5;

  wireSphere.rotation.x =
    -elapsed * 0.1;

  wireSphere.rotation.y =
    elapsed * 0.18;

  ring1.rotation.z =
    elapsed * 0.12;

  ring2.rotation.x =
    elapsed * 0.1;

  particles.rotation.y =
    elapsed * 0.015;

  particles.rotation.x =
    mouse.y * 0.03;

  camera.position.x +=
    (mouse.x * 0.35 -
      camera.position.x) *
    0.03;

  camera.position.y +=
    (-mouse.y * 0.25 -
      camera.position.y) *
    0.03;

  camera.lookAt(
    0,
    0,
    0
  );

  renderer.render(
    scene,
    camera
  );
}

animate();

function resize() {
  const width =
    canvas.clientWidth;

  const height =
    canvas.clientHeight;

  camera.aspect =
    width / height;

  camera.updateProjectionMatrix();

  renderer.setSize(
    width,
    height,
    false
  );
}

window.addEventListener(
  "resize",
  resize
);

resize();