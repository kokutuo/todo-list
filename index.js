var catSelect = document.querySelector('#cat-select');

var taskUi = new TaskUi({
    onInit: renderCatOption,
    onInputFocus: showCatSelect,
    onInputBlur: function () {},
    onAddSucceed: function (row) {
        hideCatSelect();
        catUi.setActiveCatItem(row.cat_id);
    }
});

var catUi = new CatUi({
    onItemClick: renderTask,
    onItemDelete: removeTaskByCat,
    onSync: function name(chang_list) {
        renderCatOption();
    }
});

function renderTask(id) {
    taskUi.render(id);
}

function removeTaskByCat(id) {
    taskUi._api.catDelete(id);

    taskUi.render();
}

function showCatSelect() {
    catSelect.hidden = false;
}

function hideCatSelect() {
    catSelect.hidden = true;
}

function renderCatOption() {
    var list = catUi._api.read();
    catSelect.innerHTML = '';
    list.forEach(function (row) {
        var el = document.createElement('option');
        el.value = row.id;
        el.innerText = row.title;
        catSelect.appendChild(el);
    });
}

taskUi.init();
catUi.init();

/*

{
form: <form>,
list: <div>,
_api: {...},
-----------------
render: f() {}
get_form_data: f() {}
set_form_data: f() {}
}

*/