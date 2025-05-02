// server/api/admin/products/batch.post.ts
import { defineEventHandler, readBody } from 'h3';
import { connectToDatabase } from '~/server/utils/mongodb';
import { Product } from '~/server/models/product';

export default defineEventHandler(async (event) => {
    console.log('Starting product batch import process');

    try {
        await connectToDatabase();
        console.log('Connected to database');

        const body = await readBody(event);
        const products = body.products || [];

        if (!Array.isArray(products) || products.length === 0) {
            console.error('Invalid or empty products array received', {
                receivedType: typeof products,
                isArray: Array.isArray(products),
                length: Array.isArray(products) ? products.length : 'N/A',
                sample: Array.isArray(products) && products.length > 0 ? JSON.stringify(products[0]).substring(0, 200) : 'No data'
            });

            return {
                success: false,
                error: 'No products provided or invalid format',
                debug: {
                    receivedType: typeof products,
                    isArray: Array.isArray(products),
                    length: Array.isArray(products) ? products.length : 'N/A'
                }
            };
        }

        console.log(`Processing ${products.length} products from batch import`);

        // Track import results
        const results = {
            success: false,
            importedCount: 0,
            invalidItems: [],
            validationSummary: {
                missingName: 0,
                missingJanCode: 0,
                missingSku: 0,
                invalidPrice: 0,
                duplicateJanCode: 0,
                otherErrors: 0,
                janCodeExamples: []
            },
            debug: {
                processedCount: 0,
                firstFewProducts: products.slice(0, 3).map(p => ({
                    name: p.name,
                    janCode: p.janCode,
                    sku: p.sku,
                    pricing: p.pricing
                }))
            }
        };

        // First pass: validation
        console.log('Starting product validation');
        const validProducts = [];
        const existingJanCodes = new Set();

        // Pre-check for existing JAN codes in database
        console.log('Checking for existing JAN codes in database');
        const allJanCodes = products.map(p => p.janCode).filter(Boolean);

        if (allJanCodes.length > 0) {
            const existingProducts = await Product.find({
                janCode: { $in: allJanCodes }
            }).select('janCode').lean();

            existingProducts.forEach(p => existingJanCodes.add(p.janCode));
            console.log(`Found ${existingJanCodes.size} existing JAN codes in database`);
        }

        // Validate each product
        for (let i = 0; i < products.length; i++) {
            results.debug.processedCount++;
            const product = products[i];
            const validationErrors = [];

            // Basic validation
            if (!product.name) {
                validationErrors.push('Product name is required');
                results.validationSummary.missingName++;
            }

            if (!product.janCode) {
                validationErrors.push('JAN code is required');
                results.validationSummary.missingJanCode++;
            } else if (!/^\d{8,14}$/.test(product.janCode)) {
                validationErrors.push(`JAN code must be 8-14 digits (received: ${product.janCode})`);
                results.validationSummary.otherErrors++;

                // Add example of problematic JAN code
                if (results.validationSummary.janCodeExamples.length < 5) {
                    results.validationSummary.janCodeExamples.push(product.janCode);
                }
            }

            if (!product.sku) {
                validationErrors.push('SKU is required');
                results.validationSummary.missingSku++;
            }

            if (!product.pricing || !product.pricing.basePrice || product.pricing.basePrice <= 0) {
                validationErrors.push('Base price must be greater than 0');
                results.validationSummary.invalidPrice++;
            }

            // Check for duplicate JAN code within the import data
            if (product.janCode && validProducts.some(p => p.janCode === product.janCode)) {
                validationErrors.push(`Duplicate JAN code (${product.janCode}) found in import data`);
                results.validationSummary.duplicateJanCode++;
            }

            // Check for existing JAN code in database
            if (product.janCode && existingJanCodes.has(product.janCode)) {
                validationErrors.push(`Product with JAN code ${product.janCode} already exists in database`);
                results.validationSummary.duplicateJanCode++;
            }

            // If validation fails, add to invalid items
            if (validationErrors.length > 0) {
                results.invalidItems.push({
                    rowIndex: i,
                    product: {
                        name: product.name || 'N/A',
                        janCode: product.janCode || 'N/A',
                        sku: product.sku || 'N/A',
                        basePrice: product.pricing?.basePrice || 0
                    },
                    reasons: validationErrors
                });
            } else {
                validProducts.push(product);
            }
        }

        console.log(`Validation complete: ${validProducts.length} valid products, ${results.invalidItems.length} invalid products`);

        if (validProducts.length === 0) {
            console.error('No valid products to import after validation', results.validationSummary);
            return {
                success: false,
                error: 'No valid products to import',
                invalidCount: results.invalidItems.length,
                validationSummary: results.validationSummary,
                debug: results.debug,
                invalidItems: results.invalidItems
            };
        }

        // Second pass: import valid products
        console.log(`Importing ${validProducts.length} valid products`);

        try {
            // Use bulk insert for better performance
            await Product.insertMany(validProducts, { ordered: false });
            results.importedCount = validProducts.length;
            results.success = true;

            console.log(`Successfully imported ${results.importedCount} products`);
        } catch (insertError) {
            console.error('Error during bulk insert of products:', insertError);

            if (insertError.insertedDocs) {
                results.importedCount = insertError.insertedDocs.length;
                results.success = results.importedCount > 0;
            }

            // Add bulk insert errors to results
            results.bulkInsertError = {
                message: insertError.message,
                code: insertError.code,
                writeErrors: insertError.writeErrors ? insertError.writeErrors.length : 0
            };
        }

        return {
            success: results.success,
            importedCount: results.importedCount,
            invalidItems: results.invalidItems,
            validationSummary: results.validationSummary,
            message: results.success
                ? `Successfully imported ${results.importedCount} products`
                : `Failed to import products. See validation summary for details.`
        };
    } catch (error) {
        console.error('Unexpected error during product import:', error);
        return {
            success: false,
            error: `Failed to import products: ${error.message}`,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        };
    }
});