// 模仿jquery的版本

!function (window, document) {

    // 动画封装
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
                    var start = parseFloat(this._css(obj.dom, key));
                    var distance = parseFloat(source[key]) - start;
                    obj.styles.push({ attr: key, start: start, distance: distance });
                }
            } else {
                obj.func = source;
            }
        },
        _css(dom, key) {
            if (dom.currentStyle) {
                return dom.currentStyle[key];
            } else {
                return window.getComputedStyle(dom, null)[key];
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


    function Blue() {

        this.elements = [];
    }



    Blue.prototype = {
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





    window.blue = function (context) {
        // if (!context) {
        //     this.animate = new Animate();
        //     return this;
        // }
        var b = new Blue();
        // 模块化封装
        // 基础封装
        b.extend(b, {
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
            },

        });

        // 选择器封装
        b.extend(b, {
            alls(context, limit) {
                limit = limit || document;
                if (this.isString(context)) {
                    var ct = limit.querySelectorAll(context);
                    for (var i = 0; i < ct.length; i++) {
                        this.elements.push(ct[i]);
                    }
                } else {
                    this.elements.push(context);
                }
                return this;
            }
        });

        // css封装
        b.extend(b, {
            //全部显示
            show(context) {
                var doms = this.elements;
                for (var i = 0; i < doms.length; i++) {
                    this.css('display', 'block');
                }
                return this;
            },
            // 全部隐藏
            hide(context) {
                console.log('aaa');
                var doms = this.elements;
                for (var i = 0; i < doms.length; i++) {
                    this.css('display', 'none');
                }
                return this;
            },
            // 切换显示 隐藏
            toggleHS() {
                var doms = this.elements;
                for (var i = 0; i < doms.length; i++) {
                    if (this._css(doms[i], 'display') === 'none') {
                        this._css(doms[i], 'display', 'block');
                    } else {
                        this._css(doms[i], 'display', 'none');
                    }
                }
                return this;
            },
            _css: function (dom, key, value) {

                if (value) {
                    setOneStyle(dom, key, value);
                } else {
                    return getStyle(dom, key);
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
            },
            // css 封装
            css: function (key, value) {
                var doms = this.elements;
                if (value) {
                    for (var i = 0; i < doms.length; i++) {
                        setOneStyle(doms[i], key, value);
                    }
                } else {
                    return getStyle(doms[0], key);
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
                return this;
            }
        });
        // 事件封装
        b.extend(b, {

            // 绑定事件
            on(type, func) {
                var doms = this.elements;
                for (var i = 0; i < doms.length; i++) {
                    if (doms[i].addEventListener) {
                        doms[i].addEventListener(type, func);
                    } else if (doms[i].attachEvent) {  //  兼容 ie早期版本
                        doms[i].attachEvent('on' + type, func);
                    }
                }
                return this;
            },
            //解除事件
            un(type, func) {
                var doms = this.elements;
                for (var i = 0; i < doms.length; i++) {
                    if (doms[i].removeEventListener) {
                        doms[i].removeEventListener(type, func);
                    } else if (doms[i].detachEvent) {  //  兼容 ie早期版本
                        dom[i].detachEvent(type, func);
                    }
                }
                return this;
            },
            // 点击事件
            click(func) {
                this.on('click', func);
                return this;
            },
            // 解除点击事件
            unclick(func) {
                this.un('click', func);
                return this;
            },
            mouseover(func) {
                this.on('mouseover', func);
                return this;
            },
            mouseout(func) {
                this.on('mouseout', func);
                return this;
            },
            mouseenter(func) {
                this.on('mouseenter', func);
                return this;
            },
            hover(fnOver, fnOut) {
                if (fnOver) {
                    this.on('mouseover', fnOver);
                }
                if (fnOut) {
                    this.on('mouseout', fnOut);
                }
                return this;
            },
            //  事件基础
            getEvent(event) {
                return event ? event : window.event;
            },
            // 获取目标
            getTarget(event) {
                var e = this.getEvent(event);
                return e.target || e.srcElement;
            },
            // 阻止默认行为
            preventDefault(event) {
                var event = this.getEvent(event);
                if (event.preventDefault) {
                    event.preventDefault();
                } else {   //  兼容ie早期版本
                    event.returnValue = false;
                }
                return this;
            },
            // 阻止冒泡
            stopPropagation(event) {
                var event = this.getEvent(event);
                event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
                return this;
            },
            //事件委托
            delegate: function (eventType, selector, fn) {
                //参数处理
                var that = this;
                function handle(e) {
                    var target = that.getTarget(e);
                    // 在事件冒泡的时候，回以此遍历每个子孙后代，如果找到对应的元素，则执行如下函数
                    // 为什么使用call，因为call可以改变this指向
                    // 大家还记得，函数中的this默认指向window，而我们希望指向当前dom元素本身

                    if (target.nodeName.toLowerCase() === selector || target.id === selector.substr(1) || target.className.split(' ').indexOf(selector) != -1) {
                        fn.call(target);
                    }
                }
                //当我们给父亲元素绑定一个事件，他的执行顺序：先捕获到目标元素，然后事件再冒泡
                //这里是是给元素对象绑定一个事件

                this.on(eventType, handle);
                return this;
            }
        });

        b.extend(b, {
            attr(key, value) {
                var doms = this.elements;
                if (arguments.length === 2) {
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
                return this;
            },
            addClass(name) {
                var doms = this.elements;
                for (var i = 0; i < doms.length; i++) {
                    if (doms[i].className.split(' ').indexOf(name) === -1) {
                        doms[i].className += ' ' + name;
                    }
                }
                return this;
            },
            removeClass(name) {
                var doms = this.elements;
                for (var i = 0; i < doms.length; i++) {
                    var reg = new RegExp('\\b' + name + '\\b', 'g');
                    doms[i].className = doms[i].className.replace(reg, '');
                    doms[i].className = doms[i].className.replace(/(\s)\1+/g, '$1');
                }
                return this;
            },
            toggleClass(name) {
                var doms = this.elements;
                for (var i = 0; i < doms.length; i++) {
                    var reg = new RegExp('\\b' + name + '\\b', 'g');
                    if (reg.test(doms[i].className)) {
                        doms[i].className = doms[i].className.replace(reg, '').replace(/(\s)\1+/g, '$1');
                    } else {
                        doms[i].className += ' ' + name;
                    }
                }
                return this;
            }
        });

        b.extend(b, {
            html(value) {
                var doms = this.elements;
                if (value) {
                    for (var i = 0; i < doms.length; i++) {
                        doms[i].innerHTML = value;
                    }
                    return this;
                } else {
                    return doms[0].innerHTML;
                }
            },
            // input value
            value(value) {
                var doms = this.elements;
                if (value) {
                    for (var i = 0; i < doms.length; i++) {
                        doms[i].value = value;
                    }
                    return this;
                } else {
                    return doms[0].value;
                }
            }
        });
        // 运动封装
        b.extend(b, {
            // 运动
            animate(dict, duration, callback) {
                var doms = this.elements;
                var animate = new Animate();
                for (var i = 0; i < doms.length; i++) {
                    animate.add(doms[i], dict, duration, callback);
                }
                return this;
            }
        });

        b.alls(context);
        return b;
    };

    //ajax 封装  // ajax 封装  不完整     get  post  jsonp  json xml 
    b.extend(b, {
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

    // 运动 可以 blue.animate.add()使用
    window.blue.animate = new Animate();

    // 获取屏幕高度
    window.blue.screenHeight = function () {
        return window.screen.height;
    };
    // 获取屏幕宽度
    window.blue.screenWidth = function () {
        return window.screen.width;
    };
    // 获取文档偏移
    window.blue.scroll = function () {
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
    };
    // 获取文档可视高度
    window.blue.docClientHeight = function () {
        return document.documentElement.clientHeight || window.innerHeight || (document.body && document.body.clientHeight);
    };
    // 获取文档可视高度
    window.blue.docClientWidth = function () {
        return document.documentElement.clientWidth || window.innerWidth || (document.body && document.body.clientWidth);
    };
    // 获取文档高度
    window.blue.docScrollHeight = function () {
        return document.body.scrollHeight;
    };
    // 获取文档宽度
    window.blue.docScrollWidth = function () {
        return document.body.scrollWidth;
    };


    // 获取元素可视区宽度
    window.blue.clientWidth = function (id) {
        return document.getElementById(id).clientWidth;
    };
    // 获取元素可视区高度
    window.blue.clientHeight = function (id) {
        return document.getElementById(id).clientHeight;
    };
    // 获取元素文档高度
    window.blue.scrollHeight = function (id) {
        return document.getElementById(id).scrollHeight;
    };
    // 获取元素文档宽度
    window.blue.scrollWidth = function (id) {
        return document.getElementById(id).scrollWidth;
    };
    // 获取元素文档的偏移 top
    window.blue.scrollTop = function (id) {
        return document.getElementById(id).scrollTop;
    };
    // 获取元素文档的偏移 top
    window.blue.scrollLeft = function (id) {
        return document.getElementById(id).scrollLeft;
    }

    // 位置封装
    // 相对于祖辈有定位的元素的位置，否则就相对于文档
    window.blue.position = function (id) {
        var dom = document.getElementById(id);
        function left() {
            return dom && dom.offsetLeft;
        }
        function top() {
            return dom && dom.offsetTop;
        }

        return { left: left(), top: top() };
    }

    //  相对于整个文档的偏移
    // 
    // window.blue.offset(id){
    // ...
    // }

} (window, document);

