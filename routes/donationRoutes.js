const router = require('express').Router();
const donationController = require("../controllers/donationController");


router.get("/get_donations", donationController.getDonations)
router.get("/get_donation/:id", donationController.getSingleDonation)

router.post('/create_donation', donationController.createDonation)
router.put("/update_donation/:id", donationController.updateDonation)
router.delete("/delete_donation/:id", donationController.deleteDonation)

// router.post('/create_product', authGuardAdmin, productController.createProduct)
// router.put("/update_product/:id", authGuardAdmin, productController.updateProduct)
// router.delete("/delete_product/:id", authGuardAdmin, productController.deleteProduct)


module.exports = router;