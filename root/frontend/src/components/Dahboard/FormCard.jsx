import { Link } from "react-router-dom";

export default function FormCard({ form_title, form_data_id, form_schema_id }) {
  return (
    <div className="flex flex-row items-center p-3  rounded-md hover:bg-teal-50">
      <h3 className="font-bold test-lg">{form_title}</h3>
      <div className="ml-auto flex flex-row gap-3">
        <button
          type="button"
          className="p-1 px-3 rounded border border-teal-500 text-teal-800 hover:text-white hover:bg-teal-500"
          onClick={() => {
            navigator.clipboard.writeText(
              `https://${window.location.hostname}/form?formid=${form_schema_id}`
            );
          }}
        >
          Copy form link
        </button>
        <Link
          className="p-2 rounded border border-teal-500 text-teal-800 hover:text-white hover:bg-teal-500 w-9 group"
          to={`/analyse-form?formdataid=${form_data_id}`}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 5V19C4 19.5523 4.44772 20 5 20H19"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-teal-800 group-hover:stroke-white"
            />
            <path
              d="M18 9L13 13.9999L10.5 11.4998L7 14.9998"
              className="stroke-teal-800 group-hover:stroke-white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <button className="p-2  rounded border border-red-500 text-red-500 hover:text-white hover:bg-red-500 w-8 group">
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
    </div>
  );
}
