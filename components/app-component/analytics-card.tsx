import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const AnalyticCard = ({
  title,
  icon,
  children,
  bgColor,
  className,
  style,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  bgColor?: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const cardStyle = {
    ...style,
  };

  return (
    <Card
      className={cn("p-4 h-32 justify-between relative overflow-hidden", className)}
      style={cardStyle}
    >
      <CardHeader className="px-0">
        <CardTitle className="font-normal text-sm text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">{children}</CardContent>
      {icon && (
        <span className="absolute bottom-0 right-4 text-8xl text-gray-500/20">
          {icon}
        </span>
      )}
      {bgColor && (
        <div
          className="absolute bottom-0 left-0 h-full w-full"
          style={{
            backgroundImage: `linear-gradient(to right, transparent 10%, ${bgColor}66 100%)`,
          }}
        />
      )}
    </Card>
  );
};

export default AnalyticCard;
