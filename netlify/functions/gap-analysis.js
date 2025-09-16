const headers = { "Content-Type": "application/json" };
exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, headers, body: JSON.stringify({ ok:false, error:"Use POST" }) };
    }
    const body = JSON.parse(event.body || "{}");
    const fc = body.funnelContent || {};
    const stages = ["discover","resonate","envision","trust","authority"];
    const counts = stages.map(s => ({ stage:s, count:(fc[s]||[]).length }));
    const weakest = counts.reduce((a,b)=> a.count<=b.count ? a : b, counts[0]);
    const suggestions = [
      `Add 2–3 assets to **${weakest.stage}** to balance the funnel.`,
      "Ensure each stage has at least one lead-in and one call-to-action."
    ];
    return { statusCode: 200, headers, body: JSON.stringify({ ok:true, counts, suggestions }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ ok:false, error: e.message }) };
  }
};
