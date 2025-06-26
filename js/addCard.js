let properties = [];

const addBtn = document.getElementById('addBtn');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-contnet');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');
const deleteBtn = document.getElementById('delete');
const cancel = document.getElementById('cancel');

addBtn.onclick = () => {
    modal.classList.remove('hidden');
};
cancelBtn.onclick = () => {
    modal.classList.add('hidden');
};

// helper function: remove class
function removeAllByClass(className) {
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach(el => el.remove());
}

// 用法：
removeAllByClass('myClass');


// 获取今天的日期，格式为 YYYY-MM-DD
const today = new Date().toISOString().split('T')[0];
document.getElementById('date').value = today;

function addProperty(title, content, amount, currency, date) {
    properties.push({
        title: title,
        content: content,
        date: date,
        currency: currency,
        amount: amount
    });
}

function addCard(title, content, amount, currency, date) {
    const card = document.createElement('div');
    card.className = 'card';
    card.id = title;
    card.innerHTML = `<h3>${title}</h3>
    <p>${currency}${amount}</p>
    <p>${content}</p>
    <p>${date}</p>`;

    document.getElementById('cardContainer').appendChild(card);
}

function deleteByTitle(array, titleToDelete) {
    return array.filter(item => item.title !== titleToDelete);
}


confirmBtn.onclick = () => {
    const title = document.getElementById('cardTitle').value;
    const content = document.getElementById('cardContent').value;
    const amount = document.getElementById('amount').value;
    const currency = document.getElementById('currency').value;
    const date = document.getElementById('date').value;

    if (!title.trim()) {
        alert("名称不能为空！");
        return;
    }

    addProperty(title, content, amount, currency, date);
    localStorage.setItem('propertyList', JSON.stringify(properties));
    addCard(title, content, amount, currency, date)

    // 清空输入 & 关闭弹窗
    document.getElementById('cardTitle').value = '';
    document.getElementById('cardContent').value = '';
    document.getElementById('amount').value = '';
    modal.classList.add('hidden');
};

function loadDateFromLocalStorage() {
    properties = JSON.parse(localStorage.getItem('propertyList')) || [];
    console.log("读取到的数据：", properties);
    removeAllByClass("card");
    properties.forEach((item, index) => {
        addCard(item.title, item.content, item.amount, item.currency, item.date);
    });
}

document.getElementById("plink").addEventListener("click", function (e) {
    e.preventDefault(); // 阻止跳转
    loadDateFromLocalStorage();
});

document.getElementById('cardContainer').addEventListener('click', function (e) {
    const card = e.target.closest('.card');
    if (card) {
        document.getElementById('deleteConfirmation').classList.remove('hidden');
        console.log('你点击的是卡片 ID:', card.id);
        deleteBtn.onclick = () => {
            properties = deleteByTitle(properties, card.id);
            localStorage.setItem('propertyList', JSON.stringify(properties));
            loadDateFromLocalStorage();
            document.getElementById('deleteConfirmation').classList.add('hidden');
        };
        cancel.onclick = () => document.getElementById('deleteConfirmation').classList.add('hidden');
    }
});

