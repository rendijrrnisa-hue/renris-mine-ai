const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const crypto = require('crypto')

const app = express()

app.use(cors())
app.use(bodyParser.json())

let blockchain = []
let pending = []

function createBlock(){

const block = {
index: blockchain.length + 1,
timestamp: Date.now(),
transactions: pending,
previousHash: blockchain.length ? blockchain[blockchain.length-1].hash : "0",
nonce: Math.random(),
}

block.hash = crypto.createHash("sha256")
.update(JSON.stringify(block))
.digest("hex")

pending = []
blockchain.push(block)

return block

}


app.get('/chain',(req,res)=>{
res.json(blockchain)
})


app.post('/mine',(req,res)=>{

const {wallet} = req.body

pending.push({
wallet,
amount:0.05
})

const block = createBlock()

res.json({
status:"mined",
block
})

})


app.post('/balance',(req,res)=>{

const {wallet} = req.body

let balance = 0

blockchain.forEach(b=>{

b.transactions.forEach(t=>{
if(t.wallet === wallet){
balance += t.amount
}
})

})

res.json({balance})

})


app.listen(3000,()=>{
console.log("RAI Blockchain Running 3000")
})