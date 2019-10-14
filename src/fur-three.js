const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const { lerp } = require('canvas-sketch-util/math');
const palettes = require('nice-color-palettes/1000.json').slice(200);
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');

random.setSeed(random.getRandomSeed());

const settings = {
  animate: false,
  context: 'webgl',
  fps: 24,
  duration: 10,
  attributes: { antialias: true },
  scaleToView: true,
  seed: random.getSeed(),
  exportPixelRatio: 2,
  dimensions: [1440, 1440]
};


const sketch = ({ context, width, height }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });

  // WebGL background color
  renderer.setClearColor('#000', 1);

  // Setup a camera
  let camera = new THREE.PerspectiveCamera(27, width / height, 1, 4000);
  camera.position.z = 4000;
  camera.position.y = width / 2;
  camera.position.x = width / 2;

  // Setup your scene
  const scene = new THREE.Scene();

  // var light = new THREE.DirectionalLight(0xffffff, 1);
  // light.position.set(1, 1, 1).normalize();
  // scene.add(light);

  // var segments = 100;
  // var geometry = new THREE.BufferGeometry();
  // var material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
  // var positions = [];
  // var colors = [];

  // var r = 1000;
  // for (var i = 0; i < segments; i++) {
  //   var x = Math.random() * r - r / 2;
  //   var y = Math.random() * r - r / 2;
  //   var z = Math.random() * r - r / 2;
  //   // positions
  //   positions.push(x, y, z);
  //   // colors
  //   colors.push((x / r) + 0.5);
  //   colors.push((y / r) + 0.5);
  //   colors.push((z / r) + 0.5);

  // }

  // // console.log(positions)


  // geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  // geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  // geometry.computeBoundingSphere();
  // line = new THREE.Line(geometry, material);
  // scene.add(line);


  const lineCount = 400;
  const lineSegments = 600;
  const margin = 0;
  let positions = [];
  let colors = [];


  var material = new THREE.LineBasicMaterial({
    vertexColors: THREE.VertexColors
  });

  var geometry = new THREE.BufferGeometry();

  for (let i = 0; i < lineCount; i++) {
    const A = i / (lineCount - 1);
    const x = lerp(margin, width - margin, A);
    for (let j = 0; j < lineSegments; j++) {
      const B = j / (lineSegments - 1);
      const y = lerp(margin, height - margin, B);

      const frequency0 = 0.00105 + random.gaussian() * 0.00003;
      const z0 = noise(x * frequency0, y * frequency0, -1);
      const z1 = noise(x * frequency0, y * frequency0, +1);

      const warp = random.gaussian(1, 10);

      const fx = x + z0 * warp;
      const fy = y + z1 * warp;

      positions.push(fx, fy, 0)
      colors.push((fx / width - margin * 2));
      colors.push(random.range(0, 0.2));
      colors.push((fy / width - margin * 2) + 0.5);
    }
  }

  geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeBoundingSphere();
  line = new THREE.Line(geometry, material);
  scene.add(line);


  // draw each frame
  return {
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);
    },
    // And render events here
    render({ width, height }) {
      camera.aspect = width / height
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    },
  };
};


function noise(nx, ny, z, freq = 0.75) {
  // This uses many layers of noise to create a more organic pattern
  nx *= freq;
  ny *= freq;
  let e = (1.00 * (random.noise3D(1 * nx, 1 * ny, z) * 0.5 + 0.5) +
    0.50 * (random.noise3D(2 * nx, 2 * ny, z) * 0.5 + 0.5) +
    0.25 * (random.noise3D(4 * nx, 4 * ny, z) * 0.5 + 0.5) +
    0.13 * (random.noise3D(8 * nx, 8 * ny, z) * 0.5 + 0.5) +
    0.06 * (random.noise3D(16 * nx, 16 * ny, z) * 0.5 + 0.5) +
    0.03 * (random.noise3D(32 * nx, 32 * ny, z) * 0.5 + 0.5));
  e /= (1.00 + 0.50 + 0.25 + 0.13 + 0.06 + 0.03);
  e = Math.pow(e, 2);
  e = Math.max(e, 0);
  e *= 2;
  return e * 2 - 1;
}


canvasSketch(sketch, settings);
