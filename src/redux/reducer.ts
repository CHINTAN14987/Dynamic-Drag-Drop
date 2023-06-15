import { ListItemsI } from "./../types/type";
import { createSlice } from "@reduxjs/toolkit";
import { CardStateI } from "../types/type";

const cardReducer = createSlice({
  name: "card",
  initialState: {} as CardStateI,
  reducers: {
    addToDoCardList: (state, action) => {
      const { data, value } = action.payload;
      return {
        ...state,
        [value]: {
          ...state?.[value],
          list: state?.[value]?.list?.concat(data),
        },
      };
    },
    addCardTitle: (state, action) => {
      const { event, value, param, isActivated } = action.payload;
      return {
        ...state,
        [param]: {
          ...state?.[param],
          list: state?.[param]?.list?.map((item: ListItemsI) => {
            if (item?.id === value) {
              if (isActivated) {
                return { ...item, isActivated: isActivated };
              } else return { ...item, title: event };
            }
            return item;
          }),
        },
      };
    },
    deleteCard: (state, action) => {
      const { param, value } = action.payload;
      return {
        ...state,
        [param]: {
          ...state?.[param],
          list: state?.[param].list.filter(
            (item: ListItemsI) => item?.id !== value
          ),
        },
      };
    },
    dropCard: (state, action) => {
      const { currentCard, draggedFrom, draggedTo, dropOver } = action.payload;
      const newState = [...state?.[draggedFrom]?.list];
      const draggedItem = newState[currentCard];
      newState.splice(currentCard, 1);

      if (draggedTo && draggedTo !== draggedFrom) {
        return {
          ...state,
          [draggedFrom]: {
            ...state?.[draggedFrom],
            list: newState,
          },
          [draggedTo]: {
            ...state[draggedTo],
            list: [...state?.[draggedTo]?.list?.concat(draggedItem)],
          },
        };
      } else if (draggedTo && draggedTo === draggedFrom) {
        newState.splice(dropOver, 0, draggedItem);

        return {
          ...state,
          [draggedFrom]: { ...state?.[draggedFrom], list: newState },
        };
      } else return;
    },
    saveCardLabels: (state, action) => {
      const { data, id, location } = action.payload;

      if (location) {
        return {
          ...state,
          [location]: {
            ...state?.[location],
            list: state?.[location]?.list?.map((item: ListItemsI) => {
              if (item?.id === id) {
                return { ...item, label: { ...data } };
              }
              return item;
            }),
          },
        };
      }
    },
    copyCard: (state, action) => {
      const { data, location, position } = action.payload;
      const newState = [...state?.[location]?.list];

      if (position >= 0) {
        newState?.splice(position, 0, data);
      } else {
        newState.push(data);
      }

      return { ...state, [location]: { ...state?.[location], list: newState } };
    },
    newAddedList: (state, action) => {
      const { value } = action.payload;
      return {
        ...state,
        [value]: { key: value, list: [] },
      };
    },
  },
});
export const {
  addToDoCardList,
  addCardTitle,
  deleteCard,
  dropCard,
  saveCardLabels,
  copyCard,
  newAddedList,
} = cardReducer.actions;
export default cardReducer.reducer;
