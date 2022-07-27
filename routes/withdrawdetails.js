const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Withdrawdetails");
const { body, validationResult } = require("express-validator");

//ROUTE : 1  get all the notes using GET "/api/auth/fetchallnotes" loggin required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });

    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//ROUTE : 2  Add a new note using POST "/api/auth/addnote" loggin required
router.post(
  "/addnote",
  fetchuser,
  [
    body("sender", "Enter a valid Title").isLength({ min: 3 }),
    body("reciever", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { sender, reciever, amount } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
        sender,
        reciever,
        amount,
        user: req.user.id,
      });
      const savednote = await note.save();
      res.json(savednote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);



module.exports = router;
