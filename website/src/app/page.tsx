import { Hero } from "@/components/Hero";
import { Shift } from "@/components/Shift";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { Proof } from "@/components/Proof";
import { Faq } from "@/components/Faq";
import { Cta } from "@/components/Cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Shift />
      <Services />
      <Process />
      <Proof />
      <Faq />
      <Cta />
    </>
  );
}
