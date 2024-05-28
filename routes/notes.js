const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const fetchuser = require("../Middleware/fetchuser");
const { body, validationResult } = require("express-validator");

//Router get request to get notes from db
//Router1
router.get("/getnotes", fetchuser, async (req, res) => {
  const notes = await Notes.find({ user: req.user.id });
  res.json(notes);
});

//Router post request to add a new node//login reuires
//Router2
router.post(
  "/addnotes",
  fetchuser,
  [body("title").isLength({ min: 5 })],
  [body("descr").isLength({ min: 5 })],

  async (req, res) => {
    try {
      const { title, descr, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const notes = new Notes({
        title,
        descr,
        tag,
        user: req.user.id,
      });
      const savenote = await notes.save();

      res.json(savenote);
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: "Internal server error", message: err.message });
    }
  }
);

//Router post request to add a new node//login reuires
//Router3

router.post("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, descr, tag } = req.body;
  const newnote = {};
  //creating an ew note
  if (title) {
    newnote.title = title;
  }
  if (descr) {
    newnote.descr = descr;
  }
  if (tag) {
    newnote.tag = tag;
  }
  //find the note to be updated
  try {
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("not found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newnote },
      { new: true }
    );
    res.json({ note });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
});

//Router post request to delete a note using delete//login reuires
//Router3

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  //find the note to be updated
  try {
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("not found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ success: "note has been deleted", note: note });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
});

module.exports = router;
