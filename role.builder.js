var chargeMethods = require("methods.charge");

var roleBuilder = {

    create: function(spawn, config) {
        var migrating = 0;
        if (arguments.length > 2) {
            migrating = arguments[2];
        }
        spawn.createCreep(config, {role : 'builder', building : false, migrating : migrating});
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.migrating == 2) {
            var p = new RoomPosition(25, 45, 'W7N4');
            creep.moveTo(p);
            if (creep.pos.isEqualTo(p)) { creep.memory.migrating = 0; }
            else { return; }
        }
        
        //switch to not building if no energy to build with
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvest'); 
            var node = creep.pos.findClosestByPath(FIND_SOURCES, {filter : (s) => (s.energy > 0 && s.room.id == creep.room.id)});
            if (node) {
                creep.memory.node = node.id;
            }
        }
        //switch to building if full on energy
        else if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('build');
        }
        
        if (creep.memory.building && Memory.repairCounter > Memory.repairInterval) {
             if (chargeMethods.repairWallsRamparts(creep, 50000)) {
                 return;
             } else {
                 Memory.repairCounter = 0;
             }
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
                    filter: (s) => (s.structureType == STRUCTURE_CONTAINER &&
                                    s.store[RESOURCE_ENERGY] > 0)
            })
            if (Container){
                if (creep.withdraw(Container, RESOURCE_ENERGY)==ERR_NOT_IN_RANGE){
                    creep.moveTo(Container);   
                }
            } else {
                if (creep.memory.node) {
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