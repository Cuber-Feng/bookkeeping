function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.style.display = 'none'); // 全部隐藏

    const current = document.getElementById(pageId);
    if (current) current.style.display = 'block'; // 显示当前
}

function goDark() {
    if (!document.body.classList.contains("dark")) {
        document.body.classList.remove("light");
        document.body.classList.add("dark");

        document.getElementById('money-icon').src = "./icon/money-light.png";
        document.getElementById('computer-icon').src = "./icon/computer-light.png";
        document.getElementById('rubikscube-icon').src = "./icon/rubikscube-light.png";
        document.getElementById('calendar-icon').src = "./icon/calendar-light.png";
        document.getElementById('home-icon').src = "./icon/home-light.png";
    }
}

function goLight() {
    if (document.body.classList.contains("dark")) {
        document.body.classList.remove("dark");
        document.body.classList.add("light");

        document.getElementById('money-icon').src = "./icon/money.png";
        document.getElementById('computer-icon').src = "./icon/computer.png";
        document.getElementById('rubikscube-icon').src = "./icon/rubikscube.png";
        document.getElementById('calendar-icon').src = "./icon/calendar.png";
        document.getElementById('home-icon').src = "./icon/home.png";

    }
}

window.addEventListener("load", (event) => {
    // check the device's mode
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (isDark) {
        goDark();
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
    const isDark = e.matches;
    // 你可以在这里切换页面主题
    if (isDark) {
        goDark();
    } else {
        goLight();
    }
});