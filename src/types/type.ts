export interface CardStateI {
  [key: string]: {
    key: string;
    list: ListItemsI[]; // Update this type to match the actual type of your 'list' property
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
