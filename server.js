const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const crypto = require('crypto')

const app = express()

app.use(cors())
app.use(bodyParser.json())

let blockchain = []
let pending = []
function mineBlock(block){

let hash = ""
let nonce = 0

while(hash.substring(0,4) !== "0000"){

nonce++

block.nonce = nonce

hash = crypto.createHash("sha256")
.update(JSON.stringify(block))
.digest("hex")

}

block.hash = hash

return block

}
function createBlock(){

const block = {
index: blockchain.length + 1,
timestamp: Date.now(),
transactions: pending,
previousHash: blockchain.length 
? blockchain[blockchain.length-1].hash 
: "0"
}

const minedBlock = mineBlock(block)

pending = []
blockchain.push(minedBlock)

return minedBlock

}
block.hash = 
crypto.createHash("sha256")
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

app.get("/", (req,res)=>{
res.send("Renris Mine AI Running")
})
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
console.log("Server running on port " + PORT)
})