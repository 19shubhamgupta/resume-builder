const express = require('express');
const { checkUser } = require('../middlewares/checkUser');
const { generateRoadmap , getUserroadmaps } = require('../controllers/roadmapController');
const roadmapRouter = express.Router();

roadmapRouter.post('/generate', checkUser, generateRoadmap);
roadmapRouter.get('/user-roadmaps' , checkUser , getUserroadmaps)

module.exports = roadmapRouter;