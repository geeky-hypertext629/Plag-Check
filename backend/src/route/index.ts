import express from "express";
import Middleware from "../middleware";
import PlagirismController from '../controller/plagiarism.controller';
import MatchController from '../controller/match.controller';
import AiDetectController from '../controller/aidetect.controller';

const router=express.Router();

router.route('/plag-detect').post(Middleware.checkCredit,Middleware.extractContent, PlagirismController.submitContent).get();
router.route('/ai-content').post(Middleware.extractContent, AiDetectController.submitContent).get();
router.route('/match-content').post(Middleware.extractContent, MatchController.submitContent).get();

export {router as plagRouter};
