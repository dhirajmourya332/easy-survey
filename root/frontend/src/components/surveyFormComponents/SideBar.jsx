import SidebarPrompt from "./SidebarPrompt";
import { v4 as uuidv4 } from "uuid";

export default function SideBar(props) {
  const newSideBarSchema = JSON.parse(JSON.stringify(props["sideBarSchema"]));
  // const currentlyOpenedFormPage = props["currentlyOpenedFormPage"];
  // const setCurrentlyOpenedFormPage = props["setCurrentlyOpenedFormPage"];
  const {
    currentlyOpenedFormPage,
    setCurrentlyOpenedFormPage,
    onSideBarSchemaChange,
  } = { ...props };
  return (
    <div className="bg-slate-50 rounded-lg p-2 flex flex-col gap-3 items-center w-full h-full overflow-hidden">
      <div className="bg-teal-50 py-3 px-2 rounded-lg flex flex-col gap-3 items-center w-full">
        <button
          className="p-1 bg-white hover:bg-teal-600 border-teal-700 text-teal-800 hover:text-white rounded-md border w-full"
          onClick={() => {
            props["onSave"]();
          }}
          type="button"
        >
          Save the survey form
        </button>
      </div>
      <div className="bg-teal-50 py-3 px-2 rounded-lg flex flex-col gap-3 items-center w-full">
        <label className="font-bold text-teal-800 mr-auto">Form title</label>
        <input
          className="p-3 rounded-md w-full"
          value={props["formTitle"]}
          onChange={(e) => {
            props["onFormTitleChange"](e.target.value);
          }}
        />
      </div>

      <div className="bg-teal-50 py-3 px-2 rounded-lg flex flex-col gap-3 items-center w-full">
        <button
          className="p-1 bg-white hover:bg-teal-600 border-teal-700 text-teal-800 hover:text-white rounded-md border w-full"
          onClick={() => {
            newSideBarSchema.splice(currentlyOpenedFormPage + 1, 0, {
              type: "description",
              description: "",
            });
            onSideBarSchemaChange(newSideBarSchema);

            setCurrentlyOpenedFormPage(currentlyOpenedFormPage + 1);
          }}
          type="button"
        >
          Add new description card
        </button>
        <button
          className="p-1 bg-white hover:bg-teal-600 border-teal-700 text-teal-800 hover:text-white rounded-md border w-full"
          onClick={() => {
            newSideBarSchema.splice(currentlyOpenedFormPage + 1, 0, {
              type: "prompt",
              prompts: [],
            });
            onSideBarSchemaChange(newSideBarSchema);

            setCurrentlyOpenedFormPage(currentlyOpenedFormPage + 1);
          }}
          type="button"
        >
          Add new survey card
        </button>
      </div>
      {newSideBarSchema.length ? (
        <>
          <div className="relative flex flex-col items-center p-2 gap-3 bg-teal-50 w-full h-full overflow-auto">
            {newSideBarSchema[currentlyOpenedFormPage]["type"] === "prompt" ? (
              // <div
              //   className="flex flex-col gap-3 w-full h-full p-2"
              //   style={{ flex: "0 0 100%" }}
              // >
              <>
                {newSideBarSchema[currentlyOpenedFormPage]["prompts"].length <
                1 ? (
                  <button
                    className="p-1 bg-white hover:bg-teal-600 border-teal-700 text-teal-800 hover:text-white rounded-md border w-full"
                    type="button"
                    onClick={() => {
                      newSideBarSchema[currentlyOpenedFormPage]["prompts"].push(
                        {
                          id: uuidv4(),
                          prompt: "",
                          response: {
                            promptLable: "",
                            type: "",

                            isIndependent: false,
                          },
                        }
                      );
                      onSideBarSchemaChange(newSideBarSchema);
                    }}
                  >
                    Add new prompt
                  </button>
                ) : null}
                {newSideBarSchema[currentlyOpenedFormPage]["prompts"].length ? (
                  <div className="flex flex-col gap-3 w-full">
                    {newSideBarSchema[currentlyOpenedFormPage]["prompts"].map(
                      (prompt) => (
                        <SidebarPrompt
                          key={prompt["id"]}
                          prompt={prompt}
                          onPromptChange={(newPrompt) => {
                            newSideBarSchema[currentlyOpenedFormPage][
                              "prompts"
                            ] = newSideBarSchema[currentlyOpenedFormPage][
                              "prompts"
                            ].map((prompt) =>
                              prompt["id"] === newPrompt["id"]
                                ? newPrompt
                                : prompt
                            );
                            onSideBarSchemaChange(newSideBarSchema);
                          }}
                        />
                      )
                    )}
                  </div>
                ) : null}
                {/* </div> */}
              </>
            ) : (
              <div className="flex flex-col gap-1 w-full h-full">
                <label
                  className="font-bold text-teal-800"
                  htmlFor="prompt_description"
                >
                  Prompt description
                </label>
                <textarea
                  name="prompt_description"
                  className="w-full h-full p-2 rounded-md"
                  value={
                    newSideBarSchema[currentlyOpenedFormPage]["description"]
                  }
                  onChange={(e) => {
                    newSideBarSchema[currentlyOpenedFormPage]["description"] =
                      e.target.value;
                    onSideBarSchemaChange(newSideBarSchema);
                  }}
                ></textarea>
              </div>
            )}
          </div>
          <div className="bg-red-50 py-3 px-2 rounded-lg flex flex-col gap-3 items-center w-full">
            <button
              type="button"
              className="p-1 bg-white hover:bg-red-600 border-red-700 text-red-800 hover:text-white rounded-md border w-full"
              onClick={() => {
                newSideBarSchema.splice(currentlyOpenedFormPage, 1);
                onSideBarSchemaChange(newSideBarSchema);
                if (
                  currentlyOpenedFormPage === 0 &&
                  newSideBarSchema.length > 0
                ) {
                  console.log("*************************************");
                  setCurrentlyOpenedFormPage(currentlyOpenedFormPage);
                } else {
                  setCurrentlyOpenedFormPage(currentlyOpenedFormPage - 1);
                }
              }}
            >
              Remove this card
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
