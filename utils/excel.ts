import * as XLSX from 'xlsx';
import { randomUUID } from 'crypto';

export interface RawProductData {
    [key: string]: any;
}

export interface NormalizedProduct {
    id: string;
    name: string;
    description: string;
    janCode: string;
    sku: string;
    brand: string;
    category: string;
    subcategory?: string;
    tags: string[];
    minOrderQuantity: number;
    stock: number;
    pricing: {
        basePrice: number;
        currency: string;
        discountPercentage?: number;
        volumeDiscounts?: {
            minQuantity: number;
            discount: number;
        }[];
    };
    images: {
        id: string;
        src: string;
        alt: string;
        isDefault: boolean;
    }[];
    specifications?: Record<string, string>;
    isActive: boolean;
    isNew: boolean;
    isFeatured: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Parse an Excel file and extract product data
 */
export function parseExcelFile(fileBuffer: Buffer): RawProductData[] {
    // Read the Excel file
    const workbook = XLSX.read(fileBuffer);

    // Get the first sheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convert to JSON with header
    const rawData = XLSX.utils.sheet_to_json(worksheet, {
        raw: false, // Convert all values to strings
        defval: '' // Default value for empty cells
    });

    return rawData as RawProductData[];
}

/**
 * Helper function to parse price-related fields
 */
function parsePriceInfo(item: RawProductData) {
    // Parse base price
    const basePrice = parseFloat(String(
        item.basePrice || item.price || item.Price || item.PRICE || 0
    ));

    // Parse currency
    const currency = String(
        item.currency || item.Currency || item.CURRENCY || 'JPY'
    );

    // Parse discount percentage (if any)
    let discountPercentage: number | undefined;
    const discountField = item.discountPercentage ||
        item.discount || item.Discount || item.DISCOUNT;

    if (discountField) {
        discountPercentage = parseFloat(String(discountField));
        if (isNaN(discountPercentage)) discountPercentage = undefined;
    }

    // Parse volume discounts (if any)
    // Expecting format like "10:5,20:10,50:15" meaning:
    // 5% off for 10+ units, 10% off for 20+ units, 15% off for 50+ units
    let volumeDiscounts: { minQuantity: number; discount: number }[] | undefined;

    const volumeDiscountField = item.volumeDiscounts ||
        item.VolumeDiscounts || item.VOLUME_DISCOUNTS;

    if (volumeDiscountField && typeof volumeDiscountField === 'string') {
        try {
            volumeDiscounts = volumeDiscountField.split(',').map(pair => {
                const [qty, discount] = pair.split(':');
                return {
                    minQuantity: parseInt(qty.trim(), 10),
                    discount: parseFloat(discount.trim())
                };
            }).filter(vd => !isNaN(vd.minQuantity) && !isNaN(vd.discount));

            if (volumeDiscounts.length === 0) volumeDiscounts = undefined;
        } catch (e) {
            volumeDiscounts = undefined;
        }
    }

    return {
        basePrice: isNaN(basePrice) ? 0 : basePrice,
        currency,
        discountPercentage,
        volumeDiscounts
    };
}

/**
 * Parse tags from Excel field
 */
function parseTags(item: RawProductData): string[] {
    let tags: string[] = [];

    const tagsField = item.tags || item.Tags || item.TAGS;

    if (typeof tagsField === 'string') {
        tags = tagsField.split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
    } else if (Array.isArray(tagsField)) {
        tags = tagsField.map(tag => String(tag).trim()).filter(tag => tag.length > 0);
    }

    return tags;
}

/**
 * Parse specifications from multiple Excel fields
 */
function parseSpecifications(item: RawProductData): Record<string, string> | undefined {
    const specs: Record<string, string> = {};
    let hasSpecs = false;

    // Look for fields that start with 'spec_' or 'specification_'
    Object.keys(item).forEach(key => {
        const lowerKey = key.toLowerCase();
        let specKey: string | null = null;

        if (lowerKey.startsWith('spec_')) {
            specKey = lowerKey.substring(5);
        } else if (lowerKey.startsWith('specification_')) {
            specKey = lowerKey.substring(14);
        }

        if (specKey && item[key]) {
            specs[specKey] = String(item[key]).trim();
            hasSpecs = true;
        }
    });

    return hasSpecs ? specs : undefined;
}

/**
 * Normalize raw product data into a consistent format
 */
export function normalizeProductData(rawData: RawProductData[]): NormalizedProduct[] {
    const now = new Date().toISOString();

    return rawData.map(item => {
        // Extract pricing information
        const pricing = parsePriceInfo(item);

        // Parse tags
        const tags = parseTags(item);

        // Parse specifications
        const specifications = parseSpecifications(item);

        // Generate UUID if not present
        const id = item.id || item.ID || randomUUID();

        // Convert minOrderQuantity to number, default to 1 if invalid
        const minOrderQuantity = parseInt(String(
            item.minOrderQuantity || item.MinOrderQuantity || item.MOQ || 1
        ), 10);

        // Convert stock to number, default to 0 if invalid
        const stock = parseInt(String(
            item.stock || item.Stock || item.STOCK || 0
        ), 10);

        // Parse boolean fields
        const isActive = item.isActive === 'false' ? false : Boolean(item.isActive ?? true);
        const isNew = item.isNew === 'false' ? false : Boolean(item.isNew ?? false);
        const isFeatured = item.isFeatured === 'false' ? false : Boolean(item.isFeatured ?? false);

        return {
            id,
            name: String(item.name || item.Name || item.PRODUCT_NAME || ''),
            description: String(item.description || item.Description || item.DESCRIPTION || ''),
            janCode: String(item.janCode || item.JanCode || item.JAN_CODE || item.JAN || ''),
            sku: String(item.sku || item.SKU || item.PRODUCT_CODE || ''),
            brand: String(item.brand || item.Brand || item.BRAND || ''),
            category: String(item.category || item.Category || item.CATEGORY || ''),
            subcategory: String(item.subcategory || item.Subcategory || item.SUB_CATEGORY || ''),
            tags,
            minOrderQuantity: isNaN(minOrderQuantity) ? 1 : minOrderQuantity,
            stock: isNaN(stock) ? 0 : stock,
            pricing,
            images: [], // Images will be added separately
            specifications,
            isActive,
            isNew,
            isFeatured,
            createdAt: item.createdAt || now,
            updatedAt: now
        };
    });
}

/**
 * Validate product data to ensure all required fields are present
 */
export function validateProducts(products: NormalizedProduct[]): {
    valid: NormalizedProduct[],
    invalid: { product: NormalizedProduct, reasons: string[] }[]
} {
    const valid: NormalizedProduct[] = [];
    const invalid: { product: NormalizedProduct, reasons: string[] }[] = [];

    products.forEach(product => {
        const reasons: string[] = [];

        // Validate required fields
        if (!product.name) reasons.push('Name is required');
        if (!product.janCode) reasons.push('JAN Code is required');
        if (!product.sku) reasons.push('SKU is required');
        if (product.pricing.basePrice <= 0) reasons.push('Price must be greater than 0');

        if (reasons.length === 0) {
            valid.push(product);
        } else {
            invalid.push({ product, reasons });
        }
    });

    return { valid, invalid };
}