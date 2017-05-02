/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('methods.charge');
 * mod.thing == 'a thing'; // true
 */
 
var chargeMethods = {
    
    // directs parameter "creep" to charge the first "chargeDestinations" element that isn't already full
    // returns true if the creep successfully harvests or moves toward a resource that is not fully charged
    stdCharge : function(creep) {
        var chargeablesFilter = 
            function(structure) {
                var type = structure.structureType;
                return structure.energy < structure.energyCapacity && 
                       (type == STRUCTURE_EXTENSION || type == STRUCTURE_SPAWN);
            };
        var chargeables = creep.room.find(FIND_MY_STRUCTURES, {filter : chargeablesFilter});
        if (chargeables[0]) {
            if (creep.transfer(chargeables[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(chargeables[0]);
            }
            return true;
        }
        return false;
    },
    
    repair : function(creep) {
        var repairableFilter = (s) => (s.hits < s.hitsMax);
        var repairables = Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {filter : repairableFilter});
        if (!repairables[0]) {
            return false;
        }
        if (creep.repair(repairables[0]) == ERR_NOT_IN_RANGE) {
            console.log(repairables[0]);
            creep.moveByPath(repairables[0]);
        }
        return true;
    },
    
    upgradeController : function(creep) {
        var controller = creep.room.controller;
        if (controller) {
            if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(controller);
            }
            return true;
        } else {
            return false;
        }
    }
    
}

module.exports = chargeMethods;