const axios = require("axios");
const cheerio = require("cheerio");
const exchangeRate = async function (req, res) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const { from, to } = req.query;

    let options1 = {
      method: "GET",
      url: `https://www.xe.com/currencyconverter/convert/?Amount=1&From=${from}&To=${to}`,
      
    };

    let option2 = {
      method: "GET",
      url: `http://www.x-rates.com/calculator/?from=${from}&to=${to}&amount=1`,
    };

    let options3 = {
      method: "GET",
      url: `https://www.calculator.net/currency-calculator.html?eamount=1&efrom=${from}&eto=${to}&type=1&x=70&y=10`,
    };
    
    let result1 = await axios(options1);
    const html = result1.data;
    const $1 = cheerio.load(html);
    const exchangeRate = parseFloat($1('.result__BigRate-sc-1bsijpp-1').text().split(" ")[0].replace(",",""))
   

    let result2 = await axios(option2);
    const $result2 = cheerio.load(result2.data);
    result2 =Number((($result2(".ccOutputRslt").text()).split(" ")[0]).replace(",",""));
 


    let result3 = await axios(options3);
    const $ = cheerio.load(result3.data);
    const result = $(".verybigtext").text();
    const value = parseFloat(result.split(" ")[3].replace(",",""));

    let arr = [
      { exchange_rate: exchangeRate, source: "https://api.apilayer.com" },
      { exchange_rate: result2, source: "http://www.x-rates.com" },
      { exchange_rate: value, source: "https://www.calculator.net" },
    ];
    

    return res.status(200).send({ status: true, data: arr });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

const convertCurrency = async function (req, res) {
  try {
    console.log(req.headers);
    let data = req.headers.data;

    data = JSON.parse(data);

    let { amount } = req.query;

    let currencyRateArr = [];
    for (let i = 0; i < data.length; i++) {
      currencyRateArr.push(data[i].exchange_rate);
    }

    let max = Math.max(...currencyRateArr);
    let min = Math.min(...currencyRateArr);

    let resData = {
      max_value: Math.round(Math.abs(amount * max)*1000)/1000,
      min_value: Math.round(Math.abs(amount * min)*1000)/1000,
    };
    return res.status(200).send({ status: true, data: resData });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  exchangeRate,
  convertCurrency,
};
