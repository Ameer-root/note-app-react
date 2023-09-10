import React, { useState, useEffect } from 'react';
import './App.css';
import './components/Preview/index.js';
import Preview from './components/Preview';
import Message from './components/Preview/Message';
import NotesContainer from './components/Notes/NotesContainer';
import NotesList from './components/Notes/NotesList';
import Note from './components/Notes/Note';
import NoteForm from './components/Notes/NoteForm';
import Alert from './components/Alert';
function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [validate, setValidate] = useState([]);


  useEffect(() => {
    if (localStorage.getItem('notes')) {
      setNotes(JSON.parse(localStorage.getItem('notes')));
    } else {
      localStorage.setItem('notes', JSON.stringify([]));
    }
  }, [])

  useEffect(() => {
    if (validate.length !== 0) {
      setTimeout(() => {
        setValidate([]);
      }, 3000)
    }
  }, [validate])

  const validation = () => {
    const validate = [];
    let passed = true;
    if (!title) {
      validate.push("الرجاء إدخال ملاحظة");
      passed = false;
    }
    if (!content) {
      validate.push("الرجاء إدخال محتوى الملاحظة");
      passed = false
    }
    setValidate(validate);
    return passed;
  }


  const saveToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  }

  //change note title
  const changeTitleHandler = (event) => {
    setTitle(event.target.value);
  }
  //change note content
  const changeContentHandler = (event) => {
    setContent(event.target.value);
  }
  //save note
  const saveNoteHandler = () => {
    if (!validation()) return;
    const note = {
      id: new Date(),
      title: title,
      content: content
    }

    //select note
    const updatedNotes = [...notes, note];
    saveToLocalStorage('notes', updatedNotes);
    setNotes(updatedNotes);
    setCreating(false);
    setSelectedNote(note.id);
    setTitle('');
    setContent('');
  }
  //choose a note

  const selectNoteHandler = noteId => {
    setSelectedNote(noteId);
    setCreating(false);
    setEditing(false);
  }

  //go to edit mode
  const editNoteHandler = () => {
    const note = notes.find(note => note.id === selectedNote);
    setEditing(true);
    setTitle(note.title);
    setContent(note.content);
  }

  //Editing Note
  const updateNoteHandler = () => {
    if (!validation()) return;
    const updatedNotes = [...notes];
    const noteIndex = notes.findIndex(note => note.id === selectedNote);
    updatedNotes[noteIndex] = {
      id: selectedNote,
      title: title,
      content: content
    };
    saveToLocalStorage('notes', updatedNotes);
    setNotes(updatedNotes);
    setEditing(false);
    setTitle('');
    setContent('');
  }

  //go to create note mode
  const addNoteHandler = () => {
    setCreating(true);
    setEditing(false);
    setTitle('');
    setContent('');
  }

  //delete note
  const deleteNoteHandler = () => {
    const updatedNotes = [...notes];
    const noteIndex = updatedNotes.findIndex(note => note.id === selectedNote);
    updatedNotes.splice(noteIndex, 1);
    saveToLocalStorage('notes', updatedNotes);
    setNotes(updatedNotes);
    setSelectedNote(null);
  }
  const getAddNote = () => {
    return (
      <NoteForm
        formtitle="ملاحظة جديدة"
        title={title}
        content={content}
        titleChanged={changeTitleHandler}
        contentChanged={changeContentHandler}
        submitText="حفظ"
        submitClicked={saveNoteHandler}
      />
    );
  };


  const getPreview = () => {
    if (notes.length === 0) {
      return <Message title="لا يوجد ملاحظة" />
    }
    if (!selectedNote) {
      return <Message title="الرجاء اختيار ملاحظة" />
    }

    const note = notes.find(note => {
      return note.id === selectedNote;
    })

    let noteDisplay = (
      <div>
        <h2>{note.title}</h2>
        <p>{note.content}</p>
      </div>
    )

    if (editing) {
      noteDisplay = (
        <NoteForm
          formtitle="تعديل ملاحظة"
          title={title}
          content={content}
          titleChanged={changeTitleHandler}
          contentChanged={changeContentHandler}
          submitText="تعديل"
          submitClicked={updateNoteHandler}
        />
      );
    }
    return (
      <div>
        {!editing &&
          <div className="note-operations">
            <a href="#" onClick={editNoteHandler}>
              <i className="fa fa-pencil-alt" />
            </a>
            <a href="#">
              <i className="fa fa-trash" onClick={deleteNoteHandler} />
            </a>
          </div>
        }

        {noteDisplay}
      </div>
    );
  };



  return (
    <div className="App">

      <NotesContainer>
        <NotesList>
          {notes.map(note =>
            <Note
              key={note.id}
              title={note.title}
              noteClicked={() => selectNoteHandler(note.id)}
              active={note.id === selectedNote}
            />)}
        </NotesList>
        <button className="add-btn" onClick={addNoteHandler}>+</button>

      </NotesContainer>
      <Preview>
        {creating ? getAddNote() : getPreview()}
      </Preview>
      {validate.length !== 0 && <Alert validationMessages={validate} />}
    </div >
  );
}

export default App;
