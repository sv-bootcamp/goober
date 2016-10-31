// import AuthToken from './../auth-token';
//
// export default {
//   signup: (req, res, next) => {
//
//     next();
//   },
//   signin: (req, res, next) => {
//
//   },
//   getAccessToken: (req, res, next) => {
//
//   },
//   authenticate: (req, res, next) => {
//
//     const authHeader = req.header.Authorization.splice(' ');
//
//     if(authHeader[0] !== 'Bearer') return next(new Error());
//
//
//     AuthToken.decode(authHeader[1])
//       .then((payload) => {
//         req.userId = payload.userId;
//         next();
//       })
//       .catch()
//   }
// };
