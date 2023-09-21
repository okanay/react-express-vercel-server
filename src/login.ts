import express from "express";
import jsonwebtoken, { JwtPayload, verify } from "jsonwebtoken";
import jwtDecode from "jwt-decode";
import {
  TUser,
  TDecodedAuthUser,
  TLoginResponse,
  TAuthUserData,
} from "../types/auth-types";

const router = express.Router();
const jwtKey = process.env.JWT || "no-key";

const user: TUser = {
  accessToken: "1234access",
  accessTokenExpire: 1234,
  refreshToken: "1234refresh",
  refreshTokenExpire: 1234,
  hashPassword: "1234asd",
  profile: {
    id: "1234",
    email: "okanay@hotmail.com",
    username: "wokanay",
    name: "Okan",
    lastName: "Ay",
    image: "http:localhost:3000",
  },
};

router.get("/", async (req, res) => {
  let token: string | undefined = req.headers["authorization"];
  if (!token) return res.status(401).send("Oturum açmanız gerekiyor");

  try {
    verify(token, jwtKey, (error, decoded) => {
      const decode: TDecodedAuthUser = jwtDecode(token as string);

      const loginResponse: TLoginResponse = {
        user: decode.user,
        token: token as string,
      };

      return res
        .status(200)
        .send({ token: loginResponse.token, user: loginResponse.user });
    });
  } catch (err) {
    return res.status(401).send("Oturumunuz süresi dolmuş veya token geçersiz");
  }
});

router.post("/", async (req, res) => {
  const body = await req.body;

  if (!user || body.password !== user.hashPassword) {
    return res.status(401).send("Kullanıcı adı veya şifre hatalı");
  }

  const { hashPassword, ...authUser } = user;
  const token = jsonwebtoken.sign({ user: authUser }, jwtKey, {
    expiresIn: "1d",
  });

  const loginResponse: TLoginResponse = {
    user: authUser,
    token: token,
  };

  return res
    .status(200)
    .send({ token: loginResponse.token, user: loginResponse.user });
});

export default router;

// const lastLoginDeviceId = `${req.headers['user-agent']}-${req.headers['accept-language']}`;
// console.log(lastLoginDeviceId);
