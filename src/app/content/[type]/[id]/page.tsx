import { Navbar } from "@/components/navbar";
import { getContentDetails, getImageUrl } from "@/lib/tmdb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, CheckCircle, Star, Calendar, Clock, Globe, MessageSquare } from "lucide-react";
import Image from "next/image";
import { ContentCard } from "@/components/content-card";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ type: 'movie' | 'tv'; id: string }>;
}) {
  const { type, id } = await params;
  const content = await getContentDetails(type, id);
  
  const title = content.title || content.name;
  const year = new Date(content.release_date || content.first_air_date).getFullYear();
  const runtime = content.runtime || (content.episode_run_time ? content.episode_run_time[0] : null);
  const rating = content.vote_average.toFixed(1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Backdrop Hero */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <Image
          src={getImageUrl(content.backdrop_path, 'original')}
          alt={title}
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div className="container mx-auto flex flex-col md:flex-row gap-8 items-end">
            <div className="hidden md:block w-64 shrink-0 shadow-2xl rounded-xl overflow-hidden aspect-[2/3] relative">
              <Image
                src={getImageUrl(content.poster_path)}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex-1 text-white">
              <div className="flex flex-wrap gap-2 mb-4">
                {content.genres.map((genre: any) => (
                  <Badge key={genre.id} className="bg-accent/80 hover:bg-accent text-white border-none backdrop-blur-md">
                    {genre.name}
                  </Badge>
                ))}
              </div>
              <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 drop-shadow-lg">
                {title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-sm md:text-base font-medium text-white/90 mb-8">
                <span className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-white/20 backdrop-blur-md">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  {rating}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {year}
                </span>
                {runtime && (
                  <span className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {runtime} min
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  {content.origin_country?.[0] || 'N/A'}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white gap-2 rounded-full h-12 px-8">
                  <CheckCircle className="w-5 h-5" />
                  Mark Watched
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 gap-2 rounded-full h-12 px-8">
                  <Heart className="w-5 h-5" />
                  Add to Favorites
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {content.overview || "No overview available for this title."}
              </p>
            </section>

            <Tabs defaultValue="cast" className="w-full">
              <TabsList className="bg-primary/10 w-full justify-start overflow-x-auto">
                <TabsTrigger value="cast">Cast & Crew</TabsTrigger>
                <TabsTrigger value="reviews">User Reviews</TabsTrigger>
                <TabsTrigger value="recommendations">Similar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="cast" className="mt-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {content.credits?.cast?.slice(0, 8).map((person: any) => (
                    <Card key={person.id} className="bg-white/50 border-none shadow-sm overflow-hidden">
                      <div className="aspect-[3/4] relative">
                        <Image
                          src={person.profile_path ? getImageUrl(person.profile_path) : `https://picsum.photos/seed/${person.id}/300/400`}
                          alt={person.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-3 text-center">
                        <p className="font-semibold text-sm line-clamp-1">{person.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{person.character}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-8">
                <div className="space-y-6">
                  <div className="p-8 rounded-2xl bg-primary/5 border border-dashed border-primary/20 text-center">
                    <MessageSquare className="w-10 h-10 text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No reviews yet. Be the first to share your thoughts!</p>
                    <Button variant="outline">Write a Review</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="recommendations" className="mt-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {content.recommendations?.results?.slice(0, 8).map((item: any) => (
                    <ContentCard key={item.id} content={item} type={type} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar Info */}
          <aside className="space-y-8">
            <Card className="border-none shadow-md overflow-hidden bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6 space-y-6">
                <h3 className="font-bold text-lg border-b pb-2">Information</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1 uppercase tracking-wider text-[10px] font-bold">Status</p>
                    <p className="font-medium text-accent">{content.status}</p>
                  </div>
                  {content.networks && (
                    <div>
                      <p className="text-muted-foreground mb-1 uppercase tracking-wider text-[10px] font-bold">Network</p>
                      <div className="flex flex-wrap gap-2">
                        {content.networks.map((n: any) => (
                          <span key={n.id} className="font-medium">{n.name}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground mb-1 uppercase tracking-wider text-[10px] font-bold">Original Language</p>
                    <p className="font-medium">{content.original_language === 'ko' ? 'Korean' : content.original_language === 'zh' ? 'Chinese' : content.original_language}</p>
                  </div>
                  {content.production_companies?.length > 0 && (
                    <div>
                      <p className="text-muted-foreground mb-1 uppercase tracking-wider text-[10px] font-bold">Production</p>
                      <p className="font-medium">{content.production_companies[0].name}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md overflow-hidden serenity-gradient">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Your Experience</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white/50 p-3 rounded-lg">
                    <span className="text-sm">Rating</span>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className="w-5 h-5 text-gray-300 hover:text-yellow-400 cursor-pointer" />
                      ))}
                    </div>
                  </div>
                  <Button className="w-full bg-accent text-white h-11">Save Progress</Button>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}