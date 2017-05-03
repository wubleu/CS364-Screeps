var chargeMethods = require("methods.charge");

var roleBuilder = {

    create: function(spawn) {
        spawn.createCreep(
            [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 
            {role : 'builder', new : true, node : 'c12d077296e6ac9'});
    },

    /** @param {Creep} creep **/
    run: function(creep) {

        //switch to not building if no energy to build with
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvest');
        }
        //switch to building if full on energy
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('build');
        }

        //building structures
        if(creep.memory.building) {
            var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (!chargeMethods.repair(creep)) {
                if (target) {
                    if(creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else {
                    chargeMethods.stdCharge(creep) || chargeMethods.upgradeController(creep);
                }
            }
        }
        //harvesting
        else {
            var Container = creep.pos.findClosestByPath(FIND_STRUCTURES, { //get the container
                    filter: (s) => s.structureType == STRUCTURE_CONTAINER
                                && s.store[RESOURCE_ENERGY] > 0
            })
            if (Container){
                if (creep.withdraw(Container, RESOURCE_ENERGY)==ERR_NOT_IN_RANGE){
                    creep.moveTo(Container);   
                }
            }else{
                if (creep.memory.node) {
                    if (creep.harvest(creep.memory.node) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.memory.node);
                    }
                    return true;
                }
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
};

module.exports = roleBuilder;