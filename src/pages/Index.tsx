
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
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
          <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl md:text-6xl font-bold mb-4">
                Delicious Food, Delivered Fast
              </h2>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Order your favorite meals from the comfort of your home
              </p>
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                Browse Menu
              </Button>
            </div>
          </section>

          {/* Menu Section */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Our Menu
              </h3>
              
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
                  <span className="ml-2 text-gray-600">Loading menu items...</span>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600 mb-4">Error loading menu: {error}</p>
                  <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems.map(item => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
                          }}
                        />
                        <Badge className="absolute top-2 left-2 bg-orange-500">
                          {item.category}
                        </Badge>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center mb-2">
                          <h4 className="text-xl font-semibold text-gray-900 flex-1">
                            {item.name}
                          </h4>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">{item.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-orange-600">
                            ${item.price.toFixed(2)}
                          </span>
                          <Button
                            onClick={() => addToCart(item)}
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add to Cart
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
          <div className="fixed right-0 top-16 h-full w-96 bg-white shadow-xl border-l z-30 overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-6">Your Order</h3>
              
              {cartItems.length === 0 ? (
                <div>
                  <p className="text-gray-500 text-center py-8">Your cart is empty</p>
                  <RecommendedItems 
                    menuItems={menuItems} 
                    onAddToCart={addToCart}
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
                          <p className="text-orange-600 font-medium">${item.price.toFixed(2)}</p>
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
                  />

                  <div className="border-t pt-6 mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-orange-600">
                        ${getTotalPrice().toFixed(2)}
                      </span>
                    </div>
                    <Button 
                      className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-3"
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
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
