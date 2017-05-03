var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');

module.exports.loop = function() {
    
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
    if (numHarvesters < 4) {
        roleHarvester.create(Game.spawns.Spawn1);
    }
    if (numBuilders < 3) {
        roleBuilder.create(Game.spawns.Spawn1);
    }
    if (numBuilders + numHarvesters == 0) {
        roleBuilder.create(Game.spawns.Spawn1);
    }
    
}