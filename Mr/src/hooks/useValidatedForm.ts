import { useForm, type FieldValues, type Resolver, type UseFormProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodTypeAny } from "zod";

interface UseValidatedFormProps<TFieldValues extends FieldValues>
  extends Omit<UseFormProps<TFieldValues>, "resolver"> {
  schema: ZodTypeAny;
}

export const useValidatedForm = <TFieldValues extends FieldValues>({
  schema,
  ...props
}: UseValidatedFormProps<TFieldValues>) => {
  return useForm<TFieldValues>({
    ...props,
    resolver: zodResolver(schema as any) as unknown as Resolver<TFieldValues>,
    mode: "onBlur",
  });
};
