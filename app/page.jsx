import { NavBar, NavBarMobile, Whatsapp } from "./components";
import { EighthSection, FifthSection, FirstSection, FourthSection, SecondSection, SeventhSection, SixthSection, ThirdSection, ThirdSectionMobile } from "./sections";
import { NinthSection } from "./sections/NinthSection";

export default function Home() {


    return (<>
        <NavBar />
        <NavBarMobile />
        <FirstSection />
        <SecondSection />
        <ThirdSection />
        <ThirdSectionMobile />
        <FifthSection />
        <FourthSection />
        <SixthSection />
        <SeventhSection />
        <EighthSection />
        <NinthSection />
        <Whatsapp />
    </>)
}
