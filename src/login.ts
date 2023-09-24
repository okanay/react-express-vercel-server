import express from "express";
import { verify, sign } from "jsonwebtoken";
import jwtDecode from "jwt-decode";
import {
  TUser,
  TDecodedAuthUser,
  TLoginResponse,
  TAuthUser,
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
    firstName: "Okan",
    lastName: "Ay",
    image: "http:localhost:3000",
  },
};

function signedUser(user: TUser): { token: string; authUser: TAuthUser } {
  const { hashPassword, profile, ...authUserBody } = user;
  const { id, ...authProfile } = profile!;

  const authUser: TAuthUser = {
    user: authUserBody,
    profile: authProfile,
  };

  const token = sign({ user: authUser }, jwtKey, {
    expiresIn: "1d",
    algorithm: "HS512",
    audience: "wokanay",
    mutatePayload: true,
  });

  return { token, authUser: authUser };
}

router.get("/", async (req, res) => {
  let token: string | undefined = req.headers["authorization"];
  if (!token) return res.status(401).send("Oturum açmanız gerekiyor");

  try {
    verify(token, jwtKey, (error) => {
      const decode: TDecodedAuthUser = jwtDecode(token as string);

      if (decode.user.user.accessToken === user.accessToken) {
        const { token, authUser } = signedUser(user);
        const loginResponse: TLoginResponse = {
          user: authUser,
          token: token,
        };

        return res
          .status(200)
          .send({ token: loginResponse.token, user: loginResponse.user });
      } else {
        return res
          .status(401)
          .send("Oturumunuz süresi dolmuş veya token geçersiz");
      }
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

  const { token, authUser } = signedUser(user);
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
