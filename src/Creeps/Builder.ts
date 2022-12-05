import { MovableCreep } from "Base/MovableCreep";
import { ACTIONS } from "../constants";

export class Builder extends MovableCreep {
  source: Source;
  structure: ConstructionSite | null;
  priority: BuildableStructureConstant[];
  constructor(creep: Creep) {
    super(creep);
    this.structure = null;
    this.priority = [STRUCTURE_EXTENSION, STRUCTURE_ROAD];
    this.updateStructure();
    if (!this.structure) {
      this.creep.suicide();
    }
    const nearestSourceToStructure = creep.room.find(FIND_SOURCES).sort((a, b) => {
      return this.structure
        ? PathFinder.search(this.structure.pos, a.pos).cost - PathFinder.search(this.structure.pos, b.pos).cost
        : 0;
    })[0];
    this.action = ACTIONS.MOVE;
    this.source = nearestSourceToStructure;
    this.goal = nearestSourceToStructure.pos;
  }
  updateStructure() {
    const foundedStructures = this.creep.room.find(FIND_CONSTRUCTION_SITES);
    const splittedStr = foundedStructures.reduce<{ [key: string]: Array<ConstructionSite> }>((acc, cur) => {
      if (!acc[cur.structureType]) acc[cur.structureType] = [cur];
      else acc[cur.structureType].push(cur);
      return acc;
    }, {});
    const finalStructure = (Object.keys(splittedStr) as BuildableStructureConstant[])
      .sort((a, b) => this.priority.findIndex(pr => pr === a) - this.priority.findIndex(pr => pr === b))
      .reduce<ConstructionSite[]>((acc, cur) => {
        return [
          ...acc,
          ...foundedStructures.filter(str => str.structureType === cur).sort((a, b) => a.progress - b.progress)
        ];
      }, []);
    this.structure = finalStructure?.pop() || null;
    console.log('updatedStructure for ', this.name, this.structure);
    if (!this.structure) this.creep.suicide();
  }
  run() {
    if (this.structure && !Game.getObjectById(this.structure.id)) this.updateStructure();
    if (this.action === ACTIONS.MOVE) {
      this.moveToGoal();
      if (this.goal && this.creep.pos.isNearTo(this.goal)) {
        this.setAction(
          this.creep.pos.isNearTo(this.source.pos) ? ACTIONS.HARVEST : ACTIONS.BUILD
        );
      }
    }
    if (this.action === ACTIONS.HARVEST) {
      this.creep.harvest(this.source);
      if (this.creep.store.getFreeCapacity() === 0) {
        this.setAction(ACTIONS.MOVE);
        this.updateStructure();
        this.setGoal(this.structure ? this.structure.pos : Game.spawns["Spawn1"].pos);
      }
    }
    if (this.action === ACTIONS.BUILD) {
      if (this.structure) this.creep.build(this.structure);
      if (this.creep.store.energy === 0) {
        this.setAction(ACTIONS.MOVE);
        this.setGoal(this.source.pos);
      }
    }
  }
}
