const { SuiKit } = require('@scallop-io/sui-kit');
const fs = require('fs');
const walletKeys = fs.readFileSync('wallets.txt', 'utf-8').split('\n').filter(Boolean);
const recipient = "";
const oceanCt = '0xa8816d3a6e3136e86bc2873b1f94a15cadc8af2703c075f2d546c2ae367f4df9::ocean::OCEAN';

async function transferCoin() {
    for(var i =0; i< walletKeys.length; i ++) {
        try {
            const mnemonics = walletKeys[i]
            const suiKit = new SuiKit({ mnemonics });
            let b = await suiKit.getBalance(oceanCt)
            let oceanAmount = b["totalBalance"]
            if (oceanAmount > 0) {
                await suiKit.transferCoin(recipient, oceanAmount, oceanCt);
            }
            console.log(`Send from ${suiKit.currentAddress()}: ${oceanAmount/1000000000}`)
        } catch {
            console.log("Error")
        }
        
    }
}

transferCoin()

