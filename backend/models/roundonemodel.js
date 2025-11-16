import mongoose from 'mongoose';
const qnsans=new mongoose.Schema({
    title:{type: String ,required:true,trim:true},
    descp:{type: String ,required:true,trim:true},
    qn:{type: String ,required:true,trim:true},
    ans:{type: String ,required:true,trim:true},
    type:{type:String,enum:['riddle','quiz','unscrambled','binary']},
    yr:{type:Number,enum:[1,2]}
})



const crossword = new mongoose.Schema({
  answers: {
    across: {
      type: Map,
      of: String,
      required: true
    },
    down: {
      type: Map,
      of: String,
      required: true
    }
  },
  yr: {
    type: Number,enum: [1,2]
  }
})


export const Crossword = mongoose.model('Crossword', crossword, 'crosswords');

const roundone=mongoose.model('roundone',qnsans);
export default roundone;