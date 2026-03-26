const Device=require("../models/Device")
const User=require("../models/User")
const FraudLog=require("../models/FraudLog")

const calculateRisk=require("../utils/riskScore")

exports.trackDevice=async(req,res)=>{

 const {fingerprint}=req.body

 const ip=req.ip

 const existing=await Device.find({fingerprint})

 if(existing.length>3){

 const user=await User.findById(req.user.id)

 user.fraudFlags.push("duplicate_device")

 const risk=calculateRisk(user.fraudFlags)

 user.riskScore=risk

 await user.save()

 await FraudLog.create({
  userId:user._id,
  reason:"duplicate_device",
  riskScore:risk
 })

 }

 await Device.create({

  userId:req.user.id,
  fingerprint,
  ip,
  userAgent:req.headers["user-agent"]

 })

 res.json({success:true})

}