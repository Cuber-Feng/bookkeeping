const CLIENT_ID = '197449730601-q6g8lgjg8r4btpsires1kc62v1mpb77p.apps.googleusercontent.com';

function handleCredentialResponse(response) {
    // response.credential 是 JWT 格式的 ID Token
    document.getElementById('output').textContent =
        '登录成功';

    // ，ID Token:\n' + response.credential;

    // 你可以把 ID Token 发送给后端验证，或者用它解码用户信息
    // 这里简单展示，后续你可以用 jwt-decode 库解析
}

window.onload = () => {
    google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(
        document.getElementById('g_id_signin'),
        { theme: 'outline', size: 'large' } // 你可以定制按钮样式
    );

    // 自动弹出登录框（可选）
    // google.accounts.id.prompt();
};

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.style.display = 'none'); // 全部隐藏

    const current = document.getElementById(pageId);
    if (current) current.style.display = 'block'; // 显示当前
}