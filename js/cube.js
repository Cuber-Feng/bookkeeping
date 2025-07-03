window.addEventListener("load", (event) => {
    loadCubeFromLocalStorage();
    cur = document.getElementById('currencySelect').value;
    calculateCubeData('HKD');
});

let cubes = [];
const cubeToday = new Date().toISOString().split('T')[0];
document.getElementById('cubeDate').value = cubeToday;

let addCubeWindow = document.getElementById('addCube');
let addCubeBtn = document.getElementById('addCubeBtn');
let AddCubeCancelBtn = document.getElementById('AddCubeCancelBtn');
let AddCubeConfirmBtn = document.getElementById('AddCubeConfirmBtn');

// 1. 幾個按鈕控制窗口的彈出
addCubeBtn.addEventListener('click', () => {
    console.log("?");
    addCubeWindow.classList.remove('off');
    addCubeWindow.classList.remove('hidden');
});

AddCubeCancelBtn.addEventListener('click', () => {
    addCubeWindow.classList.add('off');
    addCubeWindow.classList.add('hidden');
});

//2. 添加新魔方
AddCubeConfirmBtn.onclick = () => {
    const title = document.getElementById('cubeCardTitle').value;
    const content = document.getElementById('cubeCardContent').value;
    const amount = document.getElementById('cubeAmount').value;
    const currency = document.getElementById('cubeCurrency').value;
    const date = document.getElementById('cubeDate').value;
    //错误输入判断
    if (!title.trim()) {
        alert("名称不能为空！");
        return;
    }
    if (!amount.trim()) {
        alert("金额不能为空! ");
        return;
    }

    addCube(title, content, amount, currency, date);
    localStorage.setItem('cubeList', JSON.stringify(cubes));
    addCubeCard(title, content, amount, currency, date)
    calculateCubeData(document.getElementById('currencySelect').value);
    renderCubeCards();
    // 清空输入 & 关闭弹窗
    document.getElementById('cubeCardTitle').value = '';
    document.getElementById('cubeCardContent').value = '';
    document.getElementById('cubeAmount').value = '';
    document.getElementById('cubeDate').value = cubeToday;
    addCubeWindow.classList.add('off');
    addCubeWindow.classList.add('hidden');
};

//2a. 在數組裏添加新cube
function addCube(title, content, amount, currency, date) {
    cubes.push({
        title: title,
        content: content,
        date: date,
        currency: currency,
        amount: amount
    });
}

// 2b. 在浏览器上渲染卡片
function addCubeCard(title, content, amount, currency, date) {
    dateDiff = getDateDiffInDays(new Date(), date);
    amount = Number(amount).toFixed(2);
    const cubecard = document.createElement('div');
    cubecard.className = 'cubeCard';
    cubecard.id = title;
    cubecard.innerHTML = `<h3>${title}</h3>
    <p>${currency} ${amount}</p>
    <p>${content}</p>
    <p>${describeDate(date)}</p>`;
    document.getElementById('cubeCardContainer').appendChild(cubecard);
}

// 3. 排序, 刷新卡片
function renderCubeCards() {
    document.querySelectorAll('.cubeCard').forEach(el => el.remove());
    cur = document.getElementById('currencySelect').value;
    calculateCubeData(cur);
    cubes.sort((a, b) => new Date(b.date) - new Date(a.date));
    cubes.forEach((item) => {
        addCubeCard(item.title, item.content, item.amount, item.currency, item.date);
    });
}

// 4. 计算总资产, 每日花销, 当月消费, 并更新
function calculateCubeData(cur) {
    calculateCubeTotal(cur);
}
// 4a
function calculateCubeTotal(cur) {
    let totalAmount = 0;
    cubes.forEach(item => {
        totalAmount += Number(convertCurrency(item.currency, cur, item.amount));
    });
    document.getElementById("cube-total").textContent = totalAmount.toFixed(2);
    document.getElementById('home-everday-cube').textContent = totalAmount.toFixed(2);

}

//5. 从本地储存获取cube数据
function loadCubeFromLocalStorage() {
    cubes = JSON.parse(localStorage.getItem('cubeList')) || [];
    console.log("读取到的数据：", properties);
    renderCubeCards();
}
//6. 刪除功能
document.getElementById('cubeCardContainer').addEventListener('click', function (e) {
    const cubeCard = e.target.closest('.cubeCard');
    if (cubeCard) {
        appearElementById('deleteCubeConfirmation');

        console.log('你点击的是卡片 ID:', cubeCard.id);
        document.getElementById('cube-delete').onclick = () => {
            cubes = deleteByTitle(cubes, cubeCard.id);
            localStorage.setItem('cubeList', JSON.stringify(cubes));
            renderCubeCards();

            disappearElementById('deleteCubeConfirmation');
        };
        propertyDeleteCancelBtn.onclick = () => {
            disappearElementById('deleteConfirmation');
        }
    }
});

// 下载当前 localStorage 数据
function downloadCubeData() {
    const dataStr = localStorage.getItem("cubeList") || "{}";
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "cubeList.json";
    a.click();

    URL.revokeObjectURL(url);
}

