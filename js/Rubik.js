class Rubik extends Cube {

    #ROTATION_SPEED = 0.2

    // Initialize all elements of Rubik
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

    // Verifies if the cube is moving
    get isMoving() {
      return this._isMoving
    }


    // When the move is over update all cube intances in scene
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

      this.#startNextMove();
    }

    // Moves the element in the scene
    doMove = () => {
      //Move a quarter turn then stop
      if(this._pivot.rotation[this._moveAxis] >= Math.PI / 2) {
        this._pivot.rotation[this._moveAxis] = Math.PI / 2;
        this.#moveComplete();
      } else if(this._pivot.rotation[this._moveAxis] <= Math.PI / -2) {
        this._pivot.rotation[this._moveAxis] = Math.PI / -2;
        this.#moveComplete()
      } else {
        this._pivot.rotation[this._moveAxis] += (this._moveDirection * this.#ROTATION_SPEED);
      }
    }

    // Updates the moving array
    #pushMove = (cube, clickVector, axis, direction) => {
      this._moveQueue.push({ cube: cube, vector: clickVector, axis: axis, direction: direction });
    }

    //Select the plane of cubes that aligns with clickVector on the given axis
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

    // Stir all the rubik
    shuffle = () => {
      const nMoves = Utils.randomInt(10, 40);
      for(let i = 0; i < nMoves; i ++) {
        const cube = this.randomCube();
        this.#pushMove(cube, cube.position.clone(), Utils.randomAxis(), Utils.randomDirection());
      }

      this.#startNextMove();
    }

    // Solves the rubik
    solve = () => {
      if(!this._isMoving) {
        this._completedMoveStack.forEach((move) => {
          this.#pushMove(move.cube, move.vector, move.axis, move.direction * -1);
        });

        this._completedMoveStack = [];

        this._moveEvents.one('deplete', () => {
          this._completedMoveStack = [];
        });

        this.#startNextMove();
      }
    }

    // Takes from the moves array the last element
    undo = () => {
      if(!this.isMoving) {
        const lastMove = this._completedMoveStack.pop();
        if(lastMove) {
          const stackToRestore = this._completedMoveStack.slice(0);
          this.#pushMove(lastMove.cube, lastMove.vector, lastMove.axis, lastMove.direction * -1);

          this._moveEvents.one('complete', function() {
            this._completedMoveStack = stackToRestore;
          });

          this.#startNextMove();
        }
      }
    }

    // Realice the movement in the canvas
    #startNextMove = () => {
      const nextMove = this._moveQueue.pop();

      if (nextMove) {
        this._clickVector = nextMove.vector;

        let direction = nextMove.direction || 1
        let axis = nextMove.axis;

        if (this._clickVector) {

          if(!this._isMoving) {
            this._isMoving = true;
            this._moveAxis = axis;
            this._moveDirection = direction;

            this.#setActiveGroup(axis);

            this._pivot.rotation.set(0,0,0);
            this._pivot.updateMatrixWorld();
            this._canvas.scene.add(this._pivot);

            this._activeGroup.forEach((e) => {
              THREE.SceneUtils.attach(e, this._canvas.scene, this._pivot);
            });

            this._currentMove = nextMove;
          } else {
            console.log("Already moving!");
          }
        } else {
          console.log("Nothing to move!");
        }
      } else {
        this._moveEvents.trigger('deplete');
      }
    }

    // Verify if the mouse is over the cube
    #isMouseOverCube = (mouseX, mouseY) => {
      const directionVector = new THREE.Vector3();
      //Normalise mouse x and y
      let x = ( mouseX / this._canvas.selector.clientWidth );
      let y = -( mouseY / this._canvas.selector.clientHeight ) / 2 + 1;
      console.log(x, y)
      directionVector.set(x, y, 1);

      this._projector.unprojectVector(directionVector, this._canvas.camera)
      directionVector.sub(this._canvas.camera.position);
      directionVector.normalize();
      this._raycaster.set(this._canvas.camera.position, directionVector);
      console.log(this._raycaster.intersectObjects(this._cubes, true).length > 0)
      return this._raycaster.intersectObjects(this._cubes, true).length > 0;
    }

    // Event when the mouse is actuated desable the orbit controls
    #onCubeMouseDown = (e, cube) => {
      console.log('mousedown')
      this._canvas.disableOrbitControl()
      if(!this._isMoving) {
        this._clickVector = cube.rubikPosition.clone();
        const centroid = e.targetFace.centroid.clone();
        centroid.applyMatrix4(cube.matrixWorld);
        if(Utils.nearlyEqual(Math.abs(centroid.x), this._maxExtent)) {
          this._clickFace = 'x'
        }
        else if(Utils.nearlyEqual(Math.abs(centroid.y), this._maxExtent)) {
          this._clickFace = 'y';
        }
        else if(Utils.nearlyEqual(Math.abs(centroid.z), this._maxExtent)) {
          this._clickFace = 'z';
        }
      }
    };

    // Event when the mouse is actuated desable the orbit controls
    #onCubeMouseUp = (e, cube) => {
      if(this._clickVector) {
        this._dragVector = cube.rubikPosition.clone();
        this._dragVector.sub(this._clickVector);

        if(this._dragVector.length() > this._size) {
          //Rotate with the most significant component of the drag vector
          const dragVectorOtherAxes = this._dragVector.clone();
          if (this._clickFace === null) return
          dragVectorOtherAxes[this._clickFace] = 0;
          const maxAxis = Utils.maxAxis(dragVectorOtherAxes);

          const transitions = {
            'x': {'y': 'z', 'z': 'y'},
            'y': {'x': 'z', 'z': 'x'},
            'z': {'x': 'y', 'y': 'x'}
          }
          const rotateAxis = transitions[this._clickFace][maxAxis]
          let direction = this._dragVector[maxAxis] >= 0 ? 1 : -1;

          if(this._clickFace === 'z' && rotateAxis === 'x' ||
            this._clickFace === 'x' && rotateAxis === 'z' ||
            this._clickFace === 'y' && rotateAxis === 'z') {
            direction *= -1;
          }


          if(this._clickFace === 'x' && this._clickVector.x > 0 ||
            this._clickFace === 'y' && this._clickVector.y < 0 ||
            this._clickFace === 'z' && this._clickVector.z < 0) {
            direction *= -1;
          }

          this.#pushMove(cube, this._clickVector.clone(), rotateAxis, direction);
          this.#startNextMove();

          this._canvas.enableOrbitControl()
        } else {
          console.log("Drag me some more please!")
        }
      }
    }

    // Action that verifies if the mouse is out the cube range
    #onCubeMouseOut = (e, cube) => {
      this._lastCube = cube;
    }

    // Sets all event the cube requires
    #setCubeEvents = (cube) => {
      cube.on('mousedown', (e) => {
        this.#onCubeMouseDown(e, cube);
      });

      cube.on('mouseup', (e) => {
        this.#onCubeMouseUp(e, cube);
      });

      cube.on('mouseout', (e) => {
        this.#onCubeMouseOut(e, cube);
      });
    }

    // Join all the cube instances in a certain position
    createRubik = () => {
      const offset = (this._dimension - 1) / 2
      const increment = this._size * this._spacing
      for(let i = 0; i < this._dimension; i ++) {
        for(let j = 0; j < this._dimension; j ++) {
          for(let k = 0; k < this._dimension; k ++) {

            const x = (i - offset) * increment,
              y = (j - offset) * increment,
              z = (k - offset) * increment;

            const cube = this.createCube();
            cube.castShadow = true
            cube.position = new THREE.Vector3(x, y, z)
            cube.rubikPosition = {}
            cube.rubikPosition = cube.position.clone()
            this.#setCubeEvents(cube)
            this._canvas.scene.add(cube)
            this._cubes.push(cube)
          }
        }
      }
      this._canvas.selector.addEventListener('mouseup', (e) => {
        if(!this.#isMouseOverCube(e.clientX, e.clientY)) {
          if(this._lastCube)
            this.#onCubeMouseUp(e, this._lastCube);
        }
      });
    }
  }
