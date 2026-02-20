"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createExam } from "@/actions/exam.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    subject: z.string().min(2, "Subject name is strictly required").max(100),
    examDate: z.date(),
    syllabus: z.string().min(10, "Please provide syllabus text for AI parsing."),
});

export function ExamForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            subject: "",
            syllabus: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        startTransition(async () => {
            try {
                const formData = new FormData();
                formData.append("subject", values.subject);
                formData.append("examDate", values.examDate.toISOString());

                const exam = await createExam(formData);

                if (values.syllabus.trim().length > 10) {
                    toast.loading("AI is parsing syllabus...", { id: "ai-parse" });
                    const res = await fetch("/api/ai/parse-syllabus", {
                        method: "POST",
                        body: JSON.stringify({ examId: exam.id, syllabusText: values.syllabus })
                    });

                    if (res.ok) {
                        toast.success("Topics and timetable generated!", { id: "ai-parse" });
                    } else {
                        toast.error("Failed to parse syllabus", { id: "ai-parse" });
                    }
                } else {
                    toast.success("Exam created successfully.");
                }

                router.push("/exams");
            } catch (error) {
                toast.error("Failed to create exam");
                console.error(error);
            }
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subject Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Data Structures & Algorithms" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="examDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Exam Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                        >
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="syllabus"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Syllabus Content</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Paste the raw syllabus text here. The AI will parse topics and generate a timetable."
                                    className="min-h-[150px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                We use this text to extract topics and set up a study schedule.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isPending} className="w-full bg-brand-500 hover:bg-brand-600 text-white">
                    {isPending ? "Generating Plan..." : "Create Exam & Parse Syllabus"}
                </Button>
            </form>
        </Form>
    );
}
