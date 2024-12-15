const { addMessage, getMessages } = require("../controllers/messagesController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);

console.log(process.env.PORT);


module.exports = router;
