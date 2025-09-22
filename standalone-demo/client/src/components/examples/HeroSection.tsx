import { HeroSection } from "../HeroSection";

export default function HeroSectionExample() {
  return (
    <HeroSection
      onSearch={(query) => console.log(`Searching for: ${query}`)}
      onGetStarted={() => console.log("Get started clicked")}
    />
  );
}