module.exports = {
    devServer:{
        // mock 数据模拟
        before(app, server){
            app.get('/api/v1/cart-list', (req, res)=>{
                res.json({
                    code: 0,
                    msg: "成功",
                    result: {
                        cart_list: [
                            {id: 1, title: "Vue实战开发", price: 100.00, active:true, count:1},
                            {id: 2, title: "React实战开发", price: 200.00, active:true, count:1},
                            {id: 3, title: "Python实战开发", price: 300.00, active:true, count:1} 
                        ]
                    }
                })
            })
        }
    }
}