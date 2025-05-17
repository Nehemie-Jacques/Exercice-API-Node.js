/* class rectangle {
  constructor(name, width, height ) {
    this.name = "rectangle";
    this.width = width;
    this.height = height;
  }

  calculAra() {
    const perimeter = 2 * (this.width + this.height);
    const area = this.width * this.height;
    return { perimeter, area };

  }
}


const rect = new rectangle(10, 20);
console.log(rect.calculAra()); */

class voiture {
    constructor (name, marque, model, year, color, speed) {
        let _name = name;
        this.name = name;
        this.marque = marque;
        this.model = model;
        this.year = year;
        this.color = color;
        this.speed = speed;
    }

    start() {
        console.log(`${this.name} is starting`);
        if (this.speed > 0) {
            console.log(`${this.name} is moving at ${this.speed} km/h`);
        } else {
            console.log(`${this.name} is not moving`);
        }
    }
    stop() {
        console.log(`${this.name} is stopping`);
        this.speed = 0;
        if (this.speed === 0) {
            console.log(`${this.name} has stopped`);
        }
    }
}

const car =  new voiture("car", "Toyota", "Corolla", 2020, "red", 60);
console.log(car.start())

class outils extends voiture {}