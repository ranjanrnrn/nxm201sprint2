const mongoose = require("mongoose")

const connection = mongoose.connect("mongodb+srv://ranjannr:ranjanrn@cluster1.nuiy3k2.mongodb.net/NXM201sprint2?retryWrites=true&w=majority")


module.exports={connection}