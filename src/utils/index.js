/**
 * Utility functions
 */

/**
 * Create a page URL from page name
 * @param {string} pageName - Name of the page
 * @returns {string} URL path
 */
export function createPageUrl(pageName) {
  const routes = {
    Home: '/',
    Vehicles: '/vehicles',
    Finance: '/finance',
    AIChat: '/ai-chat',
    MyGarage: '/my-garage',
    FinancialLiteracy: '/financial-literacy',
  };
  
  return routes[pageName] || '/';
}

