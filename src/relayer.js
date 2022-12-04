const Web3 = require('web3');
require('dotenv').config({path:'.env'})
const abiDecoder = require('abi-decoder');
const proofs = require('../src/proof.js').proofs;

const web3 = new Web3(process.env.RPC_URL);
const verifierABI = require('./abi/verifier_abi.json')
abiDecoder.addABI(verifierABI);

const timer = ms => new Promise(res => setTimeout(res, ms))

export async function cli(){
    console.log("RPC_URL" , process.env.RPC_URL)
    var VerifierContract = await new web3.eth.Contract(verifierABI, process.env.CONTRACT_ADDR );
    var networkId =  await web3.eth.net.getId();
    var account = web3.eth.accounts.privateKeyToAccount(process.env.PRIV_KEY);

    var i = 0;

    while (true){

        await timer(10000)
        console.log("Checking for new proofs...")
        console.log("Sending New proofs...")

        var proof = proofs[i%2];
        var tx = VerifierContract.methods.addEpoch(proof.callData[0],proof.callData[1],proof.callData[2],proof.callData[3]);
        var gas = await tx.estimateGas({from: account})
        var gasPrice = await web3.eth.getGasPrice();
        var data = tx.encodeABI();
        var nonce = await web3.eth.getTransactionCount(account);
        
    
        var signedTx = await web3.eth.accounts.signTransaction(
            {
                to : process.env.CONTRACT_ADDR,
                data,
                gas,
                gasPrice,
                nonce,
                chainId:networkId
            }, process.env.PRIV_KEY
        );

        var receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        console.log("Epoch Sent", receipt.transactionHash)
    }

    
}

