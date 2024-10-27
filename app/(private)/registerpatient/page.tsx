import RegisterPatientForm from "@/components/RegisterPatientForm";
export default function RegisterPatient() {
  return (
    <div className="w-1/2">
      <h1 className="font-bold text-xl underline underline-offset-4 pb-5">
        Register a Patient
      </h1>
      <RegisterPatientForm />
    </div>
  );
}
