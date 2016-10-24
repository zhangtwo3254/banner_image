/**
 * 图片轮换效果
 *
 * 用法：$('selector').slider({配置});
 */
(function($) {
    // 索引
    var index = 0;

    // window.setInterval
    var sIn;

    // 默认动画效果
    var animate = {
        init: function(self, controlObj, settings) {
            // 初始化
            index = Math.max(settings.start - 1, 0);
            setSelectedStyle(controlObj);
            self.find('li').width(settings.width);
            self.find('li').height(settings.height);
            if (settings.direction == 'left') {
                // left
                self.find('li').css('float', 'left');
                self.width(settings.width * settings.count);
                self.css('left', -index * settings.width);
            } else if (settings.direction == 'up') {
                self.css('top', -index * settings.height); 
            }
        },
        doLeft: function(self, settings) {
            // left
            self.stop().animate({'left': -index * settings.width}, settings.animTime);
        },
        doUp: function(self, settings) {
            // up 
            self.stop().animate({'top': -index * settings.height}, settings.animTime);
        },
        doAuto: function(self, controlObj, settings) {
            // auto
            sIn = window.setInterval(function() {
                 index = (index + 1) >= settings.count ? 0 : (index + 1);
                 setSelectedStyle(controlObj, index);
                 if (settings.direction == 'left') {
                     animate.doLeft(self, settings);
                 } else if (settings.direction == 'up') {
                     animate.doUp(self, settings);
                 }
             }, settings.autoTime);  
        }
    };

    /**
     * 设置当前项样式
     *
     * @param controlObj
     */
    function setSelectedStyle(controlObj) {
        var lis = controlObj.find('li');
        lis.removeClass('selected');
        lis.eq(index).addClass('selected');
    }

    $.fn.slider = function(options) {
        
        // 默认配置
        var defaults = {
            width: 300,                     // 默认宽
            height: 300,                    // 默认高
            direction: 'left',              // 默认方向(left, up)
            control: 'sliderControl',       // 控制元素id
            start: 0,                       // 默认起始项
            animTime: 600,                  // 动画执行时间
            auto: true,                     // 是否自动播放
            autoTime: 5000                  // 自动播放时间
        };

        var settings = $.extend(defaults, options);

        var self = this;
		
		// window.resize
		$(window).resize(function() {
			self.slider(settings);
		});
        
        // 设置父元素样式
        var parent = self.parent();
        parent.width(settings.width);
        parent.height(settings.height);

        // 添加控制元素
        var controlObj = $('#' + settings.control);
        settings.count = self.find('li').length;        // li的数量
        var ctls = '';
        for (var i = 1; i <= settings.count; i++) {
            ctls += '<li>' + i + '</li>';
        }
        controlObj.append(ctls);

        // 初始化动画
        animate.init(self, controlObj, settings);

        // mouseover 
        controlObj.find('li').mouseover(function() {
            if (typeof (sIn) != 'undefined') {
                window.clearInterval(sIn);
            }
            index = controlObj.find(this).index();
            setSelectedStyle(controlObj);
            if (settings.direction == 'left') {
                animate.doLeft(self, settings);
            } else if (settings.direction == 'up') {
                animate.doUp(self, settings);
            }
        });

        // mouseout
        controlObj.find('li').mouseout(function() {
            if (settings.auto == true) {
                animate.doAuto(self, controlObj, settings);
            }
        });

        // auto
        if (settings.auto == true) {
            animate.doAuto(self, controlObj, settings);
        }
    } 
}) (jQuery);
