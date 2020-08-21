const BaseService = require('./base-service');
const TodoModel = require('../models/Todo');

class ToDoService extends BaseService {
    constructor() {
        super(TodoModel, __dirname +'/../database/todo-database.json');
    }
}

module.exports = new ToDoService();