'use strict';

/**
 * datapicker plugin
 * constructor prototype design module
 */

var datePicker = function datePicker(container) {
    this.container = container;
    this.date = new Date();
    this.mianEle = null;
    this.sleectedEle = null;

    this.init();
};

datePicker.prototype = {
    constructor: datePicker,
    days: ['日', '一', '二', '三', '四', '五', '六'],

    init: function init() {
        this.mianEle = document.createElement('div');
        this.mianEle.className = 'mianDiv';

        var p = document.createElement('p');
        p.className = 'pStyle';

        var title = document.createElement('strong');
        title.className = 'title';

        p.appendChild(title);

        var arrLeft = document.createElement('strong');
        arrLeft.innerHTML = '<-';
        arrLeft.className = 'arrLeft';

        p.appendChild(arrLeft);

        var arrRight = document.createElement('strong');
        arrRight.innerHTML = '->';
        arrRight.className = 'arrRight';

        p.appendChild(arrRight);
        this.mianEle.appendChild(p);

        for (var i = 0; i < 7; i++) {
            var el = this.createEle();
            el.innerHTML = this.days[i];
            if (i === 0 || i === 6) {
                el.className += ' fontColor';
            }
            this.mianEle.appendChild(el);
        }

        for (var _i = 0; _i < 42; _i++) {
            var _el = this.createEle();
            _el.className += ' spanCursor';
            this.mianEle.appendChild(_el);
        }

        this.mianEle.style.display = 'none';

        console.log(this.container);

        var parentNode = this.container.parentNode;
        parentNode.insertBefore(this.mianEle, this.container.nextElementSibling);

        var self = this;

        EventUtil.addHandler(this.mianEle, 'click', function (event) {
            event = EventUtil.getEvent(event);
            var target = EventUtil.getTarget(event);
            if (target.tagName.toLowerCase() === 'span') {
                var index = self.getIndex(target, self.mianEle);
                //如果点击星期就不跳转
                if (index >= 1 && index <= 7) {
                    return;
                }
                var selectedIndex = self.getIndex(self.selectedEle, self.mianEle);
                var date = new Date(self.date);
                date.setDate(date.getDate() + index - selectedIndex);
                self.selectDate(date);
            }
        });

        EventUtil.addHandler(this.container, 'click', function (event) {
            event = EventUtil.getEvent(event);
            var target = EventUtil.getTarget(event);
            if (target == self.container) {
                self.mianEle.style.display = 'block';
            }
        });

        EventUtil.addHandler(this.mianEle.getElementsByTagName('p')[0], 'click', function (event) {
            event = EventUtil.getEvent(event);
            var target = EventUtil.getTarget(event);
            if (target && target.className.indexOf('arrLeft') > -1) {
                self.preMonth();
            } else if (target && target.className.indexOf('arrRight' > -1)) {
                self.nextMonth();
            } else {}
        });

        this.renderByDate(this.date);
    },
    createEle: function createEle() {
        var ele = document.createElement('span');
        ele.className = 'element';
        return ele;
    },
    renderByDate: function renderByDate(date) {
        $('.title').innerHTML = date.getFullYear() + '年' + (date.getMonth() + 1) + '月';
        var dat = new Date(date);
        //获取当月的第一天
        dat.setDate(dat.getDate() - date.getDate() + 1);
        //获取这个月份的日历显示的第一天
        dat.setDate(dat.getDate() - dat.getDay());

        var allSpan = this.mianEle.getElementsByTagName('span');
        for (var i = 0; i < 42; i++) {
            // 获取显示日子的jq对象
            var ele = allSpan[i + 7];
            ele.innerHTML = dat.getDate();

            // 不是同月的色彩变淡
            if (dat.getMonth() !== date.getMonth()) {
                ele.style.color = '#787878';
            } else {
                // 周六日字变红
                if (dat.getDay() === 0 || dat.getDay() === 6) {
                    ele.style.color = '#337DBE';
                } else {
                    ele.style.color = '';
                }
            }

            // 被选中的日期背景变红
            if (dat.getTime() === date.getTime()) {
                ele.style.backgroundColor = '#337DBE';
                ele.style.color = 'white';
                this.selectedEle = ele;
            }

            dat.setDate(dat.getDate() + 1);
        }
    },
    nextMonth: function nextMonth() {
        var dat = new Date(this.date);
        dat.setMonth(dat.getMonth() + 1);
        this.selectDate(dat);
    },

    preMonth: function preMonth() {
        var dat = new Date(this.date);
        dat.setMonth(dat.getMonth() - 1);
        this.selectDate(dat);
    },

    getSelectedDate: function getSelectedDate() {
        var y = this.date.getFullYear(),
            m = this.date.getMonth() + 1,
            d = this.date.getDate();
        return y + '年' + (m < 10 ? '0' + m : m) + '月' + (d < 10 ? '0' + d : d) + '日';
    },
    selectDate: function selectDate(date) {
        this.selectedEle.style.backgroundColor = '';
        this.selectedEle.style.color = '';
        var allSpan = this.mianEle.getElementsByTagName('span');
        if (date.getMonth() === this.date.getMonth()) {
            var oIndex = this.getIndex(this.selectedEle, this.mianEle);
            var temp = allSpan[oIndex + date.getDate() - this.date.getDate() - 1];
            temp.style.backgroundColor = '#337DBE';
            temp.style.color = 'white';
            this.selectedEle = temp;
        } else {
            this.renderByDate(date);
        }
        this.date = date;
        this.mianEle.style.display = 'none';
        this.setInput();
    },
    getIndex: function getIndex(node, parent) {
        parent = parent || document;
        var index = 0;
        while (node.parentNode == parent && node.tagName.toLowerCase() === 'span') {
            index++;
            node = node.previousElementSibling;
        }
        return index;
    },
    setInput: function setInput() {
        var year = this.date.getFullYear();
        var month = this.date.getMonth() + 1 < 10 ? '0' + (this.date.getMonth() + 1) : this.date.getMonth() + 1;
        var day = this.date.getDate() < 10 ? '0' + this.date.getDate() : this.date.getDate();
        var result = '' + year + '/' + month + '/' + day;
        console.log(result);
        this.container.value = result;
    }
};