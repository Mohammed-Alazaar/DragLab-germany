const path = require('path');
const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

const { check, body } = require('express-validator');
const { uploadProductImages } = require('../middleware/multer-config');
const isAdminOrSeller = require('../middleware/isAdminOrSeller');




//admin/add-product => GET
router.get('/add-product', isAuth, isAdminOrSeller, adminController.getAddProduct);

router.post(
    '/add-product',
    uploadProductImages,
    isAuth,
    isAdminOrSeller,
    adminController.postAddProduct
);


//admin/My-product => POST
router.get('/Myproduct', isAuth, isAdminOrSeller, adminController.getMyproduct);

//admin/edit-product => GET
router.get('/edit-product/:productId', isAuth, isAdminOrSeller, adminController.getEditProduct);

//admin/edit-product => POST

router.post('/edit-product', uploadProductImages, isAuth, isAdminOrSeller, adminController.postEditProduct
);

//admin/delete-product => POST
router.post('/delete-product', isAuth, isAdminOrSeller, adminController.postDeleteProduct);

router.post('/delete-model', isAuth, isAdminOrSeller, adminController.postDeleteModel);


// Add Model => GET
router.get('/add-model/:productId',isAuth, isAdminOrSeller, adminController.getAddModel);

// Add Model => POST
router.post('/add-model/:productId', uploadProductImages,

    [
        body('ModelName_EN').not().isEmpty().withMessage('English Model Name is required.'),
        body('ModelNameDesc_EN').not().isEmpty().withMessage('English Short Description is required.'),
        body('ModelDesc_EN').not().isEmpty().withMessage('English Description is required.'),
    ],
    isAuth, isAdminOrSeller,
    adminController.postAddModel
);


// Edit Model => GET
router.get('/edit-model/:productId/:modelId', isAuth, isAdminOrSeller, adminController.getEditModel);

// Edit Model => POST
router.post('/edit-model/:productId/:modelId', uploadProductImages, [
    body('ModelName_EN').not().isEmpty().withMessage('English Model Name is required.'),
    body('ModelNameDesc_EN').not().isEmpty().withMessage('English Short Description is required.'),
    body('ModelDesc_EN').not().isEmpty().withMessage('English Description is required.'),
    // Add validations for other languages as needed
], isAuth, adminController.postEditModel);




// admin/Dashboard => GET
router.get('/Dashboard', isAuth, isAdminOrSeller, adminController.getDashboard);


// View All Slides
router.get('/slideshow', isAuth, isAdminOrSeller, adminController.getAllSlides);

// Add Slide
router.get('/addslideshow', isAuth, isAdminOrSeller, adminController.getAddSlideForm);

// Edit Slide
router.get('/slideshow/edit/:id', isAuth, isAdminOrSeller, adminController.getEditSlideForm);


router.post('/slideshow/add', isAuth, isAdminOrSeller, uploadProductImages, adminController.postAddSlide);

router.post('/slideshow/edit/:id', isAuth, isAdminOrSeller, uploadProductImages, adminController.postEditSlide);


// Delete Slide
router.post('/slideshow/delete/:id', isAuth, isAdminOrSeller, adminController.deleteSlide);




// Article Routes
router.get('/articles', isAuth, isAdminOrSeller,adminController.getAllArticles);
router.get('/articles/add', isAuth, isAdminOrSeller,adminController.getAddArticle);
router.post('/articles/add', isAuth, isAdminOrSeller,uploadProductImages, adminController.postAddArticle);
router.get('/articles/edit/:articleId',isAuth, isAdminOrSeller, adminController.getEditArticle);
router.post('/articles/edit/:articleId',isAuth, isAdminOrSeller, uploadProductImages, adminController.postEditArticle);
router.post('/articles/delete/:articleId',isAuth, isAdminOrSeller, adminController.postDeleteArticle);



router.get('/catalogs', isAuth, isAdminOrSeller, adminController.getAllCategories);
router.get('/catalogs/add', isAuth, isAdminOrSeller, adminController.getAddCategoryForm);
router.post('/catalogs/add', isAuth, isAdminOrSeller, adminController.postAddCategory);

router.get('/catalogs/:categoryId/upload', isAuth, isAdminOrSeller, adminController.getUploadForm);
router.post('/catalogs/:categoryId/upload', isAuth, isAdminOrSeller, uploadProductImages, adminController.postUploadFile);

router.post('/catalogs/delete/:categoryId', isAuth, isAdminOrSeller, adminController.deleteCategory);
router.post('/catalogs/:categoryId/delete-file/:fileId', isAuth, isAdminOrSeller, adminController.deleteFile);



router.get('/TechnicalRequests', isAuth, isAdminOrSeller, adminController.getAllTechnicalRequests);
router.get('/technical-requests/:id', isAuth, isAdminOrSeller, adminController.getTechnicalRequestById);
router.post('/technical-requests/:id/done', isAuth, isAdminOrSeller, adminController.markTechnicalRequestDone);
router.get('/technical-requests/:id/pdf', isAuth, isAdminOrSeller, adminController.exportTechnicalRequestPDF);





router.get('/warranty-registrations',isAuth, isAdminOrSeller, adminController.getAllWarrantyRegistrations);
router.get('/warranty-registrations/:id',isAuth, isAdminOrSeller, adminController.getWarrantyRegistrationById);
router.post('/warranty-registrations/:id/done', isAuth, isAdminOrSeller,adminController.markWarrantyAsDone);
router.get('/warranty-registrations/:id/pdf',isAuth, isAdminOrSeller, adminController.exportWarrantyToPDF);



router.get('/contact-messages', isAuth, isAdminOrSeller,adminController.getAllContactUs);
router.get('/contact-message/:id', isAuth, isAdminOrSeller,adminController.getContactUsDetail);
router.post('/mark-contactus-done', isAuth, isAdminOrSeller,adminController.postMarkContactUsDone);
router.get('/contactus-pdf/:id',isAuth, isAdminOrSeller, adminController.exportContactUsToPDF);

module.exports = router;