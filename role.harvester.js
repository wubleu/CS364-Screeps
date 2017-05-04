var chargeMethods = require('methods.charge');
 
var roleHarvester = {
    
    create : function(spawn, config) {
        var migrating = 0;
        if (arguments.length > 2) {
            migrating = arguments[2];
        }
        spawn.createCreep(config, {role : 'builder', building : false, migrating : migrating});
    },
    
    run : function(creep) {
        if (creep.memory.migrating == 2) {
            var p = new RoomPosition(25, 45, 'W7N4');
            creep.moveTo(p);
            if (creep.pos.isEqualTo(p)) { creep.memory.migrating = 0; }
            else { return; }
        }
        
        if (!creep.memory.depositing) {
            if (creep.carry.energy < creep.carryCapacity) {
                if (Game.getObjectById(creep.memory.node).energy == 0) {
                    var node = creep.pos.findClosestByPath(FIND_SOURCES, {filter : (s) => (s.energy > 0)});
                    if (node) {
                        creep.memory.node = node.id;
                    }
                }  
                if (creep.harvest(Game.getObjectById(creep.memory.node)) == ERR_NOT_IN_RANGE) {
                    if (creep.moveTo(Game.getObjectById(creep.memory.node)) == ERR_NO_PATH) {
                        var node = creep.pos.findClosestByPath(FIND_SOURCES, {filter : (s) => (s.energy > 0)});
                        if (node) {
                            creep.memory.node = node.id;
                        }
                    }
                } 
            }
            else {
                creep.memory.depositing = true;
                creep.say("depositing");
            }
        } else {
            if (creep.carry.energy == 0) {
                creep.say("gathering");
                creep.memory.depositing = false;
                var node = creep.pos.findClosestByPath(FIND_SOURCES, {filter : (s) => (s.energy > 0)});
                if (node) {
                    creep.memory.node = node.id;
                }
            } else if (!chargeMethods.stdCharge(creep)) {
                chargeMethods.upgradeController(creep);
            }
        }
        
    }
    
}

module.exports = roleHarvester;