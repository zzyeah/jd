(function () {// 轮播图插件
    /**
     * 需求分析
     *      1. 轮播图的位置不同
     *          （可想到的方案有：1.将位置传入插件中 2.同jq选择器选中这个位置）
     *      2. 轮播图的内容不同（传递的内容应该是一个结构div/dom的列表） [] ——> 数组结构   content
     *      3. 大小不同 width height
     *      4. 动画方式不同     type: fade | animate
     *      5. 是否自动轮播
     *      6. 是否有小圆点
     *      7. 左右按钮显示的形态（一直显示always， 鼠标移入显示hover， 一直不显示hide）
     *      8. 切换的时间间隔
     */

    // $.extend({add: function(a,b) {return a + b}})  工具类方法  直接拿过来就可以用的 $.add(1,2)
    // $.fn.extend({add: function(a,b) {return a + b}})   实例方法  $(selector).add(3,2);
    // prototype 原型上的方法是谁来用的  实例用的

    /**
     * @param {Object} options
     *          content: $('.item'),轮播图的内容
                width: 500, 轮播内容的宽度
                height: 400, 轮播内容的高度
                type: 'fade', 动画方式
                isAuto: true,  是否自动轮播
                showSpots: true,是否有小圆点
                showChangeBtn: 'always',  左右按钮显示的形态
                autoChangeTime: 3000切换的时间间隔
                spotsPosition: 小圆点的位置
       @param {selector} wrap 插入轮播图的区域
     */

    // 初始化
    function Swiper(options, wrap) {
        this.content = options.content || [];
        // 当前轮播图片的个数
        this.len = this.content.length;
        this.width = options.width || wrap.width();
        this.height = options.height || wrap.height();
        this.type = options.type || 'fade';
        this.isAuto = options.isAuto === undefined ? true : options.isAuto;
        this.showSpots = options.showSpots === undefined ? true : options.showSpots;
        this.showChangeBtn = options.showChangeBtn || 'always';
        this.autoChangeTime = options.autoChangeTime || 5000;
        this.wrap = wrap;
        this.spotsPosition = options.spotsPosition || 'left';
        // 当前要显示的图片的索引值
        this.currentIndex = 0;
        // 判断当前动画是否完成
        this.lock = true;
    }

    // 创建轮播图结构
    Swiper.prototype.createDom = function () {
        var swiperWrapper = $('<div class="my-swiper"></div>');
        var swiperContent = $('<ul class="my-swiper-content"></ul>');
        var leftBtn = $('<div class="my-swiper-btn my-swiper-lbtn">&#xe628;</div>');
        var rightBtn = $(
            '<div class="my-swiper-btn my-swiper-rbtn">&#xe625;</div>'
        );
        var spotsWrapper = $('<div class="my-swiper-spots"></div>');
        for (var i = 0; i < this.len; i++) {
            $("<li></li>").html(this.content[i]).appendTo(swiperContent);
            $('<span class="my-swiper-spot"></span>').appendTo(spotsWrapper);
        }
        if (this.type === "animate") {
            $("<li></li>")
                .html($(this.content[0]).clone(true))
                .appendTo(swiperContent);
        }
        spotsWrapper.css({
            textAlign: this.spotsPosition,
        });
        $(swiperWrapper)
            .append(swiperContent)
            .append(leftBtn)
            .append(rightBtn)
            .append(spotsWrapper)
            .appendTo(this.wrap)
            .addClass("my-swiper-" + this.type);
    };





    // 动态设置样式
    Swiper.prototype.initStyle = function () {
        $(this.wrap).find(".my-swiper").css({
            width: this.width,
            height: this.height,
        });
        // 从左到右的轮播需要站在一排
        if (this.type === "animate") {
            $(this.wrap)
                .find(".my-swiper .my-swiper-content")
                .css({
                    width: (this.len + 1) * this.width,
                    left: 0,
                });
        } else {
            // 淡入淡出效果
            // 找到当前轮播图的内容 将其全部隐藏并将当前展示的区域显示出来
            $(this.wrap)
                .find(".my-swiper-content li")
                .hide()
                .eq(this.currentIndex)
                .show();
        }
        // 给小圆点添加默认选中
        $(this.wrap)
            .find(".my-swiper-spots .my-swiper-spot")
            .eq(this.currentIndex)
            .addClass("spot-active");
        // 为不同状态的左右按钮添加样式
        if (this.showChangeBtn === "always") {
            $(this.wrap).find(".my-swiper-btn").show();
        } else if (this.showChangeBtn === "hide") {
            $(this.wrap).find(".my-swiper-btn").hide();
        } else {
            $(this.wrap).find(".my-swiper-btn").hide();
            //   如果显示状态是hover  则移入的时候展示
            $(this.wrap).hover(
                function () {
                    $(this).find(".my-swiper-btn").fadeIn();
                },
                function () {
                    $(this).find(".my-swiper-btn").fadeOut();
                }
            );
        }
        // 小圆点是否显示
        if (!this.showSpots) {
            $(this.wrap).find(".my-swiper-spots").hide();
        }
    };




    // 轮播图区域的行为绑定
    Swiper.prototype.bindEvent = function () {
        // 保存当前的实例对象
        var _ = this;
        $(this.wrap).find('.my-swiper-lbtn').click(function () {
            // 如果当前动画没有完成  那么不进行下面的动画效果
            if (!_.lock) {
                return false;
            }
            _.lock = false;
            if (_.currentIndex === 0) {
                if (_.type === "animate") {
                    $(_.wrap)
                        .find(".my-swiper .my-swiper-content")
                        .css({
                            left: -_.len * _.width,
                        });
                }
                _.currentIndex = _.len - 1;
            } else {
                _.currentIndex--;
            }
            _.change();
        }).end()
            .find('.my-swiper-rbtn')
            .click(function () {
                if (!_.lock) {
                    return false;
                }
                _.lock = false;
                // 淡入淡出效果的轮播 判断当前图片是不是最后一张图片如果是的话那么下一次轮播的图片索引值将为0
                if (_.type === 'fade' && _.currentIndex == _.len - 1) {
                    _.currentIndex = 0;
                } else if (_.type === 'animate' && _.currentIndex == _.len) {
                    // 从左到右的轮播， 判断当前图片是不是后面的第一张图片
                    // 如果是的话 那么让当前的轮播图瞬间变化到前面的轮播图的位置 继续轮播
                    $(_.wrap).find(".my-swiper .my-swiper-content").css({
                        left: 0
                    });
                    // 接下来要轮播图片的索引值
                    _.currentIndex = 1;
                } else {
                    _.currentIndex++;
                }
                _.change();
            }).end()
            .find(".my-swiper-spots span")
            .mouseenter(function () {
                _.currentIndex = $(this).index();
                _.change();
            })
            // 回退到上一级this.wrap对象
            .end()
            // 当鼠标移入到轮播图区域的时候清除自动轮播
            .mouseenter(function () {
                clearInterval(_.timer);
            })
            // 鼠标移出轮播图区域的时候判断是否自动轮播
            .mouseleave(function () {
                if (_.isAuto) {
                    _.autoChange();
                }
            });



    }



    // 切换效果功能
    Swiper.prototype.change = function () {
        var _ = this;
        if (this.type === 'fade') {
            // 淡入淡出效果动画
            $(this.wrap).find('.my-swiper-content li').fadeOut().eq(this.currentIndex).fadeIn(function () {
                _.lock = true
            });
        } else {
            // 从左到右轮播效果动画
            $(this.wrap).find('.my-swiper-content').animate({
                left: -this.currentIndex * this.width
            }, function () {
                // 当前动画已经完成
                _.lock = true;
            })
        }
        // 小圆点的切换
        $(this.wrap).find(".my-swiper-spots .my-swiper-spot").removeClass('spot-active').eq(this.currentIndex % this.len).addClass("spot-active");
    }



    // 初始化方法
    Swiper.prototype.init = function () {
        this.createDom();
        this.initStyle();
        this.bindEvent();
        if (this.isAuto) {
            this.autoChange();
        }
    }


    // 自动轮播效果
    Swiper.prototype.autoChange = function () {
        var _ = this;
        this.timer = setInterval(function () {
            $(_.wrap).find('.my-swiper-rbtn').trigger('click');
        }, this.autoChangeTime);
    }



    $.fn.extend({
        swiper: function (options) {
            var obj = new Swiper(options, this);
            obj.init();
        }
    })
})();