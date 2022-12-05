import { extensionsPrint } from "blueprints";
let blueprintPos: RoomPosition;
export default {
  /** @param {Room} room **/
  run: function (room: Room) {},
  buildExtensions: function (room: Room) {
    blueprintPos = new RoomPosition(27, 39, room.name);
    for (var x = 0; x < extensionsPrint[0].length; x++) {
      for (var y = 0; y < extensionsPrint.length; y++) {
        room.createConstructionSite(
          blueprintPos.x + x,
          blueprintPos.y + y,
          extensionsPrint[y][x] === "1" ? STRUCTURE_EXTENSION : STRUCTURE_ROAD
        );
      }
    }
  },
  buildRoadFromControllerToNearestSource: function (room: Room) {
    if (room.controller) {
      const nearestSourceToController = room.find(FIND_SOURCES).sort((a, b) => {
        return room.controller
          ? PathFinder.search(room.controller.pos, a.pos).cost - PathFinder.search(room.controller.pos, b.pos).cost
          : 0;
      })[0];
      const path = PathFinder.search(room.controller.pos, nearestSourceToController.pos);
      path.path.forEach(pos => room.createConstructionSite(pos, STRUCTURE_ROAD));
    }
  },
  buildRoadFromSpawnToNearestSource: function (spawn: StructureSpawn) {
    const nearestSource = spawn.room
      .find(FIND_SOURCES)
      .sort((a, b) => PathFinder.search(spawn.pos, a.pos).cost - PathFinder.search(spawn.pos, b.pos).cost)
      .shift();
    if (nearestSource) {
      const path = PathFinder.search(spawn.pos, nearestSource.pos);
      path.path.forEach(pos => spawn.room.createConstructionSite(pos, STRUCTURE_ROAD));
    }
  },
  buildAllRoadsFromSpawnToSources: function (spawn: StructureSpawn) {
    spawn.room.find(FIND_SOURCES).forEach(source => {
      const pathToSpawn = PathFinder.search(spawn.pos, source.pos);
      pathToSpawn.path.forEach(pos => spawn.room.createConstructionSite(pos, STRUCTURE_ROAD));
      if (blueprintPos) {
        const pathToBlueprint = PathFinder.search(blueprintPos, source.pos);
        pathToBlueprint.path.forEach(pos => spawn.room.createConstructionSite(pos, STRUCTURE_ROAD));
      }
    });
  }
};
