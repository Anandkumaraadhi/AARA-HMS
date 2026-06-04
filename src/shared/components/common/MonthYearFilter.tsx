type MonthYearFilterProps = {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentYear = new Date().getFullYear();

const years = [
  currentYear - 2,
  currentYear - 1,
  currentYear,
  currentYear + 1,
];

function MonthYearFilter({
  month,
  year,
  onMonthChange,
  onYearChange,
}: MonthYearFilterProps) {

  return (

    <div className="mt-3 flex gap-2">

      {/* MONTH */}

      <select
        value={month}
        onChange={(e) =>
          onMonthChange(Number(e.target.value))
        }
        className="h-9 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
      >
        {months.map((item, index) => (
          <option
            key={item}
            value={index}
          >
            {item}
          </option>
        ))}
      </select>

      {/* YEAR */}

      <select
        value={year}
        onChange={(e) =>
          onYearChange(Number(e.target.value))
        }
        className="h-9 w-28 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
      >
        {years.map((item) => (
          <option
            key={item}
            value={item}
          >
            {item}
          </option>
        ))}
      </select>

    </div>
  );
}

export default MonthYearFilter;