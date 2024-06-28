const cloudinary = require("cloudinary");
const Donations = require("../model/donationModel")

const createDonation = async (req, res) => {
    // step 1 : check incomming data
    console.log(req.body);
    console.log(req.files);

    // step 2 : Destructuring data  
    const { donationName, donor, totalDonor, time, target, percentage, donationDetails } =
        req.body;
    const { donationImage } = req.files;

    // step 3 : Validate data
    if (
        !donationName ||
        !donor ||
        !totalDonor ||
        !time ||
        !target ||
        !percentage ||
        !donationDetails ||
        !donationImage
    ) {
        return res.json({
            success: false,
            message: "Please fill all the fields",
        });
    }

    try {
        // upload image to cloudinary
        const uploadedImage = await cloudinary.v2.uploader.upload(
            donationImage.path,
            {
                folder: "donations",
                crop: "scale",
            }
        );

        // Save to database
        const newDonation = new Donations({
            donationName: donationName,
            donor: donor,
            totalDonor: totalDonor,
            time: time,
            target: target,
            percentage: percentage,
            donationDetails: donationDetails,
            donationImageUrl: uploadedImage.secure_url,

        });
        await newDonation.save();
        res.json({
            success: true,
            message: "Donation created successfully",
            donation: newDonation,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// get all donations
const getDonations = async (req, res) => {
    try {
        const allDonations = await Donations.find({});
        res.json({
            success: true,
            message: "All donation fetched successfully!",
            donations: allDonations,
        });
    } catch (error) {
        console.log(error);
        res.send("Internal server error");
    }
};
//fetch single donation
const getSingleDonation = async (req, res) => {
    const donationId = req.params.id;
    try {
        const singleDonation = await Donations.findById(donationId);
        res.json({
            success: true,
            message: true,
            donation: singleDonation,
        });
    } catch (error) {
        console.log(error);
        res.send("Internal Server Error");
    }
};

//update donation
const updateDonation = async (req, res) => {
    console.log(req.body);
    console.log(req.files);

    //destructuring data
    const { donationName, donor, totalDonor, time, target, percentage, donationDetails } =
        req.body;
    const { donationImage } = req.files;

    //validate data
    if (
        !donationName ||
        !donor ||
        !totalDonor ||
        !time ||
        !target ||
        !percentage ||
        !donationDetails
    ) {
        return res.json({
            success: false,
            message: "Required fields are missing.",
        });
    }

    try {
        // case 1: if there is image
        if (donationImage) {
            //Upload image to cloudinary
            const uploadedImage = await cloudinary.v2.uploader.upload(
                donationImage.path,
                {
                    folder: "Donations",
                    crop: "scale",
                }
            );
            //Make updated json data
            const updatedData = {
                donationName: donationName,
                donor: donor,
                totalDonor: totalDonor,
                time: time,
                target: target,
                percentage: percentage,
                donationDetails: donationDetails,
                donationImageUrl: uploadedImage.secure_url,
            };
            //find donation  and update
            const donationId = req.params.id;
            await Donations.findByIdAndUpdate(donationId, updatedData);
            res.json({
                success: true,
                message: "Donation Updated successfully with image.",
                updateDonation: updatedData,
            });
        } else {
            //update wthout image.
            const updatedData = {
                donationName: donationName,
                donor: donor,
                totalDonor: totalDonor,
                time: time,
                target: target,
                percentage: percentage,
                donationDetails: donationDetails
            };
            //find donation and update
            const donationId = req.params.id;
            await Donations.findByIdAndUpdate(donationId, updatedData);
            res.json({
                success: true,
                message: "Donation Updated successfully without image.",
                updateDonation: updatedData,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error ",
        });
    }
};
//delete donation
const deleteDonation = async (req, res) => {
    const donationId = req.params.id;

    try {
        await Donations.findByIdAndDelete(donationId);
        res.json({
            success: true,
            message: "Donation deleted successfully",
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
    createDonation,
    getDonations,
    getSingleDonation,
    updateDonation,
    deleteDonation,

    // getPagination

};
