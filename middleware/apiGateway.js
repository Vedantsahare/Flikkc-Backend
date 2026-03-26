export const apiGateway = (req, res, next) => {

  req.requestId =
    Date.now() +
    "-" +
    Math.random().toString(36);

  console.log(
    "API",
    req.method,
    req.originalUrl,
    req.requestId
  );

  next();

};