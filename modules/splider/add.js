/**
 * Created by Administrator on 2018/10/19.
 */
const db = require('../db').config
var moment = require('moment');
const add = function (obj) {
    return new Promise((resolve,reject)=> {
    var createTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    var date = new Date()
    var hours = date.getHours()
    var minutes = date.getMinutes()
    var lotteryNum = (Number(hours)*60 + Number(minutes))
        if(lotteryNum < 10){
            lotteryNum = '000'+lotteryNum
        } else if(lotteryNum < 100){
        lotteryNum = '00'+lotteryNum
    } else if(lotteryNum < 1000){
        lotteryNum = '0'+lotteryNum
    }
    var lotteryDate = moment(Date.now()).format('YYYY-MM-DD')+ lotteryNum
    lotteryDate = lotteryDate.replace('-', '')
    lotteryDate = lotteryDate.replace('-', '')
    db.query('INSERT INTO `lotterydata` (`txOnlineNumber`, `lotteryNumber`, `fluctuateNumber`, `lotteryDate`, `createTime`) VALUES ("'+obj.txOnlineNumber+'", "'+obj.lotteryNumber+'", "'+obj.fluctuateNumber+'", "'+lotteryDate+'", "'+createTime+'")',
        function (err, result) {
        if (err) throw err;
        resolve({
            loginState: 'LOGIN_STATE.SUCCESS',
            msg: '新增成功'
        });
    });
    });
}
module.exports = {
    add: add
}