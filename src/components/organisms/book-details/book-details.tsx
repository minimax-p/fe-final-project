import { LoaderFunction, useLoaderData } from "react-router-dom";
import { BookData } from ".";
import image from "../../../../public/no-image.png";

const bookLoader: LoaderFunction = async ({
  params,
}): Promise<{ book: BookData | null }> => {
  const fetchUri = `https://openlibrary.org/api/books?bibkeys=ISBN:${params.isbn}&jscmd=details&format=json`;
  const response = await fetch(fetchUri);
  if (!response.ok) {
    return { book: null };
  }
  const json = await response.json();
  const keys = Object.keys(json);
  const isbn = keys[0];
  const book = json[isbn];

  window.console.log("Book details", book);
  return { book };
};

const BookDetails = () => {
  const { book } = useLoaderData() as { book: BookData };
  if (book) {
    const coverId = book.details.covers ? book.details.covers[0] : null;
    let coverImageSrc = image;
    let author = "N/A";
    let publisher = "N/A";
    if (coverId) {
      coverImageSrc = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
    }
    if (book.details.authors) {
      author = book.details.authors[0].name;
    }
    if (book.details.publishers[0]) {
      publisher = book.details.publishers[0];
    }
    return (
      <div className="flex justify-center w-auto mt-10">
        <div className="h-40 shadow-2xl">
          <img
            src={coverImageSrc}
            alt={book.details.title}
            className="h-full w-full"
          />
        </div>
        <div className="flex flex-col text-left p-4 ml-4 border border-slate-300 border-2 rounded-md">
          <div className="font-serif text-xl text- black-500">
            {book.details.title}
          </div>
          <div>Publish date: {book.details.publish_date}</div>
          <div>Author: {author}</div>
          <div>Publisher: {publisher}</div>
        </div>
      </div>
    );
  }
  return <></>;
};

export { BookDetails, bookLoader };
