
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderData {
  customer_email?: string;
  customer_phone?: string;
  items: CartItem[];
  total_amount: number;
}

export const useOrders = () => {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const submitOrder = async (orderData: OrderData) => {
    try {
      setSubmitting(true);
      
      const { data, error } = await supabase
        .from('orders')
        .insert({
          customer_email: orderData.customer_email,
          customer_phone: orderData.customer_phone,
          items: orderData.items as any, // Cast to satisfy Json type
          total_amount: orderData.total_amount,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Order Submitted!",
        description: `Your order #${data.id.slice(0, 8)} has been placed successfully.`,
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit order';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return { submitOrder, submitting };
};
