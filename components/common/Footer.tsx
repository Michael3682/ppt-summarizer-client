export default function  Footer() {
    return (
        <footer className="w-full h-fit border-t bg-background p-4 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} PPT Summarizer. All rights reserved.
        </footer>
    )
}