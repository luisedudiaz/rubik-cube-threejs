function init() {
  const FOV = 45, NEAR = 0.1, FAR = 1000, ANTIALIAS = { antialias: true};
  const selector3x3 = document.querySelector('#threebythree');
  const canvas3x3 = new Canvas(
    new THREE.Scene(),
    new THREE.PerspectiveCamera(FOV, selector3x3.clientWidth / selector3x3.clientHeight, NEAR, FAR),
    new THREE.WebGLRenderer(ANTIALIAS));

  canvas3x3.createScene(selector3x3)
  canvas3x3.showAxisHelper()
  canvas3x3.run()
  console.log(canvas3x3)
}

init()
