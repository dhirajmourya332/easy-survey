import { useEffect, useState } from "react";
import Chart from "../components/Chart";
import axios from "axios";

export default function Analyse() {
  const [formTitle, setFormTitle] = useState(null);
  const [formData, setFormData] = useState(null);
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const formdataid = searchParams.get("formdataid");
    axios
      .get(
        `https://easy-survey-back.onrender.com/form-data?formdataid=${formdataid}`
      )
      .then((response) => {
        if (response.data["success"]) {
          setFormTitle(response.data["data"]["form_title"]);
          setFormData(response.data["data"]["data"]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="flex flex-col bg-slate-200 gap-5 p-1 sm:p-3">
      <h1 className="p-2 font-bold text-xl text-center w-full">{formTitle}</h1>
      {formData &&
        formData.map((chartData, index) => (
          <Chart key={index} chartData={chartData} />
        ))}
    </div>
  );
}
