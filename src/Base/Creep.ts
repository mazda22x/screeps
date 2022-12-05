import { ACTIONS } from "../constants";

class BaseCreep {
  name: string;
  action: ACTIONS | null;
  creep: Creep;

  constructor(creep: Creep) {
    this.creep = creep;
    this.name = creep.name;
    this.action = null;
  }
  updateCreep(creep: Creep){
    this.creep = creep;
  }
  setAction(newAction: ACTIONS) {
    this.action = newAction;
    this.creep.say(newAction);
  }
  destroy(){
    delete Memory.creeps[this.name];
  }
  run() {}
}

export default BaseCreep;
