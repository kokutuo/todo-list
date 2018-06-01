window.helper = {
    setFormData: setFormData,
    getFormData: getFormData,
    clearForm: clearForm
};

/* 设置表单数据 */
function setFormData(form, data) {
    /* 若 form 是字符串，则需要通过 form 选择对应的 DOM 节点 */
    if (typeof form == 'string') {
        form = document.querySelector(form);
    }
    /* 遍历数据对象 */
    for (var key in data) {
        /* 缓存当前属性的值 */
        var value = data[key];
        /* 找到当前属性在表单中对应的input */
        var input = form.querySelector(`[name=${key}]`);

        if (!input) {
            continue;
        }

        /* 获取当前属性的数据类型 */
        var dataType = typeof value;

        /* 通过数据类型动态的赋值 */
        switch (dataType) {
            case 'string':
            case 'number':
                input.value = value;
                break;
            case 'boolean':
                input.checked = value;
                break;
        }
    }
}

/* 获取表单数据 */
function getFormData(form) {
    /* 若 form 是字符串，则需要通过 form 选择对应的 DOM 节点 */
    if (typeof form == 'string') {
        form = document.querySelector(form);
    }

    var data = {};
    var list = form.querySelectorAll('[name]');

    list.forEach(function (input) {
        switch (input.nodeName) {
            case 'INPUT':
                switch (input.type) {
                    case 'text':
                    case 'number':
                    case 'password':
                    case 'search':
                    case 'hidden':
                        data[input.name] = input.value;
                        break;
                    case 'checkbox':
                    case 'radio':
                        data[input.name] = input.checked;
                        break;
                }
                break;
            case 'TEXTAREA':
            case 'SELECT':
                data[input.name] = input.value;
                break;
        }
    });

    return data;
}

/* 清空 form 表单 */
function clearForm(form) {
    /* 若 form 是字符串，则需要通过 form 选择对应的 DOM 节点 */
    if (typeof form == 'string') {
        form = document.querySelector(form);
    }

    form.querySelectorAll('[name]').forEach(function (input) {
        if (input.type == 'checkbox' || input.type == 'radio') {
            input.value = false;
        } else {
            input.value = '';
        }

    });
}