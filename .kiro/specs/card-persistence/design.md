# Design Document

## Overview

This feature extends the existing Collection Manager application to allow users to select and save cards to their personal MongoDB collection. The design leverages the existing card search functionality and adds selection state management, batch save operations, and duplicate prevention.

The solution integrates with the current React frontend (using Material-UI) and Express/MongoDB backend, adding minimal complexity while providing robust card persistence functionality.

## Architecture

### Frontend Architecture
- **Selection State Management**: Add selection state to the existing CardGrid and CardItem components
- **Save Action Interface**: New save button and confirmation/error messaging components
- **API Integration**: Extend existing fetch patterns to include save operations

### Backend Architecture
- **New Model**: SavedCard model separate from CardData to track user collections
- **Enhanced Service Layer**: Add collection management methods to cardService
- **Extended Controller**: Add endpoints for saving and managing user collections
- **Duplicate Prevention**: Database-level uniqueness constraints and application-level validation

## Components and Interfaces

### Frontend Components

#### Enhanced CardItem Component
```typescript
interface CardItemProps {
  card: any;
  isSelected: boolean;
  onSelectionChange: (cardId: string, selected: boolean) => void;
}
```
- Add checkbox/selection indicator
- Handle selection state changes
- Maintain existing card display functionality

#### Enhanced CardGrid Component
```typescript
interface CardGridProps {
  cards: any[];
  selectedCards: Set<string>;
  onSelectionChange: (cardId: string, selected: boolean) => void;
}
```
- Pass selection state to CardItem components
- Manage bulk selection operations

#### New SaveCardButton Component
```typescript
interface SaveCardButtonProps {
  selectedCards: any[];
  onSaveComplete: (results: SaveResult) => void;
  disabled: boolean;
}
```
- Trigger save operations for selected cards
- Display loading state during save
- Handle save results and errors

#### New SaveStatus Component
```typescript
interface SaveStatusProps {
  results: SaveResult | null;
  onDismiss: () => void;
}
```
- Display save confirmation messages
- Show duplicate card notifications
- Display error messages with details

### Backend Models

#### SavedCard Model
```typescript
interface ISavedCard extends Document {
  userId: string; // For future user authentication
  cardId: string; // Unique identifier for the card
  name: string;
  setCode: string;
  type: string;
  text: string;
  prices: Array<{
    provider: string;
    date: Date;
    cardType: string;
    listType: string;
    price: number;
  }>;
  savedAt: Date;
  originalData: any; // Store complete original card data
}
```

### API Interfaces

#### Save Cards Endpoint
```typescript
POST /api/cards/save
{
  cards: Array<{
    cardId: string;
    name: string;
    setCode: string;
    type: string;
    text: string;
    prices: any[];
  }>;
}

Response: {
  success: boolean;
  saved: number;
  duplicates: Array<{cardId: string, name: string}>;
  errors: Array<{cardId: string, error: string}>;
}
```

## Data Models

### Card Identification Strategy
Cards will be identified using a composite key of `name + setCode` to ensure uniqueness while allowing the same card from different sets.

### Database Schema

#### SavedCard Collection
```javascript
{
  _id: ObjectId,
  userId: String, // Default to 'default' for now
  cardId: String, // Generated from name + setCode
  name: String,
  setCode: String,
  type: String,
  text: String,
  prices: [{
    provider: String,
    date: Date,
    cardType: String,
    listType: String,
    price: Number
  }],
  savedAt: Date,
  originalData: Mixed // Complete original card object
}
```

#### Indexes
- Compound unique index on `userId + cardId` for duplicate prevention
- Index on `userId` for efficient user collection queries
- Index on `savedAt` for chronological sorting

## Error Handling

### Frontend Error Handling
- **Network Errors**: Display user-friendly connection error messages
- **Validation Errors**: Show specific field validation issues
- **Partial Save Failures**: Clearly indicate which cards saved successfully and which failed

### Backend Error Handling
- **Database Connection**: Graceful handling with appropriate HTTP status codes
- **Validation Failures**: Detailed error messages for invalid card data
- **Duplicate Detection**: Non-error response indicating duplicates found
- **Partial Batch Failures**: Continue processing remaining cards when individual saves fail

### Error Response Format
```typescript
{
  success: boolean;
  message: string;
  details?: {
    saved: Array<{cardId: string, name: string}>;
    duplicates: Array<{cardId: string, name: string}>;
    errors: Array<{cardId: string, error: string}>;
  }
}
```

## Testing Strategy

### Unit Tests
- **Frontend**: Component selection state management, save button behavior
- **Backend**: SavedCard model validation, duplicate detection logic, save service methods

### Integration Tests
- **API Endpoints**: Full request/response cycle for save operations
- **Database Operations**: Save, duplicate detection, and error scenarios

### End-to-End Tests
- **User Workflow**: Complete flow from card search → selection → save → confirmation
- **Error Scenarios**: Network failures, database errors, validation failures

### Test Data Strategy
- Use test database with known card data
- Mock external API responses for consistent testing
- Test with various card data formats and edge cases