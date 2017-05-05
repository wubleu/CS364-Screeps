var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var structureDefense = require('methods.structureDefense');
var QTable = require('QTable');
var roleQHarvester = require('role.qharvester');

Memory.QTab.currentState = "2w2c2m";
QTable.initialize()

module.exports.loop = function() {
    //          USED FOR COMMANDING CREEPS DIRECTLY
    // var position = new RoomPosition(40, 45, 'W7N4');
    // var thisCreep = Game.creeps.claimer2;
    // thisCreep.moveTo(position);
    // if (thisCreep.carry < thisCreep.carryCapacity) {
    //     thisCreep.harvest(Game.getObjectById('80d207728e6597b'));
    // } else {
    //     thisCreep.build(Game.getObjectById('7abd4f4f38a1e4f'));
    // }
    // thisCreep.upgradeController(Game.getObjectById('ff7a07728e60965'));
    // thisCreep.claimController(Game.getObjectById('ff7a07728e60965'));
    
    // used to allow us to repair all decaying structures every repairInterval turns
    Memory.repairCounter++;
    Memory.repairInterval = 4000;                  // doesnt need to be done every turn
    
    let room1 = Game.rooms['W7N3']; 
    let room2 = Game.rooms['W7N4'];
    
    room1.memory.spawn = Game.spawns.Spawn1.id;        // doesnt need to be done every turn
    room2.memory.spawn = Game.spawns.Spawn2.id;        // doesnt need to be done every turn
    
    let room1HarvestConfig = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
    let room1BuildConfig = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, 
                            CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
    //      CURRENTLY USING ROOM1 FOR ALL SPAWNS
    // let room2HarvestConfig = [WORK, WORK, CARRY, CARRY, MOVE]; //[WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
    // let room2BuildConfig = room2HarvestConfig;
    
    let room1HarvesterMin = 0;
    let room1BuilderMin = 2;
    let room1QMin = 3;
    let room2HarvesterMin = 0;
    let room2BuilderMin = 3;
    let room2QMin = 3
    
    var numHarvestersR1 = 0;
    var numBuildersR1 = 0;
    var numQR1 = 0;
    var numHarvestersR2 = Memory.migrating;
    var numBuildersR2 = Memory.migrating;
    var numQR2 = Memory.migrating;
    var numCreepsR2 = 0;
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.room == room1) {
            if (creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
                numHarvestersR1++;
            } else if(creep.memory.role == 'builder'){
                roleBuilder.run(creep);
                numBuildersR1++;
            } else if(creep.memory.role == 'qharvester'){
        		if (creep.ticksToLive <= 5){
                    QTable.update(creep.memory.stateStr, creep.memory.deposited);
                    //Self destruct creep 
                    creep.suicide();
        		}else{
                    roleQHarvester.run(creep);
                    numQR1++;
        		}
    	    }
        }
        if (creep.room == room2) {
            if (creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
                numHarvestersR2++;
            } else if(creep.memory.role == 'builder'){
                roleBuilder.run(creep);
                numBuildersR2++;
            }  else if(creep.memory.role == 'qharvester'){
        		if (creep.ticksToLive <= 5){
                            QTable.update(creep.memory.stateStr, creep.memory.deposited);
                            //Self destruct creep 
                            creep.suicide();
        		}else{
                            roleQHarvester.run(creep);
                            numQR2++;
        		}
    	    }
        }
    }
    // maintains populations in room 1
    if (numHarvestersR1 < room1HarvesterMin) {
        roleHarvester.create(Game.spawns.Spawn1, room1HarvestConfig, 0);
    }
    if (numBuildersR1 < room1BuilderMin) {
        roleBuilder.create(Game.spawns.Spawn1, room1BuildConfig, 0);
    }
    if (numQR1 < room1QMin){
        console.log(numQR1);
        var action = QTable.softmax(Memory.QTab.currentState);
        var newState = QTable.generateNewState(Memory.QTab.currentState, action);
        Memory.QTab.currentState = newState;
        roleQHarvester.create(Game.spawns.Spawn1, newState, 0);
        console.log(newState);
    }
    if (numBuildersR1 + numHarvestersR1 == 0) {
        roleBuilder.create(Game.spawns.Spawn1, [WORK, WORK, CARRY, CARRY, MOVE, MOVE], 0);
    }

    // maintains populations in room 2
    if (numHarvestersR2 < room2HarvesterMin) {
        // roleHarvester.create(Game.spawns.Spawn2, room2HarvestConfig);
        roleHarvester.create(Game.spawns.Spawn1, room1HarvestConfig, 2); 
    }
    if (numBuildersR2 < room2BuilderMin) {
        // roleBuilder.create(Game.spawns.Spawn2, room2BuildConfig);
        roleBuilder.create(Game.spawns.Spawn1, room1BuildConfig, 2); 
    }
    if (numQR2 < room2QMin){
        var action = QTable.softmax(Memory.QTab.currentState);
        var newState = QTable.generateNewState(Memory.QTab.currentState, action);
        Memory.QTab.currentState = newState;
        roleQHarvester.create(Game.spawns.Spawn1, newState, 2);
    }

    if (numBuildersR2 + numHarvestersR2 == 0) {
        roleBuilder.create(Game.spawns.Spawn2, [WORK, WORK, CARRY,CARRY, MOVE, MOVE], 0);
    }

        
    if (room1.find(FIND_HOSTILE_CREEPS)[0]) {
        structureDefense.towersDefend(room1);
    }
    if (room2.find(FIND_HOSTILE_CREEPS)[0]) {
        structureDefense.towersDefend(room2);
    }
    
    let rFilter = (s)=>(s.structureType == STRUCTURE_RAMPART && s.hits < 15000)
    if (room1.find(FIND_MY_STRUCTURES, {filter : rFilter})[0]) {
        Memory.repairingRamparts = true;
    }
    if (Memory.repairingRamparts) {
        let doneFilter = (s) => (s.structureType == STRUCTURE_RAMPART && s.hits < 48000);
        if (!room1.find(FIND_STRUCTURES, {filter : doneFilter})[0]) {
            Memory.repairingRamparts = false;
        }
    }
}
