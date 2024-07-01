const cloudinary = require("cloudinary");

const createEvent = async (req, res) => {
    // step 1 : check incomming data
    console.log(req.body);
    console.log(req.files);

    // step 2 : Destructuring data
    const { eventName, organizer, volunteer,location,eventTime, eventDetails} =
        req.body;
    const { eventImage } = req.files;

    // step 3 : Validate data
    if (
        !eventName ||
        !organizer ||
        !volunteer ||
        !location ||
        !eventTime ||
        !eventDetails||
        !eventImage
    ) {
        return res.json({
            success: false,
            message: "Please fill all the fields",
        });
    }

    try {
        // upload image to cloudinary
        const uploadedImage = await cloudinary.v2.uploader.upload(
            eventImage.path,
            {
                folder: "events",
                crop: "scale",
            }
        );

        // Save to database
        const newEvent = new Events({
            eventName: eventName,
            organizer: organizer,
            volunteer: volunteer,
            location: location,
            eventTime: eventTime,
            eventDetails: eventDetails,
            eventImageUrl: uploadedImage.secure_url,

        });
        await newEvent.save();
        res.json({
            success: true,
            message: "Event created successfully",
            event: newEvent,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// get all events
const getEvents = async (req, res) => {
    try {
        const allEvents = await Events.find({});
        res.json({
            success: true,
            message: "All event fetched successfully!",
            events: allEvents,
        });
    } catch (error) {
        console.log(error);
        res.send("Internal server error");
    }
};
//fetch single event
const getSingleEvent = async (req, res) => {
    const eventId = req.params.id;
    try {
        const singleEvent = await Events.findById(eventId);
        res.json({
            success: true,
            message: true,
            event: singleEvent,
        });
    } catch (error) {
        console.log(error);
        res.send("Internal Server Error");
    }
};

//update event
const updateEvent = async (req, res) => {
    console.log(req.body);
    console.log(req.files);

    //destructuring data
    const { eventName, organizer, volunteer, location, eventTime, eventDetails} =
        req.body;
    const { eventImage } = req.files;

    //validate data
    if (
        !eventName ||
        !organizer ||
        !volunteer ||
        !location ||
        !eventTime ||
        !eventDetails 
    ) {
        return res.json({
            success: false,
            message: "Required fields are missing.",
        });
    }

    try {
        // case 1: if there is image
        if (eventImage) {
            //Upload image to cloudinary
            const uploadedImage = await cloudinary.v2.uploader.upload(
                eventImage.path,
                {
                    folder: "Events",
                    crop: "scale",
                }
            );
            //Make updated json data
            const updatedData = {
                eventName: eventName,
                organizer: organizer,
                volunteer: volunteer,
                location: location,
                eventTime: eventTime,
                eventDetails: eventDetails,
                eventImageUrl: uploadedImage.secure_url,
            };
            //find event  and update
            const eventId = req.params.id;
            await Events.findByIdAndUpdate(eventId, updatedData);
            res.json({
                success: true,
                message: "Event Updated successfully with image.",
                updateEvent: updatedData,
            });
        } else {
            //update wthout image.
            const updatedData = {
                eventName: eventName,
                organizer: organizer,
                volunteer: volunteer,
                location: location,
                eventTime: eventTime,
                eventDetails: eventDetails,
            };
            //find event and update
            const eventId = req.params.id;
            await Events.findByIdAndUpdate(eventId, updatedData);
            res.json({
                success: true,
                message: "Event Updated successfully without image.",
                updateEvent: updatedData,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error ",
        });
    }
};
//delete event
const deleteEvent = async (req, res) => {
    const eventId = req.params.id;

    try {
        await Events.findByIdAndDelete(eventId);
        res.json({
            success: true,
            message: "Event deleted successfully",
        });
    } catch (error) {
        res.json({
            success: false,
            message: "Invalid",
        });
    }
};






// const getPagination = async (req, res) => {
//     // Step 1: Get the page user requested, default to 1 if not provided
//     const requestedPage = parseInt(req.query.page, 10) || 1;
//     // Step 2: Result per page
//     const resultPerPage = 2;

//     try {
//         // Step 3: Count total number of products
//         const totalProducts = await Products.countDocuments();
//         // Step 4: Fetch paginated products
//         const products = await Products.find({})
//             .skip((requestedPage - 1) * resultPerPage)
//             .limit(resultPerPage)
//             .sort({ createdAt: -1 })
//             .populate("category", "name");
//         if (products.length === 0) {
//             return res.json({
//                 success: false,
//                 message: "No products found!",
//             });
//         }

//         res.json({
//             success: true,
//             products: products,
//             currentPage: requestedPage,
//             totalPages: Math.ceil(totalProducts / resultPerPage),
//             totalProducts: totalProducts,
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Error occurred in pagination");
//     }
// };

module.exports = {
    createEvent,
    getEvents,
    getSingleEvent,
    updateEvent,
    deleteEvent,

    // getPagination

};
