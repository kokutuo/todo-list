window.TaskUi = TaskUi;

// test_list = [{
//         id: 100,
//         title: '搓炉石',
//         completed: false,
//         cat_id: 1
//     },
//     {
//         id: 101,
//         title: '崩崩崩',
//         completed: false,
//         cat_id: 1
//     },
//     {
//         id: 102,
//         title: '买菜',
//         completed: false,
//         cat_id: 2
//     },
//     {
//         id: 103,
//         title: '洗菜',
//         completed: false,
//         cat_id: 2
//     },
//     {
//         id: 104,
//         title: '背单词',
//         completed: false,
//         cat_id: 3
//     },
//     {
//         id: 105,
//         title: '写作文',
//         completed: false,
//         cat_id: 3
//     }
// ];

function TaskUi(config) {
    var defConfig = {
        formSelector: '#todo-form',
        listSelector: '#todo-list',
        completedListSelector: '.completed',
        incompleteListSelector: '.incomplete',
        inputSelector: '#todo-input',
        onInit: null,
        onInputFocus: null,
        onInputBlur: null,
        onAddSucceed: null
    };

    var c = this.config = Object.assign({}, defConfig, config);

    this.form = document.querySelector(c.formSelector);
    this.list = document.querySelector(c.listSelector);
    this.completedList = this.list.querySelector(c.completedListSelector);
    this.incompleteList = this.list.querySelector(c.incompleteListSelector);
    this.input = document.querySelector(c.inputSelector);
    /* 私有属性，不应该直接调用 */
    this._api = new TaskApi();
    this._api.onSync = c.onSync;
}


TaskUi.prototype.init = init;
TaskUi.prototype.render = render;
TaskUi.prototype.detectAdd = detectAdd;
TaskUi.prototype.detectClickList = detectClickList;
TaskUi.prototype.detectInputFocus = detectInputFocus;
TaskUi.prototype.detectInputBlur = detectInputBlur;
TaskUi.prototype.getFormData = helper.getFormData;
TaskUi.prototype.setFormData = helper.setFormData;
TaskUi.prototype.clearForm = helper.clearForm;


function init() {
    var cb = this.config.onInit;
    this.render(1);
    this.detectClickList();
    this.detectAdd();
    this.detectInputFocus();
    this.detectInputBlur();
    if (cb) {
        cb();
    }
}

function detectInputFocus() {
    var me = this;
    this.input.addEventListener('focus', function () {
        var cb = me.config.onInputFocus;
        if (cb) {
            cb();
        }
    });
}

function detectInputBlur() {
    var me = this;
    this.input.addEventListener('blur', function () {
        var cb = me.config.onInputBlur;
        if (cb) {
            cb();
        }
    });
}

function detectClickList() {
    var me = this;
    this.list.addEventListener('click', function (e) {
        var target = e.target;
        var todoItem = target.closest('.todo-item'),
            id = todoItem ? todoItem.dataset.id : null,
            row = me._api.read(id);

        var isRemove = target.classList.contains('remove'),
            isModify = target.classList.contains('modify'),
            isChecked = target.classList.contains('checker');

        if (isRemove) {
            me._api.remove(id);
            me.render(row.cat_id);
        } else if (isModify) {
            me.setFormData(me.form, row);
        } else if (isChecked) {
            me._api.setCompleted(id, target.checked);
            me.render(row.cat_id);
        } else if (!id) {
            return;
        }
    });
}

function remove(id) {}

/* 监听添加事件（表单提交事件） */
function detectAdd() {
    var me = this;
    this.form.addEventListener('submit', function (e) {
        e.preventDefault();
        /* 获取输入框的值 */
        var row = me.getFormData(me.form);
        if (row.id) {
            me._api.modify(row.id, row);
        } else {
            /* 更新数据 */
            me._api.add(row);
        }
        /* 更新界面 */
        me.render(row.cat_id);
        /* 清空表单的值 */
        me.clearForm(me.form);
        var cb = me.config.onAddSucceed;
        if (cb) {
            cb(row);
        }
    });
}

/* 渲染任务列表 */
function render(cat_id) {
    /* 通过api拿到数据 */
    var todoList = cat_id ?
        this._api.filterById(cat_id) :
        this._api.read();

    /* 先清空 */
    this.completedList.innerHTML = '';
    this.incompleteList.innerHTML = '';

    var me = this,
        holder = `<div class='empty-holder'>暂无内容</div>`;

    todoList = todoList || [];

    /* 遍历数据，插入列表 */
    todoList.forEach(function (item) {
        var el = document.createElement('div');
        el.classList.add('row', 'todo-item');
        el.dataset.id = item.id;

        el.innerHTML = `
        <div class="col checkbox">
            <input class='checker' type="checkbox" ${item.completed ? 'checked' : ''}>
        </div>
        <div class="col detail">
            <div class="title">${item.title}</div>
        </div>
        <div class="col tool-set">
            <button class='modify'>更新</button>
            <button class='remove'>删除</button>
        </div>
        `;
        if (item.completed) {
            me.completedList.appendChild(el);
        } else {
            me.incompleteList.appendChild(el);
        }
    });

    if (!this.incompleteList.innerHTML) {
        this.incompleteList.innerHTML = holder;
    }
    if (!this.completedList.innerHTML) {
        this.completedList.innerHTML = holder;
    }
}