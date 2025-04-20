// types/index.ts

// Add MongoDB specific types
export interface WithMongoId {
    _id?: string;
}

export interface ProductImage extends WithMongoId {
    id: string;
    src: string;
    alt: string;
    isDefault: boolean;
}

export interface ProductPrice {
    amount: number;
    currency: string;
    minQuantity?: number;
}

export interface ProductVariant extends WithMongoId {
    id: string;
    name: string;
    sku: string;
    janCode: string;
    stock: number;
    prices: ProductPrice[];
}

export interface Product extends WithMongoId {
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
    images: ProductImage[];
    variants?: ProductVariant[];
    specifications?: Record<string, string>;
    isActive: boolean;
    isNew: boolean;
    isFeatured: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ProductFilter {
    categories?: string[];
    brands?: string[];
    tags?: string[];
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    query?: string;
}

export interface CartItemVariant {
    id: string;
    name: string;
    sku: string;
    janCode: string;
    price: number;
}

export interface CartItem {
    id: string;
    productId: string;
    name: string;
    janCode: string;
    brand: string;
    sku: string;
    variantId?: string;
    variant?: CartItemVariant;
    price: number;
    originalPrice?: number;
    quantity: number;
    minOrderQuantity: number;
    image: string;
    notes?: string;
}

export interface CustomerInfo {
    companyName: string;
    companyRegistration?: string;
    contactName: string;
    email: string;
    phone: string;
    address: {
        line1: string;
        line2?: string;
        city: string;
        stateRegion: string;
        postalCode: string;
        country: string;
    };
    billingAddress?: {
        sameAsShipping: boolean;
        line1?: string;
        line2?: string;
        city?: string;
        stateRegion?: string;
        postalCode?: string;
        country?: string;
    };
    taxId?: string;
    notes?: string;
}

export interface PriceSummary {
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
}

// MongoDB response type helpers
export interface MongoDBDeleteResult {
    acknowledged: boolean;
    deletedCount: number;
}

export interface MongoDBUpdateResult {
    acknowledged: boolean;
    matchedCount: number;
    modifiedCount: number;
    upsertedCount: number;
    upsertedId: string | null;
}