import RoleSelectionForm from "@/components/RoleSelectionForm";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Save} from "lucide-react";

export default function RoleSelection() {
  return (
    <div className="">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Select Role</CardTitle>
          <CardDescription>Please select one of the below role and click Save</CardDescription>
        </CardHeader>
        <CardContent className="">
          {/* <RadioGroup defaultValue="option-one">
            <RadioGroupItem value="option-one" id="option-one" className="hidden" />
            <RadioGroupItem value="option-two" id="option-two" className="hidden" />
            <Label htmlFor="option-one" className="h-20 w-40">
              Doctor
            </Label>
            <Label htmlFor="option-one" className="">
              Patient
            </Label>
          </RadioGroup> */}
          <RoleSelectionForm />
        </CardContent>
      </Card>
    </div>
  );
}
