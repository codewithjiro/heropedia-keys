import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { LogIn, Swords, Crown, Zap, Search, Home, BarChart3, Users } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export function Topnav() {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between bg-gray-900/95 backdrop-blur-md px-6 py-3 border-b border-gray-700/50 shadow-lg">
      <div className="flex items-center space-x-2">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
            <Swords className="text-white" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
              HeroPedia
            </span>
            <span className="text-xs text-gray-400 -mt-1">Land of Dawn</span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <SignedOut>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-400 mr-4">
            <Zap size={14} className="text-blue-400 animate-pulse" />
            <span>Discover Powerful Heroes</span>
          </div>
          
          <SignInButton>
            <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 rounded-xl">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-700/50">
              <Crown size={14} className="text-yellow-400" />
              <span className="text-sm text-gray-300">Immortal Rank</span>
            </div>
            <UserButton appearance={{
              elements: {
                userButtonAvatarBox: "h-9 w-9 border-2 border-blue-500/50",
                userButtonOuterIdentifier: "text-gray-300 text-sm",
                userButtonPopoverCard: "bg-gray-800 border border-gray-700",
                userButtonPopoverActionButton: "text-gray-300 hover:bg-gray-700",
                userButtonPopoverActionButtonText: "text-gray-300",
                userButtonPopoverFooter: "bg-gray-800"
              }
            }} />
          </div>
        </SignedIn>
      </div>
    </nav>
  );
}