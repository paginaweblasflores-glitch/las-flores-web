import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(
  () =>
    new Response(JSON.stringify({ error: "Este endpoint ya no está disponible" }), {
      status: 410,
      headers: { "Content-Type": "application/json" },
    }),
);
