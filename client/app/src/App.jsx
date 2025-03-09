import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState(0);
  const [newTitle, setNewTitle] = useState("");

  const fetchBooks = async () => {
    try {
       const res = await fetch("http://127.0.0.1:8000/api/books/")
        const data = await res.json(); 
        setBooks(data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchBooks();
  }, []);


  const addBook = async () => {
    const bookData = {
      title,
      release_year: releaseYear,
    };
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      const data = await response.json();
      setTitle("");
      setReleaseYear(0);
      setBooks((prev) => [...prev, data]);
    } catch (err) {
      console.error(err);
    }
  };

const updateTitle = async (pk, release_year) => {
  const bookData = {
    title: newTitle,
    release_year: release_year 
  };
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/books/${pk}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookData),
    });

    const data = await response.json();
    const newBooks = books.map((book) => {
      if (book.id === pk) {
        book.title = data.title;
      }
      return book;
    });
    setBooks(newBooks);

  } catch (err) {
    console.error(err);
  }
}

const deleteBook = async (pk) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/books/${pk}`, {
      method: "DELETE",
    }); }
    catch (err) {
      console.error(err);
    }
    const newBooks = books.filter((book) => book.id !== pk);
    setBooks(newBooks);
  }

  return (
    <>
      <h1> Book Website </h1>

      <div>
        <input 
        type="text" 
        placeholder="Book Title..."
        onChange={(e) => setTitle(e.target.value)}
         />
        <input
          onChange={(e) => setReleaseYear(e.target.value)}
          type="number"
          placeholder="Release Year..."
        />
        <button onClick={addBook}> Add Book </button>

        {books.map((book) => {
          return (
            <div key={book.id} style={{ margin: "10px", padding: "10px", display: "flex"}}>
              <p> Title:{book.title}</p>
              <p> Release Year:{book.release_year}</p>
              <input type="text" placeholder="Update Title..." onChange={(e) => setNewTitle(e.target.value)} />
              <button onClick={() => updateTitle(book.id, book.release_year)}>Change Title</button>
              <button onClick={() => deleteBook(book.id)}>Delete</button>
            </div>
          )
        })}
      </div>
    </>
  );
}

export default App;
