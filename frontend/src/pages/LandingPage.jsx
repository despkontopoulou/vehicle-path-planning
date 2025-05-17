import '../LandingPage.css';
import HeroSection from '../components/HeroSection';
import IntroSection from '../components/IntroSection';
import Divider from '../components/Divider';
import CardGrid from '../components/CardGrid';

import modelImage from '../assets/3d-model.png';
import FadeUpOnScroll from "../components/FadeUpOnScroll";

export default function LandingPage() {
    return (
        <div className="landing-container">
            <FadeUpOnScroll delay={0.05}>
                <HeroSection
                    title="Compare and Visualize Car Routing Algorithms"
                    subtitle="A research-backed routing app showcasing pathfinding algorithms"
                />
            </FadeUpOnScroll>

            <FadeUpOnScroll delay={0.1}>
                <IntroSection
                    image={modelImage}
                    paragraphs={[
                        "Built as part of my dissertation at University of Piraeus, this app lets you...",
                        "• Explore the shortest, fastest and eco-friendly routes",
                        "• Compare algorithm performance side by side",
                        "• Visualize routing on real maps",
                    ]}
                />
            </FadeUpOnScroll>

            <FadeUpOnScroll delay={0.2}>
                <Divider />
            </FadeUpOnScroll>

            <FadeUpOnScroll delay={0.4}>
                <p className="intro-sub">
                    This project combines <b>algorithmic theory</b>, <b>geospatial data</b> and <b>visualization of routes</b> using <b>GraphHopper</b> and <b>React</b>. It showcases the application of <b>pathfinding algorithms such as A*, Dijkstra and others</b> on <b>OpenStreetMap data</b>, offering a practical look into the fundamentals of modern routing systems.
                </p>
            </FadeUpOnScroll>

            <FadeUpOnScroll delay={0.5}>
                <CardGrid cards={[
                    "Compare Algorithms",
                    "Find Optimal Route",
                    "Read Project Overview"
                ]}/>
            </FadeUpOnScroll>
        </div>
    );
}
