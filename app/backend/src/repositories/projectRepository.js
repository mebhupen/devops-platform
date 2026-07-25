
const BaseRepository = require('./baseRepository');
class ProjectRepository extends BaseRepository {
  constructor() { super('projects'); }
}
module.exports = new ProjectRepository();
