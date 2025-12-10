const jwt = require('jsonwebtoken');
const mid = (req, res, next) => {
  // Verifica se a rota tem autenticação liberada
  const noAuthRoutes = ['api/user/login', '/api/user'];
  // http://127.0.0.1:3001/api/user/login
  if (noAuthRoutes.includes(req.path) && req.method === 'POST') {
    return next();
  }

  // Verifica se o token foi enviado na requisição
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

module.exports = mid;
