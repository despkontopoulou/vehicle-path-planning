import '../LandingPage.css';
import HeroSection from '../components/HeroSection';
import IntroSection from '../components/IntroSection';
import Divider from '../components/Divider';
import CardGrid from '../components/CardGrid';

import modelImage from '../assets/3d-model.png';

export default function LandingPage() {
    return (
        <div className="landing-container">
            <HeroSection
                title="Compare and Visualize Car Routing Algorithms"
                subtitle="A research-backed routing app showcasing pathfinding algorithms"
            />

            <IntroSection
                image={modelImage}
                paragraphs={[
                    "Built as part of my dissertation at University of Piraeus, this app lets you...",
                    "• Explore the shortest, fastest and eco-friendly routes",
                    "• Compare algorithm performance side by side",
                    "• Visualize routing on real maps"
                ]}
            />

            <Divider />

            <CardGrid cards={[
                "Research Mode",
                "User Mode",
                "More Features Soon"
            ]} />
        </div>
    );
}
