var request = require('request');
const crypto = require('crypto-js');
const sui = require("@mysten/sui.js");
const fs = require('fs');
const Ed25519Keypair = sui.Ed25519Keypair
const JsonRpcProvider = sui.JsonRpcProvider
const RawSigner = sui.RawSigner
const TransactionBlock = sui.TransactionBlock
const Connection = sui.Connection

const contractAddress = "0x2c68443db9e8c813b194010c11040a3ce59f47e4eb97a2ec805371505dad7459"
const So = "0x4846a1f1030deffd9dea59016402d832588cf7e0c27b9e4c1a63d2b5e152873a"

const walletKeys = fs.readFileSync('wallets.txt', 'utf-8').split('\n').filter(Boolean);

const connection = new Connection({
  fullnode: 'https://fullnode.mainnet.sui.io',
  faucet: 'https://faucet.testnet.sui.io/gas',
});

function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

async function main() {   
    for(var i =0; i< walletKeys.length; i ++) {
      const key = walletKeys[i]      
      const keypair = Ed25519Keypair.deriveKeypair(key, `m/44'/784'/0'/0'/0'`);
      const provider = new JsonRpcProvider(connection);
      const signer = new RawSigner(keypair, provider);
      console.log(keypair.getPublicKey().toSuiAddress())
      console.log(keypair.export())  
      const tx = new TransactionBlock();
      let a = tx.object(So)
      let d = tx.object("0x6")
      tx.moveCall({
        target: `${contractAddress}::game::claim`,
        arguments: [a, d],
        typeArguments: []
      })
      const result = await signer.signAndExecuteTransactionBlock({ transactionBlock: tx, requestType: "WaitForLocalExecution"});
      console.log({ result }); 
    }
}
async function run(){
  for (;;){ 
    console.log("Sleep")
    await sleep(7202000)
    console.log("Sleep Done")
    await main()
  }
}

run()


  

