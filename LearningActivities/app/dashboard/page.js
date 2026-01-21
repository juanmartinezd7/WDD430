// app/dashboard/page.js
import RevenueChart from "../ui/dashboard/revenue-chart";
//import { lusitana } from "../ui/fonts";
import { revenue } from "../lib/placeholder-data";

export default async function Page() {
  return (
    <main>
      <h1 className="mb-4 text-xl md:text-2xl">Dashboard</h1>

      
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChart revenue={revenue} />
      </div>
    </main>
  );
}
