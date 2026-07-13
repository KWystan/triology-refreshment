/**
 * Menu CRUD routes — admin-protected endpoints for managing
 * menu categories and items in Firestore.
 */
import { Router } from 'express';
import multer from 'multer';
import { requireAdmin } from '../middleware/adminAuth.js';
import { validate } from '../middleware/validate.js';
import { categorySchema, itemSchema } from '../validators/menu.js';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  uploadImage,
} from '../controllers/menu.js';

const router = Router();

// Multer config — memory storage to avoid temp files, 5 MB limit, images only
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed.'));
    }
  },
});

// ─── Public read endpoints ─────────────────────────────────
router.get('/categories', getCategories);
router.get('/categories/:id', getCategory);
router.get('/items', getItems);
router.get('/items/:id', getItem);

// ─── Admin-only write endpoints ────────────────────────────
router.post('/categories', requireAdmin, validate({ body: categorySchema }), createCategory);
router.put('/categories/:id', requireAdmin, updateCategory);
router.delete('/categories/:id', requireAdmin, deleteCategory);

router.post('/items', requireAdmin, validate({ body: itemSchema }), createItem);
router.put('/items/:id', requireAdmin, updateItem);
router.delete('/items/:id', requireAdmin, deleteItem);

router.post('/upload', requireAdmin, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: { message: 'Image must be under 5 MB.' } });
      }
      return res.status(400).json({ error: { message: err.message || 'File upload rejected.' } });
    }
    next();
  });
}, uploadImage);

export { router as menuRouter };
