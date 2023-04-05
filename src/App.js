import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import randomColor from 'randomcolor';
import Draggable from 'react-draggable';
import './App.css';

function App() {

  // States are:
  // For using ToDoNotes:
  const [item, setItem] = useState('');
  const [items, setItems] = useState(
    JSON.parse(localStorage.getItem('items')) || []
  );

  // For editing of notes:
  const [editMode, setEditMode] = useState(false);
  const [editItemObject, setEditItemObject] = useState(Object);

  // For searching:
  const [searchingMode, setSearchingMode] = useState(false);
  const [searchedRequest, setSearchedRequest] = useState('');
  const [searchedItems, setSearchedItems] = useState([]);

  // Hooks are:
  useEffect(() => {localStorage.setItem('items', JSON.stringify(items))
}, [items]);

  // Functions are:
  // For using ToDoNotes:
  function newItem() {
    if (item.trim() !== '' && item !== null) {
      const newItem = {
        id: nanoid(),
        item: item,
        color: randomColor({
          luminosity: 'light'
        }),
        defaultPosition: {
          x: 600,
          y: -700
        }
      }
      setItems((items) => [...items, newItem]);
      setItem('');
    } else {
      alert('Hey! Enter something for saving note!');
      setItem('');
    }
  }

  function updatePosition(data, index) {
    let newArray = [...items];
    newArray[index].defaultPosition = { x: data.x, y: data.y };
    setItems(newArray);
  }

  function updatePositionWhileSearch(data, index) {
    let newArray1 = [...searchedItems];
    newArray1[index].defaultPosition = { x: data.x, y: data.y };
    setSearchedItems(newArray1);
  }

  function keyPress(event) {
    if (event.which === 13) newItem();
  }

  function deleteNote(id) {
    setItems(items.filter((o) => o.id !== id));
    setSearchedItems(searchedItems.filter((o) => o.id !== id));
  }

  // For editing of notes:
  function editNote(id) {
    setEditMode(true);
    if (item !== null && searchedRequest !== null) {
      setEditItemObject(items.find((o) => o.id === id));
      setItem((items.find((o) => o.id === id)).item);
      if (searchingMode === true) {
        setEditItemObject(searchedItems.find((o) => o.id === id));
      }
    }
  }

  function closeEditing() {
    setItem('');
    setEditMode(false);
  }

  function saveEditing(id) {
    if (editItemObject.item.trim() !== '' && editItemObject !== null) {
      deleteNote(id);
      console.log(editItemObject);
      const editedItem = {
        id: id,
        item: item,
        color: editItemObject.color,
        defaultPosition: editItemObject.defaultPosition
      }
      setItems((items) => [...items, editedItem]);
      setSearchedItems((searchedItems) => [...searchedItems, editedItem]);
      setItem('');
      setEditMode(false);
    }
  }

  // For searching of tags/text:
  function searching(value) {
    setSearchedRequest(value);
    setSearchedItems([...items].filter(item => {
      return item.item.toLowerCase().includes(value.toLowerCase())
    }));
    if (value.trim() === '') {
      setSearchedItems([]);
      setSearchingMode(false);
    }
    else setSearchingMode(true);
  }

  // For hightlight while searching tags/text:
  function light(fullText, needToLight) {
    const needToLightWithOutReg = new RegExp(needToLight, 'ig');
    const matchingInFullText = fullText.match(needToLightWithOutReg);
    return (
      fullText.split(needToLightWithOutReg).map((str, index, array) => {
        if (index < array.length - 1) {
          const result = matchingInFullText.shift();
          return (<>{str}<span className='lightText'>{result}</span></>)
        }
        return str;
      })
    );
  }

  // Renders:
  // This code is rendered, if note is edited
  if (editMode === true && editItemObject !== null) {
    return (
      <div className='App'>
        <div className='divForSearch'>
          <img src="/images/search-icon.png" alt="search" title="search" />
          <input
            className="inputForSearch"
            value={searchedRequest}
            type="text"
            placeholder='Find me!'
            onChange={(event) => {
              searching(event.target.value);
            }}
          />
        </div>
        <div className='wrapper'>
        </div>
        {
          <div>
            <Draggable
              defaultPosition={editItemObject.defaultPosition}
            >
              <div className='ToDoNote' style={{ backgroundColor: editItemObject.color }}>
                <textarea
                  className="editArea" style={{ backgroundColor: editItemObject.color }}
                  defaultValue={item}
                  onChange={(event) => setItem(event.target.value)}
                >
                </textarea>
                <button
                  className='closeEditing'
                  onClick={() => closeEditing()}
                >
                  <img src="/images/cancel-editing.png" alt="close" title="Close without saving changes" />
                </button>
                <button
                  className='saveEditing'
                  onClick={() => saveEditing(editItemObject.id)}
                >
                  <img src="/images/save-editing.png" alt="save" title="Save changes" />
                </button>
              </div>
            </Draggable>
          </div>
        }
      </div>
    )
  }
  // This code is rendered, if text is searched
  else if (searchingMode === true && searchedRequest !== null) {
    return (
      <div className='App'>
        <div className='divForSearch'>
          <img src="/images/search-icon.png" alt="search" title="search" />
          <input
            className="inputForSearch"
            value={searchedRequest}
            type="text"
            placeholder='Find me!'
            onChange={(event) => {
              searching(event.target.value);
            }}
          />
        </div>
        <div className='wrapper'>
        </div>
        {
          searchedItems.map((item, index) => {
            return (
              <Draggable
                key={item.id}
                defaultPosition={item.defaultPosition}
                onStop={(_, data) => {
                  updatePositionWhileSearch(data, index)
                }}
              >
                <div className='ToDoNote' style={{ backgroundColor: item.color }}>
                  {light(item.item, searchedRequest)}
                  <button
                    className='deleteNote'
                    onClick={() => deleteNote(item.id)}
                  >
                    <img src="/images/delete-note.png" alt="delete" title="Delete note" />
                  </button>
                  <button
                    className='editNote'
                    onClick={() => editNote(item.id)}
                  >
                    <img src="/images/edit-note.png" alt="edit" title="Edit note" />
                  </button>
                </div>
              </Draggable>
            )
          })
        }
      </div>
    );
  }
  // This code is rendered in default case
  else return (
    <div className='App'>
      <div className='divForSearch'>
        <img src="/images/search-icon.png" alt="search" title="search" />
        <input
          className="inputForSearch"
          value={searchedRequest}
          type="text"
          placeholder='Find me!'
          onChange={(event) => {
            searching(event.target.value);
          }}
        />
      </div>
      <div className='wrapper'>
        <input
          className='inputForNote'
          value={item}
          type="text"
          placeholder='Enter your note here'
          onChange={(event) => setItem(event.target.value)}
          onKeyDown={(event) => keyPress(event)}
        />
        <button className='enterNote' onClick={newItem}>ENTER</button>
      </div>
      {
        items.map((item, index) => {
          return (
            <Draggable
              key={item.id}
              defaultPosition={item.defaultPosition}
              onStop={(_, data) => {
                updatePosition(data, index)
              }}
            >
              <div className='ToDoNote' style={{ backgroundColor: item.color }}>
                {`${item.item}`}
                <button
                  className='deleteNote'
                  onClick={() => deleteNote(item.id)}
                >
                  <img src="/images/delete-note.png" alt="delete" title="Delete note" />
                </button>
                <button
                  className='editNote'
                  onClick={() => editNote(item.id)}
                >
                  <img src="/images/edit-note.png" alt="edit" title="Edit note" />
                </button>
              </div>
            </Draggable>
          )
        })
      }
    </div>
  );
}

export default App;