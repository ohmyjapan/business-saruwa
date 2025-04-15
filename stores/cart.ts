import { defineStore } from 'pinia';
import { Product, ProductVariant } from './products';

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

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [] as CartItem[],
        customer: {
            companyName: '',
            contactName: '',
            email: '',
            phone: '',
            address: {
                line1: '',
                city: '',
                state: '',
                postalCode: '',
                country: ''
            },
            billingAddress: {
                sameAsShipping: true
            }
        } as CustomerInfo,
        appliedCoupon: null as { code: string; discountPercentage: number } | null,
    }),

    getters: {
        cartCount: (state) => {
            return state.items.reduce((count, item) => count + item.quantity, 0);
        },

        subtotal: (state) => {
            return state.items.reduce((total, item) =>
                total + (item.price * item.quantity), 0);
        },

        discount: (state) => {
            if (!state.appliedCoupon) return 0;

            const discountAmount = state.subtotal * (state.appliedCoupon.discountPercentage / 100);
            return Math.round(discountAmount * 100) / 100;
        },

        tax: (state) => {
            // Example tax calculation (can be adjusted based on requirements)
            // Calculate tax after discount
            const taxableAmount = state.subtotal - state.discount;
            const taxRate = 0.1; // 10% tax rate, adjust as needed

            return Math.round(taxableAmount * taxRate * 100) / 100;
        },

        total: (state) => {
            return state.subtotal - state.discount + state.tax;
        },

        priceSummary(): PriceSummary {
            return {
                subtotal: this.subtotal,
                discount: this.discount,
                tax: this.tax,
                total: this.total
            };
        },

        isEmpty: (state) => {
            return state.items.length === 0;
        },

        isCustomerInfoComplete: (state) => {
            const { companyName, contactName, email, phone, address } = state.customer;

            if (!companyName || !contactName || !email || !phone) return false;

            const { line1, city, stateRegion, postalCode, country } = address;
            if (!line1 || !city || !stateRegion || !postalCode || !country) return false;

            if (!state.customer.billingAddress.sameAsShipping) {
                const billing = state.customer.billingAddress;
                if (!billing.line1 || !billing.city || !billing.state ||
                    !billing.postalCode || !billing.country) {
                    return false;
                }
            }

            return true;
        }
    },

    actions: {
        addToCart(product: Product, quantity: number = 1, variantId?: string) {
            // Find the variant if specified
            let variant: ProductVariant | undefined;
            let price = product.pricing.basePrice;

            if (variantId && product.variants) {
                variant = product.variants.find(v => v.id === variantId);

                if (variant && variant.prices.length > 0) {
                    // Use the base price from the variant
                    price = variant.prices[0].amount;
                }
            }

            // Calculate any applicable volume discounts
            if (product.pricing.volumeDiscounts) {
                const applicableDiscount = product.pricing.volumeDiscounts
                    .filter(d => quantity >= d.minQuantity)
                    .sort((a, b) => b.minQuantity - a.minQuantity)[0];

                if (applicableDiscount) {
                    const discountAmount = price * (applicableDiscount.discount / 100);
                    price = price - discountAmount;
                }
            }

            // Check if this product/variant is already in the cart
            const cartItemId = variantId
                ? `${product.id}-${variantId}`
                : product.id;

            const existingItemIndex = this.items.findIndex(item => item.id === cartItemId);

            if (existingItemIndex !== -1) {
                // Update existing item
                this.items[existingItemIndex].quantity += quantity;
            } else {
                // Add new item
                const cartItem: CartItem = {
                    id: cartItemId,
                    productId: product.id,
                    name: product.name,
                    janCode: product.janCode,
                    brand: product.brand,
                    sku: product.sku,
                    price: price,
                    originalPrice: product.pricing.discountPercentage
                        ? product.pricing.basePrice
                        : undefined,
                    quantity: quantity,
                    minOrderQuantity: product.minOrderQuantity,
                    image: product.images.length > 0 ? product.images[0].src : '',
                };

                // Add variant information if applicable
                if (variant) {
                    cartItem.variantId = variant.id;
                    cartItem.variant = {
                        id: variant.id,
                        name: variant.name,
                        sku: variant.sku,
                        janCode: variant.janCode,
                        price: price
                    };
                }

                this.items.push(cartItem);
            }

            // Save to local storage
            this.saveCart();
        },

        updateQuantity(itemId: string, quantity: number) {
            const itemIndex = this.items.findIndex(item => item.id === itemId);

            if (itemIndex !== -1) {
                if (quantity >= this.items[itemIndex].minOrderQuantity) {
                    this.items[itemIndex].quantity = quantity;
                } else if (quantity <= 0) {
                    // Remove item if quantity is 0 or negative
                    this.items.splice(itemIndex, 1);
                } else {
                    // Set to minimum order quantity if below
                    this.items[itemIndex].quantity = this.items[itemIndex].minOrderQuantity;
                }

                // Save to local storage
                this.saveCart();
            }
        },

        removeFromCart(itemId: string) {
            const itemIndex = this.items.findIndex(item => item.id === itemId);

            if (itemIndex !== -1) {
                this.items.splice(itemIndex, 1);
                this.saveCart();
            }
        },

        updateItemNotes(itemId: string, notes: string) {
            const itemIndex = this.items.findIndex(item => item.id === itemId);

            if (itemIndex !== -1) {
                this.items[itemIndex].notes = notes;
                this.saveCart();
            }
        },

        clearCart() {
            this.items = [];
            this.appliedCoupon = null;
            this.saveCart();
        },

        applyCoupon(code: string) {
            // This would typically validate against an API
            // For now, we'll simulate with some example coupons
            const coupons = [
                { code: 'WELCOME10', discountPercentage: 10 },
                { code: 'WHOLESALE20', discountPercentage: 20 },
                { code: 'BULK15', discountPercentage: 15 }
            ];

            const coupon = coupons.find(c => c.code === code);

            if (coupon) {
                this.appliedCoupon = coupon;
                this.saveCart();
                return true;
            }

            return false;
        },

        removeCoupon() {
            this.appliedCoupon = null;
            this.saveCart();
        },

        updateCustomerInfo(customerInfo: Partial<CustomerInfo>) {
            this.customer = {
                ...this.customer,
                ...customerInfo,
                // Handle nested objects
                address: {
                    ...this.customer.address,
                    ...(customerInfo.address || {})
                },
                billingAddress: {
                    ...this.customer.billingAddress,
                    ...(customerInfo.billingAddress || {})
                }
            };
            this.saveCart();
        },

        saveCart() {
            if (process.client) {
                localStorage.setItem('cart', JSON.stringify({
                    items: this.items,
                    customer: this.customer,
                    appliedCoupon: this.appliedCoupon
                }));
            }
        },

        loadCart() {
            if (process.client) {
                const savedCart = localStorage.getItem('cart');

                if (savedCart) {
                    try {
                        const parsedCart = JSON.parse(savedCart);
                        this.items = parsedCart.items || [];
                        this.customer = parsedCart.customer || this.customer;
                        this.appliedCoupon = parsedCart.appliedCoupon || null;
                    } catch (error) {
                        console.error('Error loading cart from local storage:', error);
                    }
                }
            }
        },

        async submitOrder() {
            const order = {
                items: this.items.map(item => ({
                    productId: item.productId,
                    productName: item.name,
                    janCode: item.janCode,
                    sku: item.sku,
                    variantId: item.variantId,
                    variantName: item.variant?.name,
                    quantity: item.quantity,
                    unitPrice: item.price,
                    totalPrice: item.price * item.quantity,
                    notes: item.notes
                })),
                customer: this.customer,
                pricing: this.priceSummary,
                coupon: this.appliedCoupon,
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            try {
                const { data, error } = await useFetch('/api/orders', {
                    method: 'POST',
                    body: order
                });

                if (error.value) {
                    throw new Error(error.value.message || 'Failed to submit order');
                }

                // Clear cart after successful order
                this.clearCart();

                return { success: true, orderId: data.value.orderId };
            } catch (error: any) {
                console.error('Error submitting order:', error);
                return { success: false, error: error.message || 'Failed to submit order' };
            }
        }
    }
});