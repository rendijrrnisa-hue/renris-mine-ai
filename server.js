const express = require("express")
const fs = require("fs")

const app = express()

let balances = {}
let history = []
let blockchain = []

function save(){

fs.writeFileSync("data.json",
JSON.stringify({
balances,
history,
blockchain
})
)

}

function load(){

if(fs.existsSync("data.json")){

let data = JSON.parse(
fs.readFileSync("data.json")
)

balances = data.balances || {}
history = data.history || []
blockchain = data.blockchain || []

}

}

load()

function createBlock(data){

blockchain.push({
time:Date.now(),
data:data
})

}

app.get("/mine/:wallet",(req,res)=>{

let w = req.params.wallet

if(!balances[w]) balances[w]=0

balances[w]+=0.001

history.push({
wallet:w,
type:"mine",
amount:0.001
})

createBlock({
wallet:w,
reward:0.001
})

save()

res.json({status:"mined"})

})

app.get("/balance/:wallet",(req,res)=>{

let w = req.params.wallet

res.json({
balance:balances[w] || 0
})

})

app.get("/send/:from/:to/:amount",(req,res)=>{

let from = req.params.from
let to = req.params.to
let amount = parseFloat(req.params.amount)

if(!balances[from]) balances[from]=0
if(!balances[to]) balances[to]=0

balances[from]-=amount
balances[to]+=amount

history.push({
from,
to,
amount,
type:"send"
})

save()

res.json({status:"sent"})

})

app.get("/history/:wallet",(req,res)=>{

let w = req.params.wallet

let h = history.filter(x=>x.wallet==w || x.from==w || x.to==w)

res.json(h)

})

app.listen(3000,()=>{

console.log("Renris Blockchain Active")

})