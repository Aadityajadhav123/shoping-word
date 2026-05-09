import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import bannerOne from "@/assets/banner-1.webp";
import bannerTwo from "@/assets/banner-2.webp";
import bannerThree from "@/assets/banner-3.webp";

import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
];

const slides = [bannerOne, bannerTwo, bannerThree];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const getSlideImage = (item, fallbackIndex) => {
    if (!item) return slides[fallbackIndex % slides.length];
    const rawUrl = typeof item === 'string' ? item : (item.image || item.imageUrl || item.url);
    if (!rawUrl) return slides[fallbackIndex % slides.length];
    // If URL is relative (starts with /), prepend the API base URL
    if (rawUrl.startsWith('/') && !rawUrl.startsWith('//')) {
      const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
      return `${baseUrl}${rawUrl}`;
    }
    // If already absolute URL (starts with http), use as-is
    return rawUrl.startsWith('http') ? rawUrl : rawUrl;
  };

  const displaySlides = (() => {
    if (featureImageList && Array.isArray(featureImageList) && featureImageList.length > 0) {
      return featureImageList.map((item, idx) => ({ image: getSlideImage(item, idx) }));
    }
    return slides.map((src, i) => ({ image: src }));
  })();

  const minSwipeDistance = 50;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
  }, [displaySlides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);
  }, [displaySlides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "🎉 Product added to cart!",
          duration: 2000,
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({
      filterParams: {},
      sortParams: "price-lowtohigh",
    }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  useEffect(() => {
    if (displaySlides.length <= 1) return;
    const timer = setInterval(() => nextSlide(), 5000);
    return () => clearInterval(timer);
  }, [displaySlides.length, nextSlide]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

   return (
     <div className="flex flex-col min-h-screen">
        {/* Hero Carousel */}
        <div className="relative w-full h-[70vh] min-h-[500px] md:h-[85vh] overflow-hidden bg-gray-900">
          {displaySlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {imageErrors[index] ? (
                <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
                  <div className="text-center text-white/50">
                    <div className="text-4xl font-bold mb-2">{index + 1}</div>
                    <div className="text-sm">Slide {index + 1}</div>
                  </div>
                </div>
              ) : (
                <img
                  src={slide?.image || bannerThree}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                  onError={() => handleImageError(index)}
                />
              )}
            </div>
          ))}

         {/* Gradient Overlay */}
         <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
         <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none" />

         {/* Hero Text Overlay */}
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-4">
           <div className="text-center text-white max-w-4xl animate-slide-up">
             
             <Button
               size="lg"
               className="bg-white text-gray-900 hover:bg-gray-100 shadow-xl animate-scale-in text-sm md:text-base px-6 md:px-8 py-2 md:py-6 mt-12 cursor-pointer"
               onClick={() => navigate("/shop/listing")}
             >
               Shop Now
             </Button>
           </div>
         </div>

         {/* Navigation Arrows - Hidden on mobile, use swipe */}
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 shadow-lg rounded-full p-2 md:p-3 hidden md:flex z-20 items-center justify-center"
          aria-label="Previous slide"
        >
          <ChevronLeftIcon className="w-5 h-5 md:w-6 md:h-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 shadow-lg rounded-full p-2 md:p-3 hidden md:flex z-20 items-center justify-center"
          aria-label="Next slide"
        >
          <ChevronRightIcon className="w-5 h-5 md:w-6 md:h-6" />
        </Button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 md:gap-3 z-20 px-4">
          {displaySlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white w-8 md:w-10 scale-110"
                  : "bg-white/50 w-8 h-2 md:w-3 md:h-3 hover:bg-white/75 hover:w-4"
              } ${index === currentSlide ? "h-2.5 md:h-3" : "h-2"}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Categories Section with gradient background */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Explore</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Shop by Category
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {categoriesWithIcon.map((categoryItem, idx) => (
              <Card
                key={categoryItem.id}
                onClick={() => handleNavigateToListingPage(categoryItem, "category")}
                className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white shadow-md group animate-slide-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 mb-3 group-hover:scale-110 transition-transform duration-300">
                    <categoryItem.icon className="w-8 h-8 text-indigo-600" />
                  </div>
                  <span className="font-bold text-base">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Popular</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Top Brands
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {brandsWithIcon.map((brandItem, idx) => (
              <Card
                key={brandItem.id}
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gray-50 shadow-sm group animate-slide-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 mb-3 group-hover:scale-110 transition-transform duration-300">
                    <brandItem.icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <span className="font-bold text-base">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products with modern grid */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div>
              <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Collection</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-1 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Featured Products
              </h2>
            </div>
            <Button
              variant="outline"
              className="hidden md:flex border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              onClick={() => navigate("/shop/listing")}
            >
              View All
            </Button>
          </div>
           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
             {Array.isArray(productList) && productList.length > 0
               ? productList.slice(0, 8).map((productItem, idx) => (
                   <div key={productItem._id} className="animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
                     <ShoppingProductTile
                       handleGetProductDetails={handleGetProductDetails}
                       product={productItem}
                       handleAddtoCart={handleAddtoCart}
                     />
                   </div>
                 ))
               : null}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Button
              variant="outline"
              className="border-indigo-200 text-indigo-600"
              onClick={() => navigate("/shop/listing")}
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Subscribe to our newsletter and get 10% off your first order plus exclusive access to new arrivals.
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <Input
              type="email"
              placeholder="Enter your email"
              className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
            />
            <Button
              variant="secondary"
              className="h-12 px-6 bg-white text-indigo-600 hover:bg-gray-100"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
       </div>
     );
}

export default ShoppingHome;

