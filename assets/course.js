/* ============================================================
   深度学习课程站 · 互动讲义公共脚本
   功能：左侧可折叠目录 / 回到顶部 / 页面配色切换 / 页内内容查找
   ============================================================ */
(function () {
    'use strict';

    function ready(fn) {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
        else fn();
    }

    ready(function () {
        var page = document.querySelector('.page');
        if (!page) return;
        var root = document.documentElement;

        /* ==================== 1. 左侧目录（自动生成） ==================== */
        var chapters = Array.prototype.slice.call(page.querySelectorAll('section.chapter'));
        var tocItems = [];
        chapters.forEach(function (sec, ci) {
            var h2 = sec.querySelector('.chapter-head h2') || sec.querySelector('h2');
            if (!h2) return;
            if (!sec.id) sec.id = 'ch' + (ci + 1);
            var numEl = sec.querySelector('.chapter-num');
            var item = {
                id: sec.id,
                num: numEl ? numEl.textContent.trim() : String(ci + 1),
                text: h2.textContent.trim(),
                subs: []
            };
            Array.prototype.forEach.call(sec.querySelectorAll('h3'), function (h3, si) {
                if (!h3.id) h3.id = sec.id + '-s' + (si + 1);
                var noEl = h3.querySelector('.sec-no');
                var label = h3.textContent.trim();
                if (noEl) {
                    var no = noEl.textContent.trim();
                    label = no + ' ' + label.slice(no.length).trim();
                }
                item.subs.push({ id: h3.id, text: label });
            });
            tocItems.push(item);
        });

        var toc = document.createElement('aside');
        toc.id = 'dl-toc';
        toc.setAttribute('aria-label', '本讲目录');
        var head = document.createElement('div');
        head.className = 'dl-toc-head';
        var headLabel = document.createElement('span');
        headLabel.textContent = '本讲目录';
        var hideBtn = document.createElement('button');
        hideBtn.type = 'button';
        hideBtn.title = '收起目录';
        hideBtn.textContent = '«';
        head.appendChild(headLabel);
        head.appendChild(hideBtn);
        toc.appendChild(head);

        var tocBody = document.createElement('div');
        tocBody.className = 'dl-toc-body';
        var linkMap = [];
        tocItems.forEach(function (item) {
            var ch = document.createElement('div');
            ch.className = 'dl-toc-ch';
            var row = document.createElement('div');
            row.className = 'dl-toc-ch-row';
            var a = document.createElement('a');
            a.className = 'dl-toc-ch-link';
            a.href = '#' + item.id;
            var nSpan = document.createElement('span');
            nSpan.className = 'n';
            nSpan.textContent = item.num;
            var tSpan = document.createElement('span');
            tSpan.textContent = item.text;
            a.appendChild(nSpan);
            a.appendChild(tSpan);
            linkMap.push({ elId: item.id, link: a });
            row.appendChild(a);
            if (item.subs.length) {
                var arrow = document.createElement('button');
                arrow.type = 'button';
                arrow.className = 'dl-toc-arrow';
                arrow.setAttribute('aria-label', '展开或收起子目录');
                arrow.textContent = '▾';
                arrow.addEventListener('click', function () { ch.classList.toggle('closed'); });
                row.appendChild(arrow);
            }
            ch.appendChild(row);
            if (item.subs.length) {
                var subs = document.createElement('div');
                subs.className = 'dl-toc-subs';
                item.subs.forEach(function (s) {
                    var sa = document.createElement('a');
                    sa.href = '#' + s.id;
                    sa.textContent = s.text;
                    linkMap.push({ elId: s.id, link: sa });
                    subs.appendChild(sa);
                });
                ch.appendChild(subs);
            }
            tocBody.appendChild(ch);
        });
        toc.appendChild(tocBody);
        document.body.appendChild(toc);

        var mask = document.createElement('div');
        mask.id = 'dl-toc-mask';
        document.body.appendChild(mask);

        function isWide() { return window.innerWidth >= 1340; }
        function tocClose() {
            if (isWide()) {
                root.classList.add('dl-toc-collapsed');
                try { localStorage.setItem('dl_toc_collapsed', '1'); } catch (e) {}
            } else {
                root.classList.remove('dl-toc-open');
            }
        }
        function tocToggle() {
            if (isWide()) {
                var collapsed = root.classList.toggle('dl-toc-collapsed');
                try { localStorage.setItem('dl_toc_collapsed', collapsed ? '1' : '0'); } catch (e) {}
            } else {
                root.classList.toggle('dl-toc-open');
            }
        }
        hideBtn.addEventListener('click', tocClose);
        mask.addEventListener('click', function () { root.classList.remove('dl-toc-open'); });
        toc.addEventListener('click', function (e) {
            if (e.target.closest('a') && !isWide()) root.classList.remove('dl-toc-open');
        });

        /* 目录收起后，左边缘的就近展开把手 */
        var tab = document.createElement('button');
        tab.id = 'dl-toc-tab';
        tab.type = 'button';
        tab.title = '展开目录';
        tab.textContent = '目录 »';
        tab.addEventListener('click', tocToggle);
        document.body.appendChild(tab);
        try {
            if (localStorage.getItem('dl_toc_collapsed') === '1') root.classList.add('dl-toc-collapsed');
        } catch (e) {}

        /* 滚动高亮当前小节 */
        var spy = [];
        linkMap.forEach(function (m) {
            var el = document.getElementById(m.elId);
            if (el) spy.push({ el: el, link: m.link });
        });
        var ticking = false;
        function updateSpy() {
            ticking = false;
            var best = null;
            for (var i = 0; i < spy.length; i++) {
                if (spy[i].el.getBoundingClientRect().top <= 120) best = spy[i];
                else break;
            }
            for (var j = 0; j < spy.length; j++) spy[j].link.classList.remove('active');
            if (best) {
                best.link.classList.add('active');
                var chEl = best.link.closest('.dl-toc-ch');
                if (chEl) chEl.classList.remove('closed');
            }
        }
        window.addEventListener('scroll', function () {
            if (!ticking) { ticking = true; requestAnimationFrame(updateSpy); }
        }, { passive: true });
        updateSpy();

        /* ==================== 2. 浮动工具按钮 ==================== */
        var tools = document.createElement('div');
        tools.id = 'dl-tools';
        tools.innerHTML =
            '<button type="button" id="dl-tool-toc" title="目录">☰</button>' +
            '<button type="button" id="dl-tool-theme" title="更改页面颜色">🎨</button>' +
            '<button type="button" id="dl-tool-search" title="内容查找（快捷键 /）">🔍</button>' +
            '<button type="button" id="dl-tool-top" title="回到顶部">↑</button>';
        document.body.appendChild(tools);
        document.getElementById('dl-tool-toc').addEventListener('click', tocToggle);
        document.getElementById('dl-tool-top').addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        window.addEventListener('scroll', function () {
            root.classList.toggle('dl-scrolled', window.scrollY > 400);
        }, { passive: true });
        root.classList.toggle('dl-scrolled', window.scrollY > 400);

        /* ==================== 3. 页面配色 ==================== */
        var THEMES = [
            { key: 'light', name: '浅色', dot: '#FFFFFF' },
            { key: 'sepia', name: '护眼', dot: '#F1E2BC' },
            { key: 'dark',  name: '深色', dot: '#1E293B' }
        ];
        var themeMenu = document.createElement('div');
        themeMenu.id = 'dl-theme-menu';
        THEMES.forEach(function (t) {
            var b = document.createElement('button');
            b.type = 'button';
            b.setAttribute('data-theme', t.key);
            var dot = document.createElement('span');
            dot.className = 'dot';
            dot.style.background = t.dot;
            var nm = document.createElement('span');
            nm.textContent = t.name;
            b.appendChild(dot);
            b.appendChild(nm);
            b.addEventListener('click', function () {
                applyTheme(t.key);
                themeMenu.classList.remove('open');
            });
            themeMenu.appendChild(b);
        });
        document.body.appendChild(themeMenu);

        function getTheme() {
            try { return localStorage.getItem('dl_theme') || 'light'; } catch (e) { return 'light'; }
        }
        function applyTheme(t) {
            root.classList.toggle('dl-dark', t === 'dark');
            root.classList.toggle('dl-sepia', t === 'sepia');
            try { localStorage.setItem('dl_theme', t); } catch (e) {}
            Array.prototype.forEach.call(themeMenu.querySelectorAll('button'), function (b) {
                b.classList.toggle('sel', b.getAttribute('data-theme') === t);
            });
        }
        var themeBtn = document.getElementById('dl-tool-theme');
        themeBtn.addEventListener('click', function () {
            if (themeMenu.classList.contains('open')) { themeMenu.classList.remove('open'); return; }
            var r = themeBtn.getBoundingClientRect();
            themeMenu.style.bottom = (window.innerHeight - r.top + 8) + 'px';
            themeMenu.style.right = (window.innerWidth - r.right) + 'px';
            themeMenu.classList.add('open');
        });
        document.addEventListener('click', function (e) {
            if (!e.target.closest('#dl-theme-menu') && !e.target.closest('#dl-tool-theme')) {
                themeMenu.classList.remove('open');
            }
        });
        applyTheme(getTheme());

        /* ==================== 4. 页内查找 ==================== */
        var searchBox = document.createElement('div');
        searchBox.id = 'dl-search';
        searchBox.innerHTML =
            '<input type="text" id="dl-search-input" placeholder="查找本页内容…">' +
            '<span class="cnt" id="dl-search-cnt">0 / 0</span>' +
            '<button type="button" id="dl-search-prev" title="上一个（Shift+Enter）">↑</button>' +
            '<button type="button" id="dl-search-next" title="下一个（Enter）">↓</button>' +
            '<button type="button" id="dl-search-close" title="关闭（Esc）">×</button>';
        document.body.appendChild(searchBox);
        var sInput = document.getElementById('dl-search-input');
        var sCnt = document.getElementById('dl-search-cnt');
        var marks = [], cur = -1, debounceTimer = null;

        function clearMarks() {
            Array.prototype.forEach.call(page.querySelectorAll('mark.dl-hit'), function (m) {
                var t = document.createTextNode(m.textContent);
                m.parentNode.replaceChild(t, m);
            });
            marks = [];
            cur = -1;
        }
        function markCur() {
            marks.forEach(function (m, i) { m.classList.toggle('cur', i === cur); });
        }
        function runSearch(q) {
            clearMarks();
            if (!q) { sCnt.textContent = '0 / 0'; return; }
            var walker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT, {
                acceptNode: function (n) {
                    if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                    var p = n.parentElement;
                    if (!p) return NodeFilter.FILTER_REJECT;
                    if (p.closest('script,style,.katex,#dl-toc,#dl-tools,#dl-search,#dl-theme-menu')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            });
            var nodes = [];
            while (walker.nextNode()) nodes.push(walker.currentNode);
            var ql = q.toLowerCase();
            nodes.forEach(function (tn) {
                if (marks.length >= 500) return;
                var text = tn.nodeValue;
                var lt = text.toLowerCase();
                if (lt.indexOf(ql) === -1) return;
                var frag = document.createDocumentFragment();
                var idx = 0, pos;
                while ((pos = lt.indexOf(ql, idx)) !== -1 && marks.length < 500) {
                    frag.appendChild(document.createTextNode(text.slice(idx, pos)));
                    var m = document.createElement('mark');
                    m.className = 'dl-hit';
                    m.textContent = text.slice(pos, pos + q.length);
                    frag.appendChild(m);
                    marks.push(m);
                    idx = pos + q.length;
                }
                frag.appendChild(document.createTextNode(text.slice(idx)));
                tn.parentNode.replaceChild(frag, tn);
            });
            if (marks.length) { cur = 0; markCur(); }
            sCnt.textContent = (marks.length ? cur + 1 : 0) + ' / ' + marks.length;
        }
        function jump(d) {
            if (!marks.length) return;
            cur = (cur + d + marks.length) % marks.length;
            markCur();
            sCnt.textContent = (cur + 1) + ' / ' + marks.length;
            marks[cur].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        function openSearch() {
            searchBox.classList.add('open');
            sInput.focus();
            sInput.select();
        }
        function closeSearch() {
            searchBox.classList.remove('open');
            clearMarks();
            sInput.value = '';
            sCnt.textContent = '0 / 0';
        }
        sInput.addEventListener('input', function () {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(function () { runSearch(sInput.value.trim()); }, 200);
        });
        sInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); jump(e.shiftKey ? -1 : 1); }
            else if (e.key === 'Escape') { closeSearch(); }
        });
        document.getElementById('dl-search-prev').addEventListener('click', function () { jump(-1); });
        document.getElementById('dl-search-next').addEventListener('click', function () { jump(1); });
        document.getElementById('dl-search-close').addEventListener('click', closeSearch);
        document.getElementById('dl-tool-search').addEventListener('click', function () {
            if (searchBox.classList.contains('open')) closeSearch();
            else openSearch();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                var ae = document.activeElement;
                if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA')) return;
                e.preventDefault();
                openSearch();
            } else if (e.key === 'Escape' && searchBox.classList.contains('open')) {
                closeSearch();
            }
        });
    });
})();
