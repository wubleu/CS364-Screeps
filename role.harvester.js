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
        var srcs = spawn.room.find(FIND_SOURCES);
        if (Memory.harvestInd == 0) {
            Memory.harvestInd = 1;
        } else {
            Memory.harvestInd = 0;
        }
        var creep = spawn.createCreep([WORK, CARRY, MOVE], {role : 'harvester', new : true, node : srcs[Memory.harvestInd].id});
    },
    
    run : function(creep) {
        
        if (!creep.memory.depositing) {
            if (creep.carry.energy < creep.carryCapacity) {
                if (creep.harvest(Game.getObjectById(creep.memory.node)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.node));
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