import { useEffect } from "react";

export default function FloatResponse(props) {
  const { min, max } = { ...props };
  const { onMinChange, onMaxChange } = { ...props };
  useEffect(() => {
    if (!(min && max)) {
      min === undefined ? onMinChange(0) : null;
      max === undefined ? onMaxChange(100) : null;
    }
  });
  return (
    <div className="flex flex-col gap-2 w-full">
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
    </div>
  );
}
