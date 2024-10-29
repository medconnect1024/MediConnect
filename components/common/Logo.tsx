import { useConvexAuth } from "convex/react";
import Link from "next/link";
import Image from "next/image";
import LogoImage from "./logo.png"; // Adjust the path as needed

export default function Logo() {
  const { isAuthenticated } = useConvexAuth();

  return (
    <div className="hidden md:flex gap-10 items-center justify-start flex-1">
      <Link href={isAuthenticated ? "/docdashboard" : "/"}>
        <div className="flex gap-1 justify-center items-center transform scale-125">
          {" "}
          {/* Adjust scale as needed */}
          <Image
            src={LogoImage}
            alt="My Medi Records Logo"
            width={150}
            height={150}
          />
        </div>
      </Link>
    </div>
  );
}
