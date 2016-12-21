var blue = function () { };

blue.prototype = {
    extend: function (target, source) {
        if (typeof target === 'object' && typeof source === 'object') {
            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    target[key] = source[key];
                }
            }
        } else {
            throw new Error('not object');
        }
    }
};

blue = new blue();

// 模块化封装

// 基本操作
blue.extend(blue, {
    // 判断是否是字符串类型
    isString: function (str) {
        // return typeof str === 'string'?true:str instanceof String;
        return typeof str === 'string' || str instanceof String;
    },
    // 判断是否是数字类型
    isNumber: function (num) {
        // return typeof num === 'number' ? true : num instanceof Number;
        return typeof num === 'number' || num instanceof Number;

    },
    // 判断是否是数组类型
    isArray: function (arr) {
        return arr instanceof Array;
        //    if(arr===null || typeof arr === 'undefined'){
        //        return false;
        //    }
        //    return arr.constructor === 'Array';
    },
    // 判断是否是Boolean类型
    isBoolean: function (b) {
        // return typeof b === 'boolean' ? true : b instanceof Boolean;
        return typeof b === 'boolean' || b instanceof Boolean;
    },
    isNaN(arg) { return isNaN(arg); },
    isFinite(arg) { return isFinite(arg); },
    isNull(arg) { return arg === null; },
    isObj(arg) { return arg === 'object'; },
    isUndefined(arg) { return typeof arg === 'undefined'; },
    //  随机数
    random(begin, end) { return Math.floor(Math.random() * (end - begin)) + begin; },
    // 简单格式化字符串
    formatString(str, data) {
        str.replace(/\((\w+)\)/g, function (match, key) {
            return typeof data[key] === 'undefined' ? '' : data[key];
        });
    }

});

// 字符串操作
blue.extend(blue, {
    // 剔除左右空字符
    rtrim: function (str) {
        return blue.isString(str) ? str.replace(/\s*$/g, '') : str;
    },
    ltrim: function (str) {
        return blue.isString(str) ? str.replace(/^\s*/g, '') : str;
    },
    trim(str) {
        return blue.isString(str) ? str.replace(/(^\s*)|(\s*$)/g, '') : str;
    }
});

// 事件封装

blue.extend(blue, {
    // 绑定事件
    on(id, type, func) {
        var dom = blue.isString(id) ? document.getElementById(id) : id;
        if (dom.addEventListener) {
            dom.addEventListener(type, func);
        } else if (dom.attachEvent) {  //  兼容 ie早期版本
            dom.attachEvent('on' + type, func);
        }
    },
    //解除事件
    un(id, type, func) {
        var dom = blue.isString(id) ? document.getElementById(id) : id;
        if (dom.removeEventListener) {
            dom.removeEventListener(type, func);
        } else if (dom.detachEvent) {
            dom.detachEvent(type, func);
        }
    },
    // 点击事件
    click(id, func) {
        blue.on(id, 'click', func);
    },
    // 解除点击事件
    unclick(id, func) {
        blue.un(id, 'click', func);
    },
    mouseover(id, func) {
        blue.on(id, 'mouseover', func);
    },
    mouseout(id, func) {
        blue.on(id, 'mouseout', func);
    },
    mouseenter(id, func) {
        blue.on(id, 'mouseenter', func);
    },

    hover(id, fnOver, fnOut) {
        if (fnOver) {
            blue.on(id, 'mouseover', fnOver);
        }
        if (fnOut) {
            blue.on(id, 'mouseout', fnOut);
        }
    },
    //  事件基础
    getEvent(event) {
        return event ? event : window.event;
    },
    // 获取目标
    getTarget(event) {
        var e = blue.getEvent(event);
        return e.target || e.srcElement;
    },
    // 阻止默认行为
    preventDefault(event) {
        var event = blue.getEvent(event);
        if (event.preventDefault) {
            event.preventDefault();
        } else {   //  兼容ie早期版本
            event.returnValue = false;
        }
    },
    // 阻止冒泡
    stopPropagation(event) {
        var event = blue.getEvent(event);
        event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
    },
    //事件委托
    delegate: function (pid, eventType, selector, fn) {
        //参数处理
        var parent = blue.id(pid);
        function handle(e) {
            var target = blue.getTarget(e);
            if (target.nodeName.toLowerCase() === selector || target.id === selector.substr(1) || target.className.split(' ').indexOf(selector) != -1) {
                // 在事件冒泡的时候，回以此遍历每个子孙后代，如果找到对应的元素，则执行如下函数
                // 为什么使用call，因为call可以改变this指向
                // 大家还记得，函数中的this默认指向window，而我们希望指向当前dom元素本身
                fn.call(target);
            }
        }
        //当我们给父亲元素绑定一个事件，他的执行顺序：先捕获到目标元素，然后事件再冒泡
        //这里是是给元素对象绑定一个事件
        // parent[eventType] = handle;
        blue.on(parent,eventType,handle);
    }
});

// 选择器封装

blue.extend(blue, {
    id: function (id) {
        return document.getElementById(id);
    },
    tag: function (tag, context) {
        if (blue.isString(context)) {
            context = blue.id(context);
        }
        if (context) {
            return context.getElementsByTagName(tag);
        }
        return document.getElementsByTagName(tag);
    },
    class: function (className) {
        if (document.getElementsByClassName) {
            return document.getElementsByClassName(className);
        }
        //  如果不支持document.getElementsByClassName
        var eles = document.getElementsByTagName('*');
        // 伪数组
        // var cs = { length: 0 };
        var cs = [];
        // var index = 0;
        for (var i = 0; i < eles.length; i++) {
            var names = eles[i].className.split(' ');
            if (names.indexOf(className) != -1) {
                // cs[index++] = eles[i];
                // cs.length = index;
                cs.push(eles[i]);
            }
        }
        return cs;
    },
    // 在id下获得类名为className的元素   限制范围
    classLimit(className, idDom) {
        var dom = idDom ? (blue.isString(idDom) ? document.getElementById(idDom) : idDom) : document;
        if (dom.getElementsByClassName) {
            return dom.getElementsByClassName(className);
        }

        //  如果不支持document.getElementsByClassName
        var eles = dom.getElementsByTagName('*');
        // 伪数组
        // var cs = { length: 0 };
        // var index = 0;
        var cs = [];
        for (var i = 0; i < eles.length; i++) {
            var names = eles[i].className.split(' ');
            if (names.indexOf(className) != -1) {
                // cs[index++] = eles[i];
                // cs.length = index;
                cs.push(eles[i]);
            }
        }
        return cs;
    },
    // 查找多个选择器  '.dt,.dd,div,#id'  分组选择器
    group(selector) {
        var sArr = selector.trim().split(',');
        var ss = [];
        sArr.forEach(function (v, i) {
            v = v.trim();
            if (v[0] === '.') {
                // 类选择器  放入ss中
                pushArray(ss, blue.classLimit(v.slice(1)));
            } else if (v[0] === '#') {
                // id选择器  放入ss中
                ss.push(blue.id(v.slice(1)));
            } else {
                // 标签选择器   放入ss中
                pushArray(ss, blue.tag(v));
            }
        });

        return blue.noRepeat(ss);
        function pushArray(handle, source) {
            for (var i = 0; i < source.length; i++) {
                handle.push(source[i]);
            }
        }
    },
    // 层级选择器  'div .b #c'
    layer(selector) {
        try {
            var sArr = selector.trim().split(' ');
            var list = [];
            var result = [];
            var flag = false;
            sArr.forEach(function (v, i) {
                result = [];
                flag = false;
                if (i !== 0 && !list.length) {
                    return;
                }
                v = v.trim();
                // id选择
                if (v[0] === '#') {
                    if (list.length) {
                        list.forEach(function (value, i) {
                            result.push(value.getElementById(v.slice(1)));
                        });
                    } else {
                        result.push(document.getElementById(v.slice(1)));
                    }
                    // 类选择
                } else if (v[0] === '.') {
                    if (list.length) {
                        list.forEach(function (value, i) {
                            pushArray(result, blue.classLimit(v.slice(1), value));
                        });
                    } else {
                        pushArray(result, blue.classLimit(v.slice(1)));
                    }
                    // 标签选择
                } else if (v) {
                    if (list.length) {
                        list.forEach(function (value, i) {
                            pushArray(result, blue.tag(v, value));
                        });
                    } else {
                        result = blue.tag(v);
                        pushArray(result, blue.tag(v));
                    }
                }
                list = result;
                flag = true;
            });
            // return flag;
            return flag ? result : [];
        } catch (error) {
            console.error(error);
        }
        function pushArray(handle, source) {
            for (var i = 0; i < source.length; i++) {
                handle.push(source[i]);
            }
        }
    },
    // 组+层 选择
    groupLayer(selector) {
        var sArr = selector.trim().split(',');
        var result = [];
        sArr.forEach(function (v, i) {
            v = v.trim();
            pushArray(result, blue.layer(v));
        });

        return blue.noRepeat(result);
        function pushArray(handle, source) {
            for (var i = 0; i < source.length; i++) {
                handle.push(source[i]);
            }
        }
    },
    // 剔除数组中重复元素
    noRepeat(arr) {
        var list = arr.slice();
        var flag = false;
        arr.forEach(function (v, i) {
            flag = false;
            list = list.filter(function (value, i) {
                if (value === v) {
                    if (flag) {
                        return false;
                    } else {
                        flag = true;
                    }
                }
                return true;
            });
        });
        return list;
    },
    all(selector,limit) {
        limit = limit || document;
        return limit.querySelectorAll(selector);
    }
});

// css
blue.extend(blue, {
    css: function (context, key, value) {
        var doms = blue.isString(context) ? blue.all(context) : context;
        doms.length = doms.length || 0;
        if (doms.length) {
            if (value) {
                for (var i = 0; i < doms.length; i++) {
                    setOneStyle(doms[i], key, value);
                }
            } else {
                return getStyle(doms[0], key);
            }
        } else {
            if (value) {
                setOneStyle(doms, key, value);
            } else {
                return getStyle(doms, key);
            }
        }


        function getStyle(dom, key) {
            if (dom.currentStyle) {
                return dom.currentStyle[key];
            } else {
                return window.getComputedStyle(dom, null)[key];
            }
        }
        function setOneStyle(dom, key, value) {
            dom.style[key] = value;
        }
    }
});

// 宽高封装
blue.extend(blue, {

    // 获取屏幕高度
    screenHeight() {
        return window.screen.height;
    },
    // 获取屏幕宽度
    screenWidth() {
        return window.screen.width;
    },
    // 获取文档偏移
    scroll() {
        if (window.pageXOffset != null) {  //ie9+ 其他浏览器
            return {
                left: window.pageXOffset,
                top: window.pageYOffset
            };
        } else if (document.compatMode == 'CSS1Compat') { // 声明了DTD的文件
            // 识别是否是怪异模式下的浏览器 <--> 就是没有声明<!DOCTYPE html>
            return {
                left: document.documentElement.scrollLeft,
                top: document.documentElement.scrollTop
            };
        }
        // 没有声明 DTD html文件 (谷歌浏览器默认不识别 DTD头)
        return {
            left: document.body.scrollLeft,
            top: document.body.scrollTop
        };
    },
    // 获取文档可视高度
    docClientHeight() {
        return document.documentElement.clientHeight || window.innerHeight || (document.body && document.body.clientHeight);
    },
    // 获取文档可视高度
    docClientWidth() {
        return document.documentElement.clientWidth || window.innerWidth || (document.body && document.body.clientWidth);
    },
    // 获取文档高度
    docScrollHeight() {
        return document.body.scrollHeight;
    },
    // 获取文档宽度
    docScrollWidth() {
        return document.body.scrollWidth;
    },


    // 获取元素可视区宽度
    clientWidth(id) {
        return blue.id(id).clientWidth;
    },
    // 获取元素可视区高度
    clientHeight(id) {
        return blue.id(id).clientHeight;
    },
    // 获取元素文档高度
    scrollHeight(id) {
        return blue.id(id).scrollHeight;
    },
    // 获取元素文档宽度
    scrollWidth(id) {
        return blue.id(id).scrollWidth;
    },
    // 获取元素文档的偏移 top
    scrollTop(id) {
        return blue.id(id).scrollTop;
    },
    // 获取元素文档的偏移 top
    scrollLeft(id) {
        return blue.id(id).scrollLeft;
    }

});

// 位置封装
blue.extend(blue, {

    // 相对于祖辈有定位的元素的位置，否则就相对于文档
    position(id) {
        var dom = blue.id(id);
        function left() {
            return dom && dom.offsetLeft;
        }
        function top() {
            return dom && dom.offsetTop;
        }

        return { left: left(), top: top() };
    }

    //  相对于整个文档的偏移
    // ,
    // offset(id){}
});


// 显示 隐藏
blue.extend(blue, {
    show(context) {
        var doms = blue.all(context);
        for (var i = 0; i < doms.length; i++) {
            blue.css(doms[i], 'display', 'block');
        }
    },
    hide(context) {
        var doms = blue.all(context);
        for (var i = 0; i < doms.length; i++) {
            blue.css(doms[i], 'display', 'none');
        }
    },
    toggleHS(context) {
        var doms = blue.all(context);
        for (var i = 0; i < doms.length; i++) {
            if (blue.css(doms[i], 'display') === 'none') {
                blue.css(doms[i], 'display', 'block');
            } else {
                blue.css(doms[i], 'display', 'none');
            }
        }
    }
});

// 属性操作封装
blue.extend(blue, {
    attr(context, key, value) {
        var doms = blue.all(context);
        if (arguments.length === 3) {
            for (var i = 0; i < doms.length; i++) {
                setAttr(doms[i]);
            }
        } else {
            return getAttr(doms[0]);
        }

        function setAttr(dom) {
            dom.setAttribute(key, value); // 设置属性
        }
        function getAttr(dom) {
            return dom.getAttribute(key);  // 获取属性
        }
    },
    addClass(context, name) {
        var doms = blue.all(context);
        for (var i = 0; i < doms.length; i++) {
            doms[i].className += ' ' + name;
        }
    },
    removeClass(context, name) {
        var doms = blue.all(context);
        for (var i = 0; i < doms.length; i++) {
            var reg = new RegExp('\\b' + name + '\\b', 'g');
            doms[i].className = doms[i].className.replace(reg, '');
            doms[i].className = doms[i].className.replace(/(\s)\1+/g, '$1');
        }
    },
    toggleClass(context, name) {
        var doms = blue.all(context);
        for (var i = 0; i < doms.length; i++) {
            var reg = new RegExp('\\b' + name + '\\b', 'g');
            if (reg.test(doms[i].className)) {
                doms[i].className = doms[i].className.replace(reg, '').replace(/(\s)\1+/g, '$1');
            } else {
                doms[i].className += ' ' + name;
            }
        }
    },
    hasClass(context, name) {
        var doms = blue.all(context);
        var reg = new RegExp('\\b' + name + '\\b', 'g');
        return reg.test(doms[0].className);
    },
    getClass(context) {
        return blue.all(context)[0].className;
    }
});

// 内容框架封装
blue.extend(blue, {
    html(context, value) {
        var doms = blue.all(context);
        if (value) {
            for (var i = 0; i < doms.length; i++) {
                doms[i].innerHTML = value;
            }
        } else {
            return doms[0].innerHTML;
        }
    },
    // input value
    value(context, value) {
        var doms = blue.all(context);
        if (value) {
            for (var i = 0; i < doms.length; i++) {
                doms[i].value = value;
            }
        } else {
            return doms[0].value;
        }
    }

});

// ajax 封装  不完整   结束之后，再重新封装  get  post  jsonp  json xml 
blue.extend(blue, {
    ajax: function (URL, fn) {
        var xhr = createXHR();	//返回了一个对象，这个对象IE6兼容。
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                    fn(xhr.responseText);
                } else {
                    alert("错误的文件！");
                }
            }
        };
        xhr.open("get", URL, true);
        xhr.send(null);

        //闭包形式，因为这个函数只服务于ajax函数，所以放在里面
        function createXHR() {
            //本函数来自于《JavaScript高级程序设计 第3版》第21章
            if (typeof XMLHttpRequest != "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject != "undefined") {
                if (typeof arguments.callee.activeXString != "string") {
                    var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0",
                        "MSXML2.XMLHttp"], i, len;

                    for (i = 0, len = versions.length; i < len; i++) {
                        try {
                            new ActiveXObject(versions[i]);
                            arguments.callee.activeXString = versions[i];
                            break;
                        } catch (ex) {
                            //skip
                        }
                    }
                }
                return new ActiveXObject(arguments.callee.activeXString);
            } else {
                throw new Error("No XHR object available.");
            }
        }
    }
});

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
    clear() {
        this.queue.forEach(function (v, i) {
            clearInterval(v.timer);
        });
        this.queue = [];
    }
};

blue.animate = new Animate();

