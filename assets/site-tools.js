/* 深度学习课程站 · 全站共享工具条：站内搜索 / 深色模式 / 分享二维码 / 返回顶部 */
(function () {
    var PREFIX = location.pathname.indexOf('/courses/') >= 0 ? '../../' : '';

    /* ---------- 样式 ---------- */
    var css = ''
        + '#dl-tools{position:fixed;right:18px;bottom:18px;z-index:9000;display:flex;flex-direction:column;gap:10px;}'
        + '#dl-tools button{width:44px;height:44px;border-radius:50%;border:1px solid #CBD5E1;background:#fff;'
        + 'font-size:19px;cursor:pointer;box-shadow:0 2px 10px rgba(15,23,42,.18);line-height:1;}'
        + '#dl-tools button:hover{background:#EFF6FF;border-color:#2563EB;}'
        + '#dl-top{display:none;}'
        + '.dl-modal-mask{position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:9500;display:flex;'
        + 'align-items:flex-start;justify-content:center;padding:60px 16px;}'
        + '.dl-modal{background:#fff;border-radius:12px;width:640px;max-width:100%;max-height:76vh;overflow:auto;'
        + 'padding:20px 22px;box-shadow:0 8px 30px rgba(15,23,42,.25);color:#1E293B;}'
        + '.dl-modal h3{margin:0 0 12px;font-size:17px;color:#1E293B;}'
        + '.dl-modal .dl-close{float:right;border:none;background:none;font-size:20px;cursor:pointer;color:#64748B;}'
        + '#dl-search-input{width:100%;box-sizing:border-box;padding:9px 12px;font-size:15px;border:1px solid #CBD5E1;border-radius:8px;}'
        + '.dl-hit{display:block;padding:9px 10px;border-bottom:1px solid #F1F5F9;text-decoration:none;color:#1E293B;border-radius:6px;}'
        + '.dl-hit:hover{background:#EFF6FF;}'
        + '.dl-hit .dl-hit-c{font-size:12px;color:#2563EB;margin-right:8px;}'
        + '.dl-hit .dl-hit-t{font-weight:600;font-size:15px;}'
        + '.dl-hit .dl-hit-x{font-size:13px;color:#64748B;margin-top:3px;}'
        + '.dl-hit mark{background:#FDE68A;padding:0 1px;}'
        + '#dl-qr-box{display:flex;flex-direction:column;align-items:center;gap:12px;padding:10px 0;}'
        + '#dl-qr-box .dl-qr-url{font-size:13px;color:#64748B;word-break:break-all;text-align:center;}';
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);

    /* ---------- 工具条按钮 ---------- */
    var bar = document.createElement('div');
    bar.id = 'dl-tools';
    bar.innerHTML = ''
        + '<button id="dl-btn-search" title="站内搜索">🔍</button>'
        + '<button id="dl-btn-qr" title="分享本页二维码">📱</button>'
        + '<button id="dl-btn-theme" title="深色 / 浅色模式">🌙</button>'
        + '<button id="dl-top" title="返回顶部">🔝</button>';
    document.body.appendChild(bar);

    /* ---------- 通用弹窗 ---------- */
    function openModal(html) {
        closeModal();
        var mask = document.createElement('div');
        mask.className = 'dl-modal-mask';
        mask.innerHTML = '<div class="dl-modal"><button class="dl-close">✕</button>' + html + '</div>';
        mask.addEventListener('click', function (e) { if (e.target === mask) closeModal(); });
        mask.querySelector('.dl-close').addEventListener('click', closeModal);
        document.body.appendChild(mask);
        return mask;
    }
    function closeModal() {
        var m = document.querySelector('.dl-modal-mask');
        if (m) m.remove();
    }
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

    /* ---------- 站内搜索 ---------- */
    document.getElementById('dl-btn-search').addEventListener('click', function () {
        var mask = openModal('<h3>🔍 站内搜索（第 01–04 章讲义）</h3>'
            + '<input id="dl-search-input" type="text" placeholder="输入关键词，如：梯度下降 / 卷积 / softmax…">'
            + '<div id="dl-search-res" style="margin-top:10px;"></div>');
        var input = mask.querySelector('#dl-search-input');
        var res = mask.querySelector('#dl-search-res');
        input.focus();
        function run() {
            var q = input.value.trim();
            if (!q) { res.innerHTML = ''; return; }
            var ql = q.toLowerCase();
            var hits = (window.DL_SEARCH_INDEX || []).filter(function (it) {
                return it.t.toLowerCase().indexOf(ql) >= 0 || it.x.toLowerCase().indexOf(ql) >= 0;
            }).slice(0, 12);
            if (!hits.length) {
                res.innerHTML = '<p style="color:#94A3B8;font-size:14px;padding:8px 4px;">没有找到相关内容，换个关键词试试。</p>';
                return;
            }
            var re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            res.innerHTML = hits.map(function (it) {
                var url = PREFIX + it.u;
                var t = it.t.replace(re, function (m) { return '<mark>' + m + '</mark>'; });
                var x = it.x.replace(re, function (m) { return '<mark>' + m + '</mark>'; });
                return '<a class="dl-hit" href="' + url + '">'
                    + '<div><span class="dl-hit-c">' + it.c + '</span><span class="dl-hit-t">' + t + '</span></div>'
                    + (x ? '<div class="dl-hit-x">' + x + '</div>' : '') + '</a>';
            }).join('');
        }
        input.addEventListener('input', run);
    });

    /* ---------- 深色模式 ---------- */
    var themeBtn = document.getElementById('dl-btn-theme');
    function syncThemeIcon() {
        themeBtn.textContent = document.documentElement.classList.contains('dl-dark') ? '☀️' : '🌙';
    }
    themeBtn.addEventListener('click', function () {
        var dark = document.documentElement.classList.toggle('dl-dark');
        try { localStorage.setItem('dl_theme', dark ? 'dark' : 'light'); } catch (e) {}
        syncThemeIcon();
    });
    syncThemeIcon();

    /* ---------- 分享二维码 ---------- */
    document.getElementById('dl-btn-qr').addEventListener('click', function () {
        var mask = openModal('<h3>📱 扫码访问本页</h3>'
            + '<div id="dl-qr-box"><div id="dl-qr-img">二维码生成中…</div>'
            + '<div class="dl-qr-url">' + location.href + '</div></div>');
        var box = mask.querySelector('#dl-qr-img');
        function render() {
            box.innerHTML = '';
            new QRCode(box, { text: location.href, width: 200, height: 200, correctLevel: QRCode.CorrectLevel.M });
        }
        if (window.QRCode) { render(); return; }
        var s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/gh/davidshimjs/qrcodejs@master/qrcode.min.js';
        s.onload = render;
        s.onerror = function () { box.textContent = '二维码组件加载失败，可直接复制下方链接分享。'; };
        document.head.appendChild(s);
    });

    /* ---------- 返回顶部 ---------- */
    var topBtn = document.getElementById('dl-top');
    window.addEventListener('scroll', function () {
        topBtn.style.display = window.scrollY > 400 ? 'block' : 'none';
    }, { passive: true });
    topBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();
