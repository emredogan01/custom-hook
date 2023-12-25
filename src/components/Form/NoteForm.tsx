import React, { FormEvent, useRef, useState } from "react";
import { Form, Stack, Row, Col, Button } from "react-bootstrap";
import ReactSelect from "react-select/creatable";
import { NewNoteProps } from "./NewNote";
import { Tag } from "../../types";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";

const NoteForm = ({
  onSubmit,
  addTag,
  availableTags,
  tags = [],
  title = "",
  markdown = "",
}: NewNoteProps) => {
  const navigate = useNavigate();
  const titleRef = useRef<HTMLInputElement>(null);
  const markdownRef = useRef<HTMLTextAreaElement>(null);

  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: titleRef.current!.value,
      markdown: markdownRef.current!.value,
      tags: selectedTags,
    });
    navigate(-1);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={4}>
        {/* form */}
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Başlık</Form.Label>
              <Form.Control
                defaultValue={title}
                ref={titleRef}
                className="shadow"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Etiketler</Form.Label>
              <ReactSelect
                //select in sahip olacağı değerler
                value={selectedTags.map((tag) => ({
                  label: tag.label,
                  value: tag.id,
                }))}
                // yeni etiket işlemi
                onChange={(tags) =>
                  setSelectedTags(
                    tags!.map((tag) => ({
                      id: tag.value,
                      label: tag.label,
                    }))
                  )
                }
                onCreateOption={(label) => {
                  const newTag: Tag = { id: v4(), label: label };
                  addTag(newTag);
                  setSelectedTags((prev) => [...prev, newTag]);
                }}
                isMulti
                className="shadow"
              ></ReactSelect>
            </Form.Group>
          </Col>
        </Row>
        {/* text area */}
        <Form.Group>
          <Form.Label>İçerik</Form.Label>
          <Form.Control
            defaultValue={markdown}
            ref={markdownRef}
            required
            as={"textarea"}
            className="shadow"
          />
        </Form.Group>
        <Stack
          direction="horizontal"
          className="d-flex justify-content-end gap-2  "
        >
          <Button type="submit">Kaydet</Button>
          <Button onClick={() => navigate(-1)} variant="secondary">
            İptal
          </Button>
        </Stack>
      </Stack>
    </Form>
  );
};

export default NoteForm;
