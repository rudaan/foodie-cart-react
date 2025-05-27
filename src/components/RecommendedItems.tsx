
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MenuItem } from '@/hooks/useMenuItems';

interface RecommendedItemsProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  cartItems?: { id: string; quantity: number }[];
}

const RecommendedItems = ({ menuItems, onAddToCart, cartItems = [] }: RecommendedItemsProps) => {
  // Get cart item IDs for filtering
  const cartItemIds = cartItems.map(item => item.id);
  
  // Get 3 random recommended items that are not in the cart
  const recommendedItems = menuItems
    .filter(item => item.rating >= 4.5 && !cartItemIds.includes(item.id))
    .slice(0, 3);

  if (recommendedItems.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 pt-6 border-t">
      <h4 className="text-lg font-semibold mb-4 text-gray-900">
        Recommended for you
      </h4>
      <div className="space-y-3">
        {recommendedItems.map(item => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-3">
              <div className="flex items-center space-x-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=48&h=48&fit=crop';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-sm text-gray-900 truncate">
                    {item.name}
                  </h5>
                  <p className="text-orange-600 font-semibold text-sm">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 text-xs px-2 py-1"
                  onClick={() => onAddToCart(item)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecommendedItems;
