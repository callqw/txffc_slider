/**
 * Created by Administrator on 2018/10/21 0021.
 */
var eventproxy = require('eventproxy');  //
var superagent = require('superagent');  //HTTP客户端功能
var async = require('async');   //异步数据控制

var CircularJSON = require('circular-json');
var modules = require('../../modules/index')
var CronJob = require('cron').CronJob;
var oldTxOnlineNumber = null;
var oldTime = 0;
var oldFluctuateNumber = null;
var res = null;
new CronJob('*/1 * * * * *',async function() {
    var date = new Date();
    var minutes = date.getMinutes();
    var second = date.getSeconds();
    // var defaultSecond = [0,5,10,15,20,25,30,35,40,45,50,55]
    var defaultSecond = 3
    // if(defaultSecond.indexOf(second) != -1){
    if(second == defaultSecond){
         res = await crawlingData();
        var clearFun = setInterval(async function () {
            console.log('1秒后执行程序。。。')
            if(res.txOnlineNumber === oldTxOnlineNumber){
                if(oldTime >= 7){
                    console.log('执行完7次，停止执行，保存结果')
                    let response = await modules.spliderAdd.add(res)
                    if(response.loginState =='LOGIN_STATE.SUCCESS'){
                        clearInterval(clearFun)
                        oldTxOnlineNumber = res.txOnlineNumber
                    }else {
                        console.log('数据库错误，再存一次')
                        await modules.spliderAdd.add(res)
                    }
                    oldTime = 0;
                    clearInterval(clearFun);
                    res = null
                }else {
                      res = await crawlingData();
                    if(res.txOnlineNumber === oldTxOnlineNumber){
                        oldTime = oldTime+1;
                        console.log('还相同再执行一次')
                    }else {
                        console.log('不相同可以保存了')
                        let response = await modules.spliderAdd.add(res)
                        if(response.loginState =='LOGIN_STATE.SUCCESS'){
                            clearInterval(clearFun)
                            oldTxOnlineNumber = res.txOnlineNumber
                        }else {
                            console.log('数据库错误，再存一次')
                            await modules.spliderAdd.add(res)
                        }
                    }
                }
            }else {
                console.log('第一次保存中。。。')
                let response = await modules.spliderAdd.add(res)
                if(response.loginState =='LOGIN_STATE.SUCCESS'){
                    clearInterval(clearFun)
                    oldTxOnlineNumber = res.txOnlineNumber
                }else {
                    console.log('数据库错误，再存一次')
                    await modules.spliderAdd.add(res)
                }

            }
        },1000)
    }

}, null, true, 'America/Los_Angeles');
const crawling = async function (ctx, next) {
    var page = ctx.params
    var pageList= ['1','2','3','4','5']
    let indexPage= {};
    indexPage.page = 1;
    if(pageList.indexOf(page.page) == -1){
        page.page = '1'
    }
    var res = await modules.spliderSelect.select(page);
    var indexRes = await modules.spliderSelect.select(indexPage);
    var obj = {
        title:'腾讯开奖号码',
        description: '内容介绍',
        author: 'author',
        keywords: '关键词',
        txOnlineNumber: indexRes.data[0].txOnlineNumber,
        lotteryNumber: indexRes.data[0].lotteryNumber,
        contentData: res,
        tableData: 'tableData'
    }
    await ctx.render('index',obj);
}
var crawlingData = function () {
    let baseUrl = 'https://mma.qq.com/cgi-bin/im/online';
    // let baseUrl = 'http://localhost:3000/api/crawling';
    return new Promise((resolve, reject) => {
        superagent.get(baseUrl).end(async function (err, res) {
            // 常规的错误处理
            if (err) {
                return err;
            }
            var regex1 = /\((.+?)\)/g;
            var reg = /\(|\)/g;
            var str = res.text;
                str =CircularJSON.stringify(str.match(regex1));
                str = str.replace(reg,'')
                str = CircularJSON.parse(str)
                str = CircularJSON.parse(str[0])
            var txOnlineNumber = CircularJSON.stringify(str.c);
            var endFour = txOnlineNumber.substr(txOnlineNumber.length-4)
            var endFive = txOnlineNumber.split('').reduce((x, y) => {
                return Number(x) + Number(y)
            })
            endFive = CircularJSON.stringify(endFive)
            endFive = endFive[endFive.length-1]
            var lotteryNumber = endFive+ endFour;
            if(oldFluctuateNumber !=null){
                var fluctuateNumber = Number(oldFluctuateNumber) - Number(txOnlineNumber) ;

            }else {
                var fluctuateNumber = 'NAN';
            }

            var obj ={
                txOnlineNumber: txOnlineNumber,
                lotteryNumber: lotteryNumber,
                fluctuateNumber: fluctuateNumber,     //波动值
            }
            oldFluctuateNumber = txOnlineNumber
            resolve (obj)

        })
    })
}
module.exports = {crawling: crawling}