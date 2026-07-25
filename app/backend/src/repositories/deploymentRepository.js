
const BaseRepository = require('./baseRepository');
class DeploymentRepository extends BaseRepository {
  constructor() { super('deployments'); }
}
module.exports = new DeploymentRepository();
