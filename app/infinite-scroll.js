// app/infinite-scroll.js

document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch more content
    function fetchMoreContent() {
        // Simulate an API call to fetch more content
        return new Promise((resolve) => {
            setTimeout(() => {
                const newContent = document.createElement('div');
                newContent.classList.add('content-item');
                newContent.innerHTML = '<p>New content loaded...</p>';
                resolve(newContent);
            }, 1000);
        });
    }

    // Function to handle scroll event
    function handleScroll() {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;

        // Check if the user has scrolled to the bottom
        if (scrolled >= scrollableHeight) {
            // Load more content
            fetchMoreContent().then(newContent => {
                document.getElementById('content').appendChild(newContent);
            });
        }
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
});
```

### Explanation:

1. **Event Listener for DOMContentLoaded**: Ensures the script runs after the DOM is fully loaded.
2. **fetchMoreContent Function**: Simulates an API call to fetch more content. In a real-world scenario, this would be replaced with an actual API call.
3. **handleScroll Function**: Checks if the user has scrolled to the bottom of the page and fetches more content if true.
4. **Scroll Event Listener**: Adds an event listener to the window object to listen for scroll events and trigger the `handleScroll` function.

This script will be included in the HTML file and will handle the infinite scrolling logic by loading more content as the user scrolls down the page.

### Final Code:

```javascript
// app/infinite-scroll.js

document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch more content
    function fetchMoreContent() {
        // Simulate an API call to fetch more content
        return new Promise((resolve) => {
            setTimeout(() => {
                const newContent = document.createElement('div');
                newContent.classList.add('content-item');
                newContent.innerHTML = '<p>New content loaded...</p>';
                resolve(newContent);
            }, 1000);
        });
    }

    // Function to handle scroll event
    function handleScroll() {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;

        // Check if the user has scrolled to the bottom
        if (scrolled >= scrollableHeight) {
            // Load more content
            fetchMoreContent().then(newContent => {
                document.getElementById('content').appendChild(newContent);
            });
        }
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
});

