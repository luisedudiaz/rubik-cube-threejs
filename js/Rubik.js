class Rubik extends Cube {

    #ROTATION_SPEED = 0.2
  
    constructor(dimension, canvas) {
      super(canvas);
      this._dimension = dimension
      this._clickVector = null
      this._clickFace = null
      this._dragVector = null
      this._maxExtent = (this._size * this._dimension + this._spacing * (this._dimension - 1)) / 2
      this._moveQueue = []
      this._moveAxis = null
      this._moveDirection = null
      this._currentMove = null
      this._activeGroup = []
      this._pivot = new THREE.Object3D()
      this._cubes = []
      this._lastCube = null
      this._raycaster = new THREE.Raycaster()
      this._projector = new THREE.Projector()
      this._moveEvents = $({})
      this._completedMoveStack =[]
    }
  
    get isMoving() {
      return this._isMoving
    }
  
    #moveComplete = () => {
      let moveN = null
      this._isMoving = false;
      this._moveAxis = null
      this._moveDirection = null;
      this._clickVector = null;
  
      this._pivot.updateMatrixWorld();
      this._canvas.scene.remove(this._pivot);
      this._activeGroup.forEach((cube) => {
        cube.updateMatrixWorld();
        cube.rubikPosition = null
        cube.rubikPosition = cube.position.clone();
        cube.rubikPosition.applyMatrix4(this._pivot.matrixWorld);
  
        THREE.SceneUtils.detach(cube, this._pivot, this._canvas.scene);
      });
  
      this._completedMoveStack.push(this._currentMove);
  
      this._moveEvents.trigger('complete');
  
      //Are there any more queued moves?
      this.#startNextMove();
    }
  
    doMove = () => {
      //Move a quarter turn then stop
      if(this._pivot.rotation[this._moveAxis] >= Math.PI / 2) {
        //Compensate for overshoot. TODO: use a tweening library
        this._pivot.rotation[this._moveAxis] = Math.PI / 2;
        this.#moveComplete();
      } else if(this._pivot.rotation[this._moveAxis] <= Math.PI / -2) {
        this._pivot.rotation[this._moveAxis] = Math.PI / -2;
        this.#moveComplete()
      } else {
        this._pivot.rotation[this._moveAxis] += (this._moveDirection * this.#ROTATION_SPEED);
      }
    }
  
    #pushMove = (cube, clickVector, axis, direction) => {
      this._moveQueue.push({ cube: cube, vector: clickVector, axis: axis, direction: direction });
    }
  
    //Select the plane of cubes that aligns with clickVector
    // on the given axis
    #setActiveGroup = (axis) => {
      if(this._clickVector) {
        this._activeGroup = [];
  
        this._cubes.forEach((cube) => {
          if(Utils.nearlyEqual(cube.rubikPosition[axis], this._clickVector[axis])) {
            this._activeGroup.push(cube);
          }
        });
      } else {
        console.log("Nothing to move!");
      }
    }
  }
  