var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder')

module.exports.loop = function() {
    
    var numHarvesters = 0;
    for (var name in Game.creeps) {
        numHarvesters++;
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        } else if(creep.memory.role == 'builder'){
            roleBuilder.run(creep);
        }
    }
    if (numHarvesters < 4) {
        roleHarvester.create(Game.spawns.Spawn1);
    }
    
}