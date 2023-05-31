const Video = require('../models/video');
const path = require('node:path');
const fs = require('node:fs');

//CREATE POST
const createNewPost = async (req, res) => { 
  try {
    req.body.videoURL = req.file.path;;

    // Create a new Video document with the thumbnail URL
    const newVideo = new Video({...req.body});

    // Save the video to the database
    await newVideo.save();

    res.status(201).json({ message: 'Video uploaded successfully' });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
}

// GET POST
const getPostByUsername = async (req, res) => {
  const decodedUsername = decodeURIComponent(req.params.username);
    try {
      const video = await Video.find({ username: new RegExp(decodedUsername, 'i') });
      res.status(200).json(video);
    } catch (err) {
      res.status(500).json(err);
    }
}  

const getVideoForStream = async (req, res) => {
  try {
    const videoPath = path.join(__dirname, '..', 'uploads', req.params.filename);
    if (fs.existsSync(videoPath)) {
      // Set the appropriate Content-Type header for the video file
      res.setHeader('Content-Type', 'video/mp4');

      // Stream the video file to the response
      const readStream = fs.createReadStream(videoPath);
      readStream.pipe(res);
    } else {
      res.status(404).json({ error: 'Video not found' });
    }
  } catch (error) {
    console.error('Error streaming video:', error);
    res.status(500).json({ error: 'Failed to stream video' });
  }
};

// Get single post
const getSinglePost = async (req, res) =>{
  const id = req.params.id;
  try{
    const video = await Video.findOne({_id: id});
    res.status(200).json(video);
  }catch(error){
    res.status(500).json({error: 'Failed to fetch the post'});
  }
}

// Get all posts

const getAllPost = async (req, res) => {
    try {
      const allVideo = await Video.find({});
      res.status(200).json(allVideo);
    } catch (err) {
      res.status(500).json(err);
    }
}

module.exports = {createNewPost, getAllPost, getPostByUsername, getVideoForStream, getSinglePost};
