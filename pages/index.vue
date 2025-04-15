<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12 md:py-24">
      <div class="container mx-auto px-4">
        <div class="md:flex items-center">
          <div class="md:w-1/2 md:pr-12">
            <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Your Trusted Wholesale Partner
            </h1>
            <p class="text-lg md:text-xl mb-8 text-primary-100">
              Premium products at competitive prices for your business needs.
              Streamlined ordering, reliable shipping, and exceptional service.
            </p>
            <div class="flex flex-wrap gap-4">
              <NuxtLink to="/products" class="btn-primary text-sm md:text-base md:py-3 md:px-6">
                Browse Products
              </NuxtLink>
              <NuxtLink to="/register" class="btn-outline bg-transparent border-white text-white hover:bg-white hover:bg-opacity-10 text-sm md:text-base md:py-3 md:px-6">
                Register Now
              </NuxtLink>
            </div>
          </div>
          <div class="md:w-1/2 mt-8 md:mt-0">
            <div class="relative">
              <div class="absolute inset-0 bg-white bg-opacity-10 rounded-lg transform -rotate-3"></div>
              <div class="absolute inset-0 bg-white bg-opacity-10 rounded-lg transform rotate-3"></div>
              <div class="relative bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg p-6 shadow-xl">
                <img
                    src="/images/hero-image.jpg"
                    alt="Wholesale Products"
                    class="rounded-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Wave divider -->
      <div class="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
        <svg class="absolute bottom-0 w-full h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path fill="#f9fafb" d="M0,32L60,42.7C120,53,240,75,360,80C480,85,600,75,720,58.7C840,43,960,21,1080,16C1200,11,1320,21,1380,26.7L1440,32L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"></path>
        </svg>
      </div>
    </section>

    <!-- Featured Categories Section -->
    <section class="py-12 md:py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-center mb-8">Browse By Category</h2>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <NuxtLink
              v-for="category in featuredCategories"
              :key="category.name"
              :to="`/products?category=${category.name}`"
              class="group relative overflow-hidden rounded-lg shadow-md"
          >
            <div class="aspect-w-1 aspect-h-1">
              <img
                  :src="category.image"
                  :alt="category.name"
                  class="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
              <div class="absolute bottom-0 left-0 right-0 p-4">
                <h3 class="text-white text-lg font-semibold">{{ category.name }}</h3>
                <p class="text-white text-sm opacity-90">{{ category.itemCount }} Products</p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl md:text-3xl font-bold">Featured Products</h2>
          <NuxtLink to="/products" class="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
            View All
            <svg class="h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </NuxtLink>
        </div>

        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>

        <div v-else-if="error" class="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
          {{ error }}
        </div>

        <div v-else-if="featuredProducts.length === 0" class="text-center py-12">
          <p class="text-secondary-500">No featured products available at the moment.</p>
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          <ProductCard
              v-for="product in featuredProducts"
              :key="product.id"
              :product="product"
          />
        </div>
      </div>
    </section>

    <!-- New Arrivals Section -->
    <section class="py-12 md:py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl md:text-3xl font-bold">New Arrivals</h2>
          <NuxtLink to="/products?sort=newest" class="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
            View All
            <svg class="h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </NuxtLink>
        </div>

        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>

        <div v-else-if="error" class="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
          {{ error }}
        </div>

        <div v-else-if="newArrivals.length === 0" class="text-center py-12">
          <p class="text-secondary-500">No new arrivals available at the moment.</p>
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          <ProductCard
              v-for="product in newArrivals"
              :key="product.id"
              :product="product"
          />
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-center mb-12">Why Choose Us</h2>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center p-6 rounded-lg border border-secondary-200 bg-white">
            <div class="w-16 h-16 mx-auto bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
              <svg class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Competitive Pricing</h3>
            <p class="text-secondary-600">Get the best wholesale prices with volume discounts and special deals for regular customers.</p>
          </div>

          <div class="text-center p-6 rounded-lg border border-secondary-200 bg-white">
            <div class="w-16 h-16 mx-auto bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
              <svg class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Quality Guaranteed</h3>
            <p class="text-secondary-600">All products are sourced from trusted suppliers and undergo rigorous quality checks.</p>
          </div>

          <div class="text-center p-6 rounded-lg border border-secondary-200 bg-white">
            <div class="w-16 h-16 mx-auto bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
              <svg class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Fast Shipping</h3>
            <p class="text-secondary-600">Efficient order processing and reliable shipping partners ensure timely delivery of your orders.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-12 md:py-16 bg-gradient-to-r from-primary-900 to-primary-800 text-white">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-center mb-12">What Our Customers Say</h2>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(testimonial, index) in testimonials" :key="index" class="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg p-6">
            <div class="flex items-start mb-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 rounded-full bg-primary-200 text-primary-700 flex items-center justify-center">
                  {{ testimonial.name.charAt(0) }}
                </div>
              </div>
              <div class="ml-4">
                <h3 class="font-semibold">{{ testimonial.name }}</h3>
                <p class="text-sm text-primary-200">{{ testimonial.company }}</p>
              </div>
            </div>
            <div class="mb-3 flex">
              <svg v-for="i in 5" :key="i" class="h-4 w-4" :class="i <= testimonial.rating ? 'text-yellow-300' : 'text-primary-200'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <p class="text-primary-100">{{ testimonial.comment }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4">
        <div class="bg-primary-50 rounded-xl p-8 md:p-12 text-center">
          <h2 class="text-2xl md:text-3xl font-bold text-primary-800 mb-4">Ready to Get Started?</h2>
          <p class="text-lg text-primary-600 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust us for their wholesale needs.
            Register today and get access to exclusive wholesale prices and offers.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <NuxtLink to="/register" class="btn-primary text-base md:text-lg py-3 px-8">
              Create an Account
            </NuxtLink>
            <NuxtLink to="/contact" class="btn-outline text-base md:text-lg py-3 px-8 text-primary-700 border-primary-300 hover:bg-primary-100">
              Contact Sales
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useProductStore } from '~/stores/products';

const productStore = useProductStore();
const { featuredProducts, newArrivals, loading, error } = storeToRefs(productStore);

// Featured categories (in a real app, this would come from an API)
const featuredCategories = [
  {
    name: 'Electronics',
    image: '/images/categories/electronics.jpg',
    itemCount: 258
  },
  {
    name: 'Home & Kitchen',
    image: '/images/categories/home-kitchen.jpg',
    itemCount: 197
  },
  {
    name: 'Fashion',
    image: '/images/categories/fashion.jpg',
    itemCount: 324
  },
  {
    name: 'Health & Beauty',
    image: '/images/categories/beauty.jpg',
    itemCount: 186
  }
];

// Testimonials (in a real app, this would come from an API)
const testimonials = [
  {
    name: 'John Smith',
    company: 'ABC Retail Corp',
    rating: 5,
    comment: 'The quality of the products and the customer service are exceptional. Our orders are always processed quickly and accurately.'
  },
  {
    name: 'Sarah Johnson',
    company: 'Johnson Supplies',
    rating: 5,
    comment: 'rock on! fuckers!"
  },
  {
    name: 'Robert Chen',
    company: 'Chen Electronics',
    rating: 4,
    comment: 'Competitive pricing and reliable delivery. The online ordering system makes it easy to manage our inventory and track orders.'
  }
];

// Fetch products on component mount
onMounted(async () => {
  if (productStore.products.length === 0) {
    await productStore.fetchProducts();
  }
});
</script>