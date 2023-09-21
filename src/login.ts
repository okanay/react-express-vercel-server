import express from 'express';
import jsonwebtoken, { JwtPayload, verify } from "jsonwebtoken";


const router = express.Router();
const jwtKey = process.env.JWT || 'no-key';


router.get('/', async (req, res) => {
  let token = req.headers.authorization;
  let decode;

  if (!token) return res.status(401).send('Oturum açmanız gerekiyor');

  try
  {
    decode = verify(token, jwtKey)
  }
  catch (err)
  {
    return res.status(401).send('Oturumunuz süresi dolmuş veya token geçersiz');
  }

  res.status(200).send({
    data: {
      decode,
      token
    },
  });
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
