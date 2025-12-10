function safeMatch(text, regex) {
  const m = text.match(regex);
  return m && m[1] ? m[1].trim() : null;
}

function normalizeEstimated(raw) {
  if (!raw) return null;
  const cleaned = raw.replace(/[^\d\.]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function processFNOLFromText(text) {
  const t = text || "";

  const policyNumber = safeMatch(t, /POLICY\s*NUMBER[:\s\-]*([A-Za-z0-9\-\/]+)/i) ||
                       safeMatch(t, /Policy\s*Number[:\s\-]*([A-Za-z0-9\-\/]+)/i);

  const policyholderName = safeMatch(t, /NAMED\s*INSURED[:\s\-]*([A-Za-z0-9 ,.'\-&]+)/i) ||
                           safeMatch(t, /NAME\s*OF\s*INSURED[:\s\-]*([A-Za-z0-9 ,.'\-&]+)/i);

  const incidentDate = safeMatch(t, /DATE\s*OF\s*LOSS[:\s\-]*([0-9\/\-\.\s]+)/i) ||
                       safeMatch(t, /DATE\s*\(MM\/DD\/YYYY\)[:\s\-]*([0-9\/\-\.\s]+)/i);

  const incidentTime = safeMatch(t, /TIME\s*OF\s*LOSS[:\s\-]*([0-9:\sAPMapm]+)/i) ||
                       safeMatch(t, /TIME[:\s\-]*([0-9:\sAPMapm]+)/i);

  const incidentLocation = safeMatch(t, /LOCATION\s*OF\s*LOSS[:\s\-]*([A-Za-z0-9 ,.'#\-&\/]+)/i) ||
                           safeMatch(t, /LOCATION[:\s\-]*([A-Za-z0-9 ,.'#\-&\/]+)/i);

  const incidentDescription = safeMatch(t, /DESCRIPTION\s*OF\s*ACCIDENT[:\s\-]*([\s\S]{10,600})/i) ||
                              safeMatch(t, /DESCRIPTION[:\s\-]*([\s\S]{10,600})/i) ||
                              safeMatch(t, /DESCRIBE\s*WHAT\s*HAPPENED[:\s\-]*([\s\S]{10,600})/i) ||
                              (t.length > 0 ? t.substring(0, 600) : null);

  const claimant = safeMatch(t, /REPORTED\s*BY[:\s\-]*([A-Za-z0-9 ,.'\-&]+)/i) ||
                   safeMatch(t, /CLAIMANT[:\s\-]*([A-Za-z0-9 ,.'\-&]+)/i);

  const contactDetails = safeMatch(t, /PHONE[:\s\-]*([0-9\-\(\)\s]+)/i) ||
                         safeMatch(t, /CONTACT[:\s\-]*([0-9\-\(\)\s]+)/i);

  const assetType = safeMatch(t, /TYPE[:\s\-]*([A-Za-z0-9 ]{2,30})/i) || safeMatch(t, /DESCRIPTION\s*OF\s*PROPERTY[:\s\-]*([\s\S]{3,100})/i);
  const assetId = safeMatch(t, /V\.?I\.?N\.?[:\s\-]*([A-Za-z0-9\-]+)/i) || safeMatch(t, /VIN[:\s\-]*([A-Za-z0-9\-]+)/i);

  const estRaw = safeMatch(t, /ESTIMATE\s*AMOUNT[:\s\-]*([\$0-9,.\s]+)/i) ||
                 safeMatch(t, /ESTIMATED\s*DAMAGE[:\s\-]*([\$0-9,.\s]+)/i) ||
                 safeMatch(t, /ESTIMATE[:\s\-]*([\$0-9,.\s]+)/i);

  const estimatedDamage = normalizeEstimated(estRaw);

  const claimType = safeMatch(t, /CLAIM\s*TYPE[:\s\-]*([A-Za-z ]{3,30})/i) ||
                    safeMatch(t, /TYPE\s*OF\s*LOSS[:\s\-]*([A-Za-z ]{3,30})/i) || null;

  // attachments and initialEstimate placeholders
  const attachments = ["PDF uploaded"];
  const initialEstimate = estimatedDamage || null;

  // return a candidate object compatible with extractFields()
  return {
    policyNumber,
    policyholderName,
    effectiveDates: null,
    incidentDate,
    incidentTime,
    incidentLocation,
    incidentDescription,
    claimant,
    thirdParties: null,
    contactDetails,
    assetType,
    assetId,
    estimatedDamage,
    claimType,
    attachments,
    initialEstimate,
    _rawText: text ? text.substring(0, 8000) : null
  };
}

module.exports = { processFNOLFromText };
