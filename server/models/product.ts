// server/models/product.ts
import mongoose from 'mongoose';

const ProductImageSchema = new mongoose.Schema({
    src: { type: String, required: true },
    alt: { type: String, default: '' },
    isDefault: { type: Boolean, default: false }
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    janCode: { type: String, required: true, unique: true },
    sku: { type: String, required: true },
    brand: { type: String, default: '' },
    category: { type: String, default: '' },
    subcategory: { type: String, default: '' },
    tags: [{ type: String }],
    minOrderQuantity: { type: Number, default: 1 },
    stock: { type: Number, default: 0 },
    pricing: {
        basePrice: { type: Number, required: true },
        currency: { type: String, default: 'JPY' },
        discountPercentage: { type: Number, default: 0 }
    },
    images: [ProductImageSchema],
    isActive: { type: Boolean, default: true },
    isNew: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false }
}, {
    timestamps: true,
    // This ensures virtual fields are included when converting to JSON
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add a virtual 'id' field that aliases '_id' for frontend compatibility
ProductSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

// Ensure virtual fields are included in JSON
ProductSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        // Keep both _id and id for maximum compatibility during transition
        // Convert _id to string format
        ret._id = ret._id.toString();
        return ret;
    }
});

// Create or use existing model
export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);