import express from 'express';
import { registerUser, loginUser, getProfile, updateBalance, getAllTransactions, uploadProfileImage, updateProfile } from '../controllers/authController.js';
import { upload } from '../middlewares/authUploadMiddleware.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/profile', protect, getProfile);
router.post('/update-balance', protect, updateBalance);
router.get('/transactions', protect, getAllTransactions);
router.post('/upload', protect, upload.single('image'), uploadProfileImage);
router.put('/profile', protect, upload.single('image'), updateProfile);

export default router;
