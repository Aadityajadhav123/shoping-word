import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { ImageOff } from "lucide-react";
import { useState } from "react";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
   const [imageError, setImageError] = useState(false);

   return (
     <Card className="w-full max-w-sm mx-auto hover:shadow-lg transition-all duration-300 border-0 bg-white shadow-sm group h-full flex flex-col">
       <div onClick={() => handleGetProductDetails(product?._id)} className="cursor-pointer flex-1">
         <div className="relative overflow-hidden rounded-t-lg bg-gray-100">
           {imageError || !product?.image ? (
             <div className="w-full h-[160px] sm:h-[180px] md:h-[200px] flex items-center justify-center bg-gray-200">
               <ImageOff className="w-12 h-12 text-gray-400" />
             </div>
           ) : (
             <img
               src={product?.image}
               alt={product?.title}
               className="w-full h-[160px] sm:h-[180px] md:h-[200px] object-cover transition-transform duration-300 group-hover:scale-105"
               onError={() => setImageError(true)}
             />
           )}
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white text-xs">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600 text-white text-xs">
              {`Only ${product?.totalStock} left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white text-xs">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-3 sm:p-4 flex-1 flex flex-col">
          <h2 className="text-sm sm:text-base font-bold mb-1 sm:mb-2 line-clamp-2 flex-1">{product?.title}</h2>
          <div className="flex justify-between items-center mb-1 sm:mb-2 text-xs sm:text-sm">
            <span className="text-muted-foreground capitalize">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-muted-foreground uppercase">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span
              className={`text-sm sm:text-base font-semibold ${
                product?.salePrice > 0 ? "line-through text-muted-foreground" : "text-primary"
              }`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-sm sm:text-base font-semibold text-red-600">
                ${product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <div className="p-3 sm:p-4 pt-0">
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed text-xs sm:text-sm py-2" disabled>
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full bg-primary hover:bg-primary/90 text-xs sm:text-sm py-2"
          >
            Add to cart
          </Button>
        )}
      </div>
    </Card>
  );
}

export default ShoppingProductTile;
