// 运动框架 模块化
function Animate() {
    this.interval = 25;
    this.queue = [];
}

Animate.prototype = {
    // 接入部
    // 框架入口
    add: function (id, dict, duration, callback) {

        var obj = {
            timer: null,
            duration: 0,
            origin: +new Date(),
            styles: [],
            callback: callback,
            dom: typeof id === 'string' ? document.getElementById(id) : id,
            flag: true,
            duration: duration || 1000,  // 默认运动时间是 1s       
            func: null
        };

        this.queue.push(obj);
        this._adapter(dict, obj);
        this._run(obj);
    },

    // 转换部
    // 适配器  转换
    _adapter(source, obj) {
        this.checkDict(source, obj);
        if (obj.flag) {
            for (var key in source) {
                var start = parseFloat(blue.css(obj.dom, key));
                var distance = parseFloat(source[key]) - start;
                obj.styles.push({ attr: key, start: start, distance: distance });
            }
        } else {
            obj.func = source;
        }
    },
    // 检查部
    checkDict(dict, obj) {
        obj.flag = typeof dict === 'function' ? false : true;
    },
    // 执行部
    // 执行运动
    _run(obj) {
        var that = this;
        obj.timer = setInterval(function () { that._move(obj) }, this.interval);
    },
    // 运行部
    // 运动过程
    _move(obj) {
        var that = this;
        var now = +new Date();
        var tween = that._getTween(obj.origin, now) / obj.duration;
        if (tween >= 1) {
            that._stopAnimate(obj);
        }
        if (obj.flag) {
            that._manyProperty(obj.dom, obj.styles, tween);
        } else {
            obj.func(obj.dom, tween);
        }
    },
    // 停止运动
    _stopAnimate(obj) {
        obj.callback && obj.callback();
        clearInterval(obj.timer);
        this._destroy(obj.timer);
    },
    // 获取已执行的时间
    _getTween(origin, now) {
        var pass = now - origin;
        return pass;
    },
    // 使多个属性运动
    _manyProperty(dom, styles, tween) {
        for (var i = 0; i < styles.length; i++) {
            var item = styles[i];
            this._oneProperty(dom, item.attr, item.start, item.distance, tween);
        }
    },
    // 使一个属性运动
    _oneProperty(dom, key, start, distance, tween) {
        if (key === 'opacity') {
            dom.style[key] = tween * distance + start;
            return;
        }
        dom.style[key] = tween * distance + start + 'px';
    },
    // 后勤部
    // 内存回收，优化
    _destroy(timer) {
        this.queue = this.queue.filter(function (v, i) {
            return v.timer !== timer;
        });
    },
    // 清除动画
    clear(){
        this.queue.forEach(function(v,i){
            clearInterval(v.timer);
        });
        this.queue = [];
    }
};