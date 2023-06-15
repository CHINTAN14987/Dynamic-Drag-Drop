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
  card: ListItemsI;
}
const EditCard: FC<IProps> = (props) => {
  const { closeModal, listLocation, card } = props;
  const [editorIndex, setEditorIndex] = useState(-1);
  const [isEditLabelActive, setIsEditLabelActive] = useState(false);
  const editors: string[] = ["Edit Labels", "Edit Dates", "Copy"];
  const [background, setBackGround] = useState(true);

  const disptach = useDispatch();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const saveEditCard = () => {
    disptach(
      addCardTitle({
        event: inputRef?.current?.value,
        value: card.id,
        param: listLocation,
      })
    );
    closeModal();
  };
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

  return (
    <div className="edit-container">
      <div>
        <textarea
          ref={inputRef}
          defaultValue={card.title}
          readOnly={!isEditLabelActive}
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
