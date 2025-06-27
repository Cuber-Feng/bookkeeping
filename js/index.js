function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.style.display = 'none'); // 全部隐藏

    const current = document.getElementById(pageId);
    if (current) current.style.display = 'block'; // 显示当前
}