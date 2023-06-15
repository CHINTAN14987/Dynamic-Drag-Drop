export interface CardStateI {
  [key: string]: {
    key: string;
    list: ListItemsI[];
  };
}

export interface ListItemsI {
  id: number;
  title: string;
  isActivated?: boolean;
  label?: any;
}
export interface DateReminderI {
  label: string;
  value: string;
}

export interface CardPositionI {
  label: number | string;
  value: number | string;
}
