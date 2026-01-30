import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-orders";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertOrderSchema } from "@shared/schema";
import { useLocation } from "wouter";
import { Loader2, CreditCard, Banknote, QrCode } from "lucide-react";
import { z } from "zod";

// Create a schema that omits the complex items array for the form
// We'll inject items from the cart context on submit
const checkoutFormSchema = insertOrderSchema.pick({
  customerName: true,
  email: true,
  phone: true,
  address: true,
  total: true,
});

type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const { mutate, isPending } = useCreateOrder();
  const [, setLocation] = useLocation();

  const deliveryFee = 500;
  const total = cartTotal + deliveryFee;

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      total,
    }
  });

  const onSubmit = (data: CheckoutFormData) => {
    mutate({
      ...data,
      total,
      items: items.map(i => ({
        menuItemId: i.menuItemId,
        quantity: i.quantity,
        name: i.name,
        price: i.price,
        customizations: i.customizations
      }))
    }, {
      onSuccess: () => {
        clearCart();
        setLocation("/order-success"); // You'll need to create this simple page or redirect home
      }
    });
  };

  if (items.length === 0) {
    setLocation("/cart");
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-background">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold font-display mb-8">Checkout</h1>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <section className="bg-card p-6 rounded-2xl border border-white/5 space-y-4">
              <h2 className="text-xl font-bold">Contact Details</h2>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <input 
                    {...form.register("customerName")}
                    className="w-full bg-secondary rounded-lg px-4 py-3 border border-transparent focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="John Doe"
                  />
                  {form.formState.errors.customerName && <p className="text-destructive text-xs">{form.formState.errors.customerName.message}</p>}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input 
                      {...form.register("email")}
                      type="email"
                      className="w-full bg-secondary rounded-lg px-4 py-3 border border-transparent focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="john@example.com"
                    />
                    {form.formState.errors.email && <p className="text-destructive text-xs">{form.formState.errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <input 
                      {...form.register("phone")}
                      className="w-full bg-secondary rounded-lg px-4 py-3 border border-transparent focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="+1 (555) 000-0000"
                    />
                    {form.formState.errors.phone && <p className="text-destructive text-xs">{form.formState.errors.phone.message}</p>}
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card p-6 rounded-2xl border border-white/5 space-y-4">
              <h2 className="text-xl font-bold">Delivery Address</h2>
              <div className="space-y-2">
                <textarea 
                  {...form.register("address")}
                  className="w-full bg-secondary rounded-lg px-4 py-3 border border-transparent focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[100px]"
                  placeholder="123 Main St, Apt 4B, Food City..."
                />
                {form.formState.errors.address && <p className="text-destructive text-xs">{form.formState.errors.address.message}</p>}
              </div>
            </section>

            <section className="bg-card p-6 rounded-2xl border border-white/5 space-y-4">
              <h2 className="text-xl font-bold">Payment Method</h2>
              <div className="grid grid-cols-3 gap-4">
                <label className="cursor-pointer">
                  <input type="radio" name="payment" className="peer sr-only" defaultChecked />
                  <div className="flex flex-col items-center gap-3 p-4 rounded-xl border border-white/10 bg-secondary/50 peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary transition-all">
                    <CreditCard className="w-6 h-6" />
                    <span className="text-xs font-bold">Card</span>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input type="radio" name="payment" className="peer sr-only" />
                  <div className="flex flex-col items-center gap-3 p-4 rounded-xl border border-white/10 bg-secondary/50 peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary transition-all">
                    <QrCode className="w-6 h-6" />
                    <span className="text-xs font-bold">UPI</span>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input type="radio" name="payment" className="peer sr-only" />
                  <div className="flex flex-col items-center gap-3 p-4 rounded-xl border border-white/10 bg-secondary/50 peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary transition-all">
                    <Banknote className="w-6 h-6" />
                    <span className="text-xs font-bold">Cash</span>
                  </div>
                </label>
              </div>
            </section>
          </div>

          <div className="flex items-center justify-between py-4 border-t border-white/10">
            <div>
              <p className="text-muted-foreground text-sm">Total Amount</p>
              <p className="text-3xl font-bold text-primary">${(total / 100).toFixed(2)}</p>
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                </div>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
