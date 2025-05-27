
import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMenuItems, MenuItem } from '@/hooks/useMenuItems';
import { useOrders } from '@/hooks/useOrders';
import RecommendedItems from '@/components/RecommendedItems';

interface CartItem extends MenuItem {
  quantity: number;
}

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { menuItems, loading, error } = useMenuItems();
  const { submitOrder, submitting } = useOrders();

  const addToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    try {
      await submitOrder({
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        total_amount: getTotalPrice()
      });
      
      // Clear cart after successful order
      setCartItems([]);
      setIsCartOpen(false);
    } catch (error) {
      console.error('Order submission failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                FoodieDelight
              </h1>
            </div>
            <Button
              variant="outline"
              className="relative"
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Cart ({getTotalItems()})
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${isCartOpen ? 'mr-96' : ''}`}>
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Discover great places to eat
              </h2>
              <p className="text-lg md:text-xl mb-6 opacity-90">
                Order food from your favorite restaurants
              </p>
            </div>
          </section>

          {/* Menu Section */}
          <section className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Restaurants near you
              </h3>
              
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                  <span className="ml-2 text-gray-600">Loading restaurants...</span>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600 mb-4">Error loading menu: {error}</p>
                  <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {menuItems.map(item => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white">
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-36 object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
                          }}
                        />
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-white text-gray-700 text-xs font-medium border-0 shadow-sm">
                            {item.category}
                          </Badge>
                        </div>
                        <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold flex items-center">
                          {item.rating}
                          <Star className="w-3 h-3 ml-1 fill-current" />
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <div className="mb-2">
                          <h4 className="text-lg font-semibold text-gray-900 truncate mb-1">
                            {item.name}
                          </h4>
                          <p className="text-gray-500 text-sm line-clamp-2 mb-3" style={{ height: '2.5rem' }}>
                            {item.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-lg font-bold text-gray-900">
                              ₹{(item.price * 80).toFixed(0)}
                            </span>
                            <span className="text-xs text-gray-500">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                          <Button
                            onClick={() => addToCart(item)}
                            className="bg-red-600 hover:bg-red-700 text-white border-0 px-4 py-2 text-sm font-medium"
                            size="sm"
                          >
                            ADD
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>

        {/* Cart Sidebar */}
        {isCartOpen && (
          <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-96 bg-white shadow-xl border-l z-30 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="text-2xl font-bold mb-6">Your Order</h3>
              
              {cartItems.length === 0 ? (
                <div>
                  <p className="text-gray-500 text-center py-8">Your cart is empty</p>
                  <RecommendedItems 
                    menuItems={menuItems} 
                    onAddToCart={addToCart}
                    cartItems={cartItems}
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=64&h=64&fit=crop';
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-red-600 font-medium">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <RecommendedItems 
                    menuItems={menuItems} 
                    onAddToCart={addToCart}
                    cartItems={cartItems}
                  />
                </>
              )}
            </div>

            {/* Fixed checkout section at bottom */}
            {cartItems.length > 0 && (
              <div className="border-t bg-white p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-red-600">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700 text-lg py-3"
                  onClick={handleCheckout}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
