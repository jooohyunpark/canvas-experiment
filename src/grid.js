const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes/1000.json').slice(200);

// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

const settings = {
  dimensions: [1440, 1440],
  exportPixelRatio: 2,
  scaleToView: true,
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
  fps: 24,
  duration: 10,
  // Turn on MSAA
  attributes: { antialias: true },
  seed: random.setSeed(random.getRandomSeed())
};

const sketch = ({ context, update }) => {

  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });

  // WebGL background color
  renderer.setClearColor('#000', 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera()

  // Setup your scene
  const scene = new THREE.Scene();
  let array = [];

  const count = 10;
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  for (let x = 0; x < count; x++) {
    for (let y = 0; y < count; y++) {
      const U = x / (count - 1);
      const V = y / (count - 1);
      const spacing = 1.9;
      const u = (U * 2 - 1) * spacing;
      const v = (V * 2 - 1) * spacing;

      const material = new THREE.MeshStandardMaterial({
        roughness: 0.75,
        metalness: 0.25,
        color: new THREE.Color(random.pick(random.pick(palettes)))
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.scale.set(
        random.gaussian(),
        random.gaussian(),
        random.gaussian()
      ).multiplyScalar(0.1 * random.gaussian());
      mesh.position.set(
        u,
        0,
        v
      );
      scene.add(mesh);
      array.push(mesh)
    }
  }

  // Specify an ambient/unlit colour
  // scene.add(new THREE.AmbientLight(random.pick(random.pick(palettes))));

  // Add some light
  const light = new THREE.DirectionalLight('white', 4);
  light.position.set(-1, 0, 1);
  light.lookAt(new THREE.Vector3());
  scene.add(light);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);

      // Setup an isometric perspective
      const aspect = viewportWidth / viewportHeight;
      const zoom = 2.25;
      const offset = settings.animate ? 0.25 : 0.25;
      camera.left = -zoom * aspect * 1.05;
      camera.right = zoom * aspect * 1.05;
      camera.top = zoom + offset;
      camera.bottom = -zoom - offset / 3;
      camera.near = -100;
      camera.far = 100;
      camera.position.set(0, zoom, 0);
      camera.lookAt(new THREE.Vector3());

      camera.updateProjectionMatrix();
    },
    // And render events here
    render({ playhead, width, height }) {
      if (settings.animate) {
        for (let i = 0; i < count * count; i++) {
          array[i].rotation.z = Math.PI * 2 * loopNoise(array[i].scale.x, array[i].scale.y, array[i].scale.z, playhead)
        }
      }
      camera.setViewOffset(width, height, 0, 25, width, height);
      renderer.render(scene, camera);
    },
    // Dispose of WebGL context (optional)
    unload() {
      renderer.dispose();
    }
  };


  function loopNoise(x, y, z, t, scale = 1) {
    const duration = scale;
    const current = t * scale;
    return ((duration - current) * random.noise4D(x, y, z, current) + current * random.noise4D(x, y, z, current - duration)) / duration;
  }


};

canvasSketch(sketch, settings);
