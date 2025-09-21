import '../styling/LandingPage.css';
import HeroSection from '../components/general/HeroSection';
import IntroSection from '../components/general/IntroSection';
import Divider from '../components/general/Divider';
import CardGrid from '../components/landing_page/CardGrid';

import modelImage from '../assets/3d-model.png';
import FadeUpOnScroll from "../components/general/FadeUpOnScroll";

export default function LandingPage() {
    return (
        <div className="landing-container">
            <FadeUpOnScroll delay={0.05}>
                <HeroSection
                    title="Compare and Visualize Pathfinding Algorithms"
                    subtitle="A research-backed routing app showcasing pathfinding algorithms for multiple vehicle and routing types"
                />
            </FadeUpOnScroll>

            <FadeUpOnScroll delay={0.1}>
                <IntroSection
                    image={modelImage}
                    paragraphs={[
                        "Built as part of my dissertation at University of Piraeus, this app lets you...",
                        "• Explore shortest or fastest routes",
                        "• Select from various vehicle types",
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
                <CardGrid
                    cards={[
                    "Compare Algorithms & Profiles",
                    "Find Route",
                    "Read Project Overview"
                ]}
                  routes={[
                      "/compare",      // goes to CompareRoutePage
                      "/single",         // goes to SingleRoutePage
                      "/about"
                  ]}
                />
            </FadeUpOnScroll>
        </div>
    );
}
