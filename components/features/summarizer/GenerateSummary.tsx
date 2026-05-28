import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import FileUpload from "@/components/features/summarizer/FileUpload"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field"

export default function GenerateSummary() {
    return (
        <div className="flex flex-col justify-center items-center gap-10 p-15 max-w-5xl mx-auto">
            <h1 className="font-medium text-xl">Welcome back, User! Ready to condense your presentation deck into key highlights?</h1>
            <div className="w-full space-y-3">
                <FileUpload />
                <p className="text-center text-muted-foreground text-sm">{"(Supports: .ppt, .pptx)"}</p>
            </div>
            <div className="flex flex-col w-full border border-ring bg-sidebar rounded-lg p-7 gap-5">
                <p className="text-tertiary">AI CONFIGURATIONS:</p>
                <FieldGroup className="w-full flex-row justify-center">
                    <FieldSet className="w-full">
                        <FieldLegend className="w-max">Summary Detail:</FieldLegend>
                        <FieldGroup className="gap-4 text-muted-foreground">
                            <Field orientation="horizontal">
                                <Checkbox className="bg-background rounded-full h-5 w-5 border-ring" id="short" />
                                <FieldLabel htmlFor="short">Short</FieldLabel>
                            </Field>
                            <Field orientation="horizontal">
                                <Checkbox className="bg-background rounded-full h-5 w-5 border-ring" id="medium" />
                                <FieldLabel htmlFor="medium">Medium</FieldLabel>
                            </Field>
                            <Field orientation="horizontal">
                                <Checkbox className="bg-background rounded-full h-5 w-5 border-ring" id="deep_dive" />
                                <FieldLabel htmlFor="deep_dive">Deep Dive</FieldLabel>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <FieldSet className="w-full">
                        <FieldLegend className="w-max">Export Format:</FieldLegend>
                        <FieldGroup className="gap-4 text-muted-foreground">
                            <Field className="w-max" orientation="horizontal">
                                <Checkbox className="bg-background rounded-full h-5 w-5 border-ring" id="docs" />
                                <FieldLabel htmlFor="docs">Word Document {"(.docx)"}</FieldLabel>
                            </Field>
                            <Field className="w-max" orientation="horizontal">
                                <Checkbox className="bg-background rounded-full h-5 w-5 border-ring" id="ppt" />
                                <FieldLabel htmlFor="ppt">PowerPoint Presentation {"(.pptx)"}</FieldLabel>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                </FieldGroup>
            </div>
            <Button className="text-2xl p-7 bg-tertiary hover:bg-tertiary-foreground text-white cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkle-icon lucide-sparkle">
                    <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
                </svg>
                Generate Summary
            </Button>
        </div>
    )
}