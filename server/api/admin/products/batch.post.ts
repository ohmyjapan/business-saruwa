// server/api/admin/products/batch.post.ts
import { defineEventHandler, readBody } from 'h3';
import { connectToDatabase } from '~/server/utils/mongodb';
import { Product } from '~/server/models/product';
import type { Product as ProductType } from '~/types';

export default defineEventHandler(async (event) => {
    try {
        await connectToDatabase();

        const { products } = await readBody(event);

        if (!products || !Array.isArray(products) || products.length === 0) {
            return {
                success: false,
                error: 'No products provided',
                statusCode: 400
            };
        }

        // Get all existing JAN codes to check for duplicates
        const existingProducts = await Product.find({}, { janCode: 1 });
        const existingJanCodes = new Set(existingProducts.map(p => p.janCode));

        // Process products
        const validProducts = [];
        const invalidProducts = [];

        for (const product of products) {
            // Skip products with duplicate JAN codes
            if (existingJanCodes.has(product.janCode)) {
                invalidProducts.push({
                    product,
                    reasons: [`Product with JAN code ${product.janCode} already exists`]
                });
                continue;
            }

            // Basic validation
            const validationErrors = [];

            if (!product.name) validationErrors.push('Product name is required');
            if (!product.janCode) validationErrors.push('JAN Code is required');
            if (!product.sku) validationErrors.push('SKU is required');
            if (!product.pricing?.basePrice || product.pricing.basePrice <= 0) {
                validationErrors.push('Base price must be greater than 0');
            }

            if (validationErrors.length > 0) {
                invalidProducts.push({
                    product,
                    reasons: validationErrors
                });
            } else {
                validProducts.push(product);
                // Track this JAN code to prevent duplicates within the import batch
                existingJanCodes.add(product.janCode);
            }
        }

        if (validProducts.length === 0) {
            return {
                success: false,
                error: 'No valid products to import',
                invalidProducts,
                statusCode: 400
            };
        }

        // Add timestamps to products
        const now = new Date().toISOString();
        const productsWithTimestamps = validProducts.map(product => ({
            ...product,
            createdAt: now,
            updatedAt: now
        }));

        // Insert the valid products in batches (to avoid potential MongoDB document size limits)
        const BATCH_SIZE = 100;
        let importedCount = 0;

        for (let i = 0; i < productsWithTimestamps.length; i += BATCH_SIZE) {
            const batch = productsWithTimestamps.slice(i, i + BATCH_SIZE);
            const result = await Product.insertMany(batch);
            importedCount += result.length;
        }

        return {
            success: true,
            message: `Successfully imported ${importedCount} products`,
            importedCount,
            invalidProducts: invalidProducts.length > 0 ? invalidProducts : undefined
        };
    } catch (error) {
        console.error('Error importing products:', error);
        return {
            success: false,
            error: 'Failed to import products',
            statusCode: 500
        };
    }
});