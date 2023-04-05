const express = require("express")
const router = express.Router()
const controller = require("../controllers/currencyExchangeController")


router.get("/",(req,res)=>{
    res.send("Running")
})

router.get("/currency-exchange", controller.exchangeRate)
router.get("/convert" , controller.convertCurrency)

module.exports= router