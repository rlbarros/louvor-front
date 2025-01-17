import { type DetailedHTMLProps, type InputHTMLAttributes } from "react";
import {
  type FieldErrors,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from "react-hook-form";
import { Input } from "@/components/ui/input";

interface InputProps<FormData extends FieldValues>
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string;
  name: Path<FormData>;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

const ZodInput = <FormData extends FieldValues>({
  label,
  name,
  errors,
  register,
  ...rest
}: InputProps<FormData>) => {
  const error = errors?.[name]?.message as string | undefined;

  return (
    <div className="flex flex-col">
      <label
        className="mb-2 block text-sm font-bold text-zinc-700"
        htmlFor={rest.id}
      >
        {label}
      </label>
      <Input
        type="text"
        className={`appearance-none rounded-md border border-zinc-300 px-3 py-2 leading-tight shadow-sm focus:border-zinc-500 focus:outline-none
        ${error ? "border-red-500" : "border-zinc-300"}`}
        {...rest}
        {...register(name)}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export { ZodInput };
