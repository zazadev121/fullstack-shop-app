import { Injectable, signal } from '@angular/core';

export type SupportedLanguage = 'en' | 'ge';

const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Navbar
    'HOME': 'Home', 'SHOP': 'Shop', 'CART': 'Cart', 'WISHLIST': 'Wishlist', 
    'ORDERS': 'Orders', 'ADMIN': 'Admin', 'LOGOUT': 'LOGOUT', 'LOGIN': 'Login', 'SIGNUP': 'Sign Up',
    
    // Home
    'HERO_BADGE': 'SYSTEM UPDATE: New Arrivals are here!',
    'HERO_TITLE_1': 'MODERN DEALS', 'HERO_TITLE_2': 'REDEFINED.',
    'HERO_SUBTITLE': 'Discover our curated collection of premium products. Experience fast delivery, secure payments, and dedicated customer support.',
    'START_SHOPPING': 'START SHOPPING', 'VIEW_ALL_OFFERS': 'VIEW ALL OFFERS',
    'FAST_DELIVERY': 'FAST DELIVERY', 'FAST_DELIVERY_SUB': '24-48H SHIPPING',
    'SECURE_PAYMENTS': 'SECURE PAYMENTS', 'SECURE_PAYMENTS_SUB': 'TRUSTED GATEWAY',
    'BEST_OFFERS': 'BEST OFFERS', 'BEST_OFFERS_SUB': 'The biggest discounts available today across all categories.',
    'SHOP_ALL_PRODUCTS': 'SHOP ALL PRODUCTS \u2192',
    'LOADING_DEALS': 'Loading best deals...', 'NO_DEALS_FOUND': 'No active deals found at the moment.',
    'BROWSE_PRODUCTS': 'BROWSE PRODUCTS', 'OFF': 'OFF',
    'FREE_SHIPPING': 'FREE SHIPPING', 'FREE_SHIPPING_SUB': 'Free delivery on all orders over $50.',
    'EASY_RETURNS': 'EASY RETURNS', 'EASY_RETURNS_SUB': '30-day money back guarantee.',
    'SECURE_SHOPPING': 'SECURE SHOPPING', 'SECURE_SHOPPING_SUB': 'Safe and protected transactions.',
    'SUPPORT': '24/7 SUPPORT', 'SUPPORT_SUB': 'Our team is always here to help.',

    // Shop
    'EXPLORE_COLLECTION': 'Explore Collection',
    'PRODUCTS_FOUND': 'products found', 'PRODUCT_FOUND': 'product found',
    'SORT_BY': 'Sort by', 'PRICE_LOW_HIGH': 'Price: Low \u2192 High', 'PRICE_HIGH_LOW': 'Price: High \u2192 Low', 'NAME_A_Z': 'Name A\u2013Z',
    'FILTERS': 'FILTERS', 'RESET': 'RESET', 'SEARCH_PRODUCTS': 'Search Products',
    'SEARCH_PLACEHOLDER': 'Search keywords...', 'PRICE_RANGE': 'Price Range',
    'PRODUCT_CATEGORIES': 'Product Categories', 'STATUS_FILTERS': 'Status Filters',
    'IN_STOCK': 'IN STOCK', 'ON_SALE': 'ON SALE', 'OUT_OF_STOCK': 'OUT OF STOCK',
    'UNITS': 'UNITS', 'EMPTY': 'EMPTY',
    'NO_PRODUCTS_FOUND': 'NO PRODUCTS FOUND', 'MODIFY_SEARCH': 'Modify search parameters and re-scan.', 'RESET_FILTERS': 'RESET FILTERS',

    // Details Component
    'BACK_TO_SHOP': '\u2190 Back to Shop', 'CATEGORY': 'Category', 'BRAND_NEW': 'Brand New',
    'DISCOUNT': 'Discount', 'BUY_NOW': 'BUY NOW \u2192', 'ADD_TO_CART': 'ADD TO CART',
    'LOGIN_TO_PURCHASE': 'LOGIN TO PURCHASE', 'PRODUCT_SPECS': 'Full Specifications',
    'DELIVERY': 'Delivery Info', 'SPECS_DESC': 'Premium grade materials and manufacturing.',
    'DELIVERY_DESC': 'Ships within 24 hours. Free returns for 30 days.',

    // Cart / Wishlist / Orders
    'SHOPPING_CART': 'Shopping Cart', 'CART_EMPTY': 'Your cart is completely empty.',
    'CONTINUE_SHOPPING': 'CONTINUE SHOPPING', 'PRODUCT': 'Product', 'PRICE': 'Price',
    'QUANTITY': 'Quantity', 'TOTAL': 'Total', 'REMOVE': 'REMOVE', 'ORDER_SUMMARY': 'Order Summary',
    'SUBTOTAL': 'Subtotal', 'DISCOUNT_APPLIED': 'Discount Applied', 'TOTAL_AMOUNT': 'Total Amount',
    'PROCEED_CHECKOUT': 'PROCEED TO CHECKOUT', 'CHECKOUT_SUCCESS': 'Checkout Successful!',
    'MY_WISHLIST': 'My Wishlist', 'WISHLIST_EMPTY': 'Your wishlist is empty.',
    'MOVE_TO_CART': 'Move to Cart', 'MY_ORDERS': 'Order History', 'NO_ORDERS': 'You have no orders yet.',
    'ORDER_ID': 'Order ID', 'DATE': 'Date', 'ITEMS': 'Items', 'STATUS': 'Status',
    'ESTIMATED_DELIVERY': 'Est. Delivery', 'DELIVERED_ON': 'Delivered on',

    // Auth
    'WELCOME_BACK': 'Welcome Back', 'LOGIN_DESC': 'Access your account to manage orders and wishlist.',
    'EMAIL_ADDRESS': 'Email Address', 'PASSWORD': 'Password', 'SIGN_IN': 'SIGN IN', 'PLEASE_WAIT': 'Please wait...',
    'DONT_HAVE_ACCOUNT': 'Don\'t have an account?', 'CREATE_ONE': 'Register here',
    'CREATE_ACCOUNT': 'Create Account', 'REGISTER_DESC': 'Join today for exclusive products and fast checkout.',
    'FULL_NAME': 'Full Name', 'ALREADY_HAVE_ACCOUNT': 'Already have an account?', 'LOGIN_HERE': 'Login here',
    'FORGOT_PASSWORD': 'Forgot Password?',
    'PENDING': 'Pending', 'SHIPPED': 'Shipped', 'DELIVERED': 'Delivered', 'CANCELLED': 'Cancelled',
    'CANCEL_ORDER_CONFIRM': 'Are you sure you want to cancel order?', 'PERMANENT_ACTION': 'Warning: This action will permanently cancel this order request.',
    'SHOW': 'Show', 'HIDE': 'Hide',
    'FREE_ACCOUNT': 'Free account, no credit card needed', 'TRACK_ORDERS': 'Track orders in real time', 'SAVE_WISHLIST': 'Save items to your wishlist',
    'ERROR_OCCURRED': 'An error occurred. Please try again.', 'ORDER_CANCELLED': 'Order cancelled successfully.',

    // Admin
    'ADMIN_PANEL': 'ADMIN PANEL', 'ADMIN_SESSION_ACTIVE': 'ADMIN SESSION: ACTIVE', 'EXIT_ADMIN': 'EXIT ADMIN',
    'SYSTEM_OVERVIEW': 'System Overview', 'STATS_SUBTITLE': 'Real-time statistics and inventory monitoring.',
    'TOTAL_REVENUE': 'TOTAL REVENUE', 'ACTIVE_DISCOUNTS': 'ACTIVE DISCOUNTS', 'LOW_STOCK_ALERTS': 'Low Stock Alerts',
    'BEST_SELLING': 'Best Selling Products', 'RESTOCK': 'RESTOCK', 'THRESHOLD': 'ALERT THRESHOLD',
    'SCANNING_INVENTORY': 'Scanning inventory...', 'COMPILING_DATA': 'Compiling data...',
    'PRODUCT_INVENTORY': 'Product Inventory', 'ADD_NEW_PRODUCT': 'Add New Product',
    'CATEGORY_MANAGEMENT': 'Category Management', 'ADD_NEW_CATEGORY': 'Add New Category',
    'UPDATE_PRODUCT': 'Update Product', 'CREATE_PRODUCT': 'Create New Product',
    'UPDATE_CATEGORY': 'Update Category', 'CREATE_CATEGORY': 'Create New Category',
    'DELETE_CONFIRM': 'Are you sure you want to delete?', 'PERMANENT_DELETE': 'This action cannot be undone.',
    'DASHBOARD': 'DASHBOARD', 'CATEGORIES': 'CATEGORIES', 'USERS': 'USERS', 'PRODUCTS': 'PRODUCTS'
  },
  ge: {
    // Navbar
    'HOME': 'მთავარი', 'SHOP': 'მაღაზია', 'CART': 'კალათა', 'WISHLIST': 'სურვილები', 
    'ORDERS': 'შეკვეთები', 'ADMIN': 'ადმინი', 'LOGOUT': 'გასვლა', 'LOGIN': 'შესვლა', 'SIGNUP': 'რეგისტრაცია',

    // Home
    'HERO_BADGE': 'სისტემის განახლება: ახალი კოლექცია აქ არის!',
    'HERO_TITLE_1': 'თანამედროვე', 'HERO_TITLE_2': 'შეთავაზებები.',
    'HERO_SUBTITLE': 'აღმოაჩინეთ პრემიუმ პროდუქტების კოლექცია. ისიამოვნეთ სწრაფი მიწოდებით და უსაფრთხო გადახდით.',
    'START_SHOPPING': 'შოპინგის დაწყება', 'VIEW_ALL_OFFERS': 'ყველა შეთავაზება',
    'FAST_DELIVERY': 'სწრაფი მიწოდება', 'FAST_DELIVERY_SUB': '24-48სთ მიწოდება',
    'SECURE_PAYMENTS': 'დაცული გადახდა', 'SECURE_PAYMENTS_SUB': 'სანდო სისტემა',
    'BEST_OFFERS': 'საუკეთესო ფასდაკლებები', 'BEST_OFFERS_SUB': 'ყველაზე დიდი ფასდაკლებები ყველა კატეგორიაში.',
    'SHOP_ALL_PRODUCTS': 'ყველა პროდუქტი \u2192',
    'LOADING_DEALS': 'იტვირთება...', 'NO_DEALS_FOUND': 'აქტიური ფასდაკლებები ვერ მოიძებნა.',
    'BROWSE_PRODUCTS': 'პროდუქტების ნახვა', 'OFF': 'ფასდაკლება',
    'FREE_SHIPPING': 'უფასო მიწოდება', 'FREE_SHIPPING_SUB': 'უფასო მიწოდება 50$-ის ზემოთ.',
    'EASY_RETURNS': 'მარტივი დაბრუნება', 'EASY_RETURNS_SUB': '30 დღიანი გარანტია.',
    'SECURE_SHOPPING': 'უსაფრთხო შოპინგი', 'SECURE_SHOPPING_SUB': 'დაცული ტრანზაქციები.',
    'SUPPORT': '24/7 მხარდაჭერა', 'SUPPORT_SUB': 'ჩვენი გუნდი მუდამ მზადაა დასახმარებლად.',

    // Shop
    'EXPLORE_COLLECTION': 'აღმოაჩინე კოლექცია',
    'PRODUCTS_FOUND': 'პროდუქტი ნაპოვნია', 'PRODUCT_FOUND': 'პროდუქტი ნაპოვნია',
    'SORT_BY': 'დალაგება', 'PRICE_LOW_HIGH': 'ფასი: ზრდადი', 'PRICE_HIGH_LOW': 'ფასი: კლებადი', 'NAME_A_Z': 'სახელი A\u2013Z',
    'FILTERS': 'ფილტრები', 'RESET': 'გასუფთავება', 'SEARCH_PRODUCTS': 'პროდუქტის ძებნა',
    'SEARCH_PLACEHOLDER': 'ძებნა...', 'PRICE_RANGE': 'ფასის დიაპაზონი',
    'PRODUCT_CATEGORIES': 'კატეგორიები', 'STATUS_FILTERS': 'სტატუსი',
    'IN_STOCK': 'მარაგშია', 'ON_SALE': 'ფასდაკლება', 'OUT_OF_STOCK': 'მარაგი ამოიწურა',
    'UNITS': 'ცალი', 'EMPTY': 'ცარიელია',
    'NO_PRODUCTS_FOUND': 'პროდუქტი ვერ მოიძებნა', 'MODIFY_SEARCH': 'შეცვალეთ ძებნის პარამეტრები.', 'RESET_FILTERS': 'ფილტრების გასუფთავება',

    // Details Component
    'BACK_TO_SHOP': '\u2190 მაღაზიაში დაბრუნება', 'CATEGORY': 'კატეგორია', 'BRAND_NEW': 'Ახალი',
    'DISCOUNT': 'ფასდაკლება', 'BUY_NOW': 'ყიდვა \u2192', 'ADD_TO_CART': 'კალათაში დამატება',
    'LOGIN_TO_PURCHASE': 'ავტორიზაცია საყიდლად', 'PRODUCT_SPECS': 'სრული მონაცემები',
    'DELIVERY': 'მიწოდების ინფორმაცია', 'SPECS_DESC': 'პრემიუმ ხარისხის მასალები და წარმოება.',
    'DELIVERY_DESC': 'იგზავნება 24 საათში. უფასო დაბრუნება 30 დღე.',

    // Cart / Wishlist / Orders
    'SHOPPING_CART': 'კალათა', 'CART_EMPTY': 'თქვენი კალათა ცარიელია.',
    'CONTINUE_SHOPPING': 'შოპინგის გაგრძელება', 'PRODUCT': 'პროდუქტი', 'PRICE': 'ფასი',
    'QUANTITY': 'რაოდენობა', 'TOTAL': 'ჯამი', 'REMOVE': 'წაშლა', 'ORDER_SUMMARY': 'შეკვეთის შეჯამება',
    'SUBTOTAL': 'ქვეჯამი', 'DISCOUNT_APPLIED': 'ფასდაკლება', 'TOTAL_AMOUNT': 'სულ გადასახდელი',
    'PROCEED_CHECKOUT': 'ყიდვის დასრულება', 'CHECKOUT_SUCCESS': 'შეკვეთა მიღებულია!',
    'MY_WISHLIST': 'ჩემი სურვილები', 'WISHLIST_EMPTY': 'სურვილების სია ცარიელია.',
    'MOVE_TO_CART': 'კალათაში გადატანა', 'MY_ORDERS': 'ჩემი შეკვეთები', 'NO_ORDERS': 'შეკვეთები ჯერ არ გაქვთ.',
    'ORDER_ID': 'შეკვეთის ID', 'DATE': 'თარიღი', 'ITEMS': 'ნივთი', 'STATUS': 'სტატუსი',
    'ESTIMATED_DELIVERY': 'მიწოდების დრო', 'DELIVERED_ON': 'მიწოდების თარიღი',

    // Auth
    'WELCOME_BACK': 'კეთილი იყოს თქვენი მობრძანება', 'LOGIN_DESC': 'შედით თქვენს ანგარიშზე სამართავად.',
    'EMAIL_ADDRESS': 'ელ. ფოსტა', 'PASSWORD': 'პაროლი', 'SIGN_IN': 'შესვლა', 'PLEASE_WAIT': 'გთხოვთ დაელოდოთ...',
    'DONT_HAVE_ACCOUNT': 'არ გაქვთ ანგარიში?', 'CREATE_ONE': 'შექმენით აქ',
    'CREATE_ACCOUNT': 'რეგისტრაცია', 'REGISTER_DESC': 'შემოგვიერთდით დღესვე.',
    'FULL_NAME': 'სრული სახელი', 'ALREADY_HAVE_ACCOUNT': 'უკვე გაქვთ ანგარიში?', 'LOGIN_HERE': 'ავტორიზაცია',
    'FORGOT_PASSWORD': 'დაგავიწყდათ პაროლი?',
    'PENDING': 'მუშავდება', 'SHIPPED': 'გამოგზავნილია', 'DELIVERED': 'ჩაბარებულია', 'CANCELLED': 'გაუქმებულია',
    'CANCEL_ORDER_CONFIRM': 'ნამდვილად გსურთ შეკვეთის გაუქმება?', 'PERMANENT_ACTION': 'გაფრთხილება: ეს მოქმედება საბოლოოდ გააუქმებს თქვენს შეკვეთას.',
    'SHOW': 'ჩვენება', 'HIDE': 'დამალვა',
    'FREE_ACCOUNT': 'უფასო ანგარიში, ბარათი არ არის საჭირო', 'TRACK_ORDERS': 'აკონტროლეთ შეკვეთები რეალურ დროში', 'SAVE_WISHLIST': 'შეინახეთ პროდუქტები სურვილების სიაში',
    'ERROR_OCCURRED': 'დაფიქსირდა შეცდომა. გთხოვთ სცადოთ მოგვიანებით.', 'ORDER_CANCELLED': 'შეკვეთა წარმატებით გაუქმდა.',

    // Admin
    'ADMIN_PANEL': 'ადმინ პანელი', 'ADMIN_SESSION_ACTIVE': 'ადმინ სესია: აქტიური', 'EXIT_ADMIN': 'გასვლა ადმინიდან',
    'SYSTEM_OVERVIEW': 'სისტემის მიმოხილვა', 'STATS_SUBTITLE': 'სტატისტიკა და ინვენტარის მონიტორინგი რეალურ დროში.',
    'TOTAL_REVENUE': 'მთლიანი შემოსავალი', 'ACTIVE_DISCOUNTS': 'აქტიური ფასდაკლებები', 'LOW_STOCK_ALERTS': 'დაბალი მარაგის შეტყობინებები',
    'BEST_SELLING': 'ყველაზე გაყიდვადი პროდუქტები', 'RESTOCK': 'მარაგის შევსება', 'THRESHOLD': 'შეტყობინების ზღვარი',
    'SCANNING_INVENTORY': 'ინვენტარის სკანირება...', 'COMPILING_DATA': 'მონაცემების დამუშავება...',
    'PRODUCT_INVENTORY': 'პროდუქტების ინვენტარი', 'ADD_NEW_PRODUCT': 'ახალი პროდუქტის დამატება',
    'CATEGORY_MANAGEMENT': 'კატეგორიების მართვა', 'ADD_NEW_CATEGORY': 'ახალი კატეგორიის დამატება',
    'UPDATE_PRODUCT': 'პროდუქტის განახლება', 'CREATE_PRODUCT': 'ახალი პროდუქტის შექმნა',
    'UPDATE_CATEGORY': 'კატეგორიის განახლება', 'CREATE_CATEGORY': 'ახალი კატეგორიის შექმნა',
    'DELETE_CONFIRM': 'ნამდვილად გსურთ წაშლა?', 'PERMANENT_DELETE': 'ეს მოქმედება შეუქცევადია.',
    'DASHBOARD': 'მთავარი გვერდი', 'CATEGORIES': 'კატეგორიები', 'USERS': 'მომხმარებლები', 'PRODUCTS': 'პროდუქტები'
  }
};

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  currentLang = signal<SupportedLanguage>('en');

  constructor() {
    const saved = localStorage.getItem('lang') as SupportedLanguage;
    if (saved && (saved === 'en' || saved === 'ge')) {
      this.currentLang.set(saved);
    }
  }

  setLanguage(lang: SupportedLanguage) {
    this.currentLang.set(lang);
    localStorage.setItem('lang', lang);
  }

  translate(key: string): string {
    return TRANSLATIONS[this.currentLang()][key] || key;
  }
}
