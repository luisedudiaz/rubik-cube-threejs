//This class loads the elements and creates each cube per cube.
class Cube {
  #COLORS = ['#FFE200', '#FFFFFF', '#00a239', '#0052A2','#EF7C00' ,'#E50026']

  //This constructor, specifies cube size, space, and movement. 
  constructor(canvas) {
    //This element it is obtained from the canvas and receives the 3 x 3 selector.
    this._canvas = canvas
    this._cubes = []
    this._size = 3
    this._spacing = 1.025
    this._isMoving = false

  }

  //This method loads the the materials used and the colors of the ambient and of the cube. 
  #loadMaterials = () => {
    const materials = this.#COLORS.map(color => {
      return new THREE.MeshLambertMaterial({ color, ambient: color })
    })
    return new THREE.MeshFaceMaterial(materials)
  }

  // This method create and implement the Cube in the scene with the materials, and the specife size to create the events. 
  createCube = () => {
    const cubeGeometry = new THREE.CubeGeometry(this._size, this._size, this._size)
    const materials = this.#loadMaterials()
    const cube = new THREE.Mesh(cubeGeometry, materials)
    return cube
  }
}
