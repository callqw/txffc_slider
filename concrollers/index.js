/**
 * Created by Administrator on 2018/10/19.
 */

//爬虫
const crawling = require('./splider/crawling')
const crawlingSelect = require('./splider/select')

module.exports = {
    crawling: crawling,
    crawlingSelect: crawlingSelect
}