module.exports = () => {
    StructureSpawn.prototype.spawnCustomCreep =
        function (energy, roleName) {
            // create a balanced body as big as possible with the given energy
            const numberOfParts = Math.floor(energy / 200);
            const body = [];
            for (let i = 0; i < numberOfParts; i++) {
                body.push(WORK);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(MOVE);
            }

            // create creep with the created body and the given role
            const creepName = `${roleName}${Game.time}`
            return this.spawnCreep(body, creepName, { memory: { role: roleName, working: false } });
        };

    StructureSpawn.prototype.createLongDistanceHarvester =
        function (energy, numberOfWorkParts, home, target, sourceIndex) {
            // create a body with the specified number of WORK parts and one MOVE part per non-MOVE part
            const body = [];
            for (let i = 0; i < numberOfWorkParts; i++) {
                body.push(WORK);
            }

            // 150 = 100 (cost of WORK) + 50 (cost of MOVE)
            energy -= 150 * numberOfWorkParts;

            const numberOfParts = Math.floor(energy / 100);
            for (let i = 0; i < numberOfParts; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts + numberOfWorkParts; i++) {
                body.push(MOVE);
            }

            // spawn creep with the created body
            const creepName = `longDistanceHarvester${target}--${Game.time}`
            return this.spawnCreep(body, creepName, {
                memory: {
                    role: 'longDistanceHarvester',
                    home,
                    target,
                    sourceIndex,
                    working: false
                }
            });
        };
};