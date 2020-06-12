const FOV = 45, NEAR = 0.1, FAR = 1000, ANTIALIAS = { antialias: true};

function init3x3() {
  const selector3x3 = document.querySelector('#threebythree');
  const canvas3x3 = new Canvas(
    new THREE.Scene(),
    new THREE.PerspectiveCamera(FOV, selector3x3.clientWidth / selector3x3.clientHeight, NEAR, FAR),
    new THREE.WebGLRenderer(ANTIALIAS),
    selector3x3);

  canvas3x3.createScene()
  canvas3x3.showAxisHelper()

  const rubik3x3 = new Rubik(3, canvas3x3)
  rubik3x3.createRubik()

  buttonsEvents(rubik3x3, {shuffle: '#shuffle3x3', solve: '#solve3x3', undo: '#undo3x3'})

  function run() {

    if (rubik3x3.isMoving) {
      rubik3x3.doMove()
    }

    canvas3x3.renderer.render(canvas3x3.scene, canvas3x3.camera)
    requestAnimationFrame(run)
  }
  run()
}

function init4x4() {
  const selector4x4 = document.querySelector('#fourbyfour');
  const canvas4x4 = new Canvas(
    new THREE.Scene(),
    new THREE.PerspectiveCamera(FOV, selector4x4.clientWidth / selector4x4.clientHeight, NEAR, FAR),
    new THREE.WebGLRenderer(ANTIALIAS),
    selector4x4);

  canvas4x4.createScene()
  canvas4x4.showAxisHelper()

  const rubik4x4 = new Rubik(4, canvas4x4)
  rubik4x4.createRubik()

  buttonsEvents(rubik4x4, { shuffle: '#shuffle4x4', solve: '#solve4x4', undo: '#undo4x4'})

  function run() {

    if (rubik4x4.isMoving) {
      rubik4x4.doMove()
    }

    canvas4x4.renderer.render(canvas4x4.scene, canvas4x4.camera)
    requestAnimationFrame(run)
  }
  run()
}

function init5x5() {
  const selector5x5 = document.querySelector('#fivebyfive');
  const canvas5x5 = new Canvas(
    new THREE.Scene(),
    new THREE.PerspectiveCamera(FOV, selector5x5.clientWidth / selector5x5.clientHeight, NEAR, FAR),
    new THREE.WebGLRenderer(ANTIALIAS),
    selector5x5);

  canvas5x5.createScene()
  canvas5x5.showAxisHelper()

  const rubik5x5 = new Rubik(5, canvas5x5)
  rubik5x5.createRubik()

  buttonsEvents(rubik5x5, { shuffle: '#shuffle5x5', solve: '#solve5x5', undo: '#undo5x5'})

  function run() {

    if (rubik5x5.isMoving) {
      rubik5x5.doMove()
    }

    canvas5x5.renderer.render(canvas5x5.scene, canvas5x5.camera)
    requestAnimationFrame(run)
  }
  run()
}

function init6x6() {
  const selector6x6 = document.querySelector('#sixbysix');
  const canvas6x6 = new Canvas(
    new THREE.Scene(),
    new THREE.PerspectiveCamera(FOV, selector6x6.clientWidth / selector6x6.clientHeight, NEAR, FAR),
    new THREE.WebGLRenderer(ANTIALIAS),
    selector6x6);

  canvas6x6.createScene()
  canvas6x6.showAxisHelper()

  const rubik6x6 = new Rubik(6, canvas6x6)
  rubik6x6.createRubik()

  buttonsEvents(rubik6x6, { shuffle: '#shuffle6x6', solve: '#solve6x6', undo: '#undo6x6'})

  function run() {

    if (rubik6x6.isMoving) {
      rubik6x6.doMove()
    }

    canvas6x6.renderer.render(canvas6x6.scene, canvas6x6.camera)
    requestAnimationFrame(run)
  }
  run()
}

function buttonsEvents(rubik, selector) {
  console.log(selector)
  document.querySelector(selector.shuffle).addEventListener('click', (e) => {
    e.preventDefault()
    rubik.shuffle()
  })
  document.querySelector(selector.solve).addEventListener('click', (e) => {
    e.preventDefault()
    rubik.solve()
  })
  document.querySelector(selector.undo).addEventListener('click', (e) => {
    e.preventDefault()
    rubik.undo()
  })
}

function init() {

  /**
   * 3x3
   */
  init3x3()

  /**
   * 4x4
   */
  init4x4()

  /**
   * 5x5
   */
  init5x5()

  /**
   * 6x6
   */
  init6x6()
}

init()
