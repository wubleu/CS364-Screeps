var chargeMethods = require('methods.charge');
 
var roleHarvester = {
    
    create : function(spawn, config, mig) {
        if (spawn.canCreateCreep(config) == 0) {
            let migrating = mig;
            if (mig > 1) {
                Memory.migrating++;
            }
            spawn.createCreep(config, {role : 'harvester', depositing : false, migrating : migrating});
        }
    },
    
    run : function(creep) {
        if (creep.memory.migrating == 2) {
            var p = new RoomPosition(25, 45, 'W7N4');
            console.log(creep.moveTo(p));
            if (creep.pos.x == p.x && creep.pos.y == p.y) { 
                Memory.migrating = Memory.migrating - 1;
                creep.memory.migrating = 0; 
                creep.memory.node = creep.pos.findClosestByPath(FIND_SOURCES, {filter : (s) => (s.energy > 0)}).id;
            }
            else { return; }
        }
        
        if (!creep.memory.depositing) {
            if (creep.carry.energy < creep.carryCapacity) {
                var node = Game.getObjectById(creep.memory.node);
                if (node && node.energy == 0) {
                    var node = creep.pos.findClosestByPath(FIND_SOURCES, {filter : (s) => (s.energy > 0)});
                    if (node) {
                        creep.memory.node = node.id;
                    }
                }  
                if (node && creep.harvest(node) == ERR_NOT_IN_RANGE) {
                    if (creep.moveTo(node) == ERR_NO_PATH) {
                        node = creep.pos.findClosestByPath(FIND_SOURCES, {filter : (s) => (s.energy > 0)});
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