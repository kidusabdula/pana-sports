"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  LogOut,
  Settings,
  User,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  user: {
    id: string;
    email?: string;
    user_metadata?: {
      role?: string;
      name?: string;
    };
  } | null;
}

export function Header({ user }: HeaderProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border/40 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Search (Mockup for design) */}
          <div className="flex-1 flex items-center max-w-md">
            <div className="relative w-full max-w-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-input rounded-full leading-5 bg-muted/50 placeholder-muted-foreground focus:outline-none focus:bg-background focus:ring-1 focus:ring-primary sm:text-sm transition-all duration-200"
                placeholder="Search..."
              />
            </div>
          </div>

          {/* Right Side - Notifications & User Menu */}
          <div className="flex items-center space-x-4">
            {/* View Site Link */}
            <Link
              href="/"
              className="hidden md:inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 mr-2"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Site
            </Link>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-full hover:bg-muted transition-all duration-200"
              >
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-destructive rounded-full border-2 border-background"></span>
              </Button>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 px-2 rounded-full hover:bg-muted transition-all duration-200 gap-2"
                >
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage
                      src=""
                      alt={user?.user_metadata?.name || user?.email || ""}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                      {user?.user_metadata?.name?.charAt(0) ||
                        user?.email?.charAt(0) ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start text-xs">
                    <span className="font-medium text-foreground">
                      {user?.user_metadata?.name || "Admin"}
                    </span>
                    <span className="text-muted-foreground/80">
                      View Profile
                    </span>
                  </div>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 p-2 shadow-xl border border-border/50 bg-background/95 backdrop-blur-sm rounded-xl"
                align="end"
                forceMount
              >
                {/* User Info Section */}
                <DropdownMenuLabel className="p-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      {user?.user_metadata?.name || "Admin User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="my-1 bg-border/50" />

                {/* Menu Items */}
                <div className="space-y-1">
                  <DropdownMenuItem className="p-2.5 rounded-lg hover:bg-muted cursor-pointer transition-colors duration-200">
                    <User className="mr-3 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Profile</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="p-2.5 rounded-lg hover:bg-muted cursor-pointer transition-colors duration-200">
                    <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Settings</span>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="my-1 bg-border/50" />

                {/* Sign Out */}
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="p-2.5 rounded-lg hover:bg-destructive/10 hover:text-destructive cursor-pointer transition-all duration-200"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span className="text-sm font-medium">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
