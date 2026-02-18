async function fetchJSON<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error("Error fetching JSON:", error);
    throw error;
  }
}

export { fetchJSON };
