import { useState } from "react";
import { citiesJson, pointInPolygon, polygonsJson } from "../../../packages/magen-common/src/lib";
import { useAlerts } from "../hooks/useAlerts";

const citiesArray = Object.values(citiesJson);

export default function CityFilter() {
  const [searchValue, setSearchValue] = useState("");
  const [focused, setFocused] = useState(false);
  const { filters, setFilters } = useAlerts();

  const onFocus = () => setFocused(true);
  const onBlur = () => {
    setTimeout(() => {
      setFocused(false);
    }, 300);
  };
  const found = citiesArray.filter(
    (c) =>
      searchValue !== "" && c.he.startsWith(searchValue) && !filters.includes(c)
  );

  function findLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      for (const city of citiesArray) {
        const polygon = polygonsJson?.[city.id];
        const [lat, lng] = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        if (
          pointInPolygon(polygon, [lat, lng]) &&
          !filters.some((f) => f.id === city.id)
        ) {
          setFilters([...filters, city]);
        }
      }
    });
  }

  return (
    <div className="pt-3 w-full items-center justify-center flex flex-col">
      <div className="flex flex-row items-center gap-1 justify-center w-full">
        <button
          onClick={() => setFilters([])}
          type="button"
          className="focus:outline-none text-white bg-slate-600 hover:bg-slate-800 font-medium rounded-lg text-xs px-3 h-[35px]"
        >
          נקה
        </button>

        <div className="relative flex-1">
          {focused && found.length > 0 && (
            <div className="absolute w-full max-h-[100px] bg-gray-700 bottom-0 translate-y-[105%] rounded-lg overflow-y-auto scrollbar flex flex-col z-[1]">
              {found.map((city) => (
                <div
                  key={city.lat + city.lng}
                  className="py-2 cursor-pointer w-full hover:bg-slate-500 px-2 rounded-lg"
                  onClick={() => {
                    setFilters([...filters, city]);
                    setSearchValue("");
                  }}
                >
                  {city.he}
                </div>
              ))}
            </div>
          )}

          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
          <input
            value={searchValue}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
            id="input-group-1"
            className="h-[35px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="שם יישוב..."
          />
        </div>
        <div className="bg-slate-600 p-1 rounded-lg cursor-pointer hidden sm:flex">
          <svg
            onClick={findLocation}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            className="w-[1.5rem] h-[1.7rem] stroke-slate-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
        </div>
      </div>
      {filters.length === 0 && (
        <div className="text-xs opacity-50 pt-1">יוצגו התרעות בכל הארץ</div>
      )}
      <div className="h-[100px w-full mt-2 overflow-y-auto scrollbar flex flex-row flex-wrap p-2 gap-1.5">
        {filters.map((city) => (
          <div
            key={city.he}
            className="dark:bg-gray-700 p-2.5  text-sm rounded-lg flex flex-row items-center gap-1"
            onClick={() => setFilters(filters.filter((c) => c !== city))}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>

            {city.he}
          </div>
        ))}
      </div>
    </div>
  );
}
