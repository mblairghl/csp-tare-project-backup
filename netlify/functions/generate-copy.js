const headers = { "Content-Type": "application/json" };
exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, headers, body: JSON.stringify({ ok:false, error:"Use POST" }) };
    }
    const body = JSON.parse(event.body || "{}");
    const funnelContent = body.funnelContent || {};
    const persona = body.persona || "Expert";
    const tone = body.tone || "confident";

    const prompt = `You are a senior marketing strategist.
Persona: ${persona}
Tone: ${tone}

Generate concise, persuasive marketing copy grouped by funnel stage.
Return Markdown with headings for each stage (Discover, Resonate, Envision, Trust, Authority) and 2-4 bullets per stage when possible.
Here is the funnel content as JSON:
${JSON.stringify(funnelContent, null, 2)}`;

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });
    if (!r.ok) {
      const errText = await r.text();
      return { statusCode: 502, headers, body: JSON.stringify({ ok:false, error: errText }) };
    }
    const data = await r.json();
    const copy = data?.choices?.[0]?.message?.content || "No output.";
    return { statusCode: 200, headers, body: JSON.stringify({ ok:true, copy }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ ok:false, error: e.message }) };
  }
};
