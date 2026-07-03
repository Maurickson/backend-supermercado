const jwt = require('jsonwebtoken');

// Este middleware é aplicado apenas nas rotas que exigem autenticação
// (ver userRoutes.js e productRoutes.js); rotas públicas simplesmente não o usam.
const mid = (req, res, next) => {
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
