var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var QTable = require('QTable');
var roleQHarvester = require('role.qharvester');

QTable.initialize();

module.exports.loop = function() {
    
    var numHarvesters = 0;
    var numBuilders = 0;
    var numQ = 0;
    
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
            numHarvesters++;
        } else if(creep.memory.role == 'builder'){
            roleBuilder.run(creep);
            numBuilders++;
        } else if(creep.memory.role == 'qharvester'){
            if (creep.ticksToLive == 5){
                QTable.update(creep.memory.stateStr, creep.memory.deposited);
                //Self destruct creep 
                creep.suicide();
            }else{
                roleQHarvester.run(creep);
                numQ++;
            }
        }
    }
    if (numQ < 3){
        var action = QTable.softmax(Memory.QTab.currentState);
        var newState = QTable.generateNewState(Memory.QTab.currentState, action);
        Memory.QTab.currentState = newState;
        roleQHarvester.create(Game.spawns.Spawn1, newState);
    }
    if (numHarvesters < 6) {
        roleHarvester.create(Game.spawns.Spawn1);
    }
    if (numBuilders < 4) {
        roleBuilder.create(Game.spawns.Spawn1);
    }

    
    
    
}