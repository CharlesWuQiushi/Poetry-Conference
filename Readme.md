# **成外附小诗词大会小程序**<br/>
这是由 @author **六·14班 Charles·吴秋实** 制作的 成外附小**诗词大会小程序**。<br/><br/>
本程序可随机抽取规定题库中的题目，随机排序选手名单上的选手，并规定80~160秒时间，进行诗词大会答题。<br/>
答题正确，进入下一道题；答题错误，累计得分，并进入下一位选手的答题。<br/>
全部选手答题完成，根据总分排名。<br/>

*@version 1.0* 已在 六·14班班级复赛 初步使用并进行优化。<br/>
@package *Poetry Conference Activity Program in Primary School Attached to Chengdu Foreign Language School*<br/>

**起始版本：**<br/>
*@since 1.0*<br/>
**当前版本：**<br/>
*@version 1.2.1*<br/>

*@version 1.2* **更新内容**:<br/>
  · 修复@version 1.1 中出现的**计时器**无法正常运行、严重跳码的问题。已使用*绝对时间*进行标记与判断。<br/>
  · 增加**误判机制**，当题库中录入答案错误时，可手动纠正并加入对应得分。<br/>
  · 按**阶梯制度**（5分、10分、15分）**加分**，而并非以前的一律5分制。<br/>
  · 增加结束时**背景音乐**。<br/>
  · **美化**答题界面。<br/>
*@version 1.2.1* **更新内容**:<br/>
  · 在显示诗词出处时增加**关闭按钮**，以防止遮挡答题内容。灵活性更强。<br/>
  · 对一些W3C**衍生标准**的浏览器增加了*全屏/关闭全屏请求*的支持。<br/>

*@license MIT @public*<br/>
**@copyright © 2019 Charles 吴秋实. All rights reserved.**<br/>

### **注意！** 在使用以前，请参阅[手写板安装引导文件](./Handinput/Readme.md)。