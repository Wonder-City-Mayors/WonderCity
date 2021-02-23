module.exports = () => {
  return Promise.resolve().then(function bootstrap() {
    console.log("Bootstrap done!");
  });
};