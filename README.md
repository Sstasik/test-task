# Documentation and Instructions for Launch

## Application Launch
### Option 1: CodeSandbox
The application is available on the CodeSandbox platform at the following link:
https://codesandbox.io/p/sandbox/reaktivate-tdd-challenge-1-sample-begin-forked-yq6w7f

To run and work with the code:
1. Open the link in your browser
2. The code will automatically run and you'll see the result in the right side of the screen
3. To run tests, you can use the CodeSandbox terminal and run the command `npm test`

### Option 2: Local Launch from GitHub Repository
The application can also be launched locally by cloning the GitHub repository:
1. Clone the repository 
2. Open the terminal and navigate to the cloned repository directory
3. Run the command `npm install` to install dependencies
4. Launch the application with the command `npm start`
5. The application will be available at http://localhost:3000 in your browser
6. To run tests, use the command `npm test`

## Project Structure
```
src/
├── Books/
│ ├── controllers/
│ │ ├── __tests__/
│ │ │ └── BooksController.test.js
│ │ └── BooksController.js
│ ├── models/
│ │ └── Book.js
│ ├── services/
│ │ ├── __tests__/
│ │ │ └── BooksService.test.js
│ │ └── BooksService.js
│ ├── stores/
│ │ ├── __tests__/
│ │ │ └── BooksStore.test.js
│ │ └── BooksStore.js
│ └── views/
│ ├── BooksList.js
│ ├── BookForm.js
│ └── Header.js
├── Shared/
│ ├── ApiGateway.js
│ └── config.js
├── App.js
├── index.js
└── styles.css
```

## Architecture and Component Interaction
The application is built on the MVP (Model-View-Presenter) principle, which allows separating logic from presentation and simplifies testing.

Main architecture components:

### 1. Model
- **Book.js** - Defines the book data structure

### 2. View (Presentation)
- **BooksList.js** - Displays the list of books and the toggle between public and private books
- **BookForm.js** - Form for adding new books
- **Header.js** - Application header with private books counter

### 3. Controller
- **BooksController.js** - Coordinates interaction between the presentation and data storage

### 4. Store
- **BooksStore.js** - Stores the application state and provides reactivity using MobX

### 5. Service
- **BooksService.js** - Responsible for communication with the server via API Gateway

### 6. Shared Components
- **ApiGateway.js** - Provides HTTP requests to the server
- **config.js** - Contains application configuration (base URL for API)

## Data Flow and Component Interaction Logic:

### 1. Application Initialization:
- The App.js component creates an instance of BooksController
- When the component mounts, `controller.init()` is called, which loads the initial data

### 2. Book Display:
- The BooksList.js component gets the book list via `controller.getBooks()`
- The controller delegates this request to `BooksStore.getDisplayedBooks()`
- Either all books or only private books are displayed, depending on the `showPrivateBooks` state

### 3. Adding a New Book:
- The user fills out the form in BookForm.js
- When submitting the form, `controller.addBook(name, author)` is called
- The controller creates a new Book instance and passes it to `BooksStore.addBook()`
- The store calls `BooksService.addBook()` or `BooksService.addPrivateBook()` depending on the current mode
- The service sends data to the API through `ApiGateway.post()`
- After successful addition, the book is added to the appropriate array in the store

### 4. Switching Between Book Types:
- The user clicks on the "All Books" or "Private Books" buttons
- `controller.setShowPrivateBooks(isPrivate)` is called
- This updates the `showPrivateBooks` state in the store
- Thanks to MobX, the BooksList.js component automatically re-renders with the new list of books

### 5. Displaying the Counter in the Header:
- The Header.js component gets the number of private books via `controller.getPrivateBooksCount()`
- The controller delegates this request to `BooksStore.getPrivateBooksCount()`

## Technologies Used
- **React** - for building the user interface
- **MobX** - for state management and reactivity
- **mobx-react** - for integrating MobX with React components
- **Jest** - for unit testing

## Testing
Each layer of the architecture is covered by tests:
- **Controller**: tests verify the correctness of delegation of calls to Store
- **Store**: tests verify the logic of data and state management
- **Service**: tests verify the correctness of data transformation and API interaction

To run tests, use the command `npm test` in the CodeSandbox terminal or in your local terminal after installing the dependencies.
