import {
  Chart as ChartJS,
  Colors,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Pie } from "react-chartjs-2";

export default function PieChart(props) {
  ChartJS.register(ArcElement, Tooltip, Legend, Title, Colors);
  const { data, options } = { ...props };
  return (
    <div className="flex h-96">
      <Pie options={options} data={data} />
    </div>
  );
}
