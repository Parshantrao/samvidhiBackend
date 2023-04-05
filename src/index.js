const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const app = express()
const route=require("./routes/route")
app.use(express.json())
app.use(cors({
    origin: '*'
}));
// mongoose.connect(
//     "mongodb+srv://Parshant_rao:C4fIOvHGi74DVINv@newcluster.squkrr6.mongodb.net/project1"
// )
// .then(()=>{console.log("MongoDB is Connected")})
// .catch(err=>console.log(err))

app.use(route)
if(process.env.NODE_ENV == "production"){
    app.use(express.static("frontend/build"))
}
app.listen(process.env.PORT || 3000,function(){
    console.log("App is running on PORT" +process.env.PORT || 3000 )
})

