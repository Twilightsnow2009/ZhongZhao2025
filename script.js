// 安全修复：阻止iframe嵌入
if (window.top !== window.self) {
    window.top.location = window.self.location;
}

// 修复：完善弹窗逻辑
function showModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "block";

    // 阻止背景滚动
    document.body.style.overflow = "hidden";

    // 点击模态框外部关闭弹窗
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    };

    // 添加键盘ESC关闭支持
    document.onkeydown = function(evt) {
        evt = evt || window.event;
        if (evt.keyCode === 27) {
            closeModal();
        }
    };
}

function closeModal() {
    document.getElementById("myModal").style.display = "none";
    // 恢复背景滚动
    document.body.style.overflow = "";
    // 移除键盘事件监听
    document.onkeydown = null;
}

function dismissModal() {
    closeModal();
}

function lockPage() {
    const overlay = document.getElementById("overlay");
    overlay.style.display = "block";
    closeModal();

    // 添加退出按钮
    const exitButton = document.createElement("button");
    exitButton.textContent = "关闭网站";
    exitButton.className = "modal-button";
    exitButton.style.position = "fixed";
    exitButton.style.bottom = "20px";
    exitButton.style.left = "50%";
    exitButton.style.transform = "translateX(-50%)";
    exitButton.onclick = function() {
        // 尝试关闭窗口（受浏览器限制）
        try {
            window.close();
        } catch (e) {
            // 备用方案：跳转到空白页
            window.location.href = "about:blank";
        }
    };
    document.body.appendChild(exitButton);
}

// 修复：优化Cookie清除逻辑
function clearCookies() {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;

        // 删除当前路径下的cookie
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        // 删除根路径下的cookie（如果存在）
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + window.location.hostname;
    }
}

// 页面关闭时清除Cookie
window.onbeforeunload = clearCookies;

// 修复：添加网站运行时间计数器
function updateUptime() {
    const startTime = new Date('2025-05-11T08:00:00'); // 网站创建日期
    const now = new Date();
    const diff = now - startTime;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('uptime').textContent = `网站正常运行时间：${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒`;
}

// 每秒更新一次
setInterval(updateUptime, 1000);
updateUptime(); // 立即更新一次

// 安全修复：防止XSS攻击
document.addEventListener('DOMContentLoaded', function() {
    // 对所有用户可能交互的元素进行XSS过滤
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.setAttribute('rel', 'noopener noreferrer');
        link.setAttribute('target', '_blank');
    });
});
