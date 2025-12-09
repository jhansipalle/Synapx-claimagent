function classifyClaim(fields) {
  const desc = fields.incidentDescription?.toLowerCase() || "";
  const type = fields.claimType?.toLowerCase() || "";

  if (type.includes("injury") || desc.includes("injury")) return "Injury";
  if (type.includes("fire") || desc.includes("fire")) return "Fire";
  if (type.includes("theft") || desc.includes("stolen")) return "Theft";
  if (type.includes("collision") || desc.includes("accident")) return "Auto Accident";

  return "General";
}

module.exports = { classifyClaim };
