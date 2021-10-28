// import modules
require('prototype.spawn')();
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleWallRepairer = require('role.wallRepairer');

module.exports.loop = function () {
    // check for memory entries of dead creeps
    for (let name in Memory.creeps) {
        // and check if the creep is still alive
        if (Game.creeps[name] == undefined) {
            // if not, delete the memory entry
            delete Memory.creeps[name];
        }
    }

    // for every creep name in Game.creeps
    for (let name in Game.creeps) {
        // get the creep object
        var creep = Game.creeps[name];

        // call script that corresponds to role
        if (creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        }
        else if (creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if (creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        }
        else if (creep.memory.role === 'repairer') {
            roleRepairer.run(creep);
        }
        else if (creep.memory.role === 'wallRepairer') {
            roleWallRepairer.run(creep);
        }
    }
    // get all towers in room
    var towers = Game.rooms.W42S24.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType === STRUCTURE_TOWER
    });

    // for each tower, attack enemy if one is nearby
    for (let tower of towers) {
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target != undefined) {
            tower.attack(target);
        }
    }

    // minimum numbers for different roles
    var minimumNumberOfHarvesters = 2;
    var minimumNumberOfUpgraders = 2;
    var minimumNumberOfBuilders = 2;
    var minimumNumberOfRepairers = 2;
    var minimumNumberOfWallRepairers = 2;

    // number of creeps alive for each role
    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
    var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
    var numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repairer');
    var numberOfWallRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'wallRepairer');

    var energy = Game.spawns.Spawn1.room.energyCapacityAvailable;

    // if not enough harvesters
    if (numberOfHarvesters < minimumNumberOfHarvesters) {
        // try to spawn one
        var spawnAttempt = Game.spawns.Spawn1.spawnCustomCreep(energy, 'harvester');

        // if spawning failed and we have no harvesters left
        if (spawnAttempt === ERR_NOT_ENOUGH_ENERGY && numberOfHarvesters === 0) {
            // spawn one with what is available
            var spawnAttempt = Game.spawns.Spawn1.spawnCustomCreep(
                Game.spawns.Spawn1.room.energyAvailable, 'harvester');
        }
    }
    // if not enough upgraders, try to spawn one
    else if (numberOfUpgraders < minimumNumberOfUpgraders) {
        Game.spawns.Spawn1.spawnCustomCreep(energy, 'upgrader');
    }
    // if not enough repairers, try to spawn one
    else if (numberOfRepairers < minimumNumberOfRepairers) {
        Game.spawns.Spawn1.spawnCustomCreep(energy, 'repairer');
    }
    // if not enough builders, try to spawn one
    else if (numberOfBuilders < minimumNumberOfBuilders) {
        Game.spawns.Spawn1.spawnCustomCreep(energy, 'builder');
    }
    // if not enough wallRepairers, try to spawn one
    else if (numberOfWallRepairers < minimumNumberOfWallRepairers) {
        Game.spawns.Spawn1.spawnCustomCreep(energy, 'wallRepairer');
    }
    else {
        // else try to spawn a builder
        Game.spawns.Spawn1.spawnCustomCreep(energy, 'builder');
    }
};