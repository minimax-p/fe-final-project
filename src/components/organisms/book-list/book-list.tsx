import { FixedSizeList, ListChildComponentProps } from "react-window";

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

interface BookListProps {
  books: Book[] | undefined;
}

const BookList = ({ books }: BookListProps) =>
  books ? (
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
  ) : (
    <></>
  );

export { type Book, type BookListProps, BookList };
