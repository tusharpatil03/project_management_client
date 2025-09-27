let token: string | null = null;

export const setToken = (t: string | null) => {
  token = t;
};

export const getToken = (): string | null => token;

export default { setToken, getToken };
