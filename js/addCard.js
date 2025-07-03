window.addEventListener("load", (event) => {
    loadDateFromLocalStorage();
    cur = document.getElementById('currencySelect').value;
    calculateData('HKD');
});



// 选择不同币种显示总金额的时候调用计算函数
document.querySelectorAll('.currencySelect').forEach(el => {
    el.addEventListener("change", (event) => {
        cur = el.value;
        document.querySelectorAll('.currencySelect').forEach(otherEl => {
            if (otherEl !== event.target) {
                otherEl.value = el.value;
            }
        });
        calculateData(cur);
        console.log(`class币种切换`);
    });
});

// Home-Page
const everydayPropertyAmount = document.getElementById('home-everday-property');
const everydayConsumptionAmount = document.getElementById('home-everday-consumption');
const everydaySubscriptionAmount = document.getElementById('home-everday-subscription');

// Property-Page
let properties = [];

const propertyAddBtn = document.getElementById('addBtn');
const propertyModal = document.getElementById('modal');
const propertyModalContent = document.getElementById('modal-contnet');
const propertyAddingConfirmBtn = document.getElementById('confirmBtn');
const propertyAddingCancelBtn = document.getElementById('cancelBtn');
const propertyDeleteBtn = document.getElementById('delete');
const propertyDeleteCancelBtn = document.getElementById('cancel');

propertyAddBtn.onclick = () => {
    appearElementById('modal');
};
propertyAddingCancelBtn.onclick = () => {
    disappearElementById('modal');
};

// 0. 获取今天的日期, 把选择器里的日期默认为今天的
const today = new Date().toISOString().split('T')[0];
document.getElementById('date').value = today;
// 只能输入今天及以前的日期
document.getElementById('date').setAttribute('max', today);

// 1. [property] 添加property
propertyAddingConfirmBtn.onclick = () => {
    const title = document.getElementById('cardTitle').value;
    const content = document.getElementById('cardContent').value;
    const amount = document.getElementById('amount').value;
    const currency = document.getElementById('currency').value;
    const date = document.getElementById('date').value;
    //错误输入判断
    if (!title.trim()) {
        alert("名称不能为空！");
        return;
    }
    if (!amount.trim()) {
        alert("金额不能为空! ");
        return;
    }

    addProperty(title, content, amount, currency, date);
    localStorage.setItem('propertyList', JSON.stringify(properties));
    addCard(title, content, amount, currency, date)
    calculateData(document.getElementById('currencySelect').value);
    renderPropertyCards();
    // 清空输入 & 关闭弹窗
    document.getElementById('cardTitle').value = '';
    document.getElementById('cardContent').value = '';
    document.getElementById('amount').value = '';
    disappearElementById('modal');
};

// 1a. [property] 在properties(数组)里添加
function addProperty(title, content, amount, currency, date) {
    properties.push({
        title: title,
        content: content,
        date: date,
        currency: currency,
        amount: amount
    });
}

// 1b. [property] 在浏览器上渲染卡片
function addCard(title, content, amount, currency, date) {
    dateDiff = getDateDiffInDays(new Date(), date);
    amount = Number(amount).toFixed(2);
    const card = document.createElement('div');
    card.className = 'card';
    card.id = title;
    card.innerHTML = `<h3>${title}</h3>
    <p>${currency} ${amount}</p>
    <p>${content}</p>
    <p>${describeDate(date)}</p>`;
    document.getElementById('cardContainer').appendChild(card);
}

//2. [property] 从本地储存获取property数据
function loadDateFromLocalStorage() {
    properties = JSON.parse(localStorage.getItem('propertyList')) || [];
    console.log("读取到的数据：", properties);
    renderPropertyCards();
}

// 3. [property] 将properties排序, 并根据properties刷新卡片
function renderPropertyCards() {
    document.querySelectorAll('.card').forEach(el => el.remove());
    cur = document.getElementById('currencySelect').value;
    calculateData(cur);
    properties.sort((a, b) => new Date(b.date) - new Date(a.date));
    properties.forEach((item, index) => {
        addCard(item.title, item.content, item.amount, item.currency, item.date);
    });
}

// 4. [property] 点击卡片弹出删除确认框
document.getElementById('cardContainer').addEventListener('click', function (e) {
    const card = e.target.closest('.card');
    if (card) {
        appearElementById('deleteConfirmation');

        console.log('你点击的是卡片 ID:', card.id);
        propertyDeleteBtn.onclick = () => {
            properties = deleteByTitle(properties, card.id);
            localStorage.setItem('propertyList', JSON.stringify(properties));
            renderPropertyCards();

            disappearElementById('deleteConfirmation');
        };
        propertyDeleteCancelBtn.onclick = () => {
            disappearElementById('deleteConfirmation');
        }
    }
});

// 5. [property] 计算总资产, 每日花销, 当月消费, 并更新
function calculateData(cur) {
    calculatePropertyTotal(cur);
    calculatePropertyDaily(cur);
    calculatePropertyMonth(cur);
}
// 5a
function calculatePropertyTotal(cur) {
    let totalAmount = 0;
    properties.forEach(item => {
        totalAmount += Number(convertCurrency(item.currency, cur, item.amount));
    });
    document.getElementById("property-total").textContent = totalAmount.toFixed(2);
}
// 5b
function calculatePropertyDaily(cur) {
    let amountPerDay = 0;
    properties.forEach(item => {
        let dateNow = new Date();
        dateDiff = getDateDiffInDays(dateNow, item.date);
        amountPerDay += Number(convertCurrency(item.currency, cur, item.amount) / dateDiff);
    });
    document.getElementById("amountPerDay").textContent = amountPerDay.toFixed(2);
    everydayPropertyAmount.textContent = amountPerDay.toFixed(2);
}
// 5c
function calculatePropertyMonth(cur) {
    let monthAmount = 0;
    properties.forEach(item => {
        let dateNow = new Date();
        if (isSameMonth(dateNow, new Date(item.date))) {
            monthAmount += Number(convertCurrency(item.currency, cur, item.amount));
        }
    });
    document.getElementById("monthAmount").textContent = monthAmount.toFixed(2);
}



