// plugins/i18n.ts
import { createI18n } from 'vue-i18n'

// English translations
const en = {
    common: {
        home: 'Home',
        products: 'Products',
        categories: 'Categories',
        brands: 'Brands',
        account: 'Account',
        cart: 'Cart',
        login: 'Login',
        register: 'Register',
        about_us: 'About Us',
        contact: 'Contact',
        faq: 'FAQ'
    },
    hero: {
        title: 'Your Trusted Wholesale Partner',
        subtitle: 'Premium products at competitive prices for your business needs. Streamlined ordering, reliable shipping, and exceptional service.',
        browse_products: 'Browse Products',
        register_now: 'Register Now'
    },
    footer: {
        company_description: 'Your trusted partner for wholesale products. We offer competitive prices and quality products for businesses of all sizes.',
        quick_links: 'Quick Links',
        policies: 'Policies',
        privacy_policy: 'Privacy Policy',
        terms_of_service: 'Terms of Service',
        shipping_policy: 'Shipping Policy',
        return_policy: 'Return Policy',
        contact_us: 'Contact Us',
        business_hours: 'Mon-Fri, 9:00 AM - 6:00 PM JST',
        copyright: '© {year} WholesaleHub. All rights reserved.'
    }
}

// Korean translations
const ko = {
    common: {
        home: '홈',
        products: '제품',
        categories: '카테고리',
        brands: '브랜드',
        account: '계정',
        cart: '장바구니',
        login: '로그인',
        register: '회원가입',
        about_us: '회사 소개',
        contact: '문의하기',
        faq: '자주 묻는 질문'
    },
    hero: {
        title: '신뢰할 수 있는 도매 파트너',
        subtitle: '비즈니스 요구 사항에 맞는 경쟁력 있는 가격의 프리미엄 제품. 간소화된 주문, 신뢰할 수 있는 배송 및 탁월한 서비스.',
        browse_products: '제품 둘러보기',
        register_now: '지금 등록하기'
    },
    footer: {
        company_description: '귀하의 신뢰할 수 있는 도매 제품 파트너. 모든 규모의 기업을 위한 경쟁력 있는 가격과 품질 제품을 제공합니다.',
        quick_links: '빠른 링크',
        policies: '정책',
        privacy_policy: '개인정보 보호정책',
        terms_of_service: '서비스 약관',
        shipping_policy: '배송 정책',
        return_policy: '반품 정책',
        contact_us: '문의하기',
        business_hours: '영업시간: 월-금, 오전 9:00 - 오후 6:00 KST',
        copyright: '© {year} WholesaleHub. 모든 권리 보유.'
    }
}

export default defineNuxtPlugin(({ vueApp }) => {
    const i18n = createI18n({
        legacy: false,
        globalInjection: true,
        locale: 'ko', // Default locale
        messages: {
            en,
            ko
        }
    })

    vueApp.use(i18n)
})