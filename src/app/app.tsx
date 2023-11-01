import { ChangeEvent, MouseEvent, useState } from "react";
import { FixedSizeList, ListChildComponentProps } from "react-window";

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [bookName, setBookName] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [booksCount, setBooksCount] = useState(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBookName(e.target.value);
  };

  const handleClick = async (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setLoading(true);
    setHasResult(false);
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${bookName}`
    );
    const data = await response.json();
    window.console.log(data);
    setLoading(false);
    setBooksCount(data.numFound);
    setBooks(data.docs);
    setHasResult(true);
  };

  interface Book {
    title: string;
    cover_i: number;
  }

  const renderBookRow = ({
    index,
    style,
    data,
  }: ListChildComponentProps<Book[]>) => {
    const className = `flex justify-start items-center px-4 ${
      index % 2 ? "bg-gray-50" : "bg-white"
    }`;
    const title = data[index].title;
    const coverImageSrc = `https://covers.openlibrary.org/b/id/${data[index].cover_i}-S.jpg`;
    return (
      <div className={className} style={style}>
        <div className="h-full w-[35px]">
          <img src={coverImageSrc} alt={title} className="h-full" />
        </div>
        <div className="pl-2">{title}</div>
      </div>
    );
  };

  const BookList = () => (
    <FixedSizeList
      className="border border-slate-300"
      height={250}
      itemCount={books.length}
      itemSize={35}
      width={300}
      itemData={books}
    >
      {/* 
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore */}
      {renderBookRow}
    </FixedSizeList>
  );

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-start gap-4 mt-20 text-center">
      <div>
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Book Name"
          required
          value={bookName}
          onChange={handleInputChange}
        />
      </div>
      <button
        type="button"
        onClick={handleClick}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Search Books
      </button>
      {loading ? <div>Loading ...</div> : ""}
      {hasResult ? <div>Found {booksCount} books</div> : ""}
      <BookList />
    </div>
  );
}

export default App;
