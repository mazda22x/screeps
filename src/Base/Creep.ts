class BaseCreep {
  name: string;
  // creep: Creep;
  // constructor(creep: Creep) {
  //   this.creep = creep;
  //   this.name = creep.name;
  // }
  constructor(name: string) {
    this.name = name;
  }
}

export default BaseCreep;
