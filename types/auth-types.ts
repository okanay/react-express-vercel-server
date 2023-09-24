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
  firstName: string;
  lastName: string;
  email: string;
  image: string;
};

export type TAuthUser = {
  user: Omit<TUser, "hashPassword">;
  profile?: Omit<TUserProfile, "id">;
};

export type TDecodedAuthUser = {
  user: TAuthUser;
} & TJwtUnionExpire;

export type TJwtUnionExpire = {
  iat: number;
  exp: number;
  aud: string;
};

export type TLoginResponse = {
  token: string;
  user: TAuthUser;
};

export type TDecodedAuthUserResponse = {
  user: Pick<TLoginResponse, "user">;
};
