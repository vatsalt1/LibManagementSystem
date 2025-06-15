const initialState = {
  books: [],
  favourite: [],
  loading: false,
  error: false,
};

const booksReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_BOOKS":
      return {
        ...state,
        books: action.payload,
      };
    case "INITIAL_FAV_ADD":
      return {
        ...state,
        favourite: action.payload,
      };
    case "PROG_FAV_ADD":
      return {
        ...state,
        favourite: [...state.favourite, action.payload],
      };
    case "DELETE_FAV":
      return {
        ...state,
        favourite: state?.favourite?.filter((id) => id !== action.payload),
      };
        case "REMOVE_BOOK":
    return {
      ...state,
      books: state.books.filter(book => book._id !== action.payload),
    };

    case "UPDATE_BOOK":
    return {
      ...state,
      books: state.books.map(book =>
        book._id === action.payload._id ? action.payload : book
      ),
    };
    default:
      return state;
  }
};

export default booksReducer;
