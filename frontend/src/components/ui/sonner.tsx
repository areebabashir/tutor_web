import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-gradient-to-br group-[.toaster]:from-blue-50 group-[.toaster]:to-purple-50 group-[.toaster]:border group-[.toaster]:border-blue-200/50 group-[.toaster]:text-gray-800 group-[.toaster]:shadow-lg group-[.toaster]:backdrop-blur-sm group-[.toaster]:rounded-xl group-[.toaster]:p-4",
          description: "group-[.toast]:text-gray-600 group-[.toast]:text-sm",
          actionButton:
            "group-[.toast]:bg-gradient-to-r group-[.toast]:from-blue-600 group-[.toast]:to-purple-600 group-[.toast]:text-white group-[.toast]:border-0 group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:py-1 group-[.toast]:text-sm group-[.toast]:font-medium group-[.toast]:hover:from-blue-700 group-[.toast]:hover:to-purple-700 group-[.toast]:transition-all group-[.toast]:duration-200",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-600 group-[.toast]:border group-[.toast]:border-gray-200 group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:py-1 group-[.toast]:text-sm group-[.toast]:font-medium group-[.toast]:hover:bg-gray-200 group-[.toast]:transition-all group-[.toast]:duration-200",
          success: "group-[.toast]:bg-gradient-to-br group-[.toast]:from-emerald-50 group-[.toast]:to-green-50 group-[.toast]:border-emerald-200/50 group-[.toast]:text-emerald-800",
          error: "group-[.toast]:bg-gradient-to-br group-[.toast]:from-red-50 group-[.toast]:to-rose-50 group-[.toast]:border-red-200/50 group-[.toast]:text-red-800",
          warning: "group-[.toast]:bg-gradient-to-br group-[.toast]:from-amber-50 group-[.toast]:to-yellow-50 group-[.toast]:border-amber-200/50 group-[.toast]:text-amber-800",
          info: "group-[.toast]:bg-gradient-to-br group-[.toast]:from-sky-50 group-[.toast]:to-blue-50 group-[.toast]:border-sky-200/50 group-[.toast]:text-sky-800",
        },
        style: {
          background: 'linear-gradient(135deg, rgba(239, 246, 255, 0.95) 0%, rgba(250, 245, 255, 0.95) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(147, 197, 253, 0.3)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
