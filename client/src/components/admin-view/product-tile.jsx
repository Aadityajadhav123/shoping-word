import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto h-full flex flex-col">
      <div className="relative flex-1">
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-[160px] object-cover rounded-t-lg"
        />
      </div>
      <CardContent className="p-3 flex-1 flex flex-col">
        <h2 className="text-sm font-bold mb-2 line-clamp-2">{product?.title}</h2>
        <div className="flex justify-between items-center mt-auto">
          <span
            className={`text-sm font-semibold ${
              product?.salePrice > 0 ? "line-through text-muted-foreground" : "text-primary"
            }`}
          >
            ${product?.price}
          </span>
          {product?.salePrice > 0 ? (
            <span className="text-sm font-bold text-red-600">${product?.salePrice}</span>
          ) : null}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2 p-3 pt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setOpenCreateProductsDialog(true);
            setCurrentEditedId(product?._id);
            setFormData(product);
          }}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDelete(product?._id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AdminProductTile;
