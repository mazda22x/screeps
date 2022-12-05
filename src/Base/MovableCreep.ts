import BaseCreep from "Base/Creep";

export class MovableCreep extends BaseCreep {
  goal: RoomPosition | null;
  constructor(creep: Creep) {
    super(creep);
    this.goal = null;
  }
  setGoal(goal: RoomPosition) {
    this.goal = goal;
  }
  moveToGoal() {
    if (this.goal) {
      this.creep.moveTo(this.goal, { visualizePathStyle: { stroke: "#ffffff" } });
    }
  }
  moveTo(condition: () => boolean): OK | ERR_NOT_IN_RANGE {
    if (this.goal) {
      if (condition()) this.creep.moveTo(this.goal, { visualizePathStyle: { stroke: "#ffffff" } });
    }
    // if (this.goal) {

    // }
  }
}
