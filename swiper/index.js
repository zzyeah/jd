// 轮播图插件
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
    this.currentIndex = 0;
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
            .find(".my-swiper-content  li")
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

$.fn.extend({
    swiper: function (options) {
        var obj = new Swiper(options, this);
        obj.createDom();
        obj.initStyle()
    }
})