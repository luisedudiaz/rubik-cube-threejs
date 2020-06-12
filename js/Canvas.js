// The class canvas is where the structure is created
class Canvas {
  #ALPHA_RENDERER = 1.0;
  #BACKGROUND_RENDERER = 0x707070;
  #BACKGROUND_LIGHT = 0xffffff;
  #CAMERA_POSITION = {
    x: -20,
    y: 20,
    z: 30
  };
  #SIZE_AXIS_HELPER = 20;

  // Initialize all the objects that are going to be use in the scene
  constructor(scene, camera, renderer, selector) {
    this._scene = scene;
    this._camera = camera;
    this._renderer = renderer;
    this._selector = selector
    this._orbitControls = null;
  }

  // Getters of the elements required in the scene
  get renderer() {
    return this._renderer
  }

  get scene() {
    return this._scene
  }

  get camera() {
    return this._camera
  }

  get selector() {
    return this._selector
  }

  // Sets all the elements size, color and add all elements to the dom element
  #setRenderer = () => {
    this._renderer.setClearColor(this.#BACKGROUND_RENDERER, this.#ALPHA_RENDERER);
    this._renderer.setSize(this._selector.clientWidth, this._selector.clientHeight);
    this._renderer.shadowMapEnabled = true;
    this._selector.append(this._renderer.domElement);
  };

  // Sets all the elements of the camera like position and direction
  #setCamera = () => {
    this._camera.position = new THREE.Vector3(this.#CAMERA_POSITION.x, this.#CAMERA_POSITION.y, this.#CAMERA_POSITION.z);
    this._camera.lookAt(this._scene.position);
    THREE.Object3D._threexDomEvent.camera(this._camera);
  };

  // Set all the required ilimination
  #setLights = () => {
    this._scene.add(new THREE.AmbientLight(this.#BACKGROUND_LIGHT))
  };

  // Let you move in the camera
  #setOrbitControls = () => {
    this._orbitControls = new THREE.OrbitControls(this._camera, this._renderer.domElement);
  };

  // Calculates every resize of the window to make it responsive
  #onWindowResize = () => {
    this._camera.aspect = this._selector.clientWidth / this._selector.clientHeight
    this._camera.updateProjectionMatrix()
    this._renderer.setSize(this._selector.clientWidth, this._selector.clientHeight)
  }

  // Enables you to rotate the cube in de canvas
  enableOrbitControl = () => {
    console.log(this._orbitControls)
    this._orbitControls.noRotate = false
  }

  // Disables you to rotate the cube in the canvas
  disableOrbitControl = () => {
    this._orbitControls.noRotate = true
  }

  // Shows the Cartesian plane in the scene
  showAxisHelper = () => {
    this._scene.add(new THREE.AxisHelper(this.#SIZE_AXIS_HELPER))
  }

  //  Initalize all the elements of scene
  createScene = (canvas) => {
    this._canvas = canvas
    this.#setRenderer();
    this.#setCamera()
    this.#setLights()
    this.#setOrbitControls()
    window.addEventListener('resize', this.#onWindowResize, true);
  }
   
  run = (isMoving, doMove,) => {

    if (isMoving) {
      doMove
    }

    this._renderer.render(this._scene, this._camera)
    requestAnimationFrame(this.run)
  }

}
