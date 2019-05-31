module.exports = function (api) {
  api.cache(false)
  const env = process.env.BABEL_ENV || process.env.NODE_ENV || "development";
  const presets = [
    ["@babel/preset-env", {
        "useBuiltIns": "entry",
      },
    ], [
      "@babel/preset-react", {},
    ],
  ];
  const plugins = [
    "@babel/plugin-proposal-class-properties"
  ];
  return env === "development" ? {
    sourceMaps: false,
    presets,
    plugins,
  } : {
    minified: true,
    compact: true,
    presets,
    plugins,
  };
}
