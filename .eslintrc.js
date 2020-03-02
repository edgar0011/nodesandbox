module.exports = {
  extends: [
    './base.js',
    './base-typescript.js',
  ],
  // get rid off flow then uncomment
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx", ".json"]
      }
    }
  }
};
