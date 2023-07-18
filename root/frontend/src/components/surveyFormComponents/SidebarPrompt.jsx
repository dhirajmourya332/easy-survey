import { useState } from "react";
import CheckBoxResponse from "./CheckBoxResponse";
import IntegerResponse from "./IntegerResponse";
import FloatResponse from "./FloatResponse";

export default function SidebarPrompt(props) {
  const newPrompt = JSON.parse(JSON.stringify(props["prompt"]));
  function renderResponse(props) {
    switch (newPrompt["response"]["type"]) {
      case "checkboxes":
      case "options":
        return (
          <>
            <CheckBoxResponse
              options={
                newPrompt["response"]["options"]
                  ? newPrompt["response"]["options"]
                  : []
              }
              onOptionsChange={(newOptions) => {
                newPrompt["response"]["options"] = newOptions;
                props["onPromptChange"](newPrompt);
              }}
            />
          </>
        );
      case "int":
        return (
          <IntegerResponse
            min={newPrompt["response"]["min"]}
            max={newPrompt["response"]["max"]}
            step={newPrompt["response"]["step"]}
            onMinChange={(newMin) => {
              newPrompt["response"]["min"] = newMin;
              props["onPromptChange"](newPrompt);
            }}
            onMaxChange={(newMax) => {
              newPrompt["response"]["max"] = newMax;
              props["onPromptChange"](newPrompt);
            }}
            onStepChange={(newStep) => {
              newPrompt["response"]["step"] = newStep;
              props["onPromptChange"](newPrompt);
            }}
          />
        );
      case "float":
        return (
          <FloatResponse
            min={newPrompt["response"]["min"]}
            max={newPrompt["response"]["max"]}
            onMinChange={(newMin) => {
              newPrompt["response"]["min"] = newMin;
              props["onPromptChange"](newPrompt);
            }}
            onMaxChange={(newMax) => {
              newPrompt["response"]["max"] = newMax;
              props["onPromptChange"](newPrompt);
            }}
          />
        );
      case "":
        return null;
    }
  }
  return (
    <div className="rounded-md  p-2 py-4 border border-teal-800 flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <label htmlFor="prompt" className="font-bold text-teal-800">
          Prompt
        </label>
        <input
          name="prompt"
          className="p-2 rounded-md"
          type="text"
          value={newPrompt["prompt"]}
          onChange={(e) => {
            newPrompt["prompt"] = e.target.value;
            props["onPromptChange"](newPrompt);
          }}
        />
      </div>
      {/* <div className="flex flex-col gap-1">
        <label htmlFor="prompt-label" className="font-bold text-teal-800">
          Prompt label
        </label>
        <input
          className="p-2 rounded-md"
          id="prompt-label"
          type="text"
          value={newPrompt["response"]["promptLable"]}
          onChange={(e) => {
            newPrompt["response"]["promptLable"] = e.target.value;
            props["onPromptChange"](newPrompt);
          }}
        />
      </div> */}
      {/* <label className="flex flex-row gap-3 p-2 font-bold text-teal-800">
        Independent variable
        <input
          className="accent-teal-800"
          type="checkbox"
          checked={newPrompt["response"]["isIndependent"]}
          onChange={(e) => {
            newPrompt["response"]["isIndependent"] = e.target.checked;
            props["onPromptChange"](newPrompt);
          }}
        />
      </label> */}
      <div className="flex flex-col gap-1 w-full">
        <label htmlFor="response-type-selector" className="sr-only">
          Select response type
        </label>
        <select
          className="p-2 border-0 border-b-2 border-teal-800 font-bold text-teal-800 bg-teal-50"
          id="response-type-selector"
          onChange={(e) => {
            newPrompt["response"]["type"] = e.target.value;
            props["onPromptChange"](newPrompt);
          }}
          defaultValue={newPrompt["response"]["type"]}
        >
          <option value="">Select response type</option>
          <option value="checkboxes">Checkbox options</option>
          <option value="options">Dropdown options</option>
          <option value="int">Number Integer</option>
        </select>
      </div>
      {renderResponse(props)}
    </div>
  );
}
