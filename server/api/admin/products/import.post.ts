// server/api/admin/products/import.post.ts
import { defineEventHandler, readBody } from 'h3';
import { connectToDatabase } from '~/server/utils/mongodb';
import { Product } from '~/server/models/product';

export default defineEventHandler(async (event) => {
    try {
        await connectToDatabase();

        const body = await readBody(event);
        const products = body.products || [];

        if (!Array.isArray(products) || products.length === 0) {
            return {
                statusCode: 400,
                body: { error: 'No products provided or invalid format' }
            };
        }

        console.log(`Processing ${products.length} products from Excel import`);

        // Track import results
        const results = {
            success: true,
            importedCount: 0,
            invalidItems: []
        };

        // Validate each product
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            const validationErrors = [];

            // Validate required fields
            if (!product.name) validationErrors.push('Product name is required');
            if (!product.janCode) validationErrors.push('JAN code is required');
            if (!product.sku) validationErrors.push('SKU is required');
            if (!product.pricing || product.pricing.basePrice <= 0) {
                validationErrors.push('Base price must be greater than 0');
            }

            // Check for duplicate JAN code
            if (product.janCode) {
                const existingProduct = await Product.findOne({ janCode: product.janCode });
                if (existingProduct) {
                    validationErrors.push(`Product with JAN code ${product.janCode} already exists`);
                }
            }

            // If validation fails, add to invalid items
            if (validationErrors.length > 0) {
                results.invalidItems.push({
                    rowIndex: i,
                    product,
                    reasons: validationErrors
                });
                continue;
            }

            // Create and save the product
            try {
                const newProduct = new Product(product);
                await newProduct.save();
                results.importedCount++;
            } catch (error) {
                console.error(`Error saving product at index ${i}:`, error);
                results.invalidItems.push({
                    rowIndex: i,
                    product,
                    reasons: [(error as Error).message || 'Error saving product']
                });
            }
        }

        console.log(`Import complete: ${results.importedCount} imported, ${results.invalidItems.length} failed`);
        return results;
    } catch (error) {
        console.error('Error importing products:', error);
        return {
            statusCode: 500,
            body: {
                success: false,
                error: (error as Error).message || 'Failed to import products'
            }
        };
    }
});