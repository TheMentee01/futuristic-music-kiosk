
import React from 'react';
import { Card } from './common/Card';
import { GENRES } from '../constants';

const mockCreations = [
    { title: "Neon Drive at Midnight", user: "SynthwaveLover", prompt: "80s synthwave driving music" },
    { title: "Tears in the Rain", user: "BalladFan", prompt: "A sad song about a lost love" },
    { title: "Library Focus", user: "StudyBeats", prompt: "Lo-fi hip hop for studying" },
    { title: "Galactic Conflict", user: "MovieScoreFan", prompt: "An epic orchestral movie score" },
    { title: "Summer Vibes", user: "PopStar", prompt: "Upbeat pop track for the beach" },
    { title: "Empty City", user: "AmbientDreamer", prompt: "Atmospheric pads for a desolate city" },
];

const mockFeaturedStyles = ["Vintage Analog", "Hyperpop Glitch", "Cinematic Orchestra", "Drill Beats", "Acoustic Folk", "Hardstyle Kicks"];

export const TrendingScreen: React.FC = () => {
    return (
        <div className="min-h-screen w-full p-4 md:p-8 bg-bg-primary animate-fade-in pt-24">
            <header className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black gradient-text tracking-tight">
                    Trending on FUTURISTIC MUSIC KIOSK
                </h1>
                <p className="text-text-secondary mt-4 max-w-2xl mx-auto text-lg">
                    Discover the most popular genres, styles, and creations from the community.
                </p>
            </header>

            <main className="space-y-12">
                <section>
                    <h2 className="text-3xl font-bold text-accent-cyan mb-6">Top Genres This Week</h2>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {GENRES.slice(0, 7).map((genre, index) => (
                             <div key={genre} className="animate-slide-in-up" style={{ animationDelay: `${100 + index * 50}ms` }}>
                                <Card className="!p-4 text-center">
                                    <span className="text-2xl font-bold">#{index + 1}</span>
                                    <p className="text-xl text-text-primary mt-1">{genre}</p>
                                </Card>
                            </div>
                        ))}
                    </div>
                </section>
                
                 <section>
                    <h2 className="text-3xl font-bold text-accent-purple mb-6">Featured Artist Styles</h2>
                     <div className="flex flex-wrap gap-3 justify-center">
                        {mockFeaturedStyles.map((style, index) => (
                            <div key={style} className="bg-bg-secondary px-4 py-2 rounded-full border border-accent-purple/30 animate-slide-in-up" style={{ animationDelay: `${200 + index * 50}ms` }}>
                                <p className="font-semibold">{style}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-accent-pink mb-6">Recent Creations Showcase</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockCreations.map((creation, index) => (
                            <div key={index} className="animate-slide-in-up" style={{ animationDelay: `${300 + index * 100}ms` }}>
                                <Card className="hover:border-accent-pink hover:shadow-glow-pink transition-all duration-300 transform hover:-translate-y-1">
                                    <h3 className="text-xl font-bold text-text-primary">{creation.title}</h3>
                                    <p className="text-sm text-accent-cyan">by {creation.user}</p>
                                    <p className="text-text-secondary mt-3 italic">"{creation.prompt}"</p>
                                </Card>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};
