// stores/products.ts
import { defineStore } from 'pinia';
import type { Product, ProductImage, ProductFilter } from '~/types';

interface ImportResult {
    success: boolean;
    importedCount?: number;
    invalidItems?: Array<{
        product: Partial<Product>;
        reasons: string[];
        rowIndex?: number;
    }>;
    error?: string;
    validationSummary?: Record<string, any>;
    janCodeExamples?: string[];
}

interface UploadImageResult {
    success: boolean;
    uploadedCount?: number;
    skippedCount?: number;
    error?: string;
}

export const useProductStore = defineStore('products', {
    state: () => ({
        products: [] as Product[],
        featuredProducts: [] as Product[],
        newArrivals: [] as Product[],
        currentProduct: null as Product | null,
        loading: false,
        error: null as string | null,
        categories: [] as string[],
        brands: [] as string[],
        filters: {
            categories: [],
            brands: [],
            tags: [],
            minPrice: 0,
            maxPrice: 0,
            inStock: false,
            query: ''
        } as ProductFilter
    }),

    getters: {
        getProductById: (state) => (id: string) => {
            return state.products.find(p => p.id === id) || null;
        },

        getProductsByCategory: (state) => (category: string) => {
            return state.products.filter(p => p.category === category && p.isActive);
        },

        getActiveProducts: (state) => {
            return state.products.filter(p => p.isActive);
        },

        filteredProducts: (state) => {
            // Guard against null products array
            if (!state.products) {
                return [];
            }

            let filtered = state.products.filter(p => p.isActive);

            // Apply category filter
            if (state.filters.categories && state.filters.categories.length > 0) {
                filtered = filtered.filter(p => state.filters.categories.includes(p.category));
            }

            // Apply brand filter
            if (state.filters.brands && state.filters.brands.length > 0) {
                filtered = filtered.filter(p => state.filters.brands.includes(p.brand));
            }

            // Apply tags filter
            if (state.filters.tags && state.filters.tags.length > 0) {
                filtered = filtered.filter(p =>
                    p.tags && p.tags.some(tag => state.filters.tags.includes(tag))
                );
            }

            // Apply price range filter
            if (state.filters.minPrice > 0) {
                filtered = filtered.filter(p => p.pricing.basePrice >= state.filters.minPrice);
            }

            if (state.filters.maxPrice > 0) {
                filtered = filtered.filter(p => p.pricing.basePrice <= state.filters.maxPrice);
            }

            // Apply in-stock filter
            if (state.filters.inStock) {
                filtered = filtered.filter(p => p.stock > 0);
            }

            // Apply search query
            if (state.filters.query) {
                const query = state.filters.query.toLowerCase();
                filtered = filtered.filter(p =>
                    (p.name && p.name.toLowerCase().includes(query)) ||
                    (p.description && p.description.toLowerCase().includes(query)) ||
                    (p.janCode && p.janCode.toLowerCase().includes(query)) ||
                    (p.sku && p.sku.toLowerCase().includes(query)) ||
                    (p.brand && p.brand.toLowerCase().includes(query)) ||
                    (p.tags && p.tags.some(tag => tag.toLowerCase().includes(query)))
                );
            }

            return filtered;
        },

        priceRange: (state) => {
            if (!state.products || state.products.length === 0) return { min: 0, max: 0 };

            const prices = state.products
                .filter(p => p.isActive && p.pricing && p.pricing.basePrice)
                .map(p => p.pricing.basePrice);

            if (prices.length === 0) return { min: 0, max: 0 };

            return {
                min: Math.min(...prices),
                max: Math.max(...prices)
            };
        }
    },

    actions: {
        async fetchProducts(filters = {}) {
            this.loading = true;
            this.error = null;

            try {
                // Build query string from filters
                const queryParams = new URLSearchParams();
                Object.entries(filters).forEach(([key, value]) => {
                    if (value) queryParams.append(key, value.toString());
                });

                const queryString = queryParams.toString();
                const url = queryString ? `/api/products?${queryString}` : '/api/products';

                console.log('Fetching products from URL:', url);
                const { data, error } = await useFetch(url);

                if (error.value) {
                    throw new Error(error.value.message || 'Failed to fetch products');
                }

                // Handle empty response
                if (!data.value) {
                    console.warn('No products data returned from API');
                    this.products = [];
                    return;
                }

                // Safe assignment with type checking
                if (Array.isArray(data.value)) {
                    this.products = data.value as Product[];
                } else {
                    console.warn('Unexpected response format from API:', data.value);
                    this.products = [];
                    return;
                }

                // Extract featured products
                this.featuredProducts = this.products.filter(p => p.isFeatured && p.isActive) || [];

                // Extract new arrivals
                this.newArrivals = this.products
                    .filter(p => p.isNew && p.isActive)
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) || [];

                // Extract unique categories
                const uniqueCategories = new Set<string>();
                this.products.forEach(p => {
                    if (p.category) uniqueCategories.add(p.category);
                });
                this.categories = Array.from(uniqueCategories);

                // Extract unique brands
                const uniqueBrands = new Set<string>();
                this.products.forEach(p => {
                    if (p.brand) uniqueBrands.add(p.brand);
                });
                this.brands = Array.from(uniqueBrands);

                // Set initial price range for filters
                const { min, max } = this.priceRange;
                this.filters.minPrice = min;
                this.filters.maxPrice = max;

                console.log(`Fetched ${this.products.length} products`);
            } catch (error: any) {
                this.error = error.message || 'Failed to fetch products';
                console.error('Error fetching products:', error);
                // Initialize with empty arrays to prevent null reference errors
                this.products = [];
                this.featuredProducts = [];
                this.newArrivals = [];
            } finally {
                this.loading = false;
            }
        },

        async fetchProductById(id: string) {
            this.loading = true;
            this.error = null;

            try {
                console.log('Fetching product with ID:', id);
                const { data, error } = await useFetch(`/api/products/${id}`);

                if (error.value) {
                    throw new Error(error.value.message || `Failed to fetch product with ID: ${id}`);
                }

                if (data.value) {
                    // Store the product in the currentProduct ref
                    this.currentProduct = data.value as Product;

                    // Handle MongoDB _id vs id compatibility
                    if (this.currentProduct._id && !this.currentProduct.id) {
                        this.currentProduct.id = this.currentProduct._id.toString();
                    }

                    // Also add it to the products array if it's not already there
                    const existingIndex = this.products.findIndex(p =>
                        p.id === id ||
                        (p._id && p._id.toString() === id)
                    );

                    if (existingIndex >= 0) {
                        // Update existing product
                        this.products[existingIndex] = this.currentProduct;
                    } else {
                        // Add new product
                        this.products.push(this.currentProduct);
                    }

                    return this.currentProduct;
                } else {
                    this.error = 'Product not found';
                    return null;
                }
            } catch (error: any) {
                this.error = error.message || `Failed to fetch product with ID: ${id}`;
                console.error(`Error fetching product ${id}:`, error);
                return null;
            } finally {
                this.loading = false;
            }
        },

        async createProduct(productData: Partial<Product>) {
            this.loading = true;
            this.error = null;

            try {
                const { data, error } = await useFetch('/api/products', {
                    method: 'POST',
                    body: productData
                });

                if (error.value) {
                    throw new Error(error.value.message || 'Failed to create product');
                }

                // Refresh product list after creating new product
                await this.fetchProducts();

                return data.value;
            } catch (error: any) {
                this.error = error.message || 'Failed to create product';
                console.error('Error creating product:', error);
                return null;
            } finally {
                this.loading = false;
            }
        },

        async updateProduct(id: string, productData: Partial<Product>) {
            this.loading = true;
            this.error = null;

            try {
                const { data, error } = await useFetch(`/api/products/${id}`, {
                    method: 'PUT',
                    body: productData
                });

                if (error.value) {
                    throw new Error(error.value.message || 'Failed to update product');
                }

                // Update the product in the store
                const updatedProduct = data.value as Product;

                // Handle MongoDB _id vs id compatibility
                if (updatedProduct._id && !updatedProduct.id) {
                    updatedProduct.id = updatedProduct._id.toString();
                }

                // Find and update the product in the products array
                const index = this.products.findIndex(p =>
                    p.id === id ||
                    (p._id && p._id.toString() === id)
                );

                if (index !== -1) {
                    this.products[index] = updatedProduct;
                }

                // Update currentProduct if it's the same product
                if (this.currentProduct &&
                    (this.currentProduct.id === id ||
                        (this.currentProduct._id && this.currentProduct._id.toString() === id))) {
                    this.currentProduct = updatedProduct;
                }

                return updatedProduct;
            } catch (error: any) {
                this.error = error.message || 'Failed to update product';
                console.error(`Error updating product ${id}:`, error);
                return null;
            } finally {
                this.loading = false;
            }
        },

        async deleteProduct(id: string) {
            this.loading = true;
            this.error = null;

            try {
                const { error } = await useFetch(`/api/products/${id}`, {
                    method: 'DELETE'
                });

                if (error.value) {
                    throw new Error(error.value.message || 'Failed to delete product');
                }

                // Remove the product from the store
                this.products = this.products.filter(p =>
                    p.id !== id &&
                    (!p._id || p._id.toString() !== id)
                );

                // Clear currentProduct if it's the deleted product
                if (this.currentProduct &&
                    (this.currentProduct.id === id ||
                        (this.currentProduct._id && this.currentProduct._id.toString() === id))) {
                    this.currentProduct = null;
                }

                return true;
            } catch (error: any) {
                this.error = error.message || 'Failed to delete product';
                console.error(`Error deleting product ${id}:`, error);
                return false;
            } finally {
                this.loading = false;
            }
        },

        // Import products directly from transformed data
        async importProductsFromData(productsData: Partial<Product>[]): Promise<ImportResult> {
            this.loading = true;
            this.error = null;

            try {
                if (!productsData || productsData.length === 0) {
                    return {
                        success: false,
                        error: 'No product data provided'
                    };
                }

                console.log(`Importing ${productsData.length} products...`);
                console.log('Sample product data:', productsData[0]);

                // Validate products before sending to the server
                const validProducts: Partial<Product>[] = [];
                const invalidItems: {
                    product: Partial<Product>;
                    reasons: string[];
                    rowIndex: number;
                }[] = [];

                // Validation summary for error reporting
                const validationSummary = {
                    missingName: 0,
                    missingJanCode: 0,
                    missingSku: 0,
                    invalidPrice: 0,
                    duplicateJanCode: 0,
                    otherErrors: 0
                };

                // Track JAN codes for duplicate detection
                const janCodes = new Set<string>();
                const janCodeExamples: string[] = [];

                productsData.forEach((product, index) => {
                    const validationErrors: string[] = [];

                    // Check required fields
                    if (!product.name) {
                        validationErrors.push('Product name is required');
                        validationSummary.missingName++;
                    }

                    if (!product.janCode) {
                        validationErrors.push('JAN Code is required');
                        validationSummary.missingJanCode++;
                    }

                    if (!product.sku) {
                        validationErrors.push('SKU is required');
                        validationSummary.missingSku++;
                    }

                    if (!product.pricing?.basePrice || product.pricing.basePrice <= 0) {
                        validationErrors.push('Base price must be greater than 0');
                        validationSummary.invalidPrice++;
                    }

                    // JAN Code format check - relaxed for better compatibility with various formats
                    if (product.janCode) {
                        // Clean the JAN code by removing non-numeric characters
                        const cleanJanCode = product.janCode.replace(/[^0-9]/g, '');

                        if (cleanJanCode.length < 8 || cleanJanCode.length > 14) {
                            validationErrors.push(`JAN Code "${product.janCode}" has invalid length (should be 8-14 digits)`);

                            // Collect problematic JAN codes for reporting
                            if (janCodeExamples.length < 5) {
                                janCodeExamples.push(product.janCode);
                            }
                        }

                        // Standardize JAN code
                        product.janCode = cleanJanCode;

                        // Check for duplicate JAN codes within the import data
                        if (janCodes.has(cleanJanCode)) {
                            validationErrors.push(`Duplicate JAN Code (${cleanJanCode}) found in import data`);
                            validationSummary.duplicateJanCode++;
                        } else {
                            janCodes.add(cleanJanCode);
                        }
                    }

                    if (validationErrors.length === 0) {
                        validProducts.push(product);
                    } else {
                        invalidItems.push({
                            product,
                            reasons: validationErrors,
                            rowIndex: index
                        });

                        // Count other errors
                        if (!validationErrors.some(err =>
                            err.includes('name') ||
                            err.includes('JAN Code') ||
                            err.includes('SKU') ||
                            err.includes('price'))) {
                            validationSummary.otherErrors++;
                        }
                    }
                });

                if (validProducts.length === 0) {
                    console.error('No valid products found after validation');
                    return {
                        success: false,
                        error: 'No valid products to import',
                        invalidItems,
                        validationSummary,
                        janCodeExamples
                    };
                }

                console.log(`Found ${validProducts.length} valid products after validation`);

                // Send valid products to the API
                const { data, error } = await useFetch('/api/admin/products/batch', {
                    method: 'POST',
                    body: { products: validProducts }
                });

                if (error.value) {
                    throw new Error(error.value.message || 'Failed to import products');
                }

                // Refresh products list
                await this.fetchProducts();

                return {
                    success: true,
                    importedCount: validProducts.length,
                    invalidItems
                };
            } catch (error: any) {
                this.error = error.message || 'Failed to import products';
                console.error('Error importing products:', error);

                return {
                    success: false,
                    error: error.message || 'Failed to import products',
                    invalidItems: []
                };
            } finally {
                this.loading = false;
            }
        },

        // Original method for Excel file upload (kept for backward compatibility)
        async uploadProductsFromExcel(file: File) {
            this.loading = true;
            this.error = null;

            try {
                const formData = new FormData();
                formData.append('file', file);

                const { data, error } = await useFetch('/api/admin/products', {
                    method: 'POST',
                    body: formData
                });

                if (error.value) {
                    throw new Error(error.value.message || 'Failed to upload products from Excel');
                }

                // Refresh products list
                await this.fetchProducts();
                return data.value;
            } catch (error: any) {
                this.error = error.message || 'Failed to upload products from Excel';
                console.error('Error uploading products:', error);
                return null;
            } finally {
                this.loading = false;
            }
        },

        // Upload product images with FormData
        async uploadProductImages(formData: FormData): Promise<UploadImageResult> {
            this.loading = true;
            this.error = null;

            try {
                const { data, error } = await useFetch('/api/admin/images', {
                    method: 'POST',
                    body: formData
                });

                if (error.value) {
                    throw new Error(error.value.message || 'Failed to upload product images');
                }

                // Return result
                return {
                    success: true,
                    uploadedCount: data.value?.uploadedCount || 0
                };
            } catch (error: any) {
                this.error = error.message || 'Failed to upload product images';
                console.error('Error uploading images:', error);

                return {
                    success: false,
                    error: error.message || 'Failed to upload product images'
                };
            } finally {
                this.loading = false;
            }
        },

        // Original method for single product image upload (kept for backward compatibility)
        async uploadProductImagesOld(janCode: string, files: File[]) {
            this.loading = true;
            this.error = null;

            try {
                const formData = new FormData();
                formData.append('janCode', janCode);

                files.forEach((file, index) => {
                    formData.append(`images`, file);
                });

                const { data, error } = await useFetch('/api/admin/images', {
                    method: 'POST',
                    body: formData
                });

                if (error.value) {
                    throw new Error(error.value.message || 'Failed to upload product images');
                }

                // Refresh products to get updated images
                await this.fetchProducts();
                return data.value;
            } catch (error: any) {
                this.error = error.message || 'Failed to upload product images';
                console.error('Error uploading images:', error);
                return null;
            } finally {
                this.loading = false;
            }
        },

        setFilters(filters: Partial<ProductFilter>) {
            this.filters = { ...this.filters, ...filters };
        },

        clearFilters() {
            this.filters = {
                categories: [],
                brands: [],
                tags: [],
                minPrice: this.priceRange.min,
                maxPrice: this.priceRange.max,
                inStock: false,
                query: ''
            };
        }
    }
});