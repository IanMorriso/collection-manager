export const searchCards = async (searchParams: any) => {
    const response = await fetch('http://localhost:3001/api/card/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(searchParams)
    });
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }
    
    return await response.json();
  };
  
  export const saveCardToCollection = async (cardData: any) => {
    const response = await fetch('http://localhost:3001/api/card/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cardData)
    });
    
    if (!response.ok) {
      throw new Error(`Save failed: ${response.status}`);
    }
    
    return await response.json();
  };