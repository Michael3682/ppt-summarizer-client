export default function  Footer() {
    return (
        <footer className="w-full h-fit border-t bg-background p-2 sm:p-4 text-center text-xs sm:text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} PPT Summarizer. All rights reserved.
        </footer>
    )
}