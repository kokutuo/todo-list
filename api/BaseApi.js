window.BaseApi = BaseApi;

function BaseApi(list, maxId) {
    this.list = list;
    this.maxId = maxId || list.length;
    this.loadList(list);
    this.onSync = null;
}

BaseApi.prototype.$add = $add;
BaseApi.prototype.$modify = $modify;
BaseApi.prototype.$read = $read;
BaseApi.prototype.$remove = $remove;
BaseApi.prototype.syncTo = syncTo;
BaseApi.prototype.syncFrom = syncFrom;
BaseApi.prototype.loadList = loadList;

/* 增 */
function $add(row) {
    this.maxId++;
    row.id = this.maxId;
    this.list.push(row);
    this.syncTo();
    store.set(this._modelName + '-maxId', this.maxId);
}

/* 删 */
function $remove(id) {
    var index = findIndexById(this.list, id);
    if (index < 0) {
        return;
    }
    this.list.splice(index, 1);
    this.syncTo();
}

/* 改 */
function $modify(id, newRow) {
    var index = findIndexById(this.list, id);
    if (index < 0) {
        return;
    }
    /* 删除更新数据的id, 防止 */
    delete newRow.id;
    var oldRow = this.list[index];
    this.list[index] = Object.assign({}, oldRow, newRow);
    this.syncTo();
}

/* 查 */
function $read(id) {
    if (id) {
        return findById(this.list, id);
    }

    return this.list;
}

/* 通过ID找到索引 */
function findIndexById(arr, id) {
    return arr.findIndex(function (item) {
        return item.id == id;
    });
}

/* 通过id找到数组项 */
function findById(arr, id) {
    return arr.find(function (item) {
        return item.id == id;
    });
}

function syncTo() {
    this.list = this.list || [];
    store.set(this._modelName + '-list', this.list);
    if (this.onSync) {
        this.onSync(this.list);
    }
}

function syncFrom() {
    var result = store.get(this._modelName + '-list');
    if (!result) {
        result = this.list = [];
        this.syncTo();
    }
    return result;
}

function loadList(list) {
    var old = this.syncFrom();
    if (!old || !old.length) {
        this.list = list || [];
        this.syncTo();
    } else {
        this.list = old;
    }
}