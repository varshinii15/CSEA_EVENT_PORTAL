import {Router} from "express";
import authmiddleware from "../middleware/authMiddleware.js";
import{addqn,getallquestion,getqnbyId,updateqn,getstegqnbyyear,stegqnadd,deleteqn,createCrossword} from "../controllers/roundoneController.js"
import { submitAnswer, submitStegAnswer, getAnsweredQuestions, getPlayerScore,submitCrosswordAnswer } from "../controllers/playerController.js";

const router = Router();


router.post('/AddQn',addqn);
router.post('/StegAdd',stegqnadd);
router.post('/crosswords', createCrossword);
router.get('/getallquestion/:yr',authmiddleware.verifyToken,getallquestion);
router.get('/getqn-id/:id',getqnbyId);
router.put('/update-qn/:id',updateqn);
router.get('/get-steg-qn-by-year',authmiddleware.verifyToken,getstegqnbyyear);
router.delete('/delete-qn/:id',deleteqn);


router.post('/player/submit-answer', authmiddleware.verifyToken, submitAnswer);
router.post('/player/submit-steg-answer', authmiddleware.verifyToken, submitStegAnswer);
router.post('/player/submit-crossword-ans', authmiddleware.verifyToken, submitCrosswordAnswer);
router.get('/player/answered-questions', authmiddleware.verifyToken, getAnsweredQuestions);
router.get('/player/score', authmiddleware.verifyToken, getPlayerScore);

export default router;
