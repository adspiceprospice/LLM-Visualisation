// Utility function to load p5.js dynamically
let p5LoadPromise: Promise<any> | null = null;

export const loadP5 = (): Promise<any> => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Cannot load p5.js in server-side rendering'));
  }

  // If p5 is already loaded, return it
  if (window.p5) {
    console.log('p5.js already loaded, returning existing instance');
    return Promise.resolve(window.p5);
  }

  // If we're already loading p5, return the existing promise
  if (p5LoadPromise) {
    console.log('p5.js loading in progress, returning existing promise');
    return p5LoadPromise;
  }

  // Create a new promise to load p5
  p5LoadPromise = new Promise((resolve, reject) => {
    console.log('Starting dynamic p5.js load');
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js';
    script.async = true;
    
    script.onload = () => {
      console.log('p5.js loaded dynamically');
      resolve(window.p5);
    };
    
    script.onerror = () => {
      console.error('Failed to load p5.js dynamically');
      p5LoadPromise = null; // Reset so we can try again
      reject(new Error('Failed to load p5.js'));
    };
    
    document.head.appendChild(script);
  });
  
  return p5LoadPromise;
};

// Check if p5 is available
export const isP5Available = (): boolean => {
  const available = typeof window !== 'undefined' && 'p5' in window;
  console.log("p5 availability check:", available, typeof window !== 'undefined' ? 'window exists' : 'no window');
  return available;
}; 