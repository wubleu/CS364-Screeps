/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */
 
var chargeMethods = require('methods.charge');

var roleHarvester = {
    
    create : function(spawn) {
        var creep = spawn.createCreep();
        creep.memory.role = 'harvester';
        creep.memory.depositing = false;
    },
    
    run : function(creep) {
        
        if (!creep.memory.depositing) {
            if (creep.carry.energy < creep.carryCapacity) {
                var srcs = creep.room.find(FIND_SOURCES);
                if (creep.harvest(srcs[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(srcs[0]);
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
            } else if (!chargeMethods.stdCharge(creep)) {
                chargeMethods.upgradeController(creep);
            }
        }
        
    }
    
}

module.exports = roleHarvester;