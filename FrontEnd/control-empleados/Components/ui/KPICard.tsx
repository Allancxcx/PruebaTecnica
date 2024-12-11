import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

interface KPICardProps {
  title: string;
  value: string | number;
}

export function KPICard({ title, value }: KPICardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

