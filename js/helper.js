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

// 8. 算匯率
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


// 9. 下载当前 localStorage 数据
function downloadData() {
    const dataStr = localStorage.getItem("propertyList") || "{}";
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "propertyList.json";
    a.click();

    URL.revokeObjectURL(url);
}

// 10. 导入本地 JSON 文件
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const json = JSON.parse(e.target.result);
            // 这里你可以加验证 json 结构的代码，确保格式正确

            localStorage.setItem("propertyList", JSON.stringify(json));
            alert("导入成功，页面将刷新。");
            loadDateFromLocalStorage();
            calculateData('HKD');
        } catch (error) {
            alert("导入失败：文件内容不是有效的 JSON。");
        }
    };
    reader.readAsText(file);

    // 重置文件输入，方便下次导入同一文件
    event.target.value = "";
}