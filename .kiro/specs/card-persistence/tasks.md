# Implementation Plan

- [x] 1. Create SavedCard model and database schema






  - Create SavedCard TypeScript interface and Mongoose schema
  - Add compound unique index for userId + cardId duplicate prevention
  - Add helper method to generate cardId from name + setCode
  - Write unit tests for model validation and cardId generation
  - _Requirements: 4.1, 4.2, 4.3, 3.1, 3.2_

- [ ] 2. Implement backend save service methods
  - Add saveSelectedCards method to cardService with batch processing
  - Implement duplicate detection logic using existing database queries
  - Add error handling for database connection and validation failures
  - Write unit tests for save service methods and duplicate detection
  - _Requirements: 2.2, 3.1, 3.2, 5.2, 5.3_

- [ ] 3. Create save cards API endpoint
  - Add POST /api/cards/save endpoint to cardController
  - Implement request validation for card data completeness
  - Return structured response with saved/duplicate/error counts
  - Add error handling with appropriate HTTP status codes
  - Write integration tests for the save endpoint
  - _Requirements: 2.2, 2.3, 2.4, 4.4, 5.1, 5.2_

- [ ] 4. Add card selection state to frontend components
  - Modify CardItem component to include selection checkbox and visual indicators
  - Update CardGrid component to manage selection state for multiple cards
  - Add selection change handlers and state management
  - Write unit tests for selection state management
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 5. Create save functionality UI components
  - Create SaveCardButton component with loading states and disabled logic
  - Create SaveStatus component for displaying save results and error messages
  - Add confirmation messages for successful saves and duplicate notifications
  - Write unit tests for save UI components
  - _Requirements: 2.1, 2.3, 2.4, 3.3, 5.1_

- [ ] 6. Integrate save functionality into main App component
  - Add selected cards state management to App.tsx
  - Connect save button to API endpoint with proper error handling
  - Implement save result handling and user feedback display
  - Add loading states during save operations
  - Write integration tests for complete save workflow
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 5.4_

- [ ] 7. Add comprehensive error handling and validation
  - Implement frontend validation for incomplete card data before save attempts
  - Add network error handling with user-friendly messages
  - Ensure application stability during database connection failures
  - Add logging for debugging save operation failures
  - Write tests for error scenarios and edge cases
  - _Requirements: 4.4, 5.1, 5.2, 5.3, 5.4_

- [ ] 8. Create end-to-end tests for complete user workflow
  - Write tests covering search → select → save → confirmation flow
  - Test duplicate card handling from user perspective
  - Test error scenarios including network failures and invalid data
  - Verify proper state management throughout the workflow
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3_