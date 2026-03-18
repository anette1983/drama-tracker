import { Navbar } from "@/components/navbar";
import { getTrendingEastAsian } from "@/lib/tmdb";
import { ContentCard } from "@/components/content-card";
import { recommendDramasAndMovies } from "@/ai/flows/ai-drama-movie-recommendation-flow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, History, Heart, Play } from "lucide-react";
import Image from "next/image";

export default async function DashboardPage() {
  const trending = await getTrendingEastAsian('tv');
  
  // Mock user data for AI recommendations
  const watchedHistory = ["Crash Landing on You", "The Untamed", "Squid Game"];
  const userRatings = [
    { title: "Crash Landing on You", rating: 5 },
    { title: "The Untamed", rating: 5 },
    { title: "Squid Game", rating: 4 }
  ];

  // Fetch AI Recommendations
  let aiRecs: any = { recommendations: [] };
  try {
    aiRecs = await recommendDramasAndMovies({
      watchedHistory,
      userRatings,
      languagePreference: 'Korean'
    });
  } catch (error) {
    console.error("AI Recommendation failed", error);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <header className="mb-10">
          <h1 className="text-3xl font-headline font-bold">Welcome back, Traveler</h1>
          <p className="text-muted-foreground">Continue where you left off in your serenity journey.</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* AI Recommendations Section */}
            <section className="p-8 rounded-3xl serenity-gradient border border-primary/20 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-accent/20 text-accent shadow-sm">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">AI Personalized Picks</h2>
                    <p className="text-sm text-muted-foreground">Based on your love for {watchedHistory[0]}</p>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {aiRecs.recommendations.map((rec: any, idx: number) => (
                  <Card key={idx} className="bg-white/60 backdrop-blur-sm border-none shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant="outline" className="text-accent border-accent/30">{rec.genre}</Badge>
                      </div>
                      <h3 className="text-lg font-bold mb-2">{rec.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{rec.description}</p>
                      <div className="pt-4 border-t border-primary/10">
                        <p className="text-xs font-medium text-accent/80 italic">" {rec.reasonForRecommendation} "</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {aiRecs.recommendations.length === 0 && (
                  <p className="text-muted-foreground col-span-2 text-center py-10">
                    Watching more content to unlock personalized recommendations.
                  </p>
                )}
              </div>
            </section>

            {/* Currently Watching / Watched */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Play className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-bold">Continue Watching</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {trending.slice(5, 9).map((item) => (
                  <ContentCard key={item.id} content={item} type="tv" />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar / Stats */}
          <aside className="space-y-8">
            <Card className="border-none shadow-md overflow-hidden glass-morphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5 text-accent" />
                  Activity Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/80 p-4 rounded-2xl text-center shadow-sm">
                    <p className="text-3xl font-bold text-accent">12</p>
                    <p className="text-xs text-muted-foreground uppercase font-bold mt-1">Completed</p>
                  </div>
                  <div className="bg-white/80 p-4 rounded-2xl text-center shadow-sm">
                    <p className="text-3xl font-bold text-accent">5</p>
                    <p className="text-xs text-muted-foreground uppercase font-bold mt-1">Planning</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-bold text-sm uppercase text-muted-foreground tracking-widest">Recent Reviews</h4>
                  {[1,2].map(r => (
                    <div key={r} className="flex gap-3 items-center p-3 bg-white/50 rounded-xl">
                      <div className="w-10 h-10 rounded-lg overflow-hidden relative shrink-0">
                         <Image src={`https://picsum.photos/seed/${r+10}/100/100`} alt="Review" fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">Masterpiece of cinematography!</p>
                        <div className="flex gap-1 mt-1">
                          {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 text-yellow-500 fill-current" />)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md overflow-hidden bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-400" />
                  Quick Favorites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trending.slice(10, 13).map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 hover:bg-primary/5 rounded-xl transition-colors cursor-pointer">
                      <div className="w-12 h-16 rounded-md overflow-hidden relative shrink-0 shadow-sm">
                        <Image src={getImageUrl(item.poster_path)} alt={item.name || ""} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.first_air_date?.split('-')[0]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Star(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}