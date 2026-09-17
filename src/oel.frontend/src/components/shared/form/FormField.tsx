import { Label } from "@/components/ui/label";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
};

export default function FormField({ label, htmlFor, required, children }: FormFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}{required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}
