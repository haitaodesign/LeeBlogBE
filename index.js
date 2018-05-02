const Koa = require('koa')
const app = new Koa()

app.use(async (ctx,next)=>{
    ctx.response.type='text/html'
    ctx.response.body='<h1>hello koa!</h1>'
})

app.listen(3000,()=>{
    console.log('server is running at http://localhost:3000')
})