import styles from "../../styles/Home.module.css";
import { Type } from "src/types/dataType";
import useSWR from "swr";
import { useMutation } from "src/lib/mutation";
import { useEffect, useRef, useState } from "react";
import TextInput from "./components/TextInput";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Home() {
  const [id, setId] = useState("");
  const [toDo, setToDo] = useState("");
  const [editToDo, setEditToDo] = useState("");
  const [selectedIndex, setSelectedIndex] = useState("");
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [inputFocus, setInputFocus] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [updateData, setUpdateData] = useState<Type.UpdateData>({});
  const editInputRef = useRef(undefined);
  const insertInputRef = useRef(undefined);
  const { data, isLoading, mutate } = useSWR<Type.ToDoList>(
    "/api/todo",
    fetcher
  );
  const [taskData, setTaskData] = useState<Type.ToDo[]>(data?.data || []);
  const [del] = useMutation(`/api/todo/${id}`, "DELETE");
  const [add] = useMutation<Type.ToDoInput>(`/api/todo`, "POST");
  const [update] = useMutation<Type.ToDoInput>(
    `/api/todo/${updateData.id}`,
    "PUT"
  );

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };
  const onDeleteClicked = (id: string) => {
    setId(id);
  };

  const handleMarkComplete = (id: string, isComplete: boolean) => {
    setUpdateData({
      id,
      isComplete,
    });
  };

  const onAddClicked = () => {
    if (!toDo) {
      alert("please input To Do field!");
    } else if (data?.data && data?.data.some((v) => v.todo === toDo)) {
      alert("duplicate item");
      insertInputRef.current.focus();
    } else {
      add({
        todo: toDo,
        isComplete: false,
      }).then((data) => {
        if (data) {
          setToDo("");
          mutate(undefined, {
            revalidate: true,
          });
        }
      });
    }
  };

  const onUpdateDataClicked = (id: string, todo: string) => {
    console.log(data?.data.some((v) => v.todo === todo));
    if (data?.data && data?.data.some((v) => v.todo === todo)) {
      alert("duplicate item");
      editInputRef.current.focus();
    } else {
      setUpdateData({
        id: id,
        todo: todo,
      });
    }
  };
  useEffect(() => {
    if (id) {
      del();
      setId("");
    }
    mutate(undefined, {
      revalidate: true,
    });
  }, [id]);

  useEffect(() => {
    if (data?.data) {
      if (search) {
        const result = data.data.filter((v) =>
          v.todo.toString().toLowerCase().match(search.toString().toLowerCase())
        );
        setTaskData(result);
      } else {
        setTaskData(data.data);
      }
    }
  }, [data, search]);

  useEffect(() => {
    if (updateData) {
      if (updateData.todo) {
        console.log("todo true");
        update({
          todo: updateData.todo,
        }).then((data) => {
          if (data) {
            mutate(undefined, {
              revalidate: true,
            });
          }
        });
        setIsEditing(false);
        setEditToDo("");
        setUpdateData({});
      } else if (
        updateData.isComplete === true ||
        updateData.isComplete === false
      ) {
        update({
          isComplete: updateData.isComplete ? true : false,
        }).then((data) => {
          if (data) {
            mutate(undefined, {
              revalidate: true,
            });
          }
        });
        setIsEditing(false);
        setEditToDo("");
        setUpdateData({});
        console.log("iscomplete true");
      } else {
        console.log("no data");
      }
    }
  }, [updateData]);

  const regex = /[^\D]/g;

  return (
    <div>
      <div style={{ padding: "0px 1rem" }}>
        <h1 className={styles.logo}>ToDo App</h1>
        <div className={styles.headerWrapper}>
          <div className={styles.searchWrapper}>
            <TextInput
              type={"text"}
              placeholder="Search data here..."
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
            />
          </div>
          <div className={styles.formWrapper}>
            <div
              className={styles.nameWrapper}
              style={{
                boxShadow: inputFocus ? "0px 0px 0px 2px #0070f3" : undefined,
                backgroundColor: inputFocus ? "white" : undefined,
              }}
              onClick={() => setInputFocus(true)}
            >
              <input
                ref={insertInputRef}
                autoFocus
                style={{
                  backgroundColor: inputFocus ? "white" : undefined,
                }}
                onBlur={() => setInputFocus(false)}
                placeholder="Input To Do here..."
                onKeyDown={(e) => {
                  if (e.code === "Enter") {
                    onAddClicked();
                  }
                }}
                type={"text"}
                value={toDo}
                onChange={(e) => setToDo(e.currentTarget.value)}
              />
            </div>
            <div
              className={styles.btn}
              style={{ marginLeft: 10 }}
              onClick={onAddClicked}
            >
              Add
            </div>
          </div>
        </div>
      </div>
      {isLoading ? (
        <div style={{ padding: 20 }} className={styles.grid}>
          <div>Loading...</div>
        </div>
      ) : (
        <div className={styles.grid}>
          {taskData.length > 0 ? (
            <>
              {taskData.map((data) => (
                <div
                  className={styles.card}
                  key={data.id}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {data.isComplete && (
                    <div className={styles.complete}>complete</div>
                  )}
                  <div style={{ flexDirection: "column" }}>
                    {isEditing && selectedIndex === data.id ? (
                      <div className={styles.editItem}>
                        <input
                          ref={editInputRef}
                          autoFocus
                          style={{
                            backgroundColor: inputFocus ? "white" : undefined,
                          }}
                          onBlur={() => setInputFocus(false)}
                          placeholder="Input To Do here..."
                          onKeyDown={(e) => {
                            if (e.code === "Enter") {
                              onUpdateDataClicked(data.id, editToDo);
                            }
                          }}
                          type={"text"}
                          value={editToDo}
                          onChange={(e) => setEditToDo(e.currentTarget.value)}
                        />
                        <div
                          style={{ display: "inline-block", flexWrap: "wrap" }}
                        >
                          <div
                            style={{ marginLeft: 10 }}
                            className={styles["btnDelete"]}
                            onClick={() => {
                              setIsEditing(false);
                              setEditToDo("");
                              setSelectedIndex("");
                            }}
                          >
                            Cancel
                          </div>
                          <div
                            style={{ marginLeft: 10 }}
                            onClick={() =>
                              onUpdateDataClicked(data.id, editToDo)
                            }
                            className={styles["btn"]}
                          >
                            Update
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p style={{ marginTop: 10 }}>{data.todo || "No name"}</p>
                    )}
                    <div>{data.createAt}</div>

                    <div
                      className={
                        isHovering
                          ? `${styles.collapse} ${styles.showCollapse}`
                          : styles.collapse
                      }
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: 10,
                      }}
                    >
                      <div
                        onClick={() => {
                          setIsEditing(true);
                          setSelectedIndex(data.id);
                          setEditToDo(data.todo);
                        }}
                        className={styles["btn"]}
                      >
                        Edit
                      </div>
                      <div
                        style={{ marginLeft: 10 }}
                        className={styles["btnDelete"]}
                        onClick={() => onDeleteClicked(data.id)}
                      >
                        Remove
                      </div>
                      <div
                        style={{ marginLeft: 10 }}
                        className={
                          data.isComplete
                            ? `${styles["btnMark"]} ${styles["btnMarkInCom"]}`
                            : styles["btnMark"]
                        }
                        onClick={() =>
                          handleMarkComplete(data.id, !data.isComplete)
                        }
                      >
                        {data.isComplete
                          ? "Mark as Incomplete"
                          : "Mark as Complete"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className={styles.noData}>
              No result. Create a new one instead!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
