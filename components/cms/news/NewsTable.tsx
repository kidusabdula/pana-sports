"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useNews, useDeleteNews } from "@/lib/hooks/cms/useNews";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  Newspaper,
  Calendar,
  Filter,
  Eye,
  MessageSquare,
  Star,
  User,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NewsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterLeague, setFilterLeague] = useState<string>("all");
  const [filterPublished, setFilterPublished] = useState<string>("all");
  const {
    data: news,
    isLoading,
    error,
  } = useNews({
    category: filterCategory !== "all" ? filterCategory : undefined,
    league: filterLeague !== "all" ? filterLeague : undefined,
    published:
      filterPublished !== "all" ? filterPublished === "published" : undefined,
  });
  const deleteNewsMutation = useDeleteNews();

  const filteredNews =
    news?.filter((item) => {
      const matchesSearch =
        item.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title_am.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.league?.name_en.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    }) || [];

  const handleDelete = async (id: string, title: string) => {
    const promise = deleteNewsMutation.mutateAsync(id);

    toast.promise(promise, {
      loading: `Deleting "${title}"...`,
      success: `News "${title}" deleted successfully`,
      error: (error) => {
        return error instanceof Error ? error.message : "Failed to delete news";
      },
    });

    try {
      await promise;
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );

  if (error)
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-destructive">
            <Newspaper className="h-5 w-5" />
            <span>
              Error loading news:{" "}
              {error instanceof Error ? error.message : "Unknown error"}
            </span>
          </div>
        </CardContent>
      </Card>
    );

  const categories = Array.from(
    new Set(news?.map((n) => n.category?.name_en).filter(Boolean) || [])
  );
  const leagues = Array.from(
    new Set(news?.map((n) => n.league?.name_en).filter(Boolean) || [])
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card className="bg-linear-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Total Articles
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
                  {news?.length || 0}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-primary/10 rounded-full">
                <Newspaper className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Total Views
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
                  {news?.reduce((sum, item) => sum + item.views, 0) || 0}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-500/10 rounded-full">
                <Eye className="h-4 w-4 sm:h-6 sm:w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-green-500/5 to-green-500/10 border-green-500/20">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Published Today
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
                  {news?.filter((n) => {
                    if (!n.published_at) return false;
                    const publishedDate = new Date(n.published_at);
                    const now = new Date();
                    return (
                      publishedDate.getDate() === now.getDate() &&
                      publishedDate.getMonth() === now.getMonth() &&
                      publishedDate.getFullYear() === now.getFullYear()
                    );
                  }).length || 0}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-500/10 rounded-full">
                <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-amber-500/5 to-amber-500/10 border-amber-500/20">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Featured
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
                  {news?.filter((n) => n.is_featured).length || 0}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-amber-500/10 rounded-full">
                <Star className="h-4 w-4 sm:h-6 sm:w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card className="shadow-sm border border-border/50 bg-card rounded-xl overflow-hidden">
        <CardHeader className="bg-background/50 border-b border-border/50 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                News Articles ({news?.length || 0})
              </CardTitle>
              <Link href="/cms/news/create" className="sm:hidden">
                <Button size="sm" className="h-8 gap-1.5 rounded-lg shadow-sm">
                  <Plus className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only">Add</span>
                </Button>
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 bg-background border-input focus:border-primary rounded-lg transition-all text-sm"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-[140px] h-9 text-sm">
                  <div className="flex items-center gap-2">
                    <Filter className="h-3.5 w-3.5" />
                    <SelectValue placeholder="Category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat || ""}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterLeague} onValueChange={setFilterLeague}>
                <SelectTrigger className="w-full sm:w-[140px] h-9 text-sm">
                  <SelectValue placeholder="League" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Leagues</SelectItem>
                  {leagues.map((league) => (
                    <SelectItem key={league} value={league || ""}>
                      {league}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filterPublished}
                onValueChange={setFilterPublished}
              >
                <SelectTrigger className="w-full sm:w-[140px] h-9 text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Link href="/cms/news/create" className="hidden sm:block">
                <Button size="sm" className="h-9 gap-2 rounded-lg shadow-sm">
                  <Plus className="h-4 w-4" />
                  Add Article
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>

        {/* Mobile: Card Layout */}
        <div className="lg:hidden divide-y divide-border/40">
          {filteredNews.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="flex flex-col items-center space-y-3">
                <Newspaper className="h-12 w-12 text-muted-foreground/20" />
                <p className="text-muted-foreground text-sm">No news found.</p>
              </div>
            </div>
          ) : (
            filteredNews.map((item) => (
              <div
                key={item.id}
                className="p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex gap-3">
                  {/* Thumbnail */}
                  {item.thumbnail_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.thumbnail_url}
                      alt=""
                      className="h-20 w-28 object-cover rounded shrink-0"
                    />
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Title & Featured */}
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-2 text-foreground">
                          {item.title_en}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {item.title_am}
                        </p>
                      </div>
                      {item.is_featured && (
                        <Star className="h-4 w-4 text-amber-500 fill-current shrink-0" />
                      )}
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {item.category && (
                        <Badge
                          variant="outline"
                          className="capitalize text-[10px] px-1.5 py-0"
                          style={{
                            backgroundColor: item.category.color
                              ? `${item.category.color}20`
                              : undefined,
                            borderColor: item.category.color || undefined,
                          }}
                        >
                          {item.category.name_en}
                        </Badge>
                      )}
                      <Badge
                        variant={item.is_published ? "default" : "secondary"}
                        className="text-[10px] px-1.5 py-0"
                      >
                        {item.is_published ? "Published" : "Draft"}
                      </Badge>
                      {item.author && (
                        <span className="text-muted-foreground flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {item.author.name}
                        </span>
                      )}
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {item.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {item.comments_count}
                        </span>
                        {item.published_at && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(item.published_at), "MMM dd")}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <Link href={`/cms/news/${item.id}/edit`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        </Link>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Article
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &quot;
                                {item.title_en}&quot;? This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDelete(item.id, item.title_en)
                                }
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop: Table Layout */}
        <div className="hidden lg:block overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-b border-border/50">
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider pl-6">
                  Title
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Category
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Author
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  League
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Published
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider text-center">
                  Views
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider text-center">
                  Comments
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider text-center">
                  Status
                </TableHead>
                <TableHead className="text-right font-medium text-muted-foreground text-xs uppercase tracking-wider pr-6">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12">
                    <div className="flex flex-col items-center space-y-3">
                      <Newspaper className="h-12 w-12 text-muted-foreground/20" />
                      <p className="text-muted-foreground">No news found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredNews.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-muted/30 transition-colors border-b border-border/40"
                  >
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        {item.thumbnail_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.thumbnail_url}
                            alt=""
                            className="h-10 w-16 object-cover rounded shrink-0"
                          />
                        )}
                        <div className="flex flex-col min-w-0 max-w-[250px] xl:max-w-[350px]">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground text-sm truncate">
                              {item.title_en}
                            </span>
                            {item.is_featured && (
                              <Star className="h-3 w-3 text-amber-500 fill-current shrink-0" />
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground truncate">
                            {item.title_am}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.category && (
                        <Badge
                          variant="outline"
                          className="capitalize whitespace-nowrap"
                          style={{
                            backgroundColor: item.category.color
                              ? `${item.category.color}20`
                              : undefined,
                            borderColor: item.category.color || undefined,
                          }}
                        >
                          {item.category.name_en}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground truncate max-w-[120px] block">
                        {item.author?.name || "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground truncate max-w-[120px] block">
                        {item.league?.name_en || "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {item.published_at
                          ? format(new Date(item.published_at), "MMM dd, yyyy")
                          : "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Eye className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{item.views}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <MessageSquare className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{item.comments_count}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={item.is_published ? "default" : "secondary"}
                        className="text-xs whitespace-nowrap"
                      >
                        {item.is_published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/cms/news/${item.id}/edit`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Article
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &quot;
                                {item.title_en}&quot;? This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                              <AlertDialogCancel className="m-0">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDelete(item.id, item.title_en)
                                }
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 m-0"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
