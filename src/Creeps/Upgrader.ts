import { MovableCreep } from "Base/MovableCreep";
import { ACTIONS } from "../constants";

export class Upgrader extends MovableCreep {
  source: Source;
  controller: StructureController;
  constructor(creep: Creep, controller: StructureController) {
    super(creep);
    this.controller = controller;
    const nearestSourceToController = creep.room.find(FIND_SOURCES).sort((a, b) => {
      return PathFinder.search(this.controller.pos, a.pos).cost - PathFinder.search(this.controller.pos, b.pos).cost;
    })[0];

    this.action = ACTIONS.MOVE;
    this.source = nearestSourceToController;
    this.goal = nearestSourceToController.pos;
  }
  run() {
    if (this.action === ACTIONS.MOVE) {
      this.moveToGoal();
      if (this.goal && this.creep.pos.isNearTo(this.goal)){
        this.setAction(this.creep.pos.isNearTo(this.source.pos) ? ACTIONS.HARVEST : ACTIONS.UPGRADE)
      }
    }
    if (this.action === ACTIONS.HARVEST) {
      this.creep.harvest(this.source);
      if (this.creep.store.getFreeCapacity() === 0){
        this.setAction(ACTIONS.MOVE);
        this.setGoal(this.controller.pos);
      }
    }
    if (this.action === ACTIONS.UPGRADE){
      this.creep.upgradeController(this.controller);
      if (this.creep.store.energy === 0) {
        this.setAction(ACTIONS.MOVE);
        this.setGoal(this.source.pos);
      }
    }
  }
}
