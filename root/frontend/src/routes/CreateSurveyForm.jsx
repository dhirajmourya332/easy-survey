import { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../components/surveyFormComponents/SideBar";
import FormTemplate from "../components/FormTemplate";

export default function CreateSurveyForm() {
  const [surveyFormSchema, setSurveyFormSchema] = useState([]);
  const [formTitle, setFormTitle] = useState(`Form ${new Date()}`);

  const [currentlyOpenedFormPage, setCurrentlyOpenedFormPage] = useState(-1);

  async function handleTheSurveyFormSubmission() {
    function postFormSchema(formSchema) {
      return new Promise((resolve, reject) => {
        axios
          .post(
            "https://easy-survey-back.onrender.com/create-survey-form",
            formSchema
          )
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    }
    function validateAndFilterSchema(schema) {
      const newSchema = schema.map((cardSchema) => {
        const { type } = { ...cardSchema };
        if (type === "description") {
          // eslint-disable-next-line no-case-declarations
          const { description } = { ...cardSchema };
          return { type, description };
        } else if (type === "prompt") {
          const title = cardSchema["prompts"][0]["prompt"];
          const response = cardSchema["prompts"][0]["response"];
          console.log(response);
          if (
            response["type"] === "checkboxes" ||
            response["type"] === "options"
          ) {
            const options = response["options"].map(
              (option) => option["value"]
            );
            return {
              type,
              title,
              response: { type: response["type"], options },
            };
          } else if (response["type"] === "int") {
            const { max, min } = { ...response };
            return {
              type,
              title,
              response: { type: response["type"], max, min },
            };
          }
        }
      });
      return { title: formTitle, schema: newSchema };
    }
    try {
      await postFormSchema(validateAndFilterSchema(surveyFormSchema))
        .then((response) => {
          if (response.data["success"]) {
            window.location.href = "/dashboard";
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="flex flex-row h-screen bg-white">
      <div className="flex w-80 shrink-0 h-full p-3">
        {
          <SideBar
            sideBarSchema={surveyFormSchema}
            onSideBarSchemaChange={(newSideBarSchema) => {
              setSurveyFormSchema(newSideBarSchema);
            }}
            currentlyOpenedFormPage={currentlyOpenedFormPage}
            setCurrentlyOpenedFormPage={(newOpenedFormPage) => {
              setCurrentlyOpenedFormPage(newOpenedFormPage);
            }}
            onSave={handleTheSurveyFormSubmission}
            formTitle={formTitle}
            onFormTitleChange={(newFormTitle) => {
              setFormTitle(newFormTitle);
            }}
          />
        }
      </div>
      <div className="relative w-full max-h-full ">
        <FormTemplate
          formTemplateSchema={surveyFormSchema}
          currentlyOpenedFormPage={currentlyOpenedFormPage}
          setCurrentlyOpenedFormPage={(newOpenedFormPage) => {
            setCurrentlyOpenedFormPage(newOpenedFormPage);
          }}
        />
      </div>
    </div>
  );
}
