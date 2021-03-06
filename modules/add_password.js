
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/pms',{useNewUrlParser: true , useCreateIndex: true,});
var conn = mongoose.Collection;
var passSchema = new mongoose.Schema({

    project_name: {
        type : String, 
        required: true,
        
    },


    password_category: {
        type : String, 
        required: true,
        
    },

    password_details: {
        type : String, 
        required: true,
        
    },
   
    date: {
        type: Date,
        default: Date.now 
    }
});



var passModel = mongoose.model('password_details', passSchema);
module.exports=passModel;

