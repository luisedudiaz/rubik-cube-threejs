class Canvas {

  #ALPHA_RENDERER = 1.0;
  #BACKGROUND_RENDERER = 0x303030;
  #BACKGROUND_LIGHT = 0xffffff;
  #CAMERA_POSITION = {
    x: -20,
    y: 20,
    z: 30
  };
  #SIZE_AXIS_HELPER = 20;

  constructor(scene, camera, renderer) {
    this._scene = scene;
    this._camera = camera;
    this._renderer = renderer;
    this._orbitControls = null;
    this._canvas = null
  }

  #setRenderer = (canvas) => {
    this._renderer.setClearColor(this.#BACKGROUND_RENDERER, this.#ALPHA_RENDERER);
    this._renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this._renderer.shadowMapEnabled = true;
    canvas.append(this._renderer.domElement);
  };

  #setCamera = () => {
    this._camera.position = new THREE.Vector3(this.#CAMERA_POSITION.x, this.#CAMERA_POSITION.y, this.#CAMERA_POSITION.z);
    this._camera.lookAt(this._scene.position);
    THREE.Object3D._threexDomEvent.camera(this._camera);
  };

  #setLights = () => {
    this._scene.add(new THREE.AmbientLight(this.#BACKGROUND_LIGHT))
  };

  #setOrbitControls = () => {
    this._orbitControls = THREE.OrbitControls(this._camera, this._renderer.domElement);
  };

  #onWindowResize = () => {
    this._camera.aspect = this._canvas.clientWidth / this._canvas.clientHeight
    this._camera.updateProjectionMatrix()
    this._renderer.setSize(this._canvas.clientWidth, this._canvas.clientHeight)
  }

  enableOrbitControl = () => {
    this._orbitControls.noRotate = false
  }

  disableOrbitControl = () => {
    this._orbitControls.noRotate = true
  }

  showAxisHelper = () => {
    this._scene.add(new THREE.AxisHelper(this.#SIZE_AXIS_HELPER))
  }

  createScene = (canvas) => {
    this._canvas = canvas
    this.#setRenderer(canvas);
    this.#setCamera()
    this.#setLights()
    this.#setOrbitControls()
    window.addEventListener('resize', this.#onWindowResize, true);
  }

  run = () => {
    this._renderer.render(this._scene, this._camera)
    requestAnimationFrame(this.run)
  }

}
