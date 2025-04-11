# Books Library Application

## Quick Start

### Online
Open [this sandbox](https://codesandbox.io/p/sandbox/reaktivate-tdd-challenge-1-sample-begin-forked-yq6w7f)

### Local
```
git clone 
npm install
npm start
```

## Architecture

Project implements MVP (Model-View-Presenter) pattern:
- **View**: React functional components (BooksList, BookForm, Header)
- **Controller**: BooksController manages app logic
- **Store**: BooksStore handles state with MobX
- **Service**: BooksService communicates with API
- **Model**: Book represents data structure

## Testing

Run tests with:
```
npm test
```

All business logic is separated from views for better testability.

## Technologies
- React
- MobX
- Jest