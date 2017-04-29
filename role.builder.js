var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        //switch to not building if no energy to build with
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say(' harvest');
        }
        //switch to building if full on energy
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('build');
        }

        //building structures
        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
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
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
};

module.exports = roleBuilder;