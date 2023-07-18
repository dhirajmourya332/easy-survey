import { useEffect, useState } from "react";
import Header from "../components/Dahboard/Header";
import FormCard from "../components/Dahboard/FormCard";
import netRequest from "../helpers/netRequest";
export default function Dashboard() {
  const [formsMetadata, setFormsMetadata] = useState([]);
  async function fetchFormsMetadata() {
    return new Promise((resolve, reject) => {
      netRequest({ url: "/all-survey-forms-metadata" })
        .then((response) => {
          if (response.data["success"]) {
            resolve(response.data["data"]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }
  useEffect(() => {
    (async function () {
      fetchFormsMetadata()
        .then((data) => {
          setFormsMetadata(data);
        })
        .catch((error) => {
          console.log(error);
        });
    })();
  }, []);
  return (
    <div className="flex flex-col w-full p-3 gap-6">
      <Header />
      <div className="flex flex-col w-full gap-5 p-3 py-5 bg-slate-50 rounded-md">
        {formsMetadata.map((formMetadata) => (
          <FormCard key={formMetadata["form_schema_id"]} {...formMetadata} />
        ))}
        {formsMetadata.length === 0 && (
          <div className="flex justify-center w-full p-10">
            <p className="font-bold text-lg text-slate-800">
              Nothing to show here, as no forms are created.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
