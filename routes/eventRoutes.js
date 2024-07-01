const router = require('express').Router();
const eventController = require("../controllers/eventController");


router.get("/get_events", eventController.getEvents)
router.get("/get_event/:id", eventController.getSingleEvent)

router.post('/create_event', eventController.createEvent)
router.put("/update_event/:id", eventController.updateEvent)
router.delete("/delete_event/:id", eventController.deleteEvent)
