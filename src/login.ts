import express from 'express';
import jsonwebtoken from 'jsonwebtoken';


const router = express.Router();
const jwtKey = process.env.JWT || 'no-key';

router.get('/', async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send('Oturum açmanız gerekiyor');
  }

  try {
    const decodedToken = jsonwebtoken.verify(token, jwtKey);
  } catch (err) {
    return res.status(401).send('Oturumunuz süresi dolmuş veya token geçersiz');
    // return res.status(401).send({ message: 'Oturumunuz süresi dolmuş veya token geçersiz', error: true });
  }

  res.status(200).send({ token });
});

router.post('/', async (req, res) => {
  const body = await req.body;

  const user = {
    id: 'randomUserId',
    password: '1234asd',
  };

  if (!user || user.password !== body.password) {
    return res.status(401).send('Kullanıcı adı veya şifre hatalı');
  }

  const token = jsonwebtoken.sign({ id: user.id }, jwtKey, { expiresIn: '1d' });
  return res.status(200).send({ token });
});

export default router;
