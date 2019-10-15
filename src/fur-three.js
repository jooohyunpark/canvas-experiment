const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const { lerp } = require('canvas-sketch-util/math');
// const palettes = require('nice-color-palettes/1000.json').slice(200);
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');

random.setSeed(random.getRandomSeed());

const settings = {
  animate: true,
  context: 'webgl',
  fps: 24,
  duration: 8,
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
  let camera = new THREE.PerspectiveCamera(27, width / height, 1, 10000);
  camera.position.z = 4000;
  camera.position.y = width / 2;
  camera.position.x = width / 2;

  // Setup your scene
  const scene = new THREE.Scene();

  // var light = new THREE.DirectionalLight(0xffffff, 1);
  // light.position.set(1, 1, 1).normalize();
  // scene.add(light);

  const margin = 0;
  let positions = [];
  let colors = [];
  let randomization = [];
  let lineCount = 200;
  let lineSegments = 400;
  let count = 0;

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

      const warp = random.gaussian(1, 20);

      const fx = x + z0 * warp;
      const fy = y + z1 * warp;

      positions.push(fx, fy, 0)

      colors.push((fx / width - margin * 2));
      colors.push(random.range(0, 0.2));
      colors.push((fy / height - margin * 2) + 0.5);
      randomization.push(random.range(0.001, 1))
    }
  }

  geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.addAttribute('randomization', new THREE.Float32BufferAttribute(randomization, 1));

  geometry.computeBoundingSphere();
  line = new THREE.Line(geometry, material);;
  scene.add(line);


  // // transparent filter
  // var geometry_filter = new THREE.BoxBufferGeometry(100, 100, 0);
  // var material_filter = new THREE.MeshBasicMaterial({ color: 'black', opacity: 0.3 });
  // material_filter.transparent = true
  // var filter = new THREE.Mesh(geometry_filter, material_filter);
  // filter.position.set(width / 2, height / 2, 3800)
  // scene.add(filter);


  return {
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);
    },
    // And render events here
    render({ width, height, time }) {

      var positions = line.geometry.attributes.position.array;
      var randomization = line.geometry.attributes.randomization.array;
      var colors = line.geometry.attributes.color.array;

      var i = 0, j = 0;
      for (var ix = 0; ix < lineCount; ix++) {
        for (var iy = 0; iy < lineSegments; iy++) {
          // positions[i + 2] = (Math.sin((ix + count) * randomization[j]) * 50) +
          //   (Math.sin((iy + count) * randomization[j]) * 50);

          positions[i + 2] = (Math.sin((ix + count) * 0.2) * 50) +
            (Math.sin((iy + count) * 0.2) * 50);

          // colors[i] += loopNoise(ix, iy, playhead) * 0.001

          // colors[i + 1] = (Math.sin((ix + count) * 0.1) * 50) +
          //   (Math.sin((iy + count) * randomization[j]) * 50);

          // console.log(Math.sin((ix + count)))


          i += 3;
          j++;
        }
      }

      count += 0.1;
      line.geometry.attributes.position.needsUpdate = true;
      line.geometry.attributes.color.needsUpdate = true;

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

function loopNoise(x, y, t, scale = 1) {
  const duration = scale;
  const current = t * scale;
  return ((duration - current) * random.noise3D(x, y, current) + current * random.noise3D(x, y, current - duration)) / duration;
}

canvasSketch(sketch, settings);
