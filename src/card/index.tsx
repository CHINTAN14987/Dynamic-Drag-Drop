import React, { useRef, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { BsPen } from "react-icons/bs";
import { AiOutlineClockCircle } from "react-icons/ai";
import "./Card.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addCardTitle,
  addToDoCardList,
  deleteCard,
  dropCard,
  newAddedList,
} from "../redux/reducer";

import { Button, Modal } from "antd";
import { ListItemsI } from "../types/type";
import EditCard from "./edit-card";
import CardDetails from "./card-details";

const Card = () => {
  const [penActiveDone, setPenActiveDone] = useState(false);
  const disptach = useDispatch();
  const dragItem = useRef<HTMLElement | string>(null);
  const dragOverItem = useRef<HTMLElement | string>();
  const listDetails = useSelector((state: any) => state?.cardReducer);
  const [newList, setNewList] = useState(false);
  const [newListName, setListName] = useState("");
  const [cardIndex, setCardIndex] = useState(-1);
  const [editCardIndex, setEditCardIndex] = useState(-1);
  const [hoverCardListName, setHoverCardListName] = useState(null);
  const [modalIsActive, setModalIsActive] = useState(false);
  const [modalData, setModalData] = useState<ListItemsI | any>();
  const [editListData, setEditListData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (value: ListItemsI) => {
    setIsModalOpen(true);
    setModalData(value);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [draggedCardAttributeName, setDraggedCardAttributeName] =
    useState(null);
  const addInitalCardHandler = (value: any) => {
    const data = {
      id: Math.floor(Math.random() * 1000),
      title: "",
    };
    disptach(addToDoCardList({ data, value }));
  };

  const addCardsHandler = (value: string) => {
    const data: ListItemsI = {
      id: Math.floor(Math.random() * 1000),
      title: "",
    };
    disptach(addToDoCardList({ data, value }));
  };
  const newListNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setListName(e.target.value);
  };
  const cardTitleHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    value: string,
    param: string
  ) => {
    disptach(
      addCardTitle({
        event: event.target.value,
        value: value,
        param,
      })
    );
  };

  const listDeleteHandler = (param: string, value: number) => {
    disptach(deleteCard({ param, value }));
  };

  const penDisplayDoneHandler = (value: number, listName: string) => {
    setPenActiveDone(true);
    setCardIndex(value);
    setHoverCardListName(listName);
  };
  const penHideDoneHandler = () => {
    setPenActiveDone(false);
    setCardIndex(-1);
    setHoverCardListName(null);
  };

  const dragStart = (e: React.DragEvent<HTMLDivElement>, position: string) => {
    dragItem.current = position;
    const targetElement = e.target as HTMLDivElement;
    setDraggedCardAttributeName(targetElement.getAttribute("data-attribute"));
  };

  const newListAddedHandler = () => {
    disptach(newAddedList({ value: newListName }));
    setNewList(false);
    setListName("");
  };
  const dropHandler = (value: string) => {
    disptach(
      dropCard({
        draggedTo: value,
        draggedFrom: draggedCardAttributeName,
        currentCard: dragItem.current,
        dropOver: dragOverItem.current,
      })
    );
  };
  const dragEnter = (position: string) => {
    dragOverItem.current = position;
  };

  const onDragOverHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const editCardHandler = (index: number, value: ListItemsI) => {
    setEditCardIndex(index);
    setModalIsActive(true);
    setEditListData(value);
  };

  return (
    <div>
      <div className="top-Nav">
        {!Object.keys(listDetails).length ? (
          <h3
            onClick={() => {
              setNewList(true);
            }}
          >
            Add List Name
          </h3>
        ) : (
          <h3
            onClick={() => {
              setNewList(true);
            }}
          >
            Add Another List
          </h3>
        )}

        {newList && (
          <div>
            <input
              value={newListName}
              onChange={newListNameHandler}
              placeholder="Name"
            />
            <Button type="primary" onClick={newListAddedHandler}>
              {Object.keys(listDetails)?.length ? "Add" : "Create"}
            </Button>
          </div>
        )}
      </div>
      <div className="card-wrapper">
        {Object.keys(listDetails)?.length ? (
          <>
            {Object.keys(listDetails).map((key, index) => {
              return (
                <div className="done" key={index}>
                  <h3>{listDetails?.[key]?.key}</h3>
                  <div
                    onDragOver={onDragOverHandler}
                    onDrop={() => {
                      dropHandler(key);
                    }}
                  >
                    {listDetails?.[key]?.list?.length ? (
                      <div className="card-list">
                        {listDetails?.[key]?.list?.map(
                          (card: any, index: any) => {
                            return (
                              <div
                                key={index}
                                onDragStart={(e) => dragStart(e, index)}
                                draggable={card.title ? true : false}
                                data-attribute={key}
                                onDragOver={() => dragEnter(index)}
                                onMouseEnter={() => {
                                  penDisplayDoneHandler(index, key);
                                }}
                                onMouseLeave={penHideDoneHandler}
                              >
                                <div>
                                  <div className="card">
                                    {card?.title && card?.isActivated ? (
                                      <div
                                        className="card-content-wrapper"
                                        onClick={() => {
                                          showModal({ ...card, key: key });
                                        }}
                                      >
                                        <h3 className="card-title">
                                          {card?.title}
                                        </h3>
                                        {card?.label?.startDate && (
                                          <div className="card-start-date">
                                            <AiOutlineClockCircle />
                                            <span>
                                              {new Date(
                                                card?.label?.startDate
                                              ).toLocaleDateString("en-GB", {
                                                day: "numeric",
                                                month: "long",
                                              })}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <></>
                                    )}

                                    {penActiveDone &&
                                      cardIndex === index &&
                                      hoverCardListName === key &&
                                      card?.isActivated && (
                                        <div className="pen-icon">
                                          <BsPen
                                            onClick={() => {
                                              editCardHandler(index, card);
                                            }}
                                          />
                                        </div>
                                      )}
                                    {penActiveDone &&
                                      cardIndex === index &&
                                      hoverCardListName === key && (
                                        <div className="delete-card-icon">
                                          <RxCross1
                                            className="delete-icon"
                                            onClick={() => {
                                              listDeleteHandler(key, card?.id);
                                            }}
                                          />
                                        </div>
                                      )}

                                    {!card?.isActivated && (
                                      <textarea
                                        disabled={
                                          listDetails?.[key]?.list?.length -
                                            1 !==
                                          index
                                            ? true
                                            : false
                                        }
                                        value={card?.title}
                                        onBlur={(e) => {
                                          if (e.target.value) {
                                            disptach(
                                              addCardTitle({
                                                event: e.target.value,
                                                value: card?.id,
                                                param: key,
                                                isActivated: true,
                                              })
                                            );
                                          }
                                        }}
                                        onChange={(e) => {
                                          cardTitleHandler(e, card?.id, key);
                                        }}
                                        placeholder="Enter a title for this card..."
                                      ></textarea>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    ) : (
                      <></>
                    )}

                    {!listDetails?.[key]?.list?.length ? (
                      <div
                        className="initial-card-add-wrapper"
                        onClick={() => {
                          addInitalCardHandler(key);
                        }}
                      >
                        <span>+</span>
                        <h3> Add Card</h3>
                      </div>
                    ) : (
                      <Button
                        type="primary"
                        data-attribute={key}
                        onClick={() => {
                          listDetails[key]?.list[
                            listDetails[key]?.list.length - 1
                          ].title &&
                            listDetails[key]?.list.length &&
                            addCardsHandler(key);
                        }}
                        className="card-button-wrapper"
                      >
                        Add Card
                      </Button>
                    )}
                  </div>
                  {editCardIndex === index && modalIsActive && (
                    <EditCard
                      listLocation={key}
                      card={editListData}
                      closeModal={() => {
                        setModalIsActive(false);
                      }}
                    />
                  )}
                </div>
              );
            })}
          </>
        ) : (
          <></>
        )}
      </div>
      {isModalOpen && (
        <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <CardDetails data={modalData} />
        </Modal>
      )}
    </div>
  );
};

export default Card;
