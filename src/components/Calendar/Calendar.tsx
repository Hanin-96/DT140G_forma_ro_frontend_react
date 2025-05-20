import dayjs from "dayjs";
import locale from "dayjs/locale/sv";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import weekdayPlugin from "dayjs/plugin/weekday";
import "./CalendarStyle.css";
import isTodayPlugin from "dayjs/plugin/isToday";
import isBetweenPlugin from "dayjs/plugin/isBetween";
dayjs.extend(weekdayPlugin);
dayjs.extend(isTodayPlugin);
dayjs.extend(isBetweenPlugin);
dayjs.locale("sv");
dayjs.locale("sv");

function Calendar() {
  const [fetchError, setFetchError] = useState("");
  const [eventData, setEventData] = useState<any>();
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [arrayOfDays, setArrayOfDays] = useState<any[]>([]);


  //Hämta events från Wordpress API

  const getAllEvents = async () => {
    try {
      const response = await fetch("http://localhost:8002/wp-json/wp/v2/event?_fields=title,event_start_date,event_end_date,event_description,event_location", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        if (data.length > 0) {
          setEventData(data);
        }
      }
    } catch (error) {
      setFetchError("finns inga event att hämta");
    }
  };

  const hasEventForDate = (date: dayjs.Dayjs) => {
    return eventData?.some((event: any) => {
      const start = dayjs(event.event_start_date);
      const end = dayjs(event.event_end_date);
      return date.isBetween(start, end, "day", "[]"); // [] = inclusive
    });
  };




  dayjs.locale(locale);
  const now = dayjs().locale({
    ...locale,
  });
  const dateFormat = "MMM YYYY";

  //Nästa månad
  const nextMonth = () => {
    const plusMonth = currentMonth.add(1, "month");
    setCurrentMonth(plusMonth);
  }

  //Föregående månad
  const prevMonth = () => {
    const minusMonth = currentMonth.subtract(1, "month");
    setCurrentMonth(minusMonth);
  };

  //Loopar igenom dagar
  const renderDays = () => {
    const dateFormat = "dddd";
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col" key={i}>
          {now.weekday(i).format(dateFormat)}
        </div>
      );
    }
    return <div className="row text-[16px]">{days}</div>
  };

  const formateDateObject = (date: dayjs.Dayjs) => {
    return {
      day: date.date(),
      month: date.month(),
      year: date.year(),
      isCurrentMonth: date.month() === currentMonth.month(),
      isCurrentDay: date.isToday()
    };
  };

  //Hämta alla dagar
  const getAllDays = () => {
    const startOfMonth = currentMonth.startOf("month");
    const startDate = startOfMonth.startOf("week");

    //7dagar x 6veckor för 6 rader
    const totalDays = 42;
    const days = [];

    for (let i = 0; i < totalDays; i++) {
      const day = startDate.add(i, "day");
      days.push(formateDateObject(day));
    }

    //Dela upp i veckor 
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push({ dates: days.slice(i, i + 7) });
    }

    setArrayOfDays(weeks);
  };

  //Rendera ut alla celler
  const renderCells = () => {
    const rows: any = [];

    arrayOfDays.forEach((week, index) => {
      const days: any = [];

      week.dates.forEach((d: any, i: any) => {
        const dateObj = dayjs(`${d.year}-${d.month + 1}-${d.day}`); 

        const isSelected = selectedDate?.isSame(dateObj, "day");
        const hasEvent = hasEventForDate(dateObj);
        days.push(
          <div
            key={i}
            className={`col mb-4 cursor-pointer relative ${!d.isCurrentMonth
              ? "text-forma_ro_light_grey"
              : d.isCurrentDay
                ? "selected"
                : "text-forma_ro_black"
              }`}
            onClick={() => hasEvent && setSelectedDate(dateObj)}
          >
            <span
              className={`w-14 h-14 flex items-center justify-center rounded-full font-semibold
            ${isSelected ? "bg-forma_ro_green shadow-md" : "bg-white"}${hasEvent ? " has-event" : ""}
            `}
            >
              {d.day}
            </span>
            
          </div>
        );
      });

      rows.push(
        <span className="row text-[16px]" key={index}>
          {days}
        </span>
      );
    });

    return <div className="body">{rows}</div>;
  };

  const getEventsForSelectedDate = () => {
    if (!selectedDate) return [];

    return eventData?.filter((event: any) => {
      const start = dayjs(event.event_start_date);
      const end = dayjs(event.event_end_date);
      return selectedDate.isBetween(start, end, "day", "[]");
    }) || [];
  };


  useEffect(() => {
    getAllDays();
    getAllEvents();
  }, [currentMonth]);


  return (
    <>
      <div className="max-w-[100rem] w-full mx-auto flex mt-20 gap-10 justify-between">
        <div className="max-w-[60rem] w-full border-forma_ro_grey border-[1px] rounded-2xl p-4">
          <div className=" flex items-center max-w-[60rem] w-full justify-between mb-8">
            <button onClick={() => prevMonth()}>
              <ChevronLeft />
            </button>
            <p>{currentMonth.format(dateFormat)}</p>
            <button onClick={() => nextMonth()}>
              <ChevronRight />
            </button>
          </div>

          <div>
            <div className="mb-4">
              {renderDays()}
            </div>
            {renderCells()}
          </div>
        </div>
        <div className="max-w-[35rem] w-full bg-white rounded-2xl max-h-full shadow-sm">
          {selectedDate ? (
            <>
              <div className="bg-forma_ro_green w-full rounded-t-2xl">
                <h3 className=" text-center">
                  {selectedDate.format("D MMMM YYYY")}
                </h3>
              </div>
              <div className="p-4">
                {getEventsForSelectedDate().map((event: any, index: number) => (
                  <div key={index} className="flex flex-col justify-between gap-10">
                    <h4 className="font-bold text-[20px]">{event.title?.rendered}</h4>
                    <p>
                      {dayjs(event.event_start_date).format("D MMM HH:mm")} – {dayjs(event.event_end_date).format("D MMM HH:mm")}
                    </p>
                    <p><span className="font-bold">Plats:</span> {event.event_location}</p>
                    <p>{event.event_description}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-4">
              <p className="text-[16px] m-2">Välj ett datum med event</p>
            </div>
          )}
        </div>

      </div>

    </>
  )
}

export default Calendar