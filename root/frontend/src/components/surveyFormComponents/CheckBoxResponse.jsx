import { v4 as uuidv4 } from "uuid";
export default function CheckBoxResponse(props) {
  let options = JSON.parse(JSON.stringify(props["options"]));
  return (
    <>
      {options.map((option, index) => (
        <div
          key={option["id"]}
          className="flex flex-row gap-2 w-full items-center"
        >
          <div className="font-bold text-teal-800">{index + 1}</div>
          <label htmlFor={`option_${index}`} className="sr-only">
            {`Response type checkbox option number ${index + 1}`}{" "}
          </label>
          <input
            id={`option_${index}`}
            type="text"
            className="w-full  p-2 rounded-md"
            value={option["value"]}
            onChange={(e) => {
              let newOption = { id: option["id"], value: e.target.value };
              options = options.map((option) =>
                option["id"] === newOption["id"] ? newOption : option
              );
              props["onOptionsChange"](options);
            }}
          />
          <button
            type="button"
            className="h-full w-8 p-1 border border-red-500 rounded-md group hover:bg-red-500 bg-white"
            onClick={() => {
              const deleteId = option["id"];

              options = options.filter((option) => {
                {
                  return option["id"] !== deleteId;
                }
              });
              props["onOptionsChange"](options);
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 -0.5 21 21"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <g
                id="Page-1"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
              >
                <g
                  id="Dribbble-Light-Preview"
                  transform="translate(-179.000000, -360.000000)"
                  className="fill-red-500 group-hover:fill-white "
                >
                  <g id="icons" transform="translate(56.000000, 160.000000)">
                    <path
                      d="M130.35,216 L132.45,216 L132.45,208 L130.35,208 L130.35,216 Z M134.55,216 L136.65,216 L136.65,208 L134.55,208 L134.55,216 Z M128.25,218 L138.75,218 L138.75,206 L128.25,206 L128.25,218 Z M130.35,204 L136.65,204 L136.65,202 L130.35,202 L130.35,204 Z M138.75,204 L138.75,200 L128.25,200 L128.25,204 L123,204 L123,206 L126.15,206 L126.15,220 L140.85,220 L140.85,206 L144,206 L144,204 L138.75,204 Z"
                      id="delete-[#1487]"
                    ></path>
                  </g>
                </g>
              </g>
            </svg>
          </button>
        </div>
      ))}
      <button
        className="p-1 bg-white hover:bg-teal-600 border-teal-700 text-teal-800 hover:text-white rounded-md border w-full"
        onClick={() => {
          options.push({ id: uuidv4(), value: "" }); //have to set id using uuid
          props["onOptionsChange"](options);
        }}
        type="button"
      >
        Add new option
      </button>
    </>
  );
}
