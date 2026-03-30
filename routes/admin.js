const path = require('path');
const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

const { check, body } = require('express-validator');
const { uploadProductImages } = require('../middleware/multer-config');
const isAdminOrSeller = require('../middleware/isAdminOrSeller');
const isAdmin = require('../middleware/isAdmin');




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
router.get('/add-model/:productId', isAuth, isAdminOrSeller, adminController.getAddModel);

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
router.get('/articles', isAuth, isAdminOrSeller, adminController.getAllArticles);
router.get('/articles/add', isAuth, isAdminOrSeller, adminController.getAddArticle);
router.post('/articles/add', isAuth, isAdminOrSeller, uploadProductImages, adminController.postAddArticle);
router.get('/articles/edit/:articleId', isAuth, isAdminOrSeller, adminController.getEditArticle);
router.post('/articles/edit/:articleId', isAuth, isAdminOrSeller, uploadProductImages, adminController.postEditArticle);
router.post('/articles/delete/:articleId', isAuth, isAdminOrSeller, adminController.postDeleteArticle);



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
// Admin-only actions
router.post('/technical-requests/:id/spam', isAuth, isAdmin, adminController.postMarkTechnicalSpam);
router.post('/technical-requests/:id/delete', isAuth, isAdmin, adminController.deleteTechnicalRequest);





router.get('/warranty-registrations', isAuth, isAdminOrSeller, adminController.getAllWarrantyRegistrations);
router.get('/warranty-registrations/:id', isAuth, isAdminOrSeller, adminController.getWarrantyRegistrationById);
router.post('/warranty-registrations/:id/done', isAuth, isAdminOrSeller, adminController.markWarrantyAsDone);
router.get('/warranty-registrations/:id/pdf', isAuth, isAdminOrSeller, adminController.exportWarrantyToPDF);
// Admin-only actions
router.post('/warranty-registrations/:id/spam', isAuth, isAdmin, adminController.postMarkWarrantySpam);
router.post('/warranty-registrations/:id/delete', isAuth, isAdmin, adminController.deleteWarrantyRegistration);



router.get('/contact-messages', isAuth, isAdminOrSeller, adminController.getAllContactUs);
router.get('/contact-message/:id', isAuth, isAdminOrSeller, adminController.getContactUsDetail);
router.post('/mark-contactus-done', isAuth, isAdminOrSeller, adminController.postMarkContactUsDone);
router.get('/contactus-pdf/:id', isAuth, isAdminOrSeller, adminController.exportContactUsToPDF);
// Admin-only actions
router.post('/contactus-spam/:id', isAuth, isAdmin, adminController.postMarkContactUsSpam);
router.post('/contactus-delete/:id', isAuth, isAdmin, adminController.deleteContactUs);



router.get('/add-industry', isAuth, isAdminOrSeller, adminController.getAddIndustry);
router.post('/add-industry', uploadProductImages, isAuth, isAdminOrSeller, adminController.postAddIndustry);

router.get('/edit-industry/:slug', isAuth, isAdminOrSeller, adminController.getEditIndustryPage);
router.post('/edit-industry', uploadProductImages, isAuth, isAdminOrSeller, adminController.postEditIndustryPage);
router.get('/industry-pages', isAuth, isAdminOrSeller, adminController.getMyIndustriesPage);
router.post('/delete-industry', isAuth, isAdminOrSeller, adminController.postDeleteIndustry);



router.get('/newsletter', isAuth, isAdminOrSeller, adminController.getNewsletterList);
router.post('/newsletter/export/all', adminController.exportAllSubscribers);
router.post('/newsletter/export/new', adminController.exportNewSubscribers);


// ─── User Management (admin only) ────────────────────────────────────────────

router.get('/users', isAuth, isAdmin, adminController.getUsersList);

router.get('/users/add', isAuth, isAdmin, adminController.getAddUserForm);
router.post('/users/add', isAuth, isAdmin,
    [
        check('email').isEmail().withMessage('Please enter a valid email.').normalizeEmail(),
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.').trim(),
        body('name').trim().notEmpty().withMessage('Name is required.'),
        body('phoneNumber').trim().notEmpty().withMessage('Phone number is required.')
    ],
    adminController.postAddUser
);

router.get('/users/edit/:id', isAuth, isAdmin, adminController.getEditUser);
router.post('/users/edit/:id', isAuth, isAdmin, adminController.postEditUser);
router.post('/users/delete/:id', isAuth, isAdmin, adminController.postDeleteUser);
router.post('/users/change-password/:id', isAuth, isAdmin, adminController.postChangeUserPassword);


// ── PAGE 1: Quotes ────────────────────────────────────────────────────────────
router.get('/quotes', isAuth, isAdminOrSeller, adminController.getAllQuotes);
router.get('/quotes/:id/pdf', isAuth, isAdminOrSeller, adminController.getQuotePdf);
router.get('/quotes/:id', isAuth, isAdminOrSeller, adminController.getQuoteDetail);
router.post('/quotes/:id/status', isAuth, isAdminOrSeller, adminController.postUpdateQuoteStatus);
router.post('/quotes/:id/spam', isAuth, isAdmin, adminController.postMarkQuoteSpam);
router.post('/quotes/:id/delete', isAuth, isAdmin, adminController.deleteQuote);

// ── PAGE 2: Distributor Applications ─────────────────────────────────────────
router.get('/distributor-applications', isAuth, isAdminOrSeller, adminController.getAllDistributorApplications);
router.get('/distributor-applications/:id', isAuth, isAdminOrSeller, adminController.getDistributorApplicationDetail);
router.post('/distributor-applications/:id/status', isAuth, isAdminOrSeller, adminController.postUpdateDistributorStatus);

// ── PAGE 3: FAQs ──────────────────────────────────────────────────────────────
router.get('/faqs', isAuth, isAdminOrSeller, adminController.getAllFaqs);
router.get('/faqs/add', isAuth, isAdminOrSeller, adminController.getAddFaq);
router.post('/faqs/add', isAuth, isAdminOrSeller, adminController.postAddFaq);
router.get('/faqs/edit/:id', isAuth, isAdminOrSeller, adminController.getEditFaq);
router.post('/faqs/edit/:id', isAuth, isAdminOrSeller, adminController.postEditFaq);
router.post('/faqs/delete/:id', isAuth, isAdminOrSeller, adminController.postDeleteFaq);

// ── PAGE 4: Case Studies ──────────────────────────────────────────────────────
router.get('/case-studies', isAuth, isAdminOrSeller, adminController.getAllCaseStudies);
router.get('/case-studies/add', isAuth, isAdminOrSeller, adminController.getAddCaseStudy);
router.post('/case-studies/add', isAuth, isAdminOrSeller, adminController.postAddCaseStudy);
router.get('/case-studies/edit/:id', isAuth, isAdminOrSeller, adminController.getEditCaseStudy);
router.post('/case-studies/edit/:id', isAuth, isAdminOrSeller, adminController.postEditCaseStudy);
router.post('/case-studies/delete/:id', isAuth, isAdminOrSeller, adminController.postDeleteCaseStudy);

// ── PAGE 5: Glossary ──────────────────────────────────────────────────────────
router.get('/glossary', isAuth, isAdminOrSeller, adminController.getAllGlossary);
router.get('/glossary/add', isAuth, isAdminOrSeller, adminController.getAddGlossary);
router.post('/glossary/add', isAuth, isAdminOrSeller, adminController.postAddGlossary);
router.get('/glossary/edit/:id', isAuth, isAdminOrSeller, adminController.getEditGlossary);
router.post('/glossary/edit/:id', isAuth, isAdminOrSeller, adminController.postEditGlossary);
router.post('/glossary/delete/:id', isAuth, isAdminOrSeller, adminController.postDeleteGlossary);


module.exports = router;