import { Button } from "antd";
import React, { useRef, useState, FC } from "react";
import { useDispatch } from "react-redux";
import { addCardTitle } from "../../redux/reducer";
import { ListItemsI } from "../../types/type";
import CopyCard from "../editor-components/copy-card";
import EditDate from "../editor-components/edit-date";
import "./EditCard.css";
interface IProps {
  closeModal: () => void;
  listLocation: string;
  card: ListItemsI | {};
}
const EditCard: FC<IProps> = (props: any) => {
  const { closeModal, listLocation, card } = props;
  const [editorIndex, setEditorIndex] = useState(-1);
  const [isEditLabelActive, setIsEditLabelActive] = useState(false);
  const editors: string[] = ["Edit Labels", "Edit Dates", "Copy"];
  const [background, setBackGround] = useState(true);
  const [inputValue, setInputValue] = useState(card?.title);

  const disptach = useDispatch();

  const saveEditCard = () => {
    disptach(
      addCardTitle({
        event: inputValue,
        value: card.id,
        param: listLocation,
      })
    );
    closeModal();
  };
  console.log(inputValue);
  const [openEditor, setOpenEditor] = useState("");
  const openEditorHandler = (index: number, value: string) => {
    setOpenEditor(value);
    setEditorIndex(index);
    setBackGround(true);
    if (value === "Edit Labels") {
      setIsEditLabelActive(true);
      setBackGround(false);
    } else setIsEditLabelActive(false);
  };

  const changeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(e.target.value);
    setInputValue(e.target.value);
  };
  return (
    <div className="edit-container">
      <div>
        <textarea
          value={inputValue}
          onChange={changeHandler}
          // readOnly={!isEditLabelActive}
          className={`edit-card-input ${
            !background && openEditor === "Edit Labels" ? "text-bg-color" : ""
          }`}
        ></textarea>
        <Button
          type="primary"
          className="save-button"
          onClick={() => {
            saveEditCard();
          }}
        >
          Save
        </Button>
      </div>
      <div className="editor-wrapper">
        {editors?.map((editor, index) => {
          return (
            <>
              <button
                key={index}
                className="editor-button"
                onClick={() => {
                  openEditorHandler(index, editor);
                }}
              >
                {editor}
              </button>

              {openEditor === editors[1] && index === editorIndex && (
                <EditDate
                  cardID={card?.id}
                  closeModal={() => {
                    setOpenEditor("");
                  }}
                  listLocation={listLocation}
                  closeEdit={closeModal}
                />
              )}
              {openEditor === editors[2] && index === editorIndex && (
                <CopyCard
                  card={card}
                  closeModal={() => {
                    setOpenEditor("");
                  }}
                  closeEdit={closeModal}
                />
              )}
            </>
          );
        })}
      </div>
    </div>
  );
};

export default EditCard;
