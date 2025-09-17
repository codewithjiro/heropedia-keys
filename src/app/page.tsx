"use client";

import { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Search, Users, Star, ArrowRight, X, Swords, Target, Shield, Zap, Heart, Filter, ChevronDown, BarChart3, BookOpen, Skull } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";

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
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRole, setSelectedRole] = useState("all");

  // Sample roles for filtering
  const roles = ["all", "tank", "fighter", "assassin", "mage", "marksman", "support"];

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
      case 'tank': return 'bg-blue-500/20 text-blue-300 border-blue-500';
      case 'fighter': return 'bg-red-500/20 text-red-300 border-red-500';
      case 'assassin': return 'bg-purple-500/20 text-purple-300 border-purple-500';
      case 'mage': return 'bg-pink-500/20 text-pink-300 border-pink-500';
      case 'marksman': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
      case 'support': return 'bg-green-500/20 text-green-300 border-green-500';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500';
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

  // Filter heroes by role
  const filteredHeroes = selectedRole === "all" 
    ? heroes 
    : heroes.filter(hero => hero.role.toLowerCase() === selectedRole);

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 py-8 pt-20">
          {/* Animated background elements */}
          <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none"></div>
          <div className="absolute top-48 right-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            {/* Header */}
            <div className="text-center mb-10 mt-8">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                Hero Pedia: Land of Dawn
              </h1>
              <p className="text-gray-400 mt-3 text-lg">Discover the perfect hero for your next battle</p>
            </div>

            {/* Search and Filter Section */}
            <div className="mb-12 bg-gray-800/30 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 shadow-lg">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative max-w-2xl mx-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
                  <Input
                    type="text"
                    placeholder="Search for heroes by name, role, or ability..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-6 text-lg border-2 border-gray-700 bg-gray-800/50 text-white focus:border-blue-400 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl"
                  />
                  <Button 
                    type="submit" 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg"
                    disabled={isSearching}
                  >
                    {isSearching ? "Searching..." : "Search"}
                  </Button>
                </div>
              </form>
              
              <div className="flex justify-center items-center">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-700/50"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size={16} />
                  Filter by Role
                  <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </Button>
              </div>
              
              {showFilters && (
                <div className="flex justify-center flex-wrap gap-3 mt-4 animate-in fade-in duration-300">
                  {roles.map(role => (
                    <Button
                      key={role}
                      variant={selectedRole === role ? "default" : "outline"}
                      className={`capitalize rounded-full ${selectedRole === role ? 'bg-blue-500 hover:bg-blue-600' : 'border-gray-600 text-gray-300 hover:bg-gray-700/50'}`}
                      onClick={() => setSelectedRole(role)}
                    >
                      {role === "all" ? "All Roles" : role}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Hero Cards Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {filteredHeroes.length === 0 ? (
                  <div className="text-center py-12 bg-gray-800/30 backdrop-blur-md rounded-2xl border border-gray-700/50">
                    <h2 className="text-2xl font-semibold text-blue-400 mb-4">No heroes found</h2>
                    <p className="text-gray-400">Try a different search term or browse all heroes.</p>
                    <Button 
                      onClick={fetchHeroes}
                      className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    >
                      Browse All Heroes
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredHeroes.map((hero) => (
                      <Card 
                        key={hero.id} 
                        className="overflow-hidden transition-all duration-300 border border-gray-700 bg-gray-800/30 backdrop-blur-md hover:border-blue-400/50 hover:shadow-lg hover:scale-[1.02] group"
                      >
                        <div className="h-48 overflow-hidden relative">
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10 opacity-80"></div>
                          <div className="absolute top-3 right-3 z-20">
                            <Badge className={`${getRoleColor(hero.role)} border`}>
                              {getRoleIcon(hero.role)}{hero.role}
                            </Badge>
                          </div>
                          <img 
                            src={hero.heroImage} 
                            alt={hero.heroName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-xl text-white group-hover:text-blue-300 transition-colors">{hero.heroName}</CardTitle>
                          <CardDescription className="text-gray-400 line-clamp-2">
                            {hero.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-4">
                          <div className="flex items-center text-sm text-gray-400">
                            <Star size={16} className="mr-1 text-yellow-400" fill="currentColor" />
                            <span>Pick Rate: {hero.pickRate}%</span>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white group-hover:shadow-lg"
                            onClick={() => handleViewHero(hero)}
                          >
                            View Details
                            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden border border-gray-700 bg-gray-800 text-white p-0">
            {selectedHero && (
              <>
                <DialogHeader className="p-6 pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <DialogTitle className="text-3xl font-bold text-white">{selectedHero.heroName}</DialogTitle>
                      <DialogDescription className={`inline-flex items-center mt-1 ${getRoleColor(selectedHero.role)} px-3 py-1 rounded-full`}>
                        {getRoleIcon(selectedHero.role)}{selectedHero.role}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="w-full justify-start px-6 pt-4 bg-transparent border-b border-gray-700 rounded-none">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 data-[state=active]:border-b-2 data-[state=active]:border-blue-400 rounded-none">Overview</TabsTrigger>
                    <TabsTrigger value="stats" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 data-[state=active]:border-b-2 data-[state=active]:border-blue-400 rounded-none">Stats</TabsTrigger>
                  </TabsList>
                  
                  <ScrollArea className="h-[60vh]">
                    <TabsContent value="overview" className="m-0 focus-visible:ring-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                        <div>
                          <div className="h-80 overflow-hidden rounded-xl">
                            <img 
                              src={selectedHero.heroImage} 
                              alt={selectedHero.heroName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex justify-between mt-4 mb-6">
                            <div className="flex items-center text-sm text-gray-400">
                              <Star size={16} className="mr-1 text-yellow-400" fill="currentColor" />
                              <span>Pick Rate: {selectedHero.pickRate}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-blue-400 mb-2 text-lg">Hero Description:</h4>
                          <div className="text-gray-300 mb-6">
                            {selectedHero.description}
                          </div>
                          
                          <div className="p-4 bg-gray-700/30 rounded-xl">
                            <h4 className="font-semibold text-blue-400 mb-2 text-lg">Role Specialty:</h4>
                            <div className="text-gray-300">
                              {selectedHero.role === 'Tank' && 'High durability and crowd control abilities. Excels at protecting allies and initiating team fights.'}
                              {selectedHero.role === 'Fighter' && 'Balanced between offense and defense. Versatile heroes capable of both dealing and taking damage.'}
                              {selectedHero.role === 'Assassin' && 'High burst damage and mobility. Specializes in eliminating high-priority targets quickly.'}
                              {selectedHero.role === 'Mage' && 'Powerful magical abilities and crowd control. Deals massive area damage from a distance.'}
                              {selectedHero.role === 'Marksman' && 'Ranged physical damage dealer. Excels at dealing consistent damage, especially later in the game.'}
                              {selectedHero.role === 'Support' && 'Provides healing, utility, and protection to allies. Enhances team effectiveness in various ways.'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="stats" className="m-0 focus-visible:ring-0 p-6">
                      <h3 className="text-xl font-semibold text-blue-400 mb-4">Performance Statistics</h3>
                      <div className="bg-gray-700/30 p-4 rounded-xl">
                        <div className="flex items-center mb-4">
                          <BarChart3 className="text-blue-400 mr-2" size={20} />
                          <h4 className="font-medium text-white">Win Rate & Popularity</h4>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-800/50 p-4 rounded-lg">
                            <div className="text-sm text-gray-400 mb-1">Win Rate</div>
                            <div className="text-2xl font-bold text-green-400">52.3%</div>
                          </div>
                          
                          <div className="bg-gray-800/50 p-4 rounded-lg">
                            <div className="text-sm text-gray-400 mb-1">Ban Rate</div>
                            <div className="text-2xl font-bold text-red-400">15.8%</div>
                          </div>
                          
                          <div className="bg-gray-800/50 p-4 rounded-lg">
                            <div className="text-sm text-gray-400 mb-1">Matches Recorded</div>
                            <div className="text-2xl font-bold text-blue-400">2.4M</div>
                          </div>
                          
                          <div className="bg-gray-800/50 p-4 rounded-lg">
                            <div className="text-sm text-gray-400 mb-1">Tier Ranking</div>
                            <div className="text-2xl font-bold text-yellow-400">A+</div>
                          </div>
                        </div>
                        
                        <div className="mt-6 text-sm text-gray-400">
                          * Statistics based on recent ranked match data across all regions
                        </div>
                      </div>
                    </TabsContent>
                  </ScrollArea>
                </Tabs>
              </>
            )}
          </DialogContent>
        </Dialog>
      </SignedIn>

      <SignedOut>
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 pt-20">
          {/* Hero Section */}
          <section className="relative py-16 md:py-24 overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593305841689-05c059eca2d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-10"></div>
            
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center relative z-10">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  <span className="text-white">Master the </span>
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient">Land of Dawn</span>
                </h1>
                <p className="text-xl text-gray-400 mb-8">
                  Find the perfect heroes with detailed stats, pick rates, and strategies to dominate every match.
                </p>
                <div className="flex gap-4">
                  <SignInButton mode="modal">
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-xl">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white border border-gray-600 px-8 py-3 rounded-xl">
                      Create Account
                    </Button>
                  </SignUpButton>
                </div>
              </div>
              
              <div className="md:w-1/2 relative">
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-700/50">
                  <img 
                    src="https://media1.tenor.com/m/6d49ys0_9mcAAAAC/mobile-legends.gif" 
                    alt="Mobile Legends hero collection" 
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-500/20 rounded-full blur-xl z-0"></div>
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-500/20 rounded-full blur-xl z-0"></div>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="py-20 bg-gray-900 relative">
            {/* background accent */}
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]"></div>
            
            <div className="container mx-auto px-6 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">Why Choose Hero Pedia?</h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-12">
                  Hero Pedia is your ultimate companion for mastering the battlefield.  
                  We provide in-depth hero statistics, role-based insights, and community-driven data  
                  to help players stay ahead of the meta.
                </p>
              </div>

              {/* Feature cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 text-center hover:border-blue-400/30 transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500/20 rounded-xl mb-4">
                    <Users className="text-blue-400" size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Built for Players</h3>
                  <p className="text-gray-400">Designed with the community in mind, tailored for every skill level.</p>
                </div>
                
                <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 text-center hover:border-purple-400/30 transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-500/20 rounded-xl mb-4">
                    <Star className="text-purple-400" size={28} fill="currentColor" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Meta Updates</h3>
                  <p className="text-gray-400">Stay updated with the latest trends, hero picks, and strategies.</p>
                </div>
                
                <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 text-center hover:border-blue-400/30 transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500/20 rounded-xl mb-4">
                    <BarChart3 className="text-blue-400" size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Data-Driven</h3>
                  <p className="text-gray-400">Powered by accurate stats to help you make smarter hero choices.</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-900">
            <div className="container mx-auto px-4 text-center">
              <div className="max-w-2xl mx-auto bg-gray-800/30 backdrop-blur-md p-8 rounded-2xl border border-gray-700/50">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to Dominate the Battlefield?</h2>
                <p className="text-xl text-gray-400 mb-8">
                  Join thousands of players who use HeroPedia to improve their gameplay and climb the ranks.
                </p>
                <SignUpButton mode="modal">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 text-lg rounded-xl">
                    Get Started Now <ArrowRight className="ml-2" size={20} />
                  </Button>
                </SignUpButton>
              </div>
            </div>
          </section>
        </div>
      </SignedOut>
    </>
  );
}