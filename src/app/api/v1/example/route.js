export async function GET(request) {
  return new Response(
    JSON.stringify({ message: "Example data retrieved successfully", data: [
        { id: 1, name: "Example 1" },
        { id: 2, name: "Example 2" },
        { id: 3, name: "Example 3" },
    ] }),
    {
      headers: { "Content-Type": "application/json" },
      status: 200,
    }
  );
}
