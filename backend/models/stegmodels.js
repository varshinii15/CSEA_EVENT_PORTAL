import mongoose from 'mongoose';
const steg= new mongoose.Schema({
    title:{type:String,required:true,trim:true},
    descp:{type: String ,required:true,trim:true},
    qn:{type: String ,required:true,trim:true},
    ans:{type: String ,required:true,trim:true},
    yr:{type:Number,enum:[1,2]},
    url:{type: String ,required:true,trim:true}
})

const stegqn=mongoose.model('stegqn',steg);
export default stegqn;