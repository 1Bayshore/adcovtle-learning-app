let lessonData = {};

async function fetchData() {
    let response = await fetch('lessons_test.json');
    data = await response.json();
    lessonData = data;
}

function updateItem(i, item, prefix) {
    if (typeof item == "object") {
        pEle = document.createElement('p');
        pEle.innerText = i;
        document.getElementById('lessonForm').appendChild(pEle);
        for (let j in item) {
            updateItem(j, item[j], prefix + "-" + i);
        }
        return;
    }
    ele = document.createElement('input');
    ele.type = 'text';
    ele.name = prefix + "-" + i;
    ele.value = item;
    ele.onkeydown = function (e) {
        if (e.keyCode == 13) {
            return false;
        }
        return true;
    }
    lab = document.createElement('label');
    lab.for = ele;
    lab.innerText = i;
    document.getElementById('lessonForm').appendChild(document.createElement('br'));
    document.getElementById('lessonForm').appendChild(lab);
    document.getElementById('lessonForm').appendChild(ele);
}

function updateForm() {
    for (let i in lessonData) {
        updateItem(i, lessonData[i], "");
    }
}

async function loadPage() {
    await fetchData();
    updateForm();
}

loadPage();