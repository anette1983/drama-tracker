"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api";
import { Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/tmdb";

interface FavoriteItem {
  id: string;
  contentId: string;
  contentType: "movie" | "tv";
  title: string;
  posterPath: string | null;
  addedAt: string;
}

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    api.favorites
      .list(page, 20)
      .then((res) => {
        setItems(res.items);
        setTotal(res.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, authLoading, page]);

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    try {
      await api.favorites.remove(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setTotal((prev) => prev - 1);
    } catch {
    } finally {
      setRemovingId(null);
    }
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-red-100 text-red-500">
              <Heart className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-headline font-bold">My Favorites</h1>
          </div>
          <p className="text-muted-foreground">
            {user ? `${total} title${total !== 1 ? "s" : ""} in your collection` : "Sign in to manage your favorites."}
          </p>
        </header>

        {!user && !authLoading && (
          <div className="text-center py-20 rounded-2xl bg-primary/5 border border-dashed border-primary/20">
            <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">You need to sign in to see your favorites.</p>
          </div>
        )}

        {user && loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-xl bg-primary/10 animate-pulse" />
            ))}
          </div>
        )}

        {user && !loading && items.length === 0 && (
          <div className="text-center py-20 rounded-2xl bg-primary/5 border border-dashed border-primary/20">
            <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">No favorites yet</p>
            <p className="text-muted-foreground mb-6">Browse content and tap the heart to add favorites.</p>
            <Link href="/search?mode=popular">
              <Button className="bg-accent text-white">Browse Popular</Button>
            </Link>
          </div>
        )}

        {user && !loading && items.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {items.map((item) => (
                <Card key={item.id} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all bg-white/50 hover:bg-white relative">
                  <Link href={`/content/${item.contentType}/${item.contentId}`}>
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <Image
                        src={item.posterPath ? getImageUrl(item.posterPath) : "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                      />
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-accent transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.contentType.toUpperCase()}
                      </p>
                    </CardContent>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-black/40 hover:bg-red-500 text-white rounded-full w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => { e.preventDefault(); handleRemove(item.id); }}
                    disabled={removingId === item.id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
