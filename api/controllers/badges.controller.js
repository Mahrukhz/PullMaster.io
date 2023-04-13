const Badge = require("../models/badges.model");
var fs = require('fs');
let path = require('path');


const getAll = async (req, res) => {
    try {
      console.log("getAll called");
        const badges = await Badge.find().sort({ value: 1 });
        console.log(badges);
        res.status(200).json(badges);
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};

const getAllNames = async (req, res) => {
  try {
      const user = await Badge.find({img:0}).sort({ value: 1 } );
      res.status(200).json(user);
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
};


// Delete a reward
const deleteBadge = async (req, res) => {
    try {
      const badge = await Badge.findById(req.params.id);
      if (!badge) {
        return res.status(404).json({ message: "Badge with that ID not found" });
      }
  
      await badge.remove();
  
      res.status(200).json({ message: "Badge deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Create a badge
const createBadge = async (req, res) => {
  try {
    let npath = path.join(__dirname + '/..');
    let badge = new Badge({
        name: req.body.name,
        value: req.body.value,
        img: {
            data: fs.readFileSync(path.join(npath + '/images/' + req.file.filename)),
            contentType: 'image/png'
        }
    });
    await badge.save();
    fs.unlinkSync(path.join(npath + '/images/' + req.file.filename));
    res.status(201).json(badge);
}
catch (error) {
  console.log(error);
    res.status(500).json({ message: error.message });
}
};

// Get a reward by ID
const getBadgesById = async (req, res) => {
  try {
    const badge = await Badge.findById(req.params.id);
    if (!badge) {
      return res
        .status(404)
        .json({ message: "Badge with that ID was not found" });
    }
    res.status(200).json(badge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a reward
const updateBadge = async (req, res) => {
  try {
    const badge = await Badge.findById(req.params.id);
    if (!badge) {
      return res.status(404).json({ message: "Badge with that ID not found" });
    }

    badge.name = req.body.badgeName;
    badge.value = req.body.starsRequired;
    await badge.save();

    res.status(200).json(badge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a reward
const updateBadgeImage = async (req, res) => {
  try {
        const badge = await Badge.findById(req.params.id);
    if (!badge) {
      return res.status(404).json({ message: "Badge with that ID not found" });
    }
    let npath = path.join(__dirname + '/..');
    badge.name = req.body.name;
    badge.value = req.body.value,
    badge.img = {
      data: fs.readFileSync(path.join(npath + '/images/' + req.file.filename)),
      contentType: 'image/png'
    }

    await badge.save();
    fs.unlinkSync(path.join(npath + '/images/' + req.file.filename));
    res.status(201).json(badge);
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } 
};




module.exports = {
    getAll, deleteBadge, createBadge,getBadgesById, updateBadge,getAllNames, updateBadgeImage
};
