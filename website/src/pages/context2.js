


const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?";
const SET_LOADING = "SET_LOADING";
const SET_STORIES = "SET_STORIES";
const REMOVE_STORY = "REMOVE_STORY";
const HANDLE_PAGE = "HANDLE_PAGE";
const HANDLE_SEARCH = "HANDLE_SEARCH";
const initialState = {
  isLoading: true,
  hits: [],
  query: "react",
  page: 0,
  nbPages: 0
};

const reducer = (state, action) => {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, isLoading: true };

    case SET_STORIES:
      return {
        ...state,
        isLoading: false,
        hits: action.payload.hits,
        nbPages: action.payload.nbPages
      };

    case REMOVE_STORY:
      return {
        ...state,
        hits: state.hits.filter((story) => story.objectID !== action.payload)
      };

    case HANDLE_SEARCH:
      return { ...state, query: action.payload, page: 0 };

    case HANDLE_PAGE:
      if (action.payload === "inc") {
        let nextPage = state.page + 1;

        if (nextPage > state.nbPages - 1) {
          nextPage = 0;
        }

        return { ...state, page: nextPage };
      }

      if (action.payload === "dec") {
        let prevPage = state.page - 1;

        if (prevPage < 0) {
          prevPage = state.nbPages - 1;
        }

        return { ...state, page: prevPage };
      }

    default:
      throw new Error(`no matching "${action.type}" aciton type`);
  }
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const fetchStories = async (url) => {
    dispatch({
      type: SET_LOADING
    });

    try {
      const response = await fetch(url);
      const data = await response.json();
      dispatch({
        type: SET_STORIES,
        payload: {
          hits: data.hits,
          nbPages: data.nbPages
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const removeStory = (id) => {
    dispatch({
      type: REMOVE_STORY,
      payload: id
    });
  };

  const handleSearch = (query) => {
    dispatch({
      type: HANDLE_SEARCH,
      payload: query
    });
  };

  const handlePage = (value) => {
    dispatch({
      type: HANDLE_PAGE,
      payload: value
    });
  };

  React.useEffect(() => {
    fetchStories(`${API_ENDPOINT}query=${state.query}&page=${state.page}`);
  }, [state.query, state.page]);
  return /*#__PURE__*/ React.createElement(
    AppContext.Provider,
    {
      value: { ...state, removeStory, handleSearch, handlePage }
    },
    children
  );
};

const SearchForm = () => {
  const { query, handleSearch } = React.useContext(AppContext);
  return /*#__PURE__*/ React.createElement(
    "form",
    {
      className: "search-form",
      onSubmit: (e) => e.preventDefault()
    },
    /*#__PURE__*/ React.createElement("h2", null, "search hacker news"),
    /*#__PURE__*/ React.createElement("input", {
      type: "text",
      className: "form-input",
      value: query,
      onChange: (e) => handleSearch(e.target.value)
    })
  );
};

const Buttons = () => {
  const { isLoading, page, nbPages, handlePage } = React.useContext(AppContext);
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className: "btn-container"
    },
    /*#__PURE__*/ React.createElement(
      "button",
      {
        disabled: isLoading,
        onClick: () => handlePage("dec")
      },
      "prev"
    ),
    /*#__PURE__*/ React.createElement("p", null, page + 1, " of ", nbPages),
    /*#__PURE__*/ React.createElement(
      "button",
      {
        disabled: isLoading,
        onClick: () => handlePage("inc")
      },
      "next"
    )
  );
};

const Stories = () => {
  const { isLoading, hits, removeStory } = React.useContext(AppContext);

  if (isLoading) {
    return /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "loading"
      },
      "Loading..."
    );
  }

  return /*#__PURE__*/ React.createElement(
    "section",
    {
      className: "stories"
    },
    hits.map((story) => {
      const { objectID, author, num_comments, title, url, points } = story;
      return /*#__PURE__*/ React.createElement(
        "article",
        {
          key: objectID,
          className: "story"
        },
        /*#__PURE__*/ React.createElement(
          "h4",
          {
            class: "title"
          },
          title
        ),
        /*#__PURE__*/ React.createElement(
          "p",
          null,
          points,
          " points by ",
          /*#__PURE__*/ React.createElement("span", null, " ", author, " |"),
          " ",
          num_comments,
          " comments"
        ),
        /*#__PURE__*/ React.createElement(
          "a",
          {
            href: url,
            className: "read-link",
            target: "_blank",
            rel: "noopener noreferrer"
          },
          "read more"
        ),
        /*#__PURE__*/ React.createElement(
          "button",
          {
            className: "remove-btn",
            onClick: () => removeStory(objectID)
          },
          "remove"
        )
      );
    })
  );
};

const App = () => {
  return /*#__PURE__*/ React.createElement(
    React.Fragment,
    null,
    /*#__PURE__*/ React.createElement(SearchForm, null),
    /*#__PURE__*/ React.createElement(Buttons, null),
    /*#__PURE__*/ React.createElement(Stories, null)
  );
};

ReactDOM.render(
  /*#__PURE__*/ React.createElement(
    AppProvider,
    null,
    /*#__PURE__*/ React.createElement(App, null)
  ),
  document.getElementById("root")
);
