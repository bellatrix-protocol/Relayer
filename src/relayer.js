const Web3 = require('web3');
require('dotenv').config({path:'.env'})

const web3 = new Web3(process.env.RPC_URL);

const timer = ms => new Promise(res => setTimeout(res, ms))

export async function cli(){
    console.log("RPC_URL" , process.env.RPC_URL)

    
}

