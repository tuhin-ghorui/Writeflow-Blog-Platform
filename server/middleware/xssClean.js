const cleanString = (val, isRichText = false) => {
  if (typeof val !== 'string') return val;

  if (isRichText) {
    // For blog content: strip dangerous tags and attributes but preserve rich formatting HTML tags
    return val
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '') // Strip script tags
      .replace(/<iframe[^>]*>([\s\S]*?)<\/iframe>/gi, '') // Strip iframe tags
      .replace(/<object[^>]*>([\s\S]*?)<\/object>/gi, '') // Strip object tags
      .replace(/<embed[^>]*>([\s\S]*?)<\/embed>/gi, '') // Strip embed tags
      .replace(/href="javascript:[^"]*"/gi, 'href="#"') // Strip javascript: links
      .replace(/src="javascript:[^"]*"/gi, 'src="#"')
      .replace(/on\w+\s*=\s*"[^"]*"/gi, '') // Strip inline event handlers like onclick
      .replace(/on\w+\s*=\s*'[^']*'/gi, '')
      .replace(/on\w+\s*=\s*[^\s>]+/gi, '');
  } else {
    // Standard text field: escape HTML tags
    return val
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
};

const cleanObject = (data, keyName = '') => {
  if (data === null || data === undefined) return data;

  if (typeof data === 'string') {
    const isRichText = keyName === 'content';
    return cleanString(data, isRichText);
  }

  if (Array.isArray(data)) {
    return data.map((item) => cleanObject(item, keyName));
  }

  if (typeof data === 'object') {
    const cleanData = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        cleanData[key] = cleanObject(data[key], key);
      }
    }
    return cleanData;
  }

  return data;
};

const xssClean = (req, res, next) => {
  if (req.body) req.body = cleanObject(req.body);
  if (req.query) req.query = cleanObject(req.query);
  if (req.params) req.params = cleanObject(req.params);
  next();
};

module.exports = xssClean;
