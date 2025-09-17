import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { LogIn, Utensils } from "lucide-react";
import { Button } from "~/components/ui/button";

export function Topnav() {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between bg-white px-6 py-4 shadow-md">
      <div className="flex items-center space-x-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#E74C3C] to-[#F39C12]">
          <Utensils className="text-white" size={16} />
        </div>
        <span className="text-xl font-bold text-gray-800">Kain Tayo!</span>
      </div>

      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton>
            <Button className="flex items-center gap-2 bg-gradient-to-r from-[#E74C3C] to-[#F39C12] text-white hover:from-[#C0392B] hover:to-[#D35400]">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
