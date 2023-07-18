import { useEffect } from "react";

export default function IntegerResponse(props) {
  const { min, max, step } = { ...props };
  const { onMinChange, onMaxChange, onStepChange } = { ...props };
  useEffect(() => {
    if (!(min && max && step)) {
      min === undefined ? onMinChange(0) : null;
      max === undefined ? onMaxChange(100) : null;
      step === undefined ? onStepChange(1) : null;
    }
  });
  return (
    <div className="flex flex-col w-full gap-2">
      <label className="flex gap-1 flex-col font-bold text-teal-800">
        Minimum value
        <input
          type="number"
          className="p-2 rounded-md font-normal text-black"
          value={min}
          onChange={(e) => {
            onMinChange(e.target.value);
          }}
        />
      </label>
      <label className="flex gap-1 flex-col font-bold text-teal-800">
        Maximum value
        <input
          type="number"
          className="p-2 rounded-md font-normal text-black"
          value={max}
          onChange={(e) => {
            onMaxChange(e.target.value);
          }}
        />
      </label>
      {/* <label className="flex gap-1 flex-col font-bold text-teal-800">
        Steps
        <input
          type="number"
          className="p-2 rounded-md font-normal text-black"
          min={1}
          value={step}
          onChange={(e) => {
            onStepChange(e.target.value);
          }}
        />
      </label> */}
    </div>
  );
}
