import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { CheckCircle, Package, Clock, AlertCircle } from "lucide-react";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'shipped':
        return <Package className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'shipped':
        return 'bg-blue-500';
      case 'delivered':
        return 'bg-green-600';
      case 'cancelled':
        return 'bg-red-600';
      case 'pending':
      default:
        return 'bg-black';
    }
  };

    return (
    <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
      <DialogTitle className="sr-only">Order Details</DialogTitle>
      <div className="grid gap-6">
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <p className="text-sm text-muted-foreground">Order ID</p>
            <Label className="text-base">{orderDetails?._id}</Label>
          </div>
          <div className="grid gap-1.5">
            <p className="text-sm text-muted-foreground">Order Date</p>
            <Label className="text-base">{orderDetails?.orderDate.split("T")[0]}</Label>
          </div>
          <div className="grid gap-1.5">
            <p className="text-sm text-muted-foreground">Order Price</p>
            <Label className="text-base font-semibold">${orderDetails?.totalAmount}</Label>
          </div>
          <div className="grid gap-1.5">
            <p className="text-sm text-muted-foreground">Payment method</p>
            <Label className="text-base">{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="grid gap-1.5">
            <p className="text-sm text-muted-foreground">Payment Status</p>
            <Label className="text-base">{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="grid gap-1.5">
            <p className="text-sm text-muted-foreground">Order Status</p>
            <Label>
              <Badge className={`py-1 px-3 ${getStatusColor(orderDetails?.orderStatus)} flex items-center gap-2`}>
                {getStatusIcon(orderDetails?.orderStatus)}
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-3">
          <div className="font-medium text-sm">Order Details</div>
          <ul className="grid gap-2">
            {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
              ? orderDetails?.cartItems.map((item) => (
                  <li key={item._id || item.productId} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <span className="text-sm">{item.title}</span>
                    <span className="text-sm">Qty: {item.quantity}</span>
                    <span className="text-sm font-medium">${item.price}</span>
                  </li>
                ))
              : null}
          </ul>
        </div>
        <Separator />
        <div className="grid gap-3">
          <div className="font-medium text-sm">Shipping Info</div>
          <div className="grid gap-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span>{user.userName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Address:</span>
              <span>{orderDetails?.addressInfo?.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">City:</span>
              <span>{orderDetails?.addressInfo?.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pincode:</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone:</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Notes:</span>
              <span>{orderDetails?.addressInfo?.notes || "-"}</span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
