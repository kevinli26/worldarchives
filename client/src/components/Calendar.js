import React, { useState, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

import { setStartDate, setEndDate } from "../actions/index";

const Calendar = (props) => {
  const [state, setState] = useState([
    {
      startDate: props.startDate,
      endDate: props.endDate,
      key: props.calKey,
    },
  ]);

  useEffect(
    () =>
      setState([
        {
          startDate: props.startDate,
          endDate: props.endDate,
          key: props.calKey,
        },
      ]),
    [props.startDate, props.endDate]
  );

  return (
    <div
      style={{
        flex: "1",
      }}
    >
      <DateRangePicker
        onChange={(item) => {
          props.dispatch(setStartDate(item.selection.startDate));
          props.dispatch(setEndDate(item.selection.endDate));
        }}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={2}
        ranges={state}
        direction="horizontal"
      />
    </div>
  );
};

export default Calendar;
