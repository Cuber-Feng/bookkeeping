window.onload = () => {
    loadDateFromLocalStorage();
    cur = document.getElementById('currencySelect').value;
    calculateData('HKD');
}

let exchangeRate;

async function getExchangeRate() {
    let data;
    data = JSON.parse(localStorage.getItem('exchangeRateData'));
    if (data) {
        console.log(`从本地获取汇率数据: `);
        console.log(data.time_last_update_utc);
        console.log(data.conversion_rates);
        exchangeRate = data.conversion_rates;
        return;
    }
    const url = `https://v6.exchangerate-api.com/v6/b36bf0209da6323832f4d689/latest/HKD`;
    try {
        const response = await fetch(url);
        data = await response.json();
        localStorage.setItem('exchangeRateData', JSON.stringify(data));
        console.log(data.conversion_rates);
        exchangeRate = data.conversion_rates;
    } catch (error) {
        console.error("Currency conversion error:", error);
        return null;
    }

}

getExchangeRate();

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

// Helper Function

// 1. 描述过去的日期(昨天, 5天前, 2年前)
function describeDate(inputDate) {
    const now = new Date();
    const date = new Date(inputDate);

    // 清除时间部分，只比较年月日
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thatDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const msPerDay = 1000 * 60 * 60 * 24;
    const diffDays = Math.floor((today - thatDay) / msPerDay);

    if (diffDays === 0) return "今天";
    if (diffDays === 1) return "昨天";
    if (diffDays === 2) return "前天";
    if (diffDays < 30) return `${diffDays}天前`;

    // 计算月份差
    let yearDiff = today.getFullYear() - thatDay.getFullYear();
    let monthDiff = today.getMonth() - thatDay.getMonth();

    if (monthDiff < 0) {
        yearDiff -= 1;
        monthDiff += 12;
    }

    if (yearDiff === 0) {
        return `${monthDiff}个月前`;
    } else {
        return `${yearDiff}年${monthDiff}个月前`;
    }
}

// 2. 计算两个日期差
function getDateDiffInDays(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffMs = d1 - d2; // 毫秒差
    return Math.round(diffMs / (1000 * 60 * 60 * 24)) || 1; // 转成天数并四舍五入
}

// 3. 判断是否同月
function isSameMonth(date1, date2) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth()
    );
}

// 4. 删除一整个class
function removeAllByClass(className) {
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach(el => el.remove());
    cur = document.getElementById('currencySelect').value;
    calculateData(cur);
}

// 5. 转换汇率
function convertCurrency(from, to, amount) {
    if (to == "HKD") {
        return amount / exchangeRate[from];
    } else if (from == 'HKD') {
        return amount * exchangeRate[to];
    } else {
        return amount * exchangeRate[to] / exchangeRate[from];
    }
}

// 6. 按title删除array里的元素
function deleteByTitle(array, titleToDelete) {
    return array.filter(item => item.title !== titleToDelete);
}

// 7. 逐渐消失
function disappearElementById(id) {
    document.getElementById(id).classList.add('hidden');
    setTimeout(() => {
        document.getElementById(id).classList.add('off');
    }, 500);
}

// 7a. 逐渐出现
function appearElementById(id) {
    document.getElementById(id).classList.remove('off');
    document.getElementById(id).classList.remove('hidden');
}