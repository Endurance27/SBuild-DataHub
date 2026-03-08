import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Table, Eye, BarChart3, FileText, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const populationData = [
  { region: "Greater Accra", population: 5455692 },
  { region: "Ashanti", population: 5792187 },
  { region: "Northern", population: 2834567 },
  { region: "Eastern", population: 2987456 },
  { region: "Western", population: 2567234 },
  { region: "Central", population: 2359901 },
  { region: "Volta", population: 1907943 },
];

const typeDistribution = [
  { name: "Integer", value: 10, color: "hsl(153, 100%, 21%)" },
  { name: "Float", value: 6, color: "hsl(45, 97%, 54%)" },
  { name: "String", value: 5, color: "hsl(349, 86%, 50%)" },
  { name: "Date", value: 3, color: "hsl(200, 70%, 50%)" },
];

const schemaColumns = [
  { name: "region", type: "string", nullable: false, unique: true, description: "Region name" },
  { name: "population", type: "int64", nullable: false, unique: true, description: "Total population" },
  { name: "households", type: "int64", nullable: false, unique: true, description: "Number of households" },
  { name: "avg_age", type: "float64", nullable: false, unique: false, description: "Average age" },
  { name: "urban_pct", type: "float64", nullable: true, unique: false, description: "Urban population %" },
  { name: "male_pct", type: "float64", nullable: false, unique: false, description: "Male population %" },
  { name: "literacy_rate", type: "float64", nullable: true, unique: false, description: "Literacy rate" },
  { name: "employment_rate", type: "float64", nullable: true, unique: false, description: "Employment rate" },
];

const statsData = [
  { column: "population", min: "1,907,943", max: "5,792,187", mean: "3,414,997", std: "1,389,234", missing: "0%" },
  { column: "households", min: "456,234", max: "1,345,672", mean: "812,456", std: "312,567", missing: "0%" },
  { column: "avg_age", min: "24.2", max: "31.5", mean: "28.1", std: "2.1", missing: "0%" },
  { column: "urban_pct", min: "22.4", max: "87.3", mean: "51.8", std: "19.7", missing: "6.3%" },
  { column: "literacy_rate", min: "43.2", max: "89.7", mean: "71.4", std: "14.2", missing: "12.5%" },
];

const InteractiveDataPreview = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          <CardTitle>Interactive Data Explorer</CardTitle>
        </div>
        <CardDescription>Visualize, explore schema, and understand the data at a glance</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="visualize" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="visualize" className="gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" />
              Visualize
            </TabsTrigger>
            <TabsTrigger value="schema" className="gap-1.5">
              <Table className="h-3.5 w-3.5" />
              Schema
            </TabsTrigger>
            <TabsTrigger value="statistics" className="gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visualize" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h4 className="text-sm font-semibold mb-3 text-foreground">Population by Region</h4>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={populationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(153, 15%, 88%)" />
                    <XAxis dataKey="region" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                    <RechartsTooltip
                      formatter={(value: number) => [value.toLocaleString(), "Population"]}
                    />
                    <Bar dataKey="population" fill="hsl(153, 100%, 21%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-3 text-foreground">Column Types</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={typeDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                      {typeDistribution.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {typeDistribution.map((t) => (
                    <div key={t.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                      {t.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schema" className="mt-4">
            <div className="overflow-x-auto border border-border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-medium text-foreground">Column</th>
                    <th className="text-left p-3 font-medium text-foreground">Type</th>
                    <th className="text-left p-3 font-medium text-foreground">Nullable</th>
                    <th className="text-left p-3 font-medium text-foreground">Unique</th>
                    <th className="text-left p-3 font-medium text-foreground">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {schemaColumns.map((col, idx) => (
                    <tr key={col.name} className={idx % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                      <td className="p-3 font-mono text-xs text-foreground">{col.name}</td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {col.type}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <span className={col.nullable ? "text-destructive" : "text-primary"}>
                          {col.nullable ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="p-3">{col.unique ? "✓" : "—"}</td>
                      <td className="p-3 text-muted-foreground">{col.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="statistics" className="mt-4">
            <div className="overflow-x-auto border border-border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-medium text-foreground">Column</th>
                    <th className="text-right p-3 font-medium text-foreground">Min</th>
                    <th className="text-right p-3 font-medium text-foreground">Max</th>
                    <th className="text-right p-3 font-medium text-foreground">Mean</th>
                    <th className="text-right p-3 font-medium text-foreground">Std Dev</th>
                    <th className="text-right p-3 font-medium text-foreground">
                      <Tooltip>
                        <TooltipTrigger className="flex items-center gap-1">
                          Missing <Info className="h-3 w-3" />
                        </TooltipTrigger>
                        <TooltipContent>Percentage of null/missing values</TooltipContent>
                      </Tooltip>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {statsData.map((row, idx) => (
                    <tr key={row.column} className={idx % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                      <td className="p-3 font-mono text-xs text-foreground">{row.column}</td>
                      <td className="p-3 text-right text-muted-foreground">{row.min}</td>
                      <td className="p-3 text-right text-muted-foreground">{row.max}</td>
                      <td className="p-3 text-right font-medium text-foreground">{row.mean}</td>
                      <td className="p-3 text-right text-muted-foreground">{row.std}</td>
                      <td className="p-3 text-right">
                        <span className={row.missing === "0%" ? "text-primary" : "text-destructive"}>
                          {row.missing}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InteractiveDataPreview;
