// This class calculates the vertices of each cube.
class Utils {
  static  nearlyEqual(a, b, d) {
    d = d || 1.001;
    return Math.abs(a - b) <= d;
  }

  // Function and condition that returns the absolute value of a number, in this case the axis value of 'y' of the position and the vector, and its maximum values
  static principalComponent(v) {
    let maxAxis = 'x'
    let max = Math.abs(v.x);
    if (Math.abs(v.y) > max) {
      maxAxis = 'y';
      max = Math.abs(v.y);
    }
    if (Math.abs(v.z) > max) {
      maxAxis = 'z';
      max = Math.abs(v.z);
    }
    //Return the result of the valor of x.
    return maxAxis;
  }

  static randomDirection() {
    let x = Utils.randomInt(0,1);
    if(x === 0) x = -1;
    return x;
  }

  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static randomAxis() {
    return ['x', 'y', 'z'][this.randomInt(0,2)];
  }

  static randomAxis() {
    return ['x', 'y', 'z'][this.randomInt(0,2)];
  }
}



