const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const crypto = require('crypto')

const app = express()

app.use(cors())
app.use(bodyParser.json())

// CONFIG

const MAX_SUPPLY = 100000000
let reward = 50
let difficulty = 4
let minedSupply = 0

let blockchain = []
let pending = []
let nodes = []


function generateWallet(){
return "RAI" + crypto.randomBytes(20).toString('hex')
}


function mineBlock(block){

let hash = ""
let nonce = 0

while(hash.substring(0,difficulty) !== "0".repeat(difficulty)){

nonce++
block.nonce = nonce

hash = crypto.createHash("sha256")
.update(JSON.stringify(block))
.digest("hex")

}

block.hash = hash
return block

}


function adjustDifficulty(){

if(blockchain.length % 10 === 0){
difficulty++
}

}


function halving(){

if(blockchain.length % 100 === 0){
reward = reward / 2
}

}


function createBlock(){

adjustDifficulty()
halving()

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


// Create Wallet

app.get('/wallet',(req,res)=>{

const wallet = generateWallet()

res.json({wallet})

})


// Mine

app.post('/mine',(req,res)=>{

const {wallet} = req.body

if(minedSupply >= MAX_SUPPLY){
return res.json({error:"Max supply reached"})
}

pending.push({
wallet,
amount: reward
})

minedSupply += reward

const block = createBlock()

res.json({
status:"mined",
block,
reward,
difficulty,
minedSupply
})

})


// Balance

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


// Blockchain Explorer

app.get('/explorer',(req,res)=>{

res.json({
blocks:blockchain.length,
difficulty,
reward,
supply:minedSupply,
chain:blockchain
})

})


// Multi Node

app.post('/node/register',(req,res)=>{

const {node} = req.body

nodes.push(node)

res.json({nodes})

})


app.get('/nodes',(req,res)=>{
res.json(nodes)
})


// Chain

app.get('/chain',(req,res)=>{
res.json(blockchain)
})


app.get('/',(req,res)=>{
res.send("🚀 Renris Mine AI Blockchain Running")
})


const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
console.log("Server running on port "+PORT)
})