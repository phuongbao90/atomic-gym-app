import { View } from "react-native"
import { cn } from "../../utils/cn"

export const ItemContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <View
      className={cn(
        "px-6 py-10 rounded-xl dark:bg-white/5 bg-slate-500/10",
        className
      )}
    >
      {children}
    </View>
  )
}
