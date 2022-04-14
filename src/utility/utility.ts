// return a shuffled array
export function shuffle(array: any[]) {
  return array.sort(() => 0.5 - Math.random());
}

const headers = new Headers();
headers.append("Origin", "http://localhost:3000");
headers.append("Access-Control-Allow-Origin", "*");

export const tryFetch = async <T>(url: string, init?: RequestInit): Promise<T> => {
  try {
    const response = await fetch(url, { headers, ...init });
    return (await response.json()).data;
  } catch (error) {
    const err = error as Error;
    throw new Error(err.message);
  }
};
