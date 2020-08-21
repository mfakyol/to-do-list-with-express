module.exports = class Todo {
    constructor(todo, description, deadLine, isChecked){
        this.todo = todo;
        this.deadLine = deadLine;
        this.isChecked = isChecked;
    }
}