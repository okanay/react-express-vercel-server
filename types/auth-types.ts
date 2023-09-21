// auth user data

export type TUser = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpire: number;
  refreshTokenExpire: number;
  hashPassword: string;
  profile?: TUserProfile;
};

export type TUserProfile = {
  id: string;
  username: string;
  name: string;
  lastName: string;
  email: string;
  image: string;
};

export type TAuthUserData = Omit<TUser, "hashPassword">;

export type TDecodedAuthUser = {
  user: TAuthUserData;
} & TJwtUnionExpire;

export type TJwtUnionExpire = {
  iat: number;
  exp: number;
};

export type TLoginResponse = {
  token: string;
  user: TAuthUserData;
};

export type TDecodedAuthUserResponse = {
  user: Pick<TLoginResponse, "user">;
};
