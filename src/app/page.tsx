"use client";

import { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Search, Users, Star, ArrowRight, X, Swords, Target, Shield, Zap, Heart } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

// Define the Hero type based on your schema
interface Hero {
  id: number;
  heroName: string;
  role: string;
  pickRate: number;
  description: string;
  heroImage: string;
}

export default function HeroHub() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch initial heroes on component mount
  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/heroes');
      const data = await response.json();
      setHeroes(data);
    } catch (error) {
      console.error('Error fetching heroes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchHeroes();
      return;
    }

    try {
      setIsSearching(true);
      const response = await fetch('/api/heroes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword: searchQuery }),
      });
      const data = await response.json();
      setHeroes(data);
    } catch (error) {
      console.error('Error searching heroes:', error);
      setHeroes([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleViewHero = (hero: Hero) => {
    setSelectedHero(hero);
    setIsModalOpen(true);
  };

  // Function to get role color
  const getRoleColor = (role: string) => {
    switch(role.toLowerCase()) {
      case 'tank': return 'text-blue-400';
      case 'fighter': return 'text-red-400';
      case 'assassin': return 'text-purple-400';
      case 'mage': return 'text-pink-400';
      case 'marksman': return 'text-yellow-400';
      case 'support': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  // Function to get role icon
  const getRoleIcon = (role: string) => {
    switch(role.toLowerCase()) {
      case 'tank': return <Shield className="inline mr-1" size={16} />;
      case 'fighter': return <Swords className="inline mr-1" size={16} />;
      case 'assassin': return <Target className="inline mr-1" size={16} />;
      case 'mage': return <Zap className="inline mr-1" size={16} />;
      case 'marksman': return <Target className="inline mr-1" size={16} />;
      case 'support': return <Heart className="inline mr-1" size={16} />;
      default: return <Star className="inline mr-1" size={16} />;
    }
  };

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gradient-to-b from-[#0A1428] to-[#0A1428] py-8 pt-20">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#C89B3C] to-transparent opacity-10 pointer-events-none"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            {/* Header */}
            <div className="text-center mb-10 mt-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#C89B3C] via-[#C8AA6E] to-[#C89B3C] bg-clip-text text-transparent">
                Hero Pedia: Bang the Land of Dawn
              </h1>
              <p className="text-gray-400 mt-2">Discover the perfect hero for your next battle</p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-12">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C8AA6E]" size={20} />
                <Input
                  type="text"
                  placeholder="Search for heroes by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-6 text-lg border-2 border-[#3C3C41] bg-[#010A13] text-white focus:border-[#C89B3C] focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button 
                  type="submit" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#C89B3C] to-[#785A28] hover:from-[#C8AA6E] hover:to-[#C89B3C] text-white"
                  disabled={isSearching}
                >
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>
            </form>

            {/* Hero Cards Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#C89B3C]"></div>
              </div>
            ) : (
              <>
                {heroes.length === 0 ? (
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-semibold text-[#C8AA6E] mb-4">No heroes found</h2>
                    <p className="text-gray-400">Try a different search term or browse all heroes.</p>
                    <Button 
                      onClick={fetchHeroes}
                      className="mt-4 bg-gradient-to-r from-[#C89B3C] to-[#785A28] hover:from-[#C8AA6E] hover:to-[#C89B3C] text-white"
                    >
                      Browse All Heroes
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {heroes.map((hero) => (
                      <Card key={hero.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-[#3C3C41] bg-[#010A13] hover:border-[#C89B3C]">
                        <div className="h-48 overflow-hidden relative">
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1428] to-transparent z-10"></div>
                          <img 
                            src={hero.heroImage} 
                            alt={hero.heroName}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <CardHeader>
                          <CardTitle className="text-xl text-[#C8AA6E]">{hero.heroName}</CardTitle>
                          <CardDescription className={`${getRoleColor(hero.role)} flex items-center`}>
                            {getRoleIcon(hero.role)}{hero.role}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between mb-4">
                            <div className="flex items-center text-sm text-gray-400">
                              <Star size={16} className="mr-1 text-[#C89B3C]" />
                              <span>Pick Rate: {hero.pickRate}%</span>
                            </div>
                          </div>
                          <div className="mb-4">
                            <p className="text-sm text-gray-400 line-clamp-3">
                              {hero.description}
                            </p>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            className="w-full bg-gradient-to-r from-[#0397AB] to-[#0397AB] hover:from-[#05C3DE] hover:to-[#05C3DE] text-white"
                            onClick={() => handleViewHero(hero)}
                          >
                            View Hero Details
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Hero Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border border-[#3C3C41] bg-[#010A13] text-white">
            {selectedHero && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl text-[#C8AA6E]">{selectedHero.heroName}</DialogTitle>
                  <DialogDescription className={`${getRoleColor(selectedHero.role)} flex items-center`}>
                    {getRoleIcon(selectedHero.role)}{selectedHero.role}
                  </DialogDescription>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none text-white"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <div className="h-64 overflow-hidden rounded-lg">
                      <img 
                        src={selectedHero.heroImage} 
                        alt={selectedHero.heroName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex justify-between mt-4 mb-6">
                      <div className="flex items-center text-sm text-gray-400">
                        <Star size={16} className="mr-1 text-[#C89B3C]" />
                        <span>Pick Rate: {selectedHero.pickRate}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[#C8AA6E] mb-2">Hero Description:</h4>
                    <div className="text-gray-400">
                      {selectedHero.description}
                    </div>
                    
                    <div className="mt-6 p-4 bg-[#0A1428] rounded-lg">
                      <h4 className="font-semibold text-[#C8AA6E] mb-2">Role Specialty:</h4>
                      <div className="text-gray-400">
                        {selectedHero.role === 'Tank' && 'High durability and crowd control abilities.'}
                        {selectedHero.role === 'Fighter' && 'Balanced between offense and defense.'}
                        {selectedHero.role === 'Assassin' && 'High burst damage and mobility.'}
                        {selectedHero.role === 'Mage' && 'Powerful magical abilities and crowd control.'}
                        {selectedHero.role === 'Marksman' && 'Ranged physical damage dealer.'}
                        {selectedHero.role === 'Support' && 'Provides healing and utility to allies.'}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </SignedIn>

      <SignedOut>
        <div className="min-h-screen bg-gradient-to-b from-[#0A1428] to-[#0A1428] pt-20">
          {/* Hero Section */}
          <section className="relative py-16 md:py-24 overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593305841689-05c059eca2d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-10"></div>
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center relative z-10">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  <span className="text-white">Discover </span>
                  <span className="bg-gradient-to-r from-[#C89B3C] via-[#C8AA6E] to-[#C89B3C] bg-clip-text text-transparent">powerful heroes</span>
                  <span className="text-white"> for your team!</span>
                </h1>
                <p className="text-xl text-gray-400 mb-8">
                  Find the perfect heroes with detailed stats and pick rates to dominate the Land of Dawn.
                </p>
                <div className="flex gap-4">
                  <SignInButton mode="modal">
                    <Button className="bg-gradient-to-r from-[#C89B3C] to-[#785A28] hover:from-[#C8AA6E] hover:to-[#C89B3C] text-white px-8 py-3">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button className="bg-gradient-to-r from-[#0397AB] to-[#0397AB] hover:from-[#05C3DE] hover:to-[#05C3DE] text-white px-8 py-3">
                      Create Account
                    </Button>
                  </SignUpButton>
                </div>
              </div>
              
              <div className="md:w-1/2 relative">
                <div className="relative z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1635863138276-2c2e0d48d781?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="Mobile Legends hero collection" 
                    className="rounded-2xl shadow-2xl w-full h-auto border-2 border-[#3C3C41]"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#C89B3C] rounded-full opacity-20 z-0"></div>
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#0397AB] rounded-full opacity-20 z-0"></div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 bg-[#010A13]">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center text-[#C8AA6E] mb-12">Why Choose Hero Pedia</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-[#0A1428] p-6 rounded-2xl border border-[#3C3C41] text-center hover:border-[#C89B3C] transition-colors">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#C89B3C] to-[#785A28] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Swords className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-[#C8AA6E] mb-2">Comprehensive Stats</h3>
                  <p className="text-gray-400">Detailed hero statistics including pick rates and roles</p>
                </div>
                
                <div className="bg-[#0A1428] p-6 rounded-2xl border border-[#3C3C41] text-center hover:border-[#C89B3C] transition-colors">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#C89B3C] to-[#785A28] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-[#C8AA6E] mb-2">Role-Based Filtering</h3>
                  <p className="text-gray-400">Find heroes by their specific roles and playstyles</p>
                </div>
                
                <div className="bg-[#0A1428] p-6 rounded-2xl border border-[#3C3C41] text-center hover:border-[#C89B3C] transition-colors">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#C89B3C] to-[#785A28] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-[#C8AA6E] mb-2">Community Insights</h3>
                  <p className="text-gray-400">See which heroes are popular in the current meta</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-gradient-to-r from-[#0A1428] to-[#010A13]">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-[#C8AA6E] mb-6">Ready to Dominate the Battlefield?</h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of players who use HeroPedia to improve their gameplay and climb the ranks.
              </p>
              <SignUpButton mode="modal">
                <Button className="bg-gradient-to-r from-[#C89B3C] to-[#785A28] hover:from-[#C8AA6E] hover:to-[#C89B3C] text-white px-8 py-3 text-lg">
                  Get Started Now <ArrowRight className="ml-2" size={20} />
                </Button>
              </SignUpButton>
            </div>
          </section>
        </div>
      </SignedOut>
    </>
  );
}