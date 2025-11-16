import Questions,{Crossword} from "../models/roundonemodel.js"
import steg from "../models/stegmodels.js"

export const addqn=async(req,res)=>{
    try{
        const {title,descp,qn,ans,type,yr}=req.body;
        if (!title || !descp || !qn || !ans || !type || !yr) {
        return res.status(400).json({
            "success": false,
            "message": 'Mising fields in request',
        });
        }
        const newqn=new Questions({title,descp,qn,ans,type,yr});
        const existingqn=await Questions.findOne({
            $or:[{title},{qn}]
        });
        if(existingqn){
            return res.status(409).json({
                "success":false,
                "message":"Already Exist"
            });
        }
        const savedqn=await newqn.save();
        res.status(201).json({
            "success": true,
            "message": "Question added successfully",
            "data": {
                _id: savedqn._id,
                title: savedqn.title,
                descp: savedqn.descp,
                qn: savedqn.qn,
                ans: savedqn.ans,
                type: savedqn.type,
                yr: savedqn.yr
            },
        });
    }
    catch(error){
        res.status(500).json({
            "success":false,
            "message":'internal server error',
        });
    }
};
export const stegqnadd=async(req,res)=>{
    try{
        const {title,descp,qn,ans,type,yr,url}=req.body;
        if (!title || !descp || !qn || !ans || !type || !yr || !url) {
        return res.status(400).json({
            "success": false,
            "message": 'Mising fields in request',
        });
        }
        const newqn=new steg({title,descp,qn,ans,type,yr,url});
        const savedqn= await newqn.save();
        res.status(200).json({
            "success":true,
            "message":"Question added successfully",
            "data":{
                _id:savedqn._id,
                title: savedqn.title,
                descp: savedqn.descp,
                qn: savedqn.qn,
                ans: savedqn.ans,
                type: savedqn.type,
                yr: savedqn.yr,
                url:savedqn.url
            },
        })
    }
    catch(error){
        res.status(500).json({
            "success":false,
            "message": "internal server error"
        })
    }
}
export const getstegqnbyyear=async(req,res)=>{
    try{
        const {yr}=req.query;

        
        if(!yr){
            return res.status(400).json({
                "success":false,
                "message":"Please provide a year",
            });
        }
        const filter={yr:yr};
        const questions=await steg.find(filter);
        if(questions.length==0){
            return res.status(404).json({
                "success":false,
                "message":"No question given for the provided year"
            })
        }
        res.status(200).json({
            "success":true,
            "count":questions.length,
            "data":questions,
        });
    }
    catch(error){
        res.status(500).json({
            "success": false,
            "message":"internal server error"
        });
    }
}
// ...existing code...
export const getallquestion = async (req, res) => {
    try {
        const { yr } = req.params;
        if (!yr) {
            return res.status(400).json({
                success: false,
                message: "Please provide a year",
            });
        }

        const parsedYr = Number(yr);
        const filter = Number.isNaN(parsedYr) ? { yr } : { yr: parsedYr };

        // support crosswords that may use either `yr` or `year` field
        const crosswordFilter = filter;
        const [questions, stegQuestions, crosswords] = await Promise.all([
            Questions.find(filter),
            steg.find(filter),
            Crossword.find(crosswordFilter)
        ]);

        const combined = [
          ...questions.map((q, index) => ({
            _id: q._id,
            id: index + 1,
            title: q.title,
            description: q.descp,
            challenge: q.qn,
            answer: q.ans,
            type: q.type,
            hint: q.hint || null,
            yr: q.yr,
            source: "roundone"
          })),

          ...stegQuestions.map((s, index) => ({
            _id: s._id,
            id: questions.length + index + 1,
            title: s.title,
            description: s.descp,
            challenge: s.qn,
            answer: s.ans,
            type: s.type,
            hint: s.hint || null,
            url: s.url || null,
            yr: s.yr,
            source: "steg"
          })),

          ...crosswords.map((c, index) => ({
            _id: c._id,
            id: questions.length + stegQuestions.length + index + 1,
            title: c.title || `Crossword ${index + 1}`,
            description: c.description || null,
            // Only expose structure, not answers
           challenge: {
              across: Object.keys(c.answers?.across || {}),
              down: Object.keys(c.answers?.down || {})
            },
            answer: null,  // Never expose answers
            source: "crossword"
          }))
        ];

        if (combined.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No question given for the provided year"
            });
        }

        res.status(200).json({
            success: true,
            count: combined.length,
            counts: { roundone: questions.length, steg: stegQuestions.length, crossword: crosswords.length },
            data: combined,
        });
    }  catch (error) {
    console.error("GET ALL QUESTION ERROR:", error);
    res.status(500).json({
        success: false,
        message: error.message,
    });
}
}
// ...existing code...
export const getqnbyId=async(req,res)=>{
    try{
        const filter={};
        
        const{id}=req.params;
        const questions=await Questions.findById(id);
        if(!questions){
            return res.status(404).json({
                "success":false,
                "message":"Question not found"
            })
        }
        res.status(200).json({
            "success":true,
            "data":questions
        });
    }
    catch(error){
        res.status(500).json({
            "success":false,
            "message":"internal server error"
        });
    }
}
export const updateqn =async(req,res)=>{
    try{
        const {id}=req.params;
        const {title,descp,qn,ans,type,yr}=req.body;
        const existingqn=await Questions.findOne({
            $or:[{title},{qn}], _id: { $ne: id }
        });
        if(existingqn){
            return res.status(409).json({
                "success":false,
                "message":"Already Exist"
            });
        }
        const updatedqn= await Questions.findByIdAndUpdate(
            id,
            {title,descp,qn,ans,type,yr},
            {new:true,runValidators: true}
        )
        if(!updatedqn){
            return res.status(404).json({success:false,message:"Invalid update fields or data"});
        }
        res.status(200).json({success:true,message:"question updated successfully",data:updatedqn});
    }
    catch(error){
        res.status(500).json({success:false,message:error.message});
    }
}

// ...existing code...
// ...existing code...
import mongoose from "mongoose";
// ...existing code...

export const deleteqn = async (req, res) => {
    try {
        let { id } = req.params;
        if (!id) return res.status(400).json({ success: false, message: "Missing id param" });

        id = id.trim();
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid id format" });
        }

        // Try roundone collection first
        const existing = await Questions.findById(id);
        if (existing) {
            const deleted = await Questions.findByIdAndDelete(id);
            return res.status(200).json({ success: true, message: "Question deleted from roundone", data: deleted });
        }

        // Try steg collection next
        const existingSteg = await steg.findById(id);
        if (existingSteg) {
            const deleted = await steg.findByIdAndDelete(id);
            return res.status(200).json({ success: true, message: "Question deleted from steg", data: deleted });
        }

        return res.status(404).json({ success: false, message: "Question not found in roundone or steg" });
    } catch (error) {
        console.error("deleteqn error:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: "Invalid id format" });
        }
        return res.status(500).json({ success: false, message: "internal server error" });
    }
}
// ...existing code...

export const createCrossword = async (req, res) => {
  try {
    const { answers, year } = req.body;
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ success: false, message: 'answers object required' });
    }
    if (answers.across == null || answers.down == null) {
      return res.status(400).json({ success: false, message: 'answers.across and answers.down required' });
    }
    const y = Number(year);
    if (Number.isNaN(y)) return res.status(400).json({ success: false, message: 'valid year required' });

    // Mongoose Map accepts plain objects for storage
    const created = await Crossword.create({ answers, yr: y });
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

