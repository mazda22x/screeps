import { extensionsPrint } from "blueprints";

export default {
  /** @param {Room} room **/
  run: function (room: Room) {},
  buildExtensions: function (room: Room) {
    const startPos = new RoomPosition(20, 29, room.name);
    for (var x = 0; x < extensionsPrint[0].length; x++) {
      for (var y = 0; y < extensionsPrint.length; y++) {
        room.createConstructionSite(
          startPos.x + x,
          startPos.y + y,
          extensionsPrint[y][x] === "1" ? STRUCTURE_EXTENSION : STRUCTURE_ROAD
        );
      }
    }
  }
};
