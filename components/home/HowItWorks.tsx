import { cn } from "@/lib/utils";
import arrow from "@/public/arrow.png";
import { PhoneCall, UserPlus, TrendingUp } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="min-h-[100svh] bg-background/90 w-full flex justify-center items-center px-5 md:px-0 py-10 md:py-20"
    >
      <div className="flex flex-col gap-20 items-center">
        {/* Section heading */}
        <section className="flex flex-col items-center gap-5 text-center">
          <h2 className="text-blue-500 text-lg font-semibold tracking-wide">
            How It Works
          </h2>
          <h3 className="text-foreground md:text-4xl text-2xl font-bold">
            24x7 AI Receptionist for Seamless Customer Service
          </h3>
        </section>

        {/* Steps with icons */}
        <section className="flex items-center justify-center gap-10 md:gap-20 w-full h-full flex-col md:flex-row">
          <Item
            text="Answer Inbound Calls"
            description="AI receptionist answers all customer calls anytime, 24/7."
            icon={<PhoneCall className="h-8 w-8 text-blue-500" />}
            className="rotate-[20deg]"
          />

          <Item
            text="Seamless Onboarding"
            description="Onboard new customers smoothly with AI-driven conversations."
            icon={<UserPlus className="h-8 w-8 text-blue-500" />}
            className="transform rotate-[340deg] -scale-x-100"
          />

          <Item
            text="Scale Operations Effortlessly"
            description="Easily scale front desk operations with no additional staff."
            icon={<TrendingUp className="h-8 w-8 text-blue-500" />}
          />
        </section>
      </div>
    </section>
  );
};

// Single step Item component
const Item = ({
  text,
  icon,
  description,
  className,
}: {
  text: string;
  icon: ReactNode;
  description: string;
  className?: string;
}) => {
  return (
    <article className="flex flex-col items-center justify-center gap-5 relative">
      {/* Icon container with hover and animation */}
      <div className="bg-muted w-28 h-28 rounded-2xl shadow-lg items-center flex justify-center transition-transform duration-300 hover:scale-110">
        {icon}
      </div>

      {/* Step text */}
      <span className="font-bold tracking-wide text-lg mt-5 text-foreground">
        {text}
      </span>
      <span className="text-sm w-2/3 text-center text-muted-foreground">
        {description}
      </span>

      {/* Arrow image between steps */}
      <Image
        src={arrow}
        width={100}
        height={100}
        alt="arrow"
        className={cn(
          "absolute -right-[120px] top-[30%] opacity-50 transform scale-125",
          className
        )}
      />
    </article>
  );
};

export default HowItWorks;
