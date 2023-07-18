import axios from "axios";
import { useEffect, useState } from "react";

export default function Form() {
  const [formSchema, setFormSchema] = useState([]);
  // const [formId, setFormId] = useState(null);
  const searchParams = new URLSearchParams(window.location.search);
  const formId = searchParams.get("formid");
  const [currentlyOpenedFormPage, setCurrentlyOpenedFormPage] = useState(0);
  const [responseSchema, setResponseSchema] = useState({});
  const [formError, setFormError] = useState(null);

  const [currentFormSubmitted, setCurrentFormSubmitted] = useState(
    localStorage.getItem("form-submitted")
      ? JSON.parse(localStorage.getItem("form-submitted")).includes(formId)
      : false
  );
  useEffect(() => {
    if (!currentFormSubmitted && formId) {
      // setFormId(formid);
      axios
        .get(`/form-schema?formid=${formId}`)
        .then((response) => {
          if (response.data["success"]) {
            const newFormSchema = [...response.data["data"]["schema"]];
            newFormSchema.forEach((formCard, index) => {
              if (formCard["type"] === "prompt") {
                setResponseSchema((prevResponseSchema) => {
                  const newResonseSchema = { ...prevResponseSchema };
                  newResonseSchema[formCard["title"]] = {
                    value: null,
                    cardNumber: index + 1,
                  };
                  return newResonseSchema;
                });
              }
            });
            setFormSchema(response.data["data"]["schema"]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);
  function renderFormTemplateCardResponse(
    response,
    setNewResponse,
    currentResponse
  ) {
    function handleCheckBoxClick(e, option) {
      if (option === currentResponse) {
        setNewResponse(null);
      } else setNewResponse(option);
    }
    function handleDropdownClick(e) {
      if (e.target.value !== "_____null") {
        setNewResponse(e.target.value);
      } else {
        setNewResponse(null);
      }
    }
    function handleIntChange(e) {
      setNewResponse(String(e.target.value));
    }
    switch (response["type"]) {
      case "checkboxes":
        return (
          response["options"] && (
            <div className=" flex flex-col gap-3 border border-gray-800 rounded-md p-3 w-full">
              {response["options"].map((option, index) => (
                <label
                  key={index}
                  className="bg-gray-200 p-2 rounded-md flex flex-row items-center gap-2 break-all"
                >
                  {option}
                  <input
                    name={option}
                    className="ml-auto"
                    type="checkbox"
                    checked={currentResponse === option ? true : false}
                    onChange={(e) => {
                      handleCheckBoxClick(e, option);
                    }}
                  />
                </label>
              ))}
            </div>
          )
        );

      case "options":
        return (
          response["options"] && (
            <div className="w-full px-3">
              <select
                className="w-full p-2 rounded-md"
                onChange={handleDropdownClick}
              >
                <option value={"_____null"}></option>
                {response["options"].map((option) => (
                  <option key={option["id"]} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )
        );
      case "int":
      case "float":
        return (
          response["options"] && (
            <div className="w-full px-3">
              <input
                onChange={handleIntChange}
                className="w-full p-3"
                min={Number(response["min"])}
                max={Number(response["max"])}
                step={
                  response["type"] === "int" ? Number(response["step"]) : 0.01
                }
                type="number"
              />
            </div>
          )
        );
      default:
        break;
    }
  }

  function renderFormTemplateCard(currentCard) {
    if (currentCard["type"] === "description") {
      return (
        <div className="font-bold text-gray-700">
          {currentCard["description"]}
        </div>
      );
    } else if (currentCard["type"] === "prompt") {
      return (
        <div className="flex flex-col gap-5 w-full items-center">
          <div className="font-bold text-gray-700 text-lg">
            {currentCard["title"]}
          </div>
          {renderFormTemplateCardResponse(
            currentCard["response"],
            (newResponse) => {
              setResponseSchema((prevResponseSchema) => {
                const newResponseSchema = { ...prevResponseSchema };
                newResponseSchema[currentCard["title"]]["value"] = newResponse;
                return newResponseSchema;
              });
            },
            responseSchema[currentCard["title"]]["value"]
          )}
        </div>
      );
    }
  }
  function handleFormSubmit() {
    for (const prompt in responseSchema) {
      if (Object.hasOwnProperty.call(responseSchema, prompt)) {
        const responseValue = responseSchema[prompt];
        if (responseValue["value"] === null) {
          setFormError(
            `Please fill the form at card number: ${responseValue["cardNumber"]}`
          );
          return;
        }
      }
    }
    const newResponseSchema = {};
    for (const prompt in responseSchema) {
      if (Object.hasOwnProperty.call(responseSchema, prompt)) {
        const cardResponse = responseSchema[prompt];
        newResponseSchema[prompt] = cardResponse["value"];
      }
    }
    axios
      .post(`/submit-user-form?formid=${formId}`, newResponseSchema)
      .then((response) => {
        if (response.data["success"]) {
          const submittedForm = localStorage.getItem("form-submitted")
            ? JSON.parse(localStorage.getItem("form-submitted"))
            : [];
          submittedForm.push(formId);
          localStorage.setItem("form-submitted", JSON.stringify(submittedForm));
          setCurrentFormSubmitted(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <div className="h-full w-full flex items-center justify-center min-h-screen overflow-auto">
      {!currentFormSubmitted ? (
        <div className="my-auto max-w-sm flex flex-col items-center w-full p-4 pt-6 rounded-md bg-slate-50 gap-5">
          {/* <div>{JSON.stringify(formSchema)}</div> */}
          {formSchema.length > 0 &&
            renderFormTemplateCard(formSchema[currentlyOpenedFormPage])}
          <div className="w-full  p-2 px-3 flex flex-row items-center bg-gray-200 rounded-md">
            <div>{`${currentlyOpenedFormPage + 1}/${formSchema.length}`}</div>
            <div className="ml-auto flex flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  setCurrentlyOpenedFormPage(currentlyOpenedFormPage - 1);
                }}
                disabled={currentlyOpenedFormPage === 0 ? true : false}
              >
                Prev
              </button>
              <div className="flex flex-row gap-2">
                {currentlyOpenedFormPage === formSchema.length - 1 ? (
                  <button
                    type="button"
                    className="p-1 px-2 rounded border border-teal-500 text-teal-800 hover:bg-teal-500 hover:text-white"
                    onClick={handleFormSubmit}
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentlyOpenedFormPage(currentlyOpenedFormPage + 1);
                    }}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
          {formError && (
            <span className="p-1 px-3 w-full rounded-md bg-red-50 text-red-800">
              {formError}
            </span>
          )}
        </div>
      ) : (
        <div className="w-full max-w-sm p-3 bg-slate-100 rounded-lg">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              className="fill-teal-200"
              fillOpacity="0.24"
            />
            <path
              d="M9 10L12.2581 12.4436C12.6766 12.7574 13.2662 12.6957 13.6107 12.3021L20 5"
              className="stroke-teal-500"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M21 12C21 13.8805 20.411 15.7137 19.3156 17.2423C18.2203 18.7709 16.6736 19.9179 14.893 20.5224C13.1123 21.1268 11.187 21.1583 9.38744 20.6125C7.58792 20.0666 6.00459 18.9707 4.85982 17.4789C3.71505 15.987 3.06635 14.174 3.00482 12.2945C2.94329 10.415 3.47203 8.56344 4.51677 6.99987C5.56152 5.4363 7.06979 4.23925 8.82975 3.57685C10.5897 2.91444 12.513 2.81996 14.3294 3.30667"
              className="stroke-teal-500"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
