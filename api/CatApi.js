window.CatApi = CatApi;

function CatApi(list, maxId) {
    this._modelName = 'cat';
    this.config = {
        title: {
            maxLength: 10
        }
    };
    list = list || [{
        id: 1,
        title: '默认'
    },
    {
        id: 2,
        title: '个人'
    },
    {
        id:3,
        title: '工作'
    }
];
    /* 继承显性属性 */
    BaseApi.call(this, list, maxId);
}

/* 继承隐性属性 */
CatApi.prototype = Object.create(BaseApi.prototype);
CatApi.prototype.constructor = CatApi;

CatApi.prototype.add = add;
CatApi.prototype.remove = remove;
CatApi.prototype.modify = modify;
CatApi.prototype.read = read;

function add(row) {
    if (!row.title) {
        return;
    }
    
    /* 获取设置好的最大输入字符长度 */
    var maxLength = this.config.title.maxLength;
    if (row.title.length > maxLength) {
        throw 'title should not greater than ${maxLength}';
    }

    this.$add(row);
}

function remove(id) {
    if (id == 1) {
        return;
    }
    return this.$remove(id);
}

function modify(id, newRow) {
    return this.$modify(id, newRow);
}

function read(id) {
    return this.$read(id);
}