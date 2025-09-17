import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { LogIn, Swords, Crown, Zap } from "lucide-react";
import { Button } from "~/components/ui/button";

export function Topnav() {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between bg-[#0A1428] px-6 py-4 border-b border-[#3C3C41] shadow-lg">
      <div className="flex items-center space-x-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#C89B3C] to-[#785A28]">
          <Swords className="text-white" size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold bg-gradient-to-r from-[#C89B3C] via-[#C8AA6E] to-[#C89B3C] bg-clip-text text-transparent">
            HeroPedia
          </span>
          <span className="text-xs text-gray-400 -mt-1">Mobile Legends</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
          <Zap size={14} className="text-[#C89B3C]" />
          <span>Discover Powerful Heroes</span>
        </div>
        
        <SignedOut>
          <SignInButton>
            <Button className="flex items-center gap-2 bg-gradient-to-r from-[#C89B3C] to-[#785A28] text-white hover:from-[#C8AA6E] hover:to-[#C89B3C]">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-[#010A13] px-3 py-1 rounded-full border border-[#3C3C41]">
              <Crown size={14} className="text-[#C89B3C]" />
              <span className="text-sm text-gray-300">Legend Rank</span>
            </div>
            <UserButton appearance={{
              elements: {
                userButtonAvatarBox: "h-9 w-9 border border-[#C89B3C]",
                userButtonOuterIdentifier: "text-gray-300"
              }
            }} />
          </div>
        </SignedIn>
      </div>
    </nav>
  );
}