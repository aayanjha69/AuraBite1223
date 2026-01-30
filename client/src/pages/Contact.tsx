import { useSendMessage } from "@/hooks/use-contact";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMessageSchema, type InsertMessage } from "@shared/schema";
import { Loader2, MessageCircle, MapPin, Phone, Mail } from "lucide-react";

export default function Contact() {
  const { mutate, isPending } = useSendMessage();
  const form = useForm<InsertMessage>({
    resolver: zodResolver(insertMessageSchema),
  });

  const onSubmit = (data: InsertMessage) => {
    mutate(data, {
      onSuccess: () => form.reset()
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold font-display text-center mb-16">Get in Touch</h1>

        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Info Side */}
          <div className="space-y-8">
            <div className="bg-card p-8 rounded-2xl border border-white/5 space-y-6">
              <h3 className="text-2xl font-bold font-display mb-4">Contact Info</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">Visit Us</h4>
                    <p className="text-muted-foreground">123 Flavor Street, Culinary District<br/>Food City, FC 90210</p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">Call Us</h4>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">Email Us</h4>
                    <p className="text-muted-foreground">hello@aurabites.com</p>
                  </div>
                </li>
              </ul>
            </div>

            <a 
              href="https://wa.me/15551234567" 
              target="_blank" 
              className="block w-full py-4 bg-[#25D366] text-white rounded-xl font-bold text-center hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-6 h-6" /> Chat on WhatsApp
            </a>

            {/* Map Placeholder */}
            <div className="h-64 bg-secondary/50 rounded-2xl flex items-center justify-center border border-white/5">
              <span className="text-muted-foreground">Google Map Placeholder</span>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-card p-8 rounded-2xl border border-white/5">
            <h3 className="text-2xl font-bold font-display mb-6">Send a Message</h3>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <input 
                  {...form.register("name")}
                  className="w-full bg-secondary rounded-lg px-4 py-3 border border-transparent focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Your Name"
                />
                {form.formState.errors.name && <p className="text-destructive text-xs">{form.formState.errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input 
                  {...form.register("email")}
                  type="email"
                  className="w-full bg-secondary rounded-lg px-4 py-3 border border-transparent focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="your@email.com"
                />
                {form.formState.errors.email && <p className="text-destructive text-xs">{form.formState.errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <textarea 
                  {...form.register("message")}
                  className="w-full bg-secondary rounded-lg px-4 py-3 border border-transparent focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[150px]"
                  placeholder="How can we help you?"
                />
                {form.formState.errors.message && <p className="text-destructive text-xs">{form.formState.errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 disabled:opacity-50 transition-all"
              >
                {isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
