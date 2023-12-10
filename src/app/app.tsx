import { Fetch } from "components/atoms/fetch/fetch";
import { Book, BookList } from "components/organisms/book-list";
import { MouseEvent, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import * as Realm from "realm-web";

// Add your App ID
const app = new Realm.App({ id: "final-project-mquxc" });

interface SearchResponse {
  docs: Book[];
  numFound: number;
}
// Create a component that displays the given user's details
const UserDetail = ({ user }: { user: Realm.User }) => {
  window.console.log("User", user);

  return (
    <div>
      <p>Logged in with user id: {user.id}</p>
      <h2>First name: {user.profile.firstName}</h2>
      <h2>Last name: {user.profile.lastName}</h2>
    </div>
  );
};
// Create a component that lets an anonymous user log in
interface LoginProps {
  setUser: (user: Realm.User) => void;
}

const Login = ({ setUser }: LoginProps) => {
  const loginGoogle = async () => {
    const user: Realm.User = await app.logIn(
      Realm.Credentials.google({
        redirectUrl: "http://localhost:8000/auth.html",
      })
    );
    setUser(user);
  };
  return (
    <button
      onClick={loginGoogle}
      className="px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-black-700 dark:text-black-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-blue-600 dark:hover:text-blue-600 hover:shadow transition duration-150"
    >
      <img
        className="w-6 h-6"
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        loading="lazy"
        alt="google logo"
      ></img>
      <span>Login with Google</span>
    </button>
  );
};

interface LogOutProps {
  user: Realm.User;
  setUser: (user: Realm.User | null) => void;
}

const LogOut = ({ user, setUser }: LogOutProps) => {
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (user !== null && app.currentUser) {
      app.currentUser.logOut();
      setUser(null);
    }
  };
  return (
    <a
      onClick={handleClick}
      className="relative inline-block text-lg group cursor-pointer"
    >
      <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
        <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
        <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
        <span className="relative">Log Out</span>
      </span>
      <span
        className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
        data-rounded="rounded-lg"
      ></span>
    </a>
  );
};

const BookSearchSchema = Yup.object().shape({
  bookName: Yup.string()
    .min(5, "Please enter at least 5 characters")
    .max(50, "Please enter less than 50 characters")
    .required("This field is required"),
});
function App() {
  const [searchUri, setSearchUri] = useState<string | null>(null);
  const [user, setUser] = useState<Realm.User | null>(app.currentUser);
  const handleSubmit = async (values: { bookName: string }) => {
    const encodedBookName = encodeURIComponent(values.bookName);
    const searchUrl = `https://openlibrary.org/search.json?q=${encodedBookName}`;
    setSearchUri(searchUrl);
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-start gap-4 mt-2 text-center items-center">
      <div className="App-header">
        {user ? <UserDetail user={user} /> : <Login setUser={setUser} />}
      </div>
      <div className="flex">
        {user ? <LogOut setUser={setUser} user={user} /> : <></>}
      </div>
      <div className="flex">
        <Formik
          initialValues={{ bookName: "The Alchemist" }}
          validationSchema={BookSearchSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="flex flex-col items-center">
              <Field
                type="text"
                name="bookName"
                className="bg-gray-50 border border-gray-300 text-black-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-1"
                placeholder="Book Name"
                required
              />
              {errors.bookName && touched.bookName ? (
                <div className="text-red-500 text-xs font-semibold">
                  {errors.bookName}
                </div>
              ) : null}
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-4"
              >
                Search Books
              </button>
            </Form>
          )}
        </Formik>
      </div>
      <div className="flex flex-col justify-center item-center">
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <Fetch<SearchResponse>
            uri={searchUri}
            renderData={(data) => (
              <div className="flex flex-col justify-center">
                <div className="text-slate-500 mg-20">
                  Found {data.numFound} books
                </div>
                <BookList books={data.docs} />
              </div>
            )}
          ></Fetch>
        </ErrorBoundary>
        <div className="flex w-full justify-center">
          <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <Outlet />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

export default App;
