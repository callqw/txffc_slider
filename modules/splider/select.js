/**
 * Created by Administrator on 2018/10/19.
 */
const db = require('../db').config
const moment = require('moment')
const createTime = moment().format('YYYY-MM-DD HH:mm:ss')
const lastVisiteTime = moment().format('YYYY-MM-DD HH:mm:ss')
const random = require('../../random')
var CircularJSON = require('circular-json');
const select = function (obj) {

    return new Promise((resolve,reject)=> {
        var from = (Number(obj.page) -1)* 15,to = 15;
        db.query('SELECT * FROM `lotterydata` ORDER BY ID DESC LIMIT '+from+','+to+'',async function (err, result) {
            if (err) throw err;
            for(var i=0; i<result.length; i++) {
                result[i].createTime = moment(result[i].createTime).format('YYYY-MM-DD HH:mm:ss')
            }
            resolve({
                loginState: 'LOGIN_STATE.SUCCESS',
                data: result
            });
        });
    })
}
module.exports = {
    select: select
}