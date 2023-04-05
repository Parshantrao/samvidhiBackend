const axios = require("axios");
const cheerio = require("cheerio");
const exchangeRate = async function (req, res) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const { from, to } = req.query;

    let options1 = {
      method: "GET",
      url: `https://api.apilayer.com/currency_data/convert?to=${to}&from=${from}&amount=1`,
      headers: { apikey: "XAo4TQmi9PvOeDLwMrFJknHHFH69eUhy" },
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
    result1 = result1.data.result;

    let result2 = await axios(option2);
    const $result2 = cheerio.load(result2.data);
    result2 = parseFloat($result2(".ccOutputRslt").text());

    let result3 = await axios(options3);

    const $ = cheerio.load(result3.data);
    const result = $(".verybigtext").text();
    const value = parseFloat(result.split(" ")[3]);

    let arr = [
      { exchange_rate: result1, source: "https://api.apilayer.com" },
      { exchange_rate: result2, source: "http://www.x-rates.com" },
      { exchange_rate: value, source: "https://www.calculator.net" },
    ];
    console.log(arr);

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
      max_value: Math.abs(amount * max),
      min_value: Math.abs(amount * min),
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
