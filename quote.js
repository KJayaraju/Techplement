document.addEventListener('DOMContentLoaded', () => {
  // Fetch and display a random quote
  fetch('http://localhost:5000/api/quotes/random')
    .then(response => response.json())
    .then(data => {
      document.getElementById('quote').innerText = `"${data.text}" - ${data.author}`;
    })
    .catch(error => console.error('Error fetching random quote:', error));

  // Search quotes by author
  const searchInput = document.getElementById('author-search');
  searchInput.addEventListener('input', () => {
    const author = searchInput.value;
    fetch(`http://localhost:5000/api/quotes/search?author=${encodeURIComponent(author)}`)
      .then(response => response.json())
      .then(data => {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';
        data.forEach(quote => {
          const quoteElement = document.createElement('p');
          quoteElement.classList.add('mb-2', 'p-2', 'bg-gray-50', 'rounded');
          quoteElement.innerText = `"${quote.text}" - ${quote.author}`;
          resultsDiv.appendChild(quoteElement);
        });
      })
      .catch(error => console.error('Error searching quotes:', error));
  });

  // Create a new quote
  const createButton = document.getElementById('create');
  const quoteInput = document.getElementById('quote-input');
  const authorInput = document.getElementById('author-input');

  function createQuote() {
    const text = quoteInput.value.trim();
    const author = authorInput.value.trim();

    if (!text || !author) {
      console.error('Both quote and author fields are required');
      const para = document.createElement('p');
      para.innerText = `Required`;
      document.getElementById('quote-input').appendChild(para);
     //return;
    }

    fetch('http://localhost:5000/api/quotes/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, author }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to create quote: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        document.getElementById('created-quote').innerText = `"Quote Created Successfully You can view by searching"`;
        console.log('Quote created successfully:', data);
        // Clear input fields after successful creation
        quoteInput.value = '';
        authorInput.value = '';
      })
      .catch(error => console.error('Error creating quote:', error));
  }

  createButton.addEventListener('click', createQuote);
});