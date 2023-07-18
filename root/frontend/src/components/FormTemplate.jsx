export default function FormTemplate(props) {
  const {
    formTemplateSchema,
    currentlyOpenedFormPage,
    setCurrentlyOpenedFormPage,
  } = { ...props };

  function renderFormTemplateCardResponse(response) {
    switch (response["type"]) {
      case "checkboxes":
        return (
          response["options"] && (
            <div className=" flex flex-col gap-3 border border-gray-800 rounded-md p-3 w-full">
              {response["options"].map((option) => (
                <label
                  key={option["id"]}
                  className="bg-gray-200 p-2 rounded-md flex flex-row items-center gap-2 break-all"
                >
                  {option["value"]}
                  <input
                    name={option["value"]}
                    className="ml-auto"
                    type="checkbox"
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
              <select className="w-full p-2 rounded-md">
                <option value={""}></option>
                {response["options"].map((option) => (
                  <option key={option["id"]} value={option["value"]}>
                    {option["value"]}
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
      //currently maikng only one propt type.....later will use loop for more than one prompt ..currently it dosen't make sense
      return (
        <div className="flex flex-col gap-5 w-full items-center">
          <div className="font-bold text-gray-700 text-lg">
            {currentCard["prompts"][0] !== undefined
              ? currentCard["prompts"][0]["prompt"]
              : null}
          </div>
          {currentCard["prompts"][0] !== undefined
            ? renderFormTemplateCardResponse(
                currentCard["prompts"][0]["response"]
              )
            : null}
        </div>
      );
    }
  }

  return (
    <div className="h-full w-full flex items-center justify-center overflow-auto bg-slate-100">
      <div className="my-auto max-w-sm flex flex-col items-center w-full p-4 pt-6 rounded-md bg-white gap-5">
        {/* <div>{JSON.stringify(formTemplateSchema)}</div> */}
        {formTemplateSchema.length > 0 &&
          renderFormTemplateCard(formTemplateSchema[currentlyOpenedFormPage])}
        <div className="w-full  p-2 px-3 flex flex-row items-center bg-gray-200 rounded-md">
          <div>{`${currentlyOpenedFormPage + 1}/${
            formTemplateSchema.length
          }`}</div>
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
            <div>
              {currentlyOpenedFormPage === formTemplateSchema.length - 1 ? (
                <div>Submit</div>
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
      </div>
    </div>
  );
}
