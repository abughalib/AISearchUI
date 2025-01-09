import React, { useState, useEffect } from "react";
import { useActions } from "../hooks/use-actions";
import { useTypedSelector } from "../hooks/use-typed-selector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faDeleteLeft,
  faSquareFull,
} from "@fortawesome/free-solid-svg-icons";
import { deleteKnowledgeBase } from "../state/action-creators";
import { AISEARCH_HOST, AISEARCH_PORT } from "../constants";
import { get_current_icon_class } from "../App";

interface Modalprops {
  isOpen: boolean;
  onClose: () => void;
}

const SEARCH_BASES_URL = `http://${AISEARCH_HOST}:${AISEARCH_PORT}/search_bases`;
const CREATE_KNOWLEDGE_BASE_URL = `http://${AISEARCH_HOST}:${AISEARCH_PORT}/create_table`;
const DELETE_KNOWLEDGE_BASE_URL = `http://${AISEARCH_HOST}:${AISEARCH_PORT}/delete_table`;

const DBWindow: React.FC<Modalprops> = ({ isOpen, onClose }) => {
  const currentTable = useTypedSelector(
    (state) => state.knowledgeReducer?.table_name
  );

  const { changeKnowledgeBase, createKnowledgeBase } = useActions();

  const modalRef = React.useRef<HTMLDivElement>(null);
  const newTableNameRef = React.useRef<HTMLInputElement>(null);

  const [knowledgeBases, setKnowledgeBases] = useState<string[]>([
    "Knowledge Base 1",
    "Knowledge Base 2",
  ]);

  const closeModal = (e: React.MouseEvent) => {
    if (modalRef.current && e.target === modalRef.current) {
      onClose();
    }
  };

  const createKnowledgeBaseRequest = async (knowledgeBaseName: string) => {
    const headers = new Headers();
    headers.set("Content-Type", "application/json");

    let resp = await fetch(CREATE_KNOWLEDGE_BASE_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        table_name: knowledgeBaseName,
      }),
    });

    if (resp.status === 200) {
      setKnowledgeBases((cur) => [...cur, knowledgeBaseName]);
      createKnowledgeBase(knowledgeBaseName);
      return true;
    }
    return false;
  };

  const deleteKnowledgeBaseRequest = async (knowledgeBaseName: string) => {
    const headers = new Headers();
    headers.set("Content-Type", "application/json");

    let resp = await fetch(DELETE_KNOWLEDGE_BASE_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        table_name: knowledgeBaseName,
      }),
    });

    if (resp.status === 200) {
      setKnowledgeBases((cur) => cur.filter((kb) => kb !== knowledgeBaseName));
      if (currentTable === knowledgeBaseName) {
        changeKnowledgeBase(knowledgeBases[0] || "");
      }
      deleteKnowledgeBase(knowledgeBaseName);
      return true;
    }
    return false;
  };

  useEffect(() => {
    const fetchKbData = async () => {
      const resp = await fetch(SEARCH_BASES_URL, {
        method: "POST",
      });
      const jsonResp: string[] = await resp.json();

      setKnowledgeBases(jsonResp);
    };
    fetchKbData();
  }, []);

  useEffect(() => {
    createKnowledgeBase(knowledgeBases[0] || "");
  }, [knowledgeBases]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-neutral-600 bg-opacity-50 overflow-y-auto h-full w-full"
      id="upload_modal"
      ref={modalRef}
      onClick={closeModal}
    >
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-neutral-100 dark:bg-black dark:text-neutral-300">
        <div className="mt-3 text-center">
          <h3 className="text-2xl leading-6 font-medium">
            Select The Knowledge Base
          </h3>
          <div className="mt-2 px-7 py-3">
            <div className="my-1 flex justify-start">
              <ul>
                {knowledgeBases.map((val, index) => {
                  return (
                    <li className="flex flex-row" key={index}>
                      <label className="flex justify-start mx-2 overflow-auto">
                        <input
                          className="mx-2"
                          type="radio"
                          checked={currentTable === val}
                          onChange={() => {
                            changeKnowledgeBase(val);
                          }}
                        />
                        {val}
                      </label>
                      <button
                        type="button"
                        onClick={async () => {
                          deleteKnowledgeBaseRequest(val);
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faDeleteLeft}
                          className={`${get_current_icon_class()}`}
                          mask={
                            localStorage.getItem("theme") === "dark"
                              ? undefined
                              : faSquareFull
                          }
                        />
                      </button>
                    </li>
                  );
                })}
                <li>
                  <label className="flex justify-start mx-7">
                    <input
                      ref={newTableNameRef}
                      className="mx-2 w-32 rounded outline-none border-2 border-solid dark:bg-gray-700 dark:text-white"
                      type="text"
                      placeholder="Create New"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        if (newTableNameRef.current) {
                          const new_name = newTableNameRef
                            .current!.value.trim()
                            .split(" ")
                            .join("_");

                          if (newTableNameRef.current!.value.length === 0) {
                            newTableNameRef.current!.style.border =
                              "1px solid red";
                            newTableNameRef.current!.value = "Empty";
                            return;
                          }
                          if (knowledgeBases.includes(new_name)) {
                            newTableNameRef.current!.style.border =
                              "1px solid red";
                            return;
                          }
                          await createKnowledgeBaseRequest(new_name);
                        }
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faPlus}
                        className={`${get_current_icon_class()}`}
                        mask={
                          localStorage.getItem("theme") === "dark"
                            ? undefined
                            : faSquareFull
                        }
                      />
                    </button>
                  </label>
                </li>
              </ul>
            </div>
          </div>
          <div className="items-center px-4 py-3">
            <button
              id="upload_button"
              className={`${
                localStorage.getItem("theme") === "dark"
                  ? "border-solid bg-neutral-800 text-white"
                  : "bg-neutral-100 text-black"
              } box-border rounded p-2 w-full`}
              onClick={onClose}
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DBWindow;
