let _map = (arr, fn) => {
  for (let i = 0; i < arr.length; ++i) {
    arr[i] = fn(arr[i], i, arr);
  }
};

export default class Vector {

  static sum(...vectors) {
    if (vectors.length < 2) {
      throw new Error('Expected at least two arguments to sum');
    }
    let first = vectors.shift().clone();
    vectors.forEach((vector) => first.add(vector));
    return first;
  }

  static difference(...vectors) {
    if (vectors.length < 2) {
      throw new Error('Expected at least two arguments to diff');
    }
    let first = vectors.shift().clone();
    vectors.forEach((vector) => first.subtract(vector));
    return first;
  }

  constructor(...elements) {
    if (elements.length === 1 && Array.isArray(elements[0])) {
      this.elements = elements[0];
    } else {
      this.elements = elements;
    }
    this.length = this.elements.length;
  }

  checkDimensions(vector) {
    if (this.length !== vector.length) {
      throw new Error('The length of both vectors must be equal');
    }
  }

  add(vector) {
    this.checkDimensions(vector);
    _map(this.elements, (value, index) => value + vector.elements[index]);
    return this;
  }

  subtract(vector) {
    this.checkDimensions(vector);
    this.elements = this.elements.map((value, index) => value - vector.elements[index]);
    return this;
  }

  multiply(scalar) {
    this.elements = this.elements.map((value) => value * scalar);
    return this;
  }

  divide(scalar) {
    this.elements = this.elements.map((value) => value / scalar);
    return this;
  }

  magnitude() {
    let squaredSum = this.elements.reduce((previousValue, currentValue) => previousValue + (currentValue * currentValue), 0);
    return Math.pow(squaredSum, 1 / this.length);
  }

  equals(vector) {
    return vector.some((value, index) => value !== this.elements[index] ).length > 0
  }

  normalize() {
    let magnitude = this.magnitude();
    if (magnitude !== 0) {
      this.divide(magnitude);
    }
    return this;
  }

  clone() {
    return new Vector(this.elements);
  }

  toString() {
    return this.elements.toString();
  }
}
