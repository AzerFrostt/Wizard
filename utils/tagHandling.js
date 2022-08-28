const regex = /^[0289PYLQGRJCUV]{3,14}$/m;

const parseTag = (tag) => {
  return tag.toUpperCase().replace(/#/g, '').replace(/O/g, '0');
};

const isTagValid = (tag) => {
  const result = regex.test(tag);
  return result;
};

module.exports = {
  parseTag,
  isTagValid,
};
