/* 课程章节开放进度配置（两档：open=已开放 / locked=未开课）
 * 切换方式：修改对应章节的值后重新发布，约 1~2 分钟全网生效。
 * 章节正文/幻灯片页内含 DL-LOCK 遮罩块，读本文件决定是否盖住内容。 */
window.DL_PROGRESS = {
    'intro': 'open',    /* 01 深度学习概述 */
    'dl-basics': 'locked',    /* 02 深度学习基础 */
    'dnn': 'locked',    /* 03 深度神经网络 */
    'cnn': 'locked',    /* 04 卷积神经网络 */
    'rnn': 'locked',    /* 05 循环神经网络 */
    'attention': 'locked'    /* 06 注意力机制与Transformer */
};
