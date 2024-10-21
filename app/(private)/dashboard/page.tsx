import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="">
      <Link href="/registerPatient" className="bg-blue-400 px-2 py-1 rounded-md text-white">
        Register patient
      </Link>
    </div>
  );
}
