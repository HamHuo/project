define(function (require, exports, module) {
    require('./bindphone_v2.js');
    var index = {
        init: function () {
                var _ts = this;

                //插入一个隐藏的div, 为了定位绑定手机弹层。。。。
                $('#award-bd').find('.bd-cont-2 .cont').append('<div id="s-ticket" style="position: absolute; top:400px; left:455px;  height: 10px; width: 10px;"></div>');

                _ts.lottery1.init();
                _ts.lottery2.init();
                _ts.news();
                _ts.myLottery();
                _ts.other();
                //如何获得抽奖券
                $(".my_reward .help").click(function () {
                    $("html,body").animate({scrollTop: $(".bd-cont-3").offset().top},500);
                    return false;
                });
                $(".help_wait").click(function () {
                    $("html,body").animate({scrollTop: $(".bd-cont-3").offset().top},500);
                    return false;
                });
                //头部登录回调
                window.headLoginSuccessCallback=window.headLoginSuccessCallback || {};
                if(typeof headLoginSuccessCallback.callbackFun !== 'object'){
                    headLoginSuccessCallback.callbackFun = {};
                }
                headLoginSuccessCallback.callbackFun.fun1 = function(ret){
                   if(ret.code===0){
                        _ts.myLottery({ts:_ts});
                   }
                };
            },
            config: {
                "lock": true,//true 表示可以请求
                "timer": null,
                "time": 800,
                "drawNum": 5 //圈数
            },
            //清凉一夏
            lottery1: {
                config: {
                    "lock": true,//true 表示可以请求
                    "timer": null,
                    "time": 800,
                    "drawNum": 5 //圈数
                },
                init: function () {
                        var _ts = this,
                            _c = index.config,
                            $el = $('#lottery');
                        _ts.$el = $el;
                        $('.lottery_btn_left').click(function () {
                            g.checkloginNew(_ts.raffle, _ts);
                            // _ts.raffle();
                        });
                    },
                    //进行抽奖
                    raffle: function (_this) {
                        var _ts = index.lottery1,
                            _c = index.config,
                            $el = _ts.$el,
                            _bid = cookies.get('b') || "",
                            // _bid=1,
                            _url = 'http://star.aipai.com/2017/lottery/action?type=1&' + _bid;
                        if (!_c.lock) {
                            return false;
                        }
                        _c.lock = false; //关闭
                        //_data={num:0,type:4,prize:'1',lottery:0,allPrize:{prize:['111','222']}};
                        //_ts.doAnimate(_data);
                        //return;
                        $.ajax({
                            type: 'GET',
                            url: _url,
                            data: '',
                            dataType: 'jsonp',
                            timeout: 10000,
                            jsonpCallback: 'cbFunction',
                            success: function (ret) {
                                    var _data = {},
                                        retData = {},
                                        ty = '',
                                        picUrl = '';
                                    if (ret.code === 0) { //抽中奖
                                        _data = ret.data;
                                        index.myLottery();
                                        _ts.doAnimate(_data);
                                    } else if (ret.code === -1) { //用户没登录
                                        $(this).pop_alert({
                                            msg: ret.msg,
                                        });
                                        _c.lock = true;
                                    } else if (ret.code === -2) { //没有足够的抽奖券
                                        $(this).pop_dialog({
                                            id: 'pop_overlay_3',
                                            type: 'content',
                                            width: 590,
                                            height: 452,
                                            position: 'center',
                                            content: '<div class="modal_2">' + '<div class="modal_box">' + '<a href="javascript:; " class="close pop_close"></a>' + '<div class="tip_wait">' + '<p>' + ret.msg + '</p>' + '</div>' + '<div class="footer">' + '<div class="btn_box">' + '<a href="javascript:;" class="back_wait">返回分会场</a>' + '<a href="javascript:;" class="help_wait">如何获券</a> ' + '</div>' + '</div>' + '</div>' + '</div>',
                                            afterShow: function (opt) {
                                                var $pop = $('#' + opt.id);
                                                $pop.find('.pop_close').click(function () {
                                                    $(this).pop_close(opt.id);
                                                });
                                                $('.back_wait').on('click',function () {
                                                    $(this).parents('.modal_2').find('.pop_close').click();
                                                });
                                                $('.help_wait').on('click',function () {
                                                    $(this).parents('.modal_2').find('.pop_close').click();
                                                });
                                                index.myLottery();
                                            }
                                        });
                                        _c.lock = true;
                                    }else  if(ret.code ===-3){
                                        $(this).pop_dialog({
                                            id: 'pop_overlay_3',
                                            type: 'content',
                                            width: 590,
                                            height: 452,
                                            position: 'center',
                                            content: '<div class="modal_2">' + '<div class="modal_box">' + '<a href="javascript:; " class="close pop_close"></a>' + '<div class="tip_wait">' + '<p>活动已结束</p>' + '</div>' + '<div class="footer">' + '<div class="btn_box">' + '<a href="javascript:;" class="back_wait">返回分会场</a>' + '<a href="javascript:;" class="help_wait">如何获券</a> ' + '</div>' + '</div>' + '</div>' + '</div>',
                                            afterShow: function (opt) {
                                                var $pop = $('#' + opt.id);
                                                $pop.find('.pop_close').click(function () {
                                                    $(this).pop_close(opt.id);
                                                });
                                                $('.back_wait').on('click',function () {
                                                    $(this).parents('.modal_2').find('.pop_close').click();
                                                });
                                                $('.help_wait').on('click',function () {
                                                    $(this).parents('.modal_2').find('.pop_close').click();
                                                });
                                                index.myLottery();
                                            }
                                        });
                                        _c.lock = true;
                                    }
                                    else if (ret.code === -4) {
                                        $(this).pop_dialog({
                                            id: 'pop_overlay_3',
                                            type: 'content',
                                            width: 590,
                                            height: 452,
                                            position: 'center',
                                            content: '<div class="modal_2">' + '<div class="modal_box">' + '<a href="javascript:; " class="close pop_close"></a>' + '<div class="tip_wait">' + '<p>绑定手机号后才能抽奖哦~</p>' + '</div>' + '<div class="footer">' + '<div class="btn_box">' + '<a href="http://home.aipai.com/'+_bid+'?action=updateInfo&sub=countInfo" class="back_wait" target="_blank">马上去绑定</a>' + '</div>' + '</div>' + '</div>' + '</div>',
                                            afterShow: function (opt) {
                                                var $pop = $('#' + opt.id);
                                                $pop.find('.pop_close').click(function () {
                                                    $(this).pop_close(opt.id);
                                                });
                                                index.myLottery();

                                                //未绑定手机
                                                $pop.find('.back_wait').click(function () {
                                                    $(this).pop_close(opt.id);
                                                    INF.bindPhoneAndEmail.modifyPhone("recommend_ticket");
                                                    return false;
                                                });

                                            }
                                        });
                                        _c.lock = true;
                                    } else {
                                        $(this).pop_dialog({
                                            id: 'pop_overlay_3',
                                            type: 'content',
                                            width: 590,
                                            height: 452,
                                            position: 'center',
                                            content: '<div class="modal_2">' + '<div class="modal_box">' + '<a href="javascript:; " class="close pop_close"></a>' + '<div class="tip_wait">' + '<p>目前抽奖的小伙伴太多，<br/>请您稍后再试~</p>' + '</div>' + '<div class="footer">' + '<div class="btn_box">' + '<a href="javascript:;" class="back_wait">返回分会场</a>' + '<a href="javascript:;" class="help_wait">如何获券</a> ' + '</div>' + '</div>' + '</div>' + '</div>',
                                            afterShow: function (opt) {
                                                var $pop = $('#' + opt.id);
                                                $pop.find('.pop_close').click(function () {
                                                    $(this).pop_close(opt.id);
                                                });
                                                $('.back_wait').on('click',function () {
                                                    $(this).parents('.modal_2').find('.pop_close').click();
                                                });
                                                $('.help_wait').on('click',function () {
                                                    $(this).parents('.modal_2').find('.pop_close').click();
                                                });
                                                index.myLottery();
                                            }
                                        });
                                        _c.lock = true;
                                    }
                                },
                                error: function (data) { //请求长轮询错误，解除锁定
                                    _c.lock = true;
                                }
                        });
                    },
                    doAnimate: function (opt) {
                        var _ts = this,
                            _c = index.config,
                            $el = _ts.$el,
                            $award = $el.find('.award'),
                            len = $award.length,
                            i = 0,
                            drawNumCur = 0,
                            timeCur = _c.time / 2,
                            msg = opt.lotteryMsg,
                            _bid = cookies.get('b') || "",
                            lotteryCode = Number(opt.lotteryCode); // 1 - 8
                        // console.log(lotteryCode);
                        switch (lotteryCode) {
                        case 1:
                            prizeCur = 5;
                            break;
                        case 2:
                            prizeCur = 0;
                            break;
                        case 3:
                            prizeCur = 4;
                            break;
                        case 4:
                            prizeCur = 7;
                            break;
                        case 5:
                            prizeCur = 2;
                            break;
                        case 6:
                            prizeCur = 6;
                            break;
                        case 7:
                            prizeCur = 3;
                            break;
                        case 8:
                            prizeCur = 1;
                            break;
                        default:
                            $(this).pop_alert({
                                msg: "网络错误！",
                            });
                            return false;
                        }
                        var fun = function () {
                            $award.removeClass('cur');
                            $award.eq(i).addClass('cur');
                            var $cur = $el.find('.award.cur');
                            $award.find('.off').show();
                            $cur.find('.off').hide();
                            if ((_c.drawNum - drawNumCur) < 2) {

                                if (drawNumCur >= _c.drawNum && i === prizeCur) { // 抽奖停止位置 跳出循环 _c.lock = true;
                                    clearTimeout(_c.timer);
                                    lastI = i;
                                    // 弹出提示
                                    if (opt.lotteryCode) {
                                        setTimeout(function(){
                                            $(this).pop_dialog({
                                                id: 'pop_overlay_3',
                                                type: 'content',
                                                width: 590,
                                                height: 452,
                                                position: 'center',
                                                content: '<div class="modal_1">' + '<div class="modal_box">' + '<a href="javascript:; " class="close pop_close"></a>' + '<ul>' + '<li class="li_1">' + '<div class="g_' + lotteryCode + '"></div>' + '</li>' + '<li class="li_2">' + '<div>' + '<span class="title">恭喜你抽到了</span>' + '<span class="reward">' + opt.lotteryMsg + '</span>' + '</div>' + '</li>' + '</ul>' + '<div class="footer">' + '<div class="btn_box">' + '<a href="javascript:;" class="back pop_close">返回分会场</a>' + '<a href="http://star.aipai.com/2017/" class="help" target="_blank">去主会场送礼</a>' + '</div>' + '</div>' + '</div>' + '</div>',
                                                afterShow: function (opt) {
                                                    var $pop = $('#' + opt.id);
                                                    $pop.find('.pop_close').click(function () {
                                                        $(this).pop_close(opt.id);
                                                    });
                                                    $('.help').on('click',function () {
                                                        $(this).parents('.modal_1').find('.pop_close').click();
                                                    });
                                                    index.myLottery();
                                                }
                                            });
                                        },1200);
                                    }
                                    // 打开开关
                                    _c.lock = true;
                                    return false;
                                }

                                if (_c.time < 100) {
                                    _c.time += 10;
                                } else if (_c.time < 800) {
                                    _c.time += 80;
                                }
                            } else { //加快
                                if (_c.time > 100) {
                                    _c.time -= 100;
                                } else if (_c.time > 50) {
                                    _c.time -= 8;
                                }
                            }
                            i++;
                            if (i > len - 1) {
                                i = 0;
                                drawNumCur++;
                            }
                            clearTimeout(_c.timer);

                            _c.timer = setTimeout(function () {
                                    fun();
                                },
                                _c.time);
                        };

                        $award.removeClass('off');
                        $award.eq(0).addClass('cur');
                        fun();
                    }
            },
            //激情一夏
            lottery2: {
                config: {
                    "lock": true,//true 表示可以请求
                    "timer": null,
                    "time": 800,
                    "drawNum": 5 //圈数
                },
                init: function () {
                        var _ts = this,
                            _c = index.config,
                            $el = $('#lottery2');
                        _ts.$el = $el;
                        $('.lottery_btn_right').click(function () {
                            g.checkloginNew(_ts.raffle, _ts);
                            // _ts.raffle();
                        });
                    },
                    //进行抽奖
                    raffle: function (_this) {
                        var _ts = index.lottery2,
                            _c = index.config,
                            $el = _ts.$el,
                            _bid = cookies.get('b') || "",
                            _url = 'http://star.aipai.com/2017/lottery/action?type=2&' + _bid;
                        if (!_c.lock) {
                            return false;
                        }
                        _c.lock = false; //关闭
                        //_data={num:0,type:4,prize:'1',lottery:0,allPrize:{prize:['111','222']}};
                        //_ts.doAnimate(_data);
                        //return;
                        $.ajax({
                            type: 'GET',
                            url: _url,
                            data: '',
                            dataType: 'jsonp',
                            timeout: 10000,
                            jsonpCallback: 'cbFunction',
                            success: function (ret) {
                                    var _data = {},
                                        retData = {},
                                        ty = '',
                                        picUrl = '';
                                    if (ret.code === 0) { //抽中奖
                                        _data = ret.data;
                                        index.myLottery();
                                        _ts.doAnimate(_data);
                                    } else if (ret.code === -1) { //用户没登录
                                        $(this).pop_alert({
                                            msg: ret.msg,
                                        });
                                        _c.lock = true;
                                    } else if (ret.code === -2) { //没有足够的抽奖券
                                        $(this).pop_dialog({
                                            id: 'pop_overlay_3',
                                            type: 'content',
                                            width: 590,
                                            height: 452,
                                            position: 'center',
                                            content: '<div class="modal_2">' + '<div class="modal_box">' + '<a href="javascript:; " class="close pop_close"></a>' + '<div class="tip_wait">' + '<p>' + ret.msg + '</p>' + '</div>' + '<div class="footer">' + '<div class="btn_box">' + '<a href="javascript:;" class="back_wait">返回分会场</a>' + '<a href="javascript:;" class="help_wait">如何获券</a> ' + '</div>' + '</div>' + '</div>' + '</div>',
                                            afterShow: function (opt) {
                                                var $pop = $('#' + opt.id);
                                                $pop.find('.pop_close').click(function () {
                                                    $(this).pop_close(opt.id);
                                                });
                                                $('.back_wait').on('click',function () {
                                                    $(this).parents('.modal_2').find('.pop_close').click();
                                                });
                                                $('.help_wait').on('click',function () {
                                                    $(this).parents('.modal_2').find('.pop_close').click();
                                                });
                                                index.myLottery();
                                            }
                                        });
                                        _c.lock = true;
                                    }else if (ret.code === -3) {
                                        $(this).pop_dialog({
                                            id: 'pop_overlay_3',
                                            type: 'content',
                                            width: 590,
                                            height: 452,
                                            position: 'center',
                                            content: '<div class="modal_2">' + '<div class="modal_box">' + '<a href="javascript:; " class="close pop_close"></a>' + '<div class="tip_wait">' + '<p>活动已结束</p>' + '</div>' + '<div class="footer">' + '<div class="btn_box">' + '<a href="javascript:;" class="back_wait">返回分会场</a>' + '<a href="javascript:;" class="help_wait">如何获券</a> ' + '</div>' + '</div>' + '</div>' + '</div>',
                                            afterShow: function (opt) {
                                                var $pop = $('#' + opt.id);
                                                $pop.find('.pop_close').click(function () {
                                                    $(this).pop_close(opt.id);
                                                });
                                                $('.back_wait').on('click',function () {
                                                    $(this).parents('.modal_2').find('.pop_close').click();
                                                });
                                                $('.help_wait').on('click',function () {
                                                    $(this).parents('.modal_2').find('.pop_close').click();
                                                });
                                                index.myLottery();
                                            }
                                        });
                                        _c.lock = true;
                                    } else if (ret.code === -4) {
                                        $(this).pop_dialog({
                                            id: 'pop_overlay_3',
                                            type: 'content',
                                            width: 590,
                                            height: 452,
                                            position: 'center',
                                            content: '<div class="modal_2">' + '<div class="modal_box">' + '<a href="javascript:; " class="close pop_close"></a>' + '<div class="tip_wait">' + '<p>绑定手机号后才能抽奖哦~</p>' + '</div>' + '<div class="footer">' + '<div class="btn_box">' + '<a href="http://home.aipai.com/'+_bid+'?action=updateInfo&sub=countInfo" class="back_wait" target="_blank">马上去绑定</a>' + '</div>' + '</div>' + '</div>' + '</div>',
                                            afterShow: function (opt) {
                                                var $pop = $('#' + opt.id);
                                                $pop.find('.pop_close').click(function () {
                                                    $(this).pop_close(opt.id);
                                                });
                                                index.myLottery();

                                                //未绑定手机
                                                $pop.find('.back_wait').click(function () {
                                                    $(this).pop_close(opt.id);
                                                    INF.bindPhoneAndEmail.modifyPhone("recommend_ticket");
                                                    return false;
                                                });
                                            }
                                        });
                                        _c.lock = true;
                                    }
                                     else {
                                        $(this).pop_dialog({
                                            id: 'pop_overlay_3',
                                            type: 'content',
                                            width: 590,
                                            height: 452,
                                            position: 'center',
                                            content: '<div class="modal_2">' + '<div class="modal_box">' + '<a href="javascript:; " class="close pop_close"></a>' + '<div class="tip_wait">' + '<p>目前抽奖的小伙伴太多，<br/>请您稍后再试~</p>' + '</div>' + '<div class="footer">' + '<div class="btn_box">' + '<a href="javascript:;" class="back_wait">返回分会场</a>' + '<a href="javascript:;" class="help_wait">如何获券</a> ' + '</div>' + '</div>' + '</div>' + '</div>',
                                            afterShow: function (opt) {
                                                var $pop = $('#' + opt.id);
                                                $pop.find('.pop_close').click(function () {
                                                    $(this).pop_close(opt.id);
                                                });
                                                $('.back_wait').on('click',function () {
                                                    $(this).parents('.modal_2').find('.pop_close').click();
                                                });
                                                $('.help_wait').on('click',function () {
                                                    $(this).parents('.modal_2').find('.pop_close').click();
                                                });
                                                index.myLottery();
                                            }
                                        });
                                        _c.lock = true;
                                    }
                                },
                                error: function (data) { //请求长轮询错误，解除锁定
                                    $(this).pop_dialog({
                                        id: 'pop_overlay_3',
                                        type: 'content',
                                        width: 590,
                                        height: 452,
                                        position: 'center',
                                        content: '<div class="modal_2">' + '<div class="modal_box">' + '<a href="javascript:; " class="close pop_close"></a>' + '<div class="tip_wait">' + '<p>' + ret.msg + '</p>' + '</div>' + '<div class="footer">' + '<div class="btn_box">' + '<a href="javascript:;" class="back_wait">返回分会场</a>' + '<a href="javascript:;" class="help_wait">如何获券</a> ' + '</div>' + '</div>' + '</div>' + '</div>',
                                        afterShow: function (opt) {
                                            var $pop = $('#' + opt.id);
                                            $pop.find('.pop_close').click(function () {
                                                $(this).pop_close(opt.id);
                                            });
                                            $('.back_wait').on('click',function () {
                                                $(this).parents('.modal_2').find('.pop_close').click();
                                            });
                                            index.myLottery();
                                        }
                                    });
                                    _c.lock = true;
                                }
                        });
                    },
                    doAnimate: function (opt) {
                        var _ts = this,
                            _c = index.config,
                            $el = _ts.$el,
                            $award = $el.find('.award'),
                            len = $award.length,
                            i = 0,
                            drawNumCur = 0,
                            timeCur = _c.time / 2,
                            msg = opt.lotteryMsg,
                            _bid = cookies.get('b') || "",
                            // _bid=1,
                            lotteryCode = Number(opt.lotteryCode);// 1 - 8
                        // console.log(lotteryCode);
                        switch (lotteryCode) {
                        case 9:
                            prizeCur = 5;
                            break;
                        case 10:
                            prizeCur = 4;
                            break;
                        case 11:
                            prizeCur = 7;
                            break;
                        case 12:
                            prizeCur = 2;
                            break;
                        case 13:
                            prizeCur = 6;
                            break;
                        case 14:
                            prizeCur = 3;
                            break;
                        case 15:
                            prizeCur = 0;
                            break;
                        case 16:
                            prizeCur = 1;
                            break;
                        default:
                            $(this).pop_alert({
                                msg: "网络错误！",
                            });
                            return false;
                        }
                        var fun = function () {
                            $award.removeClass('cur');
                            $award.find('.off').hide();
                            $award.eq(i).addClass('cur');
                            var $cur = $el.find('.award.cur');
                            $award.find('.off').show();
                            $cur.find('.off').hide();
                            if ((_c.drawNum - drawNumCur) < 2) {

                                if (drawNumCur >= _c.drawNum && i === prizeCur) { // 抽奖停止位置 跳出循环 _c.lock = true;
                                    clearTimeout(_c.timer);
                                    lastJ = i;
                                    // 弹出提示
                                    if (opt.lotteryCode) {
                                        setTimeout(function(){
                                            $(this).pop_dialog({
                                                id: 'pop_overlay_3',
                                                type: 'content',
                                                width: 590,
                                                height: 452,
                                                position: 'center',
                                                content: '<div class="modal_1">' + '<div class="modal_box">' + '<a href="javascript:; " class="close pop_close"></a>' + '<ul>' + '<li class="li_1">' + '<div class="g_' + lotteryCode + '"></div>' + '</li>' + '<li class="li_2">' + '<div>' + '<span class="title">恭喜你抽到了</span>' + '<span class="reward">' + opt.lotteryMsg + '</span>' + '</div>' + '</li>' + '</ul>' + '<div class="footer">' + '<div class="btn_box">' + '<a href="javascript:;" class="back pop_close">返回分会场</a>' + '<a href="http://star.aipai.com/2017/" class="help" target="_blank">去主会场送礼</a>' + '</div>' + '</div>' + '</div>' + '</div>',
                                                afterShow: function (opt) {
                                                    $award.find('.off').hide();
                                                    var $pop = $('#' + opt.id);
                                                    $pop.find('.pop_close').click(function () {
                                                        $(this).pop_close(opt.id);
                                                    });
                                                    $('.help').on('click',function () {
                                                        $(this).parents('.modal_1').find('.pop_close').click();
                                                    });
                                                    index.myLottery();
                                                }
                                            });
                                        },1200);

                                    }
                                    else if (opt.lotteryCode === 16) {
                                        $(this).pop_dialog({
                                            id: 'pop_overlay_3',
                                            type: 'content',
                                            width: 590,
                                            height: 452,
                                            position: 'center',
                                            content: '<div class="modal_1">' + '<div class="modal_box">' + '<a href="javascript:; " class="close pop_close"></a>' + '<ul>' + '<li class="li_1">' + '<div class="g_' + lotteryCode + '"></div>' + '</li>' + '<li class="li_2">' + '<div>' + '<span class="title">恭喜你抽到了</span>' + '<span class="reward">' + opt.lotteryMsg + '</span>' + '</div>' + '</li>' + '<li class="li_3">' + '<p>请联系客服，登记资料<i class="qq"></i>爱拍客服: 800103410</p>' + '</li>' + '</ul>' + '<div class="footer">' + '<div class="btn_box">' + '<a href="javascript:;" class="service">稍后联系</a>' + '</div>' + '</div>' + '</div>' + '</div>',
                                            afterShow: function (opt) {
                                                $award.find('.off').hide();
                                                var $pop = $('#' + opt.id);
                                                $pop.find('.pop_close').click(function () {
                                                    $(this).pop_close(opt.id);
                                                });
                                                $('.help').on('click',function () {
                                                        $(this).parents('.modal_1').find('.pop_close').click();
                                                });
                                                index.myLottery();
                                            }
                                        });
                                    }
                                    // 打开开关
                                    _c.lock = true;
                                    return false;
                                }

                                if (_c.time < 100) {
                                    _c.time += 10;
                                } else if (_c.time < 800) {
                                    _c.time += 80;
                                }
                            } else { //加快
                                if (_c.time > 100) {
                                    _c.time -= 100;
                                } else if (_c.time > 50) {
                                    _c.time -= 8;
                                }
                            }
                            i++;
                            if (i > len - 1) {
                                i = 0;
                                drawNumCur++;
                            }
                            clearTimeout(_c.timer);

                            _c.timer = setTimeout(function () {
                                    fun();
                                },
                                _c.time);
                        };

                        $award.removeClass('cur');
                        $award.eq(0).addClass('cur');
                        fun();
                    }
            },
            news: function () {
                var _ts = this;
                $.ajax({
                    type: 'GET',
                    url: 'http://star.aipai.com/2017/lottery/broadcast',
                    dataType: 'jsonp',
                    success: function (ret) {
                        var coolNews = $('#lottery .news'),
                            passionNews = $('#lottery2 .news');
                        if(ret.code ===0){
                            CoolLotteryLog = ret.data.CoolLotteryLog;
                            PassionLotteryLog = ret.data.PassionLotteryLog;
                            coolLottery = ret.data.CoolLotteryLog.lotteryCode;
                            passionLottery = ret.data.CoolLotteryLog.lotteryCode;
                            var _html ='',
                            _html2 ='';
                            var lotteryName =null;
                            for(var i=0;i<CoolLotteryLog.length;i++){
                                 var nickname = ret.data.User[CoolLotteryLog[i].bid].nickname;
                                 var lotteryCode = Number(CoolLotteryLog[i].lotteryCode);
                                switch (lotteryCode) {
                                    case 1:
                                    lotteryName = '爱拍豆x5';break;
                                    case 2:
                                    lotteryName = '爱拍豆x10';break;
                                    case 3:
                                    lotteryName = '爱拍豆x50';break;
                                    case 4:
                                    lotteryName = '爱拍豆x100';break;
                                    case 5:
                                    lotteryName = '爱拍豆x1000';break;
                                    case 6:
                                    lotteryName = '推荐票x1';break;
                                    case 7:
                                    lotteryName = '推荐票x2';break;
                                    case 8:
                                    lotteryName = '推荐票x3';break;
                                }
                                _html+='<li>恭喜'+nickname+'抽到'+lotteryName+'</li>';
                            }
                            for(var j=0;j<PassionLotteryLog.length;j++){
                                 var nickname2 = ret.data.User[PassionLotteryLog[j].bid].nickname;
                                 var lotteryCode2 = Number(PassionLotteryLog[j].lotteryCode);
                                switch (lotteryCode2) {
                                    case 9:
                                    lotteryName = '明星币x1';break;
                                    case 10:
                                    lotteryName = '明星币x5';break;
                                    case 11:
                                    lotteryName = '明星币x10';break;
                                    case 12:
                                    lotteryName = '明星币x100';break;
                                    case 13:
                                    lotteryName = '推荐票x3';break;
                                    case 14:
                                    lotteryName = '推荐票x8';break;
                                    case 15:
                                    lotteryName = '推荐票x15';break;
                                    case 16:
                                    lotteryName = '精美外设';break;
                                }
                                _html2+='<li>恭喜'+nickname2+'抽到'+lotteryName+'</li>';
                            }
                            coolNews.html(_html);
                            passionNews.html(_html2);
                            if($('#lottery').find('.news li').size() >1){
                                _ts.marquee(19, 20, 4000, $('#lottery').find('.news').get(0));
                            }
                            if($('#lottery2').find('.news li').size() >1){
                                _ts.marquee(19, 20, 4000, $('#lottery2').find('.news').get(0));
                            }   
                         }
                        else {
                            // console.log('广播接口无信息');
                        }
                    },
                });
            },
            myLottery: function () {
                $.ajax({
                    type: 'GET',
                    url: 'http://star.aipai.com/2017/lottery/myLotteryNum',
                    data: '',
                    dataType: 'jsonp',
                    success: function (ret){
                            var num1 = $('.my_reward .num1'),
                                num2 = $('.my_reward .num2');
                        if(ret.code===0){
                            var coolNum = ret.data.coolLotteryNumber,
                            passionNum = ret.data.passionLotteryNumber;
                            num1.text('x' + coolNum);
                            num2.text('x' + passionNum);
                        }
                        else{
                            num1.text('x' + 0);
                            num2.text('x' + 0);
                        }
                    }
                });
            },
            marquee : function(lh, speed, delay, _ts){
                var t; //定时器
                var p=false; //初始化为允许滚动状态
                var o = _ts;
                o.innerHTML+=o.innerHTML;
                o.onmouseover=function(){p=true;};
                o.onmouseout=function(){p=false;};
                o.scrollTop = 0; //初始化滚动高度
                function start(){
                    t = setInterval(scrolling, speed);
                    if(!p) o.scrollTop += 1;
                }
                function scrolling(){
                    if(o.scrollTop%lh!==0){
                        o.scrollTop += 1;
                        if(o.scrollTop>=(o.scrollHeight/2)-1) o.scrollTop = 0;
                    }else{
                        clearInterval(t);
                        setTimeout(start,delay);
                    }
                }
                setTimeout(start,delay);
            },
            other:function(){
                var _bid = g.apm.cookies.get('b') || 0;
                $('.content_2 .right_box .li_1').find('.my_vitality').attr('href','http://home.aipai.com/'+_bid+'?action=subscribe&sub=myStar');
            }
    };
    $(function () {
        index.init();
    });
});
