import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { ArrowRightIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  className?: string
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string
  className: string
  background: ReactNode
  Icon: React.ElementType
  description: string
  href: string
  cta: string
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-800/80 bg-[#11161D]/30 backdrop-blur-md hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.15)] transition-all duration-300",
      className
    )}
    {...props}
  >
    {background}
    <div className="p-6 relative z-10">
      <div className="pointer-events-none flex transform-gpu flex-col gap-1 transition-all duration-300 lg:group-hover:-translate-y-8">
        <Icon className="h-10 w-10 origin-left transform-gpu text-indigo-400 transition-all duration-300 ease-in-out group-hover:scale-75" />
        <h3 className="text-xl font-bold text-white tracking-tight mt-2">
          {name}
        </h3>
        <p className="max-w-lg text-sm text-gray-400 leading-relaxed mt-1">{description}</p>
      </div>

      <div
        className={cn(
          "pointer-events-none flex w-full translate-y-0 transform-gpu flex-row items-center mt-4 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:hidden"
        )}
      >
        <Button
          variant="link"
          asChild
          size="sm"
          className="pointer-events-auto p-0 text-indigo-400 hover:text-indigo-300 font-semibold"
        >
          <a href={href}>
            {cta}
            <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
          </a>
        </Button>
      </div>
    </div>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 hidden w-full translate-y-10 transform-gpu flex-row items-center px-6 pb-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:flex"
      )}
    >
      <Button
        variant="link"
        asChild
        size="sm"
        className="pointer-events-auto p-0 text-indigo-400 hover:text-indigo-300 font-semibold"
      >
        <a href={href}>
          {cta}
          <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
        </a>
      </Button>
    </div>

    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-indigo-500/[0.02]" />
  </div>
)

export { BentoCard, BentoGrid }
