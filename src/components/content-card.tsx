"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, PlayCircle, Heart } from "lucide-react";
import { TMDBContent, getImageUrl } from "@/lib/tmdb";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ContentCardProps {
  content: TMDBContent;
  type: 'movie' | 'tv';
}

export function ContentCard({ content, type }: ContentCardProps) {
  const title = content.title || content.name;
  const rating = content.vote_average.toFixed(1);
  const date = content.release_date || content.first_air_date || "";
  const year = date ? new Date(date).getFullYear() : "N/A";

  return (
    <Link href={`/content/${type}/${content.id}`}>
      <Card className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white/50 hover:bg-white">
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={getImageUrl(content.poster_path)}
            alt={title || "Poster"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-white/20 backdrop-blur-md text-white border-none">
                {type.toUpperCase()}
              </Badge>
            </div>
          </div>
          <div className="absolute top-2 right-2">
            <Badge className="bg-accent/90 backdrop-blur-md text-white border-none flex gap-1 items-center">
              <Star className="w-3 h-3 fill-current" />
              {rating}
            </Badge>
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-accent transition-colors">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {year} • {content.origin_country?.[0] || 'Unknown'}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}