import React from "react";
import { Note } from "../../types";
import {
  useParams,
  Navigate,
  Outlet,
  useOutletContext,
} from "react-router-dom";

type LayoutProps = {
  notes: Note[];
};

const Layout = ({ notes }: LayoutProps) => {
  const { id } = useParams();

  const note = notes.find((n) => n.id === id);
  if (!note) return <Navigate to={"/"} replace />;

  return <Outlet context={note} />;
};

export function useNote() {
  return useOutletContext<Note>();
}

export default Layout;
