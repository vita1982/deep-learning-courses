/* 课程章节开放进度配置（两档：open=已开放 / locked=未开课）
 * 切换方式：修改对应章节的值后重新发布，约 1~2 分钟全网生效。
 * 注意：locked 章节的正文页面应同步替换为占位页（见 scripts/set_chapter_lock.py），
 * 仅靠本文件无法阻止直接访问章节 URL。 */
window.DL_PROGRESS = {
    'intro': 'open',    /* 01 深度学习概述 */
    'dl-basics': 'open',    /* 02 深度学习基础 */
    'dnn': 'open',    /* 03 深度神经网络 */
    'cnn': 'open',    /* 04 卷积神经网络 */
    'rnn': 'open',    /* 05 循环神经网络 */
    'attention': 'locked'    /* 06 注意力机制与Transformer */
};
