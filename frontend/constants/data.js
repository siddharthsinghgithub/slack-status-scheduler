export const steps = ["Name", "Active hours", "Status"];

export const days = [
  { key: "MON", name: "Monday" },
  { key: "TUE", name: "Tuesday" },
  { key: "WED", name: "Wednesday" },
  { key: "THU", name: "Thursday" },
  { key: "FRI", name: "Friday" },
  { key: "SAT", name: "Saturday" },
  { key: "SUN", name: "Sunday" }
];

export const initialState = {
  name: "",
  schedules: {
    MON: {
      intervalDay: "MON",
      active: false,
      intervalStartMinute: "00",
      intervalStartHour: "00",
      intervalEndMinute: "00",
      intervalEndHour: "00"
    },
    TUE: {
      intervalDay: "TUE",
      active: false,
      intervalStartMinute: "00",
      intervalStartHour: "00",
      intervalEndMinute: "00",
      intervalEndHour: "00"
    },
    WED: {
      intervalDay: "WED",
      active: false,
      intervalStartMinute: "00",
      intervalStartHour: "00",
      intervalEndMinute: "00",
      intervalEndHour: "00"
    },
    THU: {
      intervalDay: "THU",
      active: false,
      intervalStartMinute: "00",
      intervalStartHour: "00",
      intervalEndMinute: "00",
      intervalEndHour: "00"
    },
    FRI: {
      intervalDay: "FRI",
      active: false,
      intervalStartMinute: "00",
      intervalStartHour: "00",
      intervalEndMinute: "00",
      intervalEndHour: "00"
    },
    SAT: {
      intervalDay: "SAT",
      active: false,
      intervalStartMinute: "00",
      intervalStartHour: "00",
      intervalEndMinute: "00",
      intervalEndHour: "00"
    },
    SUN: {
      intervalDay: "SUN",
      active: false,
      intervalStartMinute: "00",
      intervalStartHour: "00",
      intervalEndMinute: "00",
      intervalEndHour: "00"
    }
  },
  timezone: "Europe/Vienna",
  statusText: "",
  statusEmoji: "",
  dndEnabled: true
};
