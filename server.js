const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("."))

let blockchain = []

app.get("/balance/:wallet",(req,res)=>{

let wallet = req.params.wallet

let balance = blockchain
.filter(tx=>tx.wallet==wallet)
.reduce((a,b)=>a+b.amount,0)

res.json({balance})

})

app.post("/withdraw",(req,res)=>{

let data = req.body

blockchain.push({
wallet:data.wallet,
amount:-data.amount,
time:Date.now()
})

res.json({
status:"success"
})

})

app.get("/mine",(req,res)=>{

let wallet = req.query.wallet

blockchain.push({
wallet:wallet,
amount:0.05,
time:Date.now()
})

res.json({
status:"mined"
})

})

app.listen(3000,()=>{

console.log("Renris Blockchain Running")

})
