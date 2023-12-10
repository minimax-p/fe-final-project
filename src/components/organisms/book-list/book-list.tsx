import { FixedSizeList, ListChildComponentProps } from "react-window";
import { Book } from "../book-details";
import { Link } from "react-router-dom";
import image from "../../../../public/no-image.png";

const renderBookRow = ({
  index,
  style,
  data,
}: ListChildComponentProps<Book[]>) => {
  const className = `flex justify-start items-center px-4 ${
    index % 2 ? "bg-gray-50" : "bg-white"
  }`;
  const title = data[index].title;
  let isbn = null;
  if (data[index].isbn) {
    isbn = data[index].isbn[0];
  }
  const cover_i = data[index].cover_i;
  let coverImageSrc = image;
  if (cover_i) {
    coverImageSrc = `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`;
  }
  return (
    <div className={className} style={style}>
      <div className="w-24 flex justify-center item-center">
        <img
          className="ml-10 transition ease-in-out delay-50 h-32 shadow-md hover:shadow-2xl hover:scale-125"
          src={coverImageSrc}
          alt={title}
        />
      </div>
      <Link to={`books/${isbn}`} className="w-5/6">
        <div className="ml-10 pl-2 text-left text-xl font-serif">{title}</div>
        <div className="ml-10 pl-2 text-left text-base font-sans">
          ISBN: {isbn}
        </div>
      </Link>
    </div>
  );
};

interface BookListProps {
  books: Book[] | undefined;
}

const BookList = ({ books }: BookListProps) => {
  window.console.log("Book list", books);
  if (books) {
    return (
      <FixedSizeList
        className="border border-slate-300 rounded-md"
        height={400}
        itemCount={books.length}
        itemSize={160}
        width={700}
        itemData={books}
      >
        {/* 
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      @ts-ignore */}
        {renderBookRow}
      </FixedSizeList>
    );
  }
  return <></>;
};

export { type Book, type BookListProps, BookList };
