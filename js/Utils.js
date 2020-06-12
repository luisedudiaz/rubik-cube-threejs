// This class calculates the vertices of each cube. 
class Utils {
  static  nearlyEqual(a, b, d) {   
    d = d || 1.001;
    // console.log('a',a)
    // console.log('b',b)
    // console.log('resta',Math.abs(a - b))
    // console.log('bool', Math.abs(a - b) <= d)
    // Returns the absolute value of these values. 
    return Math.abs(a - b) <= d;
  }

  //Static class that implement the principal Components of the vectors. 
  static principalComponent(v) {
    let maxAxis = 'x'
    let max = Math.abs(v.x);
    // Function and condition that returns the absolute value of a number, in this case the axis value of 'y' of the position and the vector, and its maximum values
    if (Math.abs(v.y) > max) {
      maxAxis = 'y';
      max = Math.abs(v.y);
    }
    // Function and condition that returns the absolute value of a number, in this case the axis value of 'z' of the position and the vector, its maximum values
    if (Math.abs(v.z) > max) {
      maxAxis = 'z';
      max = Math.abs(v.z);
    }
    //Return the result of the valor of x. 
    return maxAxis;
  }
}
