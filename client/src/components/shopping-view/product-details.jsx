import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const { toast } = useToast();

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }
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
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    )
    .then((action) => {
      if (action.payload?.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully!",
        });
      } else {
        toast({
          title: action.payload?.message || "Failed to add review",
          variant: "destructive",
        });
      }
    })
    .catch((errorAction) => {
      const message = errorAction?.payload?.message ||
                     errorAction?.error?.message ||
                     "Failed to add review. You may need to purchase this product first.";
      toast({
        title: message,
        variant: "destructive",
      });
    });
  }

  useEffect(() => {
    if (productDetails !== null) {
      setOpen(true);
    }
  }, [productDetails, setOpen]);

  useEffect(() => {
    if (productDetails !== null) {
      dispatch(getReviews(productDetails?._id));
    }
  }, [productDetails, dispatch]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  if (!productDetails) return null;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-[85vw] sm:max-w-[80vw] lg:max-w-[800px] max-h-[95vh] p-3 sm:p-4 overflow-y-auto">
        <DialogTitle className="sr-only">
          {productDetails?.title || "Product Details"}
        </DialogTitle>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          {/* Image Section */}
          <div className="relative overflow-hidden rounded-lg bg-gray-100">
            {productDetails?.image ? (
              <img
                src={productDetails.image}
                alt={productDetails?.title || "Product"}
                className="w-full h-[250px] sm:aspect-square object-contain"
              />
            ) : (
              <div className="w-full aspect-square flex items-center justify-center">
                <span className="text-muted-foreground">No image available</span>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-start">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-4xl font-extrabold mb-3 leading-tight">
                {productDetails?.title}
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                {productDetails?.description}
              </p>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <p
                className={`text-2xl sm:text-3xl font-bold text-primary ${
                  productDetails?.salePrice > 0 ? "line-through" : ""
                }`}
              >
                ${productDetails?.price}
              </p>
              {productDetails?.salePrice > 0 && (
                <p className="text-2xl sm:text-3xl font-bold text-red-600">
                  ${productDetails?.salePrice}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 mb-6">
              <StarRatingComponent rating={Math.round(averageReview) || 0} />
              <span className="text-base text-muted-foreground font-medium">
                ({averageReview.toFixed(1)})
              </span>
            </div>

            <div className="mb-8">
              {productDetails?.totalStock === 0 ? (
                <Button className="w-full opacity-60 cursor-not-allowed h-12 text-base" disabled>
                  Out of Stock
                </Button>
              ) : (
                <Button
                  className="w-full bg-primary hover:bg-primary/90 h-12 text-base font-semibold"
                  onClick={() =>
                    handleAddToCart(
                      productDetails?._id,
                      productDetails?.totalStock
                    )
                  }
                >
                  Add to Cart
                </Button>
              )}
            </div>

            <Separator className="mb-4" />

            {/* Reviews Section */}
            <div className="flex-1 overflow-y-auto max-h-[150px] sm:max-h-[200px] pr-2">
              <h2 className="text-xl font-bold mb-5">Customer Reviews</h2>
              <div className="space-y-3">
                {reviews && reviews.length > 0 ? (
                  reviews.map((reviewItem) => (
                    <div
                      key={reviewItem._id}
                      className="flex gap-3 p-3 rounded-lg bg-gray-50"
                    >
                      <Avatar className="w-8 h-8 border">
                        <AvatarFallback>
                          {reviewItem?.userName?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-sm truncate">
                            {reviewItem?.userName}
                          </h3>
                          <StarRatingComponent
                            rating={reviewItem?.reviewValue}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {reviewItem?.reviewMessage}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No reviews yet. Be the first to review!
                  </p>
                )}
              </div>
            </div>

            {/* Write Review Form */}
            <div className="pt-6 border-t mt-6">
              <Label className="mb-3 block text-base font-semibold">Write a Review</Label>
              <div className="flex gap-1 mb-3">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(e) => setReviewMsg(e.target.value)}
                placeholder="Share your thoughts..."
                className="mb-3"
              />
              <Button
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === "" || rating === 0}
                className="w-full h-12 text-base font-semibold"
              >
                Submit Review
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
