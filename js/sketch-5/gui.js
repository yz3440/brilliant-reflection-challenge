let gui = new dat.GUI({ autoPlace: false, width: 300 });
var config = {
  reflectionDepth: 2,
  rayJitter: false,
  rayRotationOffset: 45,
  rayRotation: true,
  rayCount: 10,
  visualizeHit: true,
  backgroundTransparency: 0,
  mirrorCount: 5,
};

var rayFolder = gui.addFolder('Reflection Control');

rayFolder
  .add(config, 'reflectionDepth', 0, 25)
  .step(1)
  .name('Times of Reflection');
rayFolder.add(config, 'rayCount', 1, 360).step(1).name('Number of Rays');
rayFolder.add(config, 'mirrorCount', 0, 20).step(1).name('Number of Mirrors');

rayFolder.open();

var rayModFolder = gui.addFolder('Ray Modification');
rayModFolder.add(config, 'rayRotationOffset', 0, 360).name('Ray Angle');
rayModFolder.add(config, 'rayRotation').name('Rotate Rays');
rayModFolder.add(config, 'rayJitter').name('Add Jitter');
rayModFolder.open();

var visualizationFolder = gui.addFolder('Visualization');

visualizationFolder.add(config, 'visualizeHit').name('Translucent Mirror');
visualizationFolder
  .add(config, 'backgroundTransparency', 0, 255)
  .step(1)
  .name('Blur Effect');
visualizationFolder.open();

var customContainer = document.getElementById('gui-container');
customContainer.appendChild(gui.domElement);
