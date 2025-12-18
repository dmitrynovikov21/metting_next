"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/_my_ui/ui/Button";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    company: z.string().min(2, "Название компании обязательно"),
    name: z.string().min(2, "Имя обязательно"),
    email: z.string().email("Некорректный email"),
    phone: z.string().min(5, "Телефон обязателен"),
    task: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ContactFormProps {
    type?: "project" | "audit";
    onSubmit?: (data: FormValues) => void;
}

export function ContactForm({ type = "project", onSubmit }: ContactFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const submitHandler = async (data: FormValues) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Form submitted:", data);
        onSubmit?.(data);
    };

    return (
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/70">Компания</label>
                <input
                    {...register("company")}
                    className={cn(
                        "flex h-12 w-full rounded-md border border-white/10 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        errors.company && "border-red-500 focus-visible:ring-red-500"
                    )}
                    placeholder="ООО Вектор"
                />
                {errors.company && <p className="text-xs text-red-500">{errors.company.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/70">Имя</label>
                <input
                    {...register("name")}
                    className={cn(
                        "flex h-12 w-full rounded-md border border-white/10 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                        errors.name && "border-red-500 focus-visible:ring-red-500"
                    )}
                    placeholder="Иван Петров"
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/70">Email</label>
                    <input
                        {...register("email")}
                        className={cn(
                            "flex h-12 w-full rounded-md border border-white/10 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                            errors.email && "border-red-500 focus-visible:ring-red-500"
                        )}
                        placeholder="ivan@company.com"
                    />
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/70">Телефон</label>
                    <input
                        {...register("phone")}
                        className={cn(
                            "flex h-12 w-full rounded-md border border-white/10 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                            errors.phone && "border-red-500 focus-visible:ring-red-500"
                        )}
                        placeholder="+7 999 ..."
                    />
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                </div>
            </div>

            {type === "project" && (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/70">О задаче (необязательно)</label>
                    <textarea
                        {...register("task")}
                        className="flex min-h-[80px] w-full rounded-md border border-white/10 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Кратко о проекте..."
                    />
                </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Отправка..." : type === "project" ? "Обсудить проект" : "Получить аудит"}
            </Button>

            <p className="text-xs text-center text-foreground/40">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности.
            </p>
        </form>
    );
}
