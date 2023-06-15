import { Button, Checkbox, Input, Select } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { FC, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useDispatch } from "react-redux";
import { saveCardLabels } from "../../../redux/reducer";
import { DateReminderI } from "../../../types/type";
import "./EditDate.css";
interface IProps {
  cardID: number;
  closeModal: () => void;
  listLocation: string;
  closeEdit: () => void;
}
const EditDate: FC<IProps> = (props) => {
  const { cardID, closeModal, listLocation, closeEdit } = props;
  const [startDateIsChecked, setStartDateIsChecked] = useState(false);
  const [dueDateIsChecked, setDueDateIsChecked] = useState(true);
  const [value, onChange] = useState<any>(
    startDateIsChecked && dueDateIsChecked
      ? [new Date(), new Date()]
      : new Date()
  );
  const [remindervalue, setReminderValue] = useState(null);
  const disptach = useDispatch();
  const handleChange = (value: string) => {
    setReminderValue(value);
  };
  enum Reminder {
    QuaterHour = "15 minute before",
    HalfHour = "30 minutes before",
    DayBefore = "1 day before",
    HourBefore = "1 hour before",
  }
  const reminderData: DateReminderI[] = [
    { label: Reminder.QuaterHour, value: Reminder.QuaterHour },
    { label: Reminder.HalfHour, value: Reminder.HalfHour },
    { label: Reminder.HourBefore, value: Reminder.HourBefore },
    { label: Reminder.DayBefore, value: Reminder.DayBefore },
  ];
  const startDateHandler = (e: CheckboxChangeEvent) => {
    setStartDateIsChecked(e.target.checked);
  };
  const dueDateHandler = (e: CheckboxChangeEvent) => {
    setDueDateIsChecked(e.target.checked);
  };
  const dateSetter = () => {
    if (startDateIsChecked && dueDateIsChecked) {
      return {
        startDate: value[0],
        dueDate: value[1],
        reminder: remindervalue,
      };
    } else if (!startDateIsChecked && dueDateIsChecked) {
      return { startDate: value, dueDate: null, reminder: remindervalue };
    } else if (startDateIsChecked && !dueDateIsChecked) {
      return { startDate: value[0], dueDate: null, reminder: remindervalue };
    } else
      return { startDate: new Date(), dueDate: null, reminder: remindervalue };
  };

  const saveDateHanlder = () => {
    disptach(
      saveCardLabels({
        data: dateSetter(),
        id: cardID,
        location: listLocation,
      })
    );
    closeModal();
    closeEdit();
  };
  return (
    <div className="editor-container">
      <h3 className="editor-heading">Dates</h3>
      <Calendar
        onChange={onChange}
        value={value}
        selectRange={startDateIsChecked}
      />
      <div className="start-date-wrapper">
        <span
          className={`${startDateIsChecked ? "start-date-text-color" : ""}`}
        >
          Start Date
        </span>
        <div>
          <Checkbox
            checked={startDateIsChecked}
            value={startDateIsChecked}
            onChange={startDateHandler}
          />
          <Input
            readOnly
            className={`${startDateIsChecked ? "start-date-input-color" : ""}`}
            value={
              value[0] &&
              new Date(value[0] || value).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })
            }
            disabled={!startDateIsChecked}
            placeholder="MM/DD/YY"
          />
        </div>
      </div>
      <div className="due-date-wrapper">
        <span>Due Date</span>
        <div>
          <Checkbox
            checked={dueDateIsChecked}
            value={dueDateIsChecked}
            onChange={dueDateHandler}
          />
          <Input
            readOnly
            className={`${dueDateIsChecked ? "due-date-input-color" : ""}`}
            value={
              value[1] || (value && dueDateIsChecked)
                ? new Date(value[1] || value).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })
                : dueDateIsChecked === false
                ? "DD/MM/YY"
                : new Date(new Date()).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })
            }
            disabled={!dueDateIsChecked}
            placeholder="MM/DD/YY"
          />
        </div>
      </div>
      <div className="reminder-wrapper">
        <p>Set due date reminder</p>
        <Select
          options={reminderData}
          style={{ width: "80%" }}
          placeholder="Please select"
          value={remindervalue}
          onChange={handleChange}
        ></Select>
        <p>Reminders will be send to all members and card watcher of this</p>
        <div className="button-wrp">
          <Button type="primary" onClick={saveDateHanlder}>
            Save
          </Button>
          <Button type="primary" onClick={closeModal}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditDate;
