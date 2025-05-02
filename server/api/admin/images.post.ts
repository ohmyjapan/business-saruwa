// server/api/admin/images.post.ts
import { defineEventHandler, readMultipartFormData } from 'h3';
import { connectToDatabase } from '~/server/utils/mongodb';
import { Product } from '~/server/models/product';
import { processUploadedProductImages } from '~/server/utils/files';
import { randomUUID } from 'crypto';
import { join } from 'path';

export default defineEventHandler(async (event) => {
    try {
        await connectToDatabase();

        // Get the upload directory from runtime config
        const config = useRuntimeConfig();
        const uploadDir = config.private.uploadDir || 'uploads';

        // Parse multipart form data
        const formData = await readMultipartFormData(event);
        if (!formData) {
            return {
                success: false,
                error: 'No form data provided',
                uploadedCount: 0,
                skippedCount: 0
            };
        }

        // Extract product ID and JAN code from form data
        let productId = '';
        let janCode = '';

        // Extract files
        const imageFiles = [];

        for (const part of formData) {
            if (part.type === 'form-data') {
                if (part.name === 'productId' && part.data) {
                    productId = part.data.toString();
                } else if (part.name === 'janCode' && part.data) {
                    janCode = part.data.toString();
                }
            } else if (part.type === 'file' && part.name === 'images') {
                imageFiles.push({
                    buffer: part.data,
                    originalname: part.filename || `image-${Date.now()}.jpg`
                });
            }
        }

        if (imageFiles.length === 0) {
            return {
                success: false,
                error: 'No image files provided',
                uploadedCount: 0,
                skippedCount: 0
            };
        }

        // Get product by ID or JAN code
        let product = null;
        if (productId) {
            product = await Product.findById(productId);
        } else if (janCode) {
            product = await Product.findOne({ janCode });
        } else {
            // Try to extract JAN code from the first image filename
            // Format: 4901234567890.jpg or product-4901234567890.jpg
            const firstFilename = imageFiles[0].originalname;
            const janMatch = firstFilename.match(/(\d{8,14})/);

            if (janMatch && janMatch[1]) {
                janCode = janMatch[1];
                product = await Product.findOne({ janCode });
            }
        }

        if (!product) {
            return {
                success: false,
                error: 'Product not found. Please specify a valid product ID, JAN code, or use filenames with JAN codes.',
                uploadedCount: 0,
                skippedCount: imageFiles.length
            };
        }

        // Process and save images
        const processedImages = await processUploadedProductImages(
            imageFiles,
            join(uploadDir),
            product.janCode
        );

        // Update product with new images
        const existingImageIds = product.images.map(img => img.id);
        product.images = [
            ...product.images,
            ...processedImages.filter(img => !existingImageIds.includes(img.id))
        ];

        // If no default image is set, set the first one as default
        if (!product.images.some(img => img.isDefault)) {
            product.images[0].isDefault = true;
        }

        // Save updated product
        await product.save();

        return {
            success: true,
            uploadedCount: processedImages.length,
            skippedCount: 0,
            message: `Successfully uploaded ${processedImages.length} images for product ${product.name} (${product.janCode})`
        };
    } catch (error) {
        console.error('Error uploading product images:', error);
        return {
            success: false,
            error: (error as Error).message || 'Failed to upload product images',
            uploadedCount: 0,
            skippedCount: 0
        };
    }
});