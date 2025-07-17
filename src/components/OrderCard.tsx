import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Order } from '../features/order/orderTypes';

interface OrderCardProps {
  order: Order;
}

const OrderCard = ({ order }: OrderCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-800';
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Ready': return 'bg-purple-100 text-purple-800';
      case 'Out for Delivery': return 'bg-indigo-100 text-indigo-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <div>
          <p className="text-sm text-gray-500">Order ID</p>
          <p className="font-mono text-sm text-gray-800">{order.id}</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right sm:text-left">
            <p className="text-sm text-gray-500">Total</p>
            <p className="font-semibold text-gray-800">₹{order.totalAmount.toFixed(2)}</p>
          </div>
          <div className="text-right sm:text-left">
            <p className="text-sm text-gray-500">Status</p>
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="p-4 space-y-3">
        {order.items.slice(0, 2).map(item => (
          <div key={item.id || item.variantId} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
              <img src={item.productImage || ''} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-medium text-sm text-gray-800 line-clamp-1">{item.name}</p>
              <p className="text-xs text-gray-500">
                {item.variantName}
              </p>
            </div>
          </div>
        ))}

        {order.items.length > 2 && (
          <p className="text-xs text-center text-gray-500 pt-2">
            + {order.items.length - 2} more item(s)
          </p>
        )}
      </div>

      {/* Card Footer */}
      <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
         <p className="text-xs text-gray-500">
          Ordered on: {new Date(order.createdAt).toLocaleDateString()}
        </p>
        <Link
          to={`/account/orders/${order.id}`}
          className="flex items-center text-xs font-medium text-terracotta-600 hover:text-terracotta-800"
        >
          View Details
          <ChevronRight size={14} className="ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default OrderCard; 