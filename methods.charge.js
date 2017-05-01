/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('methods.charge');
 * mod.thing == 'a thing'; // true
 */
    
// this array of destinations must be in the order from first-to-last priority
var chargeDestinations = [FIND_MY_SPAWNS]
 
var chargeMethods = {
    
    // directs parameter "creep" to charge the first "chargeDestinations" element that isn't already full
    // returns true if the creep successfully harvests or moves toward a resource that is not fully charged
    stdCharge : function(creep) {
        var chargeablesFilter = 
            function(structure) {
                return (structure.energy < structure.energyCapacity);
            };
        var chargeables = creep.room.find(chargeDestinations, chargeablesFilter);
        console.log(chargeables[0] && chargeables[0].energy < chargeables[0].energyCapacity);
        if (chargeables[0] && chargeables[0].energy < chargeables[0].energyCapacity) {
            if (creep.transfer(chargeables[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(chargeables[0]);
            }
            return true;
        }
        return false;
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