window.TaskApi = TaskApi;

function TaskApi(list, maxId) {
    this._modelName = 'task';
    list = list || [];
    /* 继承显性属性（也就是原型prototype） */
    BaseApi.call(this, list, maxId);
}

/* 继承隐性属性 */
TaskApi.prototype = Object.create(BaseApi.prototype);
TaskApi.prototype.constructor = TaskApi;

TaskApi.prototype.add = add;
TaskApi.prototype.remove = remove;
TaskApi.prototype.modify = modify;
TaskApi.prototype.read = read;
TaskApi.prototype.filterById = filterById;
TaskApi.prototype.catDelete = catDelete;
TaskApi.prototype.setCompleted = setCompleted;

function add(row) {
    if (!row.title) {
        return;
    }

    if (!row.cat_id) {
        row.cat_id = 1;
    }
    return this.$add(row);
}

function remove(id) {
    return this.$remove(id);
}

function modify(id, newRow) {
    return this.$modify(id, newRow);
}

function read(id) {
    return this.$read(id);
}

/* 通过传入的cat_id来过滤出需要的数据 */
function filterById(cat_id) {
    var list = this.read();
    list = list || [];
    return list.filter(function (row) {
        return row.cat_id == cat_id;
    });
}

function catDelete(cat_id) {
    this.list = this.list.filter(function (row) {
        return row.cat_id != cat_id;
    });
    this.syncTo();
}

function setCompleted(id, completed) {
    var row = this.read(id);
    if (!row) {
        return false;
    }
    row.completed = completed;
    this.syncTo();
}