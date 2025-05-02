const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// http://localhost:3000/admin/products  **involves body**
/** ex.
{
  "name": "Limited Edition Hoodie",
  "description": "Its a very cool hoodie. Made with the rarest material the world has ever seen.",
  "image_url": "https://example.com/LimitedEditionHoodie.jpg",
  "price": 79.99,
  "category_id": 1,
  "is_featured": 0
}
*/
router.post('/products', adminController.addProduct);

// http://localhost:3000/admin/products/1 **involves body**
router.put('/products/:id', adminController.updateProduct);

// http://localhost:3000/admin/products/bulk **involves body**
/** ex.
[
    {
      "name": "Classic SHIRT MADE IN CHINA",
      "description": "Classic SHIRT MADE IN CHINA",
      "image_url": "https://example.com/Classic SHIRT MADE IN CHINA.jpg",
      "price": 46.99,
      "category_id": 1,
      "is_featured": 1
    },
    {
      "name": "THIS IS A TEST",
      "description": "THIS IS A TEST.",
      "image_url": "https://example.com/THIS IS A TESTt.jpg",
      "price": 89.99,
      "category_id": 4,
      "is_featured": 0
    }
]
*/
router.post('/products/bulk', adminController.bulkUploadProducts);

router.get('/products', adminController.getAllProducts);

// http://your-domain/admin/products/1 (DELETE)
router.delete('/products/:id', adminController.deleteProduct);

module.exports = router;