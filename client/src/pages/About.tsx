export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-background">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Intro */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold font-display">Our Story</h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            AuraBites started with a simple mission: to serve premium, restaurant-quality food at fast-food speed. We believe that good food has an aura that brings people together.
          </p>
        </div>

        {/* Image */}
        <div className="rounded-3xl overflow-hidden aspect-video shadow-2xl shadow-primary/10">
          <img 
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600" 
            alt="Kitchen" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Fresh Ingredients", desc: "We source our produce locally every single morning." },
            { title: "Master Chefs", desc: "Our recipes are crafted by award-winning culinary experts." },
            { title: "Sustainable Packaging", desc: "100% eco-friendly packaging because we love our planet." }
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-2xl bg-card border border-white/5">
              <h3 className="text-xl font-bold font-display mb-3 text-primary">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Team Section */}
        <div className="text-center bg-secondary/20 rounded-3xl p-12">
          <h2 className="text-3xl font-bold font-display mb-6">Join the Team</h2>
          <p className="text-muted-foreground mb-8">
            We are always looking for passionate people to join our kitchen and delivery crew.
          </p>
          <button className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
            View Careers
          </button>
        </div>
      </div>
    </div>
  );
}
