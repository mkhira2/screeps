// import modules
require('prototype.spawn')();
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');
const roleWallRepairer = require('role.wallRepairer');
const roleLongDistanceHarvester = require('role.longDistanceHarvester');

const HOME = 'W42S24'

module.exports.loop = () => {
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
        const creep = Game.creeps[name];

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
        else if (creep.memory.role === 'longDistanceHarvester') {
            roleLongDistanceHarvester.run(creep);
        }
    }
    // get all towers in room
    const towers = Game.rooms[HOME].find(FIND_STRUCTURES, {
        filter: (s) => s.structureType === STRUCTURE_TOWER
    });

    // for each tower, attack enemy if one is nearby
    for (let tower of towers) {
        const target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target != undefined) {
            tower.attack(target);
        }
    }

    // minimum numbers for different roles
    const minimumNumberOfHarvesters = 1;
    const minimumNumberOfUpgraders = 1;
    const minimumNumberOfBuilders = 1;
    const minimumNumberOfRepairers = 1;
    const minimumNumberOfWallRepairers = 1;
    const minimumNumberOfLongDistanceHarvestersW42S23 = 1;
    const minimumNumberOfLongDistanceHarvestersW42S25 = 1;

    // number of creeps alive for each role
    const numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
    const numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    const numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
    const numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repairer');
    const numberOfWallRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'wallRepairer');
    const numberOfLongDistanceHarvestersW42S23 = _.sum(Game.creeps, (c) => c.memory.role == 'longDistanceHarvester' && c.memory.target === 'W42S23');
    const numberOfLongDistanceHarvestersW42S25 = _.sum(Game.creeps, (c) => c.memory.role == 'longDistanceHarvester' && c.memory.target === 'W42S25');

    const energy = Game.spawns.Spawn1.room.energyCapacityAvailable;

    // if not enough harvesters
    if (numberOfHarvesters < minimumNumberOfHarvesters) {
        // try to spawn one
        const spawnAttempt = Game.spawns.Spawn1.spawnCustomCreep(energy, 'harvester');

        // if spawning failed and we have no harvesters left
        if (spawnAttempt === ERR_NOT_ENOUGH_ENERGY && numberOfHarvesters === 0) {
            // spawn one with what is available
            Game.spawns.Spawn1.spawnCustomCreep(
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
    // if not enough longDistanceHarvesters for W42S23, try to spawn one
    else if (numberOfLongDistanceHarvestersW42S23 < minimumNumberOfLongDistanceHarvestersW42S23) {
        Game.spawns.Spawn1.createLongDistanceHarvester(energy, 5, HOME, 'W42S23', 1)
    }
    // if not enough longDistanceHarvesters for W42S25, try to spawn one
    else if (numberOfLongDistanceHarvestersW42S25 < minimumNumberOfLongDistanceHarvestersW42S25) {
        Game.spawns.Spawn1.createLongDistanceHarvester(energy, 5, HOME, 'W42S25', 0)
    }
    else {
        // else try to spawn a builder
        Game.spawns.Spawn1.spawnCustomCreep(energy, 'builder');
    }
};