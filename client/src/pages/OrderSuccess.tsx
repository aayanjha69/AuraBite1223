import { Link } from "wouter";
import { CheckCircle, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="text-center max-w-md">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12 }}
          className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500"
        >
          <CheckCircle className="w-12 h-12" />
        </motion.div>
        
        <h1 className="text-3xl font-bold font-display mb-4">Order Placed Successfully!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your order. We are preparing your food with love. It will be delivered to your doorstep shortly.
        </p>

        <Link href="/">
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 mx-auto">
            <Home className="w-5 h-5" /> Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
