import React, { useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import NewNote from "./components/Form/NewNote";
import { Container } from "react-bootstrap";
import { NoteData, RawNote } from "./types";
import { useLocaleStorage } from "./useLocaleStorage";
import { Tag } from "./types";
import { v4 } from "uuid";
import MainPage from "./MainPage";
import Layout from "./components/NoteDetail/Layout";
import NoteDetail from "./components/NoteDetail/NoteDetail";
import EditNote from "./components/Form/EditNote";
import "./app.css";

const App = () => {
  const [notes, setNotes] = useLocaleStorage<RawNote[]>("notes", []);
  const [tags, setTags] = useLocaleStorage<Tag[]>("tags", []);
  // console.log("asdasd", notes);

  const noteWithTags = useMemo(() => {
    return notes.map((note) => ({
      ...note,
      tags: tags.filter((tag) => note.tagIds && note.tagIds.includes(tag.id)),
    }));
  }, [notes, tags]);

  const onCreateNote = ({ tags, ...data }: NoteData) => {
    setNotes((prev) => {
      return [
        ...prev,
        { ...data, id: v4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });
  };

  const addTag = (tag: Tag) => {
    setTags((prev) => [...prev, tag]);
  };

  const onDeleteNote = (id: string) => {
    setNotes((prevNotes) => {
      return prevNotes.filter((note) => note.id !== id);
    });
  };

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes((prev) => {
      return prev.map((note) => {
        if (note.id === id) {
          return {
            ...note,
            ...data,
            tagIds: tags.map((tag) => tag.id),
          };
        } else {
          return note;
        }
      });
    });
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={<MainPage notes={noteWithTags} availableTags={tags} />}
        />
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={onCreateNote}
              addTag={addTag}
              availableTags={tags}
            />
          }
        />
        <Route path="/:id" element={<Layout notes={noteWithTags} />}>
          <Route index element={<NoteDetail onDelete={onDeleteNote} />} />
          <Route
            path="edit"
            element={
              <EditNote
                addTag={addTag}
                availableTags={tags}
                onUpdate={onUpdateNote}
              />
            }
          />
        </Route>

        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    </Container>
  );
};

export default App;
