/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('methods.charge');
 * mod.thing == 'a thing'; // true
 */
 
 
let chargeMethods = {
    
    // directs parameter "creep" to charge the first "chargeDestinations" element that isn't already full
    // returns true if the creep successfully harvests or moves toward a resource that is not fully charged
    stdCharge : function(creep) {
        let chargeablesFilter = 
            function(structure) {
                let type = structure.structureType;
                return structure.energy < structure.energyCapacity && 
                       (type == STRUCTURE_EXTENSION || type == STRUCTURE_SPAWN || type == STRUCTURE_TOWER || type == STRUCTURE_CONTAINER);
            };
        let chargeable = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter : chargeablesFilter});
        if (chargeable) {
            if (creep.transfer(chargeable, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(chargeable);
            }
            return true;
        }
        return false;
    },
    
    repair : function(creep) {
        let repairableFilter = (s) => (s.hits < s.hitsMax && s.structureType != STRUCTURE_RAMPART);
        let repairable = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter : repairableFilter});
        if (!repairable) {
            return false;
        } else if (creep.repair(repairable) == ERR_NOT_IN_RANGE) {
            creep.moveTo(repairable);
        }
        return true;
    },
    
    repairWallsRamparts : function(creep, health) {
        let wallFilter = (s) => ((s.structureType == STRUCTURE_WALL || 
                                s.structureType == STRUCTURE_RAMPART ||
                                s.structureType == STRUCTURE_ROAD) && 
                                s.hits < health && s.hits < s.hitsMax);
        let nearestWall = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter : wallFilter});
        if (!nearestWall) {
            return false;
        } else { 
            if (creep.repair(nearestWall) == ERR_NOT_IN_RANGE) {
                creep.moveTo(nearestWall);
            }
            return true;
        }
    },
    
    repairByType : function() {
        let creep = arguments[0];
        let sType = arguments[1];
        var maxHealth = 1000000000000;
        if (arguments.length > 2) {
            maxHealth = arguments[2];
        }
        var filter = (s) => (s.structureType == type && s.hits < s.hitsMax && s.hits < maxHealth);
        var nearest = creep.findClosestByPath(FIND_STRUCTURES, {filter : filter})
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