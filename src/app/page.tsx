"use client";

import { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Search, Users, Star, ArrowRight, X, Swords, Target } from "lucide-react";
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "~/components/ui/carousel";
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

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gradient-to-b from-[#f0f8ff] to-[#cce5ff] py-8">
          <div className="container mx-auto px-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-8 mt-16">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search for heroes by name, role, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-6 text-lg border-2 border-[#D6E4FF] focus:border-[#3B82F6]"
                />
                <Button 
                  type="submit" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] hover:from-[#2563EB] hover:to-[#1E40AF]"
                  disabled={isSearching}
                >
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>
            </form>

            {/* Hero Cards Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3B82F6]"></div>
              </div>
            ) : (
              <>
                {heroes.length === 0 ? (
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">No heroes found</h2>
                    <p className="text-gray-600">Try a different search term or browse all heroes.</p>
                    <Button 
                      onClick={fetchHeroes}
                      className="mt-4 bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] hover:from-[#2563EB] hover:to-[#1E40AF]"
                    >
                      Browse All Heroes
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {heroes.map((hero) => (
                      <Card key={hero.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={hero.heroImage} 
                            alt={hero.heroName}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <CardHeader>
                          <CardTitle className="text-xl text-[#3B82F6]">{hero.heroName}</CardTitle>
                          <CardDescription>{hero.role}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Target size={16} className="mr-1" />
                              <span>Role: {hero.role}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Star size={16} className="mr-1" />
                              <span>Pick Rate: {hero.pickRate}%</span>
                            </div>
                          </div>
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-700 mb-2">Description:</h4>
                            <p className="text-sm text-gray-600 line-clamp-3">
                              {hero.description}
                            </p>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            className="w-full bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] hover:from-[#2563EB] hover:to-[#1E40AF]"
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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedHero && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl text-[#3B82F6]">{selectedHero.heroName}</DialogTitle>
                  <DialogDescription>{selectedHero.role}</DialogDescription>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <img 
                      src={selectedHero.heroImage} 
                      alt={selectedHero.heroName}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    
                    <div className="flex justify-between mt-4 mb-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <Target size={16} className="mr-1" />
                        <span>Role: {selectedHero.role}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Star size={16} className="mr-1" />
                        <span>Pick Rate: {selectedHero.pickRate}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Description:</h4>
                    <div className="text-sm text-gray-600">
                      {selectedHero.description}
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </SignedIn>

      <SignedOut>
        <div className="min-h-screen bg-gradient-to-b from-[#f0f8ff] to-[#a3d0ff]">
          {/* Hero Section */}
          <section className="relative py-16 md:py-24 overflow-hidden">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                  Discover <span className="text-[#3B82F6]">powerful heroes</span> for your team!
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Find the perfect heroes with detailed stats and pick rates to dominate your games.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <SignUpButton mode="modal">
                    <Button size="lg" className="bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] hover:from-[#2563EB] hover:to-[#1E40AF] text-white text-lg px-8 py-6">
                      Get Started
                      <ArrowRight className="ml-2" size={20} />
                    </Button>
                  </SignUpButton>
                  <SignInButton>
                    <Button size="lg" variant="outline" className="border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#EBF5FF] text-lg px-8 py-6">
                      Browse Heroes
                    </Button>
                  </SignInButton>
                </div>
              </div>
              
              <div className="md:w-1/2 relative">
                <div className="relative z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="Hero collection" 
                    className="rounded-2xl shadow-2xl w-full h-auto"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#1D4ED8] rounded-full opacity-20 z-0"></div>
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#3B82F6] rounded-full opacity-20 z-0"></div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Hero Hub</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-[#EBF5FF] p-6 rounded-2xl border border-[#D6E4FF] text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Swords className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Comprehensive Stats</h3>
                  <p className="text-gray-600">Detailed hero statistics including pick rates and roles</p>
                </div>
                
                <div className="bg-[#EBF5FF] p-6 rounded-2xl border border-[#D6E4FF] text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Role-Based Filtering</h3>
                  <p className="text-gray-600">Find heroes by their specific roles and playstyles</p>
                </div>
                
                <div className="bg-[#EBF5FF] p-6 rounded-2xl border border-[#D6E4FF] text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Community Insights</h3>
                  <p className="text-gray-600">See which heroes are popular in the current meta</p>
                </div>
              </div>
            </div>
          </section>

          {/* Hero Role Section */}
          <section className="py-16 bg-gradient-to-br from-[#f0f8ff] to-[#a3d0ff]">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Hero Roles</h2>
              <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
                {/* Tank Card */}
                <div className="flex-1 min-w-[250px] bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-md p-6 flex flex-col">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Tanks</h3>
                  <p className="text-gray-600 text-center mb-4">Durable heroes who protect the team</p>
                  <Carousel className="w-full">
                    <CarouselContent>
                      <CarouselItem>
                        <img 
                          src="https://images.unsplash.com/photo-1635863138275-d9b33299680a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                          alt="Tank Hero 1" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </CarouselItem>
                      <CarouselItem>
                        <img 
                          src="https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                          alt="Tank Hero 2" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </Carousel>
                </div>
                
                {/* Damage Card */}
                <div className="flex-1 min-w-[250px] bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-md p-6 flex flex-col">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Damage</h3>
                  <p className="text-gray-600 text-center mb-4">High damage dealers who eliminate enemies</p>
                  <Carousel className="w-full">
                    <CarouselContent>
                      <CarouselItem>
                        <img 
                          src="https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                          alt="Damage Hero 1" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </CarouselItem>
                      <CarouselItem>
                        <img 
                          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                          alt="Damage Hero 2" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </Carousel>
                </div>
                
                {/* Support Card */}
                <div className="flex-1 min-w-[250px] bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-md p-6 flex flex-col">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Support</h3>
                  <p className="text-gray-600 text-center mb-4">Healers and utility heroes who enable the team</p>
                  <Carousel className="w-full">
                    <CarouselContent>
                      <CarouselItem>
                        <img 
                          src="https://images.unsplash.com/photo-1517638851339-a711cfcf3279?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                          alt="Support Hero 1" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </CarouselItem>
                      <CarouselItem>
                        <img 
                          src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                          alt="Support Hero 2" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </Carousel>
                </div>
              </div>
              <div className="text-center mt-10">
                <SignInButton>
                  <Button className="bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] hover:from-[#2563EB] hover:to-[#1E40AF] text-white px-6 py-3">
                    Explore All Roles
                  </Button>
                </SignInButton>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What Our Users Say</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-[#EBF5FF] p-6 rounded-2xl border border-[#D6E4FF]">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] rounded-full flex items-center justify-center text-white font-bold mr-4">
                      MJ
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Pro Player</h4>
                      <p className="text-sm text-gray-600">Competitive Gamer</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"Hero Hub helped me analyze the meta and improve my team composition strategy significantly!"</p>
                  <div className="flex mt-4 text-[#F39C12]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
                
                <div className="bg-[#EBF5FF] p-6 rounded-2xl border border-[#D6E4FF]">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] rounded-full flex items-center justify-center text-white font-bold mr-4">
                      JR
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Team Captain</h4>
                      <p className="text-sm text-gray-600">Esports Team</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"The detailed hero statistics and pick rates have been invaluable for our draft strategy in tournaments."</p>
                  <div className="flex mt-4 text-[#F39C12]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
                
                <div className="bg-[#EBF5FF] p-6 rounded-2xl border border-[#D6E4FF]">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] rounded-full flex items-center justify-center text-white font-bold mr-4">
                      AS
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Content Creator</h4>
                      <p className="text-sm text-gray-600">Strategy Guide Writer</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"I use Hero Hub daily to stay updated on the meta and create accurate guides for my audience."</p>
                  <div className="flex mt-4 text-[#F39C12]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </SignedOut>
    </>
  );
}