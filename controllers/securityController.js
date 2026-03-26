const User=require("../models/User")
const BotLog=require("../models/BotLog")

const detectBotBehavior=require("../utils/botDetector")
const detectWalletFraud=require("../utils/walletFraudDetector")

exports.checkBot=async(req,res)=>{

 const {actions}=req.body

 const isBot=detectBotBehavior(actions)

 if(isBot){

  const user=await User.findById(req.user.id)

  user.fraudFlags.push("bot_activity")

  user.riskScore+=40

  await user.save()

  await BotLog.create({

   userId:user._id,
   reason:"bot_activity"

  })

 }

 res.json({botDetected:isBot})

}



exports.checkWalletFraud=async(req,res)=>{

 const fraud=await detectWalletFraud(req.user.id)

 if(fraud){

  const user=await User.findById(req.user.id)

  user.fraudFlags.push("wallet_laundering")

  user.riskScore+=50

  await user.save()

 }

 res.json({walletFraud:fraud})

}