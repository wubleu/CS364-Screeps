/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */

var roleHarvester = {
    
    run : function(creep) {
        if (creep.carry < creep.carryCapacity) {
            var srcs = creep.room.find(FIND_SOURCES);
            if (creep.harvest(srcs[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(nearestSrc);
            }
        } else {
            // have it run chargeMethods.stdCharge
        }
        
    }
    
}

module.exports = roleHarvester;