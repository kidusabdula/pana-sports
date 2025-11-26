"use client";

import { useState } from "react";
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
import { useComments, useDeleteComment, useUpdateComment } from "@/lib/hooks/useComments";
import {
  Trash2,
  Search,
  MessageSquare,
  Flag,
  CheckCircle,
  XCircle,
  Calendar,
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

export default function CommentTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { data: comments, isLoading, error } = useComments();
  const deleteCommentMutation = useDeleteComment();
  const updateCommentMutation = useUpdateComment();

  const filteredComments =
    comments?.filter((comment) => {
      const matchesSearch =
        comment.content_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.news?.title_en.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "flagged" && comment.flagged) ||
        (filterStatus === "deleted" && comment.deleted) ||
        (filterStatus === "active" && !comment.flagged && !comment.deleted);

      return matchesSearch && matchesStatus;
    }) || [];

  const handleDelete = async (id: string) => {
    const promise = deleteCommentMutation.mutateAsync(id);

    toast.promise(promise, {
      loading: "Deleting comment...",
      success: "Comment deleted successfully",
      error: (error) => {
        return error instanceof Error
          ? error.message
          : "Failed to delete comment";
      },
    });

    try {
      await promise;
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleFlag = async (id: string, currentFlag: boolean) => {
    const promise = updateCommentMutation.mutateAsync({
      id,
      updates: { flagged: !currentFlag },
    });

    toast.promise(promise, {
      loading: currentFlag ? "Unflagging comment..." : "Flagging comment...",
      success: currentFlag ? "Comment unflagged" : "Comment flagged",
      error: (error) => {
        return error instanceof Error
          ? error.message
          : "Failed to update comment";
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
            <MessageSquare className="h-5 w-5" />
            <span>
              Error loading comments:{" "}
              {error instanceof Error ? error.message : "Unknown error"}
            </span>
          </div>
        </CardContent>
      </Card>
    );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Comments
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {comments?.length || 0}
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {comments?.filter(c => !c.flagged && !c.deleted).length || 0}
                </p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/5 to-yellow-500/10 border-yellow-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Flagged
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {comments?.filter(c => c.flagged).length || 0}
                </p>
              </div>
              <div className="p-3 bg-yellow-500/10 rounded-full">
                <Flag className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/5 to-red-500/10 border-red-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Deleted
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {comments?.filter(c => c.deleted).length || 0}
                </p>
              </div>
              <div className="p-3 bg-red-500/10 rounded-full">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card className="shadow-sm border border-border/50 bg-card rounded-xl overflow-hidden">
        <CardHeader className="bg-background/50 border-b border-border/50 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                Comments ({comments?.length || 0})
              </CardTitle>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search comments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 bg-background border-input focus:border-primary w-64 rounded-lg transition-all"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                  <SelectItem value="deleted">Deleted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-b border-border/50">
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Comment
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Article
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Date
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="text-right font-medium text-muted-foreground text-xs uppercase tracking-wider pr-6">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center space-y-3">
                      <MessageSquare className="h-12 w-12 text-muted-foreground/20" />
                      <p className="text-muted-foreground">No comments found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredComments.map((comment) => (
                  <TableRow
                    key={comment.id}
                    className="hover:bg-muted/30 transition-colors border-b border-border/40"
                  >
                    <TableCell>
                      <div className="max-w-md">
                        <p className="text-sm text-foreground line-clamp-2">
                          {comment.content_en}
                        </p>
                        {comment.content_am && (
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                            {comment.content_am}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground line-clamp-1">
                        {comment.news?.title_en || "Unknown"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(comment.created_at), "MMM dd, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {comment.deleted && (
                          <Badge variant="destructive">Deleted</Badge>
                        )}
                        {comment.flagged && (
                          <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                            Flagged
                          </Badge>
                        )}
                        {!comment.deleted && !comment.flagged && (
                          <Badge variant="outline" className="border-green-500 text-green-600">
                            Active
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleFlag(comment.id, comment.flagged)}
                          className={`h-8 w-8 rounded-full ${
                            comment.flagged
                              ? "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100"
                              : "text-muted-foreground hover:text-yellow-600 hover:bg-yellow-50"
                          }`}
                        >
                          <Flag className="h-4 w-4" />
                        </Button>

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
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this comment? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(comment.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
