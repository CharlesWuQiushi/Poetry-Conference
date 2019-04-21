/**
 * 这是由 @author 六·14班 Charles·吴秋实 
 * 制作的成外附小诗词大会小程序。
 * 本程序可随机抽取规定题库中的题目，随机排序选手名单上的选手，并规定80~160秒时间，进行诗词大会答题。
 * 答题正确，进入下一道题；答题错误，累计得分，并进入下一位选手的答题。
 * 全部选手答题完成，根据总分排名。
 * @version 1.0 已在 六·14班班级复赛 初步使用并进行优化。
 * 
 * @package Poetry Conference Activity Program in Primary School Attached to Chengdu Foreign Language School
 * 起始版本：
 * @since 1.0
 * 当前版本：
 * @version 1.2.1
 * 
 * @version 1.2 更新内容:
 *   · 修复@version 1.1 中出现的计时器无法正常运行、严重跳码的问题。已使用绝对时间进行标记与判断。
 *   · 增加误判机制，当题库中录入答案错误时，可手动纠正并加入对应得分。
 *   · 按阶梯制度（5分、10分、15分）加分，而并非以前的一律5分制。
 *   · 增加结束时背景音乐。
 *   · 美化答题界面。
 * 
 * @version 1.2.1 更新内容：
 *   · 在显示诗词出处时增加“关闭”按钮，以防止遮挡答题内容。灵活性更强。
 *   · 对一些W3C衍生标准的浏览器增加了全屏/关闭全屏请求的支持。
 * 
 * @license MIT @public
 * @copyright © 2019 Charles 吴秋实. All rights reserved.
*/

//自动播放初始界面背景音乐
document.getElementById("waitingBGM").play();

//设置当前状态变量
const ENTRY = 0, RANDOM_GEN = 1, NUM_SHOW = 2, ANSWER = 3, SUCCEED = 4, FAILED = 5, TOTAL = 6, EXIT = 7;
var state = ENTRY;

//设置当前选手、难度、题目、计时器、对焦框点
var nowCompetitor = 1;
var nowLevel = 1;
var nowQues = PDL1[parseInt(Math.random() * PDL1.length)];
var limitTime = 80;
var Timer;
var nowChoose;
var nowFocus;

//设置是否答题、打开手写板判断程序，以及到时时间戳
var isOpenHandInputer = false, isAnswering = false;
var timeUp;

//监听屏幕点击事件
document.onclick = function () {
    //进入全屏
    if (document.getElementsByTagName("html")[0].requestFullScreen) {
        document.getElementsByTagName("html")[0].requestFullScreen();
    } else if (document.getElementsByTagName("html")[0].mozRequestFullScreen) {
        document.getElementsByTagName("html")[0].mozRequestFullScreen();
    } else if (document.getElementsByTagName("html")[0].webkitRequestFullScreen) {
        document.getElementsByTagName("html")[0].webkitRequestFullScreen();
    } else if (document.getElementsByTagName("html")[0].msRequestFullScreen) {
        document.getElementsByTagName("html")[0].msRequestFullScreen();
    }
    //对当前状态进行判断，如果是准备阶段，就进入随机顺序选择程序
    if (state == ENTRY) {
        state = RANDOM_GEN;
        Clear("stage");
        setTimeout(function () {
            Random_Gen();
        }, 500);
    }
}

//写入随机顺序抽选程序
function Random_Gen() {
    Display("stage");
    //显示1~7号的选手顺序
    document.getElementById("stage").innerHTML = "<h1 style=\"font-size:80px;margin-top:-40px\">选手随机顺序抽取</h1><ul style=\"font-size:30px; margin-left:100px; margin-top:60px; font-family:'华文中宋'\" id = \"random-gen\"></ul><button id = 'random-stop' style = 'font-size:70px;position:absolute;right:400px;top:300px;'>停</button>";
    document.getElementById("random-gen").innerHTML +=
        "<li id=\"num-one\" style=\"margin-top:20px; font-size:40px;\">第①位：<span class = \"small-note\" style = 'font-size:46px;'></span></li>" +
        "<li id=\"num-two\" style=\"margin-top:90px; font-size:40px;\">第②位：<span class = \"small-note\" style = 'font-size:46px;'></span></li>" +
        "<li id=\"num-three\" style=\"margin-top:160px; font-size:40px;\">第③位：<span class = \"small-note\" style = 'font-size:46px;'></span></li>" +
        "<li id=\"num-foue\" style=\"margin-top:230px; font-size:40px;\">第④位：<span class = \"small-note\" style = 'font-size:46px;'></span></li>" +
        "<li id=\"num-five\" style=\"margin-top:300px; font-size:40px;\">第⑤位：<span class = \"small-note\" style = 'font-size:46px;'></span></li>" +
        "<li id=\"num-six\" style=\"margin-top:370px; font-size:40px;\">第⑥位：<span class = \"small-note\" style = 'font-size:46px;'></span></li>" +
        "<li id=\"num-seven\" style=\"margin-top:440px; font-size:40px;\">第⑦位：<span class = \"small-note\" style = 'font-size:46px;'></span></li>";
    //对数组以每100毫秒一次的速度随机排序，并遍历显示在界面上
    var RandomGenerator = setInterval(function () {
        competitors.sort(function (a, b) {
            var v = Math.random() > 0.5 ? 1 : -1;
            return v;
        });
        for (var i = 0; i < competitors.length; i += 1) {
            document.getElementById("random-gen").getElementsByTagName("span")[i].innerHTML = competitors[i].name;
        }
    }, 100)

    //当点下“停”按钮时，停止随机排序，并显示“下一步”按钮
    document.getElementById("random-stop").onclick = function () {
        clearInterval(RandomGenerator);
        Clear("random-stop");
        setTimeout(function () {
            Remove("random-stop");
            document.body.innerHTML += "		<button id = 'next-step' style = 'opacity:0;'>下一步</button>";
            Display("next-step");
            BindNextStep();
        }, 500);
    }
}

//写入元素淡入淡出、删除函数
function Clear(id) {
    document.getElementById(id).style.opacity = "0";
}
function Remove(id) {
    setTimeout(function () {
        document.getElementById(id).parentNode.removeChild(document.getElementById(id));
    }, 500)
}
function Display(id) {
    document.getElementById(id).style.opacity = "1";
}

//写入题目抽取总集成函数
function Answer() {
    //在题库中随机抽取题目
    switch (nowLevel) {
        //对难度进行判断，1~5为①级题，6~9为②级题目，10~12为③级题目
        case 1: case 2: case 3: case 4: case 5:
            //在指定难度的题库中随机抽取题目
            var nowQuesNum = parseInt(Math.random() * PDL1.length);
            nowQues = PDL1[nowQuesNum];
            //在控制台中显示出当前题目信息
            console.log("Now question: Level 1 Ques " + nowQuesNum);
            console.log(nowQues);
            break;
        case 6: case 7: case 8: case 9:
            var nowQuesNum = parseInt(Math.random() * PDL2.length);
            nowQues = PDL2[nowQuesNum];
            console.log("Now question: Level 2 Ques " + nowQuesNum);
            console.log(nowQues);
            break;
        case 10: case 11: case 12:
            var nowQuesNum = parseInt(Math.random() * PDL3.length);
            nowQues = PDL3[nowQuesNum];
            console.log("Now question: Level 3 Ques " + nowQuesNum);
            console.log(nowQues);
            break;
        default:
            var nowQuesNum = parseInt(Math.random() * PDL1.length);
            nowQues = PDL1[nowQuesNum];
            console.log(nowQues);
    }
    //检查抽取到的题目是否已经被使用过
    if (nowQues.used) {
        //如果是，递归重新抽取
        Answer();
        return;
    }

    //奏响答题背景音乐
    document.getElementById("loadendBGM").play();
    setTimeout(function () {
        document.getElementById("answerBGM").currentTime = 0;
        document.getElementById("answerBGM").src = "./Audios/Answering" + parseInt(Math.random() * 3) + ".mp3";
        document.getElementById("answerBGM").play();
    }, 3000)

    nowQues.used = true;
    //对填空、选择、乱序重组题目分别进行处理
    switch (nowQues.type) {
        case blank:
            Blank();
            break;
        case space:
            Space();
            break;
        case choose:
            Choose();
            break;
    }

    //记录到时时间戳，并设置计时器
    setTimeout(function () {
        timeUp = new Date().getTime() + (limitTime + 1) * 1000;
        //状态改为正在答题
        isAnswering = true;
        Timer = setInterval(function () {
            if (state == ANSWER && timeUp - new Date().getTime() >= 0 == true) {
                if ((timeUp - new Date().getTime()) >= 0) {
                    //如果剩余时间大于0，继续倒计时
                    document.getElementById("time-left").innerHTML = parseInt((timeUp - new Date().getTime()) / 1000) + "秒";
                } else {
                    //如果超时，显示“超时”字样，并且强制检查答案
                    document.getElementById("time-left").innerHTML = "超时";
                    CheckAnswer();
                    //清除定时器
                    clearInterval(Timer);
                }
            } else {
                //清除定时器
                clearInterval(Timer);
            }
        }, 100)
    }, 1000)
    //记录当前对焦元素
    nowFocus = document.activeElement;
}

//写入乱序重组题目处理函数
function Blank() {
    //打出标题
    document.getElementById("stage").innerHTML = '<h1 style="font-size:80px;margin-top:-40px">答题</h1><h2 id = "time-left-intro">剩余答题时间：</h2><h2 id = "time-left"></h2>';
    //对不同长度的乱序重组分开处理，并且有序设置答题区宽度，摆列好每个字
    switch (nowQues.blankChar.length) {
        case 9:
            document.getElementById("stage").innerHTML += '		<h2 class="ques-blank-intro">请从下面的9字格中，识别出一句' + nowQues.answer.length + '字诗词。</h2><div id = "ques-blank-wrap"></div><div id = "ques-blank-answer" ></div><button id = "ques-blank-backspace">删除</button>'
            document.getElementById("ques-blank-wrap").style.width = "376px";
            break;
        case 12:
            document.getElementById("stage").innerHTML += '		<h2 class="ques-blank-intro">请从下面的12字格中，识别出一句' + nowQues.answer.length + '字诗词。</h2><div id = "ques-blank-wrap"></div><div id = "ques-blank-answer" ></div><button id = "ques-blank-backspace">删除</button>'
            document.getElementById("ques-blank-wrap").style.width = "500px";
            break;
        case 15: case 16:
            document.getElementById("stage").innerHTML += '		<h2 class="ques-blank-intro">请从下面的' + nowQues.blankChar.length + '字格中，识别出一句' + nowQues.answer.length + '字诗词。</h2><div id = "ques-blank-wrap"></div><div id = "ques-blank-answer" ></div><button id = "ques-blank-backspace">删除</button>'
            document.getElementById("ques-blank-wrap").style.width = "500px";
            break;
    }
    //遍历乱序字符串的每一个字，填入到答题区中
    for (var i = 0; i < nowQues.blankChar.length; i += 1) {
        document.getElementById("ques-blank-wrap").innerHTML += '<button id = "blank-' + i + '" class = "blank-choose" onclick = "BlankAddChar(\'blank-' + i + '\')">' + nowQues.blankChar.substring(i, i + 1) + '</button>';
    }

    //添加“删除”键
    document.getElementById("ques-blank-backspace").onclick = function () {
        if (state == ANSWER) {
            document.getElementById("ques-blank-answer").innerHTML = document.getElementById("ques-blank-answer").innerHTML.substring(0, document.getElementById("ques-blank-answer").innerHTML.length - 1);
        }
    }

    Display("body");
}

//写入手写板呼出程序
function CallHandInput(is) {
    //解除警告程序控制
    isOpenHandInputer = true;
    //使用URL Protocol进行手写板程序呼出。要安装绑定此协议的注册表，请参阅 ./Handinput/Readme.md
    window.location.href = "handinput://";
    this.is = is;
    //刷新当前对焦的元素
    nowFocus = is;
}

//写入填空题目处理函数
function Space() {
    document.getElementById("stage").innerHTML = '<h1 style="font-size:80px;margin-top:-40px">答题</h1><h2 id = "time-left-intro">剩余答题时间：</h2><h2 id = "time-left"></h2>';
    //将题目数据中的答题区space替换为<input>标签，进行输入
    var SpaceQuesString = nowQues.note;
    SpaceQuesString = SpaceQuesString.replace(/space/g, "<input type = 'text' class = 'ques-space-text' onfocus = 'CallHandInput(this)' />");
    document.getElementById("stage").innerHTML += "<h3 class = 'ques-space-wrap'>" + SpaceQuesString + "</h3>";
    //如果题目过长，缩小字体
    if (nowQues.note.length >= 30) {
        document.getElementsByClassName("ques-space-wrap")[0].style.fontSize = "40px";
        for (var i = 0; i < document.getElementsByClassName("ques-space-text").length; i += 1) {
            document.getElementsByClassName("ques-space-text")[i].style.fontSize = "34px";
        }
    }
    //添加删除按钮，并绑定点击事件，点击后删除答题框最后一字
    document.getElementById("stage").innerHTML += '<button id = "ques-blank-backspace" style = "left:2px;top:200px;">删除</button>';
    document.getElementById("ques-blank-backspace").onclick = function () {
        if (nowFocus.className == "ques-space-text") {
            nowFocus.value = nowFocus.value.substring(0, nowFocus.value.length - 1);
        }
    }
    //呼出写字板
    CallHandInput();
    //对焦第一个答题框
    document.getElementsByClassName("ques-space-text")[0].focus();
    Display("body");
}

//写入选择题目处理函数
function Choose() {
    document.getElementById("stage").innerHTML = '<h1 style="font-size:80px;margin-top:-40px">答题</h1><h2 id = "time-left-intro">剩余答题时间：</h2><h2 id = "time-left"></h2>';
    document.getElementById("stage").innerHTML += "<h2 class = 'ques-blank-intro'>" + nowQues.note + "</h2>";
    document.getElementById("stage").innerHTML += "<button class = 'ques-choose-option' id = 'ques-choose-option-A' onclick = 'ButtonCheck(A)'>A." + nowQues.option.A +
        "</button><button class = 'ques-choose-option' id = 'ques-choose-option-B' onclick = 'ButtonCheck(B)' >B." + nowQues.option.B +
        "</button><button class = 'ques-choose-option' id = 'ques-choose-option-C' onclick = 'ButtonCheck(C)' >C." + nowQues.option.C;
    //如果存在D选项，添加D选项框
    if (nowQues.option.D != (undefined && "")) {
        document.getElementById("stage").innerHTML += "</button><button class = 'ques-choose-option' id = 'ques-choose-option-D' onclick = 'ButtonCheck(D)' >D." + nowQues.option.D + "</button>";
    }
    Display("body");
}

//添加选择题选项按钮点击函数
function ButtonCheck(ID) {
    this.id = ID;
    //将现在所有选项都更改为无
    for (var i = 0; i < document.getElementsByClassName("ques-choose-option").length; i += 1) {
        document.getElementsByClassName("ques-choose-option")[i].className = "ques-choose-option";
    }
    //当前选项绑定为点击选项
    document.getElementById("ques-choose-option-" + id).className = "ques-choose-option ques-choose-option-checked";
    nowChoose = id;
}
//添加乱序重组题单字按钮点击函数
function BlankAddChar(id) {
    //当前的诗句答题框中加上刚刚点击的字
    if (state == ANSWER) {
        document.getElementById("ques-blank-answer").innerHTML += document.getElementById(id).innerHTML;
    }
}

//写入答案检查总集成函数
function CheckAnswer() {
    //对是否正在答题进行判断
    if (isAnswering == true) {
        //是，继续执行，并将状态改为非答题中
        isAnswering = false;
    } else {
        //不是，直接结束进程
        return;
    }
    //写入当前题目等级检查、加分函数
    function CheckLevel() {
        switch (nowLevel) {
            //对难度进行判断，1~5为①级题，6~9为②级题目，10~12为③级题目
            case 1: case 2: case 3: case 4: case 5:
                //清空计时器，限制时间复位
                Timer = null;
                limitTime = 80;
                //打出加分字样
                document.getElementById("stage").innerHTML += "<h2 id = 'score-plus'>加<span class = 'red-score'>" + 5 + "</span>分</h2>";
                setTimeout(function () {
                    Display("score-plus");
                }, 500);
                //选手对象分值增加
                competitors[nowCompetitor - 1].score += 5;
                //题目等级增加
                nowLevel += 1;
                break;
            case 6: case 7: case 8: case 9:
                Timer = null;
                limitTime = 120;
                document.getElementById("stage").innerHTML += "<h2 id = 'score-plus'>加<span class = 'red-score'>" + 10 + "</span>分</h2>";
                setTimeout(function () {
                    Display("score-plus");
                }, 500);
                competitors[nowCompetitor - 1].score += 10;
                nowLevel += 1;
                break;
            case 10: case 11: case 12:
                Timer = null;
                if (nowLevel == 12) {
                    nowLevel = 1;
                    limitTime = 50;
                } else {
                    nowLevel += 1;
                    limitTime = 160;
                }
                document.getElementById("stage").innerHTML += "<h2 id = 'score-plus'>加<span class = 'red-score'>" + 15 + "</span>分</h2>";
                setTimeout(function () {
                    Display("score-plus");
                }, 500);
                competitors[nowCompetitor - 1].score += 15;
                nowLevel += 1;
                break;
            default:
                document.getElementById("stage").innerHTML += "<h2 id = 'score-plus'>加<span class = 'red-score'>" + 5 + "</span>分</h2>";
                setTimeout(function () {
                    Display("score-plus");
                }, 500);
                competitors[nowCompetitor - 1].score += 5;
        }
    }

    //写入答题成功处理函数
    function Succeed() {
        //清除定时器
        clearInterval(Timer);
        //改变状态至“成功”
        state = SUCCEED;
        //检查当前题目等级并加分
        CheckLevel();
        //奏响答题成功音乐
        document.getElementById("answerBGM").pause();
        document.getElementById("victoryBGM").play();
        //画出“打勾”图片
        document.getElementById("stage").innerHTML += "<img src = './Images/True.png' id = 'answer-true' />";
        setTimeout(function () {
            Display("answer-true");
        }, 500);
        //显示题目诗词出处
        DisplaySource();
        //绑定“确定”按钮点击事件
        BindNextStep();
    }

    function PreFailed() {
        //清除定时器
        clearInterval(Timer);
        Timer = null;
        //改变状态至“失败”
        state = FAILED;
        //画出“打叉”图片
        document.getElementById("stage").innerHTML += "<img src = './Images/False.png' id = 'answer-true' />";
        setTimeout(function () {
            Display("answer-true");
        }, 500)

        /**
         * @version 1.2 更新内容：
         * 增加误判机制。当题库中记载答案错误时，可手动纠正并加分。
        */
        //绑定“误判”按钮点击事件
        document.getElementById("stage").innerHTML += "<button id = 'ques-false-check'>误判</button>";
        try {
            document.getElementById('ques-blank-backspace').parentElement.removeChild(document.getElementById('ques-blank-backspace'));
        } catch (error) { }
        setTimeout(function () {
            document.getElementById("ques-false-check").onclick = function () {
                if (state == FAILED) {
                    //弹出确认框，以确认的确为程序误判
                    if (confirm("确定为程序误判，选手答题正确？") == true) {
                        //转变状态至“成功”
                        state = SUCCEED;
                        //改变“打叉”图片路径
                        document.getElementById("answer-true").src = "./Images/True.png";
                        //检查题目等级并加分
                        CheckLevel();
                        clearInterval(Timer);
                        //如果题目类型为填空，需要进行特殊处理
                        if (nowQues.type == space) {
                            var SpaceAnswers = nowQues.answer;
                            SpaceAnswers = SpaceAnswers.trim().split(" ");
                            for (var i = 0; i < document.getElementsByClassName("ques-space-text").length; i += 1) {
                                document.getElementsByClassName("ques-space-text")[i].value = SpaceAnswers[i];
                                document.getElementsByClassName("ques-space-text")[i].style.color = "black";
                            }
                            Clear("ques-false-check");
                            setTimeout(function () {
                                document.getElementById("ques-false-check").parentElement.removeChild(document.getElementById("ques-false-check"));
                            }, 500);
                        }
                    }
                }
            }
        }, 1000);
        //显示题目诗词出处
        DisplaySource();
        //绑定“确定”按钮点击事件
        BindNextStep();
    }

    //写入题目出处显示函数
    function DisplaySource() {
        //检查出处字符串可用性
        if (nowQues.from != ("" || undefined)) {
            var tempFrom = nowQues.from;
            //将所有“《”与“》”替换为有空格的“ 《”与“》 ”
            tempFrom = tempFrom.replace(/《/g, "《 ");
            tempFrom = tempFrom.replace(/》/g, " 》");
            //以“ ”为依据，进行字符串切片
            tempFrom = tempFrom.trim().split(" ");
            var tempFromHTML = "<h3 id = 'ques-from'>";
            //将HTML格式的出处字符串记录下来
            for (var i = 0; i < tempFrom.length; i += 1) {
                //添加指向百度汉语对应诗词的链接
                if (i % 2 == 1) {
                    tempFrom[i] = "<a class = 'source-link' target = 'blank' href = 'https://hanyu.baidu.com/s?wd=" + tempFrom[i] + "&from=poem'>" + tempFrom[i] + "<a>";
                }
                tempFromHTML += tempFrom[i];
            }
            //添加“关闭”按钮与点击监听事件
            tempFromHTML += "<img src = './Images/CloseFrom.png' id='close-from' style = 'position:relative;float:right;bottom:10px;width:30px;cursor:pointer' /></h3>";
            document.getElementById("stage").innerHTML += tempFromHTML;
            document.getElementById("close-from").onclick = function(){
                Clear("ques-from");
                setTimeout(function(){
                    document.getElementById("ques-from").parentNode.removeChild(document.getElementById("ques-from"));
                },500)
            }
            setTimeout(function () {
                Display("ques-from");
            }, 500);
        }
    }

    function Check() {
        if (nowQues.type == blank /* 题目类型为乱序重组 */) {
            //如果答题框中的内容与记录答案相符，执行成功处理函数。反之亦然
            if (document.getElementById("ques-blank-answer").innerHTML == nowQues.answer) {
                Succeed();
            } else if (document.getElementById("ques-blank-answer").innerHTML == "" && timeUp - new Date().getTime() >= 0) {
            } else {
                PreFailed();
                //2秒后显示红色正确答案
                setTimeout(function () {
                    if (state != TOTAL) {
                        document.getElementById("ques-blank-answer").innerHTML = nowQues.answer;
                        document.getElementById("ques-blank-answer").style.color = "red";
                    }
                }, 2000);
            }
        } else if (nowQues.type == choose /* 题目类型为选择 */) {
            //如果选择的答案与记录答案相符，执行成功处理函数。反之亦然
            if (nowChoose == nowQues.answer) {
                Succeed();
            } else {
                PreFailed();
                //2秒后显示红色正确答案
                setTimeout(function () {
                    document.getElementById("ques-choose-option-" + nowChoose).className = "ques-choose-option";
                    document.getElementById("ques-choose-option-" + nowQues.answer).className += " ques-choose-right";
                }, 2000)
            }
        } else if (nowQues.type == space /* 题目类型为填空 */) {
            //防止误点击，如果当前答题框内容为空，不予处理
            if (document.getElementsByClassName("ques-space-text")[0].value != "") {
                //解除警告函数控制，结束手写板程序进程
                isOpenHandInputer = true;
                window.location.href = "handinputover://";
                var SpaceAnswers = nowQues.answer;
                //进行字符串切片，与答题框中的答案对应
                SpaceAnswers = SpaceAnswers.trim().split(" ");
                var failedNum = [];
                //对每一个答题框内容进行判断
                for (var i = 0; i < document.getElementsByClassName("ques-space-text").length; i += 1) {
                    //如果填入的答案与记录答案不相符，执行失败处理函数。反之亦然
                    if (document.getElementsByClassName("ques-space-text")[i].value != SpaceAnswers[i]) {
                        //转变状态
                        state = FAILED;
                        //记录临时错误题号
                        failedNum[failedNum.length] = i;
                        for (var i = 0; i < SpaceAnswers.length; i += 1) {
                            document.getElementsByClassName("ques-space-text")[i].value = SpaceAnswers[i];
                        }
                        //2秒后显示红色正确答案
                        setTimeout(function () {
                            for (var i = 0; i < failedNum.length; i += 1) {
                                document.getElementsByClassName("ques-space-text")[i].value = SpaceAnswers[i];
                                document.getElementsByClassName("ques-space-text")[i].style.color = "red";
                            }
                        }, 2000)
                    } else {
                        //再次显示选手填入答案
                        setTimeout(function () {
                            for (var i = 0; i < SpaceAnswers.length; i += 1) {
                                document.getElementsByClassName("ques-space-text")[i].value = SpaceAnswers[i];
                            }
                        }, 100);
                    }
                }
                //最后对状态进行判断，执行相应函数
                if (state == FAILED) {
                    PreFailed();
                } else {
                    Succeed();
                }
            }
        }
    }
    //调用集成判断函数
    Check();
}

//写入页面关闭警告程序
function CAUTION(event) {
    //如果并非正在打开/关闭写字板，弹窗警告
    if (state != TOTAL && isOpenHandInputer != true) {
        var e = window.event || e;
        e.returnValue = ("选手尚未全部答题完成，确定离开诗词大会吗？");
    }
    isOpenHandInputer = false;
}

//创建“确定”按钮点击事件绑定函数
function BindNextStep() {
    document.getElementById("next-step").onclick = function () {
        //对当前状态进行判断
        switch (state) {
            case RANDOM_GEN/* 当前选手公示程序 */:
                Clear("body");
                setTimeout(function () {
                    //公示当前答题选手
                    document.getElementById("stage").innerHTML = '<span class = \'num-display\'>第' + nowCompetitor + '位：</span><h1 class = \'name-display\'>' + competitors[nowCompetitor - 1].name + "</h1>";
                    //清除定时器
                    clearInterval(Timer);
                    Timer = null;
                    Display("body");
                    //奏响提示音乐
                    setTimeout(function () {
                        document.getElementById("waitingBGM").pause();
                        document.getElementById("loadBGM").play();
                    }, 250);
                    document.getElementById("next-step").innerHTML = "确定";
                }, 500);
                state = NUM_SHOW;
                break;
            case SUCCEED/* 答题成功 */:
            case NUM_SHOW:
                Clear("body");
                state = ANSWER;
                setTimeout(function () {
                    Answer();
                }, 500);
                //暂停背景音乐
                document.getElementById("waitingBGM").pause();
                break;
            case ANSWER /* 答题结束，进行审阅 */:
                CheckAnswer();
                break;
            case FAILED/* 答题失败 */:
                Failed();
                break;
            case TOTAL/* 总分排名 */:
                Total();
                break;
            case EXIT /* 完成，退出 */:
                //退出全屏
                if (document.getElementsByTagName("html")[0].exitFullscreen) {
                    document.getElementsByTagName("html")[0].exitFullScreen();
                } else if (document.getElementsByTagName("html")[0].mozRequestFullScreen) {
                    document.getElementsByTagName("html")[0].mozRequestFullScreen();
                } else if (document.getElementsByTagName("html")[0].webkitRequestFullscreen) {
                    document.getElementsByTagName("html")[0].webkitRequestFullScreen();
                } else if (document.getElementsByTagName("html")[0].msRequestFullscreen) {
                    document.getElementsByTagName("html")[0].msRequestFullScreen();
                }
                break;
        }
    }
}

//写入答题失败后的展示函数
function Failed() {
    Clear("body");
    //清除定时器，暂停
    clearInterval(Timer);
    document.getElementById("answerBGM").pause();
    Timer = null;
    //将限制时间和题目级别归位
    limitTime = 80;
    nowLevel = 1;
    setTimeout(function () {
        document.getElementById("stage").innerHTML = "<h1 style = 'font-size:46px;color:red;font-weight:bold;'>很遗憾，选手未能答成此题。<h1><h1 class = \'name-display\' style = 'top:90px;'>" +
            competitors[nowCompetitor - 1].name +
            "</h1><h2 style = 'position:absolute;top:360px;font-size:60px;font-weight:bold;left:180px;'>最终得分：" +
            competitors[nowCompetitor - 1].score + "分</h2>";
        Display("body");
        if (nowCompetitor < competitors.length) {
            state = RANDOM_GEN;
            nowCompetitor += 1;
        } else {
            state = TOTAL;
        }
    }, 500)
}

//写入最终成绩排序展示函数
function Total() {
    //清除定时器
    clearInterval(Timer);
    Timer = null;
    Clear("body");
    setTimeout(function () {
        //对每个人的得分进行冒泡排序
        for (i = 0; i < competitors.length - 1; i += 1) {
            for (j = 0; j < competitors.length - 1 - i; j += 1) {
                if (competitors[j].score > competitors[j + 1].score) {
                    var temp = competitors[j];
                    competitors[j] = competitors[j + 1];
                    competitors[j + 1] = temp;
                }
            }
        }
        //打出标题，并依次写出1~7名的得分
        document.getElementById("stage").innerHTML = "<h1 style = 'font-size:80px;margin-top:-40px'>最终排名</h1>";
        document.getElementById("stage").innerHTML += (
            "<li id=\"num-one\" style=\"font-weight:bold;margin-top:60px; font-size:60px;\">第①名：<span class = \"small-note\" style = 'width:660px;font-size:84px;color:red;font-weight:bold;position:relative;bottom:10px;'>" + competitors[6].name + "&nbsp; " + competitors[6].score + "分</span></li>" +
            "<li id=\"num-two\" style=\"font-weight:bold;margin-top:160px; font-size:40px;\">第②名：<span class = \"small-note\" style = 'width:560px;font-size:46px;'>" + competitors[5].name + "&nbsp; " + competitors[5].score + "分</span></li>" +
            "<li id=\"num-three\" style=\"font-weight:bold;margin-top:230px; font-size:40px;\">第③名：<span class = \"small-note\" style = 'width:560px;font-size:46px;'>" + competitors[4].name + "&nbsp; " + competitors[4].score + "分</span></li>" +
            "<li id=\"num-foue\" style=\"font-weight:bold;margin-top:300px; font-size:40px;\">第④名：<span class = \"small-note\" style = 'width:560px;font-size:46px;'>" + competitors[3].name + "&nbsp; " + competitors[3].score + "分</span></li>" +
            "<li id=\"num-five\" style=\"font-weight:bold;margin-top:370px; font-size:40px;\">第⑤名：<span class = \"small-note\" style = 'width:560px;font-size:46px;'>" + competitors[2].name + "&nbsp; " + competitors[2].score + "分</span></li>" +
            "<li id=\"num-six\" style=\"font-weight:bold;margin-top:440px; font-size:40px;\">第⑥名：<span class = \"small-note\" style = 'width:560px;font-size:46px;'>" + competitors[1].name + "&nbsp; " + competitors[1].score + "分</span></li>" +
            "<li id='num-six' style = 'font-weight:bold;margin-top:510px; font-size:40px;'>第⑦名：<span class = \"small-note\" style = 'width:560px;font-size:46px;'>" + competitors[0].name + "&nbsp; " + competitors[0].score + "分</span></li>");
        //切换状态，奏响背景音乐
        state = EXIT;
        document.getElementById("totalBGM").play();
        Display("body");
    }, 500);
}
