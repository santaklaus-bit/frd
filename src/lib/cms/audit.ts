import "server-only";

export function extractClientInfo(request?: Request | null) {
  if (!request) {
    return { ip: "127.0.0.1", device: "Serveur local" };
  }
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfIp = request.headers.get("cf-connecting-ip");
  const rawIp =
    cfIp ||
    (forwarded ? forwarded.split(",")[0].trim() : realIp || "127.0.0.1");
  const ip =
    rawIp === "::1" || rawIp === "::ffff:127.0.0.1" ? "127.0.0.1" : rawIp;

  const ua = request.headers.get("user-agent") || "";

  // OS detection
  let os = "Desktop";
  if (/macintosh|mac os x/i.test(ua)) os = "macOS";
  else if (/windows nt 10/i.test(ua)) os = "Windows 10/11";
  else if (/windows/i.test(ua)) os = "Windows";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/linux/i.test(ua)) os = "Linux";

  // Browser detection
  let browser = "Navigateur";
  if (/edg\//i.test(ua)) browser = "Edge";
  else if (/chrome|crios/i.test(ua) && !/opr|opera/i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/opr|opera/i.test(ua)) browser = "Opera";

  return {
    ip,
    device: `${os} · ${browser}`,
  };
}
