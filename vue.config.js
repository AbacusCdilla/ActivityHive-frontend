module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/ActivityHive-frontend/' // <-- Yeh repo ka name hai, isko sahi likho!
    : '/'
};
