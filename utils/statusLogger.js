const parseClashStatus = (code) => {
    switch(code){
        case 403:
          return "Invalid API auth - 403";

        case 404:
          return "Clan not found - 404";
        
        case 429:
          return "API throttled - 429";
        
        case 500:
          return "Unknown API error - 500";

        case 503:
          return "Game maintenance - 503";
      }
    return `Could not parse status - ${code}`
}

module.exports = {
    parseClashStatus
}