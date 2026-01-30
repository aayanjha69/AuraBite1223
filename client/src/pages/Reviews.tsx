import { useReviews, useCreateReview } from "@/hooks/use-reviews";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertReviewSchema, type InsertReview } from "@shared/schema";
import { Star, User, Quote, Loader2 } from "lucide-react";

export default function Reviews() {
  const { data: reviews, isLoading } = useReviews();
  const { mutate, isPending } = useCreateReview();
  const form = useForm<InsertReview>({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: { rating: 5 }
  });

  const onSubmit = (data: InsertReview) => {
    mutate(data, {
      onSuccess: () => form.reset()
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">
        
        {/* Review Form */}
        <div className="lg:col-span-1">
          <div className="bg-card p-6 rounded-2xl border border-white/5 sticky top-24">
            <h2 className="text-2xl font-bold font-display mb-6">Write a Review</h2>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Name</label>
                <input 
                  {...form.register("name")}
                  className="w-full bg-secondary rounded-lg px-4 py-3 border border-transparent focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="John Doe"
                />
                {form.formState.errors.name && <p className="text-destructive text-xs">{form.formState.errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Rating</label>
                <select 
                  {...form.register("rating", { valueAsNumber: true })}
                  className="w-full bg-secondary rounded-lg px-4 py-3 border border-transparent focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="5">5 Stars - Excellent</option>
                  <option value="4">4 Stars - Good</option>
                  <option value="3">3 Stars - Average</option>
                  <option value="2">2 Stars - Poor</option>
                  <option value="1">1 Star - Terrible</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Comment</label>
                <textarea 
                  {...form.register("comment")}
                  className="w-full bg-secondary rounded-lg px-4 py-3 border border-transparent focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[120px]"
                  placeholder="Tell us about your experience..."
                />
                {form.formState.errors.comment && <p className="text-destructive text-xs">{form.formState.errors.comment.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 disabled:opacity-50 transition-all"
              >
                {isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Submit Review"}
              </button>
            </form>
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold font-display mb-8">Customer Reviews</h1>
          
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            reviews?.map((review) => (
              <div key={review.id} className="bg-card/50 p-6 rounded-2xl border border-white/5 relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-bold">{review.name}</h4>
                      <div className="flex text-primary text-xs">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < review.rating ? "fill-current" : "opacity-30"}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed pl-14 relative">
                  <Quote className="absolute -left-4 -top-1 w-6 h-6 text-primary/10 rotate-180" />
                  {review.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
