/**
 * Created by Administrator on 2018/10/23.
 */
const modules = require('../../modules');
const select = async function (ctx, next) {
    let indexPage= {};
    indexPage.page = 1;
    var indexRes = await modules.spliderSelect.select(indexPage);
    var obj = {
        title:'腾讯开奖号码',
        description: '内容介绍',
        author: 'author',
        keywords: '关键词',
        txOnlineNumber: indexRes.data[0].txOnlineNumber,
        lotteryNumber: indexRes.data[0].lotteryNumber,
        contentData: indexRes,
        tableData: null,
    }
    await ctx.render('index',obj);
}
module.exports= {
        select: select
}