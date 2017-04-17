/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('methods.charge');
 * mod.thing == 'a thing'; // true
 */
 
var chargeMethods = {
    
    // this array of destinations must be in the order from first-to-last priority
    chargeDestinations : [FIND_MY_SPAWNS]
    
    // directs parameter "creep" to charge the first "chargeDestinations" element that isn't already full
    // returns true if the creep successfully harvests or moves toward a resource that is not fully charged
    stdCharge : function(creep) {
        var chargeablesFilter = 
            function(structure) {
                return (structure.carry < structure.carryCapacity);
            };
        var chargeables = creep.room.find(chargeDestinations, chargeablesFilter);
        if (chargeables[0]) {
            if (creep.harvest(chargeables[0]) == ERROR_NOT_IN_RANGE) {
                creep.moveTo(chargeables[0]);
            } 
            return true;
        }
        return false;
    }
    
}

module.exports = chargeMethods;