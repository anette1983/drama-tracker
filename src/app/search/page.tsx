import { Navbar } from "@/components/navbar";
import { searchContent } from "@/lib/tmdb";
import { ContentCard } from "@/components/content-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const query = (await searchParams).q || "";
  
  const movieResults = await searchContent(query, 'movie');
  const tvResults = await searchContent(query, 'tv');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <header className="mb-10">
          <h1 className="text-3xl font-headline font-bold mb-2">
            Search Results for "{query}"
          </h1>
          <p className="text-muted-foreground">
            Found {movieResults.length + tvResults.length} matches in Korean and Chinese cinema.
          </p>
        </header>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-primary/10 mb-8">
            <TabsTrigger value="all">All Results</TabsTrigger>
            <TabsTrigger value="tv">Dramas ({tvResults.length})</TabsTrigger>
            <TabsTrigger value="movie">Movies ({movieResults.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-12">
            {tvResults.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  Dramas
                  <span className="h-px flex-1 bg-border ml-4" />
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {tvResults.map((item) => (
                    <ContentCard key={item.id} content={item} type="tv" />
                  ))}
                </div>
              </section>
            )}

            {movieResults.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  Movies
                  <span className="h-px flex-1 bg-border ml-4" />
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {movieResults.map((item) => (
                    <ContentCard key={item.id} content={item} type="movie" />
                  ))}
                </div>
              </section>
            )}

            {tvResults.length === 0 && movieResults.length === 0 && (
              <div className="text-center py-20 bg-white/50 rounded-2xl border border-dashed border-primary/40">
                <p className="text-xl text-muted-foreground mb-4">No results found for "{query}"</p>
                <p className="text-sm">Try searching for broader terms or check the spelling.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="tv">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {tvResults.map((item) => (
                <ContentCard key={item.id} content={item} type="tv" />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="movie">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {movieResults.map((item) => (
                <ContentCard key={item.id} content={item} type="movie" />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}