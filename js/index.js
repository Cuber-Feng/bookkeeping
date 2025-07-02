let isDark = false;
let currentPageId = 'home';

function showPage(pageId) {
    currentPageId = pageId;
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.style.display = 'none'); // 全部隐藏
    if (isDark) {
        turnIconDark();
    } else { turnIconLight(); }

    const current = document.getElementById(pageId);
    if (current) {
        current.style.display = 'block';
        if (isDark) {
            turnPageIconLight(pageId);
        } else { turnPageIconDark(pageId); }
    } // 显示当前
}

function turnIconDark() {
    document.getElementById('money-icon').src = "./icon/money.png";
    document.getElementById('computer-icon').src = "./icon/computer.png";
    document.getElementById('rubikscube-icon').src = "./icon/rubikscube.png";
    document.getElementById('calendar-icon').src = "./icon/calendar.png";
    document.getElementById('home-icon').src = "./icon/home.png";
    document.getElementById('addBtnImg').src = "./svg/add-light.png";
}

function turnIconLight() {
    document.getElementById('money-icon').src = "./icon/money-light.png";
    document.getElementById('computer-icon').src = "./icon/computer-light.png";
    document.getElementById('rubikscube-icon').src = "./icon/rubikscube-light.png";
    document.getElementById('calendar-icon').src = "./icon/calendar-light.png";
    document.getElementById('home-icon').src = "./icon/home-light.png";
    document.getElementById('addBtnImg').src = "./svg/add.svg";
}

function turnPageIconDark(pageId) {
    switch (pageId) {
        case 'home':
            document.getElementById('home-icon').src = "./icon/home.png";
            break;
        case 'property':
            document.getElementById('computer-icon').src = "./icon/computer.png";
            break;
        case 'cube':
            document.getElementById('rubikscube-icon').src = "./icon/rubikscube.png";
            break;
        case 'consumption':
            document.getElementById('money-icon').src = "./icon/money.png";
            break;
        case 'subscription':
            document.getElementById('calendar-icon').src = "./icon/calendar.png";
            break;
        default:
            break;
    }
}

function turnPageIconLight(pageId) {
    switch (pageId) {
        case 'home':
            document.getElementById('home-icon').src = "./icon/home-light.png";
            break;
        case 'property':
            document.getElementById('computer-icon').src = "./icon/computer-light.png";
            break;
        case 'cube':
            document.getElementById('rubikscube-icon').src = "./icon/rubikscube-light.png";
            break;
        case 'consumption':
            document.getElementById('money-icon').src = "./icon/money-light.png";
            break;
        case 'subscription':
            document.getElementById('calendar-icon').src = "./icon/calendar-light.png";
            break;
        default:
            break;
    }
}

function goDark() {
    if (!document.body.classList.contains("dark")) {
        document.body.classList.remove("light");
        document.body.classList.add("dark");
        turnIconLight();
    }
    turnIconDark();
    turnPageIconLight(currentPageId);
}

function goLight() {
    if (document.body.classList.contains("dark")) {
        document.body.classList.remove("dark");
        document.body.classList.add("light");
        turnIconDark();
    }
    turnIconLight();
    turnPageIconDark(currentPageId);
}

window.addEventListener("load", (event) => {
    // check the device's mode
    isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (isDark) {
        goDark();
        turnIconDark();
        turnPageIconLight('home');
    } else {
        turnIconLight();
        turnPageIconDark('home');
    }
});

function toggleMode() {
    if (document.body.classList.contains("dark")) {
        document.body.classList.remove("dark");
        document.body.classList.add("light");

        document.querySelectorAll("body *").forEach(el => {
            el.classList.remove("dark");
            el.classList.add("light");
        });
    } else {
        document.body.classList.remove("light");
        document.body.classList.add("dark");

        document.querySelectorAll("body *").forEach(el => {
            el.classList.remove("light");
            el.classList.add("dark");
        });
    }
}

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

mediaQuery.addEventListener('change', (e) => {
    isDark = e.matches;
    // 你可以在这里切换页面主题
    if (isDark) {
        goDark();
    } else {
        goLight();
    }
});
