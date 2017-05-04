var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var structureDefense = require('methods.structureDefense');

module.exports.loop = function() {
    Memory.repairCounter++;
    
    var numHarvesters = 0;
    var numBuilders = 0;
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
            numHarvesters++;
        } else if(creep.memory.role == 'builder'){
            roleBuilder.run(creep);
            numBuilders++;
        }
    }
    if (numHarvesters < 3) {
        roleHarvester.create(Game.spawns.Spawn1);
    }
    if (numBuilders < 2) {
        roleBuilder.create(Game.spawns.Spawn1);
    }
    if (numBuilders + numHarvesters == 0) {
        roleBuilder.create(Game.spawns.Spawn1);
    }
    
    if (Game.spawns.Spawn1.room.find(FIND_HOSTILE_CREEPS)[0]) {
        structureDefense.towersDefend(Game.spawns.Spawn1.room);
    }
    
}