import { useRef, useState, useEffect, FC } from "react";
import { Button, Checkbox, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { copyCard } from "../../../redux/reducer";
import "./CopyCard.css";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { ListItemsI } from "../../../types/type";
interface IProps {
  card: ListItemsI;
  closeModal: () => void;
  closeEdit: () => void;
}
const CopyCard: FC<IProps> = (props) => {
  const { card, closeModal, closeEdit } = props;
  const list = useSelector((state: any) => state.cardReducer);
  const [keepLabel, setkeepLabels] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [cardLocation, setCardLocation] = useState<string | null>(null);
  const [cardIndexPosition, setCardIndexPosition] = useState<number | null>(
    null
  );

  const dispatch = useDispatch();
  const handleChange = (value: string) => {
    setCardLocation(value);
  };
  const PositionHandleChange = (value: number) => {
    setCardIndexPosition(value);
  };

  const onSaveHandler = (): void => {
    dispatch(
      copyCard({
        location: cardLocation ? cardLocation : findCardDefaultLocation(),
        position: cardIndexPosition,
        data: !keepLabel
          ? {
              ...card,

              label: null,
              id: Math.floor(Math.random() * 1000),
              title: inputRef?.current?.value,
            }
          : {
              ...card,

              id: Math.floor(Math.random() * 1000),
              title: inputRef?.current?.value,
            },
      })
    );
    closeModal();
    closeEdit();
  };
  const keepLabelOnChangeHandler = (e: CheckboxChangeEvent) => {
    setkeepLabels(e.target.checked);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  function cardLocationandSequence() {
    let arr1 = [];
    let arr2 = [];
    for (let key in list) {
      if (JSON.stringify(list[key]).includes(card?.id as any)) {
        arr1.push({ label: key, value: key });
      } else arr2.push({ label: key, value: key });
    }
    return [...arr1, ...arr2];
  }

  function cardPosition() {
    let arr1 = [];

    for (let key in list) {
      if (key === cardLocation) {
        for (let i = 0; i <= list[key].list.length; i++) {
          arr1.push({ label: i, value: i });
        }
      }
    }
    return arr1;
  }

  function findCardDefaultLocation() {
    for (let value of Object.entries(list)) {
      let key = value[0];
      let listItems: any = value[1];
      if (listItems?.list?.some((item: ListItemsI) => item.id === card.id)) {
        return key;
      }
    }
  }

  return (
    <div className="editor-container">
      <div>
        <h3 className="editor-heading">Copy Card</h3>
        <div className="main-container">
          <label className="sub-heading">Title</label>
          <textarea
            className="copycard-title-editor"
            ref={inputRef}
            defaultValue={card.title}
          ></textarea>
          <label className="sub-heading">Keep...</label>
          <div className="label-editor-wrapper">
            <Checkbox checked={keepLabel} onChange={keepLabelOnChangeHandler} />
            <span className="sub-heading">
              {card.label
                ? `labels (${Object.keys(card?.label)?.length})`
                : `labels(0)`}
            </span>
          </div>
          <div className="copy-selection-inner-wrapper">
            <div>
              <span className="sub-heading">List</span>
              <Select
                className="card-location-select"
                options={cardLocationandSequence()}
                placeholder="Please select"
                value={cardLocation}
                onChange={handleChange}
              ></Select>
            </div>

            <div>
              <span className="sub-heading">Position</span>
              <Select
                className="card-location-select"
                options={cardPosition()}
                value={cardIndexPosition}
                placeholder="Please select"
                onChange={PositionHandleChange}
              ></Select>
            </div>
          </div>
          <div className="btn-wrapper">
            <Button
              onClick={onSaveHandler}
              className="save-copy-card"
              type="primary"
            >
              Create card
            </Button>
            <Button
              onClick={closeModal}
              className="save-copy-card"
              type="primary"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopyCard;
