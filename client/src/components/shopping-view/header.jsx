import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Separator } from "../ui/separator";

function MenuItems({ onItemClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    if (onItemClick) onItemClick();

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col lg:flex-row gap-4 lg:gap-6">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <button
          key={menuItem.id}
          onClick={() => handleNavigate(menuItem)}
          className="text-left py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors text-base font-medium whitespace-nowrap"
        >
          {menuItem.label}
        </button>
      ))}
    </nav>
  );
}

function HeaderRightContent({ user, onCartClose }) {
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Sheet open={openCartSheet} onOpenChange={(open) => {
          setOpenCartSheet(open);
          if (!open && onCartClose) onCartClose();
        }}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {cartItems?.items?.length || 0}
          </span>
          <span className="sr-only">User cart</span>
        </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Shopping Cart</SheetTitle>
            </SheetHeader>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
          </SheetContent>
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Avatar className="bg-primary hover:bg-primary/90 transition-colors cursor-pointer">
              <AvatarFallback className="bg-primary text-white font-extrabold">
                {user?.userName?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
    </div>
  );
}

function ShoppingHeader() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const safeUser = user || { userName: 'Guest', email: '' };

   return (
     <header className="sticky top-0 z-[100] w-full border-b bg-white/95 backdrop-blur-xl border-gray-200/50 shadow-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/shop/home" className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
            <HousePlug className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            ShopFast
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <MenuItems />
          <HeaderRightContent user={safeUser} />
        </div>

        {/* Mobile Menu Button & Quick Actions */}
        <div className="lg:hidden flex items-center gap-2">
          <HeaderRightContent user={safeUser} onCartClose={() => setMobileMenuOpen(false)} />
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden hover:bg-gray-100">
                <Menu className="h-6 w-6 text-gray-700" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] max-w-sm p-0 border-r border-gray-200">
              <SheetHeader className="p-4 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex items-center justify-between">
                  <SheetTitle className="flex items-center gap-2 text-gray-900">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <HousePlug className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold text-xl">ShopFast</span>
                  </SheetTitle>
                </div>
              </SheetHeader>
              <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
                <MenuItems onItemClick={() => setMobileMenuOpen(false)} />
                <Separator className="my-4" />
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  {isAuthenticated && safeUser && (
                    <>
                      <Avatar className="bg-gradient-to-br from-indigo-500 to-purple-600">
                        <AvatarFallback className="bg-transparent text-white font-bold">
                          {safeUser?.userName?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold truncate">{safeUser?.userName}</span>
                        <span className="text-xs text-gray-500 truncate">{safeUser?.email}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
