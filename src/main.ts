import BaseCreep from "Base/Creep";
import roleHarvester from "roleHarvester";
import roomManager from "roomManager";
import { ErrorMapper } from "utils/ErrorMapper";
import { Upgrader } from "Creeps/Upgrader";
import { Builder } from "Creeps/Builder";

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
  // Memory extension samples
  interface Memory {
    Creeps: BaseCreep[];
    uuid: number;
    log: any;
  }

  interface CreepMemory {
    role: string;
    room: string;
    working: boolean;
  }

  // Syntax for adding proprties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

let Creeps: BaseCreep[] = [];

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  // console.log(`Current game tick is ${Game.time}`);

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
      Creeps = Creeps.filter(creep => creep.name !== name);
    }
  }
  // console.log("Creeps", Creeps.length, JSON.stringify(Creeps.map(creep => creep.name)));
  for (const name in Game.creeps) {
    const gameCreep = Game.creeps[name];

    const baseCreep = Creeps.find(creep => creep.name === name);

    if (!baseCreep) {
      switch (gameCreep.memory.role) {
        case "builder": {
          Creeps.push(new Builder(gameCreep));
          break;
        }
        case "upgrader": {
          if (gameCreep.room.controller) Creeps.push(new Upgrader(gameCreep, gameCreep.room.controller));
          break;
        }
        default:
          break;
      }
    } else baseCreep?.updateCreep(gameCreep);
  }
  Memory.Creeps = Creeps;
  const harvesters = _.filter(Game.creeps, creep => creep.memory.role == "harvester");
  // console.log("Harvesters: " + harvesters.length);
  if (harvesters.length < 2) {
    const newName = "Harvester" + Game.time;
    console.log("Spawning new harvester: " + newName);
    Game.spawns["Spawn1"].spawnCreep([WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], newName, {
      memory: { role: "harvester", room: Game.spawns["Spawn1"].room.name, working: false }
    });
  }

  const upgraders = _.filter(Game.creeps, creep => creep.memory.role == "upgrader");
  // console.log("Upgraders: " + upgraders.length);
  if (upgraders.length < 1) {
    const newName = "Upgrader" + Game.time;
    console.log("Spawning new upgrader: " + newName);
    Game.spawns["Spawn1"].spawnCreep([WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], newName, {
      memory: { role: "upgrader", room: Game.spawns["Spawn1"].room.name, working: false }
    });
  }

  const builders = _.filter(Game.creeps, creep => creep.memory.role == "builder");
  // console.log("Builders: " + builders.length);
  if (builders.length < 1 && Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES).length) {
    const newName = "Builder" + Game.time;
    console.log("Spawning new builder: " + newName);
    Game.spawns["Spawn1"].spawnCreep([WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], newName, {
      memory: { role: "builder", room: Game.spawns["Spawn1"].room.name, working: false }
    });
  }

  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (creep.memory.role == "harvester") {
      roleHarvester.run(creep);
    }
  }
  Creeps.forEach(creep => creep.creep && creep.run());
  roomManager.buildExtensions(Game.spawns["Spawn1"].room);
  roomManager.buildRoadFromControllerToNearestSource(Game.spawns["Spawn1"].room);
  roomManager.buildRoadFromSpawnToNearestSource(Game.spawns["Spawn1"])
  roomManager.buildAllRoadsFromSpawnToSources(Game.spawns["Spawn1"])
});
