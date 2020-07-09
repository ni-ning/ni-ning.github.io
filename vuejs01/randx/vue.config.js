module.exports = {
    devServer:{
        // mock 数据模拟
        before(app, server){
            app.get('/api/v1/post', (req, res)=>{
                res.json({
                    title: 'VueRouter',
                    body: '数据获取的内容'
                })
            })
        }
    }
}