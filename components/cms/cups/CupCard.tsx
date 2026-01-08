"use client";

import { Cup } from "@/lib/types/cup";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, MapPin, Edit, Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDeleteCup } from "@/lib/hooks/cms/useCups";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CupCardProps {
  cup: Cup;
}

export function CupCard({ cup }: CupCardProps) {
  const { mutate: deleteCup, isPending } = useDeleteCup();

  const handleDelete = () => {
    if (
      confirm(
        `Are you sure you want to delete ${cup.name_en}? This action cannot be undone.`
      )
    ) {
      deleteCup(cup.id, {
        onSuccess: () => toast.success("Cup deleted successfully"),
        onError: (err) => toast.error(err.message),
      });
    }
  };

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-border bg-card backdrop-blur-sm">
      <CardHeader className="p-0 relative aspect-video overflow-hidden bg-muted">
        {cup.logo_url ? (
          <Image
            src={cup.logo_url}
            alt={cup.name_en}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground/40">
            <Trophy className="h-16 w-16 opacity-20" />
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge
            className={cn(
              "capitalize shadow-lg",
              cup.cup_type === "knockout"
                ? "bg-amber-500/90 text-amber-950"
                : cup.cup_type === "group_knockout"
                ? "bg-blue-500/90 text-blue-950"
                : "bg-purple-500/90 text-purple-950"
            )}
          >
            {cup.cup_type.replace("_", " ")}
          </Badge>
          {!cup.is_active && <Badge variant="destructive">Inactive</Badge>}
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="text-xl font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {cup.name_en}
            </h3>
            <p className="text-muted-foreground text-sm font-medium">
              {cup.name_am}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{cup.country}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Est. {cup.founded_year || "N/A"}</span>
          </div>
        </div>

        {cup.current_holder && (
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
              Current Holder
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {cup.current_holder.name_en}
              </span>
              {cup.current_holder.logo_url && (
                <div className="relative h-6 w-6">
                  <Image
                    src={cup.current_holder.logo_url}
                    alt={cup.current_holder.name_en}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2">
        <Button
          asChild
          variant="secondary"
          size="sm"
          className="flex-1 bg-muted hover:bg-muted/80 border-border"
        >
          <Link href={`/cms/cups/${cup.id}`}>
            <Eye className="h-4 w-4 mr-2" />
            View
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="bg-transparent border-border hover:border-muted-foreground"
        >
          <Link href={`/cms/cups/${cup.id}/edit`}>
            <Edit className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-red-500 hover:text-red-600 border-border hover:border-red-500/50 hover:bg-red-50"
          onClick={handleDelete}
          disabled={isPending}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
