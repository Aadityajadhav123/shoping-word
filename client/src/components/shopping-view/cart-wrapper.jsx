import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <SheetContent className="sm:max-w-md w-[90vw]">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto py-4">
           {cartItems && cartItems.length > 0
             ? cartItems.map((item, index) => <UserCartItemsContent key={item._id || item.productId || index} cartItem={item} />)
            : (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                  <ShoppingCart className="w-12 h-12 mb-3 opacity-30" />
                  <p>Your cart is empty</p>
                </div>
              )
          }
        </div>
        {cartItems && cartItems.length > 0 && (
          <div className="border-t pt-4 space-y-4 mt-4">
            <div className="flex justify-between items-center px-2">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-xl text-primary">${totalCartAmount.toFixed(2)}</span>
            </div>
            <Button
              onClick={() => {
                navigate("/shop/checkout");
                setOpenCartSheet(false);
              }}
              className="w-full"
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;
