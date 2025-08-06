// postcss.config.js

module.exports = {
  plugins: {
    tailwindcss: {}, // ✅ DO NOT use @tailwindcss/postcss — this is correct
    autoprefixer: {},
  },
};

