import {
  Chart as ChartJS,
  Colors,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

export default function DonughnutChart(props) {
  ChartJS.register(ArcElement, Tooltip, Legend, Title, Colors);
  const { data, options } = { ...props };
  return (
    <div className="flex h-96">
      <Doughnut options={options} data={data} />
    </div>
  );
}
